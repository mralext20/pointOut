<template>
  <div class="map-area">
    <div v-if="showMarker">create</div>
    <l-map
      @click="addPoint"
      v-if="showMap"
      ref="map"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 80%"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-marker
        v-for="(point) in points"
        :key="point.id"
        :lat-lng="[point.location.coordinates[1], point.location.coordinates[0]]"
      >
        <l-popup>
          <div @click="showParagraph = !showParagraph">
            <h4>{{point.title}}</h4>
            <p v-show="showParagraph">{{point.description}}</p>
          </div>
        </l-popup>
      </l-marker>
      <l-marker
        :icon="newPointIcon"
        v-if="showMarker && $auth.isAuthenticated"
        :lat-lng="[newPoint.lat, newPoint.lng]"
      >
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div @click.stop="createNewPoint">
            <form>
              <div class="form-group my-1">
                <input class="form-control form-control-sm" type="text" placeholder="Title..." />
              </div>
              <div class="form-group m-0">
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="Description..."
                />
              </div>
              <div class="form-group my-1">
                <input class="form-control form-control-sm" type="text" placeholder="Image" />
              </div>
              <div class="form-group">
                <input type="file" class="form-control-file" id="exampleFormControlFile1" />
              </div>
            </form>
          </div>
        </l-tooltip>
      </l-marker>
    </l-map>
  </div>
</template>
  
<script>
import { getUserData } from "@bcwdev/auth0-vue";
import { latLng, Icon } from "leaflet";
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
  LIcon
} from "vue2-leaflet";

export default {
  name: "map-component",
  props: ["interactable"],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip
  },
  data() {
    return {
      newPoint: {
        lat: 0,
        lng: 0
      },
      showMarker: false,
      zoom: 14,
      center: latLng(43.591, -116.27948),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(43.615, -116.2023),
      withTooltip: latLng(43.615, -116.2023),
      currentZoom: 10,
      currentCenter: latLng(43.615, -116.2023),
      showParagraph: false,
      map: LMap,
      mapOptions: {
        zoomSnap: 1.5,
        zoomControl: this.interactable,
        dragging: this.interactable,
        scrollWheelZoom: this.interactable,
        doubleClickZoom: this.interactable
      },
      showMap: true,
      newPopup: {
        latlng: [43.615, -116.1523]
      }
    };
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    addPoint(event) {
      this.showMarker = true;
      this.newPoint = event.latlng;
    },
    createNewPoint() {
      console.log("point");
      console.log(this.newPoint);
    }
  },
  mounted() {
    this.$nextTick(() => {
      let bounds = this.$refs.map.mapObject.getBounds();
      this.$store.dispatch("getPointsWithinRegion", bounds);
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
    points() {
      return this.$store.state.points;
    }
  }
};
</script>


<style scoped>
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .map-area {
    height: 100vh;
    width: 100vw;
  }
}
/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .map-area {
    height: 60rem;
    width: 100%;
  }
}

.form-group {
  width: 7rem;
}

.map-component {
  height: 100%;
}
</style>