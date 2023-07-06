<script setup lang='ts'>
import { h, ref, Component } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { BookOutline as BookIcon } from '@vicons/ionicons5'
import { RouterLink, useRoute } from 'vue-router';
import { watch } from 'vue';
import useLocale from '../hook/useLocale'

const { i18n: { t }, currentLocale, changeLocale } = useLocale()
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'PostsIndex'
          }
        },
        { default: () => t('navbar.action.post') }
      ),
    key: 'PostsIndex',
    icon: renderIcon(BookIcon),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Tags'
          }
        },
        { default: () => t('navbar.action.tags') }
      ),
    key: 'Tags',
    icon: renderIcon(BookIcon),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Settings'
          }
        },
        { default: () => t('navbar.action.settings') }
      ),
    key: 'Settings',
    icon: renderIcon(BookIcon),
  },
]

const route = useRoute()

const activeKey = ref<string | null>(route.name as string)

watch(() => route.fullPath, () => {
  activeKey.value = route.name as string
})

const switchLang = () => {
  if (currentLocale.value === 'zh-CN') {
    changeLocale('en-US')
  } else {
    changeLocale('zh-CN')
  }
}

</script>

<template>
  <div style="display: flex; align-items: center; justify-content: space-between;">
    <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
    <n-button size="medium" @click="switchLang">
      {{ currentLocale === 'zh-CN' ? "Englisth" : "中文" }}</n-button>
  </div>
</template>
