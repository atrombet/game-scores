<script setup>
import { ref } from 'vue'
import { GoHomeButton, StarRealmsCounter } from '@/components'

const trade = ref(0)
const combat = ref(0)
const authority = ref(50)
const enemyAuthority = ref(50)
const showEnemy = ref(false)

const nextTurn = () => {
  trade.value = 0
  combat.value = 0
}

const resetGame = () => {
  trade.value = 0
  combat.value = 0
  authority.value = 50
  enemyAuthority.value = 50
}
</script>

<template>
  <main class="page dark-mode starRealms">
    <header class="mb-md">
      <div class="flex-between mb-md">
        <GoHomeButton />
      </div>
      <div class="flex-between align-center gap-xl">
        <button flat @click="nextTurn"><i>forward</i>Next turn</button>
        <button flat @click="showEnemy = !showEnemy">
          <i>sentiment_extremely_dissatisfied</i>Toggle enemy
        </button>
        <button flat @click="resetGame"><i>restart_alt</i>Reset game</button>
      </div>
    </header>
    <div class="starRealms__grid" :class="{ smaller: showEnemy }">
      <StarRealmsCounter
        v-if="showEnemy"
        type="authority"
        :isEnemy="true"
        @decrement="enemyAuthority--"
        :value="enemyAuthority"
        @increment="enemyAuthority++"
      />
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

<style lang="scss" scoped>
.starRealms {
  height: calc(90vh - 2 * var(--xl));
  max-width: 400px;
  margin: 0 auto;
  background-color: var(--gray-darkest);
  color: var(--white);
  overflow-y: hidden;

  &__grid {
    display: grid;
    grid-template-rows: auto;
    height: calc(90% - 2 * var(--xl));
  }
}
</style>
