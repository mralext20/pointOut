<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <button v-if="newGroups" class="btn btn-primary" @click="showForm =! showForm">Create Group</button>
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

      <div class="col-12 col-md-4 card mb-3" v-for="group in groupsData" :key="group.id">
        <div class="row">
          <div class="col-md-4 d-md-flex align-items-center">
            <img :src="group.imageUrl || require('../assets/default-group.png')" class="card-img" />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">{{group.title}}</h5>
              <p class="card-text">{{group.description}}</p>
              <p class="card-text">
                <small class="text-muted">Created by {{group.creator.name}}</small>
              </p>
            </div>
            <div v-if="group.creator.email == $auth.userInfo.email">
              <button class="btn btn-warning" @click="editGroup(group)">edit</button>
              <button class="btn btn-danger" @click="deleteGroup(group)">Delete</button>
            </div>
            <div v-else>
              <button v-if="yourGroups[group.id]" @click="leave(group)" class="btn btn-danger">leave</button>
              <button v-else class="btn btn-success" @click="join(group)">join</button>
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
  props: ["newGroups", "groupsData"],
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
  methods: {
    createGroup() {
      this.$store.dispatch("createGroup", { ...this.newGroup });
      this.newGroup = {
        title: "",
        description: "",
        public: true
      };
    },
    join(group) {
      this.$store.dispatch("joinGroup", {
        group,
        memberEmail: this.$auth.userInfo.email
      });
    },
    leave(group) {
      this.$store.dispatch("leaveGroup", {
        group,
        memberEmail: this.$auth.userInfo.email
      });
    },
    deleteGroup(group) {
      this.$store.dispatch("deleteGroup", {
        group
      });
    }
  },
  computed: {
    yourGroups() {
      return this.$store.state.yourGroups;
    }
  }
};
</script>

<style>
</style>