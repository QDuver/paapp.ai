import { IFirestoreDoc } from "./Abstracts";

export interface IModule {
  enabled: boolean;
  prompt?: string;
}

export interface ISettings extends IFirestoreDoc {
  routines: IModule;
  exercises: IModule;
  meals: IModule;
}
