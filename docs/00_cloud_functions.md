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

## functions で秘匿情報を扱う

## 参考

- functions:secrets:set が追加され、Functions の config を使った環境変数が非推奨になった話:  
  https://zenn.dev/isamua/articles/firebase-functions-environment-variables
