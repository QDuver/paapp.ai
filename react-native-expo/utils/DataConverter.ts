import { Meal, Exercise, Routine } from '../models';

/**
 * Utility to convert plain objects to typed model instances
 */
export class DataConverter {
  /**
   * Convert plain objects to typed models
   */
  static convertToTypedModels(data: any) {
    return {
      routines: {
        ...data.routines,
        items: data.routines.items.map((item: any) => new Routine(item))
      },
      exercises: {
        ...data.exercises,
        items: data.exercises.items.map((item: any) => new Exercise(item))
      },
      meals: {
        ...data.meals,
        items: data.meals.items.map((item: any) => new Meal(item))
      }
    };
  }

  /**
   * Convert typed models to plain objects (for API/storage)
   */
  static convertToPlainObjects(typedData: any) {
    return {
      routines: {
        ...typedData.routines,
        items: typedData.routines.items.map((item: Routine) => ({ ...item }))
      },
      exercises: {
        ...typedData.exercises,
        items: typedData.exercises.items.map((item: Exercise) => ({
          ...item,
          items: item.items.map(set => ({ ...set }))
        }))
      },
      meals: {
        ...typedData.meals,
        items: typedData.meals.items.map((item: Meal) => ({
          ...item,
          items: item.items.map(ingredient => ({ ...ingredient }))
        }))
      }
    };
  }
}
