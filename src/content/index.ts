import { Dom, getResource } from '@/utils'

window.addEventListener('DOMContentLoaded', () => {
  Dom.query('body').create('script', {
    type: 'text/javascript',
    src: getResource('/js/watchXHR.js'),
  })
})
