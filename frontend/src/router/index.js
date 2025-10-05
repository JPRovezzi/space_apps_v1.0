import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RiskView from "../views/RiskView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/risk",
    name: "Risk",
    component: RiskView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
