<template>
  <div class="container-fluid">
    <div class="row">
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