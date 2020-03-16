<template>
  <div class="col-12 card col-md-4">
    <div class="card-body">
      <h4 class="card-title">{{pointData.title}}</h4>
      <p class="card-text">{{pointData.description}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["pointData"]
};
</script>

<style>
</style>