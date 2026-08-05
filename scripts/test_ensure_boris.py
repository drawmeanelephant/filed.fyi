#!/usr/bin/env python3
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENSURE_SCRIPT = os.path.join(PROJECT_ROOT, "scripts", "ensure-boris.sh")
CLEAN_SCRIPT = os.path.join(PROJECT_ROOT, "scripts", "clean-binaries.sh")
VERSION_CONFIG = os.path.join(PROJECT_ROOT, "metadata", "boris-version.json")

with open(VERSION_CONFIG, "r") as f:
    VERSION_DATA = json.load(f)
PINNED_COMMIT = VERSION_DATA["commit"]

def make_executable(path, content="#!/bin/sh\nexit 0\n"):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)
    os.chmod(path, 0o755)

def file_sha256(path):
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()

class TestEnsureBoris(unittest.TestCase):
    def setUp(self):
        self.tmpdir = tempfile.mkdtemp(prefix="test_boris_")
        self.repo_root = os.path.join(self.tmpdir, "filed.fyi")
        os.makedirs(os.path.join(self.repo_root, "bin"), exist_ok=True)
        os.makedirs(os.path.join(self.repo_root, "metadata"), exist_ok=True)
        os.makedirs(os.path.join(self.repo_root, "scripts"), exist_ok=True)
        
        shutil.copy(ENSURE_SCRIPT, os.path.join(self.repo_root, "scripts", "ensure-boris.sh"))
        shutil.copy(CLEAN_SCRIPT, os.path.join(self.repo_root, "scripts", "clean-binaries.sh"))
        shutil.copy(VERSION_CONFIG, os.path.join(self.repo_root, "metadata", "boris-version.json"))
        
        os.chmod(os.path.join(self.repo_root, "scripts", "ensure-boris.sh"), 0o755)
        os.chmod(os.path.join(self.repo_root, "scripts", "clean-binaries.sh"), 0o755)

    def tearDown(self):
        shutil.rmtree(self.tmpdir, ignore_errors=True)

    def run_script(self, script_path, args=None, env_override=None, cwd=None):
        env = os.environ.copy()
        if env_override:
            env.update(env_override)
        cmd = [script_path] + (args or [])
        proc = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=cwd or self.repo_root,
            env=env
        )
        return proc

    def test_explicit_boris_bin(self):
        external_bin = os.path.join(self.tmpdir, "external_boris")
        make_executable(external_bin)
        
        proc = self.run_script(
            os.path.join(self.repo_root, "scripts", "ensure-boris.sh"),
            env_override={"BORIS_BIN": external_bin, "BORIS_AUTO_PROVISION": "0"}
        )
        self.assertEqual(proc.returncode, 0, f"Stderr: {proc.stderr}")
        lines = proc.stdout.strip().splitlines()
        self.assertEqual(len(lines), 1)
        self.assertEqual(lines[0], external_bin)

    def test_existing_valid_bin_boris(self):
        target_bin = os.path.join(self.repo_root, "bin", "boris")
        make_executable(target_bin)
        sha = file_sha256(target_bin)
        
        manifest_data = {
            "binary": target_bin,
            "source": "remote",
            "repository": VERSION_DATA["repository"],
            "branch": VERSION_DATA["branch"],
            "commit": PINNED_COMMIT,
            "zig_version": VERSION_DATA["zig_version"],
            "checksum": sha,
            "built_at": "2026-08-05T00:00:00Z"
        }
        with open(os.path.join(self.repo_root, "bin", "boris.json"), "w") as f:
            json.dump(manifest_data, f)

        proc = self.run_script(
            os.path.join(self.repo_root, "scripts", "ensure-boris.sh"),
            env_override={"BORIS_AUTO_PROVISION": "0"}
        )
        self.assertEqual(proc.returncode, 0, f"Stderr: {proc.stderr}")
        lines = proc.stdout.strip().splitlines()
        self.assertEqual(len(lines), 1)
        self.assertEqual(lines[0], target_bin)

    def test_existing_binary_missing_manifest(self):
        target_bin = os.path.join(self.repo_root, "bin", "boris")
        make_executable(target_bin)

        proc = self.run_script(
            os.path.join(self.repo_root, "scripts", "ensure-boris.sh"),
            env_override={"BORIS_AUTO_PROVISION": "0"}
        )
        self.assertNotEqual(proc.returncode, 0)
        self.assertIn("ensure-boris.sh --provision", proc.stderr)

    def test_existing_binary_mismatched_manifest(self):
        target_bin = os.path.join(self.repo_root, "bin", "boris")
        make_executable(target_bin)
        
        manifest_data = {
            "binary": target_bin,
            "source": "remote",
            "repository": VERSION_DATA["repository"],
            "branch": VERSION_DATA["branch"],
            "commit": "0000000000000000000000000000000000000000", # wrong commit
            "zig_version": VERSION_DATA["zig_version"],
            "checksum": "wrong_checksum",
            "built_at": "2026-08-05T00:00:00Z"
        }
        with open(os.path.join(self.repo_root, "bin", "boris.json"), "w") as f:
            json.dump(manifest_data, f)

        proc = self.run_script(
            os.path.join(self.repo_root, "scripts", "ensure-boris.sh"),
            env_override={"BORIS_AUTO_PROVISION": "0"}
        )
        self.assertNotEqual(proc.returncode, 0)
        self.assertIn("does not match manifest", proc.stderr)

    def test_sibling_prebuilt_binary(self):
        sibling_dir = os.path.join(self.tmpdir, "boris")
        sibling_bin = os.path.join(sibling_dir, "zig-out", "bin", "boris")
        make_executable(sibling_bin)
        
        # Init git repo in sibling
        subprocess.run(["git", "init"], cwd=sibling_dir, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        subprocess.run(["git", "config", "user.name", "Test"], cwd=sibling_dir, check=True)
        subprocess.run(["git", "config", "user.email", "test@test.com"], cwd=sibling_dir, check=True)
        subprocess.run(["git", "commit", "--allow-empty", "-m", "init"], cwd=sibling_dir, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        proc = self.run_script(
            os.path.join(self.repo_root, "scripts", "ensure-boris.sh"),
            env_override={"BORIS_AUTO_PROVISION": "0"}
        )
        self.assertEqual(proc.returncode, 0, f"Stderr: {proc.stderr}")
        target_bin = os.path.join(self.repo_root, "bin", "boris")
        self.assertEqual(proc.stdout.strip(), target_bin)
        self.assertTrue(os.path.exists(os.path.join(self.repo_root, "bin", "boris.json")))

    def test_sibling_source_checkout(self):
        sibling_dir = os.path.join(self.tmpdir, "boris")
        os.makedirs(sibling_dir, exist_ok=True)
        with open(os.path.join(sibling_dir, "build.zig"), "w") as f:
            f.write("// build.zig")

        subprocess.run(["git", "init"], cwd=sibling_dir, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        subprocess.run(["git", "config", "user.name", "Test"], cwd=sibling_dir, check=True)
        subprocess.run(["git", "config", "user.email", "test@test.com"], cwd=sibling_dir, check=True)
        subprocess.run(["git", "commit", "--allow-empty", "-m", "init"], cwd=sibling_dir, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        # Mock zig command
        mock_bin_dir = os.path.join(self.tmpdir, "mock_bin")
        mock_zig = os.path.join(mock_bin_dir, "zig")
        zig_script = f"""#!/bin/sh
if [ "$1" = "build" ]; then
  mkdir -p zig-out/bin
  echo "#!/bin/sh" > zig-out/bin/boris
  echo "echo boris" >> zig-out/bin/boris
  chmod +x zig-out/bin/boris
  exit 0
fi
exit 1
"""
        make_executable(mock_zig, zig_script)

        env_path = f"{mock_bin_dir}:{os.environ.get('PATH', '')}"
        proc = self.run_script(
            os.path.join(self.repo_root, "scripts", "ensure-boris.sh"),
            env_override={"PATH": env_path, "BORIS_AUTO_PROVISION": "0"}
        )
        self.assertEqual(proc.returncode, 0, f"Stderr: {proc.stderr}")
        target_bin = os.path.join(self.repo_root, "bin", "boris")
        self.assertEqual(proc.stdout.strip(), target_bin)
        self.assertTrue(os.path.exists(os.path.join(self.repo_root, "bin", "boris.json")))

    def test_no_binary_auto_provision_disabled(self):
        proc = self.run_script(
            os.path.join(self.repo_root, "scripts", "ensure-boris.sh"),
            env_override={"BORIS_AUTO_PROVISION": "0"}
        )
        self.assertNotEqual(proc.returncode, 0)
        self.assertIn("ERROR: Boris binary is not available", proc.stderr)
        self.assertIn("ensure-boris.sh --provision", proc.stderr)

    def test_mocked_remote_provisioning(self):
        mock_bin_dir = os.path.join(self.tmpdir, "mock_tools")
        os.makedirs(mock_bin_dir, exist_ok=True)
        
        # Mock git
        mock_git = os.path.join(mock_bin_dir, "git")
        git_script = f"""#!/bin/sh
if [ "$1" = "clone" ]; then
  eval target_dir=\\${{#}}
  mkdir -p "$target_dir"
  cd "$target_dir" || exit 1
  /usr/bin/git init >/dev/null 2>&1
  /usr/bin/git config user.name T
  /usr/bin/git config user.email t@t.com
  /usr/bin/git commit --allow-empty -m init >/dev/null 2>&1
  /usr/bin/git checkout -b afterparty >/dev/null 2>&1 || true
  /usr/bin/git commit --allow-empty -m "{PINNED_COMMIT}" >/dev/null 2>&1
  exit 0
fi
if [ "$1" = "checkout" ]; then
  exit 0
fi
if [ "$1" = "-C" ]; then
  if [ "$3" = "rev-parse" ]; then
    echo "{PINNED_COMMIT}"
    exit 0
  fi
fi
exec /usr/bin/git "$@"
"""
        make_executable(mock_git, git_script)

        # Mock zig
        mock_zig = os.path.join(mock_bin_dir, "zig")
        zig_script = """#!/bin/sh
if [ "$1" = "build" ]; then
  mkdir -p zig-out/bin
  echo "#!/bin/sh" > zig-out/bin/boris
  echo "echo boris" >> zig-out/bin/boris
  chmod +x zig-out/bin/boris
  exit 0
fi
exit 0
"""
        make_executable(mock_zig, zig_script)

        env_path = f"{mock_bin_dir}:{os.environ.get('PATH', '')}"
        proc = self.run_script(
            os.path.join(self.repo_root, "scripts", "ensure-boris.sh"),
            args=["--provision"],
            env_override={"PATH": env_path}
        )
        self.assertEqual(proc.returncode, 0, f"Stderr: {proc.stderr}")
        target_bin = os.path.join(self.repo_root, "bin", "boris")
        lines = proc.stdout.strip().splitlines()
        self.assertEqual(len(lines), 1)
        self.assertEqual(lines[0], target_bin)
        
        with open(os.path.join(self.repo_root, "bin", "boris.json")) as f:
            manifest = json.load(f)
        self.assertEqual(manifest["source"], "remote")
        self.assertEqual(manifest["commit"], PINNED_COMMIT)

    def test_checksum_failure(self):
        mock_bin_dir = os.path.join(self.tmpdir, "mock_tools_checksum")
        os.makedirs(mock_bin_dir, exist_ok=True)
        
        # Mock curl that writes corrupted content
        mock_curl = os.path.join(mock_bin_dir, "curl")
        curl_script = """#!/bin/sh
out_file=""
prev=""
for arg in "$@"; do
  if [ "$prev" = "-o" ]; then
    out_file="$arg"
  fi
  prev="$arg"
done
if [ -n "$out_file" ]; then
  echo "corrupted content" > "$out_file"
  exit 0
fi
exit 1
"""
        make_executable(mock_curl, curl_script)

        # Force PATH to NOT have system zig or mock zig so it downloads zig
        env_path = f"{mock_bin_dir}:/usr/bin:/bin"
        proc = self.run_script(
            os.path.join(self.repo_root, "scripts", "ensure-boris.sh"),
            args=["--provision"],
            env_override={"PATH": env_path}
        )
        self.assertNotEqual(proc.returncode, 0)
        self.assertIn("checksum mismatch", proc.stderr)
        
        # Ensure temporary download file was cleaned up
        tools_dir = os.path.join(self.repo_root, ".tools")
        if os.path.exists(tools_dir):
            for item in os.listdir(tools_dir):
                self.assertFalse(item.endswith(".tmp"), f"Temporary file {item} was not cleaned up!")

    def test_cleanup_preserving_unrelated_files(self):
        bin_dir = os.path.join(self.repo_root, "bin")
        make_executable(os.path.join(bin_dir, "boris"))
        make_executable(os.path.join(bin_dir, "boris.json"))
        make_executable(os.path.join(bin_dir, "validate_graph.sh"))
        make_executable(os.path.join(bin_dir, "custom_tool"))

        proc = self.run_script(os.path.join(self.repo_root, "scripts", "clean-binaries.sh"))
        self.assertEqual(proc.returncode, 0, f"Stderr: {proc.stderr}")
        
        self.assertFalse(os.path.exists(os.path.join(bin_dir, "boris")))
        self.assertFalse(os.path.exists(os.path.join(bin_dir, "boris.json")))
        self.assertTrue(os.path.exists(os.path.join(bin_dir, "validate_graph.sh")))
        self.assertTrue(os.path.exists(os.path.join(bin_dir, "custom_tool")))

if __name__ == "__main__":
    unittest.main()
