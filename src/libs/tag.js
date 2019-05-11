const mailStateTagColor = {
  ready: 'default',
  delivering: 'default',
  delivered: 'primary',
  opened: 'success',
  failure: 'error',
  rejected: 'error',
  clicked: 'success'
}

export const getStateTagColor = (state) => {
  return mailStateTagColor[state]
}
