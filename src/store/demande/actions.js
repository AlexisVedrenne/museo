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

export async function fetchAllDemandes() {
  try {
    let user = LocalStorage.getItem("user");
    const q = await query(
      collection(fire.firebasebd, "demande"),
      where("idUser", "==", user.uid)
    );
    const res = await getDocs(q);
    return res;
  } catch (e) {
    console.log(e);
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Une erreur lors récupération des demandes.",
      color: "negative",
    });
  }
}

export async function createDemande({ dispatch }, { idOeuvre }) {
  try {
    let demandes = await dispatch("fetchAllDemandes");
    let demandeRef = null;
    let exist = false;
    for (let i = 0; i < demandes.docs.length; i++) {
      let data = demandes.docs[i].data();
      if (data.idOeuvre === idOeuvre) {
        exist = true;
      }
    }
    if (!exist) {
      let user = LocalStorage.getItem("user");
      let demande = { etat: 0, idOeuvre: idOeuvre, idUser: user.uid };
      demandeRef = await addDoc(
        collection(fire.firebasebd, "demande"),
        demande
      );
      Notify.create({
        progress: true,
        position: "top",
        timeout: 1000,
        icon: "done",
        message: "Demande de prêt de l'oeuvre envoyée !",
        color: "positive",
      });
    } else {
      Notify.create({
        progress: true,
        position: "top",
        timeout: 1000,
        icon: "info",
        message: "Cette demande à déjà été effectuer !",
        color: "info",
      });
    }

    return demandeRef;
  } catch (e) {
    console.log(e);
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Une erreur lors de la création d'une demande.",
      color: "negative",
    });
  }
}

export async function fetchAllEmprunt() {
  try {
    let user = LocalStorage.getItem("user");
    const q = await query(
      collection(fire.firebasebd, "demande"),
      where("idUser", "==", user.uid),
      where("etat", "==", 1)
    );
    const res = await getDocs(q);
    return res || { docs: [] };
  } catch (e) {
    console.log(e);
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Une erreur lors de la récupération des emprunts.",
      color: "negative",
    });
  }
}
