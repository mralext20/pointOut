<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 mt-3 d-flex justify-content-center">
        <map-component :interactable="true" />
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
  }
};
</script>

<style>
</style>