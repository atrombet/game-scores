<script setup>
const props = defineProps({
  value: Number,
  type: String, // authority, trade, combat
  isEnemy: Boolean,
  min: { type: Number, default: 0 },
  max: Number
})
const emit = defineEmits(['increment', 'decrement'])

const decrement = () => {
  if (props.value <= props.min) return
  emit('decrement')
}

const increment = () => {
  if (props.max && props.value >= props.max) return
  emit('increment')
}
</script>

<template>
  <div
    class="starRealmsCounter"
    :class="{ enemy: isEnemy }"
    :style="{ backgroundImage: `url(./images/${type}-icon.png)` }"
  >
    <button @click="decrement" class="left"><i>arrow_left</i></button>
    <div>{{ value }}</div>
    <button @click="increment" class="right"><i>arrow_right</i></button>
  </div>
</template>

<style lang="scss">
.smaller .starRealmsCounter {
  font-size: 3rem;
}

.starRealmsCounter {
  width: 100%;
  height: 100%;
  font-size: 4rem;
  color: black;
  font-weight: var(--font-weight-bold);
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  position: relative;
  background-size: cover;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  max-height: 19vh;

  &.enemy {
    border: var(--error) 2px solid;
    border-radius: 0.5rem;
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
