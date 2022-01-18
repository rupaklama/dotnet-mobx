import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile;
}

const ProfilePhotos: React.FC<Props> = ({ profile }) => {
  const {
    profileStore: { isCurrentUser, uploadPhoto, isUploading, isLoading, setMainPhoto, deletePhoto },
  } = useStore();

  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState("");

  const handleSetMainPhoto = (photo: Photo, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  };

  const handleDeletePhoto = (photo: Photo, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
  };

  const handlePhotoUpload = (file: Blob) => {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
  };

  return (
    <Tab.Pane>
      <Grid container>
        <Grid.Column width={16}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              color="black"
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>

        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget loading={isUploading} uploadPhoto={handlePhotoUpload} />
          ) : (
            <Card.Group itemsPerRow={3} stackable>
              {profile.photos?.map(photo => (
                <Card raised key={photo.id}>
                  <Image src={photo.url} />
                  {isCurrentUser && (
                    <Button.Group fluid widths={2}>
                      <Button
                        basic
                        color="green"
                        content="Main"
                        name={"main" + photo.id}
                        disabled={photo.isMain}
                        loading={target === "main" + photo.id && isLoading}
                        onClick={e => handleSetMainPhoto(photo, e)}
                      />

                      <Button
                        basic
                        color="red"
                        icon="trash"
                        loading={target === photo.id && isLoading}
                        onClick={e => handleDeletePhoto(photo, e)}
                        disabled={photo.isMain}
                        name={photo.id}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
