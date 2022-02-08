import React, { useEffect } from "react";
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
import LoginForm from "../../features/users/LoginForm";
import { useStore } from "../stores/store";
import Loading from "./Loading";
import ModalContainer from "./ModalContainer";

import ProfilePage from "../../features/profiles/ProfilePage";

const App = () => {
  const location = useLocation();

  // Find auth user on initial app load or re-load
  // This needs to be done in our root component App.tsx because it is the component
  // that loads when our app first starts up.
  const {
    userStore: { token, getUser, setIsAppLoaded, isAppLoaded },
  } = useStore();

  useEffect(() => {
    // Get Current User Object with the Token in the local storage
    if (token) {
      // after we got the current user, set setIsAppLoaded to true for loading flag below
      getUser().finally(() => setIsAppLoaded());
    } else {
      setIsAppLoaded();
    }
  }, [getUser, setIsAppLoaded, token]);

  if (!isAppLoaded) return <Loading content="loading app..." />;

  return (
    // provide React Query client to App
    // our app has access to Queries & Cache now as well as react query hooks
    <>
      <ToastContainer position="top-center" hideProgressBar />
      {/* note - Modal should be open from anywhere in our app, just like Toast above. High/top level in our app */}
      <ModalContainer />
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
                <Route path="/profiles/:username" component={ProfilePage} />
                <Route path="/errors" component={TestErrors} />
                <Route path="/server-error" component={ServerError} />
                <Route path="/login" component={LoginForm} />

                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
      {/* <ReactQueryDevtools /> */}
    </>
  );
};

export default observer(App);
