import { format } from "date-fns"
import { FC } from "react"
import { Link } from "react-router-dom"
import { Segment, Image, Item, Header, Button, Label } from "semantic-ui-react"

import useActivityStore from "@/store/features/activity"
import { Activity } from "@/models/activity"

const activityImageStyle = {
  filter: 'brightness(30%)'
}

const activityImageTextStyle = {
  position: 'absolute',
  bottom  : '5%',
  left    : '5%',
  width   : '100%',
  height  : 'auto',
  color   : 'white'
}

type Props = {
  activity: Activity
}

const ActivityDetailHeader:FC<Props> = ({activity}) => {
  const { updateAttendance, changeStatusActivity, isLoading } = useActivityStore();

  const handleJoinActivity = () => {
    updateAttendance();
  }

  const handleCancelActivity = () => {
    changeStatusActivity();
  }

  return (
    <Segment.Group>
      <Segment attached='top' style={{padding: '0'}}>
        {activity.isCancelled && (
          <Label style={{position: 'absolute', zIndex: 1000, left: -14, top: 20}} 
            ribbon color='red' content='Cancelled'/>
        )}
        <Image src={`/assets/categoryImages/${activity.category.toLowerCase()}.jpg`} fluid style={activityImageStyle}/>
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header size='huge' content={activity.title} style={{color: 'white'}}/>
                <p>{format(activity.date!, "dd MMM yyyy h:mm aa")}</p>
                <p>
                  Hosted by <strong><Link to={`/profiles/${activity.host?.userName}`}>{activity.host?.displayName}</Link></strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        {activity.isHost ? (
          <>
            <Button loading={isLoading} onClick={handleCancelActivity} color={activity.isCancelled ? 'green' : 'red'} floated="left" basic content={activity.isCancelled ? 'Re-activate Activity' : 'Cancel Activity' }/>
            <Button loading={isLoading} disabled={activity.isCancelled} color='orange' floated="right" as={Link} to={`/activities/edit/${activity.id}`}>Manage Event</Button>
          </>
        ): activity.isGoing ? (
          <Button loading={isLoading} onClick={handleJoinActivity}>Cancel Attendance</Button>
        ) : (
          <Button loading={isLoading} color='teal' onClick={handleJoinActivity}>Join Activity</Button>
        )}
      </Segment>
    </Segment.Group>
  )
}

export default ActivityDetailHeader