const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.autopartes.cl/v1"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string | null) {
    localStorage.setItem('token', token || '')
    this.token = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, retryCount: number = 0): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token')
    try {
      const url = `${this.baseUrl}${endpoint}`
      console.log(`[ApiClient] ${options.method || 'GET'} ${url}`, options.body ? { body: options.body } : '') // DEBUG

      const headers = new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      })

      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }

      if (options.headers) {
        const extra = new Headers(options.headers as HeadersInit)
        extra.forEach((value, key) => headers.set(key, value))
      }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      // Manejar error 401 - Token inválido o expirado
      if (response.status === 401 && retryCount === 0) {
        console.log('[ApiClient] Token inválido, intentando refresh...')
        
        // Importar AuthService dinámicamente para evitar circular dependencies
        const { AuthService } = await import('@/services/auth.service')
        
        // Intentar refresh del token
        const newToken = await AuthService.getValidToken()
        
        if (newToken) {
          console.log('[ApiClient] Token refresh exitoso, reintentando request...')
          // Actualizar token y reintentar la request
          this.setToken(newToken)
          return this.request(endpoint, options, retryCount + 1)
        } else {
          console.log('[ApiClient] Token refresh falló, redirigiendo a login...')
          // Redirigir a login si no hay página actual
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          return {
            success: false,
            error: "Sesión expirada. Por favor inicia sesión nuevamente.",
          }
        }
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP Error: ${response.status}`,
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      }
    }
  }

  get<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "GET", headers })
  }

  post<T>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      headers,
    })
  }

  put<T>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      headers,
    })
  }

  delete<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "DELETE", headers })
  }
}
// npm run dev -- --port 3001 --hostname base.localhost
export const apiClient = new ApiClient(API_BASE_URL)
// export const apiClient = new ApiClient("https://repuestosromeral.sitios.softwarelabs.cl/api/")
