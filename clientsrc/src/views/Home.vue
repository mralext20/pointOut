<template>
  <div class="home container">
    <div class="row">
      <div class="col d-flex flex-column align-items-center">
        <h4 class="pt-3">Welcome to Point Out!</h4>
        <p
          class="landing-pTag text-center"
        >PointOut is a fun and engaging map-based platform that allows you to create and share points around the world. Browse public points or create private points that only you and those you choose can engage with. Public groups enable you to enjoy what others around you are sharing. Create a private group to keep all your points organized.</p>
        <div
          v-if="!$auth.isAuthenticated"
          @click="login"
          class="btn btn-primary mb-4"
        >Sign Up Now To Get Started!</div>
        <map-component
          class="sample-map"
          ref="mainMap"
          :initialCenter="{lat: 43.591, lng:-116.27948}"
          :interactable="false"
          :ableToUpdate="false"
          :points="points"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MapComponent from "@/components/mapComponent";
import axios from "axios";
import { getUserData } from "@bcwdev/auth0-vue";
import NotificationService from "../NotificationService.js";

export default {
  name: "home",
  computed: {
    points() {
      return this.$store.state.points;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$store.dispatch(
        "getPointsWithinRegion",
        this.$refs.mainMap.$refs.map.mapObject.getBounds()
      );
    });
  },
  components: {
    MapComponent
  },
  methods: {
    async login() {
      await this.$auth.loginWithPopup();
      this.$store.dispatch("setBearer", this.$auth.bearer);
      this.$store.dispatch("getProfile");
      this.$router.push({ path: "map" });
      NotificationService.toast("Logged In");
    }
  }
};
</script>

<style scoped>
.home {
  overflow: hidden;
  max-height: 90vh;
}

.sample-map {
  height: 60vh;
  width: 95vw;
}

@media only screen and (min-width: 600px) {
  .sample-map {
    height: 85vh;
    width: 100vw;
  }
}
</style>
