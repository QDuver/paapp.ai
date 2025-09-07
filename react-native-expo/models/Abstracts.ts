export interface IEntity {
  name: string;
  items?: any[];
  isCompleted: boolean;
}

export interface IFirestoreDoc {
  id: string;
  collection: string;
  items: any[];
}

export abstract class BaseEditableEntity {
  name: string = "";

  constructor(data: any) {
    Object.assign(this, data);
  }

  abstract getEditableFields(): string[];

  getTags(): string[] {
    return [];
  }

  /**
   * Update the item fields from a form data object
   * Note: This method expects properly typed values (not strings)
   * For string-based updates, use updateFromStrings method instead
   */
  updateFromObject(formData: { [key: string]: any }): void {
    const editableFields = this.getEditableFields();
    console.log("editableFields", editableFields);

    editableFields.forEach((fieldName) => {
      if (formData.hasOwnProperty(fieldName)) {
        (this as any)[fieldName] = formData[fieldName];
      }
    });

    console.log('this', this);
    this.onFieldsUpdated();
  }

  /**
   * Update the item fields from string form data (legacy method)
   * This method handles type conversion from strings
   */
  updateFromStrings(formData: { [key: string]: string }): void {
    const editableFields = this.getEditableFields();

    editableFields.forEach((fieldName) => {
      if (formData.hasOwnProperty(fieldName)) {
        const currentValue = (this as any)[fieldName];
        const newValue = formData[fieldName];

        // Type conversion based on current field type
        if (typeof currentValue === "number") {
          const parsedValue = Number(newValue);
          if (!isNaN(parsedValue)) {
            (this as any)[fieldName] = parsedValue;
          }
        } else if (typeof currentValue === "boolean") {
          (this as any)[fieldName] = newValue === "true";
        } else {
          // String fields
          (this as any)[fieldName] = newValue;
        }
      }
    });

    this.onFieldsUpdated();
  }

  /**
   * Called after fields are updated to handle any derived field updates
   * Can be overridden in concrete classes
   */
  protected onFieldsUpdated(): void {
    // Update name if this item has a getName method
    if (typeof (this as any).getName === "function") {
      this.name = (this as any).getName();
    }
  }

  /**
   * Save the item - can be overridden to add API calls, etc.
   * Returns a promise that resolves when save is complete
   */
  async save(): Promise<void> {
    // Base implementation - can be overridden in concrete classes
    console.log("Entity saved:", this.name);
  }
}

export abstract class SubCardAbstract extends BaseEditableEntity {
  getEditableFields(): string[] {
    return [];
  }
}

export abstract class CardAbstract extends BaseEditableEntity {
  isCompleted: boolean = false;
  isExpanded: boolean = true;
  canAddItems: boolean = true;
  items: SubCardAbstract[] = [];
  id?: string;

  getEditableFields(): any[] {
    return [];
  }

  onComplete() {
    this.isCompleted = !this.isCompleted;
    if (this.isCompleted) {
      this.isExpanded = false;
    }
  }

  onToggleExpand() {
    if (this.items && this.items.length > 0) {
      this.isExpanded = !this.isExpanded;
    }
  }
}

export abstract class CardListAbstract {
  items: any[] = [];
  collection: string;
  id: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}
