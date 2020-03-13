import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import router from "../router";

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
    groups: []
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
      state.groups = groups
    },
    addGroup(state, group) {
      state.groups.push(group)
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
        commit("addGroup", res.data)
      } catch (error) {
        console.error(error)
      }
    }
  }
});
