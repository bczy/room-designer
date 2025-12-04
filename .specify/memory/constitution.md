<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Modified principles: None renamed
- Added sections: Mandatory Development Principles (TDD, SOLID, YAGNI, DRY)
- Removed sections: None
- Templates status:
  - .specify/templates/plan-template.md ✅ Compatible (Constitution Check section exists)
  - .specify/templates/spec-template.md ✅ Compatible (User scenarios support acceptance testing)
  - .specify/templates/tasks-template.md ✅ Compatible (Test tasks supported)
- No deferred TODOs
-->

# Room Designer Constitution

## Core Principles

### I. Code Quality Excellence

All code MUST adhere to strict quality standards to ensure maintainability, readability, and long-term project health.

**Non-Negotiable Rules**:
- Every module MUST have a single, well-defined responsibility (Single Responsibility Principle)
- Functions MUST be pure where possible; side effects MUST be isolated and documented
- Code MUST be self-documenting through meaningful naming; comments explain "why", not "what"
- Dead code MUST be removed immediately—no commented-out blocks in production
- Cyclomatic complexity MUST NOT exceed 10 per function; complex logic MUST be decomposed
- All public APIs MUST include type annotations and JSDoc/docstring documentation
- Linting and formatting rules MUST pass with zero warnings before merge

**Rationale**: High code quality reduces debugging time, accelerates onboarding, and prevents technical debt accumulation.

## Mandatory Development Principles

The following engineering principles are NON-NEGOTIABLE and MUST be applied to all code written in this project.

### TDD (Test-Driven Development)

All feature development MUST follow the Red-Green-Refactor cycle:
1. **Red**: Write a failing test that defines the expected behavior
2. **Green**: Write the minimum code necessary to make the test pass
3. **Refactor**: Improve the code while keeping tests green

**Rules**:
- No production code MUST be written without a corresponding failing test first
- Tests MUST be written before implementation, not after
- Each test MUST verify a single behavior or requirement

### SOLID Principles

All object-oriented and modular code MUST adhere to SOLID principles:

- **S - Single Responsibility**: Each class/module MUST have only one reason to change
- **O - Open/Closed**: Code MUST be open for extension but closed for modification
- **L - Liskov Substitution**: Subtypes MUST be substitutable for their base types without breaking behavior
- **I - Interface Segregation**: Clients MUST NOT be forced to depend on interfaces they don't use
- **D - Dependency Inversion**: High-level modules MUST NOT depend on low-level modules; both MUST depend on abstractions

### YAGNI (You Aren't Gonna Need It)

Code MUST only implement features that are currently required:
- Speculative features MUST NOT be implemented "just in case"
- Abstractions MUST only be introduced when there is a concrete, immediate need
- Premature optimization MUST be avoided unless performance requirements demand it
- Every line of code MUST justify its existence through a current requirement

### DRY (Don't Repeat Yourself)

Knowledge and logic MUST have a single, authoritative source:
- Duplicated code MUST be extracted into shared functions/modules
- Configuration values MUST be defined once and referenced everywhere
- Business rules MUST exist in exactly one place
- When modifying behavior, only one location MUST require changes

**Exception**: Prefer duplication over the wrong abstraction. If extracting common code would create a forced, unnatural coupling, controlled duplication is acceptable with documented justification.

### II. Test-Driven Development (NON-NEGOTIABLE)

Tests define the contract; implementation follows. This principle ensures correctness and enables confident refactoring.

**Non-Negotiable Rules**:
- Test-first workflow MUST be followed: Write tests → Verify they fail → Implement → Verify they pass → Refactor
- Unit test coverage MUST be ≥80% for business logic; critical paths MUST have 100% coverage
- Integration tests MUST exist for all external interfaces (APIs, databases, third-party services)
- UI components MUST have both unit tests and visual regression tests
- Test names MUST follow the pattern: `[unit]_[scenario]_[expectedResult]`
- Flaky tests MUST be fixed within 24 hours or quarantined with a tracking issue
- Tests MUST run in under 5 minutes for the full suite; slow tests MUST be optimized or parallelized

**Rationale**: TDD produces more reliable code, catches regressions early, and serves as living documentation.

