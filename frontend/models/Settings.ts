import { FirestoreDocAbstract, IFieldMetadata } from "./Abstracts";

export class SettingsModule {
  enabled: boolean;
  prompt?: string;

  onSave = (fsDoc: FirestoreDocAbstract, field: string, value: any, setRefreshCounter: React.Dispatch<React.SetStateAction<number>>) => {
    (this as any)[field] = value;
    setRefreshCounter(prev => prev + 1);
    fsDoc.onSave();
  };
}

export class Settings extends FirestoreDocAbstract {
  collection = "settings";
  id = "settings";
  routines: SettingsModule;
  exercises: SettingsModule;
  meals: SettingsModule;

  constructor(data) {
    super(data, null);
    if (data) {
      this.routines = Object.assign(new SettingsModule(), data.routines);
      this.exercises = Object.assign(new SettingsModule(), data.exercises);
      this.meals = Object.assign(new SettingsModule(), data.meals);
    }
  }
}
