import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from './firebase';

const uploadToStorage = (refString: string, file: File) => {
	const storageRef = ref(storage, refString);
	return uploadBytesResumable(storageRef, file);
}

export default uploadToStorage;
