# dumi-theme-phone

## 说明

基于 dumi-theme-mobile 修改

dumie-theme-mobile 现状（v1.1.8）：

- md 中所有的 Previewer 都会被视为 demo，根据滚动到指定位置在 mobile device 加载不同的 demo

可能期望的应用场景：

- 全部 demo 集合成在一起展示在 device 视图上

## 快速上手

### 指定全量 demo 视图

由于一个 demo 对应一个链接，需要独立一个出 demo 用于展示在右侧的手机窗：

- 包含全部 demo 示例的代码

使用 FrontMatter 语法对此 demo 进行配置标记

```
/**
 * title: 基本用法
 * phone: true
 */
import React from 'react';
import { Button } from 'xxx';

export default () => <Button>按钮</Button>;
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
