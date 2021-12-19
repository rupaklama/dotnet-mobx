import { User } from "./user";
export interface Profile {
  username: string;
  displayName: string;
  image?: string;
  bio?: string;
}

/* to add additional properties */
export class Profile implements Profile {
  constructor(user: User) {
    this.username = user.username;
    this.displayName = user.displayName;
    this.image = user.image;
  }
}
