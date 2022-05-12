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
    return res;
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

export async function addOeuvre({ dispatch }, { oeuvre }) {
  try {
    if (oeuvre.image) {
      if (oeuvre.image.type.includes("image")) {
        let url = await dispatch("uploadImage", { image: oeuvre.image });
        oeuvre.image = url;
      }
    }
    const oeuvreRef = await addDoc(
      collection(fire.firebasebd, "oeuvre"),
      oeuvre
    );
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "done",
      message: "L'oeuvre " + oeuvre.nom + " à bien été ajouter.",
      color: "positive",
    });
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Error lors de l'ajout d'une oeuvre",
      color: "negative",
    });
  }
}

export async function fetchOeuvre({ dispatch }, { index }) {
  try {
    let oeuvres = await this.dispatch("fetchAllOeuvres");

    return oeuvres.docs[index].data();
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
