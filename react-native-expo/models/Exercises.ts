import {
  CardAbstract,
  CardListAbstract,
  IEntity,
  IFirestoreDoc,
  SubCardAbstract,
} from "./Abstracts";

export interface IExerciseSet {
  name: string;
  weightKg?: number;
  repetitions?: number;
  duration?: number;
  rest?: number;
}

export interface IExercise extends IEntity {
  name: string;
  isCompleted: boolean;
  items: IExerciseSet[];
}

export interface IExercises extends IFirestoreDoc {
  atHome?: boolean;
  availableTimeMin?: number;
  notes?: string;
  items: Exercise[];
  durationMin?: number;
}

export class ExerciseSet extends SubCardAbstract implements IExerciseSet {
  weightKg?: number;
  repetitions?: number;
  duration?: number;
  rest: number = 90;

  constructor(data: IExerciseSet) {
    super(data);
    this.name = this.getName();
  }

  getEditableFields(): string[] {
    return ["weightKg", "repetitions", "duration", "rest"];
  }

  getName(): string {
    const parts: string[] = [];
    if (this.weightKg != null) parts.push(`${this.weightKg}kg`);
    if (this.repetitions != null) parts.push(`${this.repetitions} reps`);
    if (this.duration != null) parts.push(`${this.duration}s`);
    return parts.length > 0 ? parts.join(" × ") : "Set";
  }
}

export class Exercise extends CardAbstract implements IExercise {
  items: ExerciseSet[] = [];

  constructor(data: IExercise) {
    super(data);
    this.items = data.items.map((item) => new ExerciseSet(item));
  }

  getEditableFields(): string[] {
    return ["name"];
  }
}

export class Exercises extends CardListAbstract implements IExercises {
  items: Exercise[] = [];
  atHome?: boolean;
  availableTimeMin?: number;
  notes?: string;
  durationMin?: number;

  constructor(data: IExercises) {
    super(data);
    this.items = data.items.map((item) => new Exercise(item));
  }
}
