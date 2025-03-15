<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="page">
    <h1>Select a game</h1>
    <div class="flex-column gap-lg">
      <RouterLink to="/canasta">Canasta</RouterLink>
      <RouterLink to="/qwirkle">Qwirkle</RouterLink>
      <RouterLink to="/star-realms">Star Realms</RouterLink>
    </div>
  </main>
</template>
