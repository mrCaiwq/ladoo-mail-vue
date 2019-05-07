import axios from '@/libs/api.request'
import _ from 'lodash'

export const batchCreate = ({ recipients, sender, subject, content }) => {
  const data = {
    recipients,
    sender: {
      email: sender
    },
    subject,
    content
  }
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
