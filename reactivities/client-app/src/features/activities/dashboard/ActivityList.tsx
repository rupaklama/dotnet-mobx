import React, { useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";

import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";

interface Props {
  activities: Activity[];
  deleteActivity(id: string): void;
  isSubmitting: boolean;
}
const ActivityList: React.FC<Props> = ({ activities, deleteActivity, isSubmitting }) => {
  const [target, setTarget] = useState("");

  const { activityStore } = useStore();

  const handleActivityDelete = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  };

  return (
    <Segment>
      <Item.Group divided>
        {activities.map(activity => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as='a'>{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>

              <Item.Extra>
                <Button
                  onClick={() => activityStore.selectActivity(activity.id)}
                  floated='right'
                  content='view'
                  color='blue'
                />
                <Button
                  onClick={e => handleActivityDelete(e, activity.id)}
                  floated='right'
                  content='Delete'
                  color='red'
                  loading={isSubmitting && target === activity.id}
                  name={activity.id}
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default ActivityList;
