<script lang="ts" setup>
import RybPhoto from './RybPhoto.vue'

defineProps<{
  icon?: string
  imageUrl?: string
  name: string
}>()
</script>

<template>
  <div class="ryb-chip">
    <div v-if="icon" class="ryb-chip-icon">
      <i :class="icon"></i>
    </div>
    <div v-if="imageUrl" class="ryb-chip-photo">
      <ryb-photo :image-url="imageUrl" />
    </div>
    <p>{{ name }}</p>
  </div>
</template>

<style lang="scss">
.ryb-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: #e8eaed;
  padding: 0.125rem 0.375rem;
  margin: 0.125rem;

  .ryb-chip-icon {
    display: flex;
    padding: 0.25rem;
    margin-right: 0.25rem;
  }

  .ryb-chip-photo {
    display: flex;
    width: 30px;
    border-radius: 20px;
    padding: 0.25rem;
    margin-right: 0.5rem;
    overflow: hidden;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
