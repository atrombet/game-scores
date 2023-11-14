<script setup>
const props = defineProps({
  dataKey: String
})

const resetGameData = () => {
  const confirmText =
    'Are you sure you want to start a new game? This will erase your current game progress.'
  if (confirm(confirmText)) {
    localStorage.removeItem(props.dataKey)
    emit('newGame')
  }
}

const emit = defineEmits(['newGame'])
</script>

<template>
  <button flat @click="resetGameData"><i>restart_alt</i>New Game</button>
</template>
