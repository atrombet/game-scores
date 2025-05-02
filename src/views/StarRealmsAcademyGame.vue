<script setup>
import { ref } from 'vue'
import { GoHomeButton, StarRealmsCounter } from '@/components'

const trade = ref(0)
const authority = ref(15)

const resetGame = () => {
  trade.value = 0
  authority.value = 15
}
</script>

<template>
  <main class="page dark-mode starRealms">
    <header class="mb-md">
      <div class="flex-between mb-md">
        <GoHomeButton />
        <div class="flex-column align-end">
          <button flat @click="resetGame"><i>restart_alt</i>Reset Game</button>
        </div>
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
    </div>
  </main>
</template>

<style lang="scss">
.starRealms {
  height: calc(90vh - 3 * var(--xl));
  max-width: 400px;
  margin: 0 auto;
  background-color: var(--gray-darkest);
  color: var(--white);
  overflow: hidden;

  &__grid {
    display: grid;
    grid-template-rows: auto;
    gap: var(--xl);
    height: calc(100% - 2 * var(--xl));
    max-height: 95vh;
  }
}
</style>
