import { https, logger, } from 'firebase-functions/v1';
import { storeUser } from './storeUser';


/* ユーザーの新規登録をトリガーに実行される関数を作成 */
export const helloWorld = https.onRequest((request, response) => {
	logger.info('Hello logs!', { structuredData: true });
});

export { storeUser };
