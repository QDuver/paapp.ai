# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the App
- `npm start` - Start Expo dev server (opens developer tools)
- `npm run web` - Run in web browser (localhost:8081)
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator (macOS only)

### Testing
- `npm test` - Run Playwright e2e tests
- `npm run test:ui` - Run tests with Playwright UI
- `npm run test:headed` - Run exercise tests in headed mode
- `npm run test:debug` - Run tests in debug mode

Tests are located in `e2e-tests/` and run against `http://localhost:8081`.

### Code Quality
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without changes

### Deployment
- `npm run build:web` - Export for web platform
- `npm run deploy` - Export and deploy to Firebase

## Architecture Overview

### Data Flow Pattern

```
API → AppContext → Model Classes → Components
```

1. **API Layer** (`utils/apiClient.ts`): Standalone utility providing `get`, `post`, `put`, `delete` methods
   - Auto-attaches Firebase auth tokens
   - Dev/prod URL selection (localhost for web, LOCAL_IP for native)
   - Can be used anywhere without hooks

2. **AppContext** (`contexts/AppContext.tsx`): Central state management
   - Fetches data from API and instantiates model classes
   - Provides: `{ data, isLoading, refreshCounter, onBuildWithAi }`
   - `refreshCounter` increments after mutations to force re-renders

3. **Model Classes** (`models/`): Business logic layer
   - Extend abstract bases: `FirestoreDocAbstract` (collections), `CardAbstract` (items), `SubCardAbstract` (sub-items)
   - Mutations are in-place (not immutable)
   - Define editable fields via `getEditableFields()`
   - Provide derived data via `getTags()`

4. **Components**: Consume model instances directly
   - `CardList` uses `FlatList` keyed with `refreshCounter`
   - `CustomCard` renders individual cards
   - `EditDialog` handles CRUD operations

### Model Class Hierarchy

```
DialogableAbstract (base)
├── FirestoreDocAbstract (collections: Routines, Exercises, Meals)
│   ├── items: CardAbstract[]
│   ├── collection: string
│   ├── id: string (YYYY-MM-DD)
│   └── static fromApi(): fetches and instantiates
├── CardAbstract (Routine, Exercise, Meal)
│   ├── items: SubCardAbstract[]
│   ├── isCompleted, isExpanded
│   └── onComplete(), onToggleExpand()
└── SubCardAbstract (child items)
    └── name getter
```

### Key Architectural Principles

1. **Date-Scoped Data**: All routines/exercises/meals are fetched for a specific date (YYYY-MM-DD format)
   - Current date from `utils/utils.ts`: `getCurrentDate()`, `formatDate()`
   - All Firestore documents use date as ID

2. **Optimistic Mutations**:
   - Models mutate in-place before POST
   - No rollback mechanism
   - Server response not merged back
   - `refreshCounter` pattern drives UI updates

3. **Form/Edit Pattern**:
   - `getEditableFields()` defines which fields can be edited
   - `toFormData()` / `fromFormData()` handle conversions
   - Field metadata includes: type, converter, keyboard type, suggestions

4. **Firebase Auth**:
   - Initialize once via `initializeFirebase()` in `services/Firebase.ts`
   - Auth state managed in `App.js`
   - Tokens auto-injected by `apiClient`
   - Dev mode supports `skipAuth` URL parameter

### Environment Configuration

Located in `config/env.ts`:
- `DEV_CONFIG`: LOCAL_IP, LOCAL_PORT for dev server
- `PROD_CONFIG`: API_URL for production
- `getBaseUrl()` handles platform-specific URL selection with fallback

### Adding New Domain Collections

Follow this pattern (see existing: Routines, Exercises, Meals):

1. Create model in `models/YourCollection.ts`:
   ```typescript
   export class YourItem extends CardAbstract {
     // fields
     getEditableFields(): IFieldMetadata[] { ... }
     getTags(): string[] { ... }
   }

   export class YourCollection extends FirestoreDocAbstract {
     collection = "your-collection";
     constructor(data) { super(data, YourItem); }
     static getUIMetadata() { ... }
   }
   ```

2. Add to `AppContext.tsx`:
   - Import model class
   - Add to `modelMap` if needed
   - Add to `DataType` interface
   - Fetch in `useEffect` and add to state

3. Create UI component extending `CardList`

## Code Style Conventions

- Minimize code: avoid unnecessary try/catch, comments, or defensive code
- Use external libraries when they reduce code (react-native-paper already installed)
- Mixed JS/TS codebase: new code should prefer TypeScript
- Model naming: plural for collections (`Routines`), singular for items (`Routine`)
- No immutability: models mutate in-place
- Reuse model methods instead of duplicating logic in UI

## Testing Strategy

- E2E tests using Playwright in `e2e-tests/`
- Tests run against web build on port 8081
- Playwright config auto-starts dev server before tests

## Common Development Patterns

### Using AppContext
```typescript
const { data, isLoading, refreshCounter, setRefreshCounter } = useAppContext();
```

### Making API Calls
```typescript
import { apiClient } from '../utils/apiClient';
const result = await apiClient.get<Type>('endpoint');
await apiClient.post('endpoint', body);
```

### Updating Data
```typescript
// Mutate model in-place
item.someField = newValue;
// Save to backend
await firestoreDoc.onSave();
// Trigger UI refresh
setRefreshCounter(prev => prev + 1);
```

### Date Handling
```typescript
import { getCurrentDate, formatDate } from '../utils/utils';
const today = getCurrentDate(); // "2025-10-25"
```
