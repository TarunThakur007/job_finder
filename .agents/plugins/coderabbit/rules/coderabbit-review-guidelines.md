# CodeRabbit Automated Review Guidelines

When reviewing code, pull requests, or proposed modifications under the CodeRabbit plugin, grade all changes against these strict criteria:

## Review Dimensions

1. **Security & Vulnerability Screening**
   - Check for SQL injection, Command Injection, SSRF, XSS, and unvalidated user input.
   - Verify secrets, API tokens, and credentials are never hardcoded or checked into VCS.
   - Check authorization guards on endpoints (`@PreAuthorize`, role checks).

2. **Performance & Resource Consumption**
   - Avoid N+1 queries in JPA/Hibernate relationships.
   - Guard against excessive re-renders in React (`useMemo`, `useCallback`, dependency arrays).
   - Ensure proper resource closing (`try-with-resources`, stream termination).

3. **Error Handling & Resilience**
   - Verify proper exception handling rather than empty catch blocks (`catch (Exception e) {}`).
   - Ensure meaningful error messages and correct HTTP response codes (400 vs 404 vs 500).

4. **Style, Readability & Maintainability**
   - Enforce clean architecture and single-responsibility principles.
   - Identify dead code, unused imports, and redundant state variables.

## Feedback Categorization
Tag each review finding with its appropriate severity:
- 🔴 **[CRITICAL]**: Security risk, memory leak, or broken functionality that must be fixed.
- 🟡 **[WARNING]**: Performance inefficiency, missing error handling, or anti-pattern.
- 💡 **[SUGGESTION]**: Code clarity, modern syntax improvement, or minor optimization.
- 🟢 **[PRAISE]**: Well-crafted implementation or clever optimization.
