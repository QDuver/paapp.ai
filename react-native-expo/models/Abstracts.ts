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

export interface IFieldMetadata {
  field: string;
  label: string;
  type: 'string' | 'number' | 'boolean';
  keyboardType?: 'default' | 'number-pad' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  converter?: (value: string) => any;
}

// Standard field converters
export const FieldConverters = {
  string: (value: string) => value,
  number: (value: string) => {
    const numValue = Number(value);
    return isNaN(numValue) ? 0 : numValue;
  },
  boolean: (value: string) => value === 'true',
};

export abstract class BaseEditableEntity {
  constructor() {
    // Default constructor - subclasses set their own defaults
  }

  static fromJson(data: any): BaseEditableEntity {
    const instance = new (this as any)();
    Object.assign(instance, data);
    return instance;
  }

  abstract getEditableFields(): IFieldMetadata[];

  getTags(): string[] {
    return [];
  }

  update(formData: { [key: string]: any }): void {
    const editableFields = this.getEditableFields();
    console.log('formData', formData);
    console.log('editableFields', editableFields)
    editableFields.forEach((fieldMetadata) => {
      const fieldName = fieldMetadata.field;
      if (formData.hasOwnProperty(fieldName)) {
        (this as any)[fieldName] = formData[fieldName];
      }
    });

  }

  delete(parent: CardListAbstract<any> | CardAbstract): boolean {
    if (parent.items && Array.isArray(parent.items)) {
      const itemIndex = parent.items.findIndex((item) => item === this);
      if (itemIndex !== -1) {
        parent.items.splice(itemIndex, 1);
        return true;
      }
    }
    
    return false; // Item not found
  }

}

export abstract class SubCardAbstract extends BaseEditableEntity {
  abstract get name(): string;
  
  constructor() {
    super();
  }

  getEditableFields(): IFieldMetadata[] {
    return [];
  }
}

export abstract class CardAbstract extends BaseEditableEntity {
  name: string = '';
  isCompleted: boolean = false;
  isExpanded: boolean = true;
  canAddItems: boolean = true;
  items: SubCardAbstract[] = [];
  id?: string;

  constructor() {
    super();
  }

  getEditableFields(): IFieldMetadata[] {
    return [];
  }

  onComplete() {
    this.isCompleted = !this.isCompleted;
    if (this.isCompleted) {
      this.isExpanded = false;
    }
  }

  onToggleExpand() {
    // Allow expanding if there are existing subcards OR this card supports creating subcards
    if ((this.items && this.items.length > 0) || this.createNewSubCard() !== null) {
      this.isExpanded = !this.isExpanded;
    }
  }

  // Method to create a new subcard - to be implemented by subclasses
  createNewSubCard(): SubCardAbstract | null {
    return null; // Base implementation returns null (no subcards supported)
  }

  // Method to add a new subcard to this card
  addNewSubCard(): SubCardAbstract | null {
    const newSubCard = this.createNewSubCard();
    if (newSubCard && this.items) {
      this.items.push(newSubCard);
      // Ensure the card is expanded to show the new subcard
      this.isExpanded = true;
    }
    return newSubCard;
  }
}

export abstract class CardListAbstract<T extends CardAbstract> {
  items: T[] = [];
  collection: string;
  id: string;
  private childConstructor: new () => T;

  constructor(data: any, childConstructor: new () => T) {
    Object.assign(this, data);
    this.childConstructor = childConstructor;
  }

  createNewItem(): T {
    return new this.childConstructor();
  }
}
