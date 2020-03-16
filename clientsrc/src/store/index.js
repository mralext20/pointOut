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
    yourGroups: {},
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
    createGroup(state, group) {
      state.publicGroups.push(group)
    },
    setYourGroups(state, groups) {
      groups.forEach(group => {
        Vue.set(state.yourGroups, group.id, group)
      });

    },
    editGroup(state, group) {
      let index = state.publicGroups.findIndex(g => g.id == group.id);
      console.log(index)
      state.publicGroups[index] = group;
      state.yourGroups[group.id] = group
      console.log(state.publicGroups)
    },
    joinGroup(state, group) {
      Vue.set(state.yourGroups, group.id, group)
    },
    LeaveGroup(state, group) {
      Vue.delete(state.yourGroups, group.id)
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
    async getPublicGroups({ commit, dispatch }) {
      try {
        let res = await api.get("groups")
        commit("setGroups", res.data);
        dispatch("getYourGroups")
      } catch (error) {
        console.error(error)
      }
    },
    async createGroup({ commit }, newGroup) {
      try {
        let res = await api.post("groups", newGroup);
        if (newGroup.public) {
          commit("createGroup", res.data);
          commit("joinGroup", res.data);
        } else {
          commit("joinGroup", res.data)
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
    async joinGroup({ commit }, { group, memberEmail, myEmail }) {
      try {
        let res = await api.post(`groups/${group.id}/members`, { memberEmail })
        if (myEmail == memberEmail) {
          commit("joinGroup", group)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async leaveGroup({ commit }, { group, memberEmail, myEmail }) {
      try {
        let res = await api.delete(`groups/${group.id}/members/${memberEmail}`)
        if (myEmail == memberEmail) {
          commit("LeaveGroup", group)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async editGroup({ commit }, newGroup) {
      try {
        let res = await api.put(`groups/${newGroup.id}`, newGroup)
        commit("editGroup", res.data)
      } catch (error) {
        console.error(error)
      }
    }
  }
});
