<script setup>
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
} from '@headlessui/vue'
import { ref } from 'vue'

const props = defineProps({ isOpen: { type: Boolean } })
const emit = defineEmits(['closeModal'])

console.log(props.isOpen);
</script>
<template>
    <div class="fixed inset-0 overflow-y-auto">
        <!--
          Pass the `isOpen` ref to the `open` prop, and use the `close` event
          to set the ref back to `false` when the user clicks outside of
          the dialog or presses the escape key.
        -->
        <Dialog :open="true" @close="emit(closeModal)">
            <DialogPanel>
                <DialogTitle>Deactivate account</DialogTitle>
                <DialogDescription>
                    This will permanently deactivate your account
                </DialogDescription>
                <p>
                    Are you sure you want to deactivate your account? All of your data will be
                    permanently removed. This action cannot be undone.
                </p>
                <!--
              You can render additional buttons to dismiss your dialog by setting your
              `isOpen` state to `false`.
            -->
                <button @click="setIsOpen(false)">Cancel</button>
                <button @click="handleDeactivate">Deactivate</button>
            </DialogPanel>
        </Dialog>
    </div>
</template>
