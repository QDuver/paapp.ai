import { fieldConverter, getCurrentDate } from "../utils/utils";
import { CardAbstract, FirestoreDocAbstract, IFieldMetadata, SubCardAbstract, IUIMetadata } from "./Abstracts";

export class Ingredient extends SubCardAbstract {
  private _name: string = "";
  quantity: number;
  calories: number;

  constructor(data: any = {}) {
    super(data);
    this._name = data.name || "";
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  getEditableFields(): IFieldMetadata[] {
    return [
      {
        field: "name",
        label: "Ingredient Name",
        type: "string",
        keyboardType: "default",
        converter: fieldConverter.string,
        placeholder: "e.g., Chicken breast, Rice, Broccoli",
      },
      {
        field: "quantity",
        label: "Quantity",
        type: "number",
        keyboardType: "number-pad",
        converter: fieldConverter.number,
        placeholder: "0",
      },
      {
        field: "calories",
        label: "Calories",
        type: "number",
        keyboardType: "number-pad",
        converter: fieldConverter.number,
        placeholder: "500 kcal",
      },
    ];
  }

  getTags(): string[] {
    const tags: string[] = [];
    if (this.quantity > 0) tags.push(`Qty: ${this.quantity}`);
    if (this.calories > 0) tags.push(`${this.calories} cal`);
    return tags;
  }
}

export class Meal extends CardAbstract {
  instructions: string = "";
  calories: number;

  constructor(data) {
    super(data, Ingredient);
  }

  getEditableFields(): IFieldMetadata[] {
    return [
      {
        field: "name",
        label: "Meal Name",
        type: "string",
        keyboardType: "default",
        converter: fieldConverter.string,
        placeholder: "e.g., Breakfast, Lunch, Dinner",
      },
      {
        field: "instructions",
        label: "Instructions",
        type: "string",
        keyboardType: "default",
        multiline: true,
        converter: fieldConverter.string,
        placeholder: "Describe how to prepare this meal...",
      },
      {
        field: "calories",
        label: "Calories",
        type: "number",
        keyboardType: "number-pad",
        converter: fieldConverter.number,
        placeholder: "1200 kcal",
      },
    ];
  }

  getTags(): string[] {
    const tags: string[] = [];
    if (this.calories > 0) tags.push(`${this.calories} cal`);
    if (this.items.length > 0) {
      tags.push(`${this.items.length} ingredients`);
    }
    return tags;
  }
}

export class Meals extends FirestoreDocAbstract {
  notes: string = "";
  collection = "meals";

  constructor(data?) {
    super(data, Meal);
  }

  static getUIMetadata(): IUIMetadata {
    return {
      key: "meals",
      title: "Meals",
      focusedIcon: "food-apple",
      unfocusedIcon: "food-apple-outline",
      generateTitle: "New Meal Plan",
      settingsOptions: [
        {
          label: "New Meal Plan",
          action: "generate" as const,
          icon: "auto-fix",
        },
        {
          label: "Objectives",
          action: "editPrompt" as const,
          icon: "pencil",
        },
        {
          label: "Duplicate",
          action: "duplicate" as const,
          icon: "content-copy",
        },
        {
          label: "Delete",
          action: "delete" as const,
          icon: "delete",
        },
      ],
    };
  }

  getEditableFields(): IFieldMetadata[] {
    return [
      {
        field: "notes",
        label: "I have carrots left in the fridge, I want something quick to cook, etc...",
        type: "string",
        keyboardType: "default",
        converter: fieldConverter.string,
        multiline: true,
        placeholder: "e.g., Ingredients left in the fridge, budget, any other notes...",
      },
    ];
  }
}
