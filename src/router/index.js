import { createRouter, createWebHashHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"

// Hash history => works on GitHub Pages with no server rewrites.
const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 80 }
    return { top: 0 }
  },
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/read", name: "read", component: () => import("../views/ReadView.vue") },
    { path: "/read/:slug/:part(\\d+)?", name: "chapter", component: () => import("../views/ChapterView.vue"), props: true },
    { path: "/about", name: "about", component: () => import("../views/AboutView.vue") },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
})
export default router