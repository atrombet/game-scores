<script setup>
import { ref } from 'vue'
import { GoHomeButton, StarRealmsCounter } from '@/components'

const trade = ref(0)
const combat = ref(0)
const authority = ref(50)

const nextTurn = () => {
  trade.value = 0
  combat.value = 0
}
</script>

<template>
  <main class="page dark-mode starRealms">
    <header class="mb-md">
      <div class="flex-between mb-md">
        <GoHomeButton />
        <button flat @click="nextTurn"><i>restart_alt</i>Next turn</button>
      </div>
    </header>
    <div class="starRealms__grid">
      <StarRealmsCounter
        type="authority"
        @decrement="authority--"
        :value="authority"
        @increment="authority++"
      />
      <StarRealmsCounter type="trade" @decrement="trade--" :value="trade" @increment="trade++" />
      <StarRealmsCounter
        type="combat"
        @decrement="combat--"
        :value="combat"
        @increment="combat++"
      />
    </div>
  </main>
</template>

<style lang="scss">
.starRealms {
  height: calc(90vh - 2 * var(--xl));
  max-width: 400px;
  margin: 0 auto;
  background-color: var(--gray-darkest);
  color: var(--white);

  &__grid {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    gap: var(--xl);
    height: calc(100% - 2 * var(--xl));
    // height: 100%;
    max-height: 900px;
  }
}
</style>
