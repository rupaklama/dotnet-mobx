import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile } from "../models/profile";
import store from "./store";

export default class ProfileStore {
  profile: Profile | null = null;
  isLoadingProfile = false;
  isUploading = false;
  isLoading = false;

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

  uploadPhoto = async (file: Blob) => {
    this.isUploading = true;

    try {
      const response = await agent.Profiles.uploadPhotoApi(file);
      const photo = response.data;

      runInAction(() => {
        // to make sure we got profile
        if (this.profile) {
          this.profile.photos?.push(photo);

          // check to see if photo that we are getting back is the main photo
          // If it is, set user object in user store as well as profile image
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }
        this.isUploading = false;
      });
    } catch (err) {
      console.error(err);
      runInAction(() => (this.isUploading = false));
    }
  };

  setMainPhoto = async (photo: Photo) => {
    this.isLoading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find(p => p.isMain)!.isMain = false;
          this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
          this.isLoading = false;
        }
      });
    } catch (err) {
      runInAction(() => (this.isLoading = false));
      console.log(err);
    }
  };

  deletePhoto = async (photo: Photo) => {
    this.isLoading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos?.filter(p => p.id !== photo.id);
          this.isLoading = false;
        }
      });
    } catch (err) {
      runInAction(() => (this.isLoading = false));
      console.log(err);
    }
  };
}
