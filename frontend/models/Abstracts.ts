import useApi from "../hooks/useApi";
import { FormDataUtils } from "../utils/utils";

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
  type: "string" | "number" | "boolean";
  keyboardType?:
    | "default"
    | "number-pad"
    | "numeric"
    | "email-address"
    | "phone-pad";
  multiline?: boolean;
  placeholder?: string;
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
  boolean: (value: string) => value === "true",
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

  abstract getEditableFields(): IFieldMetadata<T>[];

  getTags(): string[] {
    return [];
  }

  toFormData(): { [key: string]: any } {
    return FormDataUtils.toFormData(this, () => this.getEditableFields());
  }

  fromFormData(formData: { [key: string]: any }): { [key: string]: any } {
    return FormDataUtils.fromFormData(formData, () => this.getEditableFields());
  }

  onDialogSave(formData: { [key: string]: any }, parent: any): void {
    const data = FormDataUtils.fromFormData(formData, () =>
      this.getEditableFields()
    );
    const editableFields = this.getEditableFields();
    editableFields.forEach(fieldMetadata => {
      const fieldName = fieldMetadata.field;
      if (data.hasOwnProperty(fieldName)) {
        const value = data[fieldName];
        (this as any)[fieldName] = value === 0 ? null : value;
      }
    });

    if (parent) { //new Items
      (parent as any).items.push(this);
    }

  }

  delete(parent: CardListAbstract<any> | CardAbstract): boolean {
    if (parent.items && Array.isArray(parent.items)) {
      const itemIndex = parent.items.findIndex(item => item === this);
      if (itemIndex !== -1) {
        parent.items.splice(itemIndex, 1);
        return true;
      }
    }

    return false;
  }

  handleSuggestionSelect(suggestion: any): void {
    return null;
  }
}

export abstract class SubCardAbstract<
  T = string,
> extends BaseEditableEntity<T> {
  abstract get name(): string;

  constructor() {
    super();
  }

  getEditableFields(): IFieldMetadata<T>[] {
    return [];
  }
}

export abstract class CardAbstract<T = string> extends BaseEditableEntity<T> {
  name: string = "";
  isCompleted: boolean = false;
  isExpanded: boolean = true;
  canAddItems: boolean = true;
  items: SubCardAbstract[] = [];
  id?: string;

  constructor() {
    super();
  }

  getEditableFields(): IFieldMetadata<T>[] {
    return [];
  }

  onComplete() {
    this.isCompleted = !this.isCompleted;
    if (this.isCompleted) {
      this.isExpanded = false;
    }
  }

  onToggleExpand() {
    if (
      (this.items && this.items.length > 0) ||
      this.createNewSubCard() !== null
    ) {
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

export abstract class CardListAbstract<
  T extends CardAbstract<any>,
> extends BaseEditableEntity {
  items: T[] = [];
  collection: string;
  id: string;
  private childConstructor: new () => T;

  constructor(data: any, childConstructor: new () => T) {
    super();
    Object.assign(this, data);
    this.childConstructor = childConstructor;
  }

  createChild(): T {
    return new this.childConstructor();
  }
}
