import React from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";

import { Activity } from "../../../app/models/activity";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
  activity: Activity;
}

const ActivityListItem: React.FC<Props> = ({ activity }) => {
  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled && (
          <Label attached="top" color="red" content="Closed" style={{ textAlign: "center" }} />
        )}
        <Item.Group>
          <Item>
            {/* <Item.Image
              style={{ margin: "auto" }}
              size="tiny"
              circular
              src={activity.host?.image || "/assets/user.png"}
            /> */}
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Created by <Link to={`/profiles/${activity.hostUsername}`}>{activity.host?.displayName}</Link>
              </Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color="orange">
                    You are hosting this post
                  </Label>
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label basic color="green">
                    You are joining to this post
                  </Label>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>

      <Segment>
        <span>
          <Icon name="clock" />
          {/* {format(activity.date!, "dd MMM yyy h:mm aa")} */}
          <Icon name="marker" /> {activity.venue}
        </span>
      </Segment>

      <Segment secondary>
        <ActivityListItemAttendee attendees={activity.attendees!} />
      </Segment>

      <Segment clearing>
        <span>{activity.description}</span>
        <Button as={Link} to={`/activities/${activity.id}`} color="teal" floated="right" content="View" />
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityListItem);
