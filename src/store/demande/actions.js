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
    await dispatch("fetchUserInfo");
    let user = LocalStorage.getItem("user");
    let demandeRef = null;
    if (user.etat) {
      let demandes = await dispatch("fetchAllDemandes");

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
          message: "Cette demande à déjà été effectuée !",
          color: "info",
        });
      }
    } else {
      throw "Compte désactivé";
    }

    return demandeRef;
  } catch (e) {
    await dispatch("signLeft");
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

export async function fetchAllDemande() {
  try {
    const q = await query(
      collection(fire.firebasebd, "demande"),
      where("etat", "==", 0)
    );
    const res = await getDocs(q);
    return res || { docs: [] };
  } catch (e) {
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

export async function acceptDemande({ dispatch }, { demande, id }) {
  try {
    demande.etat = 1;
    let oeuvre = await dispatch("fetchOeuvre", { id: demande.idOeuvre });
    oeuvre = oeuvre.data();
    oeuvre.etat = { icon: "real_estate_agent", nom: "prét" };
    await dispatch("updateOeuvre", { id: demande.idOeuvre, oeuvre: oeuvre });
    await setDoc(doc(fire.firebasebd, "demande", id), demande);
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Une erreur s'est produite !",
      color: "negative",
    });
  }
}

export async function refuseDemande({ commit }, { demande, id }) {
  try {
    demande.etat = 2;
    await setDoc(doc(fire.firebasebd, "demande", id), demande);
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Une erreur s'est produite !",
      color: "negative",
    });
  }
}

export async function clotureDemande({ dispatch }, { id, demande }) {
  try {
    let oeuvre = await dispatch("fetchOeuvre", { id: demande.idOeuvre });
    oeuvre = oeuvre.data();
    oeuvre.etat = { icon: "filter_frames", nom: "exposition" };
    await dispatch("updateOeuvre", { id: demande.idOeuvre, oeuvre: oeuvre });
    await deleteDoc(doc(fire.firebasebd, "demande", id));
  } catch (e) {
    console.log(e);
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Une erreur s'est produite !",
      color: "negative",
    });
  }
}

export async function fetchDemandeByUser({ commit }, { id }) {
  try {
    const q = await query(
      collection(fire.firebasebd, "demande"),
      where("idUser", "==", id)
    );
    const res = await getDocs(q);
    return res;
  } catch (e) {
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

export async function fetchEmpruntById({ commit }, { id }) {
  try {
    const q = await query(
      collection(fire.firebasebd, "demande"),
      where("idUser", "==", id),
      where("etat", "==", 1)
    );
    const res = await getDocs(q);
    return res || { docs: [] };
  } catch (e) {
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
