# Change: Add /opsx:validate Skill

## Why

The `/opsx:verify` skill validates implementation against change artifacts (proposal, design, specs, tasks) within a specific change directory. However, there's no equivalent for validating whether the current codebase implementation matches the living specs in `openspec/specs/`. This creates a gap where specs can drift from implementation or vice versa, with no easy way to detect divergence.

## What Changes

- Add `/opsx:validate` skill that checks implementation correctness against main specs
- Validate works with spec names from `openspec/specs/` rather than change names
- Focus on correctness verification only (requirement mapping, scenario coverage)
- Provide prioritized issue reporting (CRITICAL, WARNING, SUGGESTION)
- Support interactive spec selection when no spec name provided
- Handle empty spec directory gracefully

## Capabilities

### New Capabilities
- `opsx-validate-skill`: Agent skill for validating implementation against current specs in `openspec/specs/`. Verifies requirements and scenarios are implemented correctly.

### Modified Capabilities
<!-- No existing capabilities are being modified at the requirement level -->

## Impact

**User workflow**:
- Users can run `/opsx:validate <spec-name>` to check implementation against any spec
- Users can run `/opsx:validate` for interactive spec selection
- Complements `/opsx:verify` by focusing on current specs rather than change artifacts

**Affected code**:
- `src/core/templates/skill-templates.ts` - Added 2 new template functions
- `src/commands/artifact-workflow.ts` - Integrated validate into experimental setup
- Generated artifacts: When users run `openspec artifact-experimental-setup`:
  - Creates `.claude/skills/openspec-validate-change/SKILL.md`
  - Creates `.claude/commands/opsx/validate.md`
