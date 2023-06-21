<script setup lang='ts'>
import { nextTick, onMounted, ref } from 'vue';
import { useMetasStore } from '../../store/useMetaStore';
import { BlogMeta, BlogMetaType } from '../../types/appTypes';
import { DataTableColumns, NButton, NSpace, DropdownOption, FormInst, useMessage, } from 'naive-ui';
import { h } from 'vue'

const metasStore = useMetasStore();

const options: DropdownOption[] = [
  {
    label: '编辑',
    key: 'edit'
  },
  {
    label: () => h('span', { style: { color: 'red' } }, '删除'),
    key: 'delete'
  }
]

const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)

const createColumns = ({
  edit,
  remove
}: {
  edit: (row: BlogMeta) => void,
  remove: (row: BlogMeta) => void
}): DataTableColumns<BlogMeta> => {
  return [
    {
      title: '名称',
      key: 'name'
    },
    {
      title: '描述',
      key: 'description'
    },
    {
      title: '文章数量',
      key: 'count'
    },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return h(
          NSpace,
          {},
          {
            default: () => [h(
              NButton,
              {
                strong: true,
                tertiary: true,
                type: 'info',
                size: 'small',
                onClick: () => edit(row)
              },
              { default: () => '编辑' }
            ), h(
              NButton,
              {
                strong: true,
                tertiary: true,
                type: 'warning',
                size: 'small',
                onClick: () => remove(row)
              },
              { default: () => '删除' }
            )]
          }
        )
      }
    }
  ]
}

const columns = createColumns({
  edit(row: BlogMeta) {
    window.$message.info(row.name)
    formValue.value = row;
    showModal.value = true
  },
  remove(row: BlogMeta) {
    window.$message.info(row.name)
  }
})

let selectedValue: BlogMeta | null = null;

const handleSelect = (key: string) => {
  if (selectedValue === null) {
    return;
  }

  if (key === 'edit') {
    formValue.value = selectedValue
    showModal.value = true;
  } else {
    // 删除
    message.warning(`删除：${selectedValue.name}`)
  }

  showDropdown.value = false
}

const onClickoutside = () => {
  showDropdown.value = false
}

const rowProps = (row: BlogMeta) => {
  return {
    onContextmenu: (e: MouseEvent) => {
      selectedValue = row;
      e.preventDefault()
      showDropdown.value = false
      nextTick().then(() => {
        showDropdown.value = true
        x.value = e.clientX
        y.value = e.clientY
      })
    }
  }
}

onMounted(() => {
  metasStore.getMetas(BlogMetaType.Tag);
})

const showModal = ref(false)
const formRef = ref<FormInst | null>(null)
const message = useMessage()

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

const add = () => {
  formValue.value = {
    id: 0,
    name: '',
    description: '',
    parent: 0,
    count: 0
  }
  showModal.value = true;
}

</script>

<template>
  <n-button @click="add">新增</n-button>
  <n-data-table :columns="columns" :data="metasStore.state.tags" :row-props="rowProps" bordered />
  <n-dropdown placement="bottom-start" trigger="manual" :x="x" :y="y" :options="options" :show="showDropdown"
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
          <n-input-number v-model:value="formValue.parent" placeholder="选择父级" />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="handleValidateClick">
            验证
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </n-modal>
</template>
