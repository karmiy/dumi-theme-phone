# dumi-theme-phone

## 说明

基于 dumi-theme-mobile 修改

dumie-theme-mobile 现状（v1.1.8）：

- md 中所有的 Previewer 都会被视为 demo，根据滚动到指定位置在 mobile device 加载不同的 demo

可能期望的应用场景：

- 全部 demo 集合成在一起展示在 device 视图上

## 快速上手

### 指定全量 demo 视图

由于一个 demo 对应一个链接

我们需要独立一个出全量 demo （包含了全部示例代码）用于展示在右侧的手机窗

如下结构中的 demos/index.tsx

```
-src
  -button
    - demos
      - demo-type.tsx
      - demo-basic.tsx
      - index.tsx
    - README.md
```

```tsx
// demos/demo-basic.tsx
import React from 'react';
import { Button } from 'xxx';

export default () => <Button>Basic</Button>;
```

```tsx
// demos/demo-type.tsx
import React from 'react';
import { Button } from 'xxx';

export default () => <Button type='regular'>Regular</Button>;
```


```tsx
// demos/index.tsx
import React from 'react';
import DemoBasic from './demo-basic';
import DemoType from './demo-type';

// 集合全部 demos
export default () => {
  return (
    <div>
      <DemoBasic />
      <DemoType />
    </div>
  );
}
```

使用 FrontMatter 语法标志 code 对此 demo 进行配置标记

```md
# Button

常用的操作按钮

<code src='./demos' phone />

## 基本使用

常规用法...

<code src='./demos/demo-basic.tsx' />

## 按钮类型

Button 具有 x 种类型...

<code src='./demos/demo-type.tsx' />
```

也可以 FrontMatter 注释

```tsx
/**
 * phone: true
 */
import React from 'react';
import { Button } from 'xxx';

export default () => {
  return (
    <div>
      ...
    </div>
  )
}
```

### 状态栏厂商

md 文件顶层配置：

```
phone:
  supplier: dumi
```

### 时间

md 文件顶层配置：

```
phone:
  time: 10:24
```

### 禁止 HD

默认会开启 [umi-hd](https://www.npmjs.com/package/umi-hd)

可在 .umirc.ts 配置 themeConfig 关闭：

```js
export default defineConfig({
  // ... others
  themeConfig: {
    hd: false,
  },
});
```

### 禁用该主题

md 文件顶层配置：

```
phone: false
```
