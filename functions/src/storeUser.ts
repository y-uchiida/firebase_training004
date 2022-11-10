import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { auth, } from 'firebase-functions/v1';

initializeApp();
const db = getFirestore();

/* ユーザーの新規登録をトリガーに実行される関数を作成 */
export const storeUser = auth.user().onCreate(async (newUser) => {

	try {
		/* 新規登録されたユーザー情報から、登録するデータを作成する */
		const userData = {
			uid: newUser.uid,
			displayName: newUser.displayName || '名無しさん',
			email: newUser.email,
			emailVerified: newUser.emailVerified,
			photoURL: newUser.photoURL || 'https://randomuser.me/api/portraits/med/men/9.jpg',
			phoneNumber: newUser.phoneNumber,
			providerData: {
				providerId: newUser.providerData.length === 0 ? 'password' : newUser.providerData[0].providerId,
				uid: newUser.providerData.length === 0 ? newUser.email : newUser.providerData[0].uid
			},
			disabled: newUser.disabled
		};

		/* firebase のusers コレクションにデータを追加する */
		const userDocRef = await db.doc(`users/${newUser.uid}`);
		await userDocRef.create(userData);

	} catch (error) {
		console.error(error);
	}
});
