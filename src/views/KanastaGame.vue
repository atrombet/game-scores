<script setup>
import { onMounted, ref } from 'vue'
import { EditPlayersDialog, KanastaScoreDialog } from '@/components'

const players = ref([])
const editPlayersDialog = ref(null)
const scoreDialog = ref(null)

const openPlayersDialog = () => editPlayersDialog.value.open()

const updatePlayers = (newPlayers) => {
  players.value = newPlayers
}

const openScoreDialog = () => scoreDialog.value.open(players.value.map((p) => ({ name: p.name })))

onMounted(() => {
  if (!players.value.length) openPlayersDialog()
})
</script>

<template>
  <main>
    <h1>Kanasta</h1>
    <h2 class="flex gap-md align-center">
      <span>Teams</span>
      <button small outlined @click="openPlayersDialog"><i>group_add</i></button>
    </h2>
    <EditPlayersDialog ref="editPlayersDialog" title="Teams" @updatePlayers="updatePlayers" />

    <div v-if="players.length" class="text-center">
      <div class="flex-around">
        <div v-for="player in players" :key="player.name">
          <h3>{{ player.name }}</h3>
          <template v-if="player.score"></template>
        </div>
      </div>
      <button @click="openScoreDialog">Score round</button>
      <KanastaScoreDialog ref="scoreDialog" />
    </div>
    <div v-else>Add teams to begin.</div>
  </main>
</template>
