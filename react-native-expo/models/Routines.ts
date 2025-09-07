import {
  CardAbstract,
  CardListAbstract,
  IEntity,
  IFirestoreDoc,
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

  constructor(data: IRoutine) {
    super(data);
    Object.assign(this, data);
  }

  getEditableFields(): string[] {
    return ["name", "durationMin", "routineType"];
  }

  getTags(): string[] {
    const tags: string[] = [];
    if (this.durationMin > 0) tags.push(`${this.durationMin} min`);
    if (this.routineType !== "other") tags.push(this.routineType);
    return tags;
  }
}

export class Routines extends CardListAbstract implements IRoutines {
  items: Routine[] = [];
  wakeupTime: string = "";

  constructor(data: IRoutines) {
    super(data);
    this.items = (data.items || []).map((item) => new Routine(item));
  }
}
