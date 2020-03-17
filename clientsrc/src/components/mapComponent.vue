<template>
  <div class="map-area">
    <div v-if="interactable" class="row">
      <div class="col-12 text-center bg-primary">
        <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-primary" @click="centerUpdate">Center On Me</button>
          <div class="btn-group btn-group-sm" role="group">
            <button
              id="btnGroupDrop1"
              type="button"
              class="btn btn-primary dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >Filter</button>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
              <a class="dropdown-item" href="#">Dropdown link</a>
              <a class="dropdown-item" href="#">Dropdown link</a>
            </div>
          </div>
          <button
            v-if="ableToUpdate && wantToUpdatePoints"
            @click="$emit('update:points', $refs.map.mapObject.getBounds()); wantToUpdatePoints = false"
            type="button"
            class="btn btn-primary"
          >Update Points</button>
        </div>
      </div>
    </div>
    <l-map
      @ready="$emit('ready')"
      @update:bounds="wantToUpdatePoints = true"
      @click="addPoint"
      v-if="showMap"
      ref="map"
      :bounds.sync="bounds"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 80%"
      class="leaflet-map"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-feature-group ref="points">
        <l-marker
          v-for="(point) in points"
          :key="point.id"
          :lat-lng="[point.location.coordinates[1], point.location.coordinates[0]]"
        >
          <l-tooltip>{{ point.title }}</l-tooltip>
          <l-popup>
            <div @click="showParagraph = !showParagraph">
              <h4>{{point.title}}</h4>
              <transition name="fade">
                <p v-show="showParagraph">
                  {{point.description}}
                  <span v-if="point.group">Group: {{point.group.title}}</span>
                </p>
              </transition>
              <button
                v-if="point.creatorEmail == userEmail"
                class="btn btn-info btn-sm"
                @click="deletePoint(point.id)"
              >DELETE</button>
            </div>
          </l-popup>
        </l-marker>
      </l-feature-group>
      <l-marker
        :icon="newPointIcon"
        v-if="showMarker && $auth.isAuthenticated && interactable"
        :lat-lng="[newPoint.lat, newPoint.lng]"
      >
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <form @submit.prevent="createNewPoint">
            <div @click.stop>
              <div class="form-group my-1">
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="Title..."
                  v-model="newPoint.title"
                  required
                />
              </div>
              <div class="form-group m-0">
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="Description..."
                  v-model="newPoint.description"
                  required
                />
              </div>
              <select class="form-control form-control-sm" v-model="newPoint.groupId">
                <option value disabled selected hidden>Group</option>
                <option
                  v-for="groupId in groupsKeys"
                  :key="groupId"
                  class="dropdown-item"
                  href="#"
                  :value="groupId"
                  @click.stop
                >{{yourGroups[groupId].title}}</option>
              </select>
              <div class="form-group my-1">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    @click="newPoint.public = !newPoint.public"
                  />
                  <label class="form-check-label" for="gridCheck">Private Point</label>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-sm" @click.stop>+</button>
          </form>
        </l-tooltip>
      </l-marker>
    </l-map>
  </div>
</template>
  
<script>
import { getUserData } from "@bcwdev/auth0-vue";
import { latLng, Icon } from "leaflet";
import NotificationService from "../NotificationService";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LIcon,
  LFeatureGroup
} from "vue2-leaflet";

export default {
  name: "map-component",
  props: ["interactable", "points", "initialCenter", "ableToUpdate"],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    LFeatureGroup
  },
  data() {
    return {
      wantToUpdatePoints: false,
      newPoint: {
        title: "",
        description: "",
        public: true,
        location: {
          type: "Point",
          coordinates: [0, 0]
        },
        lat: 0,
        lng: 0,
        groupId: ""
      },
      bounds: [],
      showMarker: false,
      zoom: 14,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 10,
      showParagraph: false,
      map: LMap,
      mapOptions: {
        zoomSnap: 1.5,
        zoomControl: this.interactable,
        dragging: this.interactable,
        scrollWheelZoom: this.interactable,
        doubleClickZoom: false
      },
      specialBounds: {},
      showMap: true,
      newPopup: {
        latlng: [43.615, -116.1523]
      },
      center: { lat: 0, lng: 0 }
    };
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    addPoint(event) {
      this.showMarker = !this.showMarker;
      this.newPoint.location.coordinates[1] = event.latlng.lat;
      this.newPoint.location.coordinates[0] = event.latlng.lng;
      this.newPoint.lat = event.latlng.lat;
      this.newPoint.lng = event.latlng.lng;
    },
    centerUpdate() {
      navigator.geolocation.getCurrentPosition(
        this.actuallyCenter,
        error => console.error(error)
        // FIXME SWAL
      );
    },
    actuallyCenter(location) {
      this.$refs.map.mapObject.panTo([
        location.coords.latitude,
        location.coords.longitude
      ]);
    },
    createNewPoint() {
      this.$store.dispatch("createNewPoint", this.newPoint);
      this.newPoint = {
        title: "",
        description: "",
        public: true,
        location: {
          type: "Point",
          coordinates: [0, 0]
        },
        lat: 0,
        lng: 0,
        groupId: ""
      };
    },
    async deletePoint(pointId) {
      if (
        await NotificationService.confirmAction(
          "Are you sure you want to delete this point?"
        )
      ) {
        this.$store.dispatch("deletePoint", pointId);
        NotificationService.toast("The point was successfully deleted.");
      }
    }
  },
  mounted() {
    this.center = this.initialCenter;
    this.$store.dispatch("getYourGroups");import Vue from "vue";
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
    activeGroup: {},
    yourPoints: [],
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
      Vue.set(state.publicGroups, index, group);
      state.yourGroups[group.id] = group
    },
    joinGroup(state, group) {
      Vue.set(state.yourGroups, group.id, group)
    },
    LeaveGroup(state, group) {
      Vue.delete(state.yourGroups, group.id)
    },
    deletePoint(state, pointId) {
      state.points = state.points.filter(p => p.id != pointId)
      state.yourPoints = state.yourPoints.filter(p => p.id != pointId)
    },
    setYourPoints(state, points) {
      state.yourPoints = points;
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
        console.error(error)
      }
    },
    async getYourPoints({ commit }) {
      try {
        let res = await api.get("/profile/points")
        commit("setYourPoints", res.data)
      } catch (error) {
        console.error(error)
      }
    },
  }
});

  },
  computed: {
    newPointIcon() {
      return L.icon({
        iconUrl: require("../assets/red-pin.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
    },
    userEmail() {
      return this.$auth.userInfo.email;
    },
    yourGroups() {
      return this.$store.state.yourGroups;
    },
    groupsKeys() {
      return Object.keys(this.$store.state.yourGroups);
    }
  }
};
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .map-area {
    height: 100vh;
    width: 100vw;
  }
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (min-width: 600px) {
  .map-area {
    height: 69rem;
    width: 100vw;
  }
}
/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .map-area {
    height: 69rem;
    width: 100%;
  }
}

.form-group {
  width: 7rem;
}

.map-component {
  height: 100%;
}

.leaflet-map {
  cursor: pointer;
}
</style>