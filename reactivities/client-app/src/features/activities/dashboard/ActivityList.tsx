import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import { Button, Item, Label, Segment } from "semantic-ui-react";

import { useStore } from "../../../app/stores/store";

const ActivityList = () => {
  const { activityStore } = useStore();
  const { deleteActivity, activitiesByDate, isLoading } = activityStore;

  const [target, setTarget] = useState("");

  const handleActivityDelete = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  };

  return (
    <Segment>
      <Item.Group divided>
        {activitiesByDate.map(activity => (
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
                  loading={isLoading && target === activity.id}
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

export default observer(ActivityList);
