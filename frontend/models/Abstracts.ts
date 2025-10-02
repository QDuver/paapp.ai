import { FormDataUtils } from "../utils/utils";

export interface IUnique {
  name: string;
  items: any[];
}

export interface IFieldMetadata {
  field: string;
  label: string;
  type: "string" | "number" | "boolean";
  keyboardType?: "default" | "number-pad" | "numeric" | "email-address" | "phone-pad";
  multiline?: boolean;
  placeholder?: string;
  converter?: (value: string) => any;
  suggestions?: [];
}

export abstract class DialogableAbstract {
  constructor(data: any = {}) {
    Object.assign(this, data);
  }

  abstract getEditableFields(): IFieldMetadata[];

  getTags(): string[] {
    return [];
  }

  toFormData(): { [key: string]: any } {
    return FormDataUtils.toFormData(this, () => this.getEditableFields());
  }

  fromFormData(formData: { [key: string]: any }): { [key: string]: any } {
    return FormDataUtils.fromFormData(formData, () => this.getEditableFields());
  }

  onSave(fsDoc: FirestoreDocAbstract, formData: { [key: string]: any }, parent: any, isNew: boolean): void {
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

    fsDoc.onSave();
  }

  delete(parent: FirestoreDocAbstract | CardAbstract): boolean {
    if (parent.items && Array.isArray(parent.items)) {
      const itemIndex = parent.items.findIndex((item: any) => item === this);
      if (itemIndex !== -1) {
        parent.items.splice(itemIndex, 1);
        return true;
      }
    }
    return false;
  }
}

export abstract class SubCardAbstract extends DialogableAbstract {
  abstract get name(): string;
}

export abstract class CardAbstract extends DialogableAbstract {
  name: string;
  isCompleted: boolean;
  isExpanded: boolean;
  canAddItems: boolean;
  items: SubCardAbstract[];

  constructor(data, ChildModel) {
    super(data);
    this.isExpanded = !this.isCompleted;
    this.items = data?.items?.map(item => new ChildModel(item)) || [];
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

export abstract class FirestoreDocAbstract extends DialogableAbstract {
  items: [] = [];
  collection: string;
  id: string;
  ChildModel: any;

  constructor(data, ChildModel) {
    super(data);
    this.ChildModel = ChildModel;
    this.items = data.items.map(item => new ChildModel(item));
  }

  createCard(): CardAbstract {
    return new this.ChildModel();
  }

  onSave() {
    console.log("SAVING FS DOC");
  }
}
