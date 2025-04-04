<script setup>
import { ref } from "vue";
import { Scenario, StudyMode, useStudyStore } from "../stores/study";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStudyStore();
const note = ref("");
const btnSendText = ref("SEND NOTE AND EXIT STUDY");
const bResFailed = ref(false);

async function sendNotes() {
  btnSendText.value = "SENDING";
  let response = await store.sendStudyNotes(note.value);
  note.value = "";
  console.log(response.ExportMessage);

  if (response.Success) {
    router.push("/");
  } else {
    btnSendText.value = "FAILED";
    bResFailed.value = true;
  }

  response = await store.exportResults();
  console.log(response.ExportMessage);
}
</script>

<template>
  <div>
    <h1 class="headline">Notes</h1>
    <div class="flex flex-col items-center justify-evenly h-full w-full">
      <div class="h-2/3 w-5/6">
        <p>
          Hier können Notizen zur durchgeführten Studie dokumentiert werden.
          Diese werde mit der Probanden ID im Ordner der Untersuchungsergebnisse
          gespeichert.
        </p>
        <p class="italic">- Die Person musste sich hinsetzten.</p>
        <p class="italic">
          - Die Person hat zwischendurch die Brille abgenommen
        </p>
        <textarea
          v-model="note"
          class="input input-bordered w-full h-5/6 min-w-0 my-3"
        ></textarea>
      </div>
      <button
        @click="sendNotes()"
        class="button"
        :class="{ 'button--failed': bResFailed }"
      >
        {{ btnSendText }}
      </button>
    </div>
  </div>
</template>

<style>
.section {
  @apply flex justify-center items-center;
}
</style>
