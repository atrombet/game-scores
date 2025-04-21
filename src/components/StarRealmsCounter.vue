<script setup>
defineProps({
  value: Number,
  type: String // authority, trade, combat, enemy-authority
})
const emit = defineEmits(['increment', 'decrement'])
</script>

<template>
  <div class="starRealmsCounter" :class="type">
    <button @click="emit('decrement')" class="left"><i>arrow_left</i></button>
    <div>{{ value }}</div>
    <button @click="emit('increment')" class="right"><i>arrow_right</i></button>
  </div>
</template>

<style lang="scss">
.smaller .starRealmsCounter {
  font-size: 4rem;
}

.starRealmsCounter {
  width: 100%;
  height: 100%;
  font-size: 5rem;
  color: black;
  font-weight: var(--font-weight-bold);
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  position: relative;
  background-size: cover;
  background-position: center;

  &.enemy-authority {
    border: var(--error) 2px solid;
    border-radius: 0.5rem;
  }

  &.authority,
  &.enemy-authority {
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(./images/authority-icon.png);
  }

  &.combat {
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(./images/combat-icon.png);
  }

  &.trade {
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(./images/trade-icon.png);
  }

  & button {
    height: 100%;
    width: 50%;
    background-color: transparent;
    color: var(--white);
    border: none;
    position: absolute;
    top: 0;
    bottom: 0;
    font-size: 3rem;
    touch-action: manipulation;
  }

  & div {
    pointer-events: none;
  }

  & .left {
    left: 0;
  }

  & .right {
    right: 0;
    justify-content: flex-end;
  }
}
</style>
