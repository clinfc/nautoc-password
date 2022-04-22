import nautocPassword, { NAutocPasswordOption } from './src'

const pwd = document.querySelector('#pwd') as HTMLInputElement
const sign = document.querySelector('#sign') as HTMLSelectElement
const toggle = document.querySelector('#toggle') as HTMLSpanElement
const preview = document.querySelector('#preview') as HTMLInputElement

const option: NAutocPasswordOption = {
  model: {
    get() {
      return preview.textContent
    },
    set(value) {
      preview.textContent = value
    },
  },
}

const [config, bind] = nautocPassword(option)

bind(pwd)
toggle.innerText = config.cleartext ? '隐藏' : '显示'

sign.addEventListener('change', () => {
  config.sign = sign.value
})

toggle.addEventListener('click', () => {
  config.cleartext = !config.cleartext
  toggle.innerText = config.cleartext ? '隐藏' : '显示'
})

// @ts-ignore
window.config = config

setTimeout(() => {
  preview.textContent = 'hellps'
  config.forceUpdate()
}, 9000)
