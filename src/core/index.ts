import Chain from './chain'
import { HistoryState, TxtRange, NAutocPasswordOption, NAutocPasswordConfig, NAutocPasswordReturn } from './types'

function getSelectionRange(elem: HTMLInputElement): TxtRange {
  const { selectionStart, selectionEnd } = elem
  const start = Math.min(selectionStart!, selectionEnd!)
  const end = Math.max(selectionStart!, selectionEnd!)
  const collapsed = start == end

  return { start, end, collapsed }
}

function setSelectionRange(elem: HTMLInputElement, start: number, end: number) {
  elem.setSelectionRange(start, end)
}

function replaceRangeText(sourceTxt: string, repalceTxt: string, start: number, end: number): HistoryState {
  const txt = `${sourceTxt.slice(0, start)}${repalceTxt}${sourceTxt.slice(end)}`

  const range: TxtRange = {
    start: start + repalceTxt.length,
    end: start + repalceTxt.length,
    collapsed: true,
  }

  return { txt, range }
}

const defaultSign = '*'

export function nautocPassword(option: NAutocPasswordOption): NAutocPasswordReturn {
  const { model, sign, cleartext, forceUpdateFocus = 'end' } = option

  let el: HTMLInputElement

  const temp: Omit<NAutocPasswordConfig, 'forceUpdate'> = { sign: sign?.[0] || defaultSign, cleartext: !!cleartext }

  /**
   * 密码记录
   */
  const history = new Chain<HistoryState>()

  // @ts-ignore
  window.his = history

  /**
   * 折叠输入时的记录
   */
  const composition = new Chain<HistoryState>()

  function setValue(txt: string) {
    el.value = temp.cleartext ? txt : txt.replace(/./g, temp.sign)
  }

  /**
   * 保存 history
   * @param state 被保存的数据
   * @param save 对 state 进行保存
   */
  function changeState(state: HistoryState | string, save: boolean = false) {
    if (typeof state === 'string') {
      state = { txt: state, range: { start: state.length, end: state.length, collapsed: true } }
    }
    model.set(state.txt)
    save && history.insertLast(state)
    setValue(state.txt)
    setSelectionRange(el, state!.range.start, state!.range.end)
  }

  /**
   * beforeinput 事件
   * @param e
   */
  function onBeforeinput(e: InputEvent) {
    e.preventDefault()
    const range = getSelectionRange(el)

    if (!history.size) {
      history.insertLast({ txt: model.get(), range })
    }

    if (e.isComposing) {
      composition.insertLast({ txt: e.data!, range })
      return
    }

    let state: HistoryState | null = null

    switch (e.inputType) {
      // 常规输入
      case 'insertText': {
        state = replaceRangeText(model.get(), e.data!, range.start, range.end)
        break
      }
      // backspace
      case 'deleteContentBackward': {
        if (range.start) {
          state = replaceRangeText(model.get(), '', range.collapsed ? range.start - 1 : range.start, range.end)
        }
        break
      }
      // delete
      case 'deleteContentForward': {
        state = replaceRangeText(model.get(), '', range.start, range.collapsed ? range.end + 1 : range.end)
        break
      }
      // 剪切
      case 'deleteByCut': {
        state = replaceRangeText(model.get(), '', range.start, range.end)
        break
      }
    }

    state && changeState(state, true)
  }

  /**
   * 折叠输入结束
   * @param e
   */
  function onCompositionend() {
    if (composition.current()!.txt) {
      const hstate = history.current()
      const csate = composition.prev()!

      const sourceTxt = hstate?.txt ?? model.get()
      const range = composition.first()!.range

      const state = replaceRangeText(sourceTxt, csate.txt, range.start, range.end)
      changeState(state, true)
    }

    composition.clear()
  }

  /**
   * ctrl + z 或 ctrl + shift + z
   * @param e
   */
  function onKeydown(e: KeyboardEvent) {
    if (e.keyCode !== 90 || !e.ctrlKey) return

    const state = e.shiftKey ? history.next() : history.prev()
    state && changeState(state)
  }

  /**
   * 强制更新输入框内容
   */
  function forceUpdate() {
    if (el) {
      const state = history.current()

      if (forceUpdateFocus !== 'none') el.focus()

      if (forceUpdateFocus === 'end') setValue(state ? state.txt : model.get())
      else state ? changeState(state) : setValue(model.get())
    }
  }

  const config = Object.defineProperties({} as NAutocPasswordConfig, {
    sign: {
      get() {
        return temp.sign
      },
      set(value) {
        value = value[0] || defaultSign
        if (temp.sign !== value) {
          temp.sign = value
          forceUpdate()
        }
      },
    },
    cleartext: {
      get() {
        return temp.cleartext
      },
      set(value) {
        value = !!value
        if (temp.cleartext !== value) {
          temp.cleartext = value
          forceUpdate()
        }
      },
    },
    forceUpdate: {
      value() {
        if (!el) return
        const txt = model.get()
        const state = history.current()
        if (state?.txt !== txt) {
          changeState(txt, true)
        }
      },
    },
  })

  function bind(input: HTMLInputElement) {
    if (!el) {
      el = input

      // 初始化赋值，并进行记录
      changeState(model.get(), true)

      // 绑定相关事件
      input.addEventListener('beforeinput', onBeforeinput)
      input.addEventListener('compositionend', onCompositionend)
      input.addEventListener('keydown', onKeydown)
    }
  }

  return [config, bind]
}
