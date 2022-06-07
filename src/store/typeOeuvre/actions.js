import fire from "src/boot/Firebase";
import { LocalStorage } from "quasar";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { Notify } from "quasar";
import "core-js/es/array";

export async function fecthTypeOeuvre({ dispatch }, { id }) {
  try {
    let res = await dispatch("fetchAllTypeOeuvre");
    let type = await res.docs.find((type) => type.id === id);
    return type.data();
  } catch (error) {}
}

export async function fetchAllTypeOeuvre() {
  try {
    const res = await getDocs(collection(fire.firebasebd, "typeOeuvre"));
    return res;
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Error lors de la récupération des types oeuvres",
      color: "negative",
    });
  }
}

export async function addTypeOeuvre({ commit }, { type }) {
  try {
    const typeRef = await addDoc(
      collection(fire.firebasebd, "typeOeuvre"),
      type
    );
    return typeRef;
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

export async function deleteType({ commit }, { id }) {
  try {
    await deleteDoc(doc(fire.firebasebd, "typeOeuvre", id));
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

export async function updateTypeOeuvre({ commit }, { type, id }) {
  try {
    await setDoc(doc(fire.firebasebd, "typeOeuvre", id), type);
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
