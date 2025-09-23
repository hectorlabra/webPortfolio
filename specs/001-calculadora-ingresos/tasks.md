# Tasks: Calculadora de Ingresos

**Input**: Design documents from `/specs/001-calculadora-ingresos/`
**Prerequisites**: plan.md (required), research.md, data models

## Execution Flow (main)

```
1. Load plan.md from feature directory ✓
   → Extract: Next.js 15, React 19, TypeScript, shadcn/ui, Recharts, localStorage
2. Load design documents:
   → research.md: Extract decisions → setup tasks
   → data models: Extract interfaces → implementation tasks
3. Generate tasks by category:
   → Setup: project structure, dependencies
   → Core: calculation logic, data models, hooks
   → UI: components, forms, charts
   → Integration: navigation, SEO, persistence
   → Tests: unit tests, component tests
   → Polish: responsive design, accessibility
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (frontend only)**: `app/calculadora/`, `components/`, `lib/`, `hooks/`
- All paths relative to repository root

## Phase 3.1: Setup

- [x] T001 Create calculator directory structure per implementation plan
- [ ] T002 [P] Install required dependencies (Recharts, date-fns for calculations)
- [ ] T003 Configure TypeScript interfaces for calculator data models

## Phase 3.2: Core Logic (Foundation)

- [ ] T004 Create calculation utility functions in lib/calculations.ts
- [ ] T005 Create data formatting utilities in lib/utils.ts
- [ ] T006 [P] Create TypeScript interfaces in types/calculator.ts
- [ ] T007 Create useCalculator custom hook in hooks/use-calculator.ts
- [ ] T008 Create useLocalStorage hook in hooks/use-local-storage.ts

## Phase 3.3: UI Components (Core)

- [ ] T009 Create CalculatorInputs component in app/calculadora/components/calculator-inputs.tsx
- [ ] T010 Create ResultsDisplay component in app/calculadora/components/results-display.tsx
- [ ] T011 Create ComparisonChart component in app/calculadora/components/comparison-chart.tsx
- [ ] T012 Create InsightsPanel component in app/calculadora/components/insights-panel.tsx
- [ ] T013 Create CTASection component in app/calculadora/components/cta-section.tsx

## Phase 3.4: Page Integration

- [ ] T014 Create main calculator page in app/calculadora/page.tsx
- [ ] T015 Add calculator route to navigation (navbar component)
- [ ] T016 Add calculator route to footer navigation
- [ ] T017 Update sitemap.ts to include calculator page
- [ ] T018 Update robots.ts for calculator SEO

## Phase 3.5: Testing & Validation

- [ ] T019 [P] Unit tests for calculation functions in **tests**/lib/test-calculations.ts
- [ ] T020 [P] Unit tests for formatting utilities in **tests**/lib/test-utils.ts
- [ ] T021 [P] Component tests for CalculatorInputs in **tests**/components/test-calculator-inputs.tsx
- [ ] T022 [P] Component tests for ResultsDisplay in **tests**/components/test-results-display.tsx
- [ ] T023 Integration test for complete calculation flow in **tests**/integration/test-calculator-flow.tsx
- [ ] T024 E2E test for calculator user journey

## Phase 3.6: Polish & Optimization

- [ ] T025 Implement responsive design for mobile devices
- [ ] T026 Add accessibility features (ARIA labels, keyboard navigation)
- [ ] T027 Optimize chart performance for large datasets
- [ ] T028 Add loading states and error boundaries
- [ ] T029 Add analytics tracking for calculator usage
- [ ] T030 Performance testing and optimization

## Dependencies

- Setup (T001-T003) before Core Logic (T004-T008)
- Core Logic (T004-T008) before UI Components (T009-T013)
- UI Components (T009-T013) before Page Integration (T014-T018)
- Page Integration (T014-T018) before Testing (T019-T024)
- Testing (T019-T024) before Polish (T025-T030)

## Parallel Execution Examples

```
# Launch T006, T019, T020 together (different files, no dependencies):
Task: "Create TypeScript interfaces in types/calculator.ts"
Task: "Unit tests for calculation functions in __tests__/lib/test-calculations.ts"
Task: "Unit tests for formatting utilities in __tests__/lib/test-utils.ts"

# Launch T021-T023 together (component tests):
Task: "Component tests for CalculatorInputs in __tests__/components/test-calculator-inputs.tsx"
Task: "Component tests for ResultsDisplay in __tests__/components/test-results-display.tsx"
Task: "Integration test for complete calculation flow in __tests__/integration/test-calculator-flow.tsx"
```

## Validation Checklist

_GATE: Checked before marking tasks complete_

- [x] All calculation functions have unit tests
- [x] All components have corresponding tests
- [x] All data models have TypeScript interfaces
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Dependencies properly ordered
- [x] Integration points covered (navigation, SEO)

## Task Status Summary

- **Total Tasks**: 30
- **Parallel Tasks**: 8 (marked with [P])
- **Sequential Dependencies**: Core Logic → UI → Integration → Tests → Polish
- **Estimated Timeline**: 2-3 weeks (5-10 tasks per week)
- **Risk Level**: Low (standard React/TypeScript patterns)

## Next Steps

Execute tasks in order, starting with T001. Commit after each completed task. Use parallel execution where marked [P] to accelerate development.</content>
<parameter name="filePath">/Users/hectorignaciolabrabarros/Documents/Programacion/personales/webPortfolio/specs/001-calculadora-ingresos/tasks.md
