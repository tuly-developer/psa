import { createRouter, createWebHistory } from "vue-router";

// Layout
import MainLayout from "../layouts/MainLayout.vue";

// Views
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import FileManagerView from "@/views/filemanager/FileManagerView.vue";
import copyFilemanagerView from "@/views/filemanager/copy-filemanager.vue";

const routes = [
  {
    path: "/login",
    component: LoginView,
  },

  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        component: HomeView,
      },
    ],
  },

  {
    path: "/filemanager",
    component: MainLayout,
    children: [
      {
        path: "",
        component: FileManagerView,
      },
      {
        path : "copy",
        component : copyFilemanagerView
      }
    ],
  },

  {
    path: "/",
    redirect: "/login",
  },

  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
