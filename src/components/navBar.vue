<script setup lang='ts'>
import { h, ref, Component } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { BookOutline as BookIcon } from '@vicons/ionicons5'
import { RouterLink, useRoute } from 'vue-router';
import { watch } from 'vue';

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
        { default: () => '文章' }
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
        { default: () => '标签' }
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
        { default: () => '设置' }
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

</script>

<template>
  <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
</template>
