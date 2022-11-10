import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { connectAuthEmulator, getAuth, GoogleAuthProvider } from "firebase/auth";
import config from '../../firebase.json';

/* .env で設定したfirebase の設定を読み込む */
const firebaseConfig = {
	apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: import.meta.env.VITE_REACT_APP_FIREBASE_DATABASE,
	projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_REACT_APP_FIREBASE_SENDER_ID,
	appId: import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID,
};

/* 設定したコンフィグのオブジェクトを読み込んで、firebaseを初期化する */
const app = initializeApp(firebaseConfig);

/* 初期化後、機能別にモジュール化されたオブジェクトをエクスポートする*/
const db = getFirestore();
const storage = getStorage();
const functions = getFunctions();
const auth = getAuth();
const googleAuthProvider = new GoogleAuthProvider();

/* localhost で動作している場合は、接続先をエミュレータに切り替える */
const isEmulating = window.location.hostname === 'localhost'
if (isEmulating) {
	const emulators = config.emulators;
	connectFirestoreEmulator(db, 'localhost', emulators.firestore.port);
	connectStorageEmulator(storage, 'localhost', emulators.storage.port);
	connectFunctionsEmulator(functions, 'localhost', emulators.functions.port);
	connectAuthEmulator(auth, `http://localhost:9099/${emulators.auth.port}`);
}

export default app;
export { db, storage, auth, googleAuthProvider }
