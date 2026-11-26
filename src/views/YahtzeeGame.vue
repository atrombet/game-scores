<script setup>
import { onMounted, ref, computed } from 'vue'
import { EditPlayersDialog, GoHomeButton, NewGameButton, YahtzeeScoreDialog } from '@/components'

const DATA_KEY = 'yahtzeeData'
const BLACKOUT_GAMES = 5
const UPPER_BONUS = 35
const UPPER_BONUS_THRESHOLD = 63

const upperCategory = (key, label, face) => ({
  key,
  label,
  hint: `Total of all ${label.toLowerCase()}`,
  options: [0, 1, 2, 3, 4, 5].map((count) => count * face)
})

const UPPER = [
  upperCategory('ones', 'Ones', 1),
  upperCategory('twos', 'Twos', 2),
  upperCategory('threes', 'Threes', 3),
  upperCategory('fours', 'Fours', 4),
  upperCategory('fives', 'Fives', 5),
  upperCategory('sixes', 'Sixes', 6)
]

const diceTotal = { min: 5, max: 30 }

const LOWER = [
  {
    key: 'threeKind',
    label: '3 of a kind',
    hint: 'Total of all dice',
    range: diceTotal,
    options: [0]
  },
  {
    key: 'fourKind',
    label: '4 of a kind',
    hint: 'Total of all dice',
    range: diceTotal,
    options: [0]
  },
  { key: 'fullHouse', label: 'Full house', hint: 'Scores 25', options: [25, 0] },
  { key: 'smStraight', label: 'Sm straight', hint: 'Sequence of 4, scores 30', options: [30, 0] },
  { key: 'lgStraight', label: 'Lg straight', hint: 'Sequence of 5, scores 40', options: [40, 0] },
  { key: 'yahtzee', label: 'Yahtzee', hint: '5 of a kind, scores 50', options: [50, 0] },
  { key: 'chance', label: 'Chance', hint: 'Total of all dice', range: diceTotal, options: [0] }
]

// Not required to finish a game.
const YAHTZEE_BONUS = {
  key: 'yahtzeeBonus',
  label: 'Yahtzee bonus',
  hint: '100 for each extra Yahtzee',
  optional: true,
  options: [0, 100, 200, 300, 400, 500]
}

const REQUIRED = [...UPPER, ...LOWER]

const players = ref([])
const blackout = ref(true)
const selectedPlayerIndex = ref(0)
const editPlayersDialog = ref(null)
const scoreDialog = ref(null)

const gameCount = computed(() => (blackout.value ? BLACKOUT_GAMES : 1))
const selectedPlayer = computed(() => players.value[selectedPlayerIndex.value])

const sum = (game, categories) =>
  categories.reduce((total, category) => total + (game[category.key] ?? 0), 0)

const summarize = (game) => {
  const upper = sum(game, UPPER)
  const bonus = upper >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS : 0
  const lower = sum(game, [...LOWER, YAHTZEE_BONUS])
  const filled = REQUIRED.filter((category) => game[category.key] != null).length
  return {
    upper,
    bonus,
    // Shown once the bonus is earned or can no longer be earned.
    bonusSettled: bonus > 0 || UPPER.every((category) => game[category.key] != null),
    upperTotal: upper + bonus,
    lower,
    total: upper + bonus + lower,
    filled,
    complete: filled === REQUIRED.length
  }
}

const summaries = computed(() =>
  players.value.map((player) => player.games.slice(0, gameCount.value).map(summarize))
)

const grandTotals = computed(() =>
  summaries.value.map((games) => games.reduce((total, game) => total + game.total, 0))
)

const selectedSummaries = computed(() => summaries.value[selectedPlayerIndex.value] || [])

const scoresExist = computed(() =>
  players.value.some((player) => player.games.some((game) => Object.keys(game).length))
)

const gameOver = computed(
  () =>
    players.value.length > 0 &&
    summaries.value.every((games) => games.every((game) => game.complete))
)

const winners = computed(() => {
  if (!gameOver.value) return []
  const best = Math.max(...grandTotals.value)
  return players.value.filter((_, i) => grandTotals.value[i] === best).map((p) => p.name)
})

const emptyGames = () => Array.from({ length: BLACKOUT_GAMES }, () => ({}))

const openPlayersDialog = () => editPlayersDialog.value.open(players.value || undefined)

const updatePlayers = (newPlayers) => {
  players.value = newPlayers.map((p) => ({ name: p.name, games: emptyGames() }))
  selectedPlayerIndex.value = 0
  saveLocal()
}

const setBlackout = (value) => {
  if (scoresExist.value) return
  blackout.value = value
  saveLocal()
}

const openScoreDialog = (category, gameIndex) => {
  scoreDialog.value.open(category, gameIndex, selectedPlayer.value.games[gameIndex][category.key])
}

const setScore = ({ key, gameIndex, score }) => {
  const game = selectedPlayer.value.games[gameIndex]
  if (score === null) {
    delete game[key]
  } else {
    game[key] = score
  }
  saveLocal()
}

const saveLocal = () => {
  localStorage.setItem(
    DATA_KEY,
    JSON.stringify({ blackout: blackout.value, players: players.value })
  )
}

const startNewGame = () => {
  players.value = []
  selectedPlayerIndex.value = 0
  openPlayersDialog()
}

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(DATA_KEY))
    if (saved?.players) {
      players.value = saved.players
      blackout.value = saved.blackout !== false
    }
  } catch {
    localStorage.removeItem(DATA_KEY)
  }
  if (!players.value.length) openPlayersDialog()
})
</script>

<template>
  <main class="page yahtzee">
    <header class="mb-md">
      <div class="flex-between mb-md">
        <GoHomeButton />
        <NewGameButton :dataKey="DATA_KEY" @newGame="startNewGame" />
      </div>
      <div class="flex-between align-center">
        <h1 class="ma-0">Yahtzee</h1>
        <button small outlined dark :disabled="scoresExist" @click="openPlayersDialog">
          <i>group_add</i>
          <span> {{ players.length ? 'Edit' : 'Add' }} players</span>
        </button>
      </div>
    </header>
    <EditPlayersDialog ref="editPlayersDialog" @updatePlayers="updatePlayers" />
    <YahtzeeScoreDialog ref="scoreDialog" @setScore="setScore" />

    <template v-if="players.length">
      <div class="flex gap-sm align-center mb-md">
        <button
          small
          dark
          :outlined="blackout ? null : true"
          :disabled="scoresExist && !blackout"
          @click="setBlackout(true)"
        >
          Blackout (5 games)
        </button>
        <button
          small
          dark
          :outlined="blackout ? true : null"
          :disabled="scoresExist && blackout"
          @click="setBlackout(false)"
        >
          Single game
        </button>
      </div>

      <h3 v-if="winners.length" class="text-center">
        🎉 {{ winners.join(' &amp; ') }} {{ winners.length > 1 ? 'tie' : 'wins' }}! 🎉
      </h3>

      <div class="yahtzee__players mb-md">
        <button
          v-for="(player, playerIndex) in players"
          :key="player.name"
          class="yahtzee__player"
          :class="{ 'yahtzee__player--selected': playerIndex === selectedPlayerIndex }"
          @click="selectedPlayerIndex = playerIndex"
        >
          <span>{{ player.name }}</span>
          <span class="yahtzee__playerTotal">{{ grandTotals[playerIndex] }}</span>
        </button>
      </div>

      <table class="yahtzee__card">
        <thead>
          <tr>
            <th>{{ selectedPlayer.name }}</th>
            <th v-for="(summary, g) in selectedSummaries" :key="g">
              {{ blackout ? `G${g + 1}` : 'Score' }}
              <i v-if="summary.complete" class="yahtzee__done">check</i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in UPPER" :key="category.key">
            <th>{{ category.label }}</th>
            <td
              v-for="(summary, g) in selectedSummaries"
              :key="g"
              class="yahtzee__cell"
              @click="openScoreDialog(category, g)"
            >
              {{ selectedPlayer.games[g][category.key] }}
            </td>
          </tr>
          <tr class="yahtzee__summary">
            <th>Subtotal</th>
            <td v-for="(summary, g) in selectedSummaries" :key="g">{{ summary.upper }}</td>
          </tr>
          <tr class="yahtzee__summary">
            <th>Bonus <small>(63+)</small></th>
            <td v-for="(summary, g) in selectedSummaries" :key="g">
              <template v-if="summary.bonusSettled">{{ summary.bonus }}</template>
              <small v-else>&minus;{{ UPPER_BONUS_THRESHOLD - summary.upper }}</small>
            </td>
          </tr>
          <tr class="yahtzee__summary yahtzee__summary--total">
            <th>Upper total</th>
            <td v-for="(summary, g) in selectedSummaries" :key="g">{{ summary.upperTotal }}</td>
          </tr>

          <tr v-for="category in [...LOWER, YAHTZEE_BONUS]" :key="category.key">
            <th>{{ category.label }}</th>
            <td
              v-for="(summary, g) in selectedSummaries"
              :key="g"
              class="yahtzee__cell"
              @click="openScoreDialog(category, g)"
            >
              {{ selectedPlayer.games[g][category.key] }}
            </td>
          </tr>
          <tr class="yahtzee__summary">
            <th>Lower total</th>
            <td v-for="(summary, g) in selectedSummaries" :key="g">{{ summary.lower }}</td>
          </tr>
          <tr class="yahtzee__summary yahtzee__summary--total">
            <th>Game total</th>
            <td v-for="(summary, g) in selectedSummaries" :key="g">{{ summary.total }}</td>
          </tr>
        </tbody>
        <tfoot v-if="blackout">
          <tr>
            <th>Grand total</th>
            <td :colspan="gameCount">{{ grandTotals[selectedPlayerIndex] }}</td>
          </tr>
        </tfoot>
      </table>
    </template>
    <div v-else>Add players to begin.</div>
  </main>
