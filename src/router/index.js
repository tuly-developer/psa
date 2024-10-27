import { createRouter, createWebHistory } from "vue-router";

// Layout
import MainLayout from "../layouts/MainLayout.vue";

// Views
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import FileManagerView from "@/views/filemanager/FileManagerView.vue";
import CopyFileManagerView from "@/views/filemanager/copy-filemanager.vue";

const routes = [
  {
    path: "/",
    component: LoginView,
  },

  {
    path: "/main",
    component: MainLayout,
    children: [
      {
        path: "",
        component: HomeView,
      },
      {
        path: "filemanager",
        component: FileManagerView,
      },
      {
        path : "filemanager-copy",
        component : CopyFileManagerView
      }
    ],
  },

  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
