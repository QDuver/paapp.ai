import { FormDataUtils, getBaseUrl, getCurrentDate } from "../utils/utils";
import { apiClient } from "../utils/apiClient";
import { get } from "lodash";

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

export interface ISettingsOption {
  label: string;
  onPress: (param?: string) => void | Promise<void>;
}

export interface IUIMetadata {
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon: string;
  generateTitle?: string;
  settingsOptions?: ISettingsOption[];
}

export abstract class DialogableAbstract {
  constructor(data: any = {}) {
    Object.assign(this, data);
  }

  getEditableFields(): IFieldMetadata[] {
    return [];
  }

  getTags(): string[] {
    return [];
  }

  toFormData(): { [key: string]: any } {
    return FormDataUtils.toFormData(this, () => this.getEditableFields());
  }

  fromFormData(formData: { [key: string]: any }): { [key: string]: any } {
    return FormDataUtils.fromFormData(formData, () => this.getEditableFields());
  }

  onSave(
    fsDoc: FirestoreDocAbstract,
    formData: { [key: string]: any },
    parent: any,
    isNew: boolean,
    setRefreshCounter: React.Dispatch<React.SetStateAction<number>>
  ): void {
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
    setRefreshCounter(prev => prev + 1);
    fsDoc.onSave();
  }

  delete(fsDoc: FirestoreDocAbstract, parent: FirestoreDocAbstract | CardAbstract) {
    if (parent.items && Array.isArray(parent.items)) {
      const itemIndex = parent.items.findIndex((item: any) => item === this);
      if (itemIndex !== -1) {
        parent.items.splice(itemIndex, 1);
        fsDoc.onSave();
      }
    }
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
  ChildModel: any;

  constructor(data, ChildModel) {
    super(data);
    this.ChildModel = ChildModel;
    this.isExpanded = !this.isCompleted;
    this.items = data?.items?.map(item => new ChildModel(item)) || [];
  }

  getEditableFields(): IFieldMetadata[] {
    return [];
  }

  onComplete(fsDoc: FirestoreDocAbstract) {
    this.isCompleted = !this.isCompleted;
    if (this.isCompleted) {
      this.isExpanded = false;
    }
    fsDoc.onSave();
  }

  onToggleExpand(fsDoc: FirestoreDocAbstract) {
    if ((this.items && this.items.length > 0) || this.createNewSubCard() !== null) {
      this.isExpanded = !this.isExpanded;
    }
    fsDoc.onSave();
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
    if (!this.ChildModel) return null;
    return new this.ChildModel();
  }

  skipDialogForNewChild(): boolean {
    return false;
  }
}

export abstract class FirestoreDocAbstract extends DialogableAbstract {
  items: [] = [];
  abstract collection: string;
  id: string = getCurrentDate();
  ChildModel: any;

  constructor(data, ChildModel) {
    super(data);
    if (!ChildModel || !data) return;
    this.ChildModel = ChildModel;
    this.items = data.items?.map(item => new ChildModel(item)) || [];
  }

  static getUIMetadata(): IUIMetadata {
    throw new Error("getUIMetadata must be implemented by subclass");
  }

  static async fromApi<T extends FirestoreDocAbstract>(this: new (data?: any) => T): Promise<T> {
    const t = new this();
    const response = await apiClient.get(t.apiUrl);
    return new this(response);
  }

  static async buildWithAi<T extends FirestoreDocAbstract>(formData: { [key: string]: any }, setIsLoading, setData) {

    setIsLoading(true);
    
    const response = await apiClient.post(`build-with-ai/${this.apiUrl}`, formData);

    setData(prevData => ({ ...prevData, [t.collection]: response }));
    setIsLoading(false);
  }

  get apiUrl(): string {
    return `${this.collection}/${this.id}`;
  }

  createCard(): CardAbstract {
    return new this.ChildModel();
  }

  async onSave() {
    await apiClient.post(this.apiUrl, this);
  }
}
