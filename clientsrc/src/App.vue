<template>
  <div id="app" class="app bg-light">
    <navbar />
    <router-view />
    <footer class="bg-dark bottom fixed-bottom d-flex flew-row text-light justify-content-center">
      <h6>&copy</h6>
      <h6>Point Out Inc.</h6>
    </footer>
  </div>
</template>

<script>
import Navbar from "@/components/navbar";
import { onAuth } from "@bcwdev/auth0-vue";
export default {
  name: "App",
  async beforeCreate() {
    await onAuth();
    if (this.$auth.isAuthenticated) {
      this.$store.dispatch("setBearer", this.$auth.bearer);
      this.$store.dispatch("getProfile");
    }
  },
  components: {
    Navbar
  }
};
</script>

<style lang="scss">
@import "./assets/_variables.scss";
@import "bootstrap";
</style>
