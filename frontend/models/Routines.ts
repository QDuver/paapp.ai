import { fieldConverter } from "../utils/utils";
import { CardAbstract, FirestoreDocAbstract, IFieldMetadata, IUIMetadata } from "./Abstracts";
import { theme } from "../styles/theme";


export class Routine extends CardAbstract {
  durationMin: number = 0;

  getEditableFields(): IFieldMetadata[] {
    return [
      {
        field: "name",
        label: "Name",
        type: "string",
        keyboardType: "default",
        converter: fieldConverter.string,
        placeholder: "Enter routine name",
      },
    ];
  }
}

export class Routines extends FirestoreDocAbstract {
  collection = "routines";

  static uiMetadata = {
    key: "routines" as const,
    title: "Routines",
    focusedIcon: "clock",
    unfocusedIcon: "clock-outline",
    color: theme.colors.sections.routines.accent,
  };

  constructor(data?) {
    super(data, Routine);
  }
}
