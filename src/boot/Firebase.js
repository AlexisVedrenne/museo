import * as firebase from "firebase/app";
import * as firestore from "firebase/firestore";
import * as fireauth from "firebase/auth";
import { getStorage } from "firebase/storage";
import { Notify } from "quasar";
import "core-js/es/array";

const firebaseConfig = process.env.QENV.FIREBASE_CONFIG;
const app = firebase.initializeApp(firebaseConfig);
const storage = getStorage(app);
const firebasebd = firestore.getFirestore();
const auth = fireauth.getAuth(app);

function createNotify(message) {
  Notify.create({
    progress: true,
    position: "top-right",
    timeout: 2000,
    icon: "info",
    html: true,
    message: message,
    color: "info",
  });
}

async function setSnapshot(q, collection) {
  firestore.onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      let data = change.doc.data();
      if (change.type === "added") {
        collection === "musee"
          ? createNotify(
              "Le musée <strong class='text-black'>" +
                data.nom +
                "</strong> a été ajouter !"
            )
          : collection === "artiste"
          ? createNotify(
              "L'artiste <strong class='text-black'>" +
                data.nom +
                " " +
                data.prenom +
                "</strong> a été ajouter !"
            )
          : collection === "type"
          ? createNotify(
              "Le type <strong class='text-black'>" +
                data.nom +
                "</strong> a été ajouter !"
            )
          : createNotify(
              "L'oeuvre <strong class='text-black'>" +
                data.nom +
                "</strong> a été ajouter !"
            );
      }
      if (change.type === "modified") {
        collection === "musee"
          ? createNotify(
              "Le musée <strong class='text-black'>" +
                data.nom +
                "</strong> a été modifier !"
            )
          : collection === "artiste"
          ? createNotify(
              "L'artiste <strong class='text-black'>" +
                data.nom +
                " " +
                data.prenom +
                "</strong> a été modifier !"
            )
          : collection === "type"
          ? createNotify(
              "Le type <strong class='text-black'>" +
                data.nom +
                "</strong> a été modifier !"
            )
          : createNotify(
              "L'oeuvre <strong class='text-black'>" +
                data.nom +
                "</strong> a été modifier !"
            );
      }
      if (change.type === "removed") {
        collection === "musee"
          ? createNotify(
              "Le musée <strong class='text-black'>" +
                data.nom +
                "</strong> a été retirer !"
            )
          : collection === "artiste"
          ? createNotify(
              "L'artiste <strong class='text-black'>" +
                data.nom +
                " " +
                data.prenom +
                "</strong> a été retirer !"
            )
          : collection === "type"
          ? createNotify(
              "Le type <strong class='text-black'>" +
                data.nom +
                "</strong> a été retirer !"
            )
          : createNotify(
              "L'oeuvre <strong class='text-black'>" +
                data.nom +
                "</strong> a été retirer !"
            );
      }
    });
  });
}

async function initNotify(bd) {
  let resMusees = await firestore.query(firestore.collection(bd, "musees"));
  let resArtistes = await firestore.query(firestore.collection(bd, "artistes"));
  let resType = await firestore.query(firestore.collection(bd, "typeOeuvre"));
  let resOeuvre = await firestore.query(firestore.collection(bd, "oeuvre"));
  await setSnapshot(resMusees, "musee");
  await setSnapshot(resArtistes, "artiste");
  await setSnapshot(resType, "type");
  await setSnapshot(resOeuvre, "oeuvre");
}

initNotify(firebasebd);

export default { firebasebd, storage, auth };
