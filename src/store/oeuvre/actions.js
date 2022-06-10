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
import { parseStringStyle } from "@vue/shared";

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
      message: "Erreur lors de la récupération des oeuvres",
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
    let artiste = await dispatch("fetchArtiste", {
      idArtiste: oeuvre.idArtiste,
    });
    await dispatch("addOeuvreArtiste", {
      idArtiste: oeuvre.idArtiste,
      idOeuvre: oeuvreRef.id,
      artiste: artiste,
    });
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de l'ajout d'une oeuvre",
      color: "negative",
    });
  }
}

export async function archiveOeuvre({ commit }, { oeuvre, id }) {
  try {
    if (typeof oeuvre.type !== "string") {
      let q = await query(
        collection(fire.firebasebd, "typeOeuvre"),
        where("nom", "==", oeuvre.type.nom)
      );
      const res = await getDocs(q);
      oeuvre.type = res.docs[0].id;
    }
    if (oeuvre.etat.nom !== "stock") {
      oeuvre.etat = { nom: "stock", icon: "inventory_2" };
      await setDoc(doc(fire.firebasebd, "oeuvre", id), oeuvre);
    }
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de l'archivage de l'oeuvre",
      color: "negative",
    });
  }
}

export async function expoOeuvre({ commit }, { oeuvre, id }) {
  try {
    oeuvre.etat = { icon: "filter_frames", nom: "exposition" };
    await setDoc(doc(fire.firebasebd, "oeuvre", id), oeuvre);
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de l'archivage de l'oeuvre",
      color: "negative",
    });
  }
}

export async function fetchOeuvre({ dispatch }, { id }) {
  try {
    let oeuvres = await this.dispatch("fetchAllOeuvres");
    let oeuvre = oeuvres.docs.find((val) => val.id === id);
    return oeuvre;
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de la récupération de l'oeuvre",
      color: "negative",
    });
  }
}

export async function updateOeuvre({ dispatch }, { id, oeuvre }) {
  try {
    if (typeof oeuvre.image !== "string") {
      if (oeuvre.image.type.includes("image")) {
        let url = await dispatch("uploadImage", { image: oeuvre.image });
        oeuvre.image = url;
      }
    }
    await setDoc(doc(fire.firebasebd, "oeuvre", id), oeuvre);
    let artiste = await dispatch("fetchArtiste", {
      idArtiste: oeuvre.idArtiste,
    });
    await dispatch("addOeuvreArtiste", {
      idArtiste: oeuvre.idArtiste,
      idOeuvre: id,
      artiste: artiste,
    });
  } catch (error) {
    console.log(error);
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de la mise à jour de l'oeuvre",
      color: "negative",
    });
  }
}

export async function fetchOeuvreByMusee({ commit }, { idMusee }) {
  try {
    let q = await query(
      collection(fire.firebasebd, "oeuvre"),
      where("idExposition", "==", idMusee)
    );
    const res = await getDocs(q);
    return res;
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de la mise à jour de l'oeuvre",
      color: "negative",
    });
  }
}

export async function fetchOeuvreByType({ commit }, { idType }) {
  try {
    let q = await query(
      collection(fire.firebasebd, "oeuvre"),
      where("type", "==", idType)
    );
    const res = await getDocs(q);
    return res;
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de la mise à jour de l'oeuvre",
      color: "negative",
    });
  }
}

export async function fetchOeuvreByArtiste({ commit }, { idArtiste }) {
  try {
    let q = await query(
      collection(fire.firebasebd, "oeuvre"),
      where("idArtiste", "==", idArtiste)
    );
    const res = await getDocs(q);
    return res;
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de la mise à jour de l'oeuvre",
      color: "negative",
    });
  }
}

export async function fetchOeuvreByStatus({ dispatch }, { status }) {
  try {
    let res = await dispatch("fetchAllOeuvres");
    let reStatus = [];
    res.docs.forEach((oeuvre) => {
      let data = oeuvre.data();
      if (data.etat.nom.trim() === status.trim()) {
        reStatus.push(oeuvre);
      }
    });
    let oeuvre = { docs: reStatus };
    return oeuvre;
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors du filtrage par statut",
      color: "negative",
    });
  }
}
