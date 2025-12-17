import { useMutation } from "@tanstack/react-query";
import { useFetch } from "../useFetch";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
}

export const useRegister = () => {
  const fetch = useFetch();

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: async (data: RegisterRequest) => {
      return fetch<AuthResponse>({
        path: "/api/auth/register",
        method: "POST",
        body: data,
      });
    },
  });
};

export const useLogin = () => {
  const fetch = useFetch();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (data: LoginRequest) => {
      return fetch<AuthResponse>({
        path: "/api/auth/login",
        method: "POST",
        body: data,
      });
    },
  });
};
