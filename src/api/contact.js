
import axios from '@/libs/api.request'

export const createContact = (data) => {
  return axios.request({
    url: 'contacts',
    data,
    method: 'post'
  })
}

export const updateContact = (data) => {
  return axios.request({
    url: `contacts/${data.id}`,
    data,
    method: 'put'
  })
}

export const deleteContact = (id) => {
  return axios.request({
    url: `contacts/${id}`,
    method: 'delete'
  })
}

export const getContactList = ({ page = 1, per_page = null }) => {
  let params = { page }
  if (per_page) {
    params.per_page = per_page
  }

  return axios.request({
    url: 'contacts',
    params,
    method: 'get'
  })
}
