<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <router-link class="navbar-brand" :to="{ name: 'Home' }">
      <img src="../assets/blue-pin.png" />
    </router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarText"
      aria-controls="navbarText"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" :class="{ active: $route.name == 'Home' }">
          <router-link :to="{ name: 'Home' }" class="nav-link navbar-brand">PointOut</router-link>
        </li>
        <li class="nav-item" :class="{ active: $route.name == 'Groups' }">
          <router-link :to="{ name: 'Groups' }" class="nav-link">Groups</router-link>
        </li>
        <li class="nav-item" :class="{ active: $route.name == 'BigMap' }">
          <router-link :to="{ name: 'BigMap' }" class="nav-link">Map</router-link>
        </li>
        <li
          v-if="$auth.isAuthenticated"
          class="nav-item"
          :class="{ active: $route.name == 'browsePoints' }"
        >
          <router-link :to="{ name: 'browsePoints' }" class="nav-link">Browse Points</router-link>
        </li>
        <li
          class="nav-item"
          v-if="$auth.isAuthenticated"
          :class="{ active: this.$route.path.startsWith('/profile') }"
        >
          <router-link class="nav-link" :to="{ name: 'Profile' }">Profile</router-link>
        </li>
      </ul>
      <span class="navbar-text">
        <button class="btn btn-success" @click="login" v-if="!$auth.isAuthenticated">Login</button>
        <button class="btn btn-light text-dark" @click="logout" v-else>Logout</button>
      </span>
    </div>
  </nav>
</template>

<script>
import axios from "axios";
import { getUserData } from "@bcwdev/auth0-vue";
import NotificationService from "../NotificationService.js";
export default {
  name: "Navbar",
  methods: {
    async login() {
      await this.$auth.loginWithPopup();
      this.$store.dispatch("setBearer", this.$auth.bearer);
      this.$store.dispatch("getProfile");
      this.$router.push({ path: "map" });
      NotificationService.toast("Logged In");
    },
    async logout() {
      this.$store.dispatch("resetBearer");
      await this.$auth.logout({ returnTo: window.location.origin });
      NotificationService.toast("Logged Out");
    }
  }
};
</script>

<style>
.navbar-brand img {
  height: 2rem;
}
</style>
