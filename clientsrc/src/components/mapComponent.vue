<template>
  <div class="map-area">
    <l-map
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
    </l-map>
  </div>
</template>
  
<script>
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
  name: "jMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip
  },
  data() {
    return {
      zoom: 10,
      center: latLng(43.615, -116.2023),
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
        zoomSnap: 0,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false
      },
      showMap: true
    };
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    innerClick() {
      alert("HELP HELP!! I've been clicked!");
      console.log(this.map);
    }
  },
  mounted() {
    this.$nextTick(() => {
      let bounds = this.$refs.map.mapObject.getBounds();
      this.$store.dispatch("getPointsWithinRegion", bounds);
    });
  },
  computed: {
    points() {
      console.log("Points: ");
      console.log(this.$store.state.points);
      return this.$store.state.points;
    }
  }
};
</script>


<style scoped>
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .map-area {
    height: 25rem;
    width: 100vw;
  }
}
/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .map-area {
    height: 60rem;
    width: 90vw;
  }
}

.map-component {
  height: 100%;
}
</style>