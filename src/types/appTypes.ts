export interface GlobalPagedResponse<T> {
  hasNextPage: boolean,
  hasPreviousPage: boolean,
  items: T[],
  pageNumber: number,
  totalCount: number,
  totalPage: number
}

export interface handlerType {
  add: (id: number) => void,
  edit: (id: number) => void,
  del: (id: number) => void,
}

export interface GlobalResponse {
  succeeded: boolean,
  message?: string,
  errors: string[]
}

export interface GlobalResponseT<T> extends GlobalResponse {
  data: T
}

export enum BlogMetaType {
  Category = 0,
  Tag = 1
}

export interface BlogMeta {
  id: number,
  name: string,
  description: string | null,
  count: number,
  parent: number,
  children?: BlogMeta[]
}

export type BlogMetaCreateDto = {
  name: string,
  descriptiopn?: string,
  parent: number | undefined,
  type: BlogMetaType
}

export type BlogMetaEditDto = {
  id: number,
  name: string,
  descriptiopn?: string,
  parent: number | undefined,
  type: BlogMetaType
}

export interface PostType {
  id: number,
  title: string,
  subtitle: string | null,
  order: number,
  status: number,
  type: number,
  allowComment: boolean,
  commentCount: number
}

export interface LoginResponse {
  id: string
  userName: string
  email: string,
  roles: Array<string>
  jwToken: string
}
