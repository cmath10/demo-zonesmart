import axios from 'axios'
import processError from './processError'

export default async (refresh: string) => {
  try {
    const { data } = await axios.post<{
      access: string;
    }>('https://dev-ar.zonesmart.com/api/user/jwt/refresh/', {
      refresh,
    })

    return data.access
  } catch (e: unknown) {
    throw processError(e)
  }
}