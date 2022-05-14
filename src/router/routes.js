const routes = [
  {
    meta: { mustBeLogged: false },
    path: "/",
    name: "connexion",
    component: () => import("pages/ConnexionPage.vue"),
  },
  {
    meta: { mustBeLogged: true },
    path: "/museo",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/liste-type-oeuvre",
        name: "ListTypeOeuvre",
        component: () => import("pages/Oeuvres/TypeOeuvres.vue"),
      },

      {
        path: "/oeuvre/:index",
        name: "detailOeuvre",
        component: () => import("pages/Oeuvres/DetailPage.vue"),
      },
      {
        path: "/oeuvre/edit/:index",
        name: "editOeuvre",
        component: () => import("pages/Oeuvres/AddArtWork.vue"),
      },
      {
        path: "/oeuvre/ajout",
        name: "ajoutOeuvre",
        component: () => import("pages/Oeuvres/AddArtWork.vue"),
      },
      {
        path: "/musee",
        name: "listMusee",
        component: () => import("pages/musee/IndexPage.vue"),
      },
      {
        path: "/musee/oeuvre/:idMusee",
        name: "listeMuseeOeuvre",
        component: () => import("pages/IndexPage.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
