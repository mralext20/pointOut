import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import router from "../router";
import NotificationService from "../NotificationService"

Vue.use(Vuex);

let baseUrl = location.host.includes("localhost")
  ? "http://localhost:3000/"
  : "/";

let api = Axios.create({
  baseURL: baseUrl + "api",
  timeout: 3000,
  withCredentials: true
});

export default new Vuex.Store({
  state: {
    profile: {},
    points: [],
    publicGroups: [],
    yourGroups: []
  },
  mutations: {
    setProfile(state, profile) {
      state.profile = profile;
    },
    setPoints(state, points) {
      state.points = points.data
    },
    addPoint(state, point) {
      state.points.push(point)
    },
    setGroups(state, groups) {
      state.publicGroups = groups
    },
    addGroup(state, group) {
      state.publicGroups.push(group)
    },
    setYourGroups(state, groups) {
      state.yourGroups = groups
    },
    addYourGroup(state, group) {
      state.yourGroups.push(group)
    }
  },
  actions: {
    setBearer({ }, bearer) {
      api.defaults.headers.authorization = bearer;
    },
    resetBearer() {
      api.defaults.headers.authorization = "";
    },
    async getPointsWithinRegion({ commit }, { _southWest, _northEast }) {
      let points = await api.get("points", {
        params: {
          type: "region",
          x1: _southWest.lng,
          y1: _southWest.lat,
          x2: _northEast.lng,
          y2: _northEast.lat
        }
      }

      )
      commit('setPoints', points)
    },
    async getProfile({ commit }) {
      try {
        let res = await api.get("profile");
        commit("setProfile", res.data);
      } catch (error) {
        console.error(error);
      }
    },
    async createNewPoint({ commit }, pointData) {
      try {
        let res = await api.post("points", pointData)
        commit("addPoint", res.data)

      } catch (error) {
        console.error(error)
      }
    },
    async getPublicGroups({ commit }) {
      try {
        let res = await api.get("groups")
        commit("setGroups", res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async createGroup({ commit }, newGroup) {
      try {
        let res = await api.post("groups", newGroup);
        if (newGroup.public) {
          commit("addGroup", res.data)
        } else {
          commit("addYourGroup", res.data)
          if (await NotificationService.confirm("Check out your new group here", 50000)) {
            router.push({ name: "Profile groups" })
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getYourGroups({ commit }) {
      try {
        let res = await api.get("profile/groups")
        let data = res.data.map(membership => membership.group)
        commit("setYourGroups", data)
      } catch (error) {
        console.error(error)
      }
    },
  }
});
