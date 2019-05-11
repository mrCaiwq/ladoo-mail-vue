import moment from 'moment'

export const formatTime = (dateStr) => {
  return moment(dateStr).format('YYYY-MM-DD HH:mm')
}
