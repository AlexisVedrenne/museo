import fire from "src/boot/Firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Notify } from "quasar";
import "core-js/es/array";

export async function fetchImg({ commit }, { img }) {
  try {
    const storageRef = ref(fire.storage);
    const folder = ref(storageRef, "images");
    const tempImg = ref(folder, img);
    const name = tempImg.fullPath;
    const url = await getDownloadURL(ref(fire.storage, name));
    return url;
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de la récupération de l'image",
      color: "negative",
    });
  }
}

export async function fetchAudio({ commit }, { audio }) {
  try {
    const storageRef = ref(fire.storage);
    const folder = ref(storageRef, "audio");
    const tempImg = ref(folder, audio);
    const name = tempImg.fullPath;
    const url = await getDownloadURL(ref(fire.storage, name));
    return url;
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de la récupération de l'audio",
      color: "negative",
    });
  }
}

export async function uploadImage({ dispatch }, { image }) {
  try {
    const storageRef = ref(fire.storage);
    const folder = ref(storageRef, "images/" + image.name);
    const upload = await uploadBytes(folder, image);
    return await dispatch("fetchImg", { img: upload.ref.name });
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de l'enregistrement de l'images",
      color: "negative",
    });
  }
}

export async function uploadAudio({ dispatch }, { audio }) {
  try {
    const storageRef = ref(fire.storage);
    const folder = ref(storageRef, "audio/" + audio.name);
    const upload = await uploadBytes(folder, audio);
    return await dispatch("fetchAudio", { audio: upload.ref.name });
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de l'enregistrement du fichier audio",
      color: "negative",
    });
  }
}

export async function deleteAudio({ commit }, { audio }) {
  try {
    const storageRef = store.ref(storage);
    const folder = store.ref(storageRef, "audio/" + audio);
    await store.deleteObject(folder);
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de la suppression de l'audio",
      color: "negative",
    });
  }
}

export async function deleteImage({ commit }, { image }) {
  try {
    const storageRef = store.ref(storage);
    const folder = store.ref(storageRef, "images/" + image);
    await store.deleteObject(folder);
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Erreur lors de la suppression de l'image",
      color: "negative",
    });
  }
}
