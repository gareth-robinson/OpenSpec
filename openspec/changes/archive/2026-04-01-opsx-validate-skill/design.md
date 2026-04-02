## Context

The OpenSpec codebase currently has `/opsx:verify` which validates implementation against change artifacts (delta specs in `openspec/changes/<name>/`). However, there's no equivalent for validating the current implementation against the main specs in `openspec/specs/`. This is needed for:

- **Drift detection**: Catch when implementation diverges from living specs
- **Compliance checking**: Ensure current codebase satisfies all spec requirements
- **Spec-first validation**: Verify specs are implemented before creating changes

The existing skill template system uses a workflow-focused module pattern where each workflow (new, continue, apply, verify, etc.) has its own module in `src/core/templates/workflows/`. Skills are generated from these templates when users run `openspec update`.

**Current State**:
- Verify skill exists at `src/core/templates/workflows/verify-change.ts`
- Archive skill exists at `src/core/templates/workflows/archive-change.ts`
- Skills are registered in `src/core/templates/skill-templates.ts`
- Generated skills live in folders like `.github/skills/` or `.claude/skills/` depending on config

**Constraints**:
- Cross-platform support (Windows, macOS, Linux) using Node.js path APIs
- TypeScript, ESM modules, pnpm
- Must integrate with existing skill generation infrastructure
- Skills must be self-contained with all instructions in the generated SKILL.md

## Goals / Non-Goals

**Goals:**
- Create `/opsx:validate` skill that checks implementation against main specs
- Support spec selection (explicit name or interactive)
- Verify correctness only: requirement implementation and scenario coverage
- Provide actionable, prioritized validation reports (CRITICAL, WARNING, INFO)
- Clearly distinguish validate from verify to avoid user confusion
- Follow existing skill template patterns for consistency

**Non-Goals:**
- Not checking completeness verification (no tasks.md in main specs)
- Not checking coherence verification (no design.md in main specs)
- Not replacing `/opsx:verify` - these are complementary tools
- Not implementing automated fixing of validation issues
- Not creating a new spec format or changing existing spec structure
- Not validating spec format or structure (that's `openspec validate`

## Decisions

### Decision 1: Separate Module Following Workflow Pattern

**Choice**: Create `src/core/templates/workflows/validate.ts` with `getValidateSkillTemplate()` and `getOpsxValidateCommandTemplate()` functions.

**Rationale**:
- Consistent with existing workflow module pattern (verify, archive, sync, etc.)
- Keeps validation logic isolated and maintainable
- Follows "one workflow, one module" convention
- Makes it easy to update validation behavior without affecting other workflows

**Alternatives Considered**:
- Reuse verify-change.ts: Rejected - different enough to warrant separation
- Add to archive-change.ts: Rejected - different purposes and lifecycle stages

### Decision 2: Spec-Based Interface (Not Change-Based)

**Choice**: Accept spec names from `openspec/specs/` as input, not change names.

**Rationale**:
- Validates current state, not change deltas
- Maps to user mental model: "Is spec X implemented?"
- Distinguishes clearly from `/opsx:verify <change-name>`
- Supports validating specs that have no active changes

**Interface**:
- `/opsx:validate <spec-name>` - Validate specific spec
- `/opsx:validate` - Interactive spec selection

**Alternatives Considered**:
- Use change names and infer specs: Rejected - confusing and limiting
- Use file paths: Rejected - not user-friendly

### Decision 3: Verification Scope - Correctness Only
Only verify requirement implementation and scenario coverage.

**Rationale**:
- Main specs don't have tasks (no completeness to check)
- Main specs don't have design docs (no coherence to check)
- Correctness is what matters: "Does the code do what the spec says?"

**Alternatives considered**:
- Add synthetic completeness (count requirements as tasks) - Rejected: Misleading parallel
- Check code quality as coherence - Rejected: Out of scope for spec validation

**Implementation**:
- Requirement implementation mapping (same as verify)
- Scenario coverage check (same as verify)
- Skip completeness and coherence sections entirely
- Report simplified to focus on correctness dimension

### Decision 4: Issue Severity Mapping
Use same severity levels as verify but adjusted for spec context.

**Severity mapping**:
- **CRITICAL**: Missing implementation for a requirement (spec says it should exist, but no code found)
- **WARNING**: Implementation diverges from spec (code exists but doesn't match described behavior)
- **SUGGESTION**: Minor inconsistencies, missing tests, pattern deviations

**Rationale**: 
- Missing implementation is critical because spec becomes misleading documentation
- Divergence is a warning because either code or spec may need updating
- Everything else is a suggestion for improvement

**Alternatives considered**:
- All issues as warnings - Rejected: Loses urgency for missing implementations
- No critical level - Rejected: Users need clear signal about documentation accuracy

### Decision 5: Change Context Integration

**Choice**: When validating a spec, show if active changes or recent archives modify that spec.

**Rationale**:
- Helps users understand why issues might exist (pending change)
- Connects validate and verify workflows naturally
- Provides actionable next steps (run verify on related change)

**Integration**:
- Check `openspec/changes/` for active changes with delta specs
- Check `openspec/changes/archive/` for recent archives (7 days)
- Display context note in validation report
- Suggest using `/opsx:verify` for active changes

**Alternatives Considered**:
- No integration: Rejected - misses valuable context
- Full change tracking: Rejected - out of scope

## Risks / Trade-offs

**[Risk] False positives in coverage detection**
- Heuristic search may report implementation exists when it doesn't
- **Mitigation**: Use multiple keywords, require reasonable confidence threshold, clearly indicate "likely" vs "confirmed"

**[Risk] Performance with large codebases**
- Searching entire codebase for every requirement could be slow
- **Mitigation**: Scope searches to relevant directories when possible, use targeted keyword searches

**[Risk] Spec format changes**
- Validation assumes specific markdown format (### Requirement:, #### Scenario:)
- **Mitigation**: Only validate specs following OpenSpec conventions, gracefully handle parse errors

**[Risk] User confusion between validate and verify**
- Similar names and purposes could confuse users
- **Mitigation**: Clear distinction in descriptions, explain difference in help text, suggest appropriate tool based on context

**[Trade-off] Heuristic vs Perfect Analysis**
- Chose fast heuristics over perfect static analysis
- **Impact**: Some false positives/negatives, but much faster and simpler
- **Justification**: Users can investigate flagged areas; perfect accuracy not required for utility

**[Trade-off] Spec-only validation**
- Only validates against specs in `openspec/specs/`, not arbitrary requirements
- **Impact**: Can't validate if specs themselves are incomplete or wrong
- **Justification**: Specs are source of truth; validating specs themselves is different problem

## Migration Plan

**Implementation Steps**:
1. Create `src/core/templates/workflows/validate.ts` with skill and command templates
2. Export from `src/core/templates/skill-templates.ts`
3. Add skill name to tracking constants (if such file exists, or create)
4. Update profile configurations to include validate in standard profiles
5. Test skill generation with `openspec update`
6. Verify generated SKILL.md contains all instructions

**Testing**:
- Unit tests for validate template generation
- Integration test: generate skills and verify validate appears
- E2E test: run generated `/opsx:validate` skill against test spec
- Cross-platform test: verify path handling on Windows

**Rollout**:
- No breaking changes - pure addition
- Users get validate skill after running `openspec update`
- Document in opsx.md and workflows.md
