<template>
  <div class="col-12 card col-md-4">
    <div class="card-body">
      <h4 class="card-title">{{pointData.title}}</h4>
      <p class="card-text">{{pointData.description}}</p>
      <img v-if="pointData.image" :src="pointData.image" :alt="`Image of {pointData.title}`" />
      <p v-if="distance" class="text-muted">{{distance.toFixed(2)}} Miles Away</p>
      <p
        v-if="!$route.name.startsWith('Profile')"
        class="text-muted"
      >created By {{pointData.creator.name}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Point",
  props: ["pointData", "location"],
  computed: {
    distance() {
      if (this.pointData.distance) {
        return this.pointData.distance;
      }
      if (!this.location || !this.location.latitude) {
        return undefined;
      }
      let lat1 = this.location.latitude;
      let lat2 = this.pointData.location.coordinates[1];
      let lon1 = this.location.longitude;
      let lon2 = this.pointData.location.coordinates[0];
      if (lat1 == lat2 && lon1 == lon2) {
        return 0;
      } else {
        var radlat1 = (Math.PI * lat1) / 180;
        var radlat2 = (Math.PI * lat2) / 180;
        var theta = lon1 - lon2;
        var radtheta = (Math.PI * theta) / 180;
        var dist =
          Math.sin(radlat1) * Math.sin(radlat2) +
          Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        return dist;
      }
    }
  }
};
</script>

<style>
</style>