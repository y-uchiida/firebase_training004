import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import { signInWithGoogle } from '../service/signinWithGoogle'
import { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider'
import { signOut } from '../service/signOut';
import { Box } from '@mui/system';

const Header = () => {
	const authContext = useContext(AuthContext);

	return (
		<AppBar position='static' color='primary'>
			<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography variant='h6' component='h1' color='inherit'>
					Firebase videos
				</Typography>
				{authContext.currentUser?.uid ?
					<Box sx={{ display: 'flex', columnGap: 1, alignItems: 'center' }}>
						<Typography variant='body1'>{authContext.currentUser.displayName}</Typography>
						<Button variant='outlined' color='inherit' onClick={signOut}>Logout</Button>
					</Box>
					:
					<Button variant='outlined' color='inherit' onClick={signInWithGoogle}>Login with Google</Button>
				}
			</Toolbar>
		</AppBar>
	)
}

export default Header
