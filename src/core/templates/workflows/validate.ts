/**
 * Skill Template Workflow Module: Validate
 *
 * Provides templates for validating implementation against main specs
 * in openspec/specs/ rather than change-specific artifacts.
 */
import type { SkillTemplate, CommandTemplate } from '../types.js';

export function getValidateSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-validate-change',
    description: 'Validate implementation against main specs. Use when the user wants to check if current codebase satisfies spec requirements.',
    instructions: `Validate implementation correctness against main specs in \`openspec/specs/\`.

**Input**: Optionally specify a spec name. If omitted, prompt for interactive selection from available specs.

**Steps**

1. **Select the spec**

   If a spec name is provided, use it. Otherwise:
   - Run \`openspec spec list --json\` to discover available specs
   - Use the **AskUserQuestion tool** to let the user select a spec
   - Present specs grouped by category/subdirectory if applicable
   - **IMPORTANT**: Do NOT guess or auto-select. Always let the user choose.

2. **Verify spec exists**

   Check if the spec directory exists at \`openspec/specs/<spec-name>/\`.
   - If not found: Report "Spec '<spec-name>' not found" and suggest available specs
   - If \`openspec/specs/\` is empty: Report "No specs available to validate"

3. **Load spec files**

   Read spec files from \`openspec/specs/<spec-name>/\`:
   - Primary spec: \`openspec/specs/<spec-name>/spec.md\`
   - Additional specs: Any \`*.md\` files in subdirectories
   - Parse requirements (marked with "### Requirement:")
   - Parse scenarios (marked with "#### Scenario:")

4. **Check for change context**

   Look for active or recent changes related to this spec:
   - **Active changes**: Search \`openspec/changes/\` for delta specs matching this spec name
   - **Recent archives**: Search \`openspec/changes/archive/\` for archives within 7 days that modified this spec
   - If found: Display context note about related change(s)
   - Suggest: "Run \`/opsx:verify <change-name>\` to validate the pending change"

5. **Verify Correctness - Requirement Implementation**

   For each requirement in the main spec:
   - Extract key terms and functionality from requirement description
   - Search codebase for implementation evidence:
     - Use semantic search or grep with requirement keywords
     - Look in \`src/\`, \`lib/\`, relevant source directories
     - Check for related functions, classes, or modules
   - Assess confidence: HIGH (clear match), MEDIUM (likely match), LOW (unclear)
   - **If no implementation found** (confidence: NONE):
     - Add **CRITICAL** issue: "Missing implementation for requirement: <requirement name>"
     - Recommendation: "Implement requirement: <description>"
   - **If implementation exists but diverges** (code doesn't match described behavior):
     - Add **WARNING** issue: "Implementation may diverge from spec: <details>"
     - Recommendation: "Review <file>:<lines> against requirement"
   - If implementation found and matches: Mark as implemented ✓

6. **Verify Correctness - Scenario Coverage**

   For each scenario in the main spec:
   - Extract scenario conditions and expected behavior
   - Search for test coverage:
     - Look in \`test/\`, \`__tests__/\`, \`*.test.*\`, \`*.spec.*\` files
     - Search for test names matching scenario description
     - Check if scenario keywords appear in test files
   - **If no test coverage found**:
     - Add **SUGGESTION** issue: "Scenario not covered by tests: <scenario name>"
     - Recommendation: "Add test for scenario: <description>"
   - If tests found: Mark as covered ✓

7. **Generate Validation Report**

   **Summary**:
   \`\`\`
   ## Validation Report: <spec-name>

   ### Summary
   | Dimension    | Status                    |
   |--------------|---------------------------|
   | Requirements | X/Y implemented           |
   | Scenarios    | M/N covered by tests      |
   \`\`\`

   **Change Context** (if applicable):
   - Active change: <change-name> modifies this spec (run \`/opsx:verify <change-name>\`)
   - Recent archive: <change-name> updated this spec N days ago

   **Issues by Priority**:

   1. **CRITICAL** (Missing implementations):
      - Each with specific requirement and recommendation
      - Example: "Missing implementation for requirement: Export CSV data"

   2. **WARNING** (Implementation divergence):
      - Each with file references and recommendation
      - Example: "Divergence in user-authentication: See src/auth.ts:45"

   3. **SUGGESTION** (Test coverage gaps):
      - Each with scenario description
      - Example: "Add test for scenario: Handle invalid CSV format"

   **Final Assessment**:
   - If CRITICAL issues: "X critical issue(s) found. Implementation incomplete."
   - If only warnings: "No critical issues. Y warning(s) require review."
   - If all clear: "All requirements implemented, N/M scenarios covered."

**Validation Heuristics**

- **Requirement Search**: Use keyword matching with reasonable confidence threshold
  - Don't require perfect certainty
  - Indicate confidence level (HIGH/MEDIUM/LOW/NONE)
  - Mark NONE as CRITICAL, LOW as potential WARNING
- **Scenario Coverage**: Look for test file existence and keyword matches
  - Tests in standard test directories
  - Scenario keywords in test descriptions
  - Mark missing tests as SUGGESTION (not CRITICAL)
- **False Positives**: When uncertain, prefer lower severity
  - SUGGESTION over WARNING
  - WARNING over CRITICAL
- **Actionability**: Every issue needs specific recommendation

**Distinction from /opsx:verify**

This command validates against **main specs** (\`openspec/specs/\`), checking if the current codebase implements living specifications correctly.

\`/opsx:verify\` validates against **change artifacts** (\`openspec/changes/<name>/\`), checking if a specific change implementation matches its proposal, design, specs, and tasks before archiving.

Use \`/opsx:validate\` to check spec compliance. Use \`/opsx:verify\` to validate changes before archiving.

**Cross-Platform**

Always use \`path.join()\` or \`path.resolve()\` for file paths. Never hardcode \`/\` or \`\\\` separators.`,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

