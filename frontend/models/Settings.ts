import { FirestoreDocAbstract } from "./Abstracts";

export interface IModule {
  enabled: boolean;
  prompt?: string;
}

export interface ISettings extends FirestoreDocAbstract {
  routines: IModule;
  exercises: IModule;
  meals: IModule;
}
