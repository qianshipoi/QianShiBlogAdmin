<script setup lang="ts">
import { ref } from 'vue';
import { lightTheme } from 'naive-ui'
import { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface';

const theme = ref<BuiltInGlobalTheme>(lightTheme)

</script>

<template>
  <n-config-provider style="min-height: 100vh;" :theme="theme">
    <n-layout>
      <n-layout-header>
        <NavBar></NavBar>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>
