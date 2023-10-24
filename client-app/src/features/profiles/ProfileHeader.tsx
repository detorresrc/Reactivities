import { FC } from "react"
import { Divider, Grid, Header, Item, Segment, Statistic, StatisticGroup } from "semantic-ui-react"

import { Profile } from "@/models/profile"
import FollowButton from "./FollowButton"

type Props = {
  profile: Profile
}

const ProfileHeader:FC<Props> = ({profile}) => {
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image avatar size='small' src={profile.image || '/assets/user.png'}></Item.Image>
              <Item.Content verticalAlign="middle">
                <Header as='h1' content={profile.displayName}/>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <StatisticGroup widths={2}>
            <Statistic label='Followers' value={profile.followersCount}></Statistic>
            <Statistic label='Following' value={profile.followingCount}></Statistic>
          </StatisticGroup>
          <Divider/>
          <FollowButton profile={profile} />
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

export default ProfileHeader