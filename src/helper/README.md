# helper —— 新手帮助（WhichWayHelper）

任务链式的新手引导：左侧方形人物图 + 右侧自适应文字框，背景四块遮罩挖出高亮洞；
用户点击完成当前提示后自动进入下一条，直到任务链结束。正式环境只提供 API，不自动弹；
开发者模式可用演示入口快速验收。

~~~
src/helper/
├── index.ts          # WhichWayHelper 管理器（单例 whichWayHelper）
├── chain.ts          # HelperTaskChain 任务链状态机 + 校验 / 序列化
├── layout.ts         # 高亮解析、位置计算、遮罩挖洞（纯函数，编辑器可复用）
├── types.ts          # 公共数据协议（步骤 / 链 / 位置 / 样式 / 事件）
├── demo.ts           # 开发者演示链
├── GuideOverlay.vue  # 渲染层（左图 + 右框 + 遮罩 + 高亮框）
└── README.md
~~~

## 快速开始

~~~ts
import { whichWayHelper } from "./helper/index.js";

whichWayHelper.run({
	steps: [
		{
			text: "欢迎！点击任意位置继续。",
			position: "center",
		},
		{
			text: "点击这里打开菜单。",
			highlight: { selector: "#roundmenu" },
			advanceOn: "highlight",
			waitFor: 1500,
			position: { placement: "bottom", align: "center" },
		},
		{
			text: "也可以高亮任意屏幕区域。",
			highlight: { rect: { x: 80, y: 120, width: 360, height: 180 } },
			advanceOn: "highlight",
			position: { x: 80, y: 420 },
		},
	],
});
~~~

- 每一步默认点击遮罩 / 提示框 / 高亮目标都会推进；最后一步完成后自动关闭。
- 按 Esc 可中止（链的 `escapable` 默认 true）。
- 不传 `portrait` 时使用 `image/decoration/1.jpg` 作为占位头像。

## 启动方式与入口

本次接入只提供 API，不自动弹引导：

- 正式环境：`window.whichWay.helper`（模块内导出 `whichWayHelper`）。
- 开发者模式：额外暴露 `window.whichWayHelper`，以及 `window.whichWayHelperDemo()`。
- 演示：在控制台执行 `window.whichWayHelperDemo()`，或 `window.whichWayHelper.runDemo()`。

## 提示步骤 HelperStep

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 可选唯一 id；同一链内不能重复，便于编辑器定位 |
| `text` | string | 右侧正文；纯文本，换行用 \n |
| `title` | string | 可选小标题 / 说话人，显示在正文上方 |
| `portrait` | string \| { src, alt, fit } | 左侧人物图；支持 `dec:` / `illu:` / `ui:` 等路径 scheme |
| `highlight` | 见下 | 高亮目标；不传则整屏遮罩 |
| `position` | 见下 | 提示框位置；不传时按高亮自动摆放，无高亮居中 |
| `advanceOn` | "any" \| "highlight" | 推进规则，默认 "any" |
| `waitFor` | number | 等待高亮元素出现的最长毫秒数，默认 0（只等一帧） |
| `style` | HelperStyle | 单步样式覆盖 |
| `data` | object | 自定义数据，原样透传给事件回调，编辑器可存节点 id |

### 高亮写法

~~~ts
// 1. CSS 选择器（推荐；元素本身可正常点击）
highlight: { selector: "#roundmenu" }

// 2. 直接传元素（点击仍会传给游戏）
highlight: document.querySelector("#roundmenu")!

// 3. 任意屏幕矩形（该区域会拦截点击，只用于推进提示）
highlight: { rect: { x: 80, y: 120, width: 360, height: 180 } }

// 4. 惰性解析（适合元素可能还没挂载的场景）
highlight: () => document.querySelector("#roundmenu") ?? { x: 80, y: 120, width: 320, height: 160 }
~~~

- 高亮对象还可以带 `padding`（默认取样式里的 `highlightPadding`）、`radius`、`follow`（默认 true，滚动/尺寸变化时跟随）。
- 选择器找不到元素时，本步会降级为全屏遮罩并在控制台告警，避免卡死。
- 任意矩形高亮会覆盖一层透明 catcher，拦截该区域原本的点击。
- 真实元素自身不可被鼠标直接命中（例如被祖先设为 pointer-events:none 或被遮挡）时也会启用 catcher，
  避免「必须点中高亮元素」的步骤无法完成；可正常命中的元素仍保持点击穿透。

### 位置写法

~~~ts
position: "center"                                  // 视口居中
position: "bottom-right"                            // 视口九宫格锚点
position: { x: 160, y: 420 }                        // 视口绝对坐标（左上角）
position: { anchor: "bottom-right", offsetX: -24, offsetY: -24 }
position: { placement: "bottom", align: "center", gap: 24 } // 相对高亮目标
position: { placement: "auto" }                     // 自动挑右/左/下/上
position: ({ rect, viewport, guide }) => ({ x: 32, y: 32 }) // 运行时函数（不可序列化）
~~~

- 所有坐标都是视口坐标，最终会夹在视口内（`clamp: false` 可关闭）。
- `x` 与 `y` 必须同时提供；只给一个会校验失败。
- 位置优先级：`x/y` > 锚点 / 预设 > `placement` > 自动 / 居中。
- 自动布局优先右侧，其次左侧、下方、上方；都放不下时选溢出最少的一侧。

### 推进规则

- `advanceOn: "any"`（默认）：点击遮罩、提示框、高亮目标都会推进；高亮元素本身的点击仍会传给游戏。
- `advanceOn: "highlight"`：只有点中高亮元素（任意矩形高亮则点中矩形）才推进；点别处只轻微抖动提示。
- 选了 `"highlight"` 必须提供 `highlight`，否则运行前会抛 `HelperValidationError`。

