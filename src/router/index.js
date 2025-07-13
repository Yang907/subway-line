/*
 * @Descripttion:
 * @Author: xiej
 * @Date: 2020-05-06 10:35:12
 * @LastEditors: xiej
 * @LastEditTime: 2020-10-27 10:03:49
 */
import Vue from "vue";
import Router from "vue-router";
import DrawLine from "@/components/drawLine.vue";
import RealMap from "@/components/realMap.vue";

Vue.use(Router);

export const constantRoutes = [
  {
    path: "/",
    redirect: { path: "/drawLine" },
  },
  {
    path: "/drawLine",
    component: DrawLine,
  },
  {
    path: "/realMap",
    component: RealMap,
  },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export default router;
