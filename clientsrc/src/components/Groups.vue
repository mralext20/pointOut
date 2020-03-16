<template>
  <div class="container-fluid" v-if="yourGroups">
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
            <img
              :src="group.imageUrl || require('../assets/default-group.png')"
              class="card-img"
              alt="..."
            />
          </div>
          <!-- start first -->
          <div v-if="!edit[group.id]" class="col-md-8">
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
          <!-- end first -->
          <div v-show="edit[group.id]" class="col-md-8">
            <div v-if="editedGroup[group.id]" class="card-body">
              <input class="card-title" v-model="editedGroup[group.id].title" />
              <input class="card-text" v-model="editedGroup[group.id].description" />
              <p class="card-text">
                <small class="text-muted">Created by {{group.creator.name}}</small>
              </p>
            </div>
            <div v-if="group.creator.email == $auth.userInfo.email">
              <button class="btn btn-warning" @click="editGroup(group)">cancel</button>
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
import Vue from "vue";
export default {
  name: "Groups",
  props: ["newGroups", "groupsData"],
  mounted() {
    this.$store.state.publicGroups.forEach(g => {
      if ((g.creatorEmail = this.$auth.userInfo.email)) {
        Vue.set(this.edit, g.id, false);
      }
    });
  },
  data() {
    return {
      showForm: false,
      newGroup: {
        title: "",
        description: "",
        public: true
      },
      edit: {},
      editedGroup: {}
    };
  },
  methods: {
    async editGroup(group) {
      let data = { title: group.title, description: group.description };
      await Vue.set(this.edit, group.id, !this.edit[group.id]);
      await Vue.set(this.editedGroup, group.id, data);
      editedGroup[group.id] = {
        title: group.title,
        description: group.description
      };
      console.log(this.edit[group.id]);
      let title = "";
    },
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
        memberEmail: this.$auth.userInfo.email,
        myEmail: this.$auth.userInfo.email
      });
    },
    leave(group) {
      this.$store.dispatch("leaveGroup", {
        group,
        memberEmail: this.$auth.userInfo.email,
        myEmail: this.$auth.userInfo.email
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