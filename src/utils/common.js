import { Loading, Message, Notification } from "element-ui"

export const LoadingWrapper = option => {
  option.background = 'rgba(255,255,255, .8) !important'
  return Loading.service(option)
}

export const ShowMsg = (message, type = 'warning') => {
  return Message({
    type,
    message,
    showClose: true,
  })
}

export const ShowNotify = option => {
  option.type = option?.type ?? 'warning'
  return Notification(option)
}