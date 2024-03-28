import axios from 'axios'

export default async (data: {
  refresh: string;
}) => {
  const response = await axios.post('https://dev-ar.zonesmart.com/api/user/jwt/refresh/', data)

  return response.data
}