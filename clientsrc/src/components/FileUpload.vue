<template>
  <div class="upload">
    <div class="fields">
      <label class="mt-2 mb-0">
        <h6>Upload Picture</h6>
      </label>
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
      this.$emit("update:file", file);
    }
  }
};
</script>

<style>
</style>