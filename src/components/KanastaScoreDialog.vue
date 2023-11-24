<script setup>
import { ref, unref } from 'vue'

const dialog = ref(null)
const players = ref(null)
const editRoundIndex = ref(null)

const open = (initPlayers, roundIndex) => {
  players.value = initPlayers.map((player) => ({
    ...player,
    kanastaPoints: ref(player.score?.kanastaPoints || null),
    cardPoints: ref(player.score?.cardPoints || null)
  }))
  if (roundIndex >= 0) editRoundIndex.value = roundIndex
  dialog.value.showModal()
}

const close = () => {
  editRoundIndex.value = null
  dialog.value.close()
}

const submit = () => {
  emit('updateScores', {
    scores: players.value.map((player) => ({
      ...player,
      score: {
        kanastaPoints: Number(unref(player.kanastaPoints)),
        cardPoints: Number(unref(player.cardPoints))
      }
    })),
    roundIndex:
      editRoundIndex.value !== null && editRoundIndex.value >= 0 ? editRoundIndex.value : undefined
  })
  close()
}

const emit = defineEmits(['updateScores'])
defineExpose({ open, close })
</script>

<template>
  <dialog ref="dialog">
    <header class="flex-between">
      <h2 class="mt-xs">Score</h2>
      <button flat @click="close"><i>close</i></button>
    </header>
    <div class="flex-around gap-sm">
      <div v-for="player in players" :key="player.name" class="flex-column gap-sm">
        <h3 class="mb-0">{{ player.name }}</h3>
        <input
          class="pointInput"
          type="number"
          inputmode="numeric"
          placeholder="Canasta points"
          v-model="player.kanastaPoints"
        />
        <input
          class="pointInput"
          type="number"
          inputmode="numeric"
          placeholder="Card points"
          v-model="player.cardPoints"
        />
      </div>
    </div>
    <button class="mt-xl" @click="submit">Save</button>
  </dialog>
</template>

<style lang="scss">
.pointInput {
  width: 80%;
  margin: auto;
}
</style>
