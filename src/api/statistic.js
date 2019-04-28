import axios from '@/libs/api.request'

export const getMailCount = () => {
  return axios.request({
    url: 'statistic/mail_count',
    method: 'get'
  })
}
