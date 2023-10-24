import { Profile } from "./profile";
export class Activity implements IActivity
{
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  hostUsername: string ='';
  isCancelled = false;
  isGoing = false;
  isHost = false
  host?: Profile | undefined;
  attendees?: Profile[] | undefined;

  constructor(activityForm: ActivityFormValues){
    this.id = activityForm.id!;
    this.title = activityForm.title;
    this.date = activityForm.date;
    this.description = activityForm.description;
    this.category = activityForm.category;
    this.city = activityForm.city;
    this.venue = activityForm.venue;
  }
}

export class ActivityFormValues {
  id?: string = undefined;
  title: string = "";
  category: string = "";
  description: string = "";
  date: Date | null = null;
  city: string = "";
  venue: string = "";

  constructor(activity?: ActivityFormValues) {
    if(activity){
      this.id = activity.id;
      this.title = activity.title;
      this.category = activity.category;
      this.description = activity.description;
      this.date = activity.date;
      this.city = activity.city;
      this.venue = activity.venue;
    }
  }
}