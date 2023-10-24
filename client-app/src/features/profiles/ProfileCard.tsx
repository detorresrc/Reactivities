import { Profile } from "@/models/profile"
import { FC } from "react"
import { Link } from "react-router-dom"
import { Card, Icon, Image } from "semantic-ui-react"
import FollowButton from "./FollowButton"

type Prop = {
  profile: Profile
}

const ProfileCard:FC<Prop> = ({ profile }) => {
  return (
    <Card as={Link} to={`/profiles/${profile.userName}`}>
      <Image src={profile.image || '/assets/user.png'}/>
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>Bio goes here</Card.Description>
      </Card.Content>
      <Card.Content>
        <Icon name="user"/>
        {profile.followersCount} Follower{profile.followersCount>1 ? 's' : '' }
      </Card.Content>
      <FollowButton profile={profile}/>
    </Card>
  )
}

export default ProfileCard