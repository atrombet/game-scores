<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/kanasta">Kanasta</RouterLink>
      <RouterLink to="/Qwirkle">Qwirkle</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
