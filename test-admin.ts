import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
const app = initializeApp({ projectId: firebaseConfig.projectId });
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // maybe this doesn't work?

async function test() {
  try {
    const res = await db.collection('test').limit(1).get();
    console.log("Success", res.size);
  } catch(e) {
    console.error("Error", e);
  }
}
test();
