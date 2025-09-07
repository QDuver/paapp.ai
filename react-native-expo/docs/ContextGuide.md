# App Context System

This document explains how to use the centralized app context system that provides access to application state and functionality across all components.

## Overview

The app context system wraps your existing `useAppData` hook and makes it accessible throughout the entire app without prop drilling. This includes:

- Loading states
- Application data (routines, exercises, meals)
- Current date
- Error handling
- Data manipulation functions

## Setup

The context is already set up in your `App.js`:

```javascript
import React from 'react';
import { AppProvider } from './contexts';
import MainApp from './components/MainApp';

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
```

## Usage

### Using the Context Hook

In any component, import and use the `useAppContext` hook:

```typescript
import React from 'react';
import { useAppContext } from '../contexts';

const MyComponent = () => {
  const { 
    isLoading, 
    data, 
    currentDate, 
    loadAllData, 
    buildItems, 
    changeDate,
    showError 
  } = useAppContext();

  // Use the context data and functions
  return (
    <View>
      <Text>Current Date: {currentDate}</Text>
      <Text>Loading: {isLoading ? 'Yes' : 'No'}</Text>
      {/* ... */}
    </View>
  );
};
```

### Available Context Properties

#### State Properties
- `isLoading: boolean` - Whether data is currently being loaded
- `data: AppData` - Contains routines, exercises, and meals data
- `currentDate: string` - Current selected date
- `error: string | null` - Current error message if any

#### Action Functions
- `loadAllData(): Promise<void>` - Reload all data for current date
- `buildItems(collection: CollectionType): Promise<void>` - Build items for specific collection
- `changeDate(newDate: string): void` - Change the current date
- `showError(message: string): void` - Display an error message

### Data Structure

The `data` object contains:
```typescript
{
  routines: AppDataCollection | null;
  exercises: AppDataCollection | null;
  meals: AppDataCollection | null;
}
```

Each collection has an `items` array containing the actual data items.

### Example Usage Patterns

#### Displaying Data Counts
```typescript
const DataSummary = () => {
  const { data } = useAppContext();
  
  return (
    <View>
      <Text>Routines: {data.routines?.items?.length || 0}</Text>
      <Text>Exercises: {data.exercises?.items?.length || 0}</Text>
      <Text>Meals: {data.meals?.items?.length || 0}</Text>
    </View>
  );
};
```

#### Loading States
```typescript
const LoadingAwareComponent = () => {
  const { isLoading, loadAllData } = useAppContext();
  
  if (isLoading) {
    return <ActivityIndicator />;
  }
  
  return (
    <TouchableOpacity onPress={loadAllData}>
      <Text>Refresh Data</Text>
    </TouchableOpacity>
  );
};
```

#### Building Items
```typescript
const BuildActions = () => {
  const { buildItems, isLoading } = useAppContext();
  
  return (
    <View>
      <TouchableOpacity 
        onPress={() => buildItems('routines')}
        disabled={isLoading}
      >
        <Text>Build Routines</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => buildItems('exercises')}
        disabled={isLoading}
      >
        <Text>Build Exercises</Text>
      </TouchableOpacity>
    </View>
  );
};
```

#### Error Handling
```typescript
const ErrorDisplay = () => {
  const { error, showError } = useAppContext();
  
  if (error) {
    return (
      <View style={{ backgroundColor: 'red', padding: 10 }}>
        <Text style={{ color: 'white' }}>{error}</Text>
      </View>
    );
  }
  
  return null;
};
```

## Best Practices

1. **Use the hook only in components**: Don't try to use the context outside of React components
2. **Handle loading states**: Always check `isLoading` before performing actions
3. **Error boundaries**: Consider wrapping components that use the context in error boundaries
4. **TypeScript**: The context is fully typed, so you'll get autocomplete and type checking

## File Structure

```
contexts/
├── AppContext.tsx          # Main context implementation
└── index.ts               # Export file for easy imports

components/
├── MainApp.tsx            # Main app component using context
└── ExampleComponent.tsx   # Example of context usage

App.js                     # Root component with provider
```

## Migration from Direct Hook Usage

If you were previously using `useAppData` directly:

**Before:**
```typescript
import { useAppData } from '../hooks/useAppData';

const MyComponent = () => {
  const { isLoading, data } = useAppData();
  // ...
};
```

**After:**
```typescript
import { useAppContext } from '../contexts';

const MyComponent = () => {
  const { isLoading, data } = useAppContext();
  // ... (same usage)
};
```

The API is identical, but now the state is shared across all components.
