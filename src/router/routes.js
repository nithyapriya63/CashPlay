const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("pages/LoginPage.vue"),
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/HomePage.vue"),
        children: [
          {
            path: "",
            redirect: "entries",
          },
          {
            path: "entries",
            name: "entries",
            component: () => import("pages/PageEntries.vue"),
          },
          {
            path: "settings",
            name: "settings",
            component: () => import("pages/PageSettings.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];
export default routes;
