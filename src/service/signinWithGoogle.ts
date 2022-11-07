import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const googleAuthProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
	signInWithPopup(auth, googleAuthProvider)
		.catch(err => {
			alert(err.message);
		});
}
