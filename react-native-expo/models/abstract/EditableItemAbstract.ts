import { FieldDescriptor, FieldMap, ValidationUtils } from '../utils';

/**
 * Base abstract class for all editable items
 * Equivalent to Dart's EditableItemAbstract
 */
export abstract class EditableItemAbstract {
  name: string = '';
  tags: string[] = [];

  constructor() {}

  /**
   * Get editable fields for dynamic form generation
   */
  abstract getEditableFields(): FieldDescriptor[];

  /**
   * Update multiple fields at once
   */
  updateFields(values: FieldMap, obj?: any): void {
    const fields = this.getEditableFields();
    
    for (const field of fields) {
      if (values.hasOwnProperty(field.name)) {
        const value = values[field.name];
        
        switch (field.type) {
          case 'string':
            field.setter(ValidationUtils.parseString(value));
            break;
          case 'number':
            field.setter(ValidationUtils.parseInt(value, field.getter() as number));
            break;
          case 'double':
            field.setter(ValidationUtils.parseFloat(value, field.getter() as number));
            break;
          case 'boolean':
            field.setter(ValidationUtils.parseBoolean(value));
            break;
        }
      }
    }
  }

  /**
   * Copy the last item from a collection (if this item has sub-items)
   */
  copyLastItem(): EditableItemAbstract | null {
    const items = (this as any).items as EditableItemAbstract[] | undefined;
    return items?.length ? items[items.length - 1] : null;
  }

  /**
   * Create a new sub-item for this item
   */
  createNewItem(): EditableItemAbstract | null {
    return null;
  }

  /**
   * Get a specific field value by name
   */
  getFieldValue(fieldName: string): any {
    const fields = this.getEditableFields();
    const field = fields.find(f => f.name === fieldName);
    return field?.getter();
  }

  /**
   * Update this item (placeholder for API integration)
   */
  update(appState: any, obj: any, values: FieldMap): void {
    // TODO: Implement API update logic
    this.updateFields(values, obj);
    console.log('Updated item:', this.name, values);
  }
}
