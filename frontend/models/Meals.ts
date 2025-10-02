import { fieldConverter } from "../utils/utils";
import { CardAbstract, CardListAbstract, IEntity, IFirestoreDoc, SubCardAbstract, IFieldMetadata } from "./Abstracts";

export interface IIngredient {
  name: string;
  quantity: number;
  calories: number;
}

export interface IMeal extends IEntity {
  name: string;
  instructions?: string;
  calories?: number;
  items?: IIngredient[];
}

export interface IMeals extends IFirestoreDoc {
  items: IMeal[];
  notes?: string;
}

export class Ingredient extends SubCardAbstract implements IIngredient {
  private _name: string = "";
  quantity: number = 0.0;
  calories: number = 0;

  constructor() {
    super();
  }

  static fromJson(data: IIngredient): Ingredient {
    const ingredient = new Ingredient();
    Object.assign(ingredient, data);
    ingredient._name = data.name;
    return ingredient;
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
        placeholder: "0",
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

export class Meal extends CardAbstract implements IMeal {
  items: Ingredient[] = [];
  instructions: string = "";
  calories: number = 0;

  constructor() {
    super();
  }

  static fromJson(data: IMeal): Meal {
    const meal = new Meal();
    Object.assign(meal, data);
    meal.items = (data.items || []).map(item => Ingredient.fromJson(item));
    return meal;
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
        placeholder: "0",
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

  createNewSubCard(): Ingredient {
    return new Ingredient();
  }
}

export class Meals extends CardListAbstract<Meal> implements IMeals {
  items: Meal[] = [];
  notes: string = "";

  constructor(data: IMeals) {
    super(data, Meal);
    this.items = (data.items || []).map(item => Meal.fromJson(item));
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
        placeholder: "e.g., Ingredients left in the fridge, budget, any other notes...",
      },
    ];
  }
}
