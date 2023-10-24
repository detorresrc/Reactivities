import { FC, Fragment } from "react";
import { Header } from "semantic-ui-react";

import ActivityListItem from "./ActivityListItem";
import useActivityStore from "@/store/features/activity";

const ActivityList: FC = () => {
  const { getActivitiesGroupByDate } = useActivityStore();

  const activityByDate = getActivitiesGroupByDate();
  if(activityByDate==null) return <></>

  return (
    <>
      {Object.keys(getActivitiesGroupByDate()).map(date => {
        const activities = activityByDate[date].map(activity => 
          <ActivityListItem key={activity.id} activity={activity} />
        )
        return <Fragment key={date}>
                <Header sub color="teal">{date}</Header>
                {activities}
              </Fragment>
      })}
    </>
    
  );
};

export default ActivityList;