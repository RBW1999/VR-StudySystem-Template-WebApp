<script setup>
import { AD, Scenario, useStudyStore } from "../stores/study";
import ADConfigSelect from "../components/ADConfigSelect.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";

const startDegree = 16;

const store = useStudyStore();
const router = useRouter();
let configStep = ref(0);

store.setInitialADDegrees();

const [AD1, AD2] = store.getCurrentADPair(); // To be tested

console.log("AD1: " + AD1);
console.log("AD2: " + AD2);

const ADDegreeSteps_1 = store.getADDegreeSteps(AD1);
const ADDegreeSteps_2 = store.getADDegreeSteps(AD2);

store.setADDegree({ AD: AD1, Degree: startDegree });

async function nextAD() {
  if (configStep.value < 4) {
    configStep.value = configStep.value + 1;
    if (configStep.value == 1) {
      store.setADDegree({ AD: AD2, Degree: startDegree });
    }
  }
}

function getBtnText() {
  if (store.getBTaskIsEnabled()) {
    return "End config and continue to VR Task";
  }

  console.log(store.getNextScenario());

  if (store.getNextScenario() == Scenario.Init) {
    return "End confing and continue to notes";
  } else {
    return "End condfing and continue to next scenario";
  }
}

async function nextView() {
  
  if (store.getBTaskIsEnabled()) {
    router.push("task");
    return;
  }

  // no Task, proceed to next config

  // increment counter to switch ADs for next
  store.incConfigCounter();

  let nextScenario = store.getNextScenario();

  if (nextScenario == Scenario.Init) {
    // load init and change to notes views
    await store.changeScenario({ newScenario: nextScenario, increment: false });
    router.push("notes");
  } else {
    // continue to next scenario
    await store.changeScenario({ newScenario: nextScenario, increment: true });

    // reset(reload) current page
    router.go();
  }
}
</script>
<template>
  <div class="flex flex-col">
    <h1 class="headline">AD Config</h1>
    <div class="flex flex-col justify-between items-center h-full">
      <ADConfigSelect
        :AD="AD1"
        :active="configStep === 0"
        :step="1"
        :ADDegreeSteps="ADDegreeSteps_1"
        @degree-commit="nextAD()"
        :DegreeStepSize="2"
        :allowDecrement="true"
      />
      <ADConfigSelect
        :AD="AD2"
        :active="configStep === 1"
        :step="2"
        :ADDegreeSteps="ADDegreeSteps_2"
        @degree-commit="nextAD()"
        :DegreeStepSize="2"
        :allowDecrement="true"
      />
      <ADConfigSelect
        :AD="AD2"
        :active="configStep === 2"
        :step="3"
        :ADDegreeSteps="ADDegreeSteps_2"
        @degree-commit="nextAD()"
        :DegreeStepSize="1"
        :allowDecrement="true"
      />
      <ADConfigSelect
        :AD="AD1"
        :active="configStep === 3"
        :step="4"
        :ADDegreeSteps="ADDegreeSteps_1"
        @degree-commit="nextAD()"
        :DegreeStepSize="1"
        :allowDecrement="true"
      />
      <button
        class="button"
        :class="{ 'button--disabled': configStep != 4 }"
        @click="nextView()"
        :disabled="configStep != 4"
      >
        {{ getBtnText() }}
      </button>
    </div>
  </div>
</template>

<style></style>
