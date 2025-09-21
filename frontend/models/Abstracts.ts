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

  toFormData(): { [key: string]: any } {
    const formData: { [key: string]: any } = {};
    this.getEditableFields().forEach((fieldMetadata) => {
      const fieldName = fieldMetadata.field;
      const value = (this as any)[fieldName];
      formData[fieldName] = value;
    });
    return formData;
  }

  fromFormData(formData: { [key: string]: any }): { [key: string]: any } {
    const convertedData: { [key: string]: any } = {};
    this.getEditableFields().forEach(fieldMetadata => {
      const fieldName = fieldMetadata.field;
      if (formData.hasOwnProperty(fieldName)) {
        const rawValue = formData[fieldName];
        const stringValue = rawValue === null || rawValue === undefined ? "" : rawValue.toString();
        convertedData[fieldName] = fieldMetadata.converter 
          ? fieldMetadata.converter(stringValue) 
          : stringValue;
      }
    });
    return convertedData;
  }

  update(rawData: { [key: string]: any }, parent: any, isNew: boolean): void {
    const data = this.fromFormData(rawData);
    const editableFields = this.getEditableFields();
    editableFields.forEach((fieldMetadata) => {
      const fieldName = fieldMetadata.field;
      if (data.hasOwnProperty(fieldName)) {
        const value = data[fieldName];
        (this as any)[fieldName] = value === 0 ? null : value;
      }
    });

    if(isNew){
      (parent as any).items.push(this);
    }

    console.log('Updated entity:', this);
    console.log('Parent after update:', parent);

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
    if ((this.items && this.items.length > 0) || this.createNewSubCard(this) !== null) {
      this.isExpanded = !this.isExpanded;
    }
  }

  // Method to create a new subcard - to be implemented by subclasses
  createNewSubCard(parent: CardAbstract | CardListAbstract<any>): SubCardAbstract | null {
    return null; // Base implementation returns null (no subcards supported)
  }

  // Method to determine if dialog should be skipped when creating new subcards
  shouldSkipDialogForNewSubCard(): boolean {
    return false; // Base implementation always shows dialog
  }

  // Method to add a new subcard to this card
  addNewSubCard(): SubCardAbstract | null {
    const newSubCard = this.createNewSubCard(this);
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
