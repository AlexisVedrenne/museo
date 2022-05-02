import * as firebase from "firebase/app";
import * as firestore from "firebase/firestore";
import * as fireauth from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = process.env.QENV.FIREBASE_CONFIG;
const app = firebase.initializeApp(firebaseConfig);
const storage = getStorage(app);
const firebasebd = firestore.getFirestore();
const auth = fireauth.getAuth(app);
export default { firebasebd, storage, auth };
