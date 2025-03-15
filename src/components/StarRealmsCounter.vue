<script setup>
defineProps({
  value: Number,
  type: String // authority, trade, combat
})
const emit = defineEmits(['increment', 'decrement'])
</script>

<template>
  <div
    class="starRealmsCounter"
    :class="type"
    :style="{ backgroundImage: `url(./images/${type}-icon.png)` }"
  >
    <button @click="emit('decrement')" class="left"><i>arrow_left</i></button>
    <div>{{ value }}</div>
    <button @click="emit('increment')" class="right"><i>arrow_right</i></button>
  </div>
</template>

<style lang="scss">
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

  &.authority {
    background-size: cover;
    background-repeat: no-repeat;
    // max-width: 539px;
    background-image: url(./images/authority-icon.png);
  }

  &.combat {
    // width: 70%;
    // max-width: 475px;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(./images/combat-icon.png);
  }

  &.trade {
    // width: 70%;
    // max-width: 475px;
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
