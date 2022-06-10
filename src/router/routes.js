const routes = [
  {
    meta: { mustBeLogged: false },
    path: "/connexion",
    component: () => import("layouts/EmptyLayout.vue"),
    children: [
      {
        path: "",
        name: "connexion",
        component: () => import("pages/ConnexionPage.vue"),
      },
    ],
  },
  {
    meta: { mustBeLogged: false, config: true },
    path: "/",
    component: () => import("layouts/EmptyLayout.vue"),
    children: [
      {
        path: "",
        name: "debut",
        component: () => import("pages/configuration/DebutPage.vue"),
      },
      {
        path: "config",
        name: "choixConfig",
        component: () => import("pages/configuration/ConfigLogiciel.vue"),
      },
      {
        path: "code-partenaire",
        name: "codePartenaire",
        component: () => import("pages/configuration/CodePartenaire.vue"),
      },
      {
        path: "fin-partenaire",
        name: "finPartenaire",
        component: () => import("pages/configuration/FinPartenaire.vue"),
      },
    ],
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
      {
        path: "/oeuvre/type/:idType",
        name: "listeTypeOeuvre",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/artiste",
        name: "ListeArtiste",
        component: () => import("pages/artiste/ListeArtistePage.vue"),
      },
      {
        path: "/artiste/oeuvre/:idArtiste",
        name: "listeOeuvreArtiste",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/demandes",
        name: "gestionDemande",
        component: () => import("pages/demande/GestionDemandePage.vue"),
      },
      {
        path: "demandes/compte",
        name: "listeComptePartenaire",
        component: () => import("pages/demande/GestionComptePartenaire.vue"),
      },
      {
        path: "/partenaire/demandes",
        name: "listeDemandes",
        component: () => import("pages/demande/ListeDemandePage.vue"),
      },
      {
        path: "/partenaire/emprunts",
        name: "listeEmprunts",
        component: () => import("pages/demande/ListEmpruntPage.vue"),
      },
      {
        path: "/partenaire/emprunts/:id",
        name: "listeEmpruntsMusee",
        component: () => import("pages/demande/ListEmpruntPage.vue"),
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
