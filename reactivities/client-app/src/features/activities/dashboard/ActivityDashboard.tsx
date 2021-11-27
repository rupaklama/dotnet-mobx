import React from "react";
import { Grid } from "semantic-ui-react";

import { observer } from "mobx-react-lite";

import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props {
  activities: Activity[];
  createOrEdit(activity: Activity): void;
  deleteActivity(id: string): void;
  isSubmitting: boolean;
}

const ActivityDashboard: React.FC<Props> = ({ activities, createOrEdit, deleteActivity, isSubmitting }) => {
  const { activityStore } = useStore();
  const { selectedActivity, isEditMode } = activityStore;

  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList activities={activities} deleteActivity={deleteActivity} isSubmitting={isSubmitting} />
      </Grid.Column>

      <Grid.Column width='6'>
        {selectedActivity && !isEditMode && <ActivityDetails />}

        {isEditMode && <ActivityForm createOrEdit={createOrEdit} isSubmitting={isSubmitting} />}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
