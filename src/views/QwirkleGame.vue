<script setup>
import { onMounted, ref, computed } from 'vue'
import { EditPlayersDialog, GoHomeButton } from '@/components'
import { NewGameButton } from '../components'

const players = ref([])
const editPlayersDialog = ref(null)
const selectedPlayerIndex = ref(null)
const newScore = ref(null)
const scoreInput = ref(null)

const scoresExist = computed(() => players.value[0]?.scores?.length)

const totalScores = computed(() => {
  return players.value.reduce((scores, player) => {
    return {
      ...scores,
      [player.name]: player.scores.reduce((total, score) => {
        return total + score
      }, 0)
    }
  }, {})
})

const openPlayersDialog = () => editPlayersDialog.value.open(players.value || undefined)

const updatePlayers = (newPlayers) => {
  players.value = newPlayers.map((p) => ({ ...p, scores: [] }))
  saveLocal()
  selectedPlayerIndex.value = 0
}

const setSelectedPlayer = (index) => {
  selectedPlayerIndex.value = index
  newScore.value = null
  scoreInput.value.focus()
}

const recordScore = () => {
  players.value[selectedPlayerIndex.value].scores.push(Number(newScore.value))
  newScore.value = null
  if (selectedPlayerIndex.value < players.value.length - 1) {
    selectedPlayerIndex.value += 1
  } else {
    selectedPlayerIndex.value = 0
  }
  saveLocal()
  scoreInput.value.focus()
}

const editScore = (score, playerName, index) => {
  const editedScore = prompt('edit score', score)
  if (editedScore !== null || editedScore !== '') {
    players.value.find((p) => p.name === playerName).scores[index] = Number(editedScore)
  }
  saveLocal()
}

const saveLocal = () => {
  localStorage.setItem('qwirkleData', JSON.stringify(players.value))
}

const startNewGame = () => {
  players.value = []
  openPlayersDialog()
}

onMounted(() => {
  if (localStorage.getItem('qwirkleData')) {
    selectedPlayerIndex.value = 0
    players.value = JSON.parse(localStorage.getItem('qwirkleData'))
  }
  if (!players.value.length) openPlayersDialog()
})
</script>

<template>
  <main class="page">
    <header class="mb-md">
      <div class="flex-between mb-md">
        <GoHomeButton />
        <NewGameButton dataKey="qwirkleData" @newGame="startNewGame" />
      </div>
      <div class="flex-between align-center">
        <h1 class="ma-0">Qwirkle</h1>
        <button small outlined dark :disabled="scoresExist" @click="openPlayersDialog">
          <i>group_add</i>
          <span> {{ players.length ? 'Edit' : 'Add' }} players</span>
        </button>
      </div>
    </header>
    <EditPlayersDialog ref="editPlayersDialog" :maxPlayers="4" @updatePlayers="updatePlayers" />

    <div v-if="players.length" class="text-center">
      <div class="flex-around mb-xl">
        <div v-for="(player, playerIndex) in players" :key="player.name">
          <div @click="setSelectedPlayer(playerIndex)">
            <h3 class="underline mb-xs">{{ player.name }}</h3>
            <h4 class="color-accent mt-xs">{{ totalScores[player.name] }}</h4>
          </div>
          <template v-if="player.scores.length">
            <div
              v-for="(score, i) in player.scores"
              :key="`${player.name}-score-${i}`"
              class="pv-xs"
              @click="editScore(score, player.name, i)"
            >
              {{ score }}
            </div>
          </template>
        </div>
      </div>
    </div>
    <div v-else>Add players to begin.</div>
    <div v-if="players.length" class="scoreSection">
      <div class="selectedPlayerName">{{ players[selectedPlayerIndex].name }}</div>
      <input
        ref="scoreInput"
        type="number"
        inputmode="numeric"
        placeholder="Score"
        v-model="newScore"
        @keydown.enter="recordScore"
      />
      <button @click="recordScore" :disabled="!(newScore >= 0)">
        <i>add</i>
      </button>
    </div>
  </main>
</template>

<style lang="scss">
.scoreSection {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: var(--md);
  align-items: center;
  padding: var(--xl);
  border-top: var(--border);

  & input {
    width: 56px;
    text-align: center;
  }
}

.selectedPlayerName {
  font-weight: var(--font-weight-bold);
  color: var(--accent);
}
</style>
