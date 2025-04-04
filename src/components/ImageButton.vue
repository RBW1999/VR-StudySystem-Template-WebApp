<script setup>
const props = defineProps({ imgSrc: { type: String }, titel: { type: String }, selected: { type: Boolean } })
console.log(props.selected);
</script>

<template>
    <button class="rounded-2xl bg-white shadow-md font-bold" :class="{ 'selected': selected }">
        <img class="rounded-t-xl fill-primary" :src="imgSrc" />
        <p class="p-1 pb-3 text-2xl text-slate-700" :class="{ 'text-white': selected }">{{ props.titel }}</p>
    </button>
</template>

<style>
.selected {
    @apply outline outline-4 outline-primary
}
</style>



