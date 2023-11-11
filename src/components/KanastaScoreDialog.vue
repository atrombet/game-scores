<script setup>
import { ref } from 'vue'

const show = ref(false)
const players = ref(null)

const open = (initPlayers) => {
  players.value = initPlayers
  show.value = true
}

const close = () => {
  show.value = false
}

defineExpose({ open, close })
</script>

<template>
  <dialog :open="show">
    <h2>Score</h2>
    <div class="flex-around">
      <div v-for="player in players" :key="player.name">
        <h3>{{ player.name }}</h3>
        <input placeholder="Kanasta points" />
        <input placeholder="Card points" />
      </div>
    </div>
  </dialog>
</template>
