import React, { useEffect, useState } from "react";
import axios from "axios";

import { Container } from "semantic-ui-react";

import { Activity } from "../models/activity";
import Navbar from "./Navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

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

  return (
    <>
      <Navbar />

      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard activities={activities} />
      </Container>
    </>
  );
};

export default App;
