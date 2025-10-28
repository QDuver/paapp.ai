import { fieldConverter } from "../utils/utils";
import { CardAbstract, FirestoreDocAbstract, IFieldMetadata, IUIMetadata } from "./Abstracts";


export class Grocery extends CardAbstract {
  durationMin: number = 0;

  getEditableFields(): IFieldMetadata[] {
    return [
      {
        field: "name",
        label: "Name",
        type: "string",
        keyboardType: "default",
        converter: fieldConverter.string,
        placeholder: "",
      },
    ];
  }
}

export class Groceries extends FirestoreDocAbstract {
  collection = "groceries";
  id = "all";

  constructor(data?) {
    super(data, Grocery);
  }

  static getUIMetadata(): IUIMetadata {
    return {
      key: "groceries",
      title: "Groceries",
      focusedIcon: "cart",
      unfocusedIcon: "cart-outline",
    };
  }
}
