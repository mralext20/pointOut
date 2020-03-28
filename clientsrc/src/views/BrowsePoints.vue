<template>
  <div class="container-fluid mt-1">
    <div class="row browse-points">
      <point v-for="point in points" :key="point.id" :location="location" :pointData="point" />
    </div>
  </div>
</template>

<script>
import Point from "../components/Point";
export default {
  name: "browsePoints",
  data() {
    return {
      location: { latitude: undefined, longitude: undefined }
    };
  },
  mounted() {
    this.requestLocation();
  },
  computed: {
    points() {
      return this.$store.state.points;
    }
  },
  methods: {
    requestLocation() {
      navigator.geolocation.getCurrentPosition(this.updateLocation, err =>
        console.error(err)
      );
    },
    updateLocation(location) {
      this.location.latitude = location.coords.latitude;
      this.location.longitude = location.coords.longitude;
      this.$store.dispatch("getPointsWithinRadius", {
        ...this.location,
        radius: 10
      });
    }
  },
  components: {
    Point
  }
};
</script>

<style>
</style>