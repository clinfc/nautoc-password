# nautoc-password

劫持 `input[type=text]` 的 `beforeinput` 事件，将其模拟成 `input[type=password]`，意在解决浏览器对密码框的自动填充行为。

`nautoc-password` 不依赖任何第三方库，纯原生，使用 `TypeScript` 构建，打包后的 `umd` 格式文件在 `3.2kb` 左右。

## 开始开始

### Node

#### 安装

```sh
npm i nautoc-password
```

#### 使用

```ts
import nautocPassword, { NAutocPasswordOption } from 'nautoc-password'

// 保存密码
let password = ''

// 初始化配置
const option: NAutocPasswordOption = {
  model: {
    get() {
      return password
    },
    set(value) {
      password = value
    },
  },
  sign: 'x', // 密文显示时的替代字符。默认值：*。
  cleartext: true, // 设置为默认明文显示。false 则为密文显示。默认值：false。
  forceUpdateFocus: 'none', // sign 与 cleartext 动态更新后，或手动调用 forceUpdate 进行手动更新后，input 输入框的聚焦状态。默认值：end。
}

// 初始化。获取到具有双向绑定的配置对象和input节点绑定函数
const [config, bind] = nautocPassword(option)

// 生成一个 input 框
const input = document.createElement('input')
input.type = 'text'
document.body.append(input)

// 绑定 input 框
bind(input)

// 设置模拟的密码框为密文显示。会触发 input 框对内容进行实时更新。
config.cleartext = false

// 设置模拟的密码框密文显示时的替代字符。会触发 input 框对内容进行实时更新。
config.sign = '#'

// 在外部更改内容
password = '654321'
// 使用 api 将更改同步到 input 输入框中
config.forceUpdate()
```

### CDN

```html
<input type="text" id="password" />
<script src="https://cdn.jsdelivr.net/npm/nautoc-password@latest"></script>
<script>
  const formData = {
    password: '123465',
  }

  const [config, bind] = nautocPassword({
    model: {
      get() {
        return formData.password
      },
      set(value) {
        formData.password = value
      },
    },
  })

  bind(document.querySelector('#password'))
</script>
```

## ts 类型

```ts
declare function nautocPassword(option: NAutocPasswordOption): NAutocPasswordReturn
```

完整的数据结构及注释请查看 [src/core/types.ts](./src/core/types.ts)。

## 兼容

1. 支持 [beforeinput](https://caniuse.com/?search=beforeinput) 事件
2. 支持 [compositionend](https://caniuse.com/?search=compositionend) 事件
