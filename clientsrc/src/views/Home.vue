<template>
  <div class="home container">
    <div class="row">
      <div class="col d-flex flex-column align-items-center">
        <h4 class="pt-3">Welcome to Point Out!</h4>
        <p
          class="landing-pTag text-center"
        >This app will change your life! Have you ever lost your secret tree fort? Have you ever lost your house?</p>
        <div class="btn btn-primary mb-4">Sign Up Now</div>
        <img class="img-fluid" src="../assets/landing-page-dummy-map.png" />
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

<style scoped>
.home img {
}
</style>
