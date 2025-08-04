# Global Gesture Detection System

This system provides comprehensive gesture detection across your entire Flutter application with detailed context about targets and widget hierarchy.

## Key Features

- **Global Detection**: Listen to swipes anywhere in your app
- **Widget Context**: Know exactly which widget was swiped and its parent/child hierarchy
- **Flexible Targeting**: Listen to specific widgets, widget types, or keys
- **Gesture Sequences**: Detect complex gesture patterns (e.g., swipe up then down)
- **Performance Optimized**: Minimal overhead with configurable thresholds

## Quick Start

### 1. Initialize in main.dart

```dart
void main() {
  // Initialize gesture system
  GestureManager.initialize(
    minSwipeDistance: 50.0,
    minSwipeVelocity: 200.0,
  );
  
  // Set up global listeners
  GestureManager.onSwipeLeft((event) {
    print('Global swipe left on: ${event.targetKey}');
  });
  
  runApp(MyApp());
}
```

### 2. Wrap your app with GlobalGestureWrapper

```dart
child: GlobalGestureWrapper(
  child: MaterialApp(
    // your app
  ),
),
```

### 3. Add gesture detection to specific widgets

```dart
GlobalGestureDetector(
  gestureKey: 'exercise_card',
  child: ExerciseCard(exercise: exercise),
)
```

## Usage Examples

### Listen to All Gestures
```dart
GestureManager.onGesture((event) {
  print('Direction: ${event.direction}');
  print('Target: ${event.targetKey}');
  print('Hierarchy: ${event.getWidgetHierarchy()}');
});
```

### Listen to Specific Directions
```dart
GestureManager.onSwipeLeft((event) {
  // Handle left swipe
});

GestureManager.onSwipeRight((event) {
  // Handle right swipe
});
```

### Listen to Specific Widgets
```dart
// By key
GestureManager.onGestureForKey('exercise_card', (event) {
  // Only gestures on widgets with key 'exercise_card'
});

// By widget type
GestureManager.onGestureForWidgetType<Card>((event) {
  // Only gestures on Card widgets
});
```

### Create Gesture Shortcuts
```dart
GestureManager.createGestureShortcut(
  sequence: [SwipeDirection.up, SwipeDirection.down],
  action: () {
    print('Refresh gesture detected!');
  },
  timeWindow: Duration(seconds: 2),
);
```

### Access Widget Hierarchy
```dart
GestureManager.onGesture((event) {
  // Find parent widget
  final parentCard = event.findParentWidget<Card>();
  
  // Get full hierarchy
  final hierarchy = event.getWidgetHierarchy();
  hierarchy.forEach((level, info) {
    print('$level: ${info['type']}');
  });
});
```

## GestureEvent Properties

- `direction`: SwipeDirection (left, right, up, down)
- `startPosition`: Offset where gesture started
- `endPosition`: Offset where gesture ended  
- `velocity`: Speed of the gesture
- `context`: BuildContext of the target widget
- `targetWidget`: The actual widget that was swiped
- `targetKey`: String key if provided
- `timestamp`: When the gesture occurred

## Configuration

```dart
GestureManager.initialize(
  minSwipeDistance: 50.0,    // Minimum distance for a swipe
  minSwipeVelocity: 200.0,   // Minimum velocity for a swipe
);
```

## Debug Mode

```dart
GestureManager.enableDebugMode(); // Prints all gesture details
```

## Example Integration

See `gesture_example_page.dart` for a complete working example, or `exercise_gesture_handler.dart` for exercise-specific implementations.

## Best Practices

1. **Use meaningful keys** for widgets you want to track
2. **Remove listeners** when widgets are disposed
3. **Use widget type listeners** for reusable components
4. **Configure thresholds** based on your UI needs
5. **Test on different devices** for optimal gesture sensitivity
