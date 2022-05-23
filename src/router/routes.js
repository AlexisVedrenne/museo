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
        path: "/list-artist",
        name: "listArtist",
        component: () => import("pages/Artiste/IndexPage.vue"),
      },
    ],
  },

  //Artist
  /*
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
        path: "/artiste",
        name: "ListeArtiste",
        component: () => import("pages/artiste/ListeArtistePage.vue"),
      },
    ],
  },
  */

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
