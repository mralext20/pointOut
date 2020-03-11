<template>
  <div class="home container">
    <div class="row">
      <div class="col">
        <map-component />
      </div>
    </div>
  </div>
</template>

<script>
import MapComponent from "@/components/mapComponent";

export default {
  name: "home",
  components: {
    MapComponent
  }
};
</script>
