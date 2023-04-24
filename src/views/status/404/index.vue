<template>
  <section class="status_404">
    <img class="man" src="@/assets/status/404_man_cmp.png" alt="" />
    <img class="bg" src="@/assets/status/404_bg.png" alt="" />
  </section>
</template>

<script>
export default {
  name: "NotFound",
  mounted() {

  }
}
</script>

<style lang="less" scoped>
.status_404{
  display: flex;
  align-items: center;
  position: relative;
  width: 100vw;
  height: 100vh;
  user-select: none;

  .bg {
    position: absolute;
    right: 15%;
    height: 85%;
    z-index: 100;
  }

  .man {
    position: absolute;
    left: 15%;
    height: 60%;
    z-index: 200;
  }
}
</style>