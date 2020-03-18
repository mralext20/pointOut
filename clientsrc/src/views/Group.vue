<template>
  <div>
    <h1>{{group.title}}</h1>
    <p>{{group.description}}</p>
    <div v-if="group.creatorEmail == $auth.user.email">
      <h2>Invite Members</h2>
      <input v-model="newEmail" type="email" />
      <button @click="inviteUser" class="btn btn-primary">Invite</button>
    </div>
    <h2>Group Members:</h2>
    <div class="d-flex flex-column" v-for="(member) in members" :key="member.id">
      <div>
        <h4 v-if="group.creatorEmail == member.user.email">Owner</h4>
      </div>
      <div class="d-flex">
        <img class="user-image" :src="member.user.picture" alt />
        <p>{{member.user.name}}</p>
      </div>
      <button
        @click="kickUser(member.user.email)"
        v-if="group.creatorEmail == $auth.user.email && member.user.email != $auth.user.email"
        class="btn btn-danger"
      >Kick</button>
      <button
        @click="kickUser(member.user.email)"
        v-else-if="member.user.email == $auth.user.email && member.user.email != group.creatorEmail"
        class="btn btn-danger"
      >Leave</button>
    </div>
    <point-map
      class="group-map"
      ref="map"
      @ready="fitBounds"
      :points="points"
      :interactable="true"
      :ableToUpdate="false"
    />
    <div class="row">
      <point v-for="point in points" :key="point.id" :pointData="point" />
    </div>
  </div>
</template>

<script>
import pointMap from "../components/mapComponent";
import Point from "../components/Point";
import Swal from "sweetalert2";
import NotificationService from "../NotificationService";
export default {
  name: "groupView",
  props: [],
  components: { pointMap, Point },
  mounted() {
    this.$store.dispatch("setActiveGroup", this.$route.params.groupId);
    this.$store.dispatch("getPointsByGroupId", this.$route.params.groupId);
    this.$store.dispatch("getMembersByGroupId", this.$route.params.groupId);
  },
  methods: {
    async fitBounds() {
      if (this.$store.state.yourPoints.length == 0) {
        await this.$store.dispatch(
          "getPointsByGroupId",
          this.$route.params.groupId
        );
      }
      this.$refs.map.$refs.map.mapObject.fitBounds(
        this.$refs.map.$refs.points.mapObject.getBounds()
      );
      this.getLocation();
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
    },
    async inviteUser() {
      let req = {
        email: this.newEmail,
        groupId: this.$route.params.groupId
      };
      await this.$store.dispatch("addMember", req);
      this.newEmail = "";
    },
    async kickUser(email) {
      let req = {
        email,
        groupId: this.$route.params.groupId
      };
      if (
        await NotificationService.confirmAction(
          "Are you sure you want to kick this user?"
        )
      ) {
        this.$store.dispatch("kickMember", req);
        NotificationService.toast("User kicked.");
      }
    }
  },
  computed: {
    group() {
      return this.$store.state.activeGroup;
    },
    points() {
      return this.$store.state.points.filter(p => p.groupId == this.group.id);
    },
    members() {
      return this.$store.state.members;
    }
  },
  data() {
    return {
      location: {
        latitude: 0,
        longitude: 0
      },
      newEmail: ""
    };
  }
};
</script>

<style>
.user-image {
  max-width: 5rem;
  max-height: 5rem;
}

.group-map {
  max-height: 40vh;
}
</style>