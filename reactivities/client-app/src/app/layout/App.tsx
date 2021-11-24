import React, { useEffect, useState } from "react";
import axios from "axios";

import { Container } from "semantic-ui-react";

import { Activity } from "../models/activity";
import Navbar from "./Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  console.log(activities);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    try {
      const fetch = async () => {
        const response = await axios.get<Activity[]>("http://localhost:5001/api/Activities");
        setActivities(response.data);
      };

      fetch();
    } catch (err) {
      console.error("Fetching activities", err);
    }
  }, []);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(act => act.id === id));
  };

  const handleCancelSelectActivity = () => {
    setSelectedActivity(undefined);
  };

  const handleFormOpen = (id?: string) => {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setIsEditMode(true);
  };

  const handleFormClose = () => {
    setIsEditMode(false);
  };

  const handleCreateOrEditActivity = (activity: Activity) => {
    activity.id
      ? // edit activity
        setActivities([...activities.filter(act => act.id !== activity.id), activity])
      : // creat activity
        setActivities([...activities, activity]);

    setIsEditMode(false);
    setSelectedActivity(activity);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(act => act.id !== id)]);
  };

  return (
    <>
      <Navbar openForm={handleFormOpen} />

      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          isEditMode={isEditMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
};

export default App;
