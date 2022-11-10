# Cloud Functions for firebase

## プラン変更が必要

Cloud Functions を firebase アプリで利用する場合、Spark(無料プラン)だと使えない  
コンソールから、Blaze プランに変更する必要がある

## パッケージの追加・更新

`firebase init` で設定を作ると、`functions` ディレクトリ内に別の node プロジェクトが生成される  
これが Cloud Functions で動作するので、必要に応じてパッケージを追加する  
デフォルトだと`firebase-admin` と `firebase-functions` しか入ってない  
これらも最新版になってないこともあるので、最新版にしておく

## ローカルでの実行(Emulator)

Blaze プランに変更したので、規定回数を越えると料金が発生する  
少人数メンバーで開発をしているうちは越えることはないとは思うが、自動テストを行う場合などに備えてローカルで実行できるようにしておく
firebase emulator で各種サービスをローカルで動作させることができる
firebase プロジェクトのルートディレクトリで`firebase init emulators` で、エミュレータの初期設定を対話形式で行える  
とりあえず Cloud Functions はチェックをつけて実行  
`eslint` のインストールなどはお好みで設定する

`firebase emulators:start` でエミュレータを起動する  
このコマンドだと、セットアップしているエミュレータがすべて起動するので、特定のものだけ動かしたい場合は `--only` オプションで指定する

```
firebase emulators:start --only functions
```

なお、functions だけ起動したい場合は、 `functions` ディレクトリ内で `npm run serve` でも OK

## functions で環境変数を設定する

### 1. defineXXX() 関数を利用する

2022 年版のドキュメントだと、こちらが推奨になっている  
利用したいデータ型ごとに設定用の関数があるので、これを利用して環境変数を設定・取得する

```ts
import { defineString } from "firebase-functions/params";

export const env_test = https.onRequest((request, response) => {
  const testVa = defineString("TEST_VAL");
  console.log(`testVal.value(): ${testVal.value()}`);
  response.send(`testVal.value(): ${testVal.value()}`);
});
```

このように設定すると、`.env` から該当の変数を読み込んでくれる  
環境変数がない場合、デプロイ時やローカルのエミュレータ起動時に CLI が設定する値を聞いてくるので、キーボードから入力すれば OK

※ 2022.11.10 現在、defineXXX() の挙動について以下のバグがある模様

- デプロイ時やエミュレータ起動時に`.env` に設定した値が読み込まれず、CLI が設定値を毎回聞いてくる
- キーボードから値を入力すると、`.env` に既存の設定値があると以下のようなエラーが発生する
  `FirebaseError: Attempted to write param-defined key SOME_VAL_KEY to .env files, but it was already defined.`

回避策としては、以下の 2 つがあるっぽい

1. 毎回`.env` を削除するか、利用する環境変数をファイルから消す
2. 以下のコマンドで、問題を起こしている機能を無効化する

```bash
$ firebase experiments:disable functionsparams
```

1 はめんどいけど確実な方法  
2 は手軽だけど、本来の仕様(環境変数のキーが足りないとデプロイ時にエラーとなって事故を防いでくれる)の通りに動作しなくなるらしい

デプロイ時に環境変数の構成を確認してくれる、というのが defineXXX() 系の利点  
この issue が解決するまで従来の方法で環境変数を扱うようにする方がいいかも

- ふつうに process.env で取得する
- config() 関数と functions:config コマンドを利用する(後述)

### 2. config コマンドを利用する

サーバにプロジェクトごとの環境変数のようなものを設定するコマンドがあるので、それを利用することも可能

```bash
$ firebase functions:config:set my.conf='conf_value'
```

Cloud Functions の実行時に利用する場合は以下

```ts
import { https, config } from "firebase-functions/v1";

export const dunp_conf = https.onRequest((request, response) => {
  /* 設定した環境変数がJSON形式で取り出せる */
  response.send(config());
});
```

config の設定はサーバー上に配置されるので、ローカルのエミュレータからは参照できない  
参照したい場合、 `functions/.runtimeconfig.json` に設定を保存して、ここから読み込ませる  
サーバ上の情報と一致させたい場合、以下のコマンドが便利

```
firebase functions:config:get > .runtimeconfig.json
```

なお、これは API キーなどの秘匿情報の保存・参照には利用してはいけない  
Cloud Functions の実行環境は利用者間で共有？されており、  
config で設定した内容が環境に残ったまま別のプロジェクトの関数の実行に用いられる場合がある

秘匿情報は、後述の Secret Manager と defineSecret() を使うべき  
こっちは、issue に上がってるような問題も発生してない

## functions で秘匿情報を扱う

google cloud の Secret Manager API で、クライアントコードに含めたくない値(API キーとか)を管理できる

以下の URL から、Secret Manager を有効化しておく必要がある  
https://console.cloud.google.com/apis/library/secretmanager.googleapis.com

有効化したら、`firebase functions:secrets:set` コマンドで、コンソールから設定を追加できる
`SOME_API_KEY` を追加する場合は以下

```bash
$ firebase functions:secrets:set SOME_API_KEY
? Enter a value for SOME_API_KEY [hidden]
✔  Created a new secret version projects/801403641544/secrets/SOME_API_KEY/versions/1
```

関数から利用する場合は、以下のようにする

```ts
import { https, runWith } from "firebase-functions/v1";
import { defineSecret } from "firebase-functions/params";
const someApiKey = defineSecret("SOME_API_KEY");

export const secretTest = runWith({ secrets: [someApiKey] }).https.onRequest(
  (request, response) => {
    /* runWithで渡した値はオブジェクト */
    console.log(`someApiKey: ${someApiKey}`);

    /* 値は、value() メソッドから取り出す */
    console.log(`someApiKey.value():`, someApiKey.value());

    /* 環境変数に保存されてるので、関数内でprocess.env を使うとふつうに取り出せちゃう */
    console.log(process.env);

    response.send(`someApiKey: ${process.env.SOME_API_KEY}`);
  }
);
```

関数の実行時に 環境変数として読み込んでる( runWith() メソッドの仕様 )  
そのため、`process.env` でふつうに表示できてしまうし、ログに環境変数のダンプとかとるとそこにも出てしまう  
関数内での取り扱い注意って感じ...

## 参考

- functions:secrets:set が追加され、Functions の config を使った環境変数が非推奨になった話:  
  https://zenn.dev/isamua/articles/firebase-functions-environment-variables

- Firebase Functions から Secret Manager を使う:  
  https://shiodaifuku.io/articles/2f33aba0-ede6-42e8-88a7-eca7b32d9caa
