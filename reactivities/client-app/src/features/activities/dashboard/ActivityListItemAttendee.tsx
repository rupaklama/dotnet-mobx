import React from "react";
import { observer } from "mobx-react-lite";
import { Image, List, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { Profile } from "../../../app/models/profile";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
  attendees: Profile[];
}

const styles = {
  borderColor: "orange",
  borderWidth: 2.5,
};

const ActivityListItemAttendee: React.FC<Props> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map((attendee, i) => (
        <Popup
          hoverable
          key={i}
          trigger={
            <List.Item key={i} as={Link} to={`/profiles/${attendee.username}`}>
              <Image
                size="mini"
                circular
                src={attendee.image || "/assets/user.png"}
                bordered
                style={attendee.following ? styles : null}
              />
            </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={attendee} />
          </Popup.Content>
        </Popup>
      ))}
    </List>
  );
};

export default observer(ActivityListItemAttendee);
