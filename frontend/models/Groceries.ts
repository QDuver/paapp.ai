import { fieldConverter } from "../utils/utils";
import { CardAbstract, FirestoreDocAbstract, IFieldMetadata, IUIMetadata } from "./Abstracts";
import { theme } from "../styles/theme";


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

  static uiMetadata = {
    key: "groceries" as const,
    title: "Groceries",
    focusedIcon: "cart",
    unfocusedIcon: "cart-outline",
    color: theme.colors.sections.groceries.accent,
  };

  constructor(data?) {
    super(data, Grocery);
  }
}
