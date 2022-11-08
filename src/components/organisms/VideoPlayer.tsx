import { Theme } from '@emotion/react';
import { Box, SxProps } from '@mui/material';
import React from 'react';

type Props = {
	videoUrl: string,
	sx?: SxProps<Theme>
}

const VideoPlayer = ({ videoUrl, sx }: Props) => {
	return (
		<Box sx={sx}>
			<video controls width={'100%'}>
				<source src={videoUrl} />
			</video>
		</Box>
	)
}

export default VideoPlayer
