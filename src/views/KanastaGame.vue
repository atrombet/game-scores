<script setup>
import { onMounted, ref, computed } from 'vue'
import { EditPlayersDialog, KanastaScoreDialog, GoHomeButton, NewGameButton } from '@/components'

const players = ref([])
const editPlayersDialog = ref(null)
const scoreDialog = ref(null)

const scoresExist = computed(() => players.value[0]?.scores?.length)

const totalScores = computed(() => {
  return players.value.reduce((scores, player) => {
    return {
      ...scores,
      [player.name]: player.scores.reduce((total, score) => {
        return total + score.kanastaPoints + score.cardPoints
      }, 0)
    }
  }, {})
})

const winner = computed(() => {
  const scores = Object.values(totalScores.value)
  const maxScore = Math.max(...scores)
  if (maxScore >= 20000) {
    const winners = Object.keys(totalScores.value).filter(
      (name) => totalScores.value[name] === maxScore
    )
    return winners.length === 1 ? winners[0] : null
  }
  return null
})

const openPlayersDialog = () => editPlayersDialog.value.open(players.value || undefined)

const updatePlayers = (newPlayers) => {
  players.value = newPlayers.map((p) => ({ ...p, scores: [] }))
  saveLocal()
}

const openScoreDialog = (roundIndex) => {
  if (winner.value) return
  scoreDialog.value.open(
    players.value.map((p) => ({
      name: p.name,
      score: roundIndex >= 0 ? p.scores[roundIndex] : undefined
    })),
    roundIndex
  )
}

const scoreRound = ({ scores, roundIndex }) => {
  scores.map((playerScore) => {
    const player = players.value.find((p) => p.name === playerScore.name)
    if (roundIndex !== null && roundIndex >= 0) {
      player.scores[roundIndex] = playerScore.score
      return
    }
    player.scores.push(playerScore.score)
  })
  saveLocal()
}

const laydown = (currentScore) => {
  if (currentScore < 3000) {
    return 50
  } else if (currentScore < 6000) {
    return 90
  } else if (currentScore < 9000) {
    return 120
  } else if (currentScore < 12000) {
    return 150
  } else if (currentScore < 15000) {
    return 170
  } else if (currentScore < 20000) {
    return 190
  } else {
    return null
  }
}

const saveLocal = () => {
  localStorage.setItem('kanastaData', JSON.stringify(players.value))
}

const startNewGame = () => {
  players.value = []
  openPlayersDialog()
}

onMounted(() => {
  if (localStorage.getItem('kanastaData')) {
    players.value = JSON.parse(localStorage.getItem('kanastaData'))
  }
  if (!players.value.length) openPlayersDialog()
})
</script>

<template>
  <main class="page">
    <header class="mb-md">
      <div class="flex-between mb-md">
        <GoHomeButton />
        <NewGameButton dataKey="kanastaData" @newGame="startNewGame" />
      </div>
      <div class="flex-between align-center">
        <h1 class="ma-0">Canasta</h1>
        <button small outlined dark :disabled="scoresExist" @click="openPlayersDialog">
          <i>group_add</i>
          <span> {{ players.length ? 'Edit' : 'Add' }} teams</span>
        </button>
      </div>
    </header>
    <EditPlayersDialog
      ref="editPlayersDialog"
      title="Teams"
      :maxPlayers="2"
      @updatePlayers="updatePlayers"
    />

    <div v-if="players.length" class="text-center">
      <div class="flex-around mb-xl">
        <div v-for="player in players" :key="player.name">
          <h3 v-if="winner === player.name">
            🎉 <span class="underline">{{ player.name }}</span> 🎉
          </h3>
          <h3 v-else class="underline">{{ player.name }}</h3>
          <template v-if="player.scores">
            <h4 class="mb-xs">Total: {{ totalScores[player.name] }}</h4>
            <div>To lay down: {{ laydown(totalScores[player.name]) }}</div>
            <div
              v-for="(score, i) in player.scores"
              :key="`${player.name}Score-${i}`"
              @click="openScoreDialog(i)"
            >
              <h5>Round {{ i + 1 }}</h5>
              <div>Canasta: {{ score.kanastaPoints }}</div>
              <div>Cards: {{ score.cardPoints }}</div>
            </div>
          </template>
        </div>
      </div>
      <button @click="openScoreDialog" :disabled="!!winner">Score round</button>
      <KanastaScoreDialog ref="scoreDialog" @updateScores="scoreRound" />
    </div>
    <div v-else>Add teams to begin.</div>
  </main>
</template>
