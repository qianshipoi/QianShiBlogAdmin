<template>
  <n-tree block-line expand-on-click :data="data" :node-props="nodeProps"
    :on-update:expanded-keys="updatePrefixWithExpaned" />
  <n-dropdown placement="bottom-start" trigger="manual" :x="x" :y="y" :options="actions" :show="showDropdown"
    :on-clickoutside="onClickoutside" @select="handleSelect" />
  <n-modal v-model:show="showModal">
    <n-card style="width: 600px" title="编辑" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
        <n-form-item label="姓名" path="name">
          <n-input v-model:value="formValue.name" placeholder="输入名称" />
        </n-form-item>
        <n-form-item label="描述">
          <n-input v-model:value="formValue.description" placeholder="输入描述" />
        </n-form-item>
        <n-form-item label="父级" path="parent">
          <n-tree-select v-model:value="formValue.parent" :options="options" @update:value="handleUpdateValue" />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="handleValidateClick">
            提交
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </n-modal>
</template>


<script setup lang='ts'>
import { onMounted, h, ref, nextTick } from 'vue';
import { BlogMeta, BlogMetaType } from '../types/appTypes';
import { useMetasStore } from '../store/useMetaStore';
import { useMessage, NIcon, TreeOption, FormInst, TreeSelectOption, useDialog } from 'naive-ui'
import {
  Folder,
  FolderOpenOutline,
  FileTrayFullOutline
} from '@vicons/ionicons5'
import { watchEffect } from 'vue';
import { toRaw } from 'vue';
import { DropdownMixedOption } from 'naive-ui/lib/dropdown/src/interface';

const metasStore = useMetasStore()
const message = useMessage()

onMounted(() => {
  metasStore.getMetas(BlogMetaType.Category);
})

const showModal = ref(false)
const formRef = ref<FormInst | null>(null)

const formValue = ref<BlogMeta>({
  id: 0,
  name: '',
  description: '',
  parent: 0,
  count: 0
})

const rules = {
  name: {
    required: true,
    message: '请输入姓名',
    trigger: ['input', 'blur']
  }
}

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success('Valid')
    } else {
      console.log(errors)
      message.error('Invalid')
    }
  })
}

const add = (meta: BlogMeta) => {
  formValue.value = {
    id: 0,
    name: '',
    description: '',
    parent: meta.id,
    count: 0
  }
  showModal.value = true;
}

const edit = (meta: BlogMeta) => {
  formValue.value = {
    id: meta.id,
    name: meta.name,
    description: meta.description,
    parent: meta.parent,
    count: 0
  }
  showModal.value = true;
}

const dialog = useDialog()

const del = (meta: BlogMeta) => {
  dialog.warning({
    title: '警告',
    content: `你确定删除[${meta.name}]类别？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      message.success('确定')
    },
  })
}

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

const options = ref<TreeSelectOption[]>([])

function unwarp(metas: BlogMeta[], parent: number = 0, level: number = 0): TreeOption[] {
  const data = metas.filter(x => x.parent === parent)

  const options: TreeOption[] = []

  data.map(item => {
    const children = unwarp(metas, item.id, level + 1)
    options.push({
      raw: item,
      key: item.id,
      level: level,
      label: item.name,
      prefix: () => h(NIcon, null, { default: () => h(children.length > 0 ? Folder : FileTrayFullOutline) }),
      children: children.length > 0 ? children : undefined
    })
  })

  return options
}

function unwarp2(metas: BlogMeta[], parent: number = 0, level: number = 0): TreeSelectOption[] {
  const data = metas.filter(x => x.parent === parent)

  const options: TreeSelectOption[] = []

  data.map(item => {
    const children = unwarp2(metas, item.id, level + 1)
    options.push({
      raw: item,
      key: item.id,
      label: item.name,
      disabled: level >= 2,
      children: children.length > 0 ? children : undefined
    })
  })

  return options
}

const handleUpdateValue = (
  value: string | number | Array<string | number> | null,
  option: TreeSelectOption | null | Array<TreeSelectOption | null>
) => {
  console.log(value, option)
}

watchEffect(() => {
  data.value = unwarp(metasStore.state.categorys, 0)
})

watchEffect(() => {
  options.value = unwarp2(metasStore.state.categorys, 0)
})

const actions = ref<DropdownMixedOption[]>([
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
])

const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)
const selectedMeta = ref<BlogMeta>()

const handleSelect = (key: string | number) => {
  showDropdown.value = false

  if (key === "add") {
    add(selectedMeta.value!)
  } else if (key === "edit") {
    edit(selectedMeta.value!)
  } else if (key === "del") {
    del(selectedMeta.value!)
  } else {
    message.info(String(key))
  }
}

const handleContextMenu = (e: MouseEvent, option: TreeOption) => {
  e.preventDefault()
  showDropdown.value = false
  const index = actions.value.findIndex(x => x.key === 'add')

  if (option.level as number >= 2) {
    if (index !== -1) {
      actions.value.splice(index, 1)
    }
  } else {
    if (index === -1) {
      actions.value.unshift({
        label: '新增',
        key: 'add'
      })
    }
  }
  selectedMeta.value = toRaw(option.raw) as BlogMeta
  nextTick().then(() => {
    showDropdown.value = true
    x.value = e.clientX
    y.value = e.clientY
  })
}

const onClickoutside = () => {
  showDropdown.value = false
}

</script>
