import { Grid } from "semantic-ui-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import ActivityDetailHeader from "./ActivityDetailHeader";
import ActivityDetailInfo from "./ActivityDetailInfo";
import ActivityDetailChat from "./ActivityDetailChat";
import ActivityDetailSidebar from "./ActivityDetailSidebar";
import useActivityStore from "@/store/features/activity";
import ActivityListItemPlaceholder from "../dashboard/ActivityListItemPlaceholder";

const ActivityDetails = () => {
  const { isLoading, selectedActivity: activity, loadActivity, clearActivity } = useActivityStore();
  const { id } = useParams() as { id: string };

  useEffect(() => {
    loadActivity(id);

    return () => {
      clearActivity();
    }
  }, [id, loadActivity]);

  

  return (
    <>
      {isLoading && (
        <ActivityListItemPlaceholder />
      )}
      <Grid>
        
        {activity && (
          <>
            <Grid.Column width={10}>
              <ActivityDetailHeader activity={activity}/>
              <ActivityDetailInfo activity={activity}/>
              <ActivityDetailChat activity={activity}/>
            </Grid.Column>
            <Grid.Column width={6}>
              <ActivityDetailSidebar activity={activity}></ActivityDetailSidebar>
            </Grid.Column>
          </>
        )}
      </Grid>
    </>
  );
};

export default ActivityDetails;
