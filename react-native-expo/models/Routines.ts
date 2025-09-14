import {
  CardAbstract,
  CardListAbstract,
  IEntity,
  IFirestoreDoc,
  IFieldMetadata,
  FieldConverters,
} from "./Abstracts";

export type RoutineType = "other" | "exercises" | "meals";

export interface IRoutine extends IEntity {
  name: string;
  isCompleted: boolean;
  durationMin: number;
  routineType: RoutineType;
  ref: string;
}

export interface IRoutines extends IFirestoreDoc {
  wakeupTime?: string;
  items: IRoutine[];
}

export class Routine extends CardAbstract implements IRoutine {
  durationMin: number = 0;
  routineType: RoutineType = "other";
  ref: string = "";

  constructor() {
    super();
  }

  static fromJson(data: IRoutine): Routine {
    const routine = new Routine();
    Object.assign(routine, data);
    return routine;
  }

  getEditableFields(): IFieldMetadata[] {
    return [
      { field: "name", label: "Name", type: "string", keyboardType: "default", converter: FieldConverters.string },
      { field: "durationMin", label: "Duration (min)", type: "number", keyboardType: "number-pad", converter: FieldConverters.number },
      { field: "routineType", label: "Routine Type", type: "string", keyboardType: "default", converter: FieldConverters.string },
    ];
  }

  getTags(): string[] {
    const tags: string[] = [];
    if (this.durationMin > 0) tags.push(`${this.durationMin} min`);
    if (this.routineType !== "other") tags.push(this.routineType);
    return tags;
  }
}

export class Routines extends CardListAbstract<Routine> implements IRoutines {
  items: Routine[] = [];
  wakeupTime: string = "";

  constructor(data: IRoutines) {
    super(data, Routine);
    this.items = (data.items || []).map((item) => Routine.fromJson(item));
  }
}
