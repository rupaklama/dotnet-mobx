import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";

import { Grid } from "semantic-ui-react";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";
import Loading from "../../app/layout/Loading";

const ProfilePage = observer(() => {
  // profiles/:username - {username: 'bob'}
  const { username } = useParams<{ username: string }>();

  const {
    profileStore: { isLoadingProfile, loadProfile, profile, setActiveTab },
  } = useStore();

  useEffect(() => {
    loadProfile(username);

    return () => {
      setActiveTab(0);
    };
  }, [loadProfile, setActiveTab, username]);

  if (isLoadingProfile) return <Loading content="loading profile..." />;

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && (
          <>
            <ProfileHeader profile={profile} />
            <ProfileContent profile={profile} />
          </>
        )}
      </Grid.Column>
    </Grid>
  );
});

export default ProfilePage;
