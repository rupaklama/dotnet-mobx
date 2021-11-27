import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import Loading from "../../../app/layout/Loading";

import { useStore } from "../../../app/stores/store";

const ActivityDetails = () => {
  const { activityStore } = useStore();
  const { selectedActivity: activity, openForm, cancelSelectedActivity } = activityStore;

  // note - instead of using optional operator '?' everywhere
  if (!activity) return <Loading />;

  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{new Date().toLocaleDateString()}</span>
        </Card.Meta>
        <Card.Description>{activity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>
          <Button onClick={() => openForm(activity.id)} basic color='blue' content='Edit' />
          <Button onClick={cancelSelectedActivity} basic color='grey' content='Cancel' />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default ActivityDetails;
