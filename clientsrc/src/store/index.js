import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import router from "../router";
import NotificationService from "../NotificationService";

Vue.use(Vuex);

let baseUrl = location.host.includes("localhost") ? "http://localhost:3000/" : "/";

let api = Axios.create({
  baseURL: baseUrl + "api",
  timeout: 30000,
  withCredentials: true
});

export default new Vuex.Store({
  state: {
    profile: {},
    points: [],
    publicGroups: [],
    yourGroups: {},
    activeGroup: {},
    yourPoints: [],
    yourVisits: {},

  },
  mutations: {
    // #region Profile

    setProfile(state, profile) {
      state.profile = profile;
    },
    updateProfile(state, profile) {
      state.profile.name = profile.name;
      state.profile.picture = profile.picture;
    },
    // #endregion
    // #region Points

    setPoints(state, points) {
      state.points = points.data;
    },
    addPoint(state, point) {
      state.points.push(point);
    },
    deletePoint(state, pointId) {
      state.points = state.points.filter(p => p.id != pointId);
      state.yourPoints = state.yourPoints.filter(p => p.id != pointId);
    },
    setYourPoints(state, points) {
      state.yourPoints = points;
    },

    // #endregion
    // #region visits
    setYourVisits(state, visits) {
      let data = {}
      visits.forEach(v => {
        data[v.pointId] = v
      })
      state.yourVisits = data
    },
    visitPoint(state, point) {
      Vue.set(state.yourVisits, point.pointId, point)
    },
    deleteVisit(state, pointId) {
      Vue.delete(state.yourVisits, pointId)
    },

    // //#endregion
    // #region Groups

    setGroups(state, groups) {
      state.publicGroups = groups;
    },
    createGroup(state, group) {
      state.publicGroups.push(group);
    },
    setYourGroups(state, groups) {
      groups.forEach(group => {
        Vue.set(state.yourGroups, group.id, group);
      });
    },
    editGroup(state, group) {
      let index = state.publicGroups.findIndex(g => g.id == group.id);
      Vue.set(state.publicGroups, index, group);
      Vue.set(state.yourGroups, group.id, group);
    },

    joinGroup(state, group) {
      Vue.set(state.yourGroups, group.id, group);
    },
    LeaveGroup(state, group) {
      Vue.delete(state.yourGroups, group.id);
    }
    // #endregion
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

      );
      commit('setPoints', points);
    },
    async getPointsWithinRadius({ commit }, data) {
      let points = await api.get("points", {
        params: {
          type: "radius",
          ...data
        }
      })
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
        let res = await api.post("points", pointData);
        commit("addPoint", res.data);

      } catch (error) {
        console.error(error);
      }
    },
    async getPublicGroups({ commit, dispatch }) {
      try {
        let res = await api.get("groups");
        commit("setGroups", res.data);
        dispatch("getYourGroups");
      } catch (error) {
        console.error(error);
      }
    },
    async createGroup({ commit }, newGroup) {
      try {
        let res = await api.post("groups", newGroup);
        if (newGroup.public) {
          commit("createGroup", res.data);
          commit("joinGroup", res.data);
        } else {
          commit("joinGroup", res.data);
          if (await NotificationService.confirm("Check out your new group here", 50000)) {
            router.push({ name: "Profile groups" });
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getYourGroups({ commit }) {
      try {
        let res = await api.get("profile/groups");
        let data = res.data.map(membership => membership.group);
        commit("setYourGroups", data);
      } catch (error) {
        console.error(error);
      }
    },
    async joinGroup({ commit }, { group, memberEmail, myEmail }) {
      try {
        let res = await api.post(`groups/${group.id}/members`, { memberEmail });
        if (myEmail == memberEmail) {
          commit("joinGroup", group);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async leaveGroup({ commit }, { group, memberEmail, myEmail }) {
      try {
        let res = await api.delete(`groups/${group.id}/members/${memberEmail}`);
        if (myEmail == memberEmail) {
          commit("LeaveGroup", group);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async editGroup({ commit }, newGroup) {
      try {
        let res = await api.put(`groups/${newGroup.id}`, newGroup);
        commit("editGroup", res.data);
      } catch (error) {
        console.error(error);
      }
    },
    async updateProfile({ commit, state }, newProfile) {
      try {
        if (!newProfile.name) {
          newProfile.name = state.profile.name;
        }
        if (!newProfile.picture) {
          newProfile.picture = state.profile.picture;
        }
        let res = await api.put("profile", newProfile);
        commit("updateProfile", newProfile);
      } catch (error) {
        console.error(error);
      }
    },
    async deletePoint({ commit }, pointId) {
      try {
        let res = await api.delete(`points/${pointId}`)
        commit("deletePoint", pointId)
      } catch (error) {
        console.error(error)
      }
    },
    async getPointsByGroupId({ commit }, groupId) {
      try {
        let res = await api.get(`groups/${groupId}/points`)
        commit("setPoints", res.data)
      } catch (error) {
        console.error(error);
      }
    },
    async getYourPoints({ commit }) {
      try {
        let res = await api.get("/profile/points");
        commit("setYourPoints", res.data);
      } catch (error) {
        console.error(error);
      }
    },
    async getYourVisits({ commit }) {
      try {
        let res = await api.get("profile/visits");
        commit("setYourVisits", res.data)
      } catch (error) {
        console.error(error);
      }
    },
    async visitPoint({ commit }, point) {
      try {
        let res = await api.post("visits", { pointId: point.id })
        commit("visitPoint", { ...res.data, point })
      } catch (error) {
        console.error(error)
      }
    },
    async deleteVisit({ commit }, point) {
      try {
        await api.delete(`visits/${point.id}`)
        commit("deleteVisit", point.id)
      } catch (error) {

      }
    }
  }
});
