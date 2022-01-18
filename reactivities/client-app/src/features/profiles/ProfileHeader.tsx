import { observer } from "mobx-react-lite";
import React from "react";
import { Divider, Grid, Header, Item, Segment, Statistic } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import FollowButton from "./FollowButton";

interface Props {
  profile: Profile;
}

const ProfileHeader: React.FC<Props> = ({ profile }) => {
  return (
    <Segment>
      <Grid>
        <Grid.Column width={9}>
          <Item.Group>
            <Item>
              <Item.Image avatar size="small" src={profile.image || "/assets/user.png"} />
              <Item.Content verticalAlign="middle">
                <Header as="h1" content={profile.displayName} />
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>

        <Grid.Column width={7}>
          <Statistic.Group>
            <Statistic label="Followers" value={profile.followersCount} />
            <Statistic label="Following" value={profile.followingCount} />
          </Statistic.Group>

          <Divider />
          <FollowButton profile={profile} />
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileHeader);
