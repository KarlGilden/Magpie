declare module 'express-session' {
    interface SessionData {
      userId: number;
    }
  }

export type User = {
    id: number,
    username: string, 
    email: string,
    created_at: string
}

export type Credential = {
    id: number, 
    provider_id: number, 
    password_hash: string,
    created_at: string
}

export type AuthProvider = {
    id: number, 
    user_id: number, 
    provider: string,
    provider_user_id: number,
    access_token: number, 
    refresh_token: number,
    created_at: string
} 
  
export type RegisterRequest = {
    username: string, 
    email: string,
    password: string
}

export type LoginRequest = {
    username: string,
    email: string,
    password: string
}