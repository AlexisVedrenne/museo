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
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { Notify } from "quasar";
import "core-js/es/array";

export async function fetchMusee({ commit }, { idMusee }) {
  try {
    const res = await getDocs(collection(fire.firebasebd, "musees"));

    let musee = res.docs.filter((docMusee) => docMusee.id === idMusee);
    return musee.length > 0 ? musee[0].data() : null;
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Une erreur lors de la récupération du musée",
      color: "negative",
    });
  }
}

export async function fetchAllMusee() {
  try {
    const res = await getDocs(collection(fire.firebasebd, "musees"));
    return res;
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Une erreur lors de la récupération des musées",
      color: "negative",
    });
  }
}

export async function addMusee({ commit }, { musee }) {
  try {
    const museeRef = await addDoc(collection(fire.firebasebd, "musees"), musee);
    return museeRef;
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Une erreur lors de l'ajout d'un musée",
      color: "negative",
    });
  }
}

export async function updateMusee({ commit }, { musee, id }) {
  try {
    await setDoc(doc(fire.firebasebd, "musees", id), musee);
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      message: "Une erreur s'est produite lors de la modification",
      color: "negative",
      icon: "warning",
    });
  }
}

export async function deleteMusee({ commit }, { id }) {
  try {
    await deleteDoc(doc(fire.firebasebd, "musees", id));
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      message: "Une erreur s'est produite lors de la supression",
      color: "negative",
      icon: "warning",
    });
  }
}