</template>

<style lang="scss">
.yahtzee {
  &__players {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sm);
  }

  &__player {
    height: auto;
    flex-direction: column;
    gap: 0;
    padding: var(--xs) var(--md);
    background-color: transparent;
    color: var(--accent-dark);
    border: 2px solid var(--accent-dark);

    &--selected {
      background-color: var(--accent-dark);
      color: var(--white);
    }
  }

  &__playerTotal {
    font-size: var(--font-size-large);
  }

  &__card {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    background-color: var(--white);
    font-variant-numeric: tabular-nums;

    & th,
    & td {
      border: var(--border);
      height: 40px;
      padding: 0 var(--xs);
      text-align: center;
    }

    & th:first-child {
      width: 112px;
      text-align: left;
      padding-left: var(--sm);
      font-size: var(--font-size-small);
      line-height: 1.1;
    }

    & thead th {
      background-color: var(--accent-dark);
      color: var(--white);
      border-color: var(--accent-dark);
    }

    & small {
      font-size: 11px;
      font-weight: var(--font-weight-normal);
      color: var(--neutral-text);
    }

    & tfoot th,
    & tfoot td {
      background-color: var(--accent);
      border-color: var(--accent);
      color: var(--white);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-large);
    }

    & tfoot th:first-child {
      font-size: var(--font-size);
    }
  }

  &__done {
    font-size: 14px;
    vertical-align: middle;
  }

  &__cell {
    cursor: pointer;
    font-size: var(--font-size-large);

    &:empty {
      background-color: var(--bg-color);
    }

    &:hover {
      background-color: var(--neutral-bg);
    }
  }

  &__summary {
    & th,
    & td {
      background-color: var(--neutral-bg);
      font-weight: var(--font-weight-medium);
    }

    &--total th,
    &--total td {
      font-weight: var(--font-weight-bold);
      border-bottom: 2px solid var(--accent-dark);
    }
  }
}

@media only screen and (max-width: 600px) {
  .yahtzee {
    padding: var(--md);

    &__card th:first-child {
      width: 96px;
    }
  }
}
</style>
