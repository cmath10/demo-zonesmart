import axios from 'axios'
import processError from './processError'

export interface Product {
  id: string;
  remote_id: string | null;
  brand_id: string | null;
  brand_name: string | null;
  title: string;
  images: string[];
  url: string;
  price: number;
  max_price: number | null;
  min_price: number | null;
  quantity: number;
}

export interface Pagination {
  offset?: number;
  limit?: number;
}

export interface Input extends Pagination {
  access: string;
}

export interface Page<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function getUrl ({
  offset = 0,
  limit = 10,
}: Pagination) {
  const url = new URL('https://dev-ar.zonesmart.com/api/product/')

  if (offset > 0) {
    url.searchParams.append('offset', String(offset))
  }

  url.searchParams.append('limit', String(limit))

  return String(url)
}

export default async ({
  access,
  offset = 0,
  limit = 10,
}: Input): Promise<Page<Product>> => {
  try {
    const response = await axios.get<Page<Product>>(getUrl({
      offset,
      limit,
    }), {
      headers: {
        authorization: `JWT ${access}`,
      },
    })

    return response.data
  } catch (e: unknown) {
    throw processError(e)
  }
}