import {
  CardAbstract,
  CardListAbstract,
  IEntity,
  IFirestoreDoc,
  SubCardAbstract,
  IFieldMetadata,
  FieldConverters,
} from "./Abstracts";
import useApi from "../hooks/useApi";

export interface IExerciseUnique {
  name: string;
  items: IExerciseSet[];
}

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
      {
        field: "weightKg",
        label: "Weight (kg)",
        type: "number",
        keyboardType: "number-pad",
        converter: FieldConverters.number,
        placeholder: "0",
      },
      {
        field: "repetitions",
        label: "Repetitions",
        type: "number",
        keyboardType: "number-pad",
        converter: FieldConverters.number,
        placeholder: "0",
      },
      {
        field: "duration",
        label: "Duration (s)",
        type: "number",
        keyboardType: "number-pad",
        converter: FieldConverters.number,
        placeholder: "0",
      },
      {
        field: "rest",
        label: "Rest (s)",
        type: "number",
        keyboardType: "number-pad",
        converter: FieldConverters.number,
        placeholder: "0",
      },
    ];
  }

  onDialogSave(rawData: { [key: string]: any }, parent: any): void {
    super.onDialogSave(rawData, parent);

    if (parent) {
      this.editSubsequentSets(parent);
    }
  }

  editSubsequentSets(parent: Exercise): void {
    const currentIndex = parent.items.findIndex((set) => set === this);
    if (currentIndex === -1 || currentIndex === parent.items.length - 1) {
      return; // This set is not found or is the last set
    }

    for (let i = currentIndex + 1; i < parent.items.length; i++) {
      const subsequentSet = parent.items[i];
      subsequentSet.weightKg = this.weightKg;
      subsequentSet.repetitions = this.repetitions;
      subsequentSet.duration = this.duration;
      subsequentSet.rest = this.rest;
    }
  }
}

export class Exercise
  extends CardAbstract<IExerciseUnique>
  implements IExercise
{
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

  getEditableFields(): IFieldMetadata<IExerciseUnique>[] {
    return [
      {
        field: "name",
        label: "Exercise Name",
        type: "string",
        keyboardType: "default",
        converter: FieldConverters.string,
        suggestions: [],
        placeholder: "e.g., Push-ups, Squats, Deadlifts",
      },
    ];
  }

  createNewSubCard(): ExerciseSet {
    const newSet = new ExerciseSet();

    if (this.items && this.items.length > 0) {
      const lastSet = this.items[this.items.length - 1];
      newSet.weightKg = lastSet.weightKg;
      newSet.repetitions = lastSet.repetitions;
      newSet.duration = lastSet.duration;
      newSet.rest = lastSet.rest;
    }

    return newSet;
  }

  shouldSkipDialogForNewSubCard(): boolean {
    return this.items && this.items.length > 0;
  }

  handleSuggestionSelect(suggestion: IExerciseUnique): void {
    this.name = suggestion.name;
    this.items = suggestion.items.map((setData: IExerciseSet) => {
      const exerciseSet = this.createNewSubCard();
      Object.assign(exerciseSet, setData);
      return exerciseSet;
    });
  }
}

export class Exercises
  extends CardListAbstract<Exercise>
  implements IExercises
{
  items: Exercise[] = [];
  atHome?: boolean;
  availableTimeMin?: number;
  notes?: string;
  durationMin?: number;

  constructor(data: IExercises) {
    super(data, Exercise);
    this.items = data.items.map((item) => Exercise.fromJson(item));
  }

  getEditableFields(): IFieldMetadata[] {
    return [
      {
        field: "atHome",
        label: "At Home",
        type: "boolean",
        keyboardType: "default",
        converter: FieldConverters.boolean,
      },
      {
        field: "notes",
        label: "Notes (Optional)",
        type: "string",
        keyboardType: "default",
        converter: FieldConverters.string,
        multiline: true,
        placeholder: "Add any additional notes about this workout session...",
      },
    ];
  }
}
