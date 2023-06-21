<template>
  index
</template>

<script setup lang='ts'>
import { onMounted } from 'vue';
import { BlogMetaType } from '../../types/appTypes';
import { useMetasStore } from '../../store/useMetaStore';

const metasStore = useMetasStore()

onMounted(() => {
  metasStore.getMetas(BlogMetaType.Category);
  metasStore.getMetas(BlogMetaType.Tag);
})

</script>

