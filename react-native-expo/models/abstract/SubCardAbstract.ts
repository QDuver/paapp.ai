import { EditableItemAbstract } from './EditableItemAbstract';

/**
 * Base abstract class for all sub-card items
 * Equivalent to Dart's SubCardAbstract
 */
export abstract class SubCardAbstract extends EditableItemAbstract {
  constructor() {
    super();
  }

  // Sub-cards typically don't have nested items, but can be overridden
  createNewItem(): EditableItemAbstract | null {
    return null;
  }
}
