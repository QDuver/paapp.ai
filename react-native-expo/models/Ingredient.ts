import { SubCardAbstract } from './abstract/SubCardAbstract';
import { FieldDescriptor } from './utils';

/**
 * Ingredient model for meal sub-items
 * Equivalent to Dart's Ingredient class
 */
export class Ingredient extends SubCardAbstract {
  name: string = '';
  quantity: number = 0.0;
  calories: number = 0;
  isExpanded: boolean = false;

  constructor(data?: Partial<Ingredient>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
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
        'quantity',
        'Quantity',
        () => this.quantity,
        (v: number) => this.quantity = v,
        'double'
      ),
      new FieldDescriptor(
        'calories',
        'Calories',
        () => this.calories,
        (v: number) => this.calories = v,
        'number'
      ),
    ];
  }
}
