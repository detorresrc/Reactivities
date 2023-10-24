import { UserActivity } from "@/models/profile";
import useProfileStore from "@/store/features/profile";
import { format } from "date-fns";
import { SyntheticEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Grid, Header, Tab, TabProps, Image } from "semantic-ui-react";

const panes = [
  {
    menuItem: 'Future Events',
    pane: { key: 'future' },
    render: () => <ActivityListItemPlaceholder/>
  },
  {
    menuItem: 'Past Events',
    pane: { key: 'past' },
    render: () => <ActivityListItemPlaceholder/>
  },
  {
    menuItem: 'Hosting',
    pane: { key: 'hosting' },
    render: () => <ActivityListItemPlaceholder/>
  },
];

const ProfileActivities = () => {
  const { loadingActivities, userActivities, profile, loadUserActivities } = useProfileStore();

  useEffect(() => {
    loadUserActivities(profile!.userName);
  }, [loadUserActivities, profile]);

  const handleTabChange = (_: SyntheticEvent, data: TabProps) => {
    loadUserActivities(profile!.userName, panes[data.activeIndex as number].pane.key);
  }
  console.log({userActivities});

  return (
    <Tab.Pane loading={loadingActivities}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="calendar" content={'Activities'}/>
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true, fluid: true, tabular: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
            >
          </Tab>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  )
}

const ActivityListItemPlaceholder = () => {
  const { userActivities } = useProfileStore();

  return <Card.Group itemsPerRow={4}>
          {userActivities?.map((activity: UserActivity) => (
            <Card
              as={Link}
              to={`/activities/${activity.id}`}
              key={activity.id}>
                <Image
                  src={`/assets/categoryImages/${activity.category.toLowerCase()}.jpg`}
                  style={{ minHeight: 100, objectFit: 'cover' }}/>
                <Card.Content>
                  <Card.Header textAlign="center" as={'h2'}>{activity.title}</Card.Header>
                  <Card.Meta>
                    <div>{format(new Date(activity.date), "do LLL Y")}</div>
                    <div>{format(new Date(activity.date), "h:mm a")}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
          ))}
        </Card.Group>
}

export default ProfileActivities