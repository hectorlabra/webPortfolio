# Implementation Plan: Calculadora de Ingresos One-Time vs Recurrentes

**Branch**: `001-calculadora-ingresos` | **Date**: 2025-09-23 | **Spec**: [link]
**Input**: Feature specification from `/specs/001-calculadora-ingresos/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Crear una calculadora interactiva que compare ingresos de productos digitales one-time vs modelos de suscripción (MRR/ARR), demostrando las ventajas financieras de transformar productos low-ticket en micro-SaaS. La implementación usará Next.js 15 con TypeScript, shadcn/ui para componentes, y Recharts para visualizaciones.

## Technical Context

**Language/Version**: TypeScript 5+  
**Primary Dependencies**: Next.js 15, React 19, Tailwind CSS, shadcn/ui, Recharts, React Hook Form, Zod  
**Storage**: Local Storage (client-side), no backend storage required  
**Testing**: Jest + React Testing Library, 80%+ coverage required  
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (frontend only)  
**Performance Goals**: Lighthouse score >90, Core Web Vitals excellent, load time <2s  
**Constraints**: Client-side calculations only, no server dependencies, GDPR compliant, WCAG 2.1 AA accessible  
**Scale/Scope**: Single page application, ~5 components, ~10 calculations, responsive design

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**✅ PASS - No violations detected**

**Alignment with Core Principles:**

- **I. Educational Accessibility with AI**: ✅ Calculadora educativa accesible para emprendedores no técnicos
- **II. Performance-First Architecture**: ✅ <2s load time, Core Web Vitals >90, mobile-optimized
- **III. Technical Excellence & Innovation**: ✅ Next.js 15, React 19, TypeScript, componentes reutilizables
- **IV. Content-Driven Growth**: ✅ Contenido educativo con SEO optimizado, generación de leads
- **V. Brand & Community Building**: ✅ Posicionamiento como autoridad en transformación digital
- **VI. Conversion-Optimized Design**: ✅ UX guiada hacia CTAs, landing page focused
- **VII. Holistic Developer Journey**: ✅ Cobertura completa del journey SaaS (técnico + negocio)

**Technical Standards Compliance:**

- ✅ Next.js 15+ with App Router, React 19, TypeScript 5+
- ✅ Tailwind CSS + shadcn/ui component library
- ✅ ESLint/Prettier, Jest + React Testing Library
- ✅ Lighthouse >90, WCAG 2.1 AA accessibility
- ✅ SEO optimization, structured data

**No violations require complexity tracking.**

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
app/calculadora/
├── page.tsx                    # Página principal de la calculadora
├── components/
│   ├── calculator-inputs.tsx   # Componente de inputs del usuario
│   ├── results-display.tsx     # Componente de resultados
│   ├── comparison-chart.tsx    # Gráfico de comparación
│   ├── insights-panel.tsx      # Panel de insights
│   └── cta-section.tsx         # Sección de calls-to-action
├── hooks/
│   ├── use-calculator.ts       # Hook principal de cálculos
│   └── use-local-storage.ts    # Hook para persistencia local
└── lib/
    ├── calculations.ts         # Lógica de cálculos financieros
    └── constants.ts            # Constantes y valores por defecto

__tests__/
├── components/                 # Tests de componentes
├── hooks/                      # Tests de hooks
└── lib/                        # Tests de utilidades
```

**Structure Decision**: Web application (frontend only) - Single page application integrada en el sitio existente

### Data Models

#### Input Models

```typescript
interface CalculatorInputs {
  // Producto único
  oneTimePrice: number; // Precio del producto único ($)
  oneTimeCost: number; // Costo de adquisición por cliente ($)
  oneTimeCustomers: number; // Número de clientes objetivo

  // Modelo de suscripción
  subscriptionPrice: number; // Precio mensual de suscripción ($)
  subscriptionCost: number; // Costo mensual por cliente ($)
  churnRate: number; // Tasa de abandono mensual (%)
  timeHorizon: number; // Horizonte temporal (meses)

  // Métricas adicionales
  conversionRate: number; // Tasa de conversión (%)
  discountRate: number; // Tasa de descuento para LTV (%)
}
```

#### Output Models

