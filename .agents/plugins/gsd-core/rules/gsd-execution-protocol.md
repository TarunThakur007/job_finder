# GSD (Get Shit Done) Core Execution Protocol

The GSD Core protocol enforces high-velocity, milestone-oriented autonomous execution. When this plugin is active, adhere strictly to the four GSD pillars:

## 1. Specification & Boundary Locking
- Never start coding without establishing the exact target state and boundaries.
- Identify external constraints (ports, dependencies, runtime environments) before writing code.
- If an instruction has multiple ambiguities, resolve them upfront; do not proceed with conflicting assumptions.

## 2. Atomic Milestone Decomposition
- Decompose complex requirements into independent, verifiable steps.
- Each milestone must have:
  - Input state
  - Clear mutation (files touched)
  - Observable completion test (terminal command, curl, build, or test runner)

## 3. Fast Execution & Zero Fluff
- Modify only the lines of code necessary to accomplish the milestone.
- Do not leave placeholder comments (`// TODO: implement later` or `// ... rest of code`).
- Avoid unnecessary architectural bloat or premature refactoring outside the task scope.

## 4. Ground-Truth Verification
- Every single milestone must be validated using concrete terminal execution before declaring success:
  - For frontend: `npm run build` or dev server HTTP checks.
  - For backend: `mvn compile`, `mvn test`, or API endpoint verification.
- Never declare a milestone completed based on assumptions; only trust command exit codes and actual system output.
