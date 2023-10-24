import useProfileStore from "@/store/features/profile"
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";
import { FC, useEffect } from "react";

type Props = {
  type: "following" | "followers"
}

const ProfileFollowings:FC<Props> = ({type}) => {
  const { profile, followings, loadingFollowings, loadFollowings } = useProfileStore();

  useEffect(() => {
    loadFollowings(type);
  }, [loadFollowings, type]);

  return (
    <Tab.Pane loading={loadingFollowings}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="user" content={type=="following" ? `People following ${profile?.displayName}` : `People ${profile?.displayName} is following`}/>
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={4}>
            {followings?.map(_profile => (
              <ProfileCard profile={_profile} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  )
}

export default ProfileFollowings