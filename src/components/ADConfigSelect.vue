<script setup>
import { isGloballyWhitelisted } from "@vue/shared";
import { StudyMode, useStudyStore } from "../stores/study";
import { ref, watch } from "vue";
import { current } from "daisyui/src/colors";

const props = defineProps({
  AD: { type: String },
  active: { type: Boolean },
  ADDegreeSteps: { type: Array },
  DegreeStepSize: { type: Number },
  allowDecrement: { type: Boolean },
  step: { type: Number },
});
const emit = defineEmits(["degreeCommit"]);

const store = useStudyStore();

const isIncDisabled = ref(true);
const isDecDisabled = ref(true);

//setup Buttons
disableButtonsIfNeeded();

// excute disableButtonsIfNeeded when props.active changes
watch(
  () => props.active,
  () => {
    disableButtonsIfNeeded();
  }
);

function incAD() {
  let maxDegree = store.getADDegreeSteps(props.AD).length - 1;
  let currentDegree = store.getADDegreeValueFromStore(props.AD);

  if (currentDegree + props.DegreeStepSize <= maxDegree) {
    let newDegree = currentDegree + props.DegreeStepSize;
    store.setADDegree({ AD: props.AD, Degree: newDegree });
    console.log(props.AD + " | Degree: " + newDegree + ", max: " + maxDegree);
  } else {
    // not needed anymore bcs the button shoudl be disabled
    console.log(props.AD + " | Current Degree: " + currentDegree);
    alert(
      "Cant increase over the max Degree Level. Check the consol for more information"
    );
  }

  disableButtonsIfNeeded();
}

function disableButtonsIfNeeded() {
  // get current Degree from store
  let maxDegree = store.getADDegreeSteps(props.AD).length - 1;
  let currentDegree = store.getADDegreeValueFromStore(props.AD);

  // reset values
  isIncDisabled.value = false;
  isDecDisabled.value = false;

  let step = props.step;
  console.log({ step, currentDegree, maxDegree });

  if (currentDegree == maxDegree) {
    // degree is max
    isIncDisabled.value = true;
  } else if (currentDegree == 0) {
    // degree is min
    isDecDisabled.value = true;
  }
}

function decAD() {
  let currentDegree = store.getADDegreeValueFromStore(props.AD);

  if (currentDegree - props.DegreeStepSize >= 0) {
    let newDegree = currentDegree - props.DegreeStepSize;
    store.setADDegree({ AD: props.AD, Degree: newDegree });
    console.log(props.AD + " | Degree: " + newDegree);
  } else {
    // not needed anymore bcs the button shoudl be disabled
    console.log(props.AD + " | Current Degree: " + currentDegree);
    alert(
      "Cant decrease under the min Degree Level. Check the consol for more information"
    );
  }

  disableButtonsIfNeeded();
}

async function nextAD() {
  const res = await store.commitADDegree(props.AD);
  console.log(res);
  emit("degreeCommit");
}
</script>
<template>
  <div v-if="active" class="base">
    <div
      v-if="store.studyMode === StudyMode.Debug"
      class="flex justify-between"
    >
      <p class="text--main">Step {{ props.step }}</p>

      <p class="font-bold text-2xl text-secondary">
        {{ AD }} | Degree Step Size: {{ props.DegreeStepSize }}
      </p>
    </div>
    <div v-else class="flex justify-between">
      <p class="text--main">Step {{ props.step }}</p>
    </div>
    <div class="flex flex-col justify-around w-full">
      <div class="flex flex-row my-7 justify-end items-center">
        <progress
          class="progress progress-primary w-full"
          :value="store.getADDegreeValueFromStore(props.AD)"
          :max="props.ADDegreeSteps.length - 1"
        ></progress>
      </div>
      <div class="flex justify-around w-full">
        <button
          v-if="props.allowDecrement"
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
        <button class="button--secondary" @click="nextAD()">next</button>
      </div>
    </div>
  </div>
  <div v-else class="base flex justify-between">
    <p class="font-bold text-2xl text-gray-400">Step {{ props.step }}</p>
    <p v-if="store.studyMode === StudyMode.Debug" class="text--debug">
      {{ AD }}
    </p>
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
