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
        >My Groups</router-link>
      </li>
      <li class="nav-item">
        <router-link
          :to="{ name: 'Profile visits' }"
          class="nav-link"
          :class="{active:$route.name == 'Profile visits'}"
        >My Visits</router-link>
      </li>
      <li class="nav-item">
        <router-link
          :to="{ name: 'Profile points' }"
          class="nav-link"
          :class="{active:$route.name == 'Profile points'}"
        >My Points</router-link>
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
    <div class="row mt-1 w-100 ml-1" v-else-if="$route.name == 'Profile visits'">
      <div class="col-md-4 col-12 pt-1" v-for="visit in visits" :key="visit.id">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">{{visit.point.title}}</h4>
            <p class="card-text">First Visited on {{new Date(visit.createdAt).toLocaleDateString()}}</p>
            <p class="card-text text-muted">{{visit.point.description}}</p>
            <button class="btn btn-info btn-sm" @click="unvisit(visit.point)">Unvisit</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-else-if="$route.name == 'Profile points'">
      <div class="col-12 map pb-3">
        <map-component
          class="profile-map"
          @ready="fitBounds"
          ref="pointsMap"
          :points="points"
          :interactable="true"
          :ableToUpdate="false"
        />
      </div>
      <point v-for="point in points" :pointData="point" :location="location" :key="point.id" />
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
      location: { latitude: undefined, longitude: undefined },
      editedProfile: {
        name: this.$store.state.profile.name,
        picture: this.$store.state.profile.picture
      }
    };
  },
  async mounted() {
    this.$store.dispatch("getYourGroups");
    this.$store.dispatch("getYourPoints");
    this.$store.dispatch("getYourVisits");
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
    },
    visits() {
      return this.$store.state.yourVisits;
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
    },
    async fitBounds() {
      if (this.$store.state.yourPoints.length == 0) {
        await this.$store.dispatch("getYourPoints");
      }
      this.$refs.pointsMap.$refs.map.mapObject.fitBounds(
        this.$refs.pointsMap.$refs.points.mapObject.getBounds()
      );
      this.getLocation();
    },
    unvisit(point) {
      this.$store.dispatch("deleteVisit", point);
    },
    getLocation() {
      navigator.geolocation.getCurrentPosition(
        loc =>
          (this.location = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude
          }),
        err => console.error(err)
      );
    }
  }
};
</script>

<style scoped>
img {
  max-width: 100px;
}
.profile-map {
  height: 50vh;
  margin-bottom: 1rem;
}
</style>
