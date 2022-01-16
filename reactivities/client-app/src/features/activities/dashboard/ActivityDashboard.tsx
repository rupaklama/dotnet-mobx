import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";

import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

import { useStore } from "../../../app/stores/store";

import ActivityList from "./ActivityList";
import Loading from "../../../app/layout/Loading";
import ActivityFilters from "./ActivityFilters";

const ActivityDashboard = () => {
  const { activityStore } = useStore();
  const { loadActivities, activities } = activityStore;

  // Logging observables with mobx built in method - toJS
  console.log(toJS(activityStore.activities));

  useEffect(() => {
    // call an action
    if (activities.length <= 1) loadActivities();
  }, [activities, loadActivities]);

  if (activityStore.isLoadingInitial) return <Loading content="loading posts" />;

  return (
    <Grid centered container style={{ marginTop: "-5em" }}>
      <Grid.Column mobile={16} tablet={6} largeScreen={6} widescreen={6}>
        <ActivityFilters />
      </Grid.Column>

      <Grid.Column mobile={16} tablet={10} largeScreen={10} widescreen={10}>
        <ActivityList />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
