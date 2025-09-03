import { EditableItemAbstract } from './EditableItemAbstract';
import { FieldDescriptor } from '../utils';

/**
 * Base abstract class for all card items
 * Equivalent to Dart's CardAbstract
 */
export abstract class CardAbstract extends EditableItemAbstract {
  private _isCompleted: boolean = false;
  isExpanded: boolean = true;
  canAddItems: boolean = true;

  constructor() {
    super();
  }

  /**
   * Completion status with automatic expansion control
   */
  get isCompleted(): boolean {
    return this._isCompleted;
  }

  set isCompleted(value: boolean) {
    this._isCompleted = value;
    if (value) {
      this.isExpanded = false;
    }
  }

  /**
   * Abstract method that must be implemented by concrete classes
   */
  abstract getEditableFields(): FieldDescriptor[];
}
