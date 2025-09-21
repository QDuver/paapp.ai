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

export interface IFieldMetadata<T = string> {
  field: string;
  label: string;
  type: 'string' | 'number' | 'boolean';
  keyboardType?: 'default' | 'number-pad' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  converter?: (value: string) => any;
  suggestions?: T[];
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

export abstract class BaseEditableEntity<T = string> {
  constructor() {
    // Default constructor - subclasses set their own defaults
  }

  static fromJson(data: any): BaseEditableEntity<any> {
    const instance = new (this as any)();
    Object.assign(instance, data);
    return instance;
  }

  abstract getEditableFields(parent?: any): IFieldMetadata<T>[];

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

export abstract class SubCardAbstract<T = string> extends BaseEditableEntity<T> {
  abstract get name(): string;
  
  constructor() {
    super();
  }

  getEditableFields(parent?: any): IFieldMetadata<T>[] {
    return [];
  }
}

export abstract class CardAbstract<T = string> extends BaseEditableEntity<T> {
  name: string = '';
  isCompleted: boolean = false;
  isExpanded: boolean = true;
  canAddItems: boolean = true;
  items: SubCardAbstract[] = [];
  id?: string;

  constructor() {
    super();
  }

  getEditableFields(parent?: any): IFieldMetadata<T>[] {
    return [];
  }

  onComplete() {
    this.isCompleted = !this.isCompleted;
    if (this.isCompleted) {
      this.isExpanded = false;
    }
  }

  onToggleExpand() {
    if ((this.items && this.items.length > 0) || this.createNewSubCard() !== null) {
      this.isExpanded = !this.isExpanded;
    }
  }

  createNewSubCard(): SubCardAbstract | null {
    return null; // Base implementation returns null (no subcards supported)
  }

  shouldSkipDialogForNewSubCard(): boolean {
    return false; // Base implementation always shows dialog
  }
}

export abstract class CardListAbstract<T extends CardAbstract<any>> {
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
