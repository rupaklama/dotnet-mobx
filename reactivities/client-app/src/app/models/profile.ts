import { User } from "./user";

export interface Profile {
  username: string;
  displayName: string;
  image?: string;
  followersCount: number;
  followingCount: number;
  following: boolean;
  bio?: string;
  photos?: Photo[];
}

/* to automatically set properties based on the currently logged in user */
export class Profile implements Profile {
  constructor(user: User) {
    this.username = user.username;
    this.displayName = user.displayName;
    this.image = user.image;
  }
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}
