<script setup>
import { onMounted, ref, computed, nextTick } from 'vue'
import { EditPlayersDialog, GoHomeButton, NewGameButton } from '@/components'

const DATA_KEY = 'tallyData'
// Games saved before this page became a general tally.
const LEGACY_DATA_KEY = 'qwirkleData'

const players = ref([])
const editPlayersDialog = ref(null)
const selectedPlayerIndex = ref(0)
const newScore = ref(null)
const scoreInput = ref(null)
const scrollArea = ref(null)

const scoresExist = computed(() => players.value.some((player) => player.scores.length))

const roundCount = computed(() => Math.max(0, ...players.value.map((p) => p.scores.length)))

const totalScores = computed(() =>
  players.value.map((player) => player.scores.reduce((total, score) => total + score, 0))
)

const isScore = (value) => value !== null && value !== '' && Number.isFinite(Number(value))

const openPlayersDialog = () => editPlayersDialog.value.open(players.value || undefined)

const updatePlayers = (newPlayers) => {
  players.value = newPlayers.map((p) => ({ ...p, scores: [] }))
  selectedPlayerIndex.value = 0
  saveLocal()
}

const setSelectedPlayer = (index) => {
  selectedPlayerIndex.value = index
  newScore.value = null
  scoreInput.value.focus()
}

const recordScore = () => {
  if (!isScore(newScore.value)) return
  players.value[selectedPlayerIndex.value].scores.push(Number(newScore.value))
  newScore.value = null
  selectedPlayerIndex.value = (selectedPlayerIndex.value + 1) % players.value.length
  saveLocal()
  scoreInput.value.focus()
  nextTick(() => {
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight
    scrollArea.value
      .querySelector('.tally__name--selected')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  })
}

const editScore = (player, index) => {
  const editedScore = prompt('Edit score (leave blank to delete)', player.scores[index])
  if (editedScore === null) return
  if (editedScore.trim() === '') {
    player.scores.splice(index, 1)
  } else if (isScore(editedScore)) {
    player.scores[index] = Number(editedScore)
  }
  saveLocal()
}

const saveLocal = () => {
  localStorage.setItem(DATA_KEY, JSON.stringify(players.value))
  localStorage.removeItem(LEGACY_DATA_KEY)
}

const resetScores = () => {
  if (!confirm('Clear all scores and start again with the same players?')) return
  players.value.forEach((player) => (player.scores = []))
  selectedPlayerIndex.value = 0
  newScore.value = null
  saveLocal()
}

const startNewGame = () => {
  localStorage.removeItem(LEGACY_DATA_KEY)
  players.value = []
  selectedPlayerIndex.value = 0
  openPlayersDialog()
}

onMounted(() => {
  try {
    const saved = JSON.parse(
      localStorage.getItem(DATA_KEY) || localStorage.getItem(LEGACY_DATA_KEY)
    )
    if (Array.isArray(saved)) players.value = saved
  } catch {
    localStorage.removeItem(DATA_KEY)
  }
  if (!players.value.length) openPlayersDialog()
})
</script>

<template>
  <main class="page tally">
    <header class="mb-md">
      <div class="flex-between mb-md">
        <GoHomeButton />
        <div class="flex gap-lg">
          <button flat :disabled="!scoresExist" @click="resetScores">
            <i>replay</i>Reset scores
          </button>
          <NewGameButton :dataKey="DATA_KEY" @newGame="startNewGame" />
        </div>
      </div>
      <div class="flex-between align-center">
        <h1 class="ma-0">Score Tally</h1>
        <button small outlined dark :disabled="scoresExist" @click="openPlayersDialog">
          <i>group_add</i>
          <span> {{ players.length ? 'Edit' : 'Add' }} players</span>
        </button>
      </div>
    </header>
    <EditPlayersDialog ref="editPlayersDialog" @updatePlayers="updatePlayers" />

    <template v-if="players.length">
      <div ref="scrollArea" class="tally__scroll">
        <table class="tally__table">
          <thead>
            <tr>
              <th
                v-for="(player, playerIndex) in players"
                :key="player.name"
                class="tally__name"
                :class="{ 'tally__name--selected': playerIndex === selectedPlayerIndex }"
                @click="setSelectedPlayer(playerIndex)"
              >
                {{ player.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="round in roundCount" :key="round">
              <td v-for="player in players" :key="player.name">
                <span
                  v-if="round <= player.scores.length"
                  class="actionable"
                  @click="editScore(player, round - 1)"
                >
                  {{ player.scores[round - 1] }}
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td
                v-for="(player, playerIndex) in players"
                :key="player.name"
                @click="setSelectedPlayer(playerIndex)"
              >
                {{ totalScores[playerIndex] }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="tally__entry">
        <div class="tally__entryName">{{ players[selectedPlayerIndex].name }}</div>
        <input
          ref="scoreInput"
          type="number"
          inputmode="numeric"
          placeholder="Score"
          v-model="newScore"
          @keydown.enter="recordScore"
        />
        <button @click="recordScore" :disabled="!isScore(newScore)">
          <i>add</i>
        </button>
      </div>
    </template>
    <div v-else>Add players to begin.</div>
  </main>
</template>

<style lang="scss">
// The page fills the screen so the names stay pinned above the scores and the
// totals and score entry stay pinned below them, however long the columns get.
.tally {
  height: 100vh;
  height: 100dvh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__scroll {
    // Only as tall as the scores, so the entry sits right under the totals
    // until the columns fill the screen.
    flex: 0 1 auto;
    min-height: 0;
    overflow: auto;
  }

  &__table {
    min-width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    text-align: center;
    font-variant-numeric: tabular-nums;

    & th,
    & td {
      min-width: 64px;
      padding: var(--xs) var(--sm);
    }

    & thead th {
      position: sticky;
      top: 0;
      background-color: var(--bg-color);
      border-bottom: var(--border);
      padding-bottom: var(--sm);
      cursor: pointer;
      white-space: nowrap;
    }

    & tfoot td {
      position: sticky;
      bottom: 0;
      background-color: var(--bg-color);
      border-top: 2px solid var(--accent-dark);
      padding: var(--sm);
      color: var(--accent-dark);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-heading);
      cursor: pointer;
    }
  }

  &__name--selected {
    color: var(--accent-dark);
    box-shadow: inset 0 -3px 0 var(--accent);
  }

  &__entry {
    display: flex;
    justify-content: center;
    gap: var(--md);
    align-items: center;
    padding-top: var(--lg);

    & input {
      width: 72px;
      text-align: center;
    }
  }

  &__entryName {
    font-weight: var(--font-weight-bold);
    color: var(--accent-dark);
  }
}

@media only screen and (max-width: 600px) {
  .tally {
    padding: var(--md);
  }
}
</style>
