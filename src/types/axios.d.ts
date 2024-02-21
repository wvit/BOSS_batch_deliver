import 'axios'

declare module 'axios' {
  interface AxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>

    post<T = any>(
      url: string,
      params: any,
      config?: AxiosRequestConfig,
    ): Promise<T>
  }
}
