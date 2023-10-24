import { Grid, Loader } from "semantic-ui-react";

import useActivityStore from "@/store/features/activity";
import ActivityList from "@/features/activities/dashboard/ActivityList";
import ActivityFilters from "./ActivityFilters";
import { useEffect, useState } from "react";
import { PagingParams } from "@/models/pagination";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

const ActivityDashboard = () => {
  const { setPagingParams, pagination, loadActivities, activityRegistry, predicate, loadingInitial } = useActivityStore();
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage+1));
    loadActivities().then(() => setLoadingNext(false));
  }

  useEffect(() => {
    if(activityRegistry.size <= 1){
      loadActivities();
    }
  }, [loadActivities, activityRegistry.size, predicate]);

  return (
    <Grid>
      <Grid.Column width={10}>
        {loadingInitial && activityRegistry.size === 0 && !loadingNext ? (
          <>
            <ActivityListItemPlaceholder/>
            <ActivityListItemPlaceholder/>
            <ActivityListItemPlaceholder/>
          </>
        ): (
          <InfiniteScroll 
            initialLoad={false}
            pageStart={0} 
            loadMore={handleGetNext} 
            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}>
            <ActivityList/>
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters/>
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext}/>
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
