import { defineStore, skipHydrate } from "pinia"
import { reactive } from "vue"
import { BlogMeta, BlogMetaCreateDto, BlogMetaEditDto, BlogMetaType } from "../types/appTypes.ts"
import { getMetas as getMetasApi, addMeta as addMetaApi, updMeta as editMetaApi, delMeta as delMetaApi } from '../api/api.ts'

export const useMetasStore = defineStore('metasStore', () => {
  const state = reactive<{
    categorys: BlogMeta[],
    tags: BlogMeta[],
    loading: boolean
  }>({
    categorys: [],
    tags: [],
    loading: false
  })

  const getMetas = async (type: BlogMetaType) => {
    const message = window.$message;
    try {
      state.loading = true
      const response = await getMetasApi(type);

      if (type === BlogMetaType.Category) {
        state.categorys = response.data.items
      } else {
        state.tags = response.data.items
      }
    } catch (err) {
      message.error("获取分类数据异常！")
    } finally {
      state.loading = false
    }
  }

  const addMeta = async (meta: BlogMetaCreateDto) => {
    const message = window.$message
    state.loading = true
    try {
      await addMetaApi(meta);
      message.success("添加成功！");
    } catch (error) {
      message.error("添加失败！")
      return false
    } finally {
      state.loading = false
    }
    await getMetas(meta.type)
    return true
  }

  const editMeta = async (meta: BlogMetaEditDto) => {
    const message = window.$message
    state.loading = true
    try {
      await editMetaApi(meta.id, meta);
      message.success("更新成功！");
    } catch (error) {
      message.error("更新失败！")
      return false
    } finally {
      state.loading = false
    }
    await getMetas(meta.type)
    return true
  }

  const delMeta = async (id: number, type: BlogMetaType) => {
    const message = window.$message
    state.loading = true
    try {
      await delMetaApi(id);
      message.success("删除成功！");
    } catch (error) {
      message.error("删除失败！")
      return
    } finally {
      state.loading = false
    }
    await getMetas(type)
  }

  return {
    state: skipHydrate(state),
    getMetas,
    addMeta,
    editMeta,
    delMeta
  }
})


