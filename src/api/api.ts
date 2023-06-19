import { BlogMeta, BlogMetaCreateDto, BlogMetaType, GlobalPagedResponse, LoginResponse } from '../types/appTypes.ts'
import RequestHttp from '../utils/request.ts'

export const getMetas = (type: BlogMetaType) => {
  return RequestHttp.get<GlobalPagedResponse<BlogMeta>>('/BlogMeta', {
    type: type,
    pageNumber: 1,
    pageSize: 100,
  })
}

export const addMeta = (meta: BlogMetaCreateDto) => {
  return RequestHttp.post('BlogMeta', meta)
}

export const delMeta = (id: number) => {
  return RequestHttp.delete(`BlogMeta/${id}`)
}

export const updMeta = (id: number, meta: BlogMetaCreateDto) => {
  return RequestHttp.put(`BlogMeta/${id}`, meta)
}

export const login = (email: string, password: string) => {
  return RequestHttp.post<LoginResponse>('Auth/Login', { userName: email, password })
}

export const getPosts = () => {
  return RequestHttp.get('BlogContent', {
    type: 0,
    pageNumber: 1,
    pageSize: 100
  })
}
