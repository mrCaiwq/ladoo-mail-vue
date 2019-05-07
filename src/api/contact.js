
import axios from '@/libs/api.request'
import _ from 'lodash'

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

export const getContactList = (params) => {
  params = _.omitBy(params, _.isNil)
  return axios.request({
    url: 'contacts',
    params,
    method: 'get'
  })
}
