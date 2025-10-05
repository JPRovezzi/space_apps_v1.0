import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MapView from "../views/MapView.vue";
import RiskView from "../views/RiskView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/map",
    name: "Map",
    component: MapView,
  },
  {
    path: "/analysis",
    name: "Analysis",
    component: () => import("../views/AnalysisView.vue"),
  },
  {
    path: "/results",
    name: "Results",
    component: () => import("../views/ResultsView.vue"),
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
