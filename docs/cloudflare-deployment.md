# Cloudflare Pages Deployment Guide for Filed & Forgotten

This guide outlines the continuous deployment pipeline and setup procedure for hosting the **Filed & Forgotten Archive** (`filed.boris`) on **Cloudflare Pages**.

---

## Architecture & Sustainability Overview

To keep builds reproducible, fast, and fail-safe, the deployment uses a **two-tier architecture**:

1. **Automated CI/CD via GitHub Actions (Primary)**
   - Every push to `main` and pull request triggers `.github/workflows/deploy.yml`.
   - The workflow compiles the pinned `boris` binary with Zig 0.16.0, executes the graph validation gate (`./bin/validate_graph.sh`), and audits output links/IDs.
   - If (and only if) all verification checks pass, the compiled static site (`dist/cantilever/`) is deployed directly to Cloudflare Pages using Wrangler.

2. **Standalone Build Script (Backup / Native Cloudflare)**
   - `scripts/cloudflare-build.sh` is provided for running builds directly within Cloudflare Pages build containers or standard Linux environments. It handles downloading Zig, cloning Boris, running the validation gate, and emitting static HTML.

---

## One-Time Setup Instructions

### Step 1: Create a Cloudflare Pages Project

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages**.
3. Choose **Create Assets Project** (or **Upload assets** / CLI deploy):
   - **Project Name**: `filed-boris` (or your preferred name, matching `name` in `wrangler.jsonc`).
4. Click **Create Project**. (No manual web upload needed—GitHub Actions will deploy to this project).

---

### Step 2: Configure Secrets in GitHub

To allow GitHub Actions to deploy to Cloudflare Pages on your behalf:

1. **Get Cloudflare Account ID**:
   - In Cloudflare Dashboard, select your account or domain.
   - Copy your **Account ID** from the right sidebar of the Overview page.

2. **Create Cloudflare API Token**:
   - Go to **My Profile** > **API Tokens** > **Create Token**.
   - Select the **Cloudflare Pages** template (or custom token with `Account -> Cloudflare Pages -> Edit` permission).
   - Copy the generated API token.

3. **Add Secrets to GitHub Repository**:
   - In your GitHub repo (`drawmeanelephant/filed.boris`), go to **Settings** > **Secrets and variables** > **Actions**.
   - Add **New repository secret**:
     - `CLOUDFLARE_ACCOUNT_ID`: `<your-account-id>`
     - `CLOUDFLARE_API_TOKEN`: `<your-api-token>`

---

### Step 3: Add Custom Domain (e.g., `filed.fyi`)

1. In Cloudflare Dashboard, go to **Workers & Pages** > **filed-boris**.
2. Click **Custom domains** tab > **Set up a custom domain**.
3. Enter `filed.fyi` (or subdomains like `archive.filed.fyi`).
4. Cloudflare will automatically configure CNAME records and SSL/TLS certificates.

---

## Testing & Local Operations

### Preview Local Site Build

To run the exact build that Cloudflare Pages will serve:

```bash
./preview.sh
```

### Run Full Verification Gate Locally

Before pushing changes to `main`:

```bash
./bin/validate_graph.sh
```

### Manual Deploy via Wrangler CLI (Optional)

If you need to deploy manually from your local command line:

```bash
# 1. Build the site
./scripts/filed-build.sh

# 2. Deploy with Wrangler
npx wrangler pages deploy dist/cantilever --project-name=filed-boris
```

---

## Troubleshooting & Maintenance

- **Build Failures on Invalid IDs or Links**: The deployment pipeline will fail and block deployment if `validate_graph.sh` finds unmapped IDs or broken Markdown links. Check workflow logs in GitHub Actions for details.
- **Compiler Version Pinning**: The compiler version is pinned in `.github/workflows/deploy.yml` (`BORIS_COMMIT`). To update the compiler, update `BORIS_COMMIT` in both `ci.yml` and `deploy.yml`.
