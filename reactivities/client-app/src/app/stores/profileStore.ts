import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile } from "../models/profile";
import store from "./store";

export default class ProfileStore {
  // profile is for current user or other user
  profile: Profile | null = null;
  isLoadingProfile = false;
  isUploading = false;
  isLoading = false;
  isLoadingFollowings = false;
  followings: Profile[] = [];
  activeTab = 0;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.activeTab,
      activeTab => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "following";
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }

  setActiveTab = (activeTab: any) => {
    this.activeTab = activeTab;
  };

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

  updateProfile = async (profile: Partial<Profile>) => {
    this.isLoading = true;
    try {
      await agent.Profiles.updateProfile(profile);
      runInAction(() => {
        if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
          store.userStore.setDisplayName(profile.displayName);
        }
        this.profile = { ...this.profile, ...(profile as Profile) };
        this.isLoading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => (this.isLoading = false));
    }
  };

  /**
   * @param  {string} username
   * @param  {boolean} following - helper parameter to change status
   */
  updateFollowing = async (username: string, following: boolean) => {
    this.isLoading = true;
    try {
      await agent.Profiles.updateFollowing(username);
      store.activityStore.updateAttendeeFollowing(username);
      runInAction(() => {
        if (
          this.profile &&
          this.profile.username !== store.userStore.user?.username &&
          this.profile.username === username
        ) {
          following ? this.profile.followersCount++ : this.profile.followersCount--;
          this.profile.following = !this.profile.following;
        }
        if (this.profile && this.profile.username === store.userStore.user?.username) {
          following ? this.profile.followingCount++ : this.profile.followingCount--;
        }
        this.followings.forEach(profile => {
          if (profile.username === username) {
            profile.following ? profile.followersCount-- : profile.followersCount++;
            profile.following = !profile.following;
          }
        });
        this.isLoading = false;
      });
    } catch (err) {
      console.log(err);
      runInAction(() => (this.isLoading = false));
    }
  };

  loadFollowings = async (predicate: string) => {
    this.isLoadingFollowings = true;

    try {
      const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
      runInAction(() => {
        this.followings = followings;
        this.isLoadingFollowings = false;
      });
    } catch (err) {
      console.error(err);
      runInAction(() => (this.isLoadingFollowings = false));
    }
  };
}
