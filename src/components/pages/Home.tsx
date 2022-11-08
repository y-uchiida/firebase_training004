import { Box, Typography } from '@mui/material'
import React from 'react'
import VideoFeed from '../organisms/VideoFeed'

const Home = () => {
	return (
		<>
			<Typography variant='h4' component='h2'>Latest Updates</Typography>
			<Box sx={{ mt: 1 }}>
				<VideoFeed />
			</Box>
		</>
	)
}

export default Home
