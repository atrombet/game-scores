<script setup>
import { ref, computed } from 'vue'

const dialog = ref(null)
const players = ref([])
const newPlayer = ref('')
const input = ref(null)

const canAddPlayer = computed(() =>
  props.maxPlayers ? players.value.length < props.maxPlayers : true
)

const props = defineProps({
  title: {
    type: String,
    default: 'Players'
  },
  maxPlayers: Number
})

const open = (initPlayers) => {
  if (initPlayers) {
    players.value = initPlayers.map((p) => ({ name: p.name }))
  }
  dialog.value.showModal()
  input.value.focus()
}

const close = () => {
  dialog.value.close()
}

const submit = () => {
  emit('updatePlayers', players.value)
  close()
}

const addPlayer = () => {
  if (!canAddPlayer.value) return
  players.value.push({ name: newPlayer.value })
  newPlayer.value = ''
  input.value.focus()
}

const editPlayer = (playerIndex) => {
  newPlayer.value = players.value[playerIndex].name
  deletePlayer(playerIndex)
  input.value.focus()
}

const deletePlayer = (playerIndex) => {
  players.value.splice(playerIndex, 1)
}

const emit = defineEmits(['updatePlayers'])
defineExpose({ open, close })
</script>

<template>
  <dialog ref="dialog">
    <header class="flex-between">
      <h2 class="mt-xs">{{ title }}</h2>
      <button flat @click="close"><i>close</i></button>
    </header>
    <div v-if="maxPlayers" class="mb-lg">
      Add up to {{ maxPlayers }} {{ title.toLocaleLowerCase() }} for this game.
    </div>
    <div class="flex-between gap-sm">
      <input ref="input" v-model="newPlayer" placeholder="Name" @keydown.enter="addPlayer" />
      <button @click="addPlayer" :disabled="!canAddPlayer">
        <i>person_add</i>
      </button>
    </div>
    <div class="pv-lg">
      <template v-if="players.length">
        <div v-for="(player, playerIndex) in players" :key="player.name" class="flex-between mb-sm">
          <div class="font-size-lg">{{ player.name }}</div>
          <div class="flex gap-md">
            <button flat small @click="editPlayer(playerIndex)"><i>edit</i></button>
            <button flat small @click="deletePlayer(playerIndex)"><i>delete</i></button>
          </div>
        </div>
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
