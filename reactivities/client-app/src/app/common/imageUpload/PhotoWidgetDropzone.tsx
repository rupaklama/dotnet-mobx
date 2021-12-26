import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Header, Icon } from "semantic-ui-react";

interface Props {
  setFiles: (files: any) => void;
}

// styles when inactive
const dzStyles = {
  border: "3px dashed #eee",
  borderColor: "#eee",
  borderRadius: "5px",
  paddingTop: "50px",

  textAlign: "center" as "center",
  height: 200,
};

// active
const dzActive = {
  borderColor: "green",
};

const PhotoWidgetDropzone: React.FC<Props> = ({ setFiles }) => {
  const onDrop = useCallback(
    acceptedFiles => {
      console.log(acceptedFiles); // file object

      setFiles(
        acceptedFiles.map((file: any) =>
          // Object.assign - to copy the values and properties from one or more source objects to a target object
          // It returns the target object which has properties and values copied from the target object
          // Object.assign() is used for cloning an object.
          // Object.assign() is used to merge object with same properties

          // Object.assign(target, ...sources) - returns the modified target object
          // target: It is the target object to which values and properties have to be copied.
          // sources: It is the source object from which values and properties have to be copied

          Object.assign(file, {
            // adding additional preview property
            // URL.createObjectURL - static method creates a DOMString containing a URL representing the object given in the parameter
            // A DOMString containing an object URL that can be used to reference the contents of the specified source object
            // note - createObjectURL can be use to store resources locally,
            // creates a file locally in the local storage instead of querying server on every time
            // note - this will get us image preview
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <section {...getRootProps()} style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}>
      <input {...getInputProps()} />

      <Icon name="upload" size="big" />
      <Header size="tiny" content="Up load or Drop" />
    </section>
  );
};

export default PhotoWidgetDropzone;
