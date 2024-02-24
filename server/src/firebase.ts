import { cert, initializeApp } from 'firebase-admin/app';

import credentials from '../environments/dev-firebase.json';

export function initialiseFirebase(): void {
  initializeApp({
    credential: cert(credentials as unknown as string),
  });
}
