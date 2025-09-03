import { CardAbstract } from './abstract/CardAbstract';
import { EditableItemAbstract } from './abstract/EditableItemAbstract';
import { ExerciseSet } from './ExerciseSet';
import { FieldDescriptor } from './utils';

/**
 * Exercise model for exercise cards
 * Equivalent to Dart's Exercise class
 */
export class Exercise extends CardAbstract {
  items: ExerciseSet[] = [];

  constructor(data?: Partial<Exercise>) {
    super();
    if (data) {
      // Handle items array specially to ensure proper ExerciseSet instances
      if (data.items) {
        this.items = data.items.map(item => 
          item instanceof ExerciseSet ? item : new ExerciseSet(item)
        );
        delete data.items;
      }
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
        'isCompleted',
        'Completed',
        () => this.isCompleted,
        (v: boolean) => this.isCompleted = v,
        'boolean'
      ),
    ];
  }

  /**
   * Create a new exercise set for this exercise
   */
  createNewItem(): EditableItemAbstract {
    return new ExerciseSet();
  }

  /**
   * Get computed tags for display
   */
  getTags(): string[] {
    const tags: string[] = [];
    if (this.items.length > 0) {
      tags.push(`${this.items.length} sets`);
    }
    return tags;
  }

  /**
   * Get total volume (weight × reps) for this exercise
   */
  getTotalVolume(): number {
    return this.items.reduce((total, set) => {
      const weight = set.weightKg || 0;
      const reps = set.repetitions || 0;
      return total + (weight * reps);
    }, 0);
  }

  /**
   * Get total duration for this exercise including rest times
   */
  getTotalDuration(): number {
    return this.items.reduce((total, set, index) => {
      const setDuration = set.duration || 0;
      const restTime = index < this.items.length - 1 ? set.rest : 0; // No rest after last set
      return total + setDuration + restTime;
    }, 0);
  }
}
