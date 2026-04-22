# Repository Guidelines

## Project Structure & Module Organization

This is a UI-first Expo/React Native prototype. The app entry point is `index.js`, which loads `App.tsx`. Most screen logic, state, styles, and React Native UI currently live in `App.tsx`; keep new UI code nearby unless it grows enough to justify extracting components under `src/`.

Shared mock data belongs in `src/data.ts`, and reusable TypeScript models belong in `src/types.ts`. Product context and scope are documented in `docs/prd.md`. There is no dedicated assets directory yet; add one only when image, font, or icon files are introduced.

## Build, Test, and Development Commands

- `npm install`: install Expo, React Native, and TypeScript dependencies from `package-lock.json`.
- `npm run start`: start the Expo development server.
- `npm run android`: start Expo and open the Android target.
- `npm run ios`: start Expo and open the iOS target.
- `npm run web`: start Expo for web preview.
- `npm run typecheck`: run `tsc --noEmit` against the strict TypeScript configuration.

Run `npm run typecheck` before handing off changes.

## Coding Style & Naming Conventions

Use TypeScript for app code and keep `strict` and `noUncheckedIndexedAccess` clean. Follow the existing style: two-space indentation, single quotes, semicolons, PascalCase for React components and exported types, and camelCase for functions, variables, state setters, and object fields.

Keep mock IDs stable and URL-like, for example `iron-coach` or `motivation`. Prefer explicit model updates in `src/types.ts` before expanding data objects in `src/data.ts`.

## Testing Guidelines

No automated test framework is configured in this repository yet. For now, validate changes with `npm run typecheck` and a manual Expo smoke test for affected targets. If tests are added, prefer colocated `*.test.ts` or `*.test.tsx` files and add a matching `npm test` script.

## Commit & Pull Request Guidelines

There is no commit history yet, so no project-specific convention is established. Use short, imperative commit subjects such as `Add custom genre validation` or `Extract personality card component`.

Pull requests should include a clear summary, manual test notes, linked issues or product notes when relevant, and screenshots or screen recordings for UI changes. Call out any scope changes from `docs/prd.md`, especially additions beyond the local mock-data MVP.

