import { Button, Card, CardContent } from '@mui/material';
import React, { FC } from 'react'
import { useDropzone } from 'react-dropzone';
import type { DropzoneOptions } from 'react-dropzone';
import FileUploadIcon from '@mui/icons-material/FileUpload';

interface props {
	dropzoneOptions?: DropzoneOptions
}

const DropZone: FC<props> = ({ dropzoneOptions }: props) => {

	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
		...dropzoneOptions
	});

	return (
		<>
			<Card variant='outlined' elevation={0} {...getRootProps()} sx={{ borderRadius: 2 }}>
				<CardContent sx={{ backgroundColor: '#eaeaea' }}>
					<input {...getInputProps()} />
					{
						isDragActive ?
							<p>Drop the files here ...</p> :
							<p>Drag 'n' drop some files here, or click to select files</p>
					}
					<Button sx={{ mt: 1 }} variant="contained" onClick={open} startIcon={<FileUploadIcon />}>
						Upload
					</Button>
				</CardContent>
			</Card>
		</>
	)
}

export default DropZone
