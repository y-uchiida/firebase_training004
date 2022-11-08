import { ref, updateMetadata, uploadBytesResumable, getDownloadURL, UploadTaskSnapshot } from "firebase/storage";
import { db, storage } from './firebase';
import { AuthContext } from "../provider/AuthProvider";
import { useContext } from "react";
import _ from 'lodash';
import { User } from "firebase/auth";
import { collection, doc, addDoc } from "firebase/firestore";

const saveVideoMetadata = async (
	currentUser: User,
	snapshot: UploadTaskSnapshot
) => {

	/* mp4 以外の動画は、cloud Functions 上でトランスコードした後に
	 * メタデータをFirestore に保存する
	 */
	if (snapshot.metadata.contentType !== 'video/mp4') {
		/* TODO: cloud Functions を呼び出して変換を行う処理を実装 */
	}

	const userUid = currentUser.uid;
	const downloadURL = await getDownloadURL(snapshot.ref);
	let metadataForFirestore = _.omitBy(snapshot.metadata, _.isEmpty);
	metadataForFirestore = Object.assign(metadataForFirestore, { downloadURL });
	const userVideoCollectionRef = collection(db, `users/${userUid}/videos`);
	const userVideoDocumentRef = await addDoc(userVideoCollectionRef, metadataForFirestore).catch((error) => {
		console.error(error);
	});

	if (!userVideoDocumentRef) {
		return null;
	}
	const VideoCollectionRef = collection(db, 'videos');
	await addDoc(VideoCollectionRef, { video: userVideoDocumentRef });
}

const uploadToStorage = (
	authContext: AuthContext,
	refString: string,
	file: File
) => {
	const currentUser = authContext?.currentUser;

	if (currentUser === null) {
		/* TODO: ユーザーが取得できない場合のエラー処理 */
		return null;
	}

	const storageRef = ref(storage, refString);
	const uploadTask = uploadBytesResumable(storageRef, file);

	uploadTask.then(async (snapshot) => {
		const idToken = await currentUser?.getIdToken();
		if (idToken === undefined) {
			/* TODO: idTokenが取得できない場合のエラー処理 */
			return null;
		}
		const metadataForStorage = {
			customMetadata: {
				idToken
			}
		};
		await updateMetadata(storageRef, metadataForStorage);
		await saveVideoMetadata(currentUser, snapshot);
	});
	return uploadTask;
}

export default uploadToStorage;
