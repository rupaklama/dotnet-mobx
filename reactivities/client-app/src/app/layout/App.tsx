import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";

import { Container } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";

import Navbar from "./Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";

const App = () => {
  const location = useLocation();

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

  return (
    <>
      <ToastContainer position="top-center" hideProgressBar />
      <Route exact path="/" component={HomePage} />
      <Route
        // any routes that matches '/+routes' is going to match this particular route
        path={"/(.+)"}
        render={() => (
          <>
            <Navbar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />

                {/* adding key here to create a New Uncontrolled Component with Key 
                when key/prop changes to refresh/clear/update the component */}
                <Route
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                <Route path="/errors" component={TestErrors} />
                <Route path="/server-error" component={ServerError} />

                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
};

export default observer(App);
