# firebase security rules

firestore や storage など、firebase のサービスごとにセキュリティルールを設定できる
セキュリティルールにより、リクエストを受容するか、拒否するかを判定できるようになる

## セキュリティルールの記述例

JavaScript に類似した専用言語で記述する

```js
rules_version = '2';
service cloud.firestore {
	// Firestore のルートパス指定、これは必ず必要
  match /databases/{database}/documents {

		// match 文の brace {} はワイルドカードで、リクエストごとにその内容がわかる
	  // match 文のブロック内では、このワイルドカード部分を変数として扱うことができる
		// このブロックでは、database にリクエストのデータベースIDが入る

    // リクエストが持つ認証情報を取得する
    function auth() { // function で関数を定義できる
      return request.auth; // request には、リクエスト情報が入っている
    }

    // ユーザー認証ずみのリクエストを判定する
    // 匿名認証を許容する
    function isAuthenticated() {
      return auth().uid !== null;
    }

    // ユーザーIDを受け取り、リクエストに含まれるユーザーと一致するかを判定する
    function isUserAuthenticated(userId) {
      return userId == auth().uid;
    }

    // リクエストに含まれるユーザー情報が、管理者ユーザーアカウント化を判定する
    function isAdmin() {
      // 変数を使用してget()およびexists() ) のパスを作成する場合、 $(variable)構文を使用して変数を明示的にエスケープする必要がある
      return exists(/databases/$(database)/documents/admins/$(auth().uid));
    }

    match /users/{userId} {
      // (匿名を含む)ユーザー認証されたリクエストの場合
      allow get: if isAuthenticated();

      // ユーザー認証されたリクエストまたは管理者のリクエストの場合
      allow create, update, delete: if isUserAuthenticated(userId) || isAdmin();
    }

    match /videos/{videoId} {
      allow read: if isAuthenticated();

      // ユーザー認証されたリクエストまたは管理者のリクエストの場合
      allow create, update, delete: if isUserAuthenticated(userId) || isAdmin();
    }

    match /videos/{video} {
      // (匿名を含む)ユーザー認証されたリクエストの場合
      allow read: if isAuthenticated();
    }
  }
}
```

## セキュリティルールのデプロイ

firebase cli から、`firebase deploy`でデプロイする  
`rules` オプションで、セキュリティルールのみデプロイできる

例: firestore のセキュリティルールのみデプロイする場合

```
$ firebase deploy --only firestroe:rules
```

## 参考

- CloudFirestore セキュリティルールの記述条件:
  https://firebase.google.com/docs/firestore/security/rules-conditions?hl=ja

- Firestore Security Rules の書き方と守るべき原則:
  https://qiita.com/KosukeSaigusa/items/18217958c581eac9b245
