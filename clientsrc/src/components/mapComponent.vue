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
            <div class="dropdown-menu dropright filter-menu">
              <button
                class="dropdown-item"
                id="btnGroupDrop2"
                type="button"
                data-toggle="dropdown"
              >By Rating</button>
              <div class="dropdown-menu filter-options">
                <select
                  class="form-control"
                  id="exampleFormControlSelect1"
                  @click.stop
                  v-model="minStars"
                >
                  <option disabled hidden>Min Stars</option>
                  <option value="0">Show all</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Stars</option>
                </select>
              </div>
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
      @update:bounds="checkWantToUpdatePoints"
      @click="addPoint"
      v-if="showMap"
      ref="map"
      :bounds.sync="bounds"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      class="leaflet-map"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-feature-group ref="points">
        <l-marker
          v-for="(point) in filteredPoints"
          :key="point.id"
          :lat-lng="[point.location.coordinates[1], point.location.coordinates[0]]"
        >
          <l-tooltip>{{ point.title }}</l-tooltip>
          <l-popup>
            <div>
              <img
                class="img"
                v-if="point.image"
                :src="point.image"
                :alt="`Image of {point.title}`"
              />
              <h4>{{point.title}}</h4>
              <p>{{point.description}}</p>
              <p>
                <span v-if="point.group">
                  Group:
                  <span v-if="point.creatorEmail == $auth.userInfo.email">
                    <select class="form-control form-control-sm" v-model="newPoint.groupId">
                      <option
                        class="dropdown-item"
                        @click.stop
                        v-if="!point.groupId"
                        selected
                        :value="undefined"
                      >Group</option>
                      <option
                        class="dropdown-item"
                        @click.stop
                        :value="undefined"
                        v-else
                      >{{yourGroups[point.groupId].title}}</option>
                      <option class="dropdown-item" :value="undefined" @click.stop>No Group</option>
                      <option
                        @click="changeGroup(point.id)"
                        v-for="group in yourGroups"
                        :key="group.id"
                        class="dropdown-item"
                        href="#"
                        :value="group.id"
                      >{{group.title}}</option>
                    </select>
                  </span>
                  {{point.group.title}}
                </span>
              </p>
              <div v-if="interactable" class="text-center">
                <div
                  title="Click to Favorite Point"
                  v-if="!yourFavorites[point.id]"
                  class="far fa-heart fa-lg"
                  @click.stop="favorite(point)"
                ></div>
                <div
                  v-else
                  title="Click to Unfavorite Point"
                  class="fas fa-heart fa-lg"
                  @click.stop="unfavorite(point)"
                ></div>
                <div
                  title="Click to Visit Point"
                  v-if="!yourVisits[point.id]"
                  class="far fa-eye fa-lg ml-2"
                  @click.stop="visit(point)"
                ></div>
                <div
                  title="Click to Unvisit Point"
                  v-else-if="yourVisits[point.id]"
                  class="fas fa-eye fa-lg ml-2"
                  @click.stop="unvisit(point)"
                ></div>
                <div
                  title="Click to Delete Point"
                  v-if="point.creatorEmail == userEmail"
                  class="far fa-trash-alt fa-lg ml-2"
                  @click="deletePoint(point.id)"
                ></div>
                <div
                  title="Click to Flag Point"
                  v-if="!point.reported"
                  class="far fa-flag fa-lg ml-2"
                  @click.stop="report(point.id)"
                ></div>
              </div>
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
          <form @click.stop @submit.prevent="createNewPoint">
            <div>
              <div class="form-group my-1">
                <input
                  @click.stop
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="Title..."
                  v-model="newPoint.title"
                  required
                />
              </div>
              <div class="form-group m-0">
                <input
                  @click.stop
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="Description..."
                  v-model="newPoint.description"
                  required
                />
              </div>
              <div class="form-group mt-1 mb-2">
                <select @click.stop class="form-control form-control-sm" v-model="newPoint.groupId">
                  <option selected hidden>Group</option>
                  <option class="dropdow-item" :value="undefined" @click.stop>No Group</option>
                  <option
                    v-for="group in yourGroups"
                    :key="group.id"
                    class="dropdown-item"
                    href="#"
                    :value="group.id"
                    @click.stop
                  >{{group.title}}</option>
                </select>
              </div>

              <div class="form-group my-1">
                <div class="form-check">
                  <label for="check-private" class="form-check-label">
                    <input
                      id="check-private"
                      class="form-check-input"
                      type="checkbox"
                      @click.stop="newPoint.public = !newPoint.public"
                    />Private Point
                  </label>
                </div>
                <file-upload :file.sync="newPoint.file" />
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
import FileUpload from "../components/FileUpload.vue";
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
    LFeatureGroup,
    FileUpload
  },
  data() {
    return {
      loaded: false,
      wantToUpdatePoints: false,
      minStars: 0,
      newPoint: {
        file: undefined,
        title: "",
        description: "",
        public: true,
        location: {
          type: "Point",
          coordinates: [0, 0]
        },
        lat: 0,
        lng: 0,
        groupId: undefined
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
    checkWantToUpdatePoints() {
      if (this.loaded) {
        this.wantToUpdatePoints = true;
      }
      this.loaded = true;
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
        groupId: undefined,
        file: undefined
      };
      NotificationService.toast("Point Created!");
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
    },
    async changeGroup(pointId) {
      let req = {
        pointId,
        groupId: this.newPoint.groupId
      };
      await this.$store.dispatch("changePointGroup", req);
      this.newPoint.groupId = "";
    },
    visit(point) {
      this.$store.dispatch("visitPoint", point);
      NotificationService.toast("Point Visited!");
    },
    unvisit(point) {
      this.$store.dispatch("deleteVisit", point);
      NotificationService.toast("Point Unvisited");
    },
    favorite(point) {
      this.$store.dispatch("favoritePoint", point);
      NotificationService.toast("Point Favorited!");
    },
    unfavorite(point) {
      this.$store.dispatch("unFavoritePoint", point);
      NotificationService.toast("Point Unfavorited");
    },
    report(pointId) {
      this.$store.dispatch("reportPoint", pointId);
      NotificationService.toast("Point Reported. Thank you!");
    }
  },
  mounted() {
    this.center = this.initialCenter;
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
    yourVisits() {
      return this.$store.state.yourVisits;
    },
    yourFavorites() {
      return this.$store.state.yourFavorites;
    },
    userEmail() {
      return this.$auth.userInfo.email;
    },
    yourGroups() {
      return this.$store.state.yourGroups;
    },
    groupsKeys() {
      return Object.keys(this.$store.state.yourGroups);
    },
    filteredPoints() {
      return this.points.filter(p => p.averageVote >= this.minStars);
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

.filter-menu.dropdown-menu {
  display: block;
  visibility: hidden;
  opacity: 0;
  transform: translate(-10vw, -10vh) !important;
  transition: 0.2s ease all;
}
.filter-menu.dropdown-menu.show {
  display: block;
  visibility: visible;
  opacity: 1;
  transform: translate(-10vw, 4.5vh) !important;
  transition: 0.2s ease all;
}
.filter-options.dropdown-menu {
  display: block;
  visibility: hidden;
  opacity: 0;
  transform: translate(-10vw, -10vh) !important;
  transition: 0.2s ease all;
}
.filter-options.dropdown-menu.show {
  display: block;
  visibility: visible;
  opacity: 1;
  transform: translate(-5vw, 8vh) !important;
  transition: 0.2s ease all;
}
.form-group {
  width: 7rem;
}
.map-component {
  height: 99vh;
}
.leaflet-map {
  cursor: pointer;
  height: 100%;
}
.img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
</style>