<template>
  <div class="upload">
    <form @submit.prevent="onSubmit" enctype="multipart/form-data">
      <div class="fields">
        <label>Upload File</label>
        <br />
        <input type="file" ref="file" @change="onSelect" />
      </div>
      <div class="fields">
        <button>Submit</button>
      </div>
      <div class="message">
        <h5>{{message}}</h5>
      </div>
      <!-- <label for="formControlFile">
        <h6>Upload File</h6>
      </label>
      <input @submit.prevent="onSubmit" type="file" class="form-control-file" id="formControlFile" />-->
    </form>
  </div>
</template>

<script>
export default {
  name: "FileUpload",
  data() {
    return {
      file: "",
      message: ""
    };
  },
  methods: {
    onSelect() {
      let file = this.$refs.file.files[0];
      this.file = file;
    },
    async onSubmit() {
      let formData = new FormData();
      formData.append("file", this.file);

      try {
      } catch (error) {
        console.log(error);
        this.message = "Something went wrong";
      }
    }
  }
};
</script>

<style>
</style>