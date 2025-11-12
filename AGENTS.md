# Repository Guidelines

## Project Structure & Module Organization
Next 15 App Router code lives in `src/app`, with marketing verticals such as `src/app/demo/logistics` and `src/app/demo/medicine`. Shared UI, layout primitives, and feature folders live under `src/components` (e.g., `src/components/demo/DemoDockMenu.tsx`) while domain logic for autoservice, logistics, and services lives in `src/modules`. Global assets stay inside `public`, and configuration (Next, Tailwind, ESLint, Docker) is kept at the repository root. Older showcase builds (`demo_v1`, `demo_v2`) and helper scripts under `scripts/` are reference-only unless explicitly revived.

## Build, Test, and Development Commands
Use `npm install` to sync dependencies (Node ≥ 20.11). `npm run dev` launches Next’s dev server with the App Router and hot reload. `npm run build` performs the production bundle and type-check, and `npm run start` serves the optimized build on port 3000. `npm run lint` executes the shared ESLint config and should pass before every commit.

## Coding Style & Naming Conventions
All code is TypeScript-first with two-space indentation. Components and modules use PascalCase filenames (`DemoLayout.tsx`), while hooks, utilities, and state stores remain camelCase. Favor functional React components, keep server/client component boundaries explicit, and rely on the `@/` alias instead of relative paths. Tailwind CSS powers styling—prefer low-level utility classes and extract reusable variants inside `src/components/ui` when repetition appears.

## Testing Guidelines
No automated runner ships in `package.json` yet, so every change must include manual verification notes for the affected routes (URL plus steps). When you introduce tests, colocate `*.spec.tsx` files next to the component or inside `src/modules/<feature>/__tests__` and exercise critical flows such as the demo menus and calculators. Target meaningful coverage of data transforms and interactive states, and document gaps in the PR if they remain.

## Commit & Pull Request Guidelines
The current history (`Initial commit from Create Next App`) sets the baseline: keep commit subjects short, present-tense, and optionally scoped (`demo: polish dock menu`). Group related changes into single commits and explain risky migrations in the body. PRs must describe intent, list dev/test commands run, link any tracking issue, and include screenshots or recordings for UI changes. Highlight new environment variables, config touches, or scripts so reviewers can re-check deployments.

## Security & Configuration Tips
Respect the declared engine (Node 20.11+) to avoid build drift. Secrets belong in `.env.local` or deployment-specific stores—never in tracked files. Review assets dropped into `public/` for size and license compliance, and when using `scripts/watch-sync.sh`, confirm it only syncs safe directories.
