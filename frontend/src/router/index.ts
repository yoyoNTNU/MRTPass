import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  Router,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "../scripts/vuex";
import axios from "axios";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    children: [
      {
        path: "MRTInfo",
        name: "MRTInfo",
        component: () => import("../views/MRTInfo.vue"),
      },
      {
        path: "MRTAnnounce",
        name: "MRTAnnounce",
        component: () => import("../views/MRTAnnounce.vue"),
      },
    ],
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/post",
    name: "viewpost",
    component: () => import("../views/submitPost.vue"),
  },
  {
    path: "/account",
    name: "myaccount",
    component: () => import("../views/account/MyAccount.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/account/MyProfile.vue"),
  },
  {
    path: "/memberlist",
    name: "memberlist",
    component: () => import("../views/MemberList.vue"),
  },
  {
    path: "/memberlist/edit",
    name: "edit",
    component: () => import("../views/MemberEdit.vue"),
  },
  {
    path: "/stationlist",
    name: "stationlist",
    component: () => import("../views/MRTStationList.vue"),
  },
  {
    path: "/stationlist/:id",
    name: "stationedit",
    component: () => import("../views/MRTStationEdit.vue"),
  },
  {
    path: "/linelist",
    name: "linelist",
    component: () => import("../views/MRTLineList.vue"),
  },
  {
    path: "/linelist/:id",
    name: "lineedit",
    component: () => import("../views/MRTLineEdit.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
const commonRoute = [
  "MRTInfo",
  "MRTAnnounce",
  "myaccount",
  "about",
  "viewpost",
  "home",
  "profile",
];
const userRoute = ["profile"];
const mrt_adminRoute = [
  "profile",
  "stationlist",
  "linelist",
  "stationedit",
  "lineedit",
];
const adminRoute = [
  "profile",
  "memberlist",
  "edit",
  "stationlist",
  "linelist",
  "stationedit",
  "lineedit",
];
const notLoginRoute = [
  "myaccount",
  "about",
  "viewpost",
  "home",
  "MRTInfo",
  "MRTAnnounce",
];
function fetchsession() {
  //axios get
  axios
    .get("http://localhost:3000/session")
    .then(function (response) {
      //console.log(response.data.data);
      if (response.data.data.isLogin) {
        //console.log(response.data.data.member);
        store.dispatch("userinfo", response.data.data.member);
        //console.log(store.state.userinfo);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  //axios
}
router.beforeEach(async (to) => {
  let isLogin = store.state.userinfo ? true : false;
  if (!isLogin) {
    fetchsession();
    if (!store.state.userinfo) {
      isLogin = true;
    }
  }
  if (isLogin) {
    const role = store.state.userinfo?.role as unknown as string;
    if (commonRoute.includes(to.name as string)) {
      return true;
    } else if (role === "user") {
      if (!userRoute.includes(to.name as string)) {
        return { name: "home" };
      }
    } else if (role === "mrt_admin") {
      if (!mrt_adminRoute.includes(to.name as string)) {
        return { name: "home" };
      }
    } else if (role === "admin") {
      if (!adminRoute.includes(to.name as string)) {
        return { name: "home" };
      }
    }
    return true;
  } else {
    if (!to.name || !notLoginRoute.includes(to.name as string)) {
      return { name: "Login" };
    }
    return true;
  }
});

export default router;
