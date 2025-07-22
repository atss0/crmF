import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

type LoginResponse = {
  success: boolean
  data: {
    user: {
      id: number
      name: string
      email: string
      role: string
    }
    token: string
  }
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
    email,
    password,
  })

  return response.data
}