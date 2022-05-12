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
      message: "Error lors de la récupération de l'image",
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
      message: "Error lors de l'enregistrement de l'images",
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
      message: "Error lors de la suppression de l'image",
      color: "negative",
    });
  }
}
