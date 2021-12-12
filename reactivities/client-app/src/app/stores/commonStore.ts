import { makeAutoObservable } from "mobx";
import { ServerError } from "./../models/serverError";

// storing api error in mobx store
export default class CommonStore {
  error: ServerError | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setServerError = (error: ServerError) => {
    this.error = error;
  };
}
