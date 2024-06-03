<script setup>
import SideBar from "./components/SideBar.vue";
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <RouterView :RouterLink="RouterLink" />
  <SideBar :RouterLink="RouterLink" />
</template>

<style scoped></style>
