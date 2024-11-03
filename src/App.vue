<script setup lang="ts">
import PrimeConfirmDialog from 'primevue/confirmdialog'
import PrimeConfirmPopup from 'primevue/confirmpopup'
import PrimeDynamicDialog from 'primevue/dynamicdialog'
import Toast from 'primevue/toast'
</script>

<template>
  <div>
    <prime-confirm-popup />
    <prime-confirm-dialog />
    <prime-dynamic-dialog />
    <toast position="bottom-right" :baseZIndex="1500" />
    <router-view />
  </div>
</template>

<style scoped></style>
