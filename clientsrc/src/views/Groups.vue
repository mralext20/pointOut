<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1>Public Groups</h1>
        <button class="btn btn-primary" @click="showForm =! showForm">Create Group</button>
      </div>
      <div v-if="showForm" class="col-12">
        <form @submit.prevent="createGroup" class="form-group">
          <input class="form-inline" type="text" v-model="newGroup.title" placeholder="title" />
          <input
            class="form-inline"
            type="text"
            v-model="newGroup.description"
            placeholder="description"
          />
          <label class="form-check-label" for="public-private-checkbox">public Group</label>
          <input
            class="form-inline"
            type="checkbox"
            id="public-private-checkbox"
            name="Public"
            v-model="newGroup.public"
          />
          <button class="btn btn-primary">submit</button>
        </form>
      </div>

      <div class="col-12 col-md-4 card mb-3" v-for="group in groups" :key="group.id">
        <div class="row">
          <div class="col-md-4 d-md-flex align-items-center">
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
  data() {
    return {
      showForm: false,
      newGroup: {
        title: "",
        description: "",
        public: true
      }
    };
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