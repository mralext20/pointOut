<template>
  <div>
    <h1>Group Details</h1>
    <h1>{{group.title}}</h1>
    <p>{{group.description}}</p>
    <h4>The group Id is {{$route.params.groupId}}</h4>
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
    console.log(this.members);
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
map {
  height: 100px;
  width: 100px;
}
</style>