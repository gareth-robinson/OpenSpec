## ADDED Requirements

### Requirement: Validate implementation against main specs
The system SHALL provide a `/opsx:validate` command that verifies current implementation correctness against specs in `openspec/specs/`.

#### Scenario: Validate specific spec by name
- **WHEN** user runs `/opsx:validate <spec-name>` with an existing spec name
- **THEN** system analyzes implementation of that spec and reports validation results

#### Scenario: Interactive spec selection
- **WHEN** user runs `/opsx:validate` without specifying a spec name
- **THEN** system presents available specs from `openspec/specs/` for user to select

#### Scenario: Handle non-existent spec
- **WHEN** user runs `/opsx:validate <spec-name>` with a spec that doesn't exist
- **THEN** system reports that the spec was not found and suggests available specs

### Requirement: Verify requirement implementation
The system SHALL check that each requirement in the spec has corresponding implementation in the codebase.

#### Scenario: Requirement is implemented
- **WHEN** validating a requirement that has corresponding code
- **THEN** system marks the requirement as implemented with confidence level

#### Scenario: Requirement is missing implementation
- **WHEN** validating a requirement with no corresponding code found
- **THEN** system reports a CRITICAL issue indicating missing implementation

#### Scenario: Requirement implementation diverges
- **WHEN** validating a requirement where code exists but behavior doesn't match spec
- **THEN** system reports a WARNING issue indicating divergence

### Requirement: Verify scenario coverage
The system SHALL check that scenarios defined in specs have test coverage in the codebase.

#### Scenario: Scenario has test coverage
- **WHEN** validating a scenario that has corresponding tests
- **THEN** system marks the scenario as covered

#### Scenario: Scenario lacks test coverage
- **WHEN** validating a scenario with no corresponding tests found
- **THEN** system reports a SUGGESTION issue indicating missing tests

### Requirement: Report issues with severity levels
The system SHALL categorize validation issues into CRITICAL, WARNING, and SUGGESTION severity levels.

#### Scenario: Critical issue for missing implementation
- **WHEN** a requirement has no implementation found
- **THEN** system reports it as CRITICAL severity with explanation

#### Scenario: Warning for divergent implementation
- **WHEN** implementation exists but doesn't match spec behavior
- **THEN** system reports it as WARNING severity with details

#### Scenario: Suggestion for minor improvements
- **WHEN** minor inconsistencies or missing tests are detected
- **THEN** system reports them as SUGGESTION severity

### Requirement: Show change context
The system SHALL display relevant change context when validating a spec that has active changes or recent archives.

#### Scenario: Active change modifies validated spec
- **WHEN** validating a spec that has an active change in `openspec/changes/` with delta specs
- **THEN** system displays context note about the active change and suggests running `/opsx:verify` on it

#### Scenario: Recent archive modified validated spec
- **WHEN** validating a spec that was modified in an archived change within 7 days
- **THEN** system displays context note about the recent archive

#### Scenario: No related changes
- **WHEN** validating a spec with no active changes or recent archives
- **THEN** system validates without displaying change context

### Requirement: Handle empty spec directory gracefully
The system SHALL handle the case when `openspec/specs/` is empty without errors.

#### Scenario: No specs available
- **WHEN** user runs `/opsx:validate` and `openspec/specs/` directory is empty
- **THEN** system reports that no specs are available to validate

### Requirement: Generate validate skill and command templates
The system SHALL generate `/opsx:validate` skill and command files when users run `openspec update`.

#### Scenario: Skill generation
- **WHEN** user runs `openspec update` with a profile that includes validate
- **THEN** system creates `.github/skills/openspec-validate-change/SKILL.md` (or appropriate path based on config)

#### Scenario: Command generation
- **WHEN** user runs `openspec update` with experimental setup enabled
- **THEN** system creates `.github/commands/opsx/validate.md` (or appropriate path based on config)

### Requirement: Cross-platform path handling
The system SHALL handle file paths correctly on Windows, macOS, and Linux when accessing specs and generating artifacts.

#### Scenario: Windows path handling
- **WHEN** validating specs on Windows
- **THEN** system uses `path.join()` or `path.resolve()` to construct paths correctly

#### Scenario: Unix path handling
- **WHEN** validating specs on macOS or Linux
- **THEN** system uses `path.join()` or `path.resolve()` to construct paths correctly

### Requirement: Distinguish from verify command
The system SHALL clearly distinguish `/opsx:validate` from `/opsx:verify` in documentation and help text.

#### Scenario: Help text differentiation
- **WHEN** user views help or documentation for validate
- **THEN** system clearly explains validate checks main specs while verify checks change artifacts

#### Scenario: Complementary workflow
- **WHEN** user needs to understand when to use validate vs verify
- **THEN** documentation explains validate is for current state, verify is for change validation before archive
