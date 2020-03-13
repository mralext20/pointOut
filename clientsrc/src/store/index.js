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
    points: []
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
    deletePoint(state, pointId) {
      state.points = state.points.filter(p => p.id != pointId)
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

    async deletePoint({ commit }, pointId) {
      try {

        let res = await api.delete(`points/${pointId}`)
        commit("deletePoint", pointId)

      } catch (error) {
        console.error(error)
      }

    }
  }
});
