<template>
  <div class="home container">
    <div class="row">
      <div class="col d-flex flex-column align-items-center">
        <h4 class="pt-3">Welcome to Point Out!</h4>
        <p
          class="landing-pTag text-center"
        >This app will change your life! Have you ever lost your secret tree fort? Have you ever lost your house?</p>
        <div class="btn btn-primary mb-4">Sign Up Now</div>
        <map-component />
      </div>
    </div>
  </div>
</template>

<script>
import MapComponent from "@/components/mapComponent";

export default {
  name: "home",
  computed: {
    points() {
      console.log("Points: ");
      console.log(this.$store.state.points);
      return this.$store.state.points;
    }
  },
  components: {
    MapComponent
  }
};
</script>

<style scoped>
</style>
