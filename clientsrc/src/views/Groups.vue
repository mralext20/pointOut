<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1>Public Groups</h1>
      </div>
      <div class="col-12 col-md-4 card mb-3" v-for="group in groups" :key="group.id">
        <div class="row no-gutters">
          <div class="col-md-4 d-flex align-items-center">
            <img
              :src="group.imageUrl || require('../assets/default-group.png')"
              class="card-img"
              alt="..."
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">{{group.title}}</h5>
              <p class="card-text">{{group.description}}</p>
              <p class="card-text">
                <small class="text-muted">Created by {{group.creator.name}}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- end loop -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Groups",
  mounted() {
    this.$store.dispatch("getPublicGroups");
  },
  computed: {
    groups() {
      return this.$store.state.groups;
    }
  }
};
</script>

<style>
</style>