import { FormDataUtils } from "../utils/utils";

export interface IUnique {
  name: string;
  items: any[];
}

export interface IFieldMetadata<T = string> {
  field: string;
  label: string;
  type: "string" | "number" | "boolean";
  keyboardType?: "default" | "number-pad" | "numeric" | "email-address" | "phone-pad";
  multiline?: boolean;
  placeholder?: string;
  converter?: (value: string) => any;
  suggestions?: T[];
}

export abstract class DialogableAbstract<T = string> {
  static fromJson(data: any): DialogableAbstract<any> {
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

  onSave(formData: { [key: string]: any }, parent: any, isNew: boolean): void {
    const data = FormDataUtils.fromFormData(formData, () => this.getEditableFields());
    const editableFields = this.getEditableFields();
    editableFields.forEach(fieldMetadata => {
      const fieldName = fieldMetadata.field;
      if (data.hasOwnProperty(fieldName)) {
        const value = data[fieldName];
        (this as any)[fieldName] = value === 0 ? null : value;
      }
    });

    if (parent && isNew) {
      parent.items.push(this);
    }
  }

  delete(parent: FirestoreDocAbstract<any> | CardAbstract): boolean {
    if (parent.items && Array.isArray(parent.items)) {
      const itemIndex = parent.items.findIndex(item => item === this);
      if (itemIndex !== -1) {
        parent.items.splice(itemIndex, 1);
        return true;
      }
    }

    return false;
  }
}

export abstract class SubCardAbstract<T = string> extends DialogableAbstract<T> {
  abstract get name(): string;
}

export abstract class CardAbstract<T = string> extends DialogableAbstract<T> {
  name: string = "";
  isCompleted: boolean = false;
  isExpanded: boolean = true;
  canAddItems: boolean = true;
  items: SubCardAbstract[] = [];
  id?: string;

  constructor() {
    super();
    this.isExpanded = !this.isCompleted;
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
    if ((this.items && this.items.length > 0) || this.createNewSubCard() !== null) {
      this.isExpanded = !this.isExpanded;
    }
  }

  handleSuggestionSelect(suggestion: IUnique): void {
    this.name = suggestion.name;
    this.items = suggestion.items.map((data: SubCardAbstract) => {
      const subCard = this.createNewSubCard();
      Object.assign(subCard, data);
      return subCard;
    });
  }

  createNewSubCard(): SubCardAbstract | null {
    return null;
  }

  shouldSkipDialogForNewSubCard(): boolean {
    return false;
  }
}

export abstract class FirestoreDocAbstract<T> extends DialogableAbstract {
  items: T[] = [];
  collection: string;
  id: string;
  childModel: any;

  constructor(data, childModel) {
    super();
    this.childModel = childModel;
    Object.assign(this, data);
    this.items = data.items.map(item => childModel.fromJson(item));
  }

  createCard(): T {
    return new this.childModel();
  }
}