```typescript
interface CalculationResults {
  // Resultados producto único
  oneTimeRevenue: number; // Ingresos totales únicos
  oneTimeProfit: number; // Beneficio total único
  oneTimeMargin: number; // Margen único (%)

  // Resultados suscripción
  monthlyRevenue: number[]; // Ingresos mensuales
  cumulativeRevenue: number[]; // Ingresos acumulados
  monthlyProfit: number[]; // Beneficio mensual
  cumulativeProfit: number[]; // Beneficio acumulado
  ltv: number; // Lifetime Value
  paybackPeriod: number; // Periodo de recuperación (meses)

  // Comparación
  revenueDifference: number; // Diferencia en ingresos
  profitDifference: number; // Diferencia en beneficios
  breakEvenPoint: number; // Punto de equilibrio (meses)
}
```

#### UI State Models

```typescript
interface CalculatorState {
  inputs: CalculatorInputs;
  results: CalculationResults | null;
  isCalculating: boolean;
  hasResults: boolean;
  lastCalculated: Date | null;
}
```

## Phase 0: Outline & Research

### Research Tasks Identified from Technical Context:

1. **Financial Calculation Formulas** - Research and validate formulas for:

   - Lifetime Value (LTV) calculation with discount rates
   - Payback period calculation for subscription models
   - Break-even analysis between one-time vs recurring revenue
   - Churn rate impact on long-term revenue projections

2. **Chart Visualization Best Practices** - Research:

   - Best chart types for revenue comparison (bar charts, line charts, area charts)
   - Recharts implementation patterns for financial data
   - Responsive chart design for mobile/desktop
   - Accessibility considerations for data visualizations

3. **Form Validation Patterns** - Research:

   - Zod schema patterns for financial input validation
   - Real-time validation UX patterns for calculator inputs
   - Error messaging for financial calculations
   - Input formatting for currency and percentage values

4. **Local Storage Persistence** - Research:

   - Best practices for calculator state persistence
   - Data migration strategies for schema changes
   - Privacy considerations for storing financial data locally
   - Browser compatibility for localStorage API

5. **Performance Optimization** - Research:
   - React.memo usage for calculation-heavy components
   - useMemo patterns for expensive financial calculations
   - Debouncing strategies for real-time input updates
   - Memory management for large datasets

### Research Execution Plan:

```
For each research task above:
  - Document current best practices
  - Identify 2-3 implementation options
  - Choose approach based on: simplicity, performance, maintainability
  - Create code examples/prototypes for chosen approach
```

**Output**: `research.md` with decisions, rationale, and alternatives considered

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

### Component Architecture Design:

1. **Extract UI Components from Feature Spec**:

   - `CalculatorInputs`: Form component with validation for all input fields
   - `ResultsDisplay`: Component showing calculated results in cards/tables
   - `ComparisonChart`: Recharts component for revenue/profit visualization
   - `InsightsPanel`: Component displaying key insights and recommendations
   - `CTASection`: Call-to-action component for next steps

2. **Custom Hooks Design**:

   - `useCalculator`: Hook managing calculation logic and state
   - `useLocalStorage`: Hook for persisting calculator state
   - `useFormValidation`: Hook for real-time form validation

3. **Utility Functions Design**:
   - Financial calculation functions (LTV, payback period, etc.)
   - Data formatting utilities (currency, percentages)
   - Chart data transformation functions

### Integration Points:

- Navigation integration: Add calculator link to navbar and footer
- SEO integration: Add calculator page to sitemap and robots.txt
- Analytics integration: Track calculator usage and conversions

### Testing Strategy:

- Unit tests for calculation functions
- Component tests for UI interactions
- Integration tests for complete calculation flow
- E2E tests for critical user journeys

**Output**: Component specifications, hook contracts, utility interfaces, test scenarios

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (data models, component specs, research findings)
- Create implementation tasks for each major component
- Add integration tasks for navigation and SEO
- Include testing tasks for each component and integration point

**Task Categories**:

1. **Foundation Tasks**: Setup calculator route, basic page structure
2. **Core Logic Tasks**: Calculation functions, data models, custom hooks
3. **UI Component Tasks**: Input forms, results display, charts, insights
4. **Integration Tasks**: Navigation links, SEO updates, analytics
5. **Testing Tasks**: Unit tests, component tests, integration tests
6. **Polish Tasks**: Responsive design, accessibility, performance optimization

**Ordering Strategy**:

- Sequential: Foundation → Core Logic → UI Components → Integration → Testing → Polish
- Parallel within categories: Independent components can be built simultaneously
- Dependencies: Core logic must complete before UI components

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

**Risk Mitigation**:

- Start with calculation logic to validate formulas early
- Build UI incrementally with working calculations
- Test integrations early to catch navigation/SEO issues

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---

_Based on Constitution v2.1.1 - See `/memory/constitution.md`_
