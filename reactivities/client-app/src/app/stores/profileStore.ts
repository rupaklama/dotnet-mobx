import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Profile } from "../models/profile";
import store from "./store";

export default class ProfileStore {
  profile: Profile | null = null;
  isLoadingProfile = false;

  constructor() {
    makeAutoObservable(this);
  }

  /* to find if current profile is of current auth user */
  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile.username;
    }

    return false;
  }

  loadProfile = async (username: string) => {
    this.isLoadingProfile = true;

    try {
      const profile = await agent.Profiles.get(username);

      runInAction(() => {
        this.profile = profile;
        this.isLoadingProfile = false;
      });
    } catch (err) {
      console.error(err);

      runInAction(() => (this.isLoadingProfile = false));
    }
  };
}
