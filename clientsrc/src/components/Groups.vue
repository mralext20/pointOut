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
            required
          />
          <label class="form-check-label" for="public-private-checkbox">public Group</label>
          <input
            class="form-inline"
            type="checkbox"
            id="public-private-checkbox"
            name="Public"
            v-model="newGroup.public"
            required
          />
          <button class="btn btn-primary">submit</button>
        </form>
      </div>

      <div class="col-12 col-md-4 card mb-3" v-for="group in groupsData" :key="group.id">
        <div class="row">
          <div class="col-md-4 d-md-flex align-items-center">
            <img :src="group.imageUrl || require('../assets/default-group.png')" class="card-img" />
          </div>
          <!-- start first -->
          <div v-if="!edit[group.id]" class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">{{group.title}}</h5>
              <div v-if="$route.name != 'Groups'">
                <span v-if="group.public" class="badge badge-secondary">Public</span>
                <span v-else class="badge badge-primary">Private</span>
              </div>
              <p class="card-text">{{group.description}}</p>

              <p class="card-text">
                <small class="text-muted">Created by {{group.creator.name}}</small>
              </p>
            </div>
            <div v-if="group.creatorEmail == $auth.userInfo.email">
              <button class="btn btn-warning" @click="editGroup(group)">edit</button>
              <button class="btn btn-danger" @click="deleteGroup(group)">Delete</button>
            </div>
            <div v-else>
              <button v-if="yourGroups[group.id]" @click="leave(group)" class="btn btn-danger">leave</button>
              <button v-else class="btn btn-success" @click="join(group)">join</button>
            </div>
            <p @click="setActiveGroup(group.id)">Display group's points</p>
          </div>
          <!-- end first -->
          <div v-show="edit[group.id]" class="col-md-8">
            <div v-if="editedGroup[group.id]" class="card-body">
              <form @submit.prevent="putGroup(group.id)" class="form-group">
                <input
                  class="form-inline"
                  type="text"
                  v-model="editedGroup[group.id].title"
                  placeholder="title"
                />
                <input
                  class="form-inline"
                  type="text"
                  v-model="editedGroup[group.id].description"
                  placeholder="description"
                />
                <label class="form-check-label" for="public-private-checkbox">public Group</label>
                <input
                  class="form-inline"
                  type="checkbox"
                  id="public-private-checkbox"
                  name="Public"
                  v-model="editedGroup[group.id].public"
                />
                <button class="btn btn-primary">submit</button>
              </form>
              <p class="card-text">
                <small class="text-muted">Created by {{group.creator.name}}</small>
              </p>
            </div>
            <div v-if="group.creatorEmail == $auth.userInfo.email">
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
  props: ["newGroups", "groupsData", "profileCheck"],
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
      let data = {
        title: group.title,
        description: group.description,
        public: group.public,
        id: group.id
      };
      await Vue.set(this.edit, group.id, !this.edit[group.id]);
      await Vue.set(this.editedGroup, group.id, data);
    },
    putGroup(id) {
      this.$store.dispatch("editGroup", this.editedGroup[id]);
      Vue.set(this.edit, id, false);
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
    },
    setActiveGroup(groupId) {
      this.$store.dispatch("setActiveGroup", groupId);
      this.$router.push(`group/${groupId}`);
    }
  },
  computed: {
    yourGroups() {
      return this.$store.state.yourGroups;
    },
    publicGroups() {
      return this.$store.state.publicGroups;
    }
  }
};
</script>

<style>
</style>