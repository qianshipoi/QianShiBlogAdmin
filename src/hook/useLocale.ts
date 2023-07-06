import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

export default function useLocale() {
  const i18n = useI18n()
  const currentLocale = computed(() => i18n.locale.value)
  const changeLocale = (value: string) => {
    i18n.locale.value = value
    localStorage.setItem('locale', value)
    window.$message.success(i18n.t('navbar.action.locale'))
  }

  return {
    i18n,
    currentLocale,
    changeLocale
  }
}
