<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import router from "./router";
import { Scenario, StudyMode, useStudyStore } from "./stores/study";
import ScenarioModal from "./components/ScenarioModal.vue";
import { ref } from "vue";

const store = useStudyStore();

function newStudy() {
  store.changeScenario({ newScenario: Scenario.Init, increment: false });
  router.push("/");
}
</script>

<template>
  <div class="w-screen h-screen flex">
    <nav
      v-if="store.studyMode === StudyMode.Debug"
      class="item w-32 h-screen bg-white flex flex-col justify-around p-5"
    >
      <p class="text-secondary text-center font-bold">DEBUG MODE</p>
      <button
        @click="router.push('/scenario')"
        class="nav-item"
        :class="{ 'nav-item--selected': $route.name == 'scenario' }"
      >
        <img
          src="src\assets\Szenario.png"
          class="button-mode w-full"
          title="Change Scenario"
        />
      </button>
      <button
        @click="router.push('/test')"
        class="nav-item"
        :class="{ 'nav-item--selected': $route.name == 'test' }"
      >
        <img
          src="src\assets\debug.svg"
          class="button-mode w-full"
          title="Open Debug View "
        />
      </button>
      <button
        @click="router.push('/config')"
        class="nav-item"
        :class="{ 'nav-item--selected': $route.name == 'config' }"
      >
        <img
          src="src\assets\Config.png"
          class="button-mode w-full"
          title="Open Config View"
        />
      </button>
      <button
        @click="router.push('/task')"
        class="nav-item"
        :class="{ 'nav-item--selected': $route.name == 'task' }"
      >
        <img
          src="src\assets\Task.svg"
          class="button-mode w-full"
          title="Open Task View"
        />
      </button>
      <button
        @click="router.push('/notes')"
        class="nav-item"
        :class="{ 'nav-item--selected': $route.name == 'notes' }"
      >
        <h3 class="headline">Notes</h3>
      </button>
      <button
        class="nav-item h-20 text-gray-600"
        @click="newStudy()"
        :class="{ 'nav-item--selected': $route.name == '/' }"
        title="Create New Study"
      >
        New Study
      </button>
    </nav>
    <div
      v-if="store.studyMode != StudyMode.None"
      class="item p-5 absolute right-0 top-0 text-center font-bold text-primary text-xl"
    >
      <p>P-ID: {{ store.getSubjectID() }}</p>
    </div>
    <Suspense>
      <RouterView
        class="item w-screen h-screen flex-grow lg:p-6 xl:p-16 bg-gray-100"
      />
    </Suspense>
  </div>
</template>

<style>
#app {
  height: max-content;
}

.button {
  @apply py-3 px-6 rounded-lg bg-primary text-white font-bold uppercase shadow-md;
}

.button--secondary {
  @apply py-3 px-6 rounded-lg bg-white text-primary font-bold uppercase border-2 border-primary shadow-md;
}

.button--disabled {
  @apply py-3 px-6 rounded-lg bg-slate-200 text-slate-400 font-bold uppercase shadow-none;
}

.button--failed {
  @apply bg-warning;
}

.headline {
  @apply font-bold text-2xl pb-6 text-slate-700;
}

.h2 {
  @apply text-slate-700 font-bold text-2xl;
}

.h3 {
  @apply text-slate-700 font-bold text-xl;
}

.nav-item {
  @apply rounded-lg bg-white text-primary font-bold uppercase border-2 border-slate-200 shadow-md;
}

.nav-item--selected {
  @apply outline outline-2 outline-primary border-none bg-slate-200;
}
</style>
