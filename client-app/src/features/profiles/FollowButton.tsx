import { Profile } from "@/models/profile"
import useProfileStore from "@/store/features/profile"
import useUserStore from "@/store/features/user"
import { FC, SyntheticEvent } from "react"
import { Button, Reveal } from "semantic-ui-react"

type Props = {
  profile: Profile
}
const FollowButton:FC<Props> = ({profile}) => {
  const {loading, updateFollowing} = useProfileStore();
  const { user } = useUserStore();

  if(user?.username == profile.userName) return null;

  const handleFollow = (e: SyntheticEvent, username: string) => {
    e.preventDefault();

    profile.following ? updateFollowing(username, false) : updateFollowing(username, true);
  }

  return (
    <Reveal animated="move">
      <Reveal.Content visible style={{width: '100%'}}>
        <Button fluid color='teal' content={profile.following ? 'Following' : 'Not Following' }></Button>
      </Reveal.Content>
      <Reveal.Content hidden style={{width: '100%'}}>
        <Button 
          fluid
          color={profile.following ? 'red' : 'green'} 
          content={profile.following ? 'Unfollow' : 'Follow'}
          loading={loading}
          onClick={(e) => handleFollow(e, profile.userName)}
          ></Button>
      </Reveal.Content>
    </Reveal>
  )
}

export default FollowButton