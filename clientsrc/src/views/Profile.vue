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
        >Groups</router-link>
      </li>
      <li class="nav-item">
        <router-link
          :to="{ name: 'Profile visits' }"
          class="nav-link"
          :class="{active:$route.name == 'Profile visits'}"
        >Visits</router-link>
      </li>
      <li class="nav-item">
        <router-link
          :to="{ name: 'Profile points' }"
          class="nav-link"
          :class="{active:$route.name == 'Profile points'}"
        >Points</router-link>
      </li>
    </ul>
    <div v-if="$route.name == 'Profile'">
      <div class="jumbotron">
        <img class="rounded mb-3" :src="profile.picture" alt />
        <h3 class="display-6">Welcome, {{ profile.name }}</h3>
        <p class="lead">{{ profile.email }}</p>
        <hr class="my-4" />
        <a
          class="btn btn-primary btn-sm"
          data-toggle="collapse"
          href="#collapseEdit"
          role="button"
        >Edit Profile</a>
        <div class="collapse mt-2" id="collapseEdit">
          <div class="card card-body">
            <form class="form-group" @submit.prevent="updateProfile">
              Name:
              <input id="name" type="text" v-model="editedProfile.name" />
              Picture:
              <input id="picture" v-model="editedProfile.picture" />
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="$route.name == 'Profile groups'">
      <groups :newGroups="false" :groupsData="groups" />
    </div>
    <div v-else-if="$route.name == 'Profile visits'">Visits</div>
    <div class="row" v-else-if="$route.name == 'Profile points'">
      <map-component ref="pointsMap" :points="points" :interactable="true" :ableToUpdate="false" />
      <point v-for="point in points" :pointData="point" :key="point.id" />
    </div>
  </div>
</template>

<script>
import Groups from "../components/Groups";
import Point from "../components/Point";
import MapComponent from "../components/mapComponent";
export default {
  name: "Profile",
  data() {
    return {
      edit: {},
      editedProfile: {
        name: this.$store.state.profile.name,
        picture: this.$store.state.profile.picture
      }
    };
  },
  async mounted() {
    this.$store.dispatch("getYourGroups");
    await this.$store.dispatch("getYourPoints");
    this.$refs.pointsMap.$refs.map.mapObject.fitBounds(
      this.$refs.pointsMap.$refs.points.mapObject.getBounds()
    );
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
    Point,
    MapComponent
  },
  methods: {
    updateProfile() {
      this.$store.dispatch("updateProfile", this.editedProfile);
    }
  }
};
</script>

<style scoped>
img {
  max-width: 100px;
}
</style>
