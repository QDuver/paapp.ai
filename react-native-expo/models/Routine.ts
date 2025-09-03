import { CardAbstract } from './abstract/CardAbstract';
import { FieldDescriptor } from './utils';

/**
 * Routine type enumeration
 * Equivalent to Dart's RoutineType enum
 */
export enum RoutineType {
  OTHER = 'other',
  EXERCISES = 'exercises',
  MEALS = 'meals'
}

/**
 * Routine model for routine cards
 * Equivalent to Dart's Routine class
 */
export class Routine extends CardAbstract {
  isExpanded: boolean = false;
  canAddItems: boolean = false;
  durationMin?: number;
  routineType: RoutineType = RoutineType.OTHER;
  ref?: any; // Reference to other objects (exercises, meals, etc.)

  constructor(data?: Partial<Routine>) {
    super();
    if (data) {
      // Handle routineType enum conversion
      if (data.routineType && typeof data.routineType === 'string') {
        this.routineType = data.routineType as RoutineType;
        delete data.routineType;
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
        'durationMin',
        'Duration (min)',
        () => this.durationMin,
        (v: number) => this.durationMin = v,
        'number'
      ),
      new FieldDescriptor(
        'routineType',
        'Routine Type',
        () => this.routineType,
        (v: string) => this.routineType = v as RoutineType,
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
   * Get computed tags for display
   */
  getTags(): string[] {
    const tags: string[] = [];
    if (this.durationMin) {
      tags.push(`${this.durationMin} min`);
    }
    if (this.routineType !== RoutineType.OTHER) {
      tags.push(this.routineType);
    }
    return tags;
  }

  /**
   * Routines don't typically have sub-items
   */
  createNewItem(): null {
    return null;
  }

  /**
   * Check if this routine is a reference to another collection
   */
  isReference(): boolean {
    return this.routineType !== RoutineType.OTHER;
  }

  /**
   * Get display name with duration if available
   */
  getDisplayName(): string {
    if (this.durationMin && this.durationMin > 0) {
      return `${this.name} (${this.durationMin} min)`;
    }
    return this.name;
  }
}
