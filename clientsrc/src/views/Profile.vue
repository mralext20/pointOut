<template>
  <div class="about text-center">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <router-link
          :to="{ name: 'Profile' }"
          class="nav-link"
          :class="{active:$route.name == 'Profile'}"
        >Profile</router-link>
      </li>
      <li class="nav-item">
        <router-link
          :to="{ name: 'Profile groups' }"
          class="nav-link"
          :class="{active:$route.name == 'Profile groups'}"
        >groups</router-link>
      </li>
      <li class="nav-item">
        <router-link
          :to="{ name: 'Profile visits' }"
          class="nav-link"
          :class="{active:$route.name == 'Profile visits'}"
        >visits</router-link>
      </li>
      <li class="nav-item">
        <router-link
          :to="{ name: 'Profile points' }"
          class="nav-link"
          :class="{active:$route.name == 'Profile points'}"
        >points</router-link>
      </li>
    </ul>
    <h1>Welcome, {{ profile.name }}</h1>
    <img class="rounded" :src="profile.picture" alt />
    <p>{{ profile.email }}</p>
  </div>
</template>

<script>
export default {
  name: "Profile",
  computed: {
    profile() {
      return this.$store.state.profile;
    }
  }
};
</script>

<style scoped>
img {
  max-width: 100px;
}
</style>
