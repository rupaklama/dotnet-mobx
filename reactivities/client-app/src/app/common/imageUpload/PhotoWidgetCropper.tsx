import React from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface Props {
  imagePreview: string;
  setCropper: (cropper: Cropper) => void;
}

const style = {
  height: 200,
  width: "100%",
};

const PhotoWidgetCropper: React.FC<Props> = ({ imagePreview, setCropper }) => {
  return (
    <Cropper
      src={imagePreview}
      style={style}
      initialAspectRatio={1}
      aspectRatio={1}
      preview=".img-preview"
      guides={false}
      viewMode={1}
      autoCropArea={1}
      background={false}
      onInitialized={cropper => setCropper(cropper)}
    />
  );
};

export default PhotoWidgetCropper;
