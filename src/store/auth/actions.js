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
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Notify } from "quasar";
import "core-js/es/array";

export async function fetchUserInfo() {
  try {
    let credential = LocalStorage.getItem("authCredential");
    let uid = "";
    if (fire.auth.currentUser) {
      uid = fire.auth.currentUser.uid;
    } else {
      uid = credential.user.uid;
    }

    const q = await query(
      collection(fire.firebasebd, "utilisateurs"),
      where("uid", "==", uid)
    );
    const res = await getDocs(q);
    let userInfo = res.docs[0].data();
    LocalStorage.set("user", userInfo);
    return userInfo;
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Error lors de la récupération des informations !",
      color: "negative",
    });
  }
}

export async function signIn({ dispatch }, { infos }) {
  try {
    const res = await signInWithEmailAndPassword(
      fire.auth,
      infos.email.toString().trim(),
      infos.password.toString().trim()
    );
    await LocalStorage.set("authCredential", res);
    await dispatch("fetchUserInfo");
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "insert_emoticon",
      message: "Vous etes en ligne.",
      color: "positive",
    });
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Adresse e-mail ou mot de passe incorrect.",
      color: "negative",
    });
  }
}

export async function signLeft({ commit }) {
  try {
    await signOut(fire.auth);
    LocalStorage.clear();
    commit("out");
    Notify.create({
      progress: true,
      position: "top",
      icon: "warning",
      message: "Vous avez été deconnecté",
      color: "warning",
      textColor: "dark",
    });
  } catch (e) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      message: e.message,
      color: "red",
    });
  }
}
