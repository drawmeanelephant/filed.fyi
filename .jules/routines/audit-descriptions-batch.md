# Routine: Audit and Improve Descriptions (Batch)

**Goal:** Iteratively add or improve the `description` frontmatter field in `.mdx` records, ensuring they align with the archive's "bureaucratic, cold, and single-sentence" tone, while tracking progress using the `descriptionAudit` tag.

**Trigger:** Manual execution when requested by the user, usually targeting a specific batch size (e.g., 20 files).

## Execution Steps

1. **Identify Target Files:**
   - Run the following command to find the next batch of `.mdx` files missing the `descriptionAudit` tag. Adjust the directory path (e.g., `src/content/docs/aphorisms`) and `-n` value (batch size) as needed based on user request.
     ```bash
     find src/content/docs/aphorisms -type f -name "*.mdx" -exec grep -L "descriptionAudit" {} + | sort | head -n 20 > target_files.txt
     ```

2. **Process Files:**
   - For each file in the batch:
     - Read the file content.
     - Draft a **single-sentence, bureaucratic, and cold** description. If the file is sparse, synthesize a fitting sparse description based on the title, tags, and any available content. Do not invent doctrine. Do not use quotes around the description value.
     - Update the frontmatter:
       - Update or add `description: >-\n  [Your generated description]`
       - Add `descriptionAudit: 'YYYY-MM-DD'` (using today's date).
       - Update `updatedAt: YYYY-MM-DD` (using today's date).
       - Ensure dates are string literals (e.g., `'2026-06-22'`).

3. **Verification:**
   - Ensure you haven't broken the frontmatter structure.
   - Run markdown linting or build checks if appropriate.

4. **Commit:**
   - Create a branch named `jules-description-audit-batch-[number]`.
   - Commit the changes with a clear message: `chore(content): audit and improve descriptions for next [number] [category] mdx files`.

5. **Reporting:**
   - Provide the user with a summary changelog indicating the number of files updated. Include a couple of examples of the improved descriptions in your final message.
