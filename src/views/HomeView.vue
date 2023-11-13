<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="page">
    <h1>Select a game</h1>
    <div class="flex-column gap-lg">
      <RouterLink to="/kanasta">Kanasta</RouterLink>
      <RouterLink to="/qwirkle">Qwirkle</RouterLink>
    </div>
  </main>
</template>
