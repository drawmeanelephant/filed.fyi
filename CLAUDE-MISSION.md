# Claude Mission — Historical Post-Completion Polish Tasks

> This is a retained historical styling brief from before the 2026-08-02
> Filed corpus takeover. The active source, identity, and validation contract
> is documented in `README.md`, `metadata/id-policy.json`, and
> `scripts/filed_ids.py`.

This delegation plan outlines tightly-scoped, isolated styling tasks for Claude (or a subsequent model runner) to polish the new Filed Boris themes at low token/computation cost.

---

## 🎯 Context
The Filed Boris archive themes have been restructured to map cleanly to the Boris static compiler layout slots and visual requirements. All non-functional "cosplay" UI elements have been removed, navigation weight has been reduced using `:has()` selectors, and three honest themes are implemented:
- **Light Theme (`corp-vendor`):** Warm paper & ink typography (Lora serif + Outfit sans-serif).
- **Dark Theme (`google-material`):** Dark microfiche console with amber accents.
- **Pride Theme (`cozy-typepad`):** Celebratory pastel with fixed top rainbow banner.

---

## 🛠️ Polish Scope

Your mission is to perform targeted CSS enhancements inside the theme directories without changing the HTML structure, frontmatter schemas, or content files.

### 📋 Task 1: Style the "Manual Review" and "Amber" States
- **Target:** Starlight migration outputs generate review notes, raw frontmatter warnings, and unresolved references. Style these states cleanly within the pages.
- **Action:** Look for elements matching `.review-card`, `.manual-review`, or draft pages (`[data-status="draft"]`, etc.) and apply a clean, non-alarmist amber treatment:
  - **Light Theme:** Warm honey border (`#d97706`), soft cream-gold background (`#fffbeb`), dark amber text (`#92400e`).
  - **Dark Theme:** Muted gold border (`#b45309`), dark translucent background (`#221606`), bright gold text (`#f59e0b`).
  - **Pride Theme:** Soft rose/amber pastel tint.

### 📋 Task 2: Keyboard Accessibility & Focus Outlines
- **Target:** Ensure keyboard navigation is fully responsive and visible.
- **Action:** Enhance outline rings for focused interactive elements across the stylesheets:
  - Ensure `.skip-link:focus` has a highly visible outline/contrast.
  - Style focus indicators on all links, sidebar navigation items, and children cards:
    - `a:focus-visible` should have a solid 2px outline with an appropriate offset (colored matching the theme's accent color).

### 📋 Task 3: CSS Var Audit & Cleanup
- **Target:** Remove any remaining dead CSS rules from the original themes.
- **Action:** Audit the three CSS files:
  - `themes/corp-vendor/assets/corp-vendor.css`
  - `themes/google-material/assets/material.css`
  - `themes/cozy-typepad/assets/cozy-typepad.css`
  - Safely strip unused utility classes and layout selectors left over from the corporate MSDN or Material 3 frameworks.

---

## 🚫 Out of Scope
- DO NOT add Javascript.
- DO NOT introduce new templates or layout placeholders.
- DO NOT modify the markdown files in the `content/` directory.

---

## 🔬 Validation Command
Verify your changes by running the theme compilation:
```bash
./bin/validate_graph.sh
```
Confirm that compilation completes with exit code `0` and check output in `dist/`.
