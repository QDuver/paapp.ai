import {
  CardAbstract,
  CardListAbstract,
  IEntity,
  IFirestoreDoc,
  SubCardAbstract,
  IFieldMetadata,
  FieldConverters,
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
  rest?: number;

  constructor() {
    super();
  }

  static fromJson(data: IExerciseSet): ExerciseSet {
    const exerciseSet = new ExerciseSet();
    Object.assign(exerciseSet, data);
    return exerciseSet;
  }

  get name(): string {
    const parts: string[] = [];
    if (this.weightKg != null) parts.push(`${this.weightKg}kg`);
    if (this.repetitions != null) parts.push(`${this.repetitions} reps`);
    if (this.duration != null) parts.push(`${this.duration}s`);
    return parts.length > 0 ? parts.join(" × ") : "Set";
  }

  getEditableFields(): IFieldMetadata[] {
    return [
      { field: "weightKg", label: "Weight (kg)", type: "number", keyboardType: "number-pad", converter: FieldConverters.number },
      { field: "repetitions", label: "Repetitions", type: "number", keyboardType: "number-pad", converter: FieldConverters.number },
      { field: "duration", label: "Duration (s)", type: "number", keyboardType: "number-pad", converter: FieldConverters.number },
      { field: "rest", label: "Rest (s)", type: "number", keyboardType: "number-pad", converter: FieldConverters.number },
    ];
  }
}

export class Exercise extends CardAbstract implements IExercise {
  items: ExerciseSet[] = [];

  constructor() {
    super();
  }

  static fromJson(data: IExercise): Exercise {
    const exercise = new Exercise();
    Object.assign(exercise, data);
    exercise.items = data.items.map((item) => ExerciseSet.fromJson(item));
    return exercise;
  }

  getEditableFields(): IFieldMetadata[] {
    return [
      { field: "name", label: "Exercise Name", type: "string", keyboardType: "default", converter: FieldConverters.string },
    ];
  }

  createNewSubCard(): ExerciseSet {
    return new ExerciseSet();
  }
}

export class Exercises extends CardListAbstract<Exercise> implements IExercises {
  items: Exercise[] = [];
  atHome?: boolean;
  availableTimeMin?: number;
  notes?: string;
  durationMin?: number;

  constructor(data: IExercises) {
    super(data, Exercise);
    this.items = data.items.map((item) => Exercise.fromJson(item));
  }
}
