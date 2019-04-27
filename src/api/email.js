import axios from '@/libs/api.request'

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

/**
 *
 * @param {number} page
 */
export const getEmailList = ({ page = 1, per_page = null }) => {
  let params = {
    page
  }
  if (per_page) {
    params.per_page = per_page
  }
  return axios.request({
    url: 'emails',
    params: params,
    method: 'get'
  })
}
