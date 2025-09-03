import { SubCardAbstract } from './abstract/SubCardAbstract';
import { FieldDescriptor } from './utils';

/**
 * ExerciseSet model for exercise sub-items
 * Equivalent to Dart's ExerciseSet class
 */
export class ExerciseSet extends SubCardAbstract {
  weightKg?: number;
  repetitions?: number;
  duration?: number; // in seconds
  rest: number = 90; // rest time in seconds

  constructor(data?: Partial<ExerciseSet>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
    // Update name after setting properties
    this.updateName();
  }

  /**
   * Dynamic name generation based on set parameters
   */
  getName(): string {
    const parts: string[] = [];
    if (this.weightKg != null) parts.push(`${this.weightKg}kg`);
    if (this.repetitions != null) parts.push(`${this.repetitions} reps`);
    if (this.duration != null) parts.push(`${this.duration}s`);
    return parts.length > 0 ? parts.join(' × ') : 'Set';
  }

  /**
   * Update the inherited name property with dynamic value
   */
  updateName(): void {
    this.name = this.getName();
  }

  /**
   * Get editable fields for dynamic form generation
   */
  getEditableFields(): FieldDescriptor[] {
    return [
      new FieldDescriptor(
        'weightKg',
        'Weight (kg)',
        () => this.weightKg,
        (v: number) => this.weightKg = v,
        'double'
      ),
      new FieldDescriptor(
        'repetitions',
        'Repetitions',
        () => this.repetitions,
        (v: number) => this.repetitions = v,
        'number'
      ),
      new FieldDescriptor(
        'duration',
        'Duration (seconds)',
        () => this.duration,
        (v: number) => this.duration = v,
        'number'
      ),
      new FieldDescriptor(
        'rest',
        'Rest (seconds)',
        () => this.rest,
        (v: number) => this.rest = v,
        'number'
      ),
    ];
  }

  /**
   * Update fields and propagate to subsequent sets in the same exercise
   */
  updateFields(values: Record<string, any>, obj?: any): void {
    super.updateFields(values, obj);
    
    // TODO: Implement propagation to subsequent sets
    // This would require access to the parent Exercises list
    if (obj) {
      this.updateSubsequentSets(obj, values);
    }
  }

  /**
   * Update subsequent sets with the same values
   */
  private updateSubsequentSets(exercises: any, values: Record<string, any>): void {
    // TODO: Implement logic to update subsequent sets
    // This would need to find the current set in the exercise and update following sets
    console.log('Updating subsequent sets:', values);
  }
}
