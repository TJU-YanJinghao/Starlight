import Vue from "vue";
import Router from "vue-router";
import homepage from "@/components/homepage";
import LoginPage from "@/components/LoginPage";
import RegisterPage from "@/components/RegisterPage";
import Comprehensive from "@/components/Comprehensive";
import forum from "@/components/forum";
import usercenter from "@/components/Usercenter";
import Emotional from "@/components/Emotional";
import visual from "@/components/visual";
import Behavioral from "@/components/Behavioral";

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
      path: "/Comprehensive",
      name: "Comprehensive",
      component: Comprehensive,
    },
    {
      path: "/usercenter",
      name: "usercenter",
      component: usercenter,
    },
    {
      path: "/Emotional",
      name: "Emotional",
      component: Emotional,
    },
    {
      path: "/visual",
      name: "visual",
      component: visual,
    },
    {
      path: "/Behavioral",
      name: "Behavioral",
      component: Behavioral,
    }
  ],
});
