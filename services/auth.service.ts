import { apiClient, type ApiResponse } from "@/lib/api"
import type { AuthCredentials, AuthResponse } from "@/types/auth"

export class AuthService {
  private static token: string | null = null
  private static tokenExpiry: number | null = null
  private static initialized = false

  // Inicialización lazy solo en cliente
  private static initializeFromStorage(): void {
    if (this.initialized || typeof window === 'undefined') return
    
    const savedToken = localStorage.getItem('auth_token')
    const savedExpiry = localStorage.getItem('auth_token_expiry')
    if (savedToken && savedExpiry) {
      this.token = savedToken
      this.tokenExpiry = parseInt(savedExpiry, 10)
    }
    this.initialized = true
  }

  static async authenticate(): Promise<ApiResponse<AuthResponse>> {
    const credentials: AuthCredentials = {
      username: process.env.NEXT_PUBLIC_API_USERNAME || "",
      password: process.env.NEXT_PUBLIC_API_PASSWORD || "",
    }

    if (!credentials.username || !credentials.password) {
      return {
        success: false,
        error: "Credenciales de autenticación no configuradas",
      }
    }

    const response = await apiClient.post<AuthResponse>("token/", credentials)

    if (response.success && response.data) {
      this.token = response.data.access
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000

      // Persistir en localStorage solo en cliente
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', this.token)
        localStorage.setItem('auth_token_expiry', String(this.tokenExpiry))
      }

      apiClient.setToken(this.token) // 👈 Asignar token a apiClient

      return response
    }

    return response
  }

  static isTokenValid(): boolean {
    this.initializeFromStorage()
    return this.token !== null && this.tokenExpiry !== null && Date.now() < this.tokenExpiry
  }

  static getToken(): string | null {
    this.initializeFromStorage()
    return this.isTokenValid() ? this.token : null
  }

  static clearToken(): void {
    this.token = null
    this.tokenExpiry = null
    this.initialized = false
    
    // Limpiar localStorage solo en cliente
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_token_expiry')
    }
    
    apiClient.setToken(null) // 👈 Limpiar también en el cliente
  }

  static async getValidToken(): Promise<string | null> {
    if (this.isTokenValid()) {
      return this.token
    }

    const authResponse = await this.authenticate()
    if (authResponse.success && authResponse.data) {
      return authResponse.data.access
    }

    return null
  }
}
