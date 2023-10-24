interface IActivity{
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  hostUsername: string;
  isCancelled: boolean;
  isGoing: boolean;
  isHost: boolean;
  host?: Profile;
  attendees?: Profile[]
};

type ServerError = {
  statusCode: number;
  message: string;
  details: string;
}

type User = {
  username: string;
  displayName: string;
  token: string;
  image?: string
}

type UserFormValues = {
  email: string;
  username?: string;
  displayName?: string;
  password: string;
}