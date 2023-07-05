<template>
  <n-grid :cols="4">
    <n-grid-item>
      <CategoryTree />
    </n-grid-item>
    <n-grid-item>
      ss
    </n-grid-item>
  </n-grid>
</template>

<script setup lang='ts'>
import { onMounted } from 'vue';
import { BlogMetaType } from '../../types/appTypes';
import { useMetasStore } from '../../store/useMetaStore';
import CategoryTree from '../../components/CategoryTree.vue';


const metasStore = useMetasStore()

onMounted(() => {
  metasStore.getMetas(BlogMetaType.Tag);
})

</script>

