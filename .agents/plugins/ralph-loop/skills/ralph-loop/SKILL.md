---
name: ralph-loop
description: >-
  Runs an autonomous, iterative test-and-repair loop until complete success criteria are achieved.
  Activate when fixing difficult test suites, resolving cascading compilation errors,
  or driving overnight/unattended self-healing tasks.
---

# Ralph Loop Execution Runbook

Use this runbook to execute persistent, self-healing iteration loops on stubborn bugs or multi-file refactors.

## Step 1: Define Target Acceptance Criterion
- Clearly specify the exact success condition:
  - Example: `npm run build` exits 0 with 0 lint warnings.
  - Example: `mvn test` completes with 0 failures and 0 errors.

## Step 2: Establish the Verification Baseline
- Execute the verification command once to capture current failing output and line numbers.

## Step 3: Execute Iteration Cycles
1. **Analyze Failure**: Read the error message, identify file and line number.
2. **Apply Targeted Fix**: Use precise line replacements to resolve the specific error.
3. **Re-Test**: Execute the verification command again.
4. **Evaluate Delta**:
   - Did the error count decrease? If yes, continue to the next error.
   - Did a new error appear? Determine if it is a secondary issue or regression.
5. **Check Circuit Breaker**: If iterations reach 5 without progress, pause and summarize findings.

## Step 4: Verification Seal
- Run full clean build from scratch.
- Confirm target acceptance criteria are 100% satisfied.
