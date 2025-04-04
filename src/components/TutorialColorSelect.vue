<script setup>
import { StudyMode, useStudyStore } from "../stores/study";
import { ref } from "vue";

const props = defineProps({
  degreeSteps: { type: Array },
  startDegree: { type: Number },
});
const emit = defineEmits(["colorCommit"]);

const store = useStudyStore();

const currentDegree = ref(props.startDegree);
const maxDegree = ref(props.degreeSteps.length - 1);

const isIncDisabled = ref(true);
const isDecDisabled = ref(true);

const colorCommited = ref(false);

disableButtonsIfNeeded();

function incAD() {
  if (currentDegree.value + 1 <= maxDegree.value) {
    currentDegree.value += 1;
    store.setTutorialColor(currentDegree.value);
    console.log(
      "New Color Degree: " + currentDegree.value + ", max: " + maxDegree.value
    );
  }

  disableButtonsIfNeeded();
}

function disableButtonsIfNeeded() {
  // reset values
  isIncDisabled.value = false;
  isDecDisabled.value = false;

  if (currentDegree.value == maxDegree.value) {
    // degree is max
    isIncDisabled.value = true;
  } else if (currentDegree.value == 0) {
    // degree is min
    isDecDisabled.value = true;
  }
}

function decAD() {
  if (currentDegree.value - 1 >= 0) {
    currentDegree.value -= 1;
    store.setTutorialColor(currentDegree.value);
    console.log(
      "New Color Degree: " + currentDegree.value + ", max: " + maxDegree.value
    );
  }

  disableButtonsIfNeeded();
}

async function commitColor() {
  colorCommited.value = true;
  emit("colorCommit");
}
</script>
<template>
  <div class="base">
    <div class="flex justify-between">
      <p class="text--main">Farbeinstellung</p>
    </div>
    <div v-if="!colorCommited" class="flex flex-col justify-around w-full">
      <div class="flex flex-row my-7 justify-end items-center">
        <progress
          class="progress progress-primary w-full"
          :value="currentDegree"
          :max="props.degreeSteps.length - 1"
        ></progress>
      </div>
      <div class="flex justify-around w-full">
        <button
          :disabled="isDecDisabled"
          class="button"
          @click="decAD()"
          :class="{ 'button--disabled': isDecDisabled }"
        >
          decrement
        </button>
        <button
          :disabled="isIncDisabled"
          class="button"
          @click="incAD()"
          :class="{ 'button--disabled': isIncDisabled }"
        >
          increment
        </button>
        <button class="button--secondary" @click="commitColor()">Commit</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.base {
  @apply rounded-md p-5 bg-white w-full shadow-sm;
}

.text--main {
  @apply font-bold text-2xl text-slate-700;
}

.text--debug {
  @apply font-bold text-2xl text-secondary;
}
</style>
