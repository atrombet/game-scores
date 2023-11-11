<script setup>
import { ref } from 'vue'

const show = ref(false)
const players = ref([])
const newPlayer = ref('')
const input = ref(null)

defineProps({
  title: {
    type: String,
    default: 'Players'
  }
})

const open = () => {
  show.value = true
}

const close = () => {
  show.value = false
}

const submit = () => {
  emit('updatePlayers', players.value)
  close()
}

const addPlayer = () => {
  players.value.push({ id: players.value.length + 1, name: newPlayer.value })
  newPlayer.value = ''
  input.value.focus()
}

const emit = defineEmits(['updatePlayers'])
defineExpose({ open, close })
</script>

<template>
  <dialog :open="show">
    <button flat @click="close"><i>close</i></button>
    <h2>{{ title }}</h2>
    <div class="flex gap-sm">
      <input ref="input" v-model="newPlayer" placeholder="Name" @keydown.enter="addPlayer" />
      <button @click="addPlayer"><i>person_add</i></button>
    </div>
    <div class="pv-lg">
      <template v-if="players.length">
        <div v-for="player in players" :key="player.name">{{ player.name }}</div>
      </template>
      <div v-else>None yet.</div>
    </div>
    <button @click="submit">Save</button>
  </dialog>
</template>

<style lang="scss">
.closeButton {
  position: absolute;
  top: var(--sm);
  right: var(--sm);
}
</style>
