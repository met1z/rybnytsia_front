<script lang="ts" setup>
import { dataPublished } from '../../common/utils/data-published.util'

type ConvertFunction = (v: { data: boolean }) => string

const emit = defineEmits<{
  (e: 'publish-click', v: { convertLabel: ConvertFunction; event: MouseEvent }): void
}>()

const props = withDefaults(defineProps<{ data: boolean; convertLabel?: ConvertFunction }>(), {
  convertLabel: dataPublished,
})

const click = (event: MouseEvent) => {
  emit('publish-click', { convertLabel: props.convertLabel, event })
}
</script>

<template>
  <p id="noRoute" :class="'cursor-pointer published-badge status-' + data" @click="click">
    {{ convertLabel({ data }) }}
  </p>
</template>
