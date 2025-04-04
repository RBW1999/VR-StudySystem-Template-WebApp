<script setup>
import { ref } from "vue";
import { StudyMode, useStudyStore } from "../stores/study";
import { useRouter } from "vue-router";
import DegreeScale from "../components/DegreeScale.vue";
import ADConfigSelect from "../components/ADConfigSelect.vue";
import TutorialColorSelect from "../components/TutorialColorSelect.vue";

const router = useRouter();
const store = useStudyStore();

const bTutorialDone = ref(false);
await store.setCanTeleport(true);
// start color preview from right of hue beam
await store.setTutorialColor(9)


async function endTutorial() {

  await store.setCanTeleport(false);

  switch (store.studyMode) {
    case StudyMode.Explorative:
      await store.changeScenario({
        newScenario: store.getNextScenario(),
        increment: true,
      });
      router.push("config");
      break;
    case StudyMode.Empirical:
      router.push("task");
      break;
    default:
      console.log("error: no study mode selected");
      console.log("Mode: " + store.studyMode);
      break;
  }
}

function onColorSelected() {
  bTutorialDone.value = true;
}
</script>

<template>
  <div class="flex items-center flex-col justify-evenly">
    <div class="flex flex-col items-center">
      <h1 class="font-bold text-4xl text-slate-700 mb-4">Tutorial</h1>
      <div>
        <p>
          Proband:innen sollen in diesem Tutorial folgende Interaktionen
          erlenen:
        </p>
        <p>- Teleportation</p>
        <p>- Interaktion mit Task Objekten</p>
        <p>
          - Einen ähnlichen Einstellungsprozess wie bei den Adaptionsdimensionen
        </p>
      </div>
    </div>

    <div class="section flex-col w-full">
      <h1 class="font-bold text-2xl text-slate-700 pb-4">
        Lieblingsfarbe einstellen
      </h1>
      <TutorialColorSelect
        :degree-steps="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]"
        :start-degree="9"
        @color-commit="onColorSelected()"
      />
    </div>

    <button
      @click="endTutorial()"
      class="button"
      :class="{ 'button--disabled': !bTutorialDone }"
      :disabled="!bTutorialDone"
    >
      END Tutorial
    </button>
  </div>
</template>

<style>
.section {
  @apply flex justify-center items-center;
}
</style>
