import ProfileCard from "@/features/profiles/ProfileCard";
import { Profile } from "@/models/profile";
import { FC } from "react";
import { Link } from "react-router-dom";
import { Image, List, Popup } from "semantic-ui-react";

type Props = {
  attendees: Profile[]
};

const ActivityListItemAttendee:FC<Props> = ({attendees}) => {
  const styles = {
    borderColor: 'orange',
    borderWidth: 2
  };

  return (
    <List horizontal>
      {attendees.map(attendee => (
        <Popup
          hoverable
          key={attendee.userName}
          trigger={
            <List.Item as={Link} to={`/profiles/${attendee.userName || ''}`}>
              <Image 
                size='mini' 
                circular 
                src={attendee.image || '/assets/user.png'}
                bordered
                style={attendee.following ? styles : null}/>
            </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={attendee} />
          </Popup.Content>
        </Popup>
      ))}
    </List>
  )
}

export default ActivityListItemAttendee