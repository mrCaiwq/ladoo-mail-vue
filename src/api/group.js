import axios from '@/libs/api.request'

export const createGroup = ({ name }) => {
  const data = { name }
  return axios.request({
    url: 'groups',
    data,
    method: 'post'
  })
}
