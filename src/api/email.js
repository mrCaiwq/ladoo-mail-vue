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
