<template>
  <div class="container-fluid">
    <div class="row">
      <div class="d-flex text-center flex-column align-items-center justify-content-center col-12">
        <h1>{{group.title}}</h1>
        <p>{{group.description}}</p>
        <div v-if="group.creatorEmail == $auth.user.email">
          <h2>Invite Members</h2>
          <input v-model="newEmail" type="email" />
          <button @click="inviteUser" class="btn btn-primary">Invite</button>
        </div>
      </div>
      <div class="order-last col-md-3 col-12">
        <h4 class="text-muted">Group Members</h4>
        <div class="row">
          <div
            class="d-flex flex-column user-tag col-6 col-md-12"
            v-for="(member) in members"
            :key="member.id"
          >
            <div class="d-flex">
              <img class="user-image rounded-pill" :src="member.user.picture" alt />
              <div class="d-flex flex-column">
                <p
                  class="badge badge-primary align-self-start"
                  v-if="group.creatorEmail == member.user.email"
                >Owner</p>
                <div
                  class="d-flex flex-column align-items-center justify-content-center text-center"
                >
                  <p>{{member.user.name}}</p>
                  <button
                    @click="kickUser(member.user.email)"
                    v-if="group.creatorEmail == $auth.user.email && member.user.email != $auth.user.email"
                    class="badge badge-secondary"
                  >Kick</button>
                  <button
                    @click="kickUser(member.user.email)"
                    v-else-if="member.user.email == $auth.user.email && member.user.email != group.creatorEmail"
                    class="badge badge-secondary leave-badge"
                  >Leave</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="order-3 col-md-9 col-12">
        <point-map
          class="group-map pb-4"
          ref="map"
          @ready="fitBounds"
          :points="points"
          :interactable="true"
          :ableToUpdate="false"
        />
      </div>
    </div>
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
      if (this.$store.state.points.length == 0) {
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
  max-width: 3rem;
  max-height: 3rem;
}

.group-map {
  height: 40vh;
}
.user-tag {
  margin-bottom: 0.5rem;
}
.user-tag p {
  margin-bottom: 0rem;
}
.leave-badge {
  border: 0rem;
  box-shadow: 0rem 0.15rem 0.15rem 0rem rgba(0, 0, 0, 0.2);
}
.leave-badge:hover {
  box-shadow: 0 0.15rem 0.15rem 0 rgba(0, 0, 0, 0.2),
    0 0.2rem 0.2rem 0 rgba(0, 0, 0, 0.19);
}
</style>
