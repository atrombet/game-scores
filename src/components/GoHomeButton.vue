<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <button flat @click="router.push('/')"><i>arrow_back</i>Home</button>
</template>
