# Firebase Emulator

firebase をローカルで動かすことができるエミュレータ

## 初期セットアップ

CLI から実行できるコマンドで、対話的に設定ファイルを作れる

```bash
# firebase-tools が必要。インストールしてなければ入れておく
$ npm install -g firebase-tools

# エミュレータだけ初期化する場合は以下
$ firebase init emulators
```

## 起動

```bash
$ firebase emulators:start

# 特定のエミュレータ(例:firestore) だけ起動する場合は、 --only オプションで設定
$ firebase emulators:start　--only firestore

# 複数指定は、, で区切る
$ firebase emulators:start　--only firestore,auth
```

## Emulator UI

エミュレータのログ保持や、保存されたデータなどを表示するための管理ツール  
`firebase.json` で設定が有効になっていれば利用できる  
デフォルトの URL は http://127.0.0.1:4000

```json
// firebase.json
{
  // ... 省略
  "emulators": {
    // ... 省略
    "ui": {
      "enabled": true
    }
  }
}
```

## React などの、hosting に保存するアプリケーションから接続する

firebase 連携用の設定やオブジェクトを管理している層(このプロジェクトでは`src/service/firebase.ts`) で、
ローカル環境だった場合にエミュレータに接続を切り替える処理を追加する

```ts
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import config from "../../firebase.json";

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
const isEmulating = window.location.hostname === "localhost";
if (isEmulating) {
  const emulators = config.emulators;
  connectFirestoreEmulator(db, "localhost", emulators.firestore.port);
  connectStorageEmulator(storage, "localhost", emulators.storage.port);
  connectFunctionsEmulator(functions, "localhost", emulators.functions.port);
  connectAuthEmulator(auth, `http://localhost:9099/${emulators.auth.port}`);
}

export default app;
export { db, storage, auth, googleAuthProvider };
```
