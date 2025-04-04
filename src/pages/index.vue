<script setup>
import { ref } from "vue";
import { AD, Scenario, StudyMode, useStudyStore } from "../stores/study";
import router from "../router";
import ImageButton from "../components/ImageButton.vue";

const store = useStudyStore();

store.setStudyMode(StudyMode.None);
let selectedStudyMode = ref(StudyMode.None);
const subjectID = ref(0);
const bIDIsAlreadyInUse = ref(false);

async function startStudy() {
  await store.getADDegreeStepsFromEngine();
  store.setStudyMode(selectedStudyMode.value);

  let ADPreset;
  let nextScenario;
  let nextView = "/";

  switch (selectedStudyMode.value) {
    case StudyMode.Explorative:
      console.log("explo selected");

      // setup experiment scenario and AD order
      await store.generateExplorativeADandScenarioOrder(
        parseInt(subjectID.value)
      );
      nextScenario = store.getNextScenario();

      // enable or disable Tasks
      store.setBTaskIsEnabled(true);

      //next view
      if (store.getBTutorialIsEnabled) {
        nextView = "tutorial";
      } else {
        nextView = "config";
      }

      break;
    case StudyMode.Empirical:
      console.log("Empi selected");
      ADPreset = 1; //Placeholder Value

      // setup Scenario
      await store.generateExplorativeADandScenarioOrder(
        parseInt(subjectID.value)
      ); // todo create new method for empirical study mode
      nextScenario = store.getNextScenario();
      await store.setBTaskIsEnabled(true);

      //next view
      if (store.getBTutorialIsEnabled) {
        nextView = "tutorial";
      } else {
        nextView = "task"; // ToDo Comparative View
      }
      break;
    case StudyMode.Debug:
      console.log("Debug selected");
      ADPreset = 0;
      await store.generateExplorativeADandScenarioOrder(
        parseInt(subjectID.value)
      );
      await store.setCanTeleport(true);
      nextScenario = Scenario.TestEnviroment;
      nextView = "test";
      break;
    default:
      console.log("No Studymode selected. Staying in the initiaten state.");
  }

  if (selectedStudyMode.value != StudyMode.None) {
    // initiate study and check for existing results
    bIDIsAlreadyInUse.value = await store.initiateStudy({
      SubjectID: parseInt(subjectID.value),
      StudyMode: store.studyMode,
      ADPreset: ADPreset,
    });
    console.log(bIDIsAlreadyInUse.value);

    // check if Results already exists for ID or StudyMode is set to debug
    if (bIDIsAlreadyInUse.value && selectedStudyMode.value != StudyMode.Debug) {
      //results for the ID already exist
      store.setStudyMode(StudyMode.None);
      console.log("Reset");
      return;
    }

    //start study
    console.log("start");
    await store.changeScenario({
      newScenario: nextScenario,
      increment: true,
    });
    router.push(nextView);
  }
}

function checkInput(/** @type {Event} */ e) {
  if (
    Number.isNaN(Number(e.key)) &&
    e.key != "Backspace" &&
    e.key != "Delete" &&
    e.key != "Enter"
  ) {
    e.stopPropagation();
    e.preventDefault();
    alert("Bitte nur Zahlen eingeben");
  }
}
</script>

<template>
  <div class="flex flex-col justify-evenly h-full">
    <div class="section flex-col items-center">
      <h1 class="font-bold text-4xl text-slate-700 mb-4">
        Create Study - Template
      </h1>
      <div class="section w-full">
        <p class="p-5">Subject ID</p>
        <input
          v-model="subjectID"
          class="input input-bordered w-full max-w-xs"
          :class="{ 'false-input': bIDIsAlreadyInUse }"
          @keydown="checkInput"
        />
      </div>
      <p v-if="bIDIsAlreadyInUse" class="text-warning">
        Results for this ID were found in the export Folder.
      </p>
    </div>
    <div class="section flex-col">
      <h1 class="font-bold text-2xl text-slate-700">Select Study Mode</h1>
      <div class="flex p-5 w-full justify-evenly">
        <ImageButton
          class="w-64"
          titel="Exploratory"
          :selected="selectedStudyMode == StudyMode.Explorative"
          @click="() => (selectedStudyMode = StudyMode.Explorative)"
          img-src="\ImageButtonSrc\explorativ.svg"
        />
        <ImageButton
          class="w-64"
          titel="Comparative"
          :selected="selectedStudyMode == StudyMode.Empirical"
          @click="() => (selectedStudyMode = StudyMode.Empirical)"
          img-src="\ImageButtonSrc\empircal.svg"
        />
        <ImageButton
          class="w-64"
          titel="Debug"
          :selected="selectedStudyMode == StudyMode.Debug"
          @click="() => (selectedStudyMode = StudyMode.Debug)"
          img-src="\ImageButtonSrc\debug.svg"
        />
      </div>
    </div>
    <div class="section">
      <button @click="startStudy" class="button">start study</button>
    </div>
  </div>
</template>

<style>
.section {
  @apply flex justify-center items-center;
}

.active {
  @apply border-8 border-primary;
}

.false-input {
  @apply border-2 border-warning text-warning;
}
</style>
