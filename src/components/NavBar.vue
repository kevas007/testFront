<template>
  <div class="header-bar">
    <v-img class="img" src="@/assets/icons/Trustup-pro.svg" cover></v-img>
    <div class="side"></div>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped>
.header-bar {
  width: 1280px;
  height: 64px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 1);
  border-bottom: 1px solid rgba(223, 223, 223, 1);
}
.img {
  height: 500px;
  width: 148;
  display: grid;
}
.side {
  width: 1, 091.57px;
  height: 40 px;
  gap: 10px;
}

@media (max-width: 1250px) {
  .header-bar {
    width: 376px;
    height: 64px;
    padding: 0 20px;
    background: rgba(255, 255, 255, 1);
    border-bottom: 1px solid rgba(223, 223, 223, 1);
  }
}
</style>
