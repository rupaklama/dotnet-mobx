import React, { useEffect, useState } from "react";
import axios from "axios";

import { Header, List } from "semantic-ui-react";

const App = () => {
  const [activites, setActivities] = useState([]);

  useEffect(() => {
    try {
      const fetch = async () => {
        const response = await axios.get("http://localhost:5001/api/Activities");
        console.log(response);
        setActivities(response.data);
      };

      fetch();
    } catch (err) {
      console.error("Fetching activities", err);
    }
  }, []);

  return (
    <>
      <Header as='h2' icon='users' content='Reactivities' />

      <List>
        {activites.map((item: any) => (
          <List.Item key={item.id}>{item.title}</List.Item>
        ))}
      </List>
    </>
  );
};

export default App;
