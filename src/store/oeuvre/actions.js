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

export async function fetchAllOeuvres() {
  try {
    const res = await getDocs(collection(fire.firebasebd, "oeuvre"));
    let oeuvres = [];
    res.forEach((oeuvre) => {
      oeuvres.push(oeuvre.data());
    });
    LocalStorage.set("oeuvres", oeuvres);
    return oeuvres;
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Error lors de la récupération des oeuvres",
      color: "negative",
    });
  }
}

export async function fetchOeuvre({ dispatch }, { index }) {
  try {
    let oeuvres = await this.dispatch("fetchAllOeuvres");
    return oeuvres[index];
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Error lors de la récupération de l'oeuvre",
      color: "negative",
    });
  }
}
