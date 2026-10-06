---
name: coderabbit-review
description: >-
  Performs an automated CodeRabbit-style code review on git working trees, staged diffs, or recent commits.
  Activate when the user asks to review changes, audit code quality, check for security risks,
  or perform a pull-request review.
---

# CodeRabbit Review Runbook

Use this runbook to deliver actionable, high-signal automated code reviews.

## Step 1: Diff & Change Extraction
1. Check changed files using `git status -s` and inspect diffs with `git diff HEAD`.
2. Map out all modified files across frontend and backend.

## Step 2: Multi-Dimensional Audit
Inspect the changes against the 4 CodeRabbit dimensions:
1. **Security**: Any exposed endpoints, unescaped HTML, or missing auth?
2. **Performance**: Any expensive calculations inside render loops or unindexed queries?
3. **Robustness**: Are errors caught and handled properly?
4. **Clean Code**: Any duplicate logic or dead code?

## Step 3: Deliver Structured Review
Format the review using the standard CodeRabbit template:

```markdown
### 🐇 CodeRabbit Walkthrough & Review Summary

#### High-Level Overview
Brief explanation of what the changeset accomplishes.

#### Key Changes Table
| File | Action | Impact |
| :--- | :--- | :--- |
| `path/to/file` | Modified / Created | Summary of change |

#### Findings & Actionable Recommendations
- 🔴 [CRITICAL]: ...
- 🟡 [WARNING]: ...
- 💡 [SUGGESTION]: ...
- 🟢 [PRAISE]: ...
```
