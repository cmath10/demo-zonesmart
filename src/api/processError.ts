import UnauthorizedHttpError from '@/api/UnauthorizedHttpError'

import { isAxiosError } from 'axios'

export default (e: unknown) => {
  if (isAxiosError(e)) {
    if (e.response?.status === 401) {
      throw new UnauthorizedHttpError(e.response.data.detail)
    }
  }

  throw e
}