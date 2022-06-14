import * as firebase from "firebase/app";
import * as firestore from "firebase/firestore";
import * as fireauth from "firebase/auth";
import { getStorage } from "firebase/storage";
import { Notify } from "quasar";
import "core-js/es/array";
import { LocalStorage } from "quasar";

const firebaseConfig = process.env.QENV.FIREBASE_CONFIG;
const app = firebase.initializeApp(firebaseConfig);
const storage = getStorage(app);
const firebasebd = firestore.getFirestore();
const auth = fireauth.getAuth(app);
const user = LocalStorage.getItem("user");
function createNotify(message) {
  if (user) {
    if (user.role == "admin") {
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
  }
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
                "</strong> a été ajouté !"
            )
          : collection === "artiste"
          ? createNotify(
              "L'artiste <strong class='text-black'>" +
                data.nom +
                " " +
                data.prenom +
                "</strong> a été ajouté !"
            )
          : collection === "type"
          ? createNotify(
              "Le type <strong class='text-black'>" +
                data.nom +
                "</strong> a été ajouté !"
            )
          : collection === "demande"
          ? createNotify("Une nouvelle demande de prêt a été effectué !")
          : createNotify(
              "L'oeuvre <strong class='text-black'>" +
                data.nom +
                "</strong> a été ajouté !"
            );
      }
      if (change.type === "modified") {
        collection === "musee"
          ? createNotify(
              "Le musée <strong class='text-black'>" +
                data.nom +
                "</strong> a été modifié !"
            )
          : collection === "artiste"
          ? createNotify(
              "L'artiste <strong class='text-black'>" +
                data.nom +
                " " +
                data.prenom +
                "</strong> a été modifié !"
            )
          : collection === "type"
          ? createNotify(
              "Le type <strong class='text-black'>" +
                data.nom +
                "</strong> a été modifié !"
            )
          : collection === "demande"
          ? createNotify("Une demande a été traité !")
          : createNotify(
              "L'oeuvre <strong class='text-black'>" +
                data.nom +
                "</strong> a été modifié !"
            );
      }
      if (change.type === "removed") {
        collection === "musee"
          ? createNotify(
              "Le musée <strong class='text-black'>" +
                data.nom +
                "</strong> a été retiré !"
            )
          : collection === "artiste"
          ? createNotify(
              "L'artiste <strong class='text-black'>" +
                data.nom +
                " " +
                data.prenom +
                "</strong> a été retiré !"
            )
          : collection === "type"
          ? createNotify(
              "Le type <strong class='text-black'>" +
                data.nom +
                "</strong> a été retiré !"
            )
          : collection === "demande"
          ? createNotify("Une demande a été cloturé")
          : createNotify(
              "L'oeuvre <strong class='text-black'>" +
                data.nom +
                "</strong> a été retiré !"
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
  let resDemande = await firestore.query(firestore.collection(bd, "demande"));
  await setSnapshot(resMusees, "musee");
  await setSnapshot(resArtistes, "artiste");
  await setSnapshot(resType, "type");
  await setSnapshot(resOeuvre, "oeuvre");
  await setSnapshot(resDemande, "demande");
}

initNotify(firebasebd);
export default { firebasebd, storage, auth };
