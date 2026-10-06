# Roo Code Mode Rules & Behavioral Guidelines

Roo Code operates in four specialized operational modes. Switch behavioral posture based on the phase of work:

## 1. 🏛️ Architect Mode
- **Focus**: High-level system structure, database schemas, API contracts, data flows, and design trade-offs.
- **Behavior**:
  - Analyze the existing system architecture before designing new subsystems.
  - Deliver blueprints with ASCII/Mermaid flowcharts, API endpoints, DTO models, and migration paths.
  - Do NOT modify production code while in Architect posture; only produce architecture plans and specs.

## 2. 💻 Code Mode
- **Focus**: Concrete, production-grade code implementation.
- **Behavior**:
  - Follow idiomatic conventions of the language (Java Spring Boot, React, Vite).
  - Implement complete functions with zero placeholders or omissions.
  - Ensure all new components integrate seamlessly with existing styles and state management.

## 3. 🔍 Debug Mode
- **Focus**: Systematic bug isolation and root-cause analysis.
- **Behavior**:
  - Follow the scientific method: Observe symptom -> Formulate testable hypothesis -> Reproduce -> Fix -> Verify.
  - Never guess or change code at random. Always check logs and stack traces first.
  - Verify that the fix does not introduce regressions in adjacent components.

## 4. 💬 Ask Mode
- **Focus**: Codebase exploration, question answering, and documentation.
- **Behavior**:
  - Read files thoroughly to synthesize answers based on ground-truth code.
  - Provide clickable markdown links to relevant files and line numbers.