## 提示链 HelperChain

~~~ts
{
	id: "first-steps",           // 可选；注册到注册表时必填
	name: "新手引导",
	steps: [ /* ... */ ],
	style: { portraitSize: 200 },
	closeOnFinish: true,         // 最后一步后是否自动关闭，默认 true
	escapable: true,             // 是否允许 Esc 中止，默认 true
}
~~~

## 管理器 API

### 运行 / 控制

| 方法 | 说明 |
| --- | --- |
| `run(input, options?)` | 运行链对象 / 步骤数组 / 已注册 id；返回 this |
| `preview(input, options?)` | 预览模式：最后一步不自动关闭，只发 preview-end |
| `next()` | 程序化进入下一步 |
| `goto(index)` | 跳到指定步骤（编辑器单步调试） |
| `stop(reason?)` | 中止并隐藏 |
| `finish(reason?)` | 直接结束并触发 finish 事件 |
| `isActive` / `isVisible` | 是否运行中 / 是否可见 |
| `taskChain` | 底层 HelperTaskChain（高级用法） |

### 热更新 / 编辑

| 方法 | 说明 |
| --- | --- |
| `updateCurrent(patch)` | 合并当前步骤字段（改文案、改高亮、拖拽后改 position） |
| `replaceCurrent(step)` | 整体替换当前步骤 |
| `setStep(index, step)` | 替换指定步骤 |
| `setSteps(steps)` | 替换全部步骤 |
| `currentStep` | 当前步骤的序列化副本 |
| `getState()` | 状态快照：index / total / rect / position 等 |

### 导入导出 / 注册表

| 方法 | 说明 |
| --- | --- |
| `export()` | 导出序列化后的链（不可序列化字段会被丢弃并打印 warning） |
| `serialize()` | 导出并返回 warning 列表 |
| `importChain(input)` | 校验并克隆一条链，不运行 |
| `registerChain(chain)` | 注册带 id 的链，之后可 `run(id)` |
| `unregisterChain(id)` | 注销 |
| `getChain(id)` | 取注册链的克隆 |
| `listChains()` | 列出 { id, name, steps } |

### 事件

~~~ts
const off = whichWayHelper.on("ready", payload => {
	console.log(payload.index, payload.rect, payload.position);
});
whichWayHelper.on("finish", payload => console.log(payload.reason));
off(); // 取消订阅
~~~

事件：`start` / `step` / `ready` / `layout` / `advance` / `finish` / `abort` / `update` / `preview-end`。

## 样式 HelperStyle

常用字段：

| 字段 | 默认 | 说明 |
| --- | --- | --- |
| `maskColor` / `maskOpacity` | #050608 / 0.72 | 遮罩颜色与不透明度 |
| `highlightColor` / `highlightWidth` / `highlightRadius` | #c94b4b / 2 / 8 | 高亮框 |
| `highlightPadding` | 8 | 高亮框内边距 |
| `portraitSize` / `portraitFit` | 176 / cover | 左侧人物图 |
| `dialogMinWidth` / `dialogMaxWidth` / `dialogMinHeight` | 320 / 760 / 136 | 右侧文字框约束 |
| `fontSize` / `lineHeight` | 自适应 / 1.65 | 正文 |
| `dialogBorderColor` | #b54242 | 右侧描边 |
| `showProgress` / `showHint` / `animation` | true | 进度 / 继续提示 / 动画 |
| `zIndex` | 2147483000 | 覆盖层层级 |

文字框使用 `width: fit-content` + min/max 宽高：短文本保持最小宽度；长文本先横向撑开，
到达 `dialogMaxWidth` 后自动换行并增高。小屏会按视口再夹小头像与文字框。

## 给可视化编辑器的对接建议

1. **数据**：编辑器内部直接维护 `HelperChain` / `HelperStep`，所有字段都定义在 types.ts。
2. **预览**：`whichWayHelper.preview(step)` 打开单步预览；`updateCurrent(patch)` 实时改。
3. **定位**：拖拽提示框结束后调用 `updateCurrent({ position: { x, y } })`，坐标是视口 px。
4. **高亮**：编辑器画框后写 `{ rect: { x, y, width, height } }`；选择真实元素则写 `{ selector }`。
5. **保存**：`whichWayHelper.serialize()` 拿清洗后的链和 warnings；`importChain()` 负责导入校验。
6. **单步调试**：`goto(index)` / `next()`；`on("ready")` 可拿到实际 rect 与提示框位置。
7. **多链管理**：`registerChain` / `listChains` / `getChain` / `unregisterChain`。

不可序列化字段（`highlight` 为元素/函数、`position` 为函数）在导出时会被丢弃并写 warning；
编辑器应优先使用选择器、矩形与对象形式的位置。

## 视觉与交互细节

- 遮罩由四块 fixed 矩形围成，洞里的真实元素仍可点击，不阻断游戏。
- 左侧方形人物图默认使用 `image/decoration/1.jpg`；框体复用 `image/ui/guide` 下的贴图。
- 右侧文字框带红描边、噪声贴图、半透明深色底；正文使用扩展字体 `dy_sjzx`。
- 点击目标后延迟 0ms 推进，让目标自身的点击逻辑先执行；下一步元素未挂载时可配 `waitFor`。
- 推进有 150ms 状态机冷却 + 管理器点击锁，避免一次点击跳过多步。
- 引擎全局 `div { position:absolute; display:inline-block; transition:all .5s }` 已在组件内逐类复位。
