import React from "react";
import { Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import ProfileAbout from "./ProfileAbout";
import ProfilePhotos from "./ProfilePhotos";

interface Props {
  profile: Profile;
}
const ProfileContent: React.FC<Props> = ({ profile }) => {
  const panes = [
    { menuItem: "About", render: () => <ProfileAbout /> },
    { menuItem: "Photos", render: () => <ProfilePhotos profile={profile} /> },
    { menuItem: "Posts", render: () => <Tab.Pane>Posts Content</Tab.Pane> },
    { menuItem: "Followers", render: () => <Tab.Pane>Followers Content</Tab.Pane> },
    { menuItem: "Following", render: () => <Tab.Pane>Following Content</Tab.Pane> },
  ];
  return <Tab menu={{ vertical: true }} panes={panes} />;
};

export default ProfileContent;
