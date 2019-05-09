import axios from '@/libs/api.request'
import _ from 'lodash'

export const batchCreate = (params) => {
  let data = { ...params }
  let sender_email = data.sender
  data.sender = { email: sender_email }
  return axios.request({
    url: 'emails/batch',
    data,
    method: 'post'
  })
}

export const getEmailList = (params) => {
  params = _.omitBy(params, _.isNil)
  return axios.request({
    url: 'emails',
    params: params,
    method: 'get'
  })
}
