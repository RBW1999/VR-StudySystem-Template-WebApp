<script setup>
const props = defineProps({ scale: { type: Array }, activeDegree: { type: Number } })
const emit = defineEmits(['degreeSelect'])

</script>
<template>
    <div class="flex justify-between">
        <button @click="emit('degreeSelect', index)" class="button--secondary border-slate-200 px-2 py-1 mx-1 flex-auto"
            :class="{'button--active-degree' : activeDegree == index}" v-for="( outputDegree, index) in scale">
            {{ Math.floor(100 * outputDegree) / 100 }}
        </button>
    </div>
</template>

<style scoped>
.button--active-degree {
    @apply bg-primary text-white border-none
}
</style>