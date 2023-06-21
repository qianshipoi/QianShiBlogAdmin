<script setup lang='ts'>
import { useMessage, FormInst } from 'naive-ui';
import { ref } from 'vue';
import { useAuthStore } from '../store/useAuthStore';
import { useRoute, useRouter } from 'vue-router';

const formRef = ref<FormInst | null>(null)
const message = useMessage()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const formValue = ref({
  email: "",
  password: ''
})
const rules = {
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: ['input', 'blur']
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['input', 'blur']
  }
}

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const result = await authStore.login(formValue.value.email, formValue.value.password)
      if (result) {
        if (route.query['redirect']) {
          router.push(route.query.redirect as string)
        } else {
          router.push('/')
        }
      }
    } else {
      message.error('请完善信息')
    }
  })
}

</script>

<template>
  <n-form ref="formRef" inline :label-width="80" :model="formValue" :rules="rules" size="medium">
    <n-form-item label="邮箱" path="email">
      <n-input v-model:value="formValue.email" placeholder="输入姓名" />
    </n-form-item>
    <n-form-item label="密码" path="password">
      <n-input v-model:value="formValue.password" placeholder="输入年龄" />
    </n-form-item>
    <n-form-item>
      <n-button attr-type="button" @click="handleValidateClick">
        验证
      </n-button>
    </n-form-item>
  </n-form>
</template>
