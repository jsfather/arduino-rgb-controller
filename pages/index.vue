<script setup lang="ts">
const toastStore = useToastStore()


</script>
<template>
  <div @click="toastStore.addToast({type: 'info' , message: 'hello world'})">index</div>
</template>
