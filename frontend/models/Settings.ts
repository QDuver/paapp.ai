import { FirestoreDocAbstract, IFieldMetadata } from "./Abstracts";

export interface IModule {
  enabled: boolean;
  prompt?: string;
}

export class Settings extends FirestoreDocAbstract {
  collection = "settings";
  id = "settings";
  routines: IModule;
  exercises: IModule;
  meals: IModule;

  constructor(data) {
    super(data, null);
  }
}
