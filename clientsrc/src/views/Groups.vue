<template>
  <div>
    <h1>Public Groups</h1>
    <group :newGroups="true" :profileCheck="false" :groupsData="groups" />
  </div>
</template>

<script>
import Group from "../components/Groups";
export default {
  name: "groupsView",
  components: {
    Group
  },
  mounted() {
    this.$store.dispatch("getPublicGroups");
  },
  computed: {
    groups() {
      return this.$store.state.publicGroups;
    }
  }
};
</script>

<style>
</style>