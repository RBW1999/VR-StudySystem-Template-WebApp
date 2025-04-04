<script setup>
import ImageButton from "../components/ImageButton.vue";
import { Scenario, useStudyStore } from "../stores/study";

const store = useStudyStore();
</script>
<template>
  <div>
    <h1 class="headline">Szenario Auswahl</h1>
    <div class="flex flex-col justify-center items-center h-full">
      <div class="flex flex-wrap justify-center items-center p-8">
        <ImageButton
          @click="
            store.changeScenario({
              newScenario: Scenario.Tutorial,
              increment: false,
            })
          "
          class="scenario-btn"
          titel="Tutorial"
          img-src="\ImageButtonSrc\empty-VE.png"
          :selected="store.currentLevel == Scenario.Tutorial"
        />
        <ImageButton
          @click="
            store.changeScenario({
              newScenario: Scenario.ScenarioA,
              increment: false,
            })
          "
          class="scenario-btn"
          titel="Scenario A"
          img-src="\ImageButtonSrc\empty-VE.png"
          :selected="store.currentLevel == Scenario.ScenarioA"
        />
        <ImageButton
          @click="
            store.changeScenario({
              newScenario: Scenario.ScenarioB,
              increment: false,
            })
          "
          class="scenario-btn"
          titel="Scenario B"
          img-src="\ImageButtonSrc\empty-VE.png"
          :selected="store.currentLevel == Scenario.ScenarioB"
        />
        <ImageButton
          @click="
            store.changeScenario({
              newScenario: Scenario.TestEnviroment,
              increment: false,
            })
          "
          class="scenario-btn"
          titel="Test Enviroment"
          img-src="\ImageButtonSrc\empty-VE.png"
          :selected="store.currentLevel == Scenario.TestEnviroment"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.scenario-btn {
  @apply m-5 w-64;
}
</style>
