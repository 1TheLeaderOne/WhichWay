# AGENTS.md - WhichWay（驶舰之向）扩展指南

本文档为在 **WhichWay（驶舰之向）** 扩展仓库中进行编码的 agent 提供指导。阅读前建议先阅读仓库根目录的 `AGENTS.md`（无名杀项目总体规范）与 `docs/` 目录（技能/卡牌/事件语法），本文件只描述本扩展特有的事实与约定。

## 扩展概述

WhichWay（驶舰之向）是 [无名杀（noname）](https://github.com/libnoname/noname) 的**明日方舟同人武将扩展**，为游戏添加大量《明日方舟》干员（角色、技能、卡牌、语音、皮肤、动态皮肤、干员模组等）。

- 扩展名（导入名）：`WhichWay`（真实名字，非"驶舰之向"）
- 中文显示名：驶舰之向（`lib.translate.extension_WhichWay = "驶舰之向"`）
- 作者：TheLeaderOne（仓库：https://github.com/1TheLeaderOne/WhichWay ）
- 许可证：GPL-3.0-only
- 版本：`src/version.js` 中 `ext: "1.4"`（info.json 中的 `version` 字段仅为旧值，实际以 version.js 为准）
- 开发分支：`dev`（手动打包）；发布分支：`output`（直接导入无名杀）
- 环境要求：无名杀本体推荐版本 `1.11.5.1`、最低 `1.11.5.1`（见 `src/version.js`），低于要求会弹窗并可能禁用扩展
- 设计基准：所有武将均基于 **8 人军争场** 设计，未考虑其他模式的平衡

## 构建 / 开发命令

```bash
# 构建扩展（输出到 apps/core/extension/WhichWay）
pnpm -F ./packages/extension/WhichWay build

# 监听模式构建（开发）
pnpm -F ./packages/extension/WhichWay build:watch

# 快速构建：跳过静态资源复制（仅用于验证打包结果，产物不含 audio/image/json 等）
# PowerShell: $env:WW_SKIP_STATIC_COPY="1"; npx vite build
WW_SKIP_STATIC_COPY=1 pnpm -F ./packages/extension/WhichWay build

# 或在扩展目录内
cd packages/extension/WhichWay && pnpm build
```

- 构建使用 `vite build`（lib 模式），入口为 `extension.js`，输出目录为 `../../../apps/core/extension/WhichWay`（即 `apps/core/extension/WhichWay`）。**`emptyOutDir` 必须保持 `false`**（`vite.config.ts` 内有详细注释）：产物目录同时承载 2200+ 个音频等静态资源，先清空再复制会让 `audio` 处于「部分存在」的中间状态，触发引擎 `game.tryAudio` 的 `onError` 重试死循环；而产物 JS 都带 hash，旧的残留文件不会被引用。因此构建前不必、也不要手动清空输出目录。
- **不要开启 `preserveModules`**：产物形态应为「入口 `extension.js` + `chunks/*.js`（约 25 个，其中 `packs-*.js` 是全部干员/卡牌聚合成的单个 chunk）」，而不是「一个模块一个文件」。全量复制静态资源时构建约 3~4 分钟，加 `WW_SKIP_STATIC_COPY=1` 时约 4 秒。
- 静态资源（`audio`、`image`、`info.json`、`LICENSE`、`json`、`font`、`dynamicSkin`、`css`、`README.md`、`vedio`、`src/updateLog/updateContent.txt`、`.gitignore`）通过 `vite-plugin-static-copy` 原样复制到输出目录，无需手动处理。
- `assetFileNames` 必须保持 `css/viteAutoCreateStyle[extname]`：`whichWayFile.autoLoadCSS()` 会扫描整个 `css/` 目录并按文件名注入 `<link>`，改名会导致样式重复或丢失。
- 开发时可使用无名杀本体 `pnpm dev` 启动 vite 服务器；扩展在 vite dev server 环境下会自动进入开发者模式（`whichWayUtil.isViteDevServer()` 检测）。
- **压缩策略**：`minify` 按构建模式判定——`pnpm build`（mode=production）用 esbuild 压缩，`build:watch --mode development` 不压缩以保留可读堆栈。**`esbuild.charset` 必须保持 `"utf8"`**：esbuild 默认 `ascii` 会把扩展的海量中文文本转义成 `\uXXXX`（每字 3 字节 → 6 字节），体积反而变大。
- 本扩展没有独立 lint / test 脚本，代码质量检查依赖仓库根目录的 `pnpm lint`。

### ⛔ 入口红线：`extension.js` 不得静态 import 内部模块

`extension.js` 必须用**顶层 await** 阻塞到初始化结束（宿主 `await import("/extension/WhichWay/extension.js")` 返回后会立刻同步读取扩展的 `config` / `package`，不能改成惰性启动），因此它**只允许静态 `import "noname"`**，所有 `./src/**` 一律用动态 `import()`（现状：`whichWay.js` → `globalSave/index.js` → `init.js` / `hooks/index.js` / `utill.js` / `package/index.js` → `whichWayInit()` → `developerSet()` → `whichWayHooksApi.extension()`）。

**一旦入口静态 import 了内部模块**，rollup 会把入口代码与它静态依赖中的共享模块合并进同一个 chunk；只要该 chunk 被动态 chunk 反向静态依赖，就会形成 ESM 顶层 await 死锁：

```
入口(TLA: await whichWayInit()) ──动态 import──▶ packs chunk
        ▲                                            │
        └────────────── 静态 import ─────────────────┘
```

带顶层 await 的模块 `[[AsyncEvaluation]]` 为 true，任何静态依赖它的模块都必须等它「完成」；于是入口等 `packs` 求值完、`packs` 又等入口完成 —— **双方互等，扩展加载永久挂起**（现象：控制台停在 `[WhichWayFile] Auto loaded CSS files: ...` 之后，既没有 `[WhichWay] 阶段 "x" 加载失败`，也没有 `[WhichWay] 加载完成 · 总计 xxxms`）。

> 历史实例：入口曾与 `src/version.js`（`whichWayVersion`）和 Vue 的 `_export_sfc` 被合进同一个 chunk，而 `packs` / `arknight` / `audio` / `skin-confOverride-shared` / `configUI` / `updateLog` / `launchPad` / `config-data-shared` 共 8 个动态 chunk 都静态 import 了它。

**构建后自检**（应无输出）：`chunks/` 下不应有任何 `from "./extension.js"` 反向引用。


## 目录结构

```text
WhichWay/
├── extension.js          # 扩展入口（非 TS 入口，构建真正入口；只允许静态 import "noname"，见「入口红线」）
├── info.json             # 扩展导入信息（name/intro/author/version）
├── package.json          # @noname-extension/WhichWay 包定义
├── vite.config.ts        # 构建配置（vite lib 模式 + 静态资源复制）
├── README.md             # 使用说明（output/dev 分支说明、免责声明）
├── LICENSE               # GPL-3.0-only
├── src/                  # 源代码
│   ├── index.ts          # 一个"空壳"TS 入口（仅供参考，实际不走这里）
│   ├── init.js           # whichWayInit：声明式阶段清单（deps/optional/load）
│   ├── stageLoader.js    # 阶段加载器：按 deps 拓扑波次并发执行各阶段
│   ├── whichWay.js       # 全局组件管理器 window.whichWay
│   ├── hooks/index.js    # 生命周期钩子系统（onXxx / onBeforeXxx / onAfterXxx）
│   ├── file.js           # 文件系统工具 + 路径 scheme 编译（src:/img:/audio: 等）
│   ├── utill.js          # 工具函数（配置读写、开发者模式、颜色、音频播放等）
│   ├── version.js        # 版本管理与兼容性检查
│   ├── globalSave/index.js  # 全局存储 window.whichWaySave（含干员/技能 Set 索引）
│   ├── packs/            # ★新式武将包系统（推荐新干员写这里）
│   │   ├── index.ts      # WhichWayPackManager：import.meta.glob 收集并注册角色/卡牌包
│   │   ├── hooks.ts      # packHooks：character/skill/translate 等注册钩子
│   │   └── character/*mrfz/  # 新式单干员目录（index.ts / index.js + 可选 Vue 组件）
│   ├── character/        # 旧式武将包系统（历史遗留，仍在使用）
│   │   ├── index.js      # WhichWayCharacterPack：仅保留 initTranslate（动态翻译/势力分组）与设计者导出
│   │   ├── packs/*/*SJZX.js  # 旧式武将包文件（历史遗留，已不再加载，仅作参考）
│   │   ├── translate/    # 旧式集中翻译（历史遗留；characterName/skillsTranslate/characterTitle/characterIntro 已被新式角色文件覆盖，仅 dynamicTranslate.js 仍被 initTranslate 使用）
│   │   ├── groups.js     # 势力数据（groupData：group / sort / reallyGroup / logo）
│   │   ├── characterDesigner.js # 干员设计者记录
│   │   └── extCharConfig.ts    # char.whichWay 扩展配置结构
│   ├── card/index.js     # 卡牌包（game.import("card", ...) 写法）
│   ├── arknight/         # 明日方舟数据：json 自动更新、映射表、阵营/语音查询
│   ├── audio/            # 语音系统（PRTS 在线播放 / 本地音频 / 下载对话框）
│   ├── skin/             # 皮肤系统（静态/动态皮肤、spine、冲突检测）
│   ├── modules/          # 干员模组（证章）系统
│   ├── characterCard/    # 自定制武将卡样式
│   ├── config/           # 扩展配置项定义（onConfig）
│   ├── configUI/         # 扩展内快速设置界面（Vue）
│   ├── extCompatible/    # 与其他扩展兼容（decade 十年UI / qianhuan 千幻 / skinSwitch）
│   ├── nonameEx/         # 对 noname 全局 API 的扩展（原型注入、custom 技能函数）
│   ├── override/         # 对 noname API 的覆盖管理（overrideAPI / appendHook）
│   ├── toast/            # toast 提示组件
│   ├── tips/             # 卡牌/角色提示组件（whichWayTips）
│   ├── poptip/           # poptip 组件
│   ├── updateLog/        # 更新公告 / 更新日志（updateContentCurrent.js 用 Markdown 写本版公告、markdown.js 渲染、updateContent.txt 是历史日志、updateNotice.vue 是弹出窗口）
│   ├── videoPlayer/      # 视频播放组件
│   ├── dataManager/      # 简单数据管理器（get/set/on/off）
│   └── math/             # 数学工具
├── typings/              # 全局 TS 类型声明（characterPack/arknight/config/hooks/window/js/poptip）
├── image/                # 素材：character（立绘）、skin（皮肤）、card、background、decoration 等
├── audio/                # 本地音频素材
├── css/                  # 扩展样式
├── font/                 # 字体
├── json/arknight/        # 明日方舟原始数据（character_table 等，可从 PRTS 自动更新）
├── json/cache/           # 皮肤缓存数据
├── dynamicSkin/          # 动态皮肤素材
├── vedio/                # 视频素材
├── lib/                  # 第三方库（ModuleLoader.js、spine-player.js）
└── test/                 # 测试脚本（test.ts）
```

## 核心架构

### 全局对象

- `window.whichWay`（`src/whichWay.js`）：全局组件管理器，`window.whichWay.register(name, component)` 注册各子系统；注册了 `file`、`util`、`hooks`、`version`、`packManager`、`characterPack`、`arknight`、`skin`、`audio`、`modules`、`extCompatible`、`dataManager` 等组件。
- `window.whichWaySave`（`src/globalSave/index.js`）：全局存储，关键字段：
  - `allCharacters` / `allSkills`：所有干员 / 技能 id 列表（**顺序有意义**，明日方舟译名反查按注册顺序取首个命中者，不要重排/重建这两个数组）
  - `hasChar(name)` / `hasSkill(name)`：成员判断统一走这两个方法（内部是 Set 索引，O(1)）。**不要再用 `allCharacters.includes(...)` / `allSkills.includes(...)`**——那是 O(n) 线性扫描，且常出现在「每个干员 × 每个技能」的循环里。
  - `skinConfig` / `audioConfig`：皮肤与语音配置
  - `dycSave`：动态皮肤存储
  - `customFucSave`：自定义函数全局存储（如吉占相关）
  - `tmpSave`：技能临时数据"垃圾桶"
- 开发者模式下会额外暴露 `window.whichWayHooks`、`window.whichWayXxx`（各模块单例）等调试对象。

### 生命周期钩子（src/hooks/index.js）

扩展通过 `WhichWayHooks` 注册生命周期钩子，支持 `onXxx` / `onBeforeXxx` / `onAfterXxx` 三种时机，优先级 `priority` 越大越先执行：

```js
import { onContent, onConfig } from "./hooks/index.js";

onContent({
	name: "example_hook",
	priority: 0,
	fn: () => { /* ... */ },
});

onConfig({
	name: "example_config",
	obj: { name: "exampleConfig", options: { name: "示例配置", init: true } },
});
```

可用钩子阶段：`extension`、`arenaReady`、`prepare`、`precontent`、`content(config, pack)`、`config`（合并配置，特殊）、`init(packs)`、`character(pack)`、`setDev`。

### 初始化流程（src/init.js + src/stageLoader.js）

`whichWayInit()` 把各阶段写成声明式数组（`{ name, deps?, optional?, load }`）交给 `runStages()`，由它按 `deps` 做拓扑波次并发执行，无依赖的阶段同时发起模块请求；所有阶段完成后才触发 `init` 钩子（`whichWayHooksApi.init()`），因为各模块是在**顶层**注册 onBeforeInit/onInit 钩子、把内容缓冲进 packHooks 的，提前跑 init 会漏掉注册。

阶段清单（`deps` 为运行时注册类依赖；模块间静态 import 的顺序由打包器保证，无需在此声明）：
`toast / file / override / nonameEx / config / videoPlayer / base(配置) / arknight / audio / skin / poptip / tips / characterCard / extCompatible / updateLog / configUI / modules / packs(新) / launchPad(启动页美化，optional)`，其中 `css` 声明 `deps: ["file"]`（要读 `file` 阶段注册到 `window.whichWay.file` 上的实例）。

修改该清单时的要点：
- 新增阶段若依赖「另一个阶段在运行时注册的对象」（如 `window.whichWay.xxx`），必须写进 `deps`；仅靠模块 import 关系是不够的。
- `optional: true` 表示该阶段失败只打日志、不阻断整体（如启动页美化）。默认失败会向上抛出，由宿主提示是否关闭扩展。
- 加载耗时会以折叠表输出到控制台（`[WhichWay] 加载完成 · 总计 xxx ms`），可据此定位阶段瓶颈。

## 武将包（角色注册）

有两种并存的方式，**新干员推荐使用新式**。

### 新式（推荐，src/packs/）

1. 在 `src/packs/character/` 下新建目录 `{拼音名}mrfz/`，内含 `index.ts`（或 `.js`）。
2. 使用 `src/packs/hooks.ts` 导出的注册函数：

```ts
import { character, characterIntro, characterTitle, skill, translate } from "../../hooks.ts";

character("beiluoneimrfz", {
	hp: 4,
	group: "xumrfz",
	pack: "legendSJZX", // 星级包名
	skills: ["huozhimrfz", "qingsuanmrfz"],
	sex: "male",
});

characterTitle("beiluoneimrfz", "<font color = 'blue'>贝洛内家的家主</font>");
characterIntro("beiluoneimrfz", "……干员介绍……");

translate({ beiluoneimrfz: "贝洛内", huozhimrfz: "货殖", huozhimrfz_info: "……" });

skill({ huozhimrfz: { /* lib.skill 标准技能对象 */ } });
```

3. 其余可用的注册函数：`characterReplace`（角色替换）、`dynamicTranslate`（动态翻译）。

`WhichWayPackManager`（`src/packs/index.ts`）用 `import.meta.glob("./character/*mrfz.{ts,js}")` 与 `import.meta.glob("./character/*mrfz/index.{ts,js}")`（`card/` 同构）在**构建期**确定模块清单：新增干员/卡牌仍然是「丢文件即可」，无需改任何代码，但必须重新 `build`。这些模块在 `packs/index.ts` 被 import 时（即 `packs(新)` 阶段）全部求值，并被 rollup 合并进**单个 chunk**（`chunks/packs-*.js`），因此启动期不再有 267 次模块请求。

> ⚠️ 性能红线：干员/卡牌模块的**顶层只允许调用 packHooks 的注册函数（`character()` / `skill()` / `translate()` / `characterTitle()` / `characterIntro()` / `card()` 等）做缓冲**，不得调用其它有副作用的 API、也不要读 `window.whichWaySave` 里由武将包填充的内容（如 `allCharacters`）——它们在 `register()` 之前就可能被执行。落库统一由 `onBeforeInit`（`pendingRun` 刷新）完成。

`character()` 注册的角色会自动：补全立绘路径（`img:character/{name}.jpg`）、初始化 `char.whichWay` 配置、按 `pack` 字段放入对应星级包、登记进 `allCharacters`、绑定明日方舟数据（阵营/语音/tag）、处理势力与设计者。

### 旧式（src/character/packs/）

- 文件位置：`src/character/packs/{epic|legend|especial|plot|special|rare|mediocre|normal}/{包名}SJZX.js`
- 文件 `export default { character: {...}, skill: {...}, translate: {...} }`，由 `WhichWayCharacterPack` 扫描加载后 `game.import("character", ...)`。

### 星级包（SJZX）

| 包名 | 星级/类型 |
| --- | --- |
| `legendSJZX` | 6星 |
| `epicSJZX` | 5星 |
| `rareSJZX` | 4星 |
| `normalSJZX` | 3星 |
| `especialSJZX` | 2星 |
| `mediocreSJZX` | 1星 |
| `plotSJZX` | 剧情干员 |
| `specialSJZX` | 特殊干员（默认） |

## 命名约定（本扩展特有）

- 干员 id：`{拼音/英文}mrfz` 结尾，如 `beiluoneimrfz`、`keluxiermrfz`、`wangmrfz`。
- 技能 id：`{拼音}mrfz` 结尾，如 `huozhimrfz`、`qingsuanmrfz`；子技能按引擎规则 `技能名_子技能名`。
- 势力 id：`{拼音}mrfz` 结尾（`src/packs/base/groups.js` 的 `groupData`），如 `suimrfz`（岁）、`luomrfz`（罗德岛）；可通过配置"统一势力"把所有干员并入 `sjzx_group`（泰拉）。`groupData` 的每一项还要写 `reallyGroup`（该势力在明日方舟里的真实势力 id，用于映射阵营）与 `logo`（图标名，取 `image/camplogo/arknight/<logo>.png`，**默认就是真实势力名**）；`CharacterCard` 取势力图标时默认用这里的配置，`getGroupData(group, reallyGroup)` 负责查表（"统一势力"下 group 已变成 `sjzx_group`，靠 reallyGroup 兜底）。还可写 `filter`（图标是否反色，对应 `.arknightCamp` 的 `filter: invert(1)`）：配了就按它，不配才沿用原流程（明日方舟图标反色、`noname/name_*.png` 不反色）。
- 卡牌 id：`{拼音}mrfz` 或 `{拼音}mrfzCard` 结尾，图片放 `image/card/`。
- 干员立绘：`image/character/{干员id}.jpg`；皮肤图片在 `image/skin/{干员id}/`。

## 路径 scheme（src/file.js）

`whichWayFile.compilePath()` 支持扩展内路径前缀，写代码时优先使用：

- `src:` → 扩展根 `src/`
- `img:` → `image/`（干员立绘 `img:character/{id}.jpg`）
- `skin:` → `image/skin/`
- `bg:` → `image/background/`、`dec:` → `image/decoration/`
- `json:` → `json/`（明日方舟数据 `json:arknight/`）
- `audio:` → `audio/`、`video:` → `vedio/`
- `css:` → `css/`、`ui:` → `image/ui/`
- `dyc:` → `dynamicSkin/illust/`、`mod:` → `image/modules/`

## 明日方舟数据（src/arknight/）

- 原始数据存放于 `json/arknight/`（`character_table.json` ≈7.5MB、`charword_table.json` ≈8.1MB、`handbook_team_table.json`、`char_patch_table.json`），启动时若缺失或扩展版本变化会从 PRTS（`https://torappu.prts.wiki/gamedata/latest/excel/`）自动下载更新。
- **一键更新（打包/离线用）**：`scripts/update-arknight-data.bat`（与 `updateArknigtData()` 同一清单与地址）—— 下到 `%TEMP%` → node 校验（JSON 合法性 + 扩展实际读取的字段）→ 与已装数据比对 → **全部通过才写入** `json/arknight/`（校验/下载失败不动仓库），随后同步到已构建的扩展并删掉 `json/cache/arknight.json` 让精简缓存重建。选项：`--check`（只下载比对不写）、`--source-only`（跳过产物同步）、`--url <base>`（换镜像）、`--no-pause`。两个坑：curl 必须带 `--ssl-no-revoke`（本机 schannel 吊销检查会报 `CRYPT_E_REVOCATION_OFFLINE`）；bat 里内联的 node 脚本**不能出现 `!`**（delayed expansion 会把它吞掉）**与 `&`**（cmd 会当作命令分隔符拆行）。
- **精简缓存（性能红线）**：全量数据共约 16MB，启动期读盘 + `JSON.parse` 会长时间占住主线程（实测约 650ms 的同步块）。因此 `loadArknightData()` 改为两级：
  - **快路径**：读 `json/cache/arknight.json`（实测约 **153KB**），完全不触碰 `json/arknight/` 全量文件；
  - **慢路径**（首次启动 / 扩展版本变化 / `slimCacheSchema` 变化 / 本次下载过数据）：读全量 → 按 `slimArknightData()` 白名单裁剪 → 写回缓存。
  - ⚠️ **新增对这三张表的字段读取时，必须三处同步**：`slimArknightData()` 白名单、`typings/arknight.d.ts` 的 `*Slim` 类型、`WhichWayArknight.slimCacheSchema`（+1 让老缓存失效）。只改读取代码会导致精简缓存静默缺字段。
  - `handbook_team_table` 零运行时引用，既在 `loadSkipFiles` 里跳过读取，也不进精简缓存。
- `whichWayArknight` 提供：干员 id 映射（驶舰之向 ↔ 明日方舟）、阵营查询、语音语言查询、干员 tag 查询等。
- `char.whichWay`（{@link WhichWayCharConfig}）的**每个字段都可由武将包自定义**：`supportingEquipment` / `designer` / `reallyGroup` / `charId` / `linkage` / `dieAudio` / `arknight.*`。声明过的一律保留（含显式 `false`、空数组），只补 `undefined` 的字段 —— 角色自身字段由 `initCharConfig`（`src/packs/base/extCharConfig.ts`）规整，明日方舟数据由 `initCharArknight`（`src/arknight/index.ts`）补全；`supportingEquipment` / `linkage` 缺省时分别按 tag「支援机器」与配音语言里的 `LINKAGE` 推导。
- 每个干员注册后自动绑定 `char.whichWay.arknight`（`charId` / `camp` / `avaiableLangs` / `tags`）。

## 语音 / 皮肤 / 模组

- 语音（`src/audio/`）：优先使用本地 `audio/` 资源；也可在线从 PRTS 播放（`whichWayWebPlay`），支持多语言（默认 CN_MANDARIN、JP 可选），可"一键下载缺失配音"。
- ⛔ **不要移除 `game.playAudio` 的 onError 熔断钩子**（`src/audio/index.ts` 的 `override()` 末尾）：引擎 `game.tryAudio` 里 `refresh` 只由 `onCanPlay` 置真且**永不复位**，一旦某条音频成功加载过，之后**任何一次** `onError` 都会让它把候选列表重新填满再随机播一条 ⇒ 「一句配音播完又随机播另一句、永不停止」，且**候选只剩一条也会循环**（单条反复失败同样成立）。唯一出口就是 `game.playAudio` 的 `onError`，所以扩展在那里把错误回调换成 `wrapSkillAudioError`（默认 0 次重试：失败即静默并打印一次详情）。`skillAudioErrorRetry` 保留为可调常量，改 1 即"失败后允许重试一次"。
- 该熔断只作用于**扩展自己的语音**：`isOwnAudioPath()` 会归一化 `ext:WhichWay/…`、`extension/WhichWay/…`、`../extension/WhichWay/…` 与带资源前缀的形态后再判定；背景乐、本体音效、其它扩展的音频一律透传。**该钩子必须是同步函数**（`appendHook` 的同步包装层用 `beforeResult === false` / 数组替换参数，async 会让两种语义同时失效）。
- 交回引擎的本地候选由 `filterExistingAudio()` 收成**一条**（优先挑磁盘存在项），阵亡语音的 `char.dieAudios` 必须写成 `ext:WhichWay/audio/{语言}/die/{干员}.mp3` 形态——`game.playAudio` 只认 `blob:/data:/ext:/db:`，其它写法会被前置 `audio/` 导致必然 404。
- 皮肤（`src/skin/`）：静态皮肤存 `image/skin/`，动态皮肤走 `dynamicSkin/` + spine（`lib/spine-player.js`）；有皮肤冲突检测与皮肤数据自动更新。
- 干员模组（`src/modules/`）：数据在 `src/modules/data.js`，对应 `image/modules/` 下的证章图片。

## 技能 / 卡牌语法

遵循仓库根 `docs/` 与根 `AGENTS.md` 的规范：

- **技能**：标准 `lib.skill` 对象（`trigger` / `filter` / `cost` / `content` / `subSkill` / `mod` / `ai` 等），推荐 `async content(event, trigger, player)` 写法（Async Content），避免旧式 `"step 0"` 写法。
- **事件方法**：推荐对象参数写法，如 `player.damage({ source, num, nature })`、`player.draw(2)` 等（见 `docs/player-event-object-parameters.md`）。
- **卡牌**：`src/card/index.js` 使用 `game.import("card", function (lib, game, ui, get, ai, _status) {...})` 定义卡牌包，`card` 字段为 `{ id: { image, type, enable, content, ai } }`。
- 常用全局对象从 `"noname"` 导入：`import { lib, game, ui, get, ai, _status } from "noname";`。
- 本扩展特有工具：`whichWayUtil`（配置/颜色/音频等）、`whichWayTips`（卡牌提示）、`whichWayToast`（提示框）、`whichWayFile`（文件与路径）。

### 假牌选牌（`player.chooseFakeCard`）

需要「让玩家从一组给定的牌里挑选，而这些牌并不真的属于玩家」时用它（例：神赐、从牌堆顶的若干牌中选一张）。它把传入的每张牌复制成**假牌**直接置入玩家手牌，不触发任何获得事件：

```js
const cards = player.getCards("h"); // 也可以是 VCard 数组、牌堆顶的牌等
const result = await player
	.chooseFakeCard({ cards, selectCard: 1, prompt: "请选择一张手牌" })
	.forResult();
// result.cards 是玩家选中的**假牌**（与本体 result 语义一致，选完即被删除）
// result.links 才是它们对应的原牌（Card / VCard）；未选择时 result.bool 为 false
```

- 实现位置：`src/nonameEx/library/element/player.js`（`PlayerExt.chooseFakeCard` 事件工厂）+ `src/nonameEx/library/element/content.js`（`ContentExt.chooseFakeCard` 单段 content + 私有折叠助手 `foldRealHand`），类型声明见 `typings/noname/Player.d.ts`（`ChooseFakeCardParams` / `ChooseFakeCardResult` 两个全局类型别名同在该文件）。
- **只收一个参数对象，字段与本体 `chooseCard` 的 `EventChooseCardParams` 一致，另外多一个必填的 `cards`**：`selectCard` / `filterCard` / `ai` / `forced` / `prompt` / `prompt2` / `promptx` / `complexCard` / `complexSelect` / `allowChooseAll` / `filterOk` / `hsskill` / `glow_result` / `tagName` 等。`position` 会被忽略（内部固定 `"s"`，即假牌所在的特殊区）；`tagName` 是假牌 gaintag 的显示名（临时写进 `lib.translate`，选完还原，默认取事件名，常传技能名，这样牌面上显示技能的中文名）。参数对象会被 `Object.assign` 到事件上，因此仍可链式 `.set(...)` 覆盖或追加。
- 选择期间真实手牌被折叠成只露左边缘的重叠条，假牌按正常间距平铺；「悬停 / 点选展开被折叠的牌」由引擎原生的 `ui.getSpreadOffset` 提供，**不要自己实现展开**，也不要改 `lib.config.spread_card`。
- ⛔ **临时牌必须用 `directgains`（带 gaintag）而不是 `directgain`**：前者给牌加 `glows`、归入「特殊区」（配合 `position: "s"`），因此 `countCards("h")` / 手牌上限 / 弃牌结算都看不到假牌；`directgain` 会把临时牌算成真手牌，污染手牌数与弃牌逻辑。
- ⛔ **不要把真牌挪出 `node.handcards1/2`**：`getCards("h"/"s")` 直接读这两个容器的子节点，挪出去会让游戏逻辑看不到手牌。折叠只允许「在两个容器之间移动真牌 + 调整 `#handcards1` 的宽度」，两个容器同属 `node.handcards1/2`，因此移动不影响逻辑。
- 折叠是**借引擎自己的折叠能力**：把真牌集中到 `handcards1` 并收窄该容器，`ui.updatehl` 会按 `offset = min(112, (容器宽度 - 128) / (张数 - 1))` 自动压出重叠条（`offset < 32` 会被夹到 32 并加 `scrollh`，所以目标取略大于 32）。期间只临时置位 `lib.config.fold_card`（运行期值，**绝不 `game.saveConfig` 写回配置**），并在 `finally` 中复原容器宽度、配置与每张真牌的原容器。
- 已知降级：`single-handcard` 布局（`mobile` / `long` / `long2` / `nova`）下 `#handcards2` 被隐藏，且 `directgains` 也会把假牌放进 `handcards1`，无法做到「只折真牌」，此时降级为整行折叠。
- `createFakeCards` 用源牌的 `cardid` 作为 `_cardid`，而 `deleteFakeCards` 只清理 `_cardid` 为真的假牌；VCard 可能没有 `cardid`，因此 content 里会对缺失者补一个合成 id，否则假牌会残留在手牌里。

### 角色+选项同屏选择（`player.chooseTargetControl`）

需要"选一名角色，同时选一项"时用它（`chooseTarget` + `chooseControl` 的结合）：

```js
const result = await player
	.chooseTargetControl({
		filterTarget: (card, player, target) => target != player,
		selectTarget: 1,
		prompt: "选择一名角色，再选择一项",
		//controls 也可写成函数，选项区会随已选目标动态重绘
		controls: targets => (targets[0]?.countCards("h") > 0 ? ["弃置其一张牌", "令其摸一张牌"] : ["令其摸一张牌"]),
	})
	.forResult();
if (result.bool) {
	// result.targets[0] 为选中的角色，result.control 为选中的选项，result.index 为其下标
}
```

- 实现位置：`src/nonameEx/library/element/player.js`（`PlayerExt.chooseTargetControl` 事件工厂）+ `src/nonameEx/library/element/content.js`（`ContentExt.chooseTargetControl` 单段 content），类型声明见 `typings/noname/Player.d.ts`（`ChooseTargetControlParams` / `ChooseTargetControlResult`）。
- 参数为**单一对象**：`filterTarget` / `selectTarget` / `filterOk` / `ai` / `forced` / `hsskill`（与本体 `chooseTarget` 一致）+ 选项相关的 `controls`（可为 `(targets) => string[]`）/ `choiceList` / `controlAi` + `prompt` / `prompt2`。
- 结果：`bool`（**同时**选中目标与选项才为 true）、`targets`、`control`、`index`、`confirm`。**目标已选但未选选项（或取消）时 `targets` 仍会保留**，用于区分"完全没选人"与"选了人没选项"；目标本身未选/取消时 `targets` 为空数组；`"cancel2"` 视为取消。
- ⛔ **不要复用 `ui.click.dialogcontrol` 处理选项条目**：它（`apps/core/noname/ui/click/index.js`）会直接写 `_status.event.result` 并无条件 `game.resume()`，会把暂停中的目标选择提前结束、结果还缺 `bool/targets`。本实现用自建 click 处理器：只记录选项、刷新选中态，绝不写 result / 不 resume。
- 同屏与联动原理：把自建对话框作为 `dialog` 交给引擎的 `chooseTarget` 托管（引擎工厂会据此把 `prompt` 置 false，跳过自建提示与 promptbar，但仍负责 AI / 在线 / 多端、`selectTarget` 范围门控与收尾关框）；选项区随目标刷新则挂在**子事件**的 `custom.add.target` 上（引擎在每次目标点选 / `game.check()` 后都会调用它）。取消时 `game.uncheck()` 会清空 `ui.selected.targets`，所以刷新回调里要**留档已选目标**，否则拿不到"选了谁"。
- 已知限制：在线（多端）场景下选项区只在主机侧渲染，客机端暂不支持选项选择（与本体 `chooseCardTarget` 的差异）；`controls` 为空时视为"没有可选项"，`bool` 恒为 false。

## 类型系统（typings/）

- `typings/` 下提供全局类型声明：`WhichWayCharacter`（**声明态**：武将包里写的角色数据，`whichWay` / `pack` / `designer` 均可缺省）/ `WhichWayCharacterInitialized`（`initCharConfig()` 之后的初始化态，`whichWay` / `pack` 必定存在）/ `WhichWayCharConfig`（`char.whichWay`，声明时每个字段都可自定义）/ `ExtendedSkill` / `WhichWay`（window）/ `whichWayConfig` / 钩子注册类型 / `ChooseFakeCardParams`·`ChooseFakeCardResult`（`player.chooseFakeCard()`）/ `ChooseTargetControlParams`·`ChooseTargetControlResult`（`player.chooseTargetControl()`）等，编写 TS 时可直接使用。
- `typings/noname/` 下是对 noname 本体接口的模块增强，与 `src/nonameEx/` 的目录一一对应：`Game.d.ts`（对应 `nonameEx/game/`）、`Get.d.ts`（对应 `nonameEx/get/`）、`Card.d.ts` / `Player.d.ts` / `GameEvent.d.ts`（对应 `nonameEx/library/element/`）。`nonameEx/library/element/content.js` 里的 content 函数**不需要**声明：本体的 `lib.element.content` 本身就是 `Record<string, ContentFuncByAll | ContentFuncsByAll>`，任何键都能通过。
- ⚠️ 给 `nonameEx/` 下的类新增方法后，记得在对应的 `typings/noname/*.d.ts` 里补声明，否则调用处只能拿到 `any`（`content.js` 除外，见上一条）。`typings/extNonameClass/` 是早期的同类模块增强目录（如 `Character.whichWay`），新声明请统一放 `typings/noname/`。
- ⚠️ **凡是为无名杀类（Player / Card / GameEvent / Game / Get / 内置原型等）新增的扩展函数，都必须在 `typings/noname/` 下对应文件里写类型声明并配 JSDoc 注释**：`player.js` → `Player.d.ts`、`card.js` → `Card.d.ts`、`gameEvent.js` → `GameEvent.d.ts`、`game/index.js` → `Game.d.ts`、`get/index.js` → `Get.d.ts`、`jsExt/ArrayExt.js`·`jsExt/HTMLDivElementExt.js` → `typings/js.d.ts`。注释要写清"做什么、参数含义、返回值形态、注意事项/已知限制"，参数与结果复杂时提供 `@example` 与独立类型别名（如 `ChooseTargetControlParams` / `ChooseTargetControlResult`）。新增后可用"源码方法名 vs typings 文件名"逐条对账命令自查漏项。
- ⚠️ 在 `ui.control`（`#control`）里放自定义按钮（`ui.create.control(...)`）时：条目点击走 `ui.click.control`，它会**直接写 `_status.event.result` 并无条件 `game.resume()`** —— 想把点击当"记录选择"用，必须把处理函数作为最后一个参数传给 `ui.create.control([...items, fn])`（引擎存进 `control.custom`，点击时以 `(link, node)` 调用并跳过默认逻辑）。另外 `Control#replace` 会保留该函数，可用于随选择动态重建条目。相关门控：`filterOk` 决定「确定」是否出现（`game/index.js`）、`event.fakeforce = true` 隐藏「取消」按钮（不影响 `forced` 对目标数下限的门控）。
- ⚠️ 自己给手牌写 `transform` 定位时（如 `chooseFakeCard` 的分组折叠）：引擎 `ui.updatehl`（`ui/index.js`）在 PC 端悬停时会把**悬停点之前的牌整体左移 `spreadLeft`、之后的整体右移 `spreadRight`**（`ui.getSpreadOffset`，受 `lib.config.spread_card` 控制）。所以**别用牌上的 `translateX` 反推引擎的折叠间距**（会被摊开偏移污染），也别让"不该跟着动的那一组"照抄牌上的 transform —— 否则鼠标一动它就会漂。要跟随悬停特效的组用牌上的 transform；不跟随的用基准位置（`下标 × 引擎间距`）。另：想禁止某张牌被点选，摘掉它的 `selectable` 即可（`ui.click.card` 见其缺失直接 return，比 `stopPropagation` 干净 —— 后者会掐掉引擎的拖拽/触摸收尾与 `_status.clicked` 复位）。
- 💬 **提示条（`src/tips/`）**：卡牌 / 角色上的 `.promptSJZX` 提示（原 `css/extension.css` 里那几条）已组件化为 `src/tips/promptSJZX.vue`，`.promptSJZX-Wrapper` 由组件渲染、样式是 scoped（优先级高于引擎的卡片样式，也不再依赖 `extension.css` 的加载顺序）。调用方**不要手写 DOM**：用 `whichWayTips.addPrompt(el, str, id?, del?, keepOnLeave?)` / `card.addPromptSJZX(str, id?)`，或 `src/tips/prompt.ts` 的 `addPromptTo(el, { id, text, type, keepOnLeave? })`（同一个宿主元素共用容器，删空自动销毁）。**卡牌提示默认「离手自动清除」**：牌离开手牌区（弃牌堆 / 装备区 / 判定区 / 牌堆 / 特殊区…）后自动清空，判定口径同引擎 `get.position` 的 `handcards`，且只在"曾经在手牌区"的牌上触发（刚生成、没进过手牌的副本不误清）；要保留传 `keepOnLeave: true`。要调外观请改那个组件，别在 `css/extension.css` 里重新定义 `.promptSJZX*`。
- 📝 **更新公告（`src/updateLog/`）**：本版公告写在 `updateContentCurrent.js` 的 `md` 字段（Markdown，渲染器是自实现的 `markdown.js`，无第三方依赖）。`player` / `cards` 是引擎按钮组的数据源，**按 `add`（新增）/ `adjust`（调整）分组**（`{ add: [], adjust: [] }`；旧的数组写法仍兼容，一律视为「新增」），小标题由「类型 + 分组」自动生成（新增干员 / 调整干员 / 新增卡牌 / 调整卡牌）。正文里用指令块 `:::player adjust`（名称 + 分组，块内每行一个条目名）可把按钮组嵌到任意位置；不写指令则按老行为自动追加到末尾。**改公告只动 `updateContentCurrent.js`**；若要新增 Markdown 语法或指令，改 `markdown.js`，并在 `updateNotice.vue`（弹窗）与 `configUI/component/updateCurrent.vue`（设置界面「更新公告」页）两处都补样式与标题 —— 两处的 `v-html` 内容不带 scoped 属性，样式必须写成 `:deep(...)`。历史日志 `updateContent.txt` 是另一套解析（`configUI/component/updateLog.vue`），与公告互不影响。
- 代码中存在较多 `@ts-ignore` / `@ts-nocheck` 与 `any`，与根项目一致允许宽松类型。

## 代码风格

沿用根 `AGENTS.md` 的规范：Tab 缩进（4 tab stops）、单引号、行尾分号、LF 换行、print width 150、文件名 kebab-case / camelCase、Vue 组件 PascalCase、类 PascalCase、函数变量 camelCase。JS 与 TS 混用，import 统一带 `.js`/`.ts` 扩展名，`@/` 别名指向 `apps/core/noname`。

## 常见任务

### 新增一名干员（新式流程）

1. 在 `src/packs/character/` 新建 `{拼音}mrfz/` 目录与 `index.ts`。
2. 用 `character()` 注册基础属性（hp/group/pack/skills/sex），`pack` 决定星级。
3. 用 `skill()` 注册技能（lib.skill 标准对象），用 `translate()` 注册角色名/技能名与 `_info` 描述。
4. 用 `characterTitle()` / `characterIntro()` 补称号与介绍。
5. 在 `image/character/` 放立绘 `{id}.jpg`；语音放 `audio/` 或依赖在线播放。
6. 若需要：在 `src/character/groups.js` 补势力、`src/character/characterDesigner.js` 补设计者、`src/modules/data.js` 补模组、`image/skin/{id}/` 补皮肤。
7. 构建并验证：`pnpm -F ./packages/extension/WhichWay build`。

### 检查是否成功导入

扩展导入依赖 `info.json` 中的 `name: "WhichWay"`。若导入失败，先检查扩展目录名是否为 `WhichWay`（提示见 info.json 的 intro）。
