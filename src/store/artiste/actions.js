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
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Une erreur lors de la récupération de l'artiste",
      color: "negative",
    });
  }
}

export async function fetchAllArtist() {
  try {
    const res = await getDocs(collection(fire.firebasebd, "artistes"));
    return res;
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Une erreur lors de la récupération des artistes",
      color: "negative",
    });
  }
}

export async function addArtiste({ dispatch }, { artiste }) {
  try {
    if (artiste.image) {
      artiste.image = await dispatch("uploadImage", { image: artiste.image });
    }

    if (artiste.audio) {
      artiste.audio = await dispatch("uploadAudio", { audio: artiste.audio });
    }
    const artisteRef = await addDoc(
      collection(fire.firebasebd, "artistes"),
      artiste
    );
    return artisteRef;
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Une erreur lors de l'ajout d'un artiste",
      color: "negative",
    });
  }
}

export async function addOeuvreArtiste(
  { commit },
  { idArtiste, idOeuvre, artiste }
) {
  try {
    if (!artiste.idOeuvre.includes(idOeuvre)) {
      artiste.idOeuvre.push(idOeuvre);
      await setDoc(doc(fire.firebasebd, "artistes", idArtiste), artiste);
    }
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Une erreur lors de l'ajout d'une oeuvre à un artiste.",
      color: "negative",
    });
  }
}

export async function updateArtiste({ dispatch }, { artiste, id }) {
  try {
    if (typeof artiste.image !== "string") {
      if (artiste.image.type.includes("image")) {
        let url = await dispatch("uploadImage", { image: artiste.image });
        artiste.image = url;
      }
    }

    if (typeof artiste.audio !== "string") {
      if (artiste.audio.type.includes("audio")) {
        let url = await dispatch("uploadAudio", { audio: artiste.audio });
        artiste.audio = url;
      }
    }
    await setDoc(doc(fire.firebasebd, "artistes", id), artiste);
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

export async function deleteArtiste({ dispatch }, { id, artiste }) {
  try {
    let oeuvres = await dispatch("fetchAllOeuvres");
    artiste.idOeuvre.forEach(async (idOeuvre) => {
      oeuvres.docs.forEach(async (oeuvre) => {
        if (idOeuvre === oeuvre.id) {
          await dispatch("archiveOeuvre", {
            oeuvre: oeuvre.data(),
            id: idOeuvre,
          });
        }
      });
    });
    artiste.archiver = true;
    await setDoc(doc(fire.firebasebd, "artistes", id), artiste);
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

export async function activeArtiste({ dispatch }, { id, artiste }) {
  try {
    let oeuvres = await dispatch("fetchAllOeuvres");
    artiste.idOeuvre.forEach(async (idOeuvre) => {
      oeuvres.docs.forEach(async (oeuvre) => {
        if (idOeuvre === oeuvre.id) {
          await dispatch("expoOeuvre", {
            oeuvre: oeuvre.data(),
            id: idOeuvre,
          });
        }
      });
    });
    artiste.archiver = false;
    await setDoc(doc(fire.firebasebd, "artistes", id), artiste);
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