### III. User Experience Consistency

The user interface MUST be intuitive, predictable, and accessible across all features and platforms.

**Non-Negotiable Rules**:
- All UI components MUST follow the established design system; deviations require explicit approval
- Interaction patterns MUST be consistent: same action = same behavior throughout the application
- Loading states MUST be shown for operations exceeding 200ms; skeleton screens preferred over spinners
- Error messages MUST be user-friendly, actionable, and never expose technical details
- All interactive elements MUST be keyboard-accessible and screen-reader compatible (WCAG 2.1 AA minimum)
- Responsive design MUST work across breakpoints: mobile (320px+), tablet (768px+), desktop (1024px+)
- User feedback (success/error/warning) MUST use consistent visual language (colors, icons, positioning)
- Undo/redo MUST be available for all destructive or significant user actions

**Rationale**: Consistent UX builds user trust, reduces learning curve, and minimizes support requests.

### IV. Performance-First Architecture

Performance is a feature, not an afterthought. Every implementation decision MUST consider runtime efficiency.

**Non-Negotiable Rules**:
- Initial page load MUST complete within 3 seconds on 3G networks (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Room rendering operations MUST maintain 60fps; frame drops below 30fps are blocking bugs
- API responses MUST return within 200ms (p95); operations exceeding 500ms MUST be async with progress indication
- Memory usage MUST NOT exceed 100MB for typical room designs; large designs MUST use virtualization
- Bundle size MUST NOT exceed 500KB gzipped for initial load; code splitting MUST be used for features
- Database queries MUST be optimized with proper indexing; N+1 queries are forbidden
- Performance budgets MUST be enforced in CI; regressions block deployment

**Rationale**: Fast applications provide better UX, improve SEO, and support users on constrained devices.

## Performance Standards

Performance metrics MUST be monitored and enforced continuously.

**Measurement Requirements**:
- Core Web Vitals MUST be tracked in production using Real User Monitoring (RUM)
- Synthetic performance tests MUST run on every PR; results compared against baseline
- Performance budgets MUST be defined per route/feature and enforced in CI
- Memory leaks MUST be detected via automated profiling in integration tests

**Optimization Priorities**:
1. **Critical Path**: Operations that block user interaction take highest priority
2. **Perceived Performance**: Use optimistic updates, progressive loading, and skeleton screens
3. **Resource Efficiency**: Lazy load assets, use efficient data structures, cache aggressively
4. **Network Resilience**: Graceful degradation on slow/unreliable connections

## Quality Gates

All changes MUST pass through quality gates before reaching production.

**Pre-Commit Gates**:
- [ ] Linting passes with zero errors/warnings
- [ ] Type checking passes without errors
- [ ] Unit tests pass for modified code
- [ ] Code formatted according to project standards

**Pre-Merge Gates**:
- [ ] Full test suite passes
- [ ] Code review approved by at least one maintainer
- [ ] No decrease in test coverage for modified files
- [ ] Performance budget not exceeded
- [ ] Accessibility audit passes for UI changes
- [ ] Documentation updated for API/behavior changes

**Pre-Deploy Gates**:
- [ ] Integration tests pass in staging environment
- [ ] Visual regression tests show no unexpected changes
- [ ] Security scan reports no critical/high vulnerabilities
- [ ] Load testing confirms performance under expected traffic

## Governance

This constitution supersedes all other development practices within the Room Designer project.

**Amendment Process**:
1. Propose changes via pull request to `.specify/memory/constitution.md`
2. Changes MUST include rationale and impact assessment
3. Review period of minimum 48 hours for team feedback
4. Approval requires consensus from core maintainers
5. Version increment follows semantic versioning (see below)

**Versioning Policy**:
- MAJOR: Removal or redefinition of core principles
- MINOR: Addition of new principles or sections
- PATCH: Clarifications, typo fixes, minor wording improvements

**Compliance**:
- All pull requests MUST verify compliance with applicable principles
- Constitution violations are blocking issues and MUST be resolved before merge
- Exceptions require documented justification and explicit approval from maintainers

**Version**: 1.1.0 | **Ratified**: 2025-12-04 | **Last Amended**: 2025-12-04
