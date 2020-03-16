<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 text-center bg-primary">
        <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-primary" @click="centerOnUser">Center on me</button>
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
            v-if="wantToUpdatePoints"
            @click="updatePoints"
            type="button"
            class="btn btn-danger"
          >update Points</button>
        </div>
      </div>
      <div class="col-12 map-col d-flex justify-content-center">
        <map-component
          :center="{lat: 43.591, lng:-116.27948}"
          ref="mainMap"
          @update:bounds="wantToUpdatePoints= true"
          :interactable="true"
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
  data() {
    return {
      wantToUpdatePoints: false
    };
  },
  mounted() {
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
      this.wantToUpdatePoints = false;
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