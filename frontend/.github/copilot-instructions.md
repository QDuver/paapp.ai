# AI Coding Agent Instructions

Concise, project-specific guidance for this Expo React Native app. Focus on these patterns and conventions when generating code.

You should create a minimum code as possible to satisfy the request. Do not create unnecessary code, try / catch blocks, or comments.
Feel free to do some refactoring if it helps to keep the code minimal.

use external libraries if it helps reduce code.
react-native-paper is already installed, but you can add more if needed.

## 1. Purpose & Domain

Routine Assistant mobile app (Expo managed workflow) showing daily routines, exercises, and meals for a selected `currentDate`. Data is fetched from a backend API (DEV: local server via IP/port, PROD: `PROD_CONFIG.API_URL`) and shaped into rich model classes for UI interaction.

## 2. Runtime & Environment

- Entry: `index.js` -> `App.js` -> wraps UI with `AppProvider` (from `contexts/AppContext.tsx`).
- TypeScript is partially adopted; TS models + hooks coexist with JS entry files.
- Env config: `config/env.ts` provides `DEV_CONFIG` (LOCAL_IP, LOCAL_PORT) & `PROD_CONFIG`.
- Firebase initialization in `services/Firebase.ts` (lazy; only call once). Auth tokens are automatically injected into every API call.

## 3. Data Flow & State Pattern

```
apiClient -> fetch JSON -> AppContext maps plain objects to model classes (Routines, Exercises, Meals) -> components consume class instances.
```

- Central context value: `{ data, currentDate, isLoading, refreshCounter, onUpdate }`.
- Changing `currentDate` triggers refetch (`apiClient.get(routines/${currentDate})`).
- `refreshCounter` increments after `onUpdate` to force re-render list keying.
- Updates: `onUpdate(cardList)` posts the entire cardList object to `${collection}/${id}`.

## 4. Models & Mutability Conventions

- Models in `models/*.ts` extend abstract bases in `models/Abstracts.ts`.
- `FirestoreDocAbstract` holds `items` + `collection` + `id` (used in update route).
- `CardAbstract` / `Routine` expose imperative mutators (`onComplete`, `onToggleExpand`, `update(formData)`). These mutate in-place; UI reactivity relies on context refresh patterns, not immutability.
- Editable fields enumerated via `getEditableFields()`; forms should restrict to these keys.
- Tag logic lives on model instance (`Routine.getTags()` returns derived labels like `"15 min"`). Reuse rather than recomputing in UI.

## 5. API Layer (`utils/apiClient.ts`)

- Standalone utility module providing: `{ get, post, put, delete }` methods.
- Can be used anywhere in the app (React components, models, services) without requiring hooks.
- Auto attaches: `Authorization: Bearer <FirebaseToken>` when user signed in.
- Base URL selection logic differs on `__DEV__` + platform (web = localhost; native = LOCAL_IP). Always reuse `getBaseUrl()` pattern when adding new fetch code.
- Error handling: throws errors with detailed messages; consuming code should handle with try/catch.
- Supports optional `skipAuth` parameter for unauthenticated requests.

## 6. UI Component Patterns

- Lists: `components/card/CardList.tsx` uses `FlatList` keyed with `refreshCounter` to force rerender after mutations.
- Individual cards rendered via `CustomCard` & `SubCard` (extend models). Preserve prop flow: pass `cardList`, `item`, `index`.
- Avoid deriving keys from mutable fields; rely on index + refreshCounter pattern unless stable IDs are introduced.

## 7. Dates & Daily Partitioning

- Date utilities centralised in `utils/dateUtils.ts` (`YYYY-MM-DD`). Do NOT reinvent date formatting; call `getCurrentDate()` or `formatDate()`.
- All routine fetches are date-scoped; new features that depend on the day should respect `currentDate` from context instead of computing `new Date()` directly.

## 8. Adding New Domain Collections

When introducing a new collection (e.g., `Habits`):

1. Create model class extending `FirestoreDocAbstract` & item class extending `CardAbstract`.
2. Implement `getEditableFields()` & any `getTags()` logic.
3. Map API response inside `AppContext` analogous to Routines/Exercises/Meals.
4. Update `DataType` + fetch endpoint payload expected shape.
5. Integrate into UI via a new `CardList` instance.

## 9. Mutation & Sync Workflow

- Mutations are optimistic (local model mutated before POST). There is no rollback; if you add error recovery, capture original snapshot before mutation.
- After POST, only `refreshCounter` changes; server response isn't merged. If future features require server-confirmed state, extend `onUpdate` to await response and patch models.

## 10. Testing & Dev Scripts

- Scripts: `npm start|android|ios|web` (Expo). No custom test runner configured; `test/createChildTest.ts` appears as placeholder—add Jest + React Native Testing Library if expanding tests.
- Prefer colocating future tests under `test/` mirroring source paths.

## 11. Firebase & Auth Considerations

- Initialize via `initializeFirebase()` before first auth-dependent action. Don't duplicate initialization.
- Safe to call idempotently; wrap app root or an early effect.

## 12. Style & Type Practices

- Mixed JS/TS: new logic should prefer TypeScript (`.ts` / `.tsx`).
- Keep models strongly typed; UI components can infer props from model interfaces.
- Maintain existing naming: plural class for collection (`Routines`), singular for item (`Routine`).

## 13. Performance & Re-render Notes

- Avoid recreating large model graphs unnecessarily; only reconstruct in `AppContext` when raw API payload changes.
- Heavy UI recompute is gated by `refreshCounter`; increment only when structural changes occur (add/remove/update meaningful fields).

## 14. Safe Extension Checklist

Before committing new feature code:

- Uses `useAppContext()` for date & loading state.
- Leverages model methods instead of duplicating logic.
- API calls centralized through `apiClient` (do not call fetch directly).
- Respects environment URL selection.

---

Provide feedback if you need deeper coverage on: error/UI strategy, adding persistence flows, or test scaffolding.
