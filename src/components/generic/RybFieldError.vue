<script lang="ts" setup>
import type { ErrorObject } from '@vuelidate/core'
import { computed } from 'vue'

const props = defineProps<{ errors: ErrorObject[] }>()

const beautifyErrors = computed(() => props.errors.map((v) => v.$message.toString()).join('. '))
</script>
<template>
  <span>
    <small id="input-error" class="p-error">{{ beautifyErrors }}</small>
  </span>
</template>
