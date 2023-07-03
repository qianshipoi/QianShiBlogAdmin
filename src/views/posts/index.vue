<template>
  <n-tree block-line expand-on-click :data="data" :node-props="nodeProps"
    :on-update:expanded-keys="updatePrefixWithExpaned" />
  <n-dropdown placement="bottom-start" trigger="manual" :x="x" :y="y" :options="options" :show="showDropdown"
    :on-clickoutside="onClickoutside" @select="handleSelect" />
</template>

<script setup lang='ts'>
import { onMounted, h, ref, nextTick } from 'vue';
import { BlogMeta, BlogMetaType } from '../../types/appTypes';
import { useMetasStore } from '../../store/useMetaStore';
import { useMessage, NIcon, TreeOption } from 'naive-ui'
import {
  Folder,
  FolderOpenOutline,
  FileTrayFullOutline
} from '@vicons/ionicons5'
import { watchEffect } from 'vue';
import { toRaw } from 'vue';

const metasStore = useMetasStore()
const message = useMessage()

onMounted(() => {
  metasStore.getMetas(BlogMetaType.Category);
  metasStore.getMetas(BlogMetaType.Tag);
})

const updatePrefixWithExpaned = (
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null
    action: 'expand' | 'collapse' | 'filter'
  }
) => {
  if (!meta.node) return
  switch (meta.action) {
    case 'expand':
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(FolderOpenOutline)
        })
      break
    case 'collapse':
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(Folder)
        })
      break
  }
}

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      if (!option.children && !option.disabled) {
        message.info('[Click] ' + option.label)
      }
    },
    onContextmenu(e: MouseEvent) {
      handleContextMenu(e, option)
    }
  }
}

const data = ref<TreeOption[]>([])

const unwarp = (metas: BlogMeta[], parent: number = 0): TreeOption[] => {
  const data = metas.filter(x => x.parent === parent)

  const options: TreeOption[] = []

  data.map(item => {
    const children = unwarp(metas, item.id)
    options.push({
      raw: item,
      key: item.id,
      label: item.name,
      prefix: () => h(NIcon, null, { default: () => h(children.length > 0 ? Folder : FileTrayFullOutline) }),
      children: children.length > 0 ? children : undefined
    })
  })

  return options
}

watchEffect(() => {
  data.value = unwarp(metasStore.state.categorys, 0)
})

const options = [
  {
    label: '新增',
    key: 'add'
  },
  {
    label: '编辑',
    key: 'edit'
  },
  {
    label: '删除',
    key: 'del'
  }
]

const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)
const selectedMeta = ref<BlogMeta>()


const handleSelect = (key: string | number) => {
  showDropdown.value = false
  message.info(String(key))

  console.log(selectedMeta.value);
}

const handleContextMenu = (e: MouseEvent, option: TreeOption) => {
  e.preventDefault()
  showDropdown.value = false
  nextTick().then(() => {
    showDropdown.value = true
    x.value = e.clientX
    y.value = e.clientY
  })
  selectedMeta.value = toRaw(option.raw) as BlogMeta
}

const onClickoutside = () => {
  showDropdown.value = false
}

</script>

