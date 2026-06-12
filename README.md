# FoodHub Code Test

A full-stack takeaway ordering demo built with **Next.js**, **TypeScript**, **Zod**, **Zustand**, **Vitest**, and **Playwright**.

The application displays a restaurant menu, lets users build a cart, complete a checkout flow, process a fake payment, generate an AI-assisted kitchen summary, and view an order confirmation page.

## Features

- Restaurant menu grouped by category
- Cart management with quantity controls
- Checkout form with runtime validation
- Fake payment processing
- Order confirmation page
- AI-generated kitchen summary with safe fallback behavior
- Unit, integration, and end-to-end test coverage
- CI pipeline for linting, formatting, type checking, tests, build, and E2E tests

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Validation:** Zod
- **State Management:** Zustand
- **Testing:** Vitest, React Testing Library, Playwright
- **AI:** OpenAI API integration with local fallback
- **CI:** GitHub Actions

## Technology Choices

### **SCSS/CSS Modules** were chosen instead of Tailwind CSS.

For this exercise I preferred component-scoped styles that keep styling concerns separate from markup and make visual changes easier to locate, review, and refactor.

This approach also keeps the rendered markup focused on structure and accessibility concerns while avoiding an additional styling abstraction layer.

### **Next.js App Router instead of Vite + React SPA**

Next.js was chosen to provide a production-oriented application structure, routing, API endpoints, image optimization, and deployment model within a single framework. For this exercise it reduced the amount of infrastructure code required while still demonstrating full-stack concerns.

### **Zod instead of TypeScript-only validation**

TypeScript provides compile-time guarantees, but external inputs such as API requests require runtime validation. Zod was used to validate incoming data and establish a single source of truth for domain models.

### **Zustand instead of Redux**

Zustand was chosen because the application requires a small amount of shared client-side state without the ceremony associated with Redux. The resulting implementation remains simple while preserving testability.

### **AI Integration: Graceful degradation instead of hard dependency**

AI functionality degrades gracefully when external services are unavailable, ensuring that the primary ordering workflow remains functional in local development, CI environments, and review scenarios.

### **Persistence: Local JSON storage instead of introducing a database**

SQLite was considered as an alternative. However, introducing a database would have added infrastructure complexity without materially changing the business logic being demonstrated.

### **React Compiler**

React Compiler was enabled to reduce the need for manual memoization patterns such as `useMemo` and `useCallback`, allowing components to remain focused on business logic rather than optimization boilerplate.

### **Quality Gates**

Automated quality gates prevent commits and pull requests from bypassing linting, type checking, or automated tests.

- Prettier was used alongside automatic formatting on save to maintain consistent code style.

- Husky pre-commit hooks were configured to prevent commits that fail linting or automated tests.

- Vitest was used for unit and integration testing, with built-in coverage reporting used to identify untested areas of the codebase.

- Playwright was used to validate end-to-end user journeys against a running application.

- Semantic HTML and accessible form controls were preferred where practical, improving both usability and testability.

- Stable `data-testid` attributes were used where appropriate to reduce test brittleness and avoid coupling automated tests to presentation details.

- GitHub Actions were used as a CI/CD solution and final verification step.

## Requirements

- Node.js 22+
- pnpm

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

## Environment Variables

The AI kitchen summary feature can use the OpenAI API when an API key is available.

Create a `.env.local` file:

```bash
OPENAI_API_KEY=your_api_key_here
```

If no API key is provided, the app falls back to a deterministic local kitchen summary. This keeps the application usable in local development, CI, and review environments.

### Scripts

```bash
pnpm dev
```

Starts the development server.

```bash
pnpm build
```

Builds the production application.

```bash
pnpm start
```

Starts the production server.

```bash
pnpm lint
```

Runs ESLint.

```bash
pnpm format:check
```

Checks formatting.

```bash
pnpm typecheck
```

Runs TypeScript checks.

```bash
pnpm test
```

Runs unit and integration tests.

```bash
pnpm test:e2e
```

Runs Playwright end-to-end tests.

## Testing Strategy

This project uses multiple layers of testing:

- **Unit tests** for isolated components and utility logic
- **Integration tests** for user-facing flows and API behavior
- **End-to-end tests** for the full ordering journey, from menu to checkout confirmation

The goal is not just to prove that individual functions work, but to verify that the core business flow behaves correctly from the user's perspective.

## CI

The GitHub Actions workflow runs:

- Type checking
- Linting
- Formatting checks
- Unit/integration tests
- Production build
- Playwright E2E tests

This is intended to catch regressions across both implementation correctness and user-facing behavior.

## Design Goals

This exercise was designed to demonstrate:

- Runtime validation of external inputs
- Layered automated testing
- Maintainable state management
- Graceful degradation of external services
- Quality-focused development workflows
- Clear separation of concerns
