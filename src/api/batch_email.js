import axios from '@/libs/api.request'
import _ from 'lodash'

export const getBatchEmailList = (params) => {
  params = _.omitBy(params, _.isNil)
  return axios.request({
    url: 'batch_emails',
    params: params,
    method: 'get'
  })
}

export const getBatchEmail = (id) => {
  return axios.request({
    url: `batch_emails/${id}`,
    method: 'get'
  })
}
