import { FC, useEffect, useState } from "react"
import { Button, Grid, Header } from "semantic-ui-react"

import WidgetDropzone from "./WidgetDropzone";
import PhotoCropperWidget from "./PhotoCropperWidget";
import { IFile } from "@/models/file";

type Props = {
  onPhotoUpload : (file: Blob) => void,
  isUploading : boolean
}

const PhotoUploadWidget:FC<Props> = ({ onPhotoUpload, isUploading }) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [cropper, setCropper] = useState<Cropper>();

  const onCrop = () => {
    if(cropper){
      cropper.getCroppedCanvas().toBlob(blob => {
        onPhotoUpload(blob!);
      });
    }
  }

  useEffect(() => {
    return () => {
      cleanup();
    }
  }, []);

  const cleanup = () => {
    files.forEach((file: IFile) => URL.revokeObjectURL(file.preview));
    setFiles([]);
  }

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 1 - Add Photo"/>
        <WidgetDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color="teal" content="Step 2 - Resize Image"/>
        {files && files.length > 0 && (
          <PhotoCropperWidget setCropper={setCropper} imagePreview={files[0].preview}/>
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={5}>
        <Header sub color="teal" content="Step 3 - Preview & Upload"/>
        {files && files.length > 0 && (
        <>
          <div className="img-preview" style={{minHeight: 200, overflow: 'hidden'}}></div>
          <Button.Group widths={2}>
            <Button onClick={onCrop} positive icon="check" loading={isUploading} disabled={isUploading} />
            <Button onClick={() => cleanup()} icon="close" disabled={isUploading} />
          </Button.Group>
        </>
        )}
      </Grid.Column>
    </Grid>
  );
}

export default PhotoUploadWidget