import React, { FC, useCallback, useContext, useState } from 'react'
import { Box, Typography } from '@mui/material'
import DropZone from '../organisms/DropZone';
import { AuthContext } from '../../provider/AuthProvider';
import type { FileRejection, DropEvent } from 'react-dropzone';
import { StorageError, UploadTask, UploadTaskSnapshot } from 'firebase/storage';
import UploadVideoCard from '../organisms/UploadVideoCard';
import uploadToStorage from '../../service/uploadToStorage';

interface uploadFile {
	file: File,
	blobUrl: string,
	uploadTask: UploadTask,
}

const handleUpload = async (
	file: File,
	authContext: AuthContext,
	setUploadFiles: React.Dispatch<React.SetStateAction<uploadFile[]>>
) => {
	const refString = `videos/${authContext.currentUser?.uid}/${file.name}`;
	const blobUrl = URL.createObjectURL(file);
	const uploadTaskSnapshot = await uploadToStorage(authContext, refString, file);
	const uploadTask = uploadTaskSnapshot.task;

	setUploadFiles((current) => [...current, { file, blobUrl, uploadTask }]);
	uploadTask.on('state_changed',
		/* 1. progress */
		(snapshot) => handleUploadProgress(snapshot, setUploadFiles),
		/* 2. error */
		(error) => handleUploadError(error, setUploadFiles),
		/* 3. complete */
		() => handleUploadComplete(uploadTask, setUploadFiles),
	);
}

const handleUploadProgress = (
	snapshot: UploadTaskSnapshot,
	setUploadFiles: React.Dispatch<React.SetStateAction<uploadFile[]>>
) => {
	// Observe state change events such as progress, pause, and resume
	// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
	switch (snapshot.state) {
		case 'paused':
			break;
		case 'running':
			break;
	}
	setUploadFiles((items) => {
		return items.map<uploadFile>(item => {
			if (item.uploadTask.snapshot.ref.name === snapshot.ref.name) {
				return { ...item, snapshot }
			} else {
				return item;
			}
		})
	});
	return null;
};

const handleUploadError = (
	error: StorageError,
	setUploadFiles: React.Dispatch<React.SetStateAction<uploadFile[]>>
) => {
	// TODO: Handle unsuccessful uploads
	return null;
}

const handleUploadComplete = (
	uploadTask: UploadTask,
	setUploadFiles: React.Dispatch<React.SetStateAction<uploadFile[]>>
) => {
	setUploadFiles((items) => {
		return items.map<uploadFile>(item => {
			if (item.uploadTask.snapshot.ref.name === uploadTask.snapshot.ref.name) {
				return { ...item, snapshot: uploadTask.snapshot }
			} else {
				return item;
			}
		})
	});
	return null;
}

const UploadVideo: FC = () => {
	const [uploadFiles, setUploadFiles] = useState<uploadFile[]>([]);
	const authContext = useContext(AuthContext);

	const onDropAccepted = useCallback((acceptedFiles: File[]) => {
		acceptedFiles.map((file) => { handleUpload(file, authContext, setUploadFiles) });
	}, []);

	const onDropRejected = useCallback((fileRejections: FileRejection[], event: DropEvent) => {
		/* TODO: show error message on snackbar */
		console.log(fileRejections);
	}, [])

	return (
		<>
			<Typography variant='h4' component='h2'>Upload Video</Typography>
			<Box sx={{ mt: 1 }}>
				<DropZone dropzoneOptions={{
					accept: {
						'video/*': ['.mpg', '.mpeg', '.mp4', '.webm', '.ogv', '.mov', '.qt', '.avi']
						// 'video/mp4': ['.mp4']
					},
					onDropAccepted,
					onDropRejected,
					noClick: true
				}} />
			</Box>
			<aside>
				<h4>selected Files</h4>
				<Box sx={{ display: 'flex', justifyContent: 'start', columnGap: 2 }}>
					{uploadFiles?.map((item, index) => {
						const progress = (item.uploadTask.snapshot.bytesTransferred / item.uploadTask.snapshot.totalBytes) * 100;
						return (
							<UploadVideoCard key={index}
								sx={{ flexBasis: '33%' }}
								fileName={item.file.name}
								blobUrl={item.blobUrl}
								state={item.uploadTask.snapshot.state}
								progress={progress}
							/>
						)
					})}
				</Box>
			</aside>
		</>
	)
}

export default UploadVideo
