import { Grid } from "semantic-ui-react";

import { observer } from "mobx-react-lite";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";

const ActivityDashboard = () => {
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
