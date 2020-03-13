import Vue from "vue";
import VueRouter from "vue-router";
// @ts-ignore
import Home from "../views/Home.vue";
// @ts-ignore
import Profile from "../views/Profile.vue";
// @ts-ignore
import Groups from "../views/Groups.vue";
// @ts-ignore
import BigMap from "../views/BigMap.vue";
import { authGuard } from "@bcwdev/auth0-vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    beforeEnter: authGuard
  },
  {
    path: "/profile/group",
    name: "Profile group",
    component: Profile,
    beforeEnter: authGuard
  },
  {
    path: "/groups",
    name: "Groups",
    component: Groups,
    beforeEnter: authGuard
  },
  {
    path: "/map",
    name: "BigMap",
    component: BigMap,
    beforeEnter: authGuard
  }
];

const router = new VueRouter({
  routes
});

export default router;
