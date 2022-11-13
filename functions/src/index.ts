import { storeUser } from './features/storeUser';
import { transcodeVideo } from './features/transcodeVideo';

import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { storeUser, transcodeVideo };
