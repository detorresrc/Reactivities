import { useEffect } from "react";
import { useParams } from "react-router-dom"
import { Grid } from "semantic-ui-react";

import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import useProfileStore from "@/store/features/profile";

const ProfilePage = () => {
  const { loadProfile, profile } = useProfileStore();
  const { username } = useParams() as { username: string };

  useEffect(() => {
    if (username) {
      loadProfile(username);
    }
  }, [username, loadProfile]);

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile!=null && <ProfileHeader profile={profile}/>}
        {profile!=null && <ProfileContent profile={profile}/>}
      </Grid.Column>
    </Grid>
  )
}

export default ProfilePage