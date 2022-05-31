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
      message: "Une erreur lors des demandes.",
      color: "negative",
    });
  }
}
