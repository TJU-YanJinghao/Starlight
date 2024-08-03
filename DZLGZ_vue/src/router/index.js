import Vue from "vue";
import Router from "vue-router";
import homepage from "@/components/homepage";
import LoginPage from "@/components/LoginPage";
import RegisterPage from "@/components/RegisterPage";
import retrieval from "@/components/retrieval";
import forum from "@/components/forum";
import usercenter from "@/components/Usercenter";
import visualAll from "@/components/visualAll";
import visual from "@/components/visual";
import chinaMap from "@/components/chinaMap";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "homepage",
      component: homepage,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterPage,
    },
    {
      path: "/forum",
      name: "forum",
      component: forum,
    },
    {
      path: "/retrieval",
      name: "retrieval",
      component: retrieval,
    },
    {
      path: "/usercenter",
      name: "usercenter",
      component: usercenter,
    },
    {
      path: "/visualAll",
      name: "visualAll",
      component: visualAll,
    },
    {
      path: "/visual",
      name: "visual",
      component: visual,
    },
    {
      path: "/chinaMap",
      name: "chinaMap",
      component: chinaMap,
    }
  ],
});
