import { AppBar, Avatar, Button, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { signInWithGoogle } from '../service/signinWithGoogle'
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider'
import { signOut } from '../service/signOut';
import { Box, Container } from '@mui/system';
import AdbIcon from '@mui/icons-material/Adb';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import GoogleIcon from '@mui/icons-material/Google';
import Google from '@mui/icons-material/Google';

const Header = () => {
	const authContext = useContext(AuthContext);

	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<OndemandVideoIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
					<Typography component="h2">
						<Typography variant='h6' component='a' href="/"
							noWrap
							sx={{
								mr: 2,
								display: { xs: 'none', md: 'flex' },
								color: 'inherit',
								textDecoration: 'none',
							}}>Firebase Videos</Typography>
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
						</Menu>
					</Box>
					<OndemandVideoIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
					<Typography
						variant="h5"
						noWrap
						component="a"
						href=""
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontWeight: 700,
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						Firebase Videos
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						<Button
							onClick={handleCloseNavMenu}
							sx={{ my: 2, color: 'white', display: 'block' }}
						>
							<Typography variant='button' component={Link} to='/' sx={{ color: 'inherit', textDecoration: 'none', }}>
								Home
							</Typography>
						</Button>
						<Button
							onClick={handleCloseNavMenu}
							sx={{ my: 2, color: 'white', display: 'block' }}
						>
							<Typography variant='button' component={Link} to='/upload' sx={{ color: 'inherit', textDecoration: 'none', }}>upload video</Typography>
						</Button>
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						{authContext.currentUser?.uid ?
							<>
								<Box sx={{ display: 'flex', columnGap: 1, alignItems: 'center' }}>
									<Tooltip title="Open settings">
										<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
											<Avatar src={authContext.currentUser.photoURL!} />
										</IconButton>
									</Tooltip>
									<Menu
										sx={{ mt: '45px' }}
										id="menu-appbar"
										anchorEl={anchorElUser}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										keepMounted
										transformOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										open={Boolean(anchorElUser)}
										onClose={handleCloseUserMenu}
									>
										<MenuItem>{authContext.currentUser.displayName}</MenuItem>
										<MenuItem onClick={signOut}>
											Logout
										</MenuItem>
									</Menu>
								</Box>
							</>
							:
							<>
								<Button variant='outlined' onClick={signInWithGoogle} sx={{ color: 'white', display: { xs: 'none', md: 'flex', lg: 'flex' } }}>Login with Google</Button>
								<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
									<Tooltip title="Login with Google">
										<Button variant='outlined' onClick={signInWithGoogle} sx={{ color: 'white', p: 0 }}>
											Login
										</Button>
									</Tooltip>
								</Box>
							</>
						}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);

	// return (
	// 	<AppBar position='static' color='primary'>
	// 		<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
	// 			<Typography variant='h6' component='h1' color='inherit'>
	// 				Firebase videos
	// 			</Typography>
	// 			{authContext.currentUser?.uid ?
	// 				<Box sx={{ display: 'flex', columnGap: 1, alignItems: 'center' }}>
	// 					<Typography variant='body1'>{authContext.currentUser.displayName}</Typography>
	// 					<Button variant='outlined' color='inherit' onClick={signOut}>Logout</Button>
	// 				</Box>
	// 				:
	// 				<Button variant='outlined' color='inherit' onClick={signInWithGoogle}>Login with Google</Button>
	// 			}
	// 		</Toolbar>
	// 	</AppBar>
	// )
}

export default Header
