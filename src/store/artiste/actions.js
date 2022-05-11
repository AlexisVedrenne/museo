import fire from "src/boot/Firebase";
import { LocalStorage } from "quasar";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  setDoc,
  doc,
} from "firebase/firestore";
import { Notify } from "quasar";
import "core-js/es/array";

export async function fetchArtiste({ commit }, { idArtiste }) {
  try {
    const res = await getDocs(collection(fire.firebasebd, "artistes"));
    let artiste = res.docs.filter((docArtiste) => docArtiste.id == idArtiste);
    return artiste[0].data();
  } catch (e) {
    Notify.create({
      icon: "warning",
      message: "Une erreur lors de la récupération de l'artiste",
      color: "negative",
    });
  }
}
