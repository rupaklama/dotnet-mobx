import { observer } from "mobx-react-lite";
import { SyntheticEvent } from "react";
import { Reveal, Button } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile;
}

const FollowButton: React.FC<Props> = ({ profile }) => {
  const { profileStore, userStore } = useStore();
  const { updateFollowing, isLoading } = profileStore;

  const handleFollow = (e: SyntheticEvent, username: string) => {
    e.preventDefault();
    // we want to unfollow user if following
    profile.following ? updateFollowing(username, false) : updateFollowing(username, true);
  };

  // not displaying button in current active user profile
  if (userStore.user?.username === profile.username) return null;

  return (
    <Reveal animated="move">
      <Reveal.Content visible style={{ width: "100%" }}>
        <Button fluid color="teal" content={profile.following ? "Following" : "Not following"} />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: "100%" }}>
        <Button
          fluid
          color={profile.following ? "red" : "green"}
          content={profile.following ? "Unfollow" : "Follow"}
          loading={isLoading}
          onClick={e => handleFollow(e, profile.username)}
        />
      </Reveal.Content>
    </Reveal>
  );
};

export default observer(FollowButton);
