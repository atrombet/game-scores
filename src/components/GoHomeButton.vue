<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  const confirmText = 'Going back to the home page will erase your game progress.'
  if (confirm(confirmText)) {
    router.push('/')
  }
}
</script>

<template>
  <button flat @click="goHome"><i>arrow_back</i>Home</button>
</template>