export function getOpsxValidateCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Validate',
    description: 'Validate implementation against main specs',
    category: 'Workflow',
    tags: ['workflow', 'validate', 'experimental'],
    content: `Validate implementation correctness against main specs in \`openspec/specs/\`.

**Input**: Optionally specify a spec name after \`/opsx:validate\` (e.g., \`/opsx:validate user-authentication\`). If omitted, prompt for interactive selection from available specs.

**Steps**

1. **Select the spec**

   If a spec name is provided, use it. Otherwise:
   - Run \`openspec spec list --json\` to discover available specs
   - Use the **AskUserQuestion tool** to let the user select a spec
   - Present specs grouped by category/subdirectory if applicable
   - **IMPORTANT**: Do NOT guess or auto-select. Always let the user choose.

2. **Verify spec exists**

   Check if the spec directory exists at \`openspec/specs/<spec-name>/\`.
   - If not found: Report "Spec '<spec-name>' not found" and suggest available specs
   - If \`openspec/specs/\` is empty: Report "No specs available to validate"

3. **Load spec files**

   Read spec files from \`openspec/specs/<spec-name>/\`:
   - Primary spec: \`openspec/specs/<spec-name>/spec.md\`
   - Additional specs: Any \`*.md\` files in subdirectories
   - Parse requirements (marked with "### Requirement:")
   - Parse scenarios (marked with "#### Scenario:")

4. **Check for change context**

   Look for active or recent changes related to this spec:
   - **Active changes**: Search \`openspec/changes/\` for delta specs matching this spec name
   - **Recent archives**: Search \`openspec/changes/archive/\` for archives within 7 days that modified this spec
   - If found: Display context note about related change(s)
   - Suggest: "Run \`/opsx:verify <change-name>\` to validate the pending change"

5. **Verify Correctness - Requirement Implementation**

   For each requirement in the main spec:
   - Extract key terms and functionality from requirement description
   - Search codebase for implementation evidence:
     - Use semantic search or grep with requirement keywords
     - Look in \`src/\`, \`lib/\`, relevant source directories
     - Check for related functions, classes, or modules
   - Assess confidence: HIGH (clear match), MEDIUM (likely match), LOW (unclear)
   - **If no implementation found** (confidence: NONE):
     - Add **CRITICAL** issue: "Missing implementation for requirement: <requirement name>"
     - Recommendation: "Implement requirement: <description>"
   - **If implementation exists but diverges** (code doesn't match described behavior):
     - Add **WARNING** issue: "Implementation may diverge from spec: <details>"
     - Recommendation: "Review <file>:<lines> against requirement"
   - If implementation found and matches: Mark as implemented ✓

6. **Verify Correctness - Scenario Coverage**

   For each scenario in the main spec:
   - Extract scenario conditions and expected behavior
   - Search for test coverage:
     - Look in \`test/\`, \`__tests__/\`, \`*.test.*\`, \`*.spec.*\` files
     - Search for test names matching scenario description
     - Check if scenario keywords appear in test files
   - **If no test coverage found**:
     - Add **SUGGESTION** issue: "Scenario not covered by tests: <scenario name>"
     - Recommendation: "Add test for scenario: <description>"
   - If tests found: Mark as covered ✓

7. **Generate Validation Report**

   **Summary**:
   \`\`\`
   ## Validation Report: <spec-name>

   ### Summary
   | Dimension    | Status                    |
   |--------------|---------------------------|
   | Requirements | X/Y implemented           |
   | Scenarios    | M/N covered by tests      |
   \`\`\`

   **Change Context** (if applicable):
   - Active change: <change-name> modifies this spec (run \`/opsx:verify <change-name>\`)
   - Recent archive: <change-name> updated this spec N days ago

   **Issues by Priority**:

   1. **CRITICAL** (Missing implementations):
      - Each with specific requirement and recommendation
      - Example: "Missing implementation for requirement: Export CSV data"

   2. **WARNING** (Implementation divergence):
      - Each with file references and recommendation
      - Example: "Divergence in user-authentication: See src/auth.ts:45"

   3. **SUGGESTION** (Test coverage gaps):
      - Each with scenario description
      - Example: "Add test for scenario: Handle invalid CSV format"

   **Final Assessment**:
   - If CRITICAL issues: "X critical issue(s) found. Implementation incomplete."
   - If only warnings: "No critical issues. Y warning(s) require review."
   - If all clear: "All requirements implemented, N/M scenarios covered."

**Validation Heuristics**

- **Requirement Search**: Use keyword matching with reasonable confidence threshold
  - Don't require perfect certainty
  - Indicate confidence level (HIGH/MEDIUM/LOW/NONE)
  - Mark NONE as CRITICAL, LOW as potential WARNING
- **Scenario Coverage**: Look for test file existence and keyword matches
  - Tests in standard test directories
  - Scenario keywords in test descriptions
  - Mark missing tests as SUGGESTION (not CRITICAL)
- **False Positives**: When uncertain, prefer lower severity
  - SUGGESTION over WARNING
  - WARNING over CRITICAL
- **Actionability**: Every issue needs specific recommendation

**Distinction from /opsx:verify**

This command validates against **main specs** (\`openspec/specs/\`), checking if the current codebase implements living specifications correctly.

\`/opsx:verify\` validates against **change artifacts** (\`openspec/changes/<name>/\`), checking if a specific change implementation matches its proposal, design, specs, and tasks before archiving.

Use \`/opsx:validate\` to check spec compliance. Use \`/opsx:verify\` to validate changes before archiving.

**Cross-Platform**

Always use \`path.join()\` or \`path.resolve()\` for file paths. Never hardcode \`/\` or \`\\\` separators.`,
  };
}
