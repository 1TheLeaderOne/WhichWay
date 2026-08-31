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

# 或在扩展目录内
cd packages/extension/WhichWay && pnpm build
```

- 构建使用 `vite build`（lib 模式），入口为 `extension.js`，输出目录为 `../../../apps/core/extension/WhichWay`（即 `apps/core/extension/WhichWay`），构建时清空输出目录。
- 静态资源（`audio`、`image`、`info.json`、`LICENSE`、`json`、`font`、`dynamicSkin`、`css`、`README.md`、`vedio`、`src/card/index.js`、`.gitignore`）通过 `vite-plugin-static-copy` 原样复制到输出目录，无需手动处理。
- 开发时可使用无名杀本体 `pnpm dev` 启动 vite 服务器；扩展在 vite dev server 环境下会自动进入开发者模式（`whichWayUtil.isViteDevServer()` 检测）。
- 本扩展没有独立 lint / test 脚本，代码质量检查依赖仓库根目录的 `pnpm lint`。

## 目录结构

```text
WhichWay/
├── extension.js          # 扩展入口（非 TS 入口，构建真正入口）
├── info.json             # 扩展导入信息（name/intro/author/version）
├── package.json          # @noname-extension/WhichWay 包定义
├── vite.config.ts        # 构建配置（vite lib 模式 + 静态资源复制）
├── README.md             # 使用说明（output/dev 分支说明、免责声明）
├── LICENSE               # GPL-3.0-only
├── src/                  # 源代码
│   ├── index.ts          # 一个"空壳"TS 入口（仅供参考，实际不走这里）
│   ├── init.js           # whichWayInit：按顺序加载全部模块
│   ├── whichWay.js       # 全局组件管理器 window.whichWay
│   ├── hooks/index.js    # 生命周期钩子系统（onXxx / onBeforeXxx / onAfterXxx）
│   ├── file.js           # 文件系统工具 + 路径 scheme 编译（src:/img:/audio: 等）
│   ├── utill.js          # 工具函数（配置读写、开发者模式、颜色、音频播放等）
│   ├── version.js        # 版本管理与兼容性检查
│   ├── globalSave/index.js  # 全局存储 window.whichWaySave
│   ├── packs/            # ★新式武将包系统（推荐新干员写这里）
│   │   ├── index.ts      # WhichWayPackManager：扫描/注册角色包
│   │   ├── hooks.ts      # packHooks：character/skill/translate 等注册钩子
│   │   └── character/*mrfz/  # 新式单干员目录（index.ts / index.js + 可选 Vue 组件）
│   ├── character/        # 旧式武将包系统（历史遗留，仍在使用）
│   │   ├── index.js      # WhichWayCharacterPack：仅保留 initTranslate（动态翻译/势力分组）与设计者导出
│   │   ├── packs/*/*SJZX.js  # 旧式武将包文件（历史遗留，已不再加载，仅作参考）
│   │   ├── translate/    # 旧式集中翻译（历史遗留；characterName/skillsTranslate/characterTitle/characterIntro 已被新式角色文件覆盖，仅 dynamicTranslate.js 仍被 initTranslate 使用）
│   │   ├── groups.js     # 势力数据（groupData）
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
│   ├── updateLog/        # 更新日志（updateContent.txt + 展示组件）
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
  - `allCharacters` / `allSkills`：所有干员 / 技能 id 列表
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

### 初始化流程（src/init.js）

`whichWayInit()` 依序动态 import：toast → file（加载 css）→ override → nonameEx → config → videoPlayer → character/card（旧式）→ packs（新式）→ arknight → audio → skin → poptip → tips → characterCard → extCompatible → updateLog → configUI → modules，最后触发 `init` 钩子。

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

`WhichWayPackManager`（`src/packs/index.ts`）会在初始化时扫描 `src:packs/character/` 下所有 `*mrfz` 目录/文件并动态导入；`character()` 注册的角色会自动：补全立绘路径（`img:character/{name}.jpg`）、初始化 `char.whichWay` 配置、按 `pack` 字段放入对应星级包、登记进 `allCharacters`、绑定明日方舟数据（阵营/语音/tag）、处理势力与设计者。

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
- 势力 id：`{拼音}mrfz` 结尾（`src/character/groups.js` 的 `groupData`），如 `suimrfz`（岁）、`luomrfz`（罗德岛）；可通过配置"统一势力"把所有干员并入 `sjzx_group`（泰拉）。
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

- 原始数据存放于 `json/arknight/`（`character_table.json`、`charword_table.json`、`handbook_team_table.json`、`char_patch_table.json`），启动时若缺失或扩展版本变化会从 PRTS（`https://torappu.prts.wiki/gamedata/latest/excel/`）自动下载更新。
- `whichWayArknight` 提供：干员 id 映射（驶舰之向 ↔ 明日方舟）、阵营查询、语音语言查询、干员 tag 查询等。
- 每个干员注册后自动绑定 `char.whichWay.arknight`（`charId` / `camp` / `avaiableLangs` / `tags`）。

## 语音 / 皮肤 / 模组

- 语音（`src/audio/`）：优先使用本地 `audio/` 资源；也可在线从 PRTS 播放（`whichWayWebPlay`），支持多语言（默认 CN_MANDARIN、JP 可选），可"一键下载缺失配音"。
- 皮肤（`src/skin/`）：静态皮肤存 `image/skin/`，动态皮肤走 `dynamicSkin/` + spine（`lib/spine-player.js`）；有皮肤冲突检测与皮肤数据自动更新。
- 干员模组（`src/modules/`）：数据在 `src/modules/data.js`，对应 `image/modules/` 下的证章图片。

## 技能 / 卡牌语法

遵循仓库根 `docs/` 与根 `AGENTS.md` 的规范：

- **技能**：标准 `lib.skill` 对象（`trigger` / `filter` / `cost` / `content` / `subSkill` / `mod` / `ai` 等），推荐 `async content(event, trigger, player)` 写法（Async Content），避免旧式 `"step 0"` 写法。
- **事件方法**：推荐对象参数写法，如 `player.damage({ source, num, nature })`、`player.draw(2)` 等（见 `docs/player-event-object-parameters.md`）。
- **卡牌**：`src/card/index.js` 使用 `game.import("card", function (lib, game, ui, get, ai, _status) {...})` 定义卡牌包，`card` 字段为 `{ id: { image, type, enable, content, ai } }`。
- 常用全局对象从 `"noname"` 导入：`import { lib, game, ui, get, ai, _status } from "noname";`。
- 本扩展特有工具：`whichWayUtil`（配置/颜色/音频等）、`whichWayTips`（卡牌提示）、`whichWayToast`（提示框）、`whichWayFile`（文件与路径）。

## 类型系统（typings/）

- `typings/` 下提供全局类型声明：`WhichWayCharacter` / `WhichWayCharacterPending` / `ExtendedSkill` / `WhichWayCharConfig` / `WhichWay`（window）/ `whichWayConfig` / 钩子注册类型等，编写 TS 时可直接使用。
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
