import type { User } from '@/domain/user'

import axios from 'axios'
import processError from './processError'

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
        throw processError(e)
    }
}