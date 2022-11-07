import { auth } from './firebase';

export const signOut = () => {
	auth.signOut().then(() => {
		console.log('sign out success.');
		document.location.reload();
	}).catch(err => {
		alert(err.message);
	});
}
