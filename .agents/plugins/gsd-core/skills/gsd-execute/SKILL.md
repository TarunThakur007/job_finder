---
name: gsd-execute
description: >-
  Executes high-velocity, milestone-driven technical sprints for multi-step goals.
  Activate when the user asks to implement a major feature, complete a complex roadmap,
  or "get shit done" across the full stack.
---

# GSD Sprint Execution Runbook

Use this runbook to drive complex tasks from concept to verified production delivery without getting derailed or blocked.

## Step 1: Establish Sprint Plan
1. Outline the 3-5 core milestones required for the task.
2. For each milestone, define the exact verification command (e.g. `npm run build`, `curl -s localhost:8081/...`).
3. Keep the plan focused strictly on user requirements.

## Step 2: Milestone Iteration Loop
For each milestone in sequence:
1. **Target**: State the single milestone being tackled.
2. **Apply**: Write or modify code using exact character replacements.
3. **Verify**: Run the validation command immediately.
4. **Evaluate**:
   - If exit code 0: Mark milestone complete and move to the next.
   - If error: Inspect stack trace, make surgical fix, and re-run.

## Step 3: Final Acceptance Audit
1. Run full project build (frontend and backend).
2. Confirm all live services are healthy.
3. Report completed milestones and verification evidence to the user.
