## 1. Setup and Infrastructure

- [x] 1.1 Create `src/core/templates/workflows/validate.ts` module file
- [x] 1.2 Add validate skill export to `src/core/templates/skill-templates.ts`
- [x] 1.3 Add validate skill to profile configurations (standard profiles)
- [x] 1.4 Add validate to skill tracking constants (if applicable)

## 2. Core Template Implementation

- [x] 2.1 Implement `getValidateSkillTemplate()` function with SKILL.md content
- [x] 2.2 Implement `getOpsxValidateCommandTemplate()` function with command prompt
- [x] 2.3 Add spec selection logic (explicit name or interactive prompt)
- [x] 2.4 Implement spec discovery from `openspec/specs/` directory
- [x] 2.5 Add error handling for non-existent specs with helpful suggestions
- [x] 2.6 Add graceful handling for empty `openspec/specs/` directory

## 3. Validation Logic

- [x] 3.1 Implement requirement implementation verification using keyword search
- [x] 3.2 Implement scenario coverage checking for test existence
- [x] 3.3 Add confidence level calculation for requirement implementation
- [x] 3.4 Implement divergence detection (code exists but doesn't match spec)
- [x] 3.5 Use cross-platform path handling (path.join/path.resolve) for all file operations

## 4. Severity and Reporting

- [x] 4.1 Implement severity mapping (CRITICAL for missing, WARNING for divergence, SUGGESTION for minor issues)
- [x] 4.2 Create validation report format with prioritized issues
- [x] 4.3 Add change context detection (active changes in `openspec/changes/`)
- [x] 4.4 Add recent archive detection (7-day window in `openspec/changes/archive/`)
- [x] 4.5 Display context notes and suggest `/opsx:verify` when relevant changes exist
- [x] 4.6 Add clear help text distinguishing validate from verify

## 5. Testing

- [x] 5.1 Write unit tests for validate template generation
- [x] 5.2 Write integration test for skill generation with `openspec update`
- [x] 5.3 Create E2E test running `/opsx:validate` against test spec
- [x] 5.4 Add Windows CI verification for cross-platform path handling
- [x] 5.5 Test interactive spec selection with multiple specs
- [x] 5.6 Test error cases (non-existent spec, empty directory)

## 6. Documentation

- [x] 6.1 Add validate skill documentation to `docs/opsx.md`
- [x] 6.2 Add validate workflow to `docs/workflows.md`
- [x] 6.3 Document distinction between validate and verify in both files
- [x] 6.4 Update README or getting-started if validate is part of standard workflow
