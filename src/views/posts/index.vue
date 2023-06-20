<template>
  index
</template>

<script setup lang='ts'>


import { onMounted } from 'vue';
import { getMetas } from '../../api/api'
import { BlogMetaType } from '../../types/appTypes';

onMounted(() => {
  getMetas(BlogMetaType.Category).then(res => {
    console.log(res);
  })
})


</script>

<style>
</style>
