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
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  ds,
} from "firebase/auth";
import { Notify } from "quasar";
import "core-js/es/array";

export async function fetchUserInfo() {
  try {
    let credential = LocalStorage.getItem("authCredential");
    let uid = credential.user.uid;

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

export async function signInPartenaire({ dispatch }, { infos }) {
  try {
    const res = await signInWithEmailAndPassword(
      fire.auth,
      infos.email.toString().trim(),
      infos.password.toString().trim()
    );
    await LocalStorage.set("authCredential", res);
    let config = LocalStorage.getItem("config");
    const userInfos = await dispatch("fetchUserInfo");
    console.log(config);
    if (userInfos.role !== "part") {
      throw "Erreur compte partenaire";
    }
    if (config.code !== userInfos.uid) {
      throw "Erreur compte partenaire";
    }
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "insert_emoticon",
      message: "Vous etes en ligne.",
      color: "positive",
    });
    return res;
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

export async function signIn({ dispatch }, { infos }) {
  try {
    const res = await signInWithEmailAndPassword(
      fire.auth,
      infos.email.toString().trim(),
      infos.password.toString().trim()
    );
    await LocalStorage.set("authCredential", res);
    await dispatch("fetchUserInfo");
    let user = LocalStorage.getItem("user");
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "insert_emoticon",
      message: "Vous etes en ligne.",
      color: "positive",
    });
    return res;
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
    const saveConfig = LocalStorage.getItem("config");
    await signOut(fire.auth);
    LocalStorage.clear();
    LocalStorage.set("config", saveConfig);
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

export async function fetchCodePartenaire({ commit }, { code }) {
  try {
    const q = await query(
      collection(fire.firebasebd, "utilisateurs"),
      where("uid", "==", code)
    );
    const res = await getDocs(q);
    const infos = res.docs[0].data();
    if (infos.etat) {
      await LocalStorage.set("user", infos);
    } else {
      throw "Compte désactiver";
    }

    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "done",
      message: "Le code est bon.",
      color: "positive",
    });
    return infos.uid;
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Contactez votre fournisseur !",
      color: "negative",
    });
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Ce code partenaire est faux.",
      color: "negative",
    });
  }
}

export async function fetchUserInfosById({ commit }, { id }) {
  try {
    const q = await query(
      collection(fire.firebasebd, "utilisateurs"),
      where("uid", "==", id)
    );
    const res = await getDocs(q);
    let userInfo = res.docs[0].data();
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

export async function fetchComptePartenaire() {
  try {
    const q = await query(
      collection(fire.firebasebd, "utilisateurs"),
      where("role", "==", "part")
    );
    const res = await getDocs(q);
    return res;
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Error lors de la récupération des comptes partenaires !",
      color: "negative",
    });
  }
}

export async function createPartenaire({ commit }, { compte }) {
  try {
    let res = await createUserWithEmailAndPassword(
      fire.auth,
      compte.mail,
      "123456"
    );
    compte.uid = res.user.uid;
    const userRef = await addDoc(
      collection(fire.firebasebd, "utilisateurs"),
      compte
    );
    return userRef;
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Error lors de la création d'un compte partenaire !",
      color: "negative",
    });
  }
}

export async function desactivePartenaire({ dispatch }, { id, compte }) {
  try {
    compte.etat = false;
    await setDoc(doc(fire.firebasebd, "utilisateurs", id), compte);
    let demandes = await dispatch("fetchDemandeByUser", { id: compte.uid });
    for (let i = 0; i < demandes.docs.length; i++) {
      await dispatch("clotureDemande", { id: demandes.docs[i].id });
    }
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Error lors de suppression d'un partenaire",
      color: "negative",
    });
  }
}

export async function activePartenaire({ dispatch }, { id, compte }) {
  try {
    compte.etat = true;
    await setDoc(doc(fire.firebasebd, "utilisateurs", id), compte);
  } catch (error) {
    Notify.create({
      progress: true,
      position: "top",
      timeout: 1000,
      icon: "warning",
      message: "Error lors de suppression d'un partenaire",
      color: "negative",
    });
  }
}
