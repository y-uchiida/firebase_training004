import { Card, CardContent, SxProps, Theme, Typography } from '@mui/material'
import { TaskState } from 'firebase/storage'
import React, { FC, memo } from 'react'

type Props = {
	fileName: string,
	blobUrl: string,
	state: TaskState,
	progress: number,
	sx?: SxProps<Theme> | undefined
}

const VideoPreview = memo(({ blobUrl }: { blobUrl: string }) => {
	return <video width={'100%'} src={blobUrl} />
});

const UploadVideoCard: FC<Props> = ({ fileName, blobUrl, state, progress, sx }: Props) => {
	return (
		<Card sx={sx}>
			<CardContent>
				<VideoPreview blobUrl={blobUrl} />
				<Typography variant='subtitle1'>{fileName}</Typography>
				<span>
					{state === 'success' && <>complete</>}
					{state === 'running' && <>{progress.toFixed(1)} % uploaded...</>}
				</span>
			</CardContent>
		</Card>
	)
}

export default UploadVideoCard
