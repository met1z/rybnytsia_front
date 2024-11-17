<script lang="ts" setup>
import { Button, Dialog, ProgressBar } from 'primevue'

withDefaults(
  defineProps<{
    header: string
    modelValue: boolean
    loading: boolean
    draggable?: boolean
    disabledSave?: boolean
  }>(),
  {
    draggable: true,
    disabledSave: false,
  },
)
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save'): void
  (e: 'afterHide'): void
  (e: 'update:modelValue', show: boolean): void
}>()

const save = () => {
  emit('save')
}
const close = () => {
  emit('close')
}
const updateModel = (e: boolean) => {
  emit('update:modelValue', e)
}
const afterHide = () => {
  emit('afterHide')
}
</script>
<template>
  <Dialog
    :visible="modelValue"
    @update:visible="updateModel"
    :modal="true"
    :draggable="draggable"
    :header="header"
    :style="{ width: '650px', 'max-width': '100%' }"
    @after-hide="afterHide"
  >
    <form @submit.prevent="save">
      <ProgressBar
        v-if="loading"
        class="ryb-progress"
        mode="indeterminate"
        style="height: 3px; width: 100%; position: absolute; top: 0; left: 0"
      />
      <slot></slot>
    </form>
    <template #footer>
      <slot name="footer">
        <Button :disabled="loading" label="Cancel" icon="pi pi-times" class="p-button-text" @click="close" />
        <Button
          :disabled="loading || disabledSave"
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="save"
        />
      </slot>
    </template>
  </Dialog>
</template>
