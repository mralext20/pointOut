<template>
  <div class="col-12 card col-md-4">
    <img class="card-img-top" data-src="holder.js/100x180/?text=Image cap" alt="Card image cap" />
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