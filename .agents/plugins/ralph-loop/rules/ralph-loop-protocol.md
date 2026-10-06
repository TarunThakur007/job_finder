# Ralph Loop Autonomous Iteration Protocol

The Ralph Loop is an autonomous self-evaluating execution cycle. When a task requires reaching a non-negotiable target (e.g. 0 build errors, 100% test pass rate, or clean Lighthouse compliance), the Ralph Loop enforces persistent iterative healing:

## Core Invariants
1. **Never Give Up on First Error**: If a command or build fails, never stop to ask the user what to do if the error message provides enough diagnostic detail to attempt a fix.
2. **Autonomous Cycle**:
   ```
   [Plan Action] ➔ [Apply Mutation] ➔ [Run Verification] ➔ [Inspect Output]
         ▲                                                       │
         └────────────────── (If Failed) ────────────────────────┘
                                 │
                            (If Passed)
                                 ▼
                             [Success]
   ```
3. **Loop Circuit Breaker**:
   - Prevent infinite loops by capping continuous autonomous iterations at 5 cycles per sub-task.
   - If 3 successive attempts produce identical error signatures, break the cycle and solicit user input on the fundamental architectural discrepancy.
4. **Concrete Evidence Required**: A task is never declared finished without fresh, executed command output confirming 0 errors.
