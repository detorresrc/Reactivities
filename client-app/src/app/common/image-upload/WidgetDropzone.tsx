import { IFile } from '@/models/file';
import {FC, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react';

type Props = {
  setFiles: (files: IFile[]) => void;
}

const WidgetDropzone:FC<Props> = ({ setFiles }) => {
  const dzStyles = {
    border: 'dashed 3px #eee',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30px',
    textAlign: 'center' as 'center',
    height: '200px'
  };

  const dzActive = {
    borderColor: 'green'
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map(file => {
      return {
        ...file,
        preview: URL.createObjectURL(file)
      };
    }) as IFile[]);
  }, [setFiles])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} style={isDragActive ? {...dzStyles, ...dzActive} : {...dzStyles}}>
      <input {...getInputProps()} />
      <Icon name="upload" size="huge"/>
      <Header content="Drop image here"/>
    </div>
  )
}

export default WidgetDropzone;