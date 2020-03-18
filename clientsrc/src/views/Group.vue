<template>
  <div>
    <h1>{{group.title}}</h1>
    <p>{{group.description}}</p>
    <h2>Group Members:</h2>
    <div class="d-flex flex-column" v-for="(member) in members" :key="member.id">
      <div>
        <h4 v-if="group.creator.email == member.user.email">Owner</h4>
      </div>
      <div class="d-flex">
        <img class="user-image" :src="member.user.picture" alt />
        <p>{{member.user.name}}</p>
      </div>
    </div>
    <point-map
      :points="points"
      :interactable="true"
      :initialCenter="location"
      :ableToUpdate="true"
    />
  </div>
</template>

<script>
import pointMap from "../components/mapComponent";
export default {
  name: "groupView",
  props: [],
  components: { pointMap },
  mounted() {
    this.$store.dispatch("setActiveGroup", this.$route.params.groupId);
    this.$store.dispatch("getPointsByGroupId", this.$route.params.groupId);
    this.$store.dispatch("getMembersByGroupId", this.$route.params.groupId);
  },
  methods: {
    getCenter() {
      navigator.geolocation.getCurrentPosition(this.findCenter, error =>
        console.error(error)
      );
    },
    findCenter(location) {
      this.$refs.map.mapObject.panTo([
        location.coords.latitude,
        location.coords.longitude
      ]);
    }
  },
  computed: {
    group() {
      return this.$store.state.activeGroup;
    },
    points() {
      return this.$store.state.points;
    },
    members() {
      console.log(this.$store.state.members);
      return this.$store.state.members;
    }
  },
  data() {
    return {
      location: [43.9688653, -116.8089987],
      groupMembers: []
    };
  }
};
</script>

<style>
.user-image {
  max-width: 5rem;
  max-height: 5rem;
}
</style>