import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { Grid } from "semantic-ui-react";
import Loading from "../../../app/layout/Loading";

import { useStore } from "../../../app/stores/store";

import ActivityDetailedHeader from "./ActivityDetailedHeader";

import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";
import ActivityDetailedInfo from "./ActivityDetailedInfo";

const ActivityDetails = () => {
  const { activityStore } = useStore();
  const { selectedActivity: activity, loadActivity, isLoadingInitial, clearSelectedActivity } = activityStore;

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) loadActivity(id);

    return () => clearSelectedActivity();
  }, [clearSelectedActivity, id, loadActivity]);

  // note - instead of using optional operator '?' everywhere
  if (isLoadingInitial || !activity) return <Loading content="loading post details..." />;

  return (
    <Grid container>
      <Grid.Column mobile={16} tablet={6} largeScreen={6} widescreen={6}>
        <ActivityDetailedSidebar activity={activity} />
      </Grid.Column>

      <Grid.Column mobile={16} tablet={10} largeScreen={10} widescreen={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat activityId={activity.id} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
