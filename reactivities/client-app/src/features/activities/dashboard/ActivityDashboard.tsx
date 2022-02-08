import React, { useEffect, useState } from "react";
import { Button, Grid, Loader } from "semantic-ui-react";

import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

import { useStore } from "../../../app/stores/store";
import InfiniteScroll from "react-infinite-scroller";

import ActivityList from "./ActivityList";
import Loading from "../../../app/layout/Loading";
import ActivityFilters from "./ActivityFilters";

import { PagingParams } from "../../../app/models/pagination";

const ActivityDashboard = () => {
  const { activityStore } = useStore();
  const { loadActivities, activities, setPagingParams, pagination } = activityStore;
  console.log(pagination);

  // Logging observables with mobx built in method - toJS
  console.log(toJS(activityStore.activities));

  const [isLoadingNext, setIsLoadingNext] = useState(false);

  useEffect(() => {
    // call an action
    if (activities.length <= 1) loadActivities();
  }, [activities, loadActivities]);

  const handleGetNext = () => {
    setIsLoadingNext(true);
    // passing current pagination
    // add 1 to get next page
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setIsLoadingNext(false));
  };

  if (activityStore.isLoadingInitial && !isLoadingNext) return <Loading content="loading posts" />;

  return (
    <Grid centered container style={{ marginTop: "-5em" }}>
      <Grid.Column mobile={16} tablet={6} largeScreen={6} widescreen={6}>
        <ActivityFilters />
      </Grid.Column>

      <Grid.Column mobile={16} tablet={10} largeScreen={10} widescreen={10}>
        {/* <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={!isLoadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
          initialLoad={false}
        >
          <ActivityList />
        </InfiniteScroll> */}

        <ActivityList />
        <Button
          onClick={handleGetNext}
          floated="right"
          content="More..."
          positive
          loading={isLoadingNext}
          // disabled={pagination?.totalPages === pagination?.currentPage}
        />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={isLoadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
