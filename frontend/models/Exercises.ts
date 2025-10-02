import { fieldConverter } from "../utils/utils";
import { CardAbstract, FirestoreDocAbstract, IFieldMetadata, IUnique, SubCardAbstract } from "./Abstracts";
export class ExerciseSet extends SubCardAbstract {
  weightKg?: number;
  repetitions?: number;
  duration?: number;
  rest?: number;

  static fromJson(data): ExerciseSet {
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
        converter: fieldConverter.number,
        placeholder: "0",
      },
      {
        field: "repetitions",
        label: "Repetitions",
        type: "number",
        keyboardType: "number-pad",
        converter: fieldConverter.number,
        placeholder: "0",
      },
      {
        field: "duration",
        label: "Duration (s)",
        type: "number",
        keyboardType: "number-pad",
        converter: fieldConverter.number,
        placeholder: "0",
      },
      {
        field: "rest",
        label: "Rest (s)",
        type: "number",
        keyboardType: "number-pad",
        converter: fieldConverter.number,
        placeholder: "0",
      },
    ];
  }

  onSave(rawData: { [key: string]: any }, parent: any, isNew: boolean): void {
    super.onSave(rawData, parent, isNew);

    if (parent) {
      this.editSubsequentSets(parent);
    }
  }

  editSubsequentSets(parent: Exercise): void {
    const currentIndex = parent.items.findIndex(set => set === this);
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

export class Exercise extends CardAbstract<ExerciseSet> {
  items: ExerciseSet[] = [];

  constructor() {
    super();
  }

  static fromJson(data): Exercise {
    const exercise = new Exercise();
    Object.assign(exercise, data);
    exercise.items = data.items.map(item => ExerciseSet.fromJson(item));
    return exercise;
  }

  getEditableFields(): IFieldMetadata<ExerciseSet>[] {
    return [
      {
        field: "name",
        label: "Exercise Name",
        type: "string",
        keyboardType: "default",
        converter: fieldConverter.string,
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
}

export class Exercises extends FirestoreDocAbstract<Exercise> {
  notes?: string;

  constructor(data) {
    super(data, Exercise);
  }

  getEditableFields(): IFieldMetadata[] {
    return [
      {
        field: "notes",
        label: "Notes (Optional)",
        type: "string",
        keyboardType: "default",
        converter: fieldConverter.string,
        multiline: true,
        placeholder: "Add any additional notes about this workout session...",
      },
    ];
  }
}
