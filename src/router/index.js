import { createRouter, createWebHistory } from "vue-router";

import IPquiz from "../components/IPquiz.vue";
import IPv4ToIPv6 from "../components/IPv4ToIPv6.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: IPquiz },
    {
      path: "/IPquiz",
      name: "IP出題",
      component: IPquiz,
    },
    {
      path: "/IPv4ToIPv6",
      name: "IPv4轉IPv6",
      component: IPv4ToIPv6,
    },
  ],
});

export default router;
