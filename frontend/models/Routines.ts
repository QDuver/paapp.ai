import { fieldConverter } from "../utils/utils";
import { CardAbstract, FirestoreDocAbstract, IFieldMetadata } from "./Abstracts";

export type RoutineType = "other" | "exercises" | "meals";

export class Routine extends CardAbstract {
  durationMin: number = 0;
  routineType: RoutineType = "other";

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
      {
        field: "durationMin",
        label: "Duration (min)",
        type: "number",
        keyboardType: "number-pad",
        converter: fieldConverter.number,
        placeholder: "0",
      },
      {
        field: "routineType",
        label: "Routine Type",
        type: "string",
        keyboardType: "default",
        converter: fieldConverter.string,
        placeholder: "e.g., Morning, Evening, Work",
      },
    ];
  }

  getTags(): string[] {
    const tags: string[] = [];
    if (this.durationMin > 0) tags.push(`${this.durationMin} min`);
    if (this.routineType !== "other") tags.push(this.routineType);
    return tags;
  }
}

export class Routines extends FirestoreDocAbstract {
  wakeupTime: string = "";
  collection = "routines";

  constructor(data?) {
    super(data, Routine);
  }

  static getUIMetadata() {
    return {
      key: "routines",
      title: "Routines",
      focusedIcon: "clock",
      unfocusedIcon: "clock-outline",
      settingsOptions: [
        {
          label: 'Configure Routines',
          onPress: () => console.log('Configure Routines')
        },
        {
          label: 'Delete',
          onPress: () => console.log('Delete - Routines')
        }
      ]
    };
  }
}
