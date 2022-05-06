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
      }, {path:"/liste-type-oeuvre",name:"ListTypeOeuvre",component: () => import('pages/Oeuvres/TypeOeuvres.vue')}
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
