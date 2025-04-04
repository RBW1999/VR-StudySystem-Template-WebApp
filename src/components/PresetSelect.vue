<script setup>
const emit = defineEmits(['presetSelect'])
function sendEmit(/** @type {Event} */ e) {
  emit(e.target.value);
}

// emit('presetSelect', $event)
</script>

<template>
  <div class="flex">
    <h1>Preset wählen:</h1>
    <select @change="sendEmit" class="select w-full max-w-xs">
      <option value="0" selected>Default</option>
      <option value="1">Preset 1</option>
      <option value="2">Preset 2</option>
    </select>
  </div>
</template>
