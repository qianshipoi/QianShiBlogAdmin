import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { GlobalResponseT } from '../types/appTypes';
import { useAuthStore } from '../store/useAuthStore';
import { useRoute, useRouter } from 'vue-router';
import router from '../router';

const URL: string = 'http://localhost:5142/api'

enum RequestEnums {
  TIMEOUT = 20000,
  OVERDUE = 600, // 登录失效
  FAIL = 999, // 请求失败
  SUCCESS = 200, // 请求成功
}

const config = {
  // 默认地址
  baseURL: URL as string,
  // 设置超时时间
  timeout: RequestEnums.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: false
}

class RequestHttp {
  // 定义成员变量并指定类型
  service: AxiosInstance;

  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config);

    /**
     * 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: any) => {
        let headers = {
          Authorization: undefined as undefined | string
        }
        const auth = useAuthStore()

        if (auth.isAuthenticated) {
          headers.Authorization = `Bearer ${auth.userInfo?.jwToken}`
        }

        return {
          ...config,
          headers
        }
      },
      (error: AxiosError) => {
        // 请求报错
        Promise.reject(error)
      }
    )

    /**
     * 响应拦截器
     * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response; // 解构
        if (data.code === RequestEnums.OVERDUE) {
          // 登录信息失效，应跳转到登录页面，并清空本地的token

          const auth = useAuthStore()
          auth.isAuthenticated = false
          auth.userInfo = null
          // router.replace({
          //   path: '/login'
          // })
          return Promise.reject(data);
        }
        // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
        if (data.code && data.code !== RequestEnums.SUCCESS) {
          window.$message.error(data)
          return Promise.reject(data)
        }
        return data;
      },
      (error: AxiosError) => {
        const { response } = error;
        if (response) {
          this.handleCode(response.status)
        }
        if (!window.navigator.onLine) {
          window.$message.error('网络链接失败')
          // 可以跳转到错误页面，也可以不做操作
          // return router.replace({
          //   path: '/404'
          // });
        }
        return Promise.reject("请求异常")
      }
    )
  }

  handleCode(code: number): void {
    const message = window.$message;
    switch (code) {
      case 401:
        message.error('登录失败，请重新登录');
        const authStore = useAuthStore()

        if (router.currentRoute.value.name !== "Login") {
          authStore.$reset();
          router.replace({
            name: 'Login',
            query: {
              redirect: router.currentRoute.value.fullPath
            }
          })
        }

        break;
      default:
        message.error('请求失败');
        break;
    }
  }

  // 常用方法封装
  get<T>(url: string, params?: object): Promise<GlobalResponseT<T>> {
    return this.service.get(url, { params });
  }

  post<T>(url: string, body?: object): Promise<GlobalResponseT<T>> {
    return this.service.post(url, body);
  }

  put<T>(url: string, body?: object): Promise<GlobalResponseT<T>> {
    return this.service.put(url, body);
  }

  delete<T>(url: string, params?: object): Promise<GlobalResponseT<T>> {
    return this.service.delete(url, { params });
  }
}

// 导出一个实例对象
export default new RequestHttp(config);
