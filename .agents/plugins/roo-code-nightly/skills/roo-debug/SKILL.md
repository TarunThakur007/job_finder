---
name: roo-debug
description: >-
  Systematic root-cause debugging procedure for complex errors, runtime exceptions, and unexpected UI bugs.
  Activate when diagnosing failing tests, broken build pipelines, or anomalous application behavior.
---

# Roo Code Debugging Runbook

Use this runbook to isolate and fix software defects without guesswork.

## Step-by-Step Debugging Protocol

### 1. Symptom & Evidence Collection
- Collect exact log outputs, console errors, HTTP response codes, and stack traces.
- Locate the precise file and line number where the failure originates.

### 2. Hypothesis Formulation
- State a single testable hypothesis explaining why the error occurred.
- Check recent commits or edits (`git diff` or `git log`) to verify what changed prior to the defect.

### 3. Isolation & Reproduction
- Craft a minimal reproduction step (e.g. running a specific unit test, terminal command, or curl request).
- Confirm the reproduction consistently fails under the stated conditions.

### 4. Surgical Remediation
- Make the minimal necessary change to address the root cause.
- Avoid modifying unrelated components or introducing side effects.

### 5. Verification & Regression Testing
- Re-run the reproduction command and confirm clean pass.
- Run the full project test suite or build (`npm run build`, `mvn compile`) to verify zero regressions.
