import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { collection, getDoc, getDocs, onSnapshot, query, Timestamp } from 'firebase/firestore';
import React, { FC, useEffect, useState } from 'react';
import { db } from '../../service/firebase';
import VideoPlayer from './VideoPlayer';

type VideoInfo = {
	uid: string,
	name: string,
	downloadURL: string,
	contentType: string,
	updated: Timestamp,
}

const VideoFeed = () => {
	const [videos, setVideos] = useState<VideoInfo[]>([]);

	useEffect(() => {
		const videosCollectionRef = collection(db, 'videos');
		const q = query(videosCollectionRef);
		onSnapshot(q, (snapshot) => {
			let videoInfoItems: VideoInfo[] = [];
			snapshot.forEach(async (doc) => {
				const video = await (await getDoc<VideoInfo>(doc.data().video)).data();
				if (!video) {
					return;
				}
				const videoInfo: VideoInfo = {
					uid: doc.id,
					name: video.name,
					downloadURL: video.downloadURL,
					contentType: video.contentType,
					updated: video.updated,
				};
				videoInfoItems.push(videoInfo);
				setVideos(videoInfoItems);
			});
		});
	}, []);

	return (
		<Box columnGap={2} sx={{ display: 'flex' }}>
			{videos.map(video => {
				return (
					<Card key={video.uid}>
						<CardContent>
							<VideoPlayer videoUrl={video.downloadURL}
								sx={{ flexBasis: '50%' }}
							/>
							<Typography variant='subtitle1' component='h6'>
								{video.name}
							</Typography>
						</CardContent>
					</Card>
				);
			})}
		</Box>
	);
}

export default VideoFeed
