import { Tab } from "semantic-ui-react";

import ProfilePhotos from "./ProfilePhotos";
import { Profile } from "@/models/profile"
import { FC } from "react";
import ProfileFollowings from "./ProfileFollowings";
import ProfileActivities from "./ProfileActivities";

type Props = {
  profile: Profile
}

const ProfileContent:FC<Props> = ({profile}) => {
  const panes = [
    {
      menuItem: 'About',
      render: () => <Tab.Pane>About Content</Tab.Pane>
    },
    {
      menuItem: 'Photos',
      render: () => <ProfilePhotos photos={profile.photos || []}/>
    },
    {
      menuItem: 'Events',
      render: () => <ProfileActivities/>
    },
    {
      menuItem: 'Followers',
      render: () => <ProfileFollowings type="followers"/>
    },
    {
      menuItem: 'Following',
      render: () => <ProfileFollowings type="following"/>
    }
  ];
  
  return (
    <Tab
      menu={{fluid: true, vertical: true}}
      panes={panes}
    />
  )
}

export default ProfileContent