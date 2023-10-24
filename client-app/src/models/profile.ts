import { Photo } from "./photo";

export interface IProfile {
  userName: string;
  displayName: string;
  image?: string;
  bio?: string
  followersCount: number;
  followingCount: number;
  following: boolean;
  photos?: Photo[]
}

export class Profile implements IProfile{
  userName: string;
  displayName: string;
  image?: string | undefined;
  bio?: string | undefined;
  photos?: Photo[] | undefined;
  followersCount: number = 0;
  followingCount: number = 0;
  following: boolean = false;

  constructor(user: User){
    this.userName = user.username;
    this.displayName = user.displayName;
    this.image = user.image;
  }
}

export interface UserActivity {
  id: string;
  title: string;
  category: string;
  date: Date;
}