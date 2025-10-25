export interface FetchOptions extends RequestInit {}

export enum RequestStatusType {
  LOADING = "loading",
  SUCCESS = "success",
  FAILURE = "failure",
}

export interface IEntity {
  name: string;
  items?: any[];
}

export interface IFirestoreDoc {
  id: string;
  collection: string;
  items: any[];
}
