import React from "react";
import { Grid } from "semantic-ui-react";

import { Activity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props {
  activities: Activity[];
  selectedActivity: Activity | undefined;
  selectActivity: (id: string) => void;
  cancelSelectActivity(): void;
  isEditMode: boolean;
  openForm(id: string): void;
  closeForm: () => void;
  createOrEdit(activity: Activity): void;
  deleteActivity(id: string): void;
}

const ActivityDashboard: React.FC<Props> = ({
  activities,
  selectedActivity,
  selectActivity,
  cancelSelectActivity,
  isEditMode,
  openForm,
  closeForm,
  createOrEdit,
  deleteActivity,
}) => {
  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity}
        />
      </Grid.Column>

      <Grid.Column width='6'>
        {selectedActivity && !isEditMode && (
          <ActivityDetails
            activity={selectedActivity}
            cancelSelectActivity={cancelSelectActivity}
            openForm={openForm}
          />
        )}

        {isEditMode && (
          <ActivityForm closeForm={closeForm} activity={selectedActivity} createOrEdit={createOrEdit} />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
