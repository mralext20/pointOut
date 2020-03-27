<template>
  <div class="upload">
    <div class="fields">
      <label>Upload File</label>
      <br />
      <input class="form-control-file" type="file" ref="file" @change="onSelect" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["file"],
  name: "FileUpload",
  methods: {
    onSelect() {
      let file = this.$refs.file.files[0];
      this.file = file;
      this.$emit("update:file", file)file);
    }
  }
};
</script>

<style>
</style>