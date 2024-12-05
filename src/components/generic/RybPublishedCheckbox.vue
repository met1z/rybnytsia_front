<script lang="ts" setup>
import { Checkbox } from 'primevue'
import RybStatusChip from './RybStatusChip.vue'

withDefaults(
  defineProps<{
    modelValue: boolean
    label: string
    disabled?: boolean
    convertLabel?: (v: { data: boolean }) => string
    id?: string | number
  }>(),
  {
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const updateModel = (e: string) => {
  emit('update:modelValue', e)
}
</script>

<template>
  <div class="field">
    <h5 class="field-title">{{ label }}</h5>
    <div class="field-checkbox">
      <Checkbox
        :disabled="disabled"
        :model-value="modelValue"
        @update:model-value="updateModel"
        :inputId="'published' + id"
        :binary="true"
      />
      <label :for="'published' + id">
        <slot name="label">
          <ryb-status-chip :data="modelValue" :convert-label="convertLabel" />
        </slot>
      </label>
    </div>
  </div>
</template>
