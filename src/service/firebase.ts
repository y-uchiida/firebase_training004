import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();

export default app;
