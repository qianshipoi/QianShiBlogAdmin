<script setup lang="ts">
import { ref } from 'vue';
import { lightTheme } from 'naive-ui'
import { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface';
import UseMessageComponent from './components/UseMessageComponents.vue'

const theme = ref<BuiltInGlobalTheme>(lightTheme)

</script>

<template>
  <n-config-provider style="min-height: 100vh;" :theme="theme">
    <n-message-provider>
      <UseMessageComponent />
      <n-dialog-provider>
        <n-layout>
          <n-layout-header>
            <NavBar />
          </n-layout-header>
          <n-layout-content content-style="padding: 24px;">
            <router-view></router-view>
          </n-layout-content>
        </n-layout>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
