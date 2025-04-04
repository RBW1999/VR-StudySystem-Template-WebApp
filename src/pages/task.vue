<script setup>
import { async } from "postcss-js";
import { ref } from "vue";
import { Scenario, StudyMode, useStudyStore } from "../stores/study";
import { useRouter } from "vue-router";

const store = useStudyStore();
const router = useRouter();
const updateInterval = ref();
const taskObjectInfo = ref();
const TaskCompletionStatus = ref(0);
const active = ref(false);
const finished = ref(false);

console.log(taskObjectInfo.value);

async function startTask() {
  updateInterval.value = setInterval(getTaskCompletionUpdate, 1000);
  active.value = true;

  // start and setup task in the IVE
  await store.startTask();

  // get the task info
  taskObjectInfo.value = await store.getAllTaskObjectInfo();
}

function stopTask() {
  clearInterval(updateInterval.value);
  active.value = false;
  finished.value = true;
}

async function getTaskCompletionUpdate() {
  const TaskObjectCompletion = await store.getAllTaskObjectCompletion();
  TaskCompletionStatus.value = TaskObjectCompletion.CompletedTasks;
  // console.log(TaskObjectCompletion);

  // update manuel tasks completion (hide completed tasks) that autocompleted in the IVE
  taskObjectInfo.value = await store.getAllTaskObjectInfo();

  if (!!TaskObjectCompletion.errorMessage) {
    stopTask();
    alert("Lost connction to the IVE");
    return;
  }


  if (TaskObjectCompletion.AllTaskObjectsCompleted) {
    stopTask();
  }

  if (TaskObjectCompletion.allTaskObjectsCompleted) {
    stopTask();
  }
}

async function completeTaskObject(index) {
  await store.completeTaskObject(index);
  taskObjectInfo.value = await store.getAllTaskObjectInfo();
}

function checkIfManualTaskIsAlreadyCompleted(index) {
  return taskObjectInfo.value[index].isComplete;
}

async function nextView() {
  // prepare for next scenario
  store.incConfigCounter();
  let nextScenario = store.getNextScenario();

  if (nextScenario == Scenario.Init) {
    // load init and change to notes views
    await store.changeScenario({ newScenario: nextScenario, increment: false });
    router.push("notes");
  } else {
    // continue to next scenario
    await store.changeScenario({ newScenario: nextScenario, increment: true });
    router.push("config");
  }
}

function getBtnText() {
  if (store.getNextScenario() == Scenario.Init) {
    return "End Task and continue to notes";
  } else {
    return "End Task and continue to next scenario";
  }
}
</script>

<template>
  <div>
    <h1 class="headline">VR Task</h1>
    <div class="flex flex-col items-center justify-evenly h-full w-full">
      <button v-if="active || finished" class="button--secondary" @click="nextView()">
        {{ getBtnText() }}
      </button>
      <button v-if="!active && !finished" @click="startTask()" class="button">
        Start Task
      </button>
      <button
        v-if="active && store.studyMode === StudyMode.Debug"
        @click="stopTask()"
        class="button"
      >
        Stop Task
      </button>
      <div class="w-full">
        <div v-if="active && taskObjectInfo">
          <h1 class="h2">
            Task Completion: {{ TaskCompletionStatus }}/{{
              taskObjectInfo.length
            }}
          </h1>
          <progress
            class="progress progress-primary w-full"
            :value="TaskCompletionStatus"
            :max="taskObjectInfo.length"
          ></progress>
          <div class="mt-10 mb-10">
            <h2 class="h2">Manual Tasks</h2>
            <div v-for="(task, index) in taskObjectInfo">
              <div
                v-if="
                  task.isManual && !checkIfManualTaskIsAlreadyCompleted(index)
                "
                class="flex flex-row justify-between bg-white rounded p-5 mb-5 mt-5 shadow-md"
              >
                <div class="flex flex-col text-slate-700">
                  <h1 class="text-xl font-bold">{{ task.key }}</h1>
                  <p>{{ task.ManualCompletion }}</p>
                </div>
                <button @click="completeTaskObject(index)" class="button">
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="store.studyMode === StudyMode.Debug"
          class="rounded-md border-4 border-secondary p-4 font-semibold text-gray-700"
        >
          <p class="text-xl">Debug Info:</p>
          <div v-for="task in taskObjectInfo">
            key: {{ task.key }} Manual: {{ task.isManual }} Complete:
            {{ task.isComplete }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
