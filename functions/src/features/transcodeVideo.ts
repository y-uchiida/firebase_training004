import { storage } from "firebase-functions/v1";
import { getStorage } from 'firebase-admin/storage';
import ffmpegStatic from "ffmpeg-static";
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
import { MetadataResponse } from "@google-cloud/storage/build/src/nodejs-common";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Cloud Storage にmp4 形式以外の動画ファイルがアップロードされたとき、
 * mp4 形式にトランスコードする
 */
export const transcodeVideo = storage.object().onFinalize(async object => {
	try {
		const contentType = object.contentType;
		if (!contentType?.includes('video') || contentType.endsWith('mp4')) {
			/* mp4 形式の動画だった場合、トランスコード処理は不要なので関数実行を終了する */
			console.info('transcodeVideo(): quit execution');
			return;
		}

		const path = require('path');
		const os = require('os');
		const fs = require('fs');

		const bucketName = object.bucket;
		const bucket = getStorage().bucket(bucketName);
		const filePath = object.name;
		const fileName = filePath?.split('/').pop();
		const tempFilePath = path.join(os.tmpdir(), fileName);
		const videoFile = filePath ? bucket.file(filePath) : undefined;

		const targetTempFileName = `${fileName?.replace(/\.[^/.]+$/, '')}_output.mp4`;
		const targetTempFilePath = path.join(os.tmpdir(), targetTempFileName);
		const targetTranscodedFilePath = `transcoded-videos/${targetTempFileName}`;
		const targetStorageFilePath = path.join(
			path.dirname(targetTranscodedFilePath),
			targetTempFileName
		);

		await videoFile?.download({ destination: tempFilePath });
		const command = ffmpeg(tempFilePath)
			.setFfmpegPath(ffmpegStatic!)
			.format('mp4')
			.output(targetTempFilePath);
		await promisifyCommand(command);

		const token = uuidv4();
		await bucket.upload(targetTempFilePath, {
			destination: targetStorageFilePath,
			metadata: {
				firebaseStorageDownloadTokens: token
			}
		});

		let transcodedVideoFile = await bucket.file(targetStorageFilePath);
		let metadata = await transcodedVideoFile.getMetadata();
		const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(targetTranscodedFilePath)}?alt=media?token=${token}`;
		metadata = Object.assign(metadata[0], { downloadUrl });

		const userToken = object.metadata?.idToken;
		if (userToken === undefined) {
			throw new Error("userToken is undefined");
		}
		await saveVideoMetadata(userToken, metadata);

		fs.unlinkSync(tempFilePath);
		fs.unlinkSync(targetTempFilePath);

		console.log('Transcode execution was finished!');

	} catch (error) {
		console.log(error);
		return;
	}
});

/**
 * ffmpeg の処理を非同期実行するためにPromise でラップする
 * @param command 実行するコマンド
 * @returns Promise commandで渡された処理を非同期(async/await)で行うPromise
 */
const promisifyCommand = async (command: ffmpeg.FfmpegCommand) => {
	return new Promise((resolve, reject) => {
		command.on('end', resolve).on('error', reject).run();
	});
};

/**
 * アップロードした動画のメタデータを追加保存する
 * @param userToken 動画をアップロードしたユーザー情報のトークン
 * @param metadata 動画メタデータ
 */
const saveVideoMetadata = async (userToken: string, metadata: MetadataResponse) => {
	const auth = getAuth();
	const db = getFirestore();
	const decodedToken = await auth.verifyIdToken(userToken);
	const userUid = decodedToken.uid;
	const videoRef = db.doc(`users/${userUid}`).collection('videos').doc();
	metadata = Object.assign(metadata, { uid: videoRef.id });

	await videoRef.set(metadata, { merge: true });
};
