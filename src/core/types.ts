export type TxtRange = {
  start: number
  end: number
  collapsed: boolean
}

export type HistoryState = {
  txt: string
  range: TxtRange
}

export type NAutocPasswordModel = {
  get: () => string
  set: (value: string) => void
}

/**
 * sign 和 cleartext 变更致使输入框值更新后，或手动调用 forceUpdate 进行手动更新后，聚焦输入框聚焦的位置。end：聚焦在末尾；history：聚焦在最后一次输入的位置；none：不聚焦。
 */
export type NAutocPasswordForceUpdateFocus = 'end' | 'history' | 'none'

/**
 * 初始化函数的配置
 */
export type NAutocPasswordOption = {
  /**
   * 数据的 getter 和 setter 交互
   */
  model: NAutocPasswordModel
  /**
   * 密文字符。默认值：*。
   */
  sign?: string
  /**
   * 输入框内容显示为明文。默认值：false。
   */
  cleartext?: boolean
  /**
   * 默认值：end。
   */
  forceUpdateFocus?: NAutocPasswordForceUpdateFocus
}

/**
 * 动态更新输入框的显示
 */
export type NAutocPasswordConfig = {
  /**
   * 密文字符
   */
  sign: string
  /**
   * 显示为明文/密文
   */
  cleartext: boolean
  /**
   * 当外部的内容被更改后，调用此方法来将数据同步到 input 输入框中
   */
  forceUpdate: () => void
}

/**
 * 初始化函数返回的结果
 */
export type NAutocPasswordReturn = [config: NAutocPasswordConfig, bind: (input: HTMLInputElement) => void]
