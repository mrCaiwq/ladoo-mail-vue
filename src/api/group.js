import axios from '@/libs/api.request'

export const createGroup = ({ name }) => {
  const data = { name }
  return axios.request({
    url: 'groups',
    data,
    method: 'post'
  })
}

export const updateGroup = ({ id, name }) => {
  const data = { name }
  return axios.request({
    url: `groups/${id}`,
    data,
    method: 'put'
  })
}

export const getGroupList = ({ page = 1, per_page = null }) => {
  let params = { page }
  if (per_page) {
    params.per_page = per_page
  }

  return axios.request({
    url: 'groups',
    params,
    method: 'get'
  })
}
