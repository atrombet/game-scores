<script setup>
import { ref, computed, nextTick } from 'vue'

const dialog = ref(null)
const input = ref(null)
const category = ref(null)
const gameIndex = ref(null)
const currentValue = ref(null)
const customScore = ref(null)

const customScoreValid = computed(() => {
  const range = category.value?.range
  const score = customScore.value
  if (!range || score === null || score === '') return false
  return Number.isInteger(score) && score >= range.min && score <= range.max
})

const open = (initCategory, initGameIndex, value) => {
  category.value = initCategory
  gameIndex.value = initGameIndex
  currentValue.value = value ?? null
  customScore.value = initCategory.range && value ? value : null
  dialog.value.showModal()
  if (initCategory.range) nextTick(() => input.value?.focus())
}

const close = () => {
  dialog.value.close()
}

const submit = (score) => {
  emit('setScore', { key: category.value.key, gameIndex: gameIndex.value, score })
  close()
}

const submitCustom = () => {
  if (customScoreValid.value) submit(customScore.value)
}

const emit = defineEmits(['setScore'])
defineExpose({ open, close })
</script>

<template>
  <dialog ref="dialog" class="yahtzeeScoreDialog">
    <template v-if="category">
      <header class="flex-between gap-lg">
        <div>
          <h2 class="mv-xs">{{ category.label }}</h2>
          <div class="font-size-sm">Game {{ gameIndex + 1 }} &middot; {{ category.hint }}</div>
        </div>
        <button flat @click="close"><i>close</i></button>
      </header>

      <div v-if="category.range" class="flex gap-sm mt-lg">
        <input
          ref="input"
          type="number"
          inputmode="numeric"
          :min="category.range.min"
          :max="category.range.max"
          :placeholder="`${category.range.min}–${category.range.max}`"
          v-model="customScore"
          @keydown.enter="submitCustom"
        />
        <button :disabled="!customScoreValid" @click="submitCustom"><i>check</i></button>
      </div>

      <div class="yahtzeeScoreDialog__options mt-lg">
        <button
          v-for="option in category.options"
          :key="option"
          :outlined="option !== currentValue ? true : null"
          dark
          @click="submit(option)"
        >
          {{ option === 0 && !category.optional ? 'Scratch (0)' : option }}
        </button>
      </div>

      <button v-if="currentValue !== null" class="mt-lg" flat @click="submit(null)">
        <i>backspace</i>Clear score
      </button>
    </template>
  </dialog>
</template>

<style lang="scss">
.yahtzeeScoreDialog {
  min-width: 240px;

  & input {
    width: 96px;
  }

  &__options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sm);

    & button {
      min-width: 56px;
      justify-content: center;
    }
  }
}
</style>
