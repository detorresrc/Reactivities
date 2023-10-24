import PhotoUploadWidget from "@/app/common/image-upload/PhotoUploadWidget"
import { Photo } from "@/models/photo"
import useProfileStore from "@/store/features/profile"
import { FC, SyntheticEvent, useState } from "react"
import { Card, Header, Tab, Image, Grid, Button } from "semantic-ui-react"

type Props = {
  photos: Photo[]
}

const ProfilePhotos:FC<Props> = ({photos}) => {
  const { isCurrentUser, uploadPhoto, isUploading, setMainPhoto, deletePhoto , loading} = useProfileStore();
  const [ addPhotoMode, setAddPhotoMode ] = useState(false);
  const [target, setTarget] = useState('');

  const handlePhotoUpload = (file: Blob) => {
    uploadPhoto(file).then((_) => setAddPhotoMode(false));
  }

  const handleSetMainPhoto = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) => {
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  }

  const handleDeletePhoto = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) => {
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser() === true && (
            <Button disabled={isUploading} floated="right" basic content={addPhotoMode ? 'Cancel' : 'Add Photo'}
              onClick={() => setAddPhotoMode(!addPhotoMode)}/>
          )}
        </Grid.Column>
        <Grid.Column width={16}>
            {addPhotoMode ? (
              <PhotoUploadWidget onPhotoUpload={handlePhotoUpload} isUploading={isUploading}/>
            ) : (
              <Card.Group itemsPerRow={5}>
                {photos.map(photo => (
                  <Card key={photo.id}>
                    <Image src={photo.url || '/assets/user.png'} />
                    {isCurrentUser() && (
                      <Button.Group fluid widths={2}>
                        <Button 
                          basic 
                          color='green' 
                          content="Main"
                          name={photo.id} 
                          disabled={photo.isMain} 
                          loading={target == photo.id && loading}
                          onClick={e => handleSetMainPhoto(photo, e)} />
                        <Button
                          basic
                          color="red"
                          icon="trash"
                          name={photo.id} 
                          disabled={photo.isMain} 
                          loading={target == photo.id && loading}
                          onClick={e => handleDeletePhoto(photo, e)}
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
}

export default ProfilePhotos