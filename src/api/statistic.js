import axios from '@/libs/api.request'

export const getMailCount = () => {
  return axios.request({
    url: 'statistic/mail_count',
    method: 'get'
  })
}

/**
 *
 * @param {object} params { period: 'hour', begin_at: '2019-04-15', end_at: '2019-04-30' }
 */
export const getMailGroup = (params) => {
  return axios.request({
    url: 'statistic/email_group',
    params,
    method: 'get'
  })
}
