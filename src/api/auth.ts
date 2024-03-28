import type { User } from '@/domain/user'

import UnauthorizedHttpError from './UnauthorizedHttpError'

import axios from 'axios'

export default async (data: {
  email: string;
  password: string;
}): Promise<User> => {
  try {
    const response = await axios.post<{
      access: string;
      refresh: string;
    }>('https://dev-ar.zonesmart.com/api/user/jwt/create/', data)

    return {
      email: data.email,
      ...response.data,
    }
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 401) {
        throw new UnauthorizedHttpError(e.response.data.detail)
      }
    }
    throw e
  }
}