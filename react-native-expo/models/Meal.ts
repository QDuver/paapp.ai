import { CardAbstract } from './abstract/CardAbstract';
import { EditableItemAbstract } from './abstract/EditableItemAbstract';
import { Ingredient } from './Ingredient';
import { FieldDescriptor } from './utils';

/**
 * Meal model for meal cards
 * Equivalent to Dart's Meal class
 */
export class Meal extends CardAbstract {
  items: Ingredient[] = [];
  instructions: string = '';
  calories: number = 0;

  constructor(data?: Partial<Meal>) {
    super();
    if (data) {
      // Handle items array specially to ensure proper Ingredient instances
      if (data.items) {
        this.items = data.items.map(item => 
          item instanceof Ingredient ? item : new Ingredient(item)
        );
        delete data.items;
      }
      Object.assign(this, data);
    }
  }

  /**
   * Get computed tags for display
   */
  getTags(): string[] {
    return [`Calories: ${this.calories}`];
  }

  /**
   * Get editable fields for dynamic form generation
   */
  getEditableFields(): FieldDescriptor[] {
    return [
      new FieldDescriptor(
        'name',
        'Name',
        () => this.name,
        (v: string) => this.name = v,
        'string'
      ),
      new FieldDescriptor(
        'instructions',
        'Instructions',
        () => this.instructions,
        (v: string) => this.instructions = v,
        'string'
      ),
      new FieldDescriptor(
        'calories',
        'Calories',
        () => this.calories,
        (v: number) => this.calories = v,
        'number'
      ),
      new FieldDescriptor(
        'isCompleted',
        'Completed',
        () => this.isCompleted,
        (v: boolean) => this.isCompleted = v,
        'boolean'
      ),
    ];
  }

  /**
   * Create a new ingredient for this meal
   */
  createNewItem(): EditableItemAbstract {
    return new Ingredient();
  }

  /**
   * Calculate total calories from ingredients
   */
  calculateTotalCalories(): number {
    return this.items.reduce((total, ingredient) => total + ingredient.calories, 0);
  }

  /**
   * Update calories based on ingredients
   */
  updateCaloriesFromIngredients(): void {
    this.calories = this.calculateTotalCalories();
  }
}
