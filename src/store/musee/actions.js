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

export async function fetchMusee({ commit }, { idMusee }) {
  try {
    const res = await getDocs(collection(fire.firebasebd, "musees"));

    let musee = res.docs.filter((docMusee) => docMusee.id == idMusee);
    return musee.length > 0 ? musee[0].data() : null;
  } catch (e) {
    console.log(e);
    Notify.create({
      icon: "warning",
      message: "Une erreur lors de la récupération du musée",
      color: "negative",
    });
  }
}
