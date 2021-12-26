import React, { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

import PhotoWidgetDropzone from "./PhotoWidgetDropzone";

interface Props {
  loading: boolean;
  uploadPhoto: (file: Blob) => void;
}

const style = {
  minHeight: 200,
  overFlow: "hidden",
};

const PhotoUploadWidget: React.FC<Props> = ({ loading, uploadPhoto }) => {
  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  const onCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
    }
  };

  useEffect(() => {
    // clean up
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 1: Add Photo" />
        <PhotoWidgetDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 2: Resize Image" />
        {files && files.length > 0 && (
          <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 3: Upload" />
        {files && files.length > 0 && (
          <>
            {/* <section className="img-preview" style={style} /> */}
            <section style={style}>
              <Button.Group fluid>
                <Button loading={loading} onClick={onCrop} positive icon="check" />
                <Button disabled={loading} onClick={() => setFiles([])} icon="close" />
              </Button.Group>
            </section>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default PhotoUploadWidget;
