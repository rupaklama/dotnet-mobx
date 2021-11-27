import React, { useEffect } from "react";

import { Container } from "semantic-ui-react";

import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

import Navbar from "./Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import Loading from "./Loading";

import { useStore } from "../stores/store";

const App = () => {
  // accessing activity store
  const { activityStore } = useStore();

  // Logging observables with mobx built in method - toJS
  console.log(toJS(activityStore.activities));

  useEffect(() => {
    // call an action
    activityStore.loadActivities();
  }, [activityStore]);

  // note - moved to mobx store
  // const handleSelectActivity = (id: string) => {
  //   setSelectedActivity(activities.find(act => act.id === id));
  // };

  // const handleCancelSelectActivity = () => {
  //   setSelectedActivity(undefined);
  // };

  // const handleFormOpen = (id?: string) => {
  //   id ? handleSelectActivity(id) : handleCancelSelectActivity();
  //   setIsEditMode(true);
  // };

  // const handleFormClose = () => {
  //   setIsEditMode(false);
  // };

  // const handleCreateOrEditActivity = (activity: Activity) => {
  //   setIsSubmitting(true);

  //   activity.id
  //     ? // edit activity
  //       setActivities([...activities.filter(act => act.id !== activity.id), activity])
  //     : // creat activity
  //       setActivities([...activities, activity]);

  //   setIsEditMode(false);
  //   setSelectedActivity(activity);
  // };

  // const handleDeleteActivity = (id: string) => {
  //   setIsSubmitting(true);
  //   agent.Activities.delete(id).then(() => {
  //     setActivities([...activities.filter(act => act.id !== id)]);
  //     setIsSubmitting(false);
  //   });
  // };

  if (activityStore.isLoadingInitial) return <Loading />;

  return (
    <>
      <Navbar />

      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard />
      </Container>
    </>
  );
};

export default observer(App);
