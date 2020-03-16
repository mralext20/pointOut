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
    <div v-if="$route.name == 'Profile'">
      <h1>Welcome, {{ profile.name }}</h1>
      <img class="rounded" :src="profile.picture" alt />
      <p>{{ profile.email }}</p>
    </div>
    <div v-else-if="$route.name == 'Profile groups'">
      <groups :newGroups="false" :groupsData="groups" />
    </div>

    <div v-else-if="$route.name == 'Profile visits'">visits</div>
    <div class="row" v-else-if="$route.name == 'Profile points'">
      <point v-for="point in points" :pointData="point" :key="point.id" />
    </div>
  </div>
</template>

<script>
import Groups from "../components/Groups";
import Point from "../components/Point";
export default {
  name: "Profile",
  mounted() {
    this.$store.dispatch("getYourGroups");
    this.$store.dispatch("getYourPoints");
  },
  computed: {
    profile() {
      return this.$store.state.profile;
    },
    groups() {
      return this.$store.state.yourGroups;
    },
    points() {
      return this.$store.state.yourPoints;
    }
  },
  components: {
    Groups,
    Point
  }
};
</script>

<style scoped>
img {
  max-width: 100px;
}
</style>
