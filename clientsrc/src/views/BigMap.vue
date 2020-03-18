<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 map-col d-flex justify-content-center">
        <map-component
          :initialCenter="{lat: 43.591, lng:-116.27948}"
          ref="mainMap"
          @update:points="updatePoints"
          :interactable="true"
          :ableToUpdate="true"
          :points="points"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MapComponent from "@/components/mapComponent";

export default {
  name: "BigMap",
  components: {
    MapComponent
  },

  mounted() {
    this.$store.dispatch("getYourGroups");
    this.$store.dispatch("getYourVisits");
    this.$nextTick(() => {
      this.updatePoints();
    });
  },
  methods: {
    centerOnUser() {
      this.$refs.mainMap.centerUpdate();
    },
    updatePoints() {
      this.$store.dispatch(
        "getPointsWithinRegion",
        this.$refs.mainMap.$refs.map.mapObject.getBounds()
      );
    }
  },
  computed: {
    points() {
      return this.$store.state.points;
    }
  }
};
</script>

<style>
.map-col {
  padding: 0px;
}
</style>