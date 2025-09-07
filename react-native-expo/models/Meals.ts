import {
  CardAbstract,
  CardListAbstract,
  IEntity,
  IFirestoreDoc,
  SubCardAbstract,
} from "./Abstracts";

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
  name: string = "";
  quantity: number = 0.0;
  calories: number = 0;

  constructor(data: IIngredient) {
    super(data);
    Object.assign(this, data);
  }

  getEditableFields(): string[] {
    return ["name", "quantity", "calories"];
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

  constructor(data: IMeal) {
    super(data);
    this.items = (data.items || []).map((item) => new Ingredient(item));
  }

  getEditableFields(): string[] {
    return ["name", "instructions", "calories"];
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

export class Meals extends CardListAbstract implements IMeals {
  items: Meal[] = [];
  notes: string = "";

  constructor(data: IMeals) {
    super(data);
    this.items = (data.items || []).map((item) => new Meal(item));
  }
}
    