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
          <button type="button" class="btn btn-primary">else</button>
        </div>
      </div>
      <div class="col-12 map-col d-flex justify-content-center">
        <map-component ref="mainMap" :interactable="true" />
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
  methods: {
    centerOnUser() {
      this.$refs.mainMap.centerUpdate();
    }
  }
};
</script>

<style>
.map-col {
  padding: 0px;
}
</style>