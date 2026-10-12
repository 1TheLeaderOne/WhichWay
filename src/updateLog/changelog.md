# 瑰丽理想 WhichWay 更新日志

## 2026-10-12

### 岳羽由加莉 · 完善【明镜】mingjinmrfz

原 `mingjinmrfz` 只有 `audio` 空壳，现按描述实现（`src/packs/character/yueyuyoujialimrfz.ts`）：

- **触发**：`trigger.global = "changeHpAfter"`（任意角色体力值变动，覆盖 damage / recover / loseHp / gainHp）。
- **filter 自触发防护**：用 `event.getParent("mingjinmrfz_sh"|"mingjinmrfz_hf", true)` 排除【明镜】自身标记造成的体力变动（`getParent(name, true)` 未命中返回 `undefined`，命中才真值）；并检查两项是否本回合都用过（都用过则不再提示）。
- **每项每回合限一次**：用 `player.getStat("skill").mingjinmrfz_sh` / `_hf` 记次（`player.stat` 在你下个回合开始时自动重置，即"每回合限一次"），无需手动清理。
- **cost**：`chooseControl` 在可用项里选 ①/② 或 `cancel2`；`X = 发动时 player.hp` 冻结进 `cost_data`。
- **content**：`chooseTarget` 选 `[1, X]` 名存活角色（含自己），对每人 `addTempSkill("mingjinmrfz_" + key, "roundEnd")`。
- **两个标记做成独立技能**（非 subSkill，否则会常驻挂在岳羽自己身上）`mingjinmrfz_sh` / `mingjinmrfz_hf`：`charlotte + mark + intro`，`trigger.player = "damageEnd"`、`forced`，content 里先 `removeSkill` 自己（故只作用于"下次"）再 `damage({num:1})`（无来源）/ `recover({num:1})`；`roundEnd` 未触发也会自动失效（本轮）。
- 补 `mingjinmrfz_sh` / `mingjinmrfz_hf` 的 translate 名与 `_info`。

⚠️ 遗留（未改，待确认）：本角色 `character.skills` 仍写成 `["huangyaomrfz", "liequanmrfz"]`（是荒咬/猎犬，属 `hulangwanmrfz`），并未包含本文件定义的 `longjuanmrfz`/`mingjinmrfz` —— 故这两个技能当前不会出现在岳羽身上。若要生效需把技能列表改为 `["longjuanmrfz", "mingjinmrfz"]`。

构建与 `pnpm eslint` 通过（未做游戏内实测）。

## 2026-10-01

### 新增 API：`player.chooseFakeCardTarget`（假牌版选牌+选目标）

仿照本体 `chooseCardTarget` 新增一个假牌交互 API：一次交互里既选牌又选目标，区别只在于供选择的牌是**假牌**。机制完全复用 `chooseFakeCard` 的假牌生命周期（`createFakeCards` → `directgains` 置入特殊区 `"s"` → `foldRealHand` 折叠真手牌 → 委托 → `result.links` 回映射 → finally 删除假牌并复原），只是底层把委托对象从 `chooseCard` 换成本体 `chooseCardTarget`，因此目标侧 `filterTarget` / `selectTarget` / `ai1` / `ai2` 全部沿用本体语义。

- `nonameEx/library/element/player.js`
  - 新增 `chooseFakeCardTarget(params)` 工厂：参数处理对齐本体 `chooseCardTarget`（`filterTarget` 走 `get.filter(...,2)`、`selectCard`/`selectTarget` number→range、`get.evtprompt`），默认 `filterCard`/`filterTarget`=`lib.filter.all`、`ai1`=`get.unuseful2`、`ai2`=`get.attitude2`；`setContent("chooseFakeCardTarget")`。经 `patchPrototypeWhichWay` 自动注入（方法名不在本体原型上）。
- `nonameEx/library/element/content.ts`
  - 新增 `TARGET_PASSTHROUGH_KEYS`（选牌侧 + 目标侧透传键）。
  - 新增 `chooseFakeCardTarget` content：`position` 固定 `"s"`、`filterCard` 包裹为「仅本次假牌」，其余透传给 `player.chooseCardTarget`；结果保留 `inner.targets`，`result.cards` 为选中假牌、`result.links` 为其对应原牌。
- `typings/noname/Player.d.ts`
  - 新增 `ChooseFakeCardTargetParams` / `ChooseFakeCardTargetResult` 类型与 `chooseFakeCardTarget(...)` 声明（含 JSDoc + 示例）。

### 旅骨 · 奋身「视为你使用一张多目标锦囊牌」改用 `chooseFakeCardTarget`

选项二的流程从「`chooseControl` 选锦囊名 → `chooseUseTarget` 选目标」改为一次 `chooseFakeCardTarget`：把候选多目标锦囊做成假牌 `get.autoViewAs({ name })`，`selectTarget: -1` 自动选中全部合法目标、`filterTarget` 用 `player.canUse(选中的假牌, 目标)` 判定，选完对 `result.links[0]` + `result.targets` 调 `player.useCard(...)` 完成视为使用；AI 偏好保留（桃园/万箭/南蛮按敌我分布打分）。

### 旅骨 · 背水重置座浅改用 `player.refreshSkill`

`delete player.getStat("skill").zuoqianmrfz` 只清了 `stat.skill` 计数，会漏掉 `_roundcount`/`temp_ban`/`_used`/`_round`/`_block` 覆盖等状态。改用引擎官方的批量重置方法 `player.refreshSkill("zuoqianmrfz")`（`apps/core/noname/library/element/player.js:11486`，core 内 `shiming`/`jimie` 等重置技能均用此法）。

构建（`pnpm -F ./packages/extension/WhichWay build`）与 `pnpm eslint` 相关文件均通过（未做游戏内实测）。

## 2026-10-01

### 瑰丽理想 · Phase C：装备效果在战斗开局真正施加

装备属性（EquipStat）此前只存储、进战斗不生效（商店描述写了效果但战斗内无作用）。本次打通「战役层聚合 → 战斗入场参数 → 开局施加」全链路，让穿戴装备的加成在每场战斗开局落地。

- `state/campaign.ts`
  - 新增 `equipStatOf(opId)`：汇总某干员已穿戴装备的属性加成（maxHp/hujia/maxHandcard/drawStart/attackExtra/stressReduce）为一份 `EquipStat`。
  - 引入 `type EquipStat`。
- `ui/store.ts`
  - `moveTo()` 组装 `allyEquip`（干员 id → 装备加成），随 `startBattle()` 下发战斗子实例。
- `dungeon.ts`
  - `BattleInit` 增 `allyEquip?`，`SceneCard` 增 `equip?`；引入 `type EquipStat`。
  - 我方席位构建：`maxHp` 计入装备 `maxHp` 上限加成，席位携带 `equip`。
  - 开局手牌归一化 `normalize()`：起始手牌目标加上装备 `drawStart`（开局额外摸牌）。
  - 注册装备被动技能 `gloriousIdealEquip`（`mod.cardUsable` 加【杀】次数、`mod.maxHandcard` 加手牌上限，均读持有者 `brawlinfo.equip`）。
  - `gameStart`：对在场干员施加装备 `hujia`（`changeHujia`），有 `attackExtra`/`maxHandcard` 时挂装备技能。
- 说明：`stressReduce` 属战役层压力结算，不在战斗开局施加范围。

构建（`WW_SKIP_STATIC_COPY=1 pnpm -F ./packages/extension/WhichWay build`）与 `pnpm eslint` 均通过。

### 瑰丽理想 · 装备自定义效果 `effect`（与 stat 并存）

在 Phase C 的「按 stat 数值自动施加」之外，为装备增加一个可写的自定义效果钩子。

- `data/equipment.ts`
  - `EquipmentDef` 增加 `effect?: (event, player) => void`：`event` 为当前 `_status.event`，`player` 为装备持有者；在所有角色初始化完成之后、每场战斗对持有者各调用一次。
  - 与 `stat` 并存：`stat` 仍由 dungeon 自动施加（护甲/手牌/摸牌/杀次数/体力上限），`effect` 负责 stat 之外的复杂逻辑；现有 14 件装备未写 `effect`（即只走 stat 施加，行为不变）。
- `dungeon.ts`
  - `BattleInit` 增 `allyEquips?: Record<string, string[]>`（干员 → 已穿戴装备 id 列表）；`SceneCard` 增 `equipIds?: string[]`；引入 `getEquipment`。
  - `normalize()` 在血量/手牌归一化之后，对每名我方干员的每件装备 `id` 调用一次 `getEquipment(id)?.effect?.(_status.event, player)`（try 包裹，失败仅打印）。因跑在归一化之后，effect 里的 `changeHujia`/`draw`/`addSkill` 等即时且持久效果不会被覆盖。
- `ui/store.ts`
  - `moveTo()` 追加组装 `allyEquips`（读干员 `equipped`），与 `allyEquip` 一并下发。

### 瑰丽理想 · 开局初始干员「四选二 + 自由选将」

开局创建战役由「随机 3 名 WhichWay 干员」改为玩家主动选择：给出 4 名 WhichWay 候选选 2 名；并提供自由选将浏览全部可玩武将（含非 WhichWay）。

- `ui/store.ts`
  - 新增相位 `"start"` 与状态 `initialCandidates / initialPicked / initialFreeOpen / initialFreePool`；常量 `INITIAL_PICK_COUNT=2`、`INITIAL_CANDIDATE_COUNT=4`。
  - `startNew()` 不再直接建队，改为抽 4 候选进入 `"start"` 选择页。
  - 新增 `rollInitialCandidates()`（换一批）、`toggleInitialPick()`（候选/自由池通用，上限 2）、`toggleInitialFree()`（懒建全武将池）、`confirmInitialStart()`（选满 2 名才创建战役并进军营）。
  - 新增 `allSelectableCharacters()`：枚举 `lib.character`，过滤口径对齐引擎 `ui.create.characterDialog2`（跳过 boss/隐藏皮肤/禁用/封禁项，需有面板血量），作为自由选将池。
  - `goTitle()` 一并重置上述初始选择状态。
- `ui/App.vue`：注册并路由 `InitialSelectView`（phase=`start`），配 `start` 氛围背景。
- 新增 `ui/components/title/InitialSelectView.vue`：四选二候选卡 + 自由选将（搜索/滚动网格）+ 已选 chips + 出发按钮。

#### 修正：候选卡图片/名字/技能（InitialSelectView）

- 立绘框改为固定尺寸（`height:220px` + `overflow:hidden`），不再随原图大小不定；`OperatorAvatar` 填满该框、`object-fit:cover`。
- 干员名字从「绝对定位浮层」改为立绘下方的独立可见块（`.gi-init-meta`），保证始终展示姓名（原浮层依赖框高，立绘未定高时会被挤没）。
- 每张候选卡 + 自由选将行加 `📖` 按钮，点开「技能详情」浮层：头像 / 称号 / 体力上限 / 技能名+描述 / 简介，并可在浮层内直接选择该干员。技能描述按 `opIntro` 同口径去 HTML 标签后纯文本展示。

#### 重构：选将信息内联到卡片（去除弹层/冗长滚动）

上一版技能详情走「点击📖弹浮层 + 整页滚动」，过于冗长。改为把干员信息直接内联到卡片，四选二与自由选将共用同一套卡片方案。

- `ui/components/common/format.ts`
  - 新增 `opSkinPortrait(id)`：优先走驶舰之向皮肤系统 `window.whichWay.skin.getCurrentSkinPath(id)`（按玩家选定皮肤返回立绘、非 WhichWay 回退本体 img），取不到再退回 `opPortrait`。使选将立绘「适配皮肤系统」。
- `ui/components/common/OperatorAvatar.vue`
  - 增 `skin?: boolean`（默认 false）；`url` 计算按 `skin` 切换 `opSkinPortrait` / `opPortrait`。
- 新增 `ui/components/common/OperatorPickCard.vue`：内联信息卡片。
  - 左列（点击切换选中）：固定尺寸（132×168）皮肤立绘 + 选中勾角标 + 翻译名（`opName`，不显示 id）+ 体力上限。
  - 右列：`opSkills` 技能列表，**自身** `overflow-y:auto`（不撑爆整页），描述用 `v-html` 保留 `<font>` 等 HTML 富文本（不再去标签）。
- `ui/components/title/InitialSelectView.vue`
  - 移除技能浮层（`skillId/openSkills/skillPanel/plain` 及📖按钮、mask 全删）。
  - 四选二候选区与自由选将均改用 `OperatorPickCard`；打开自由选将时隐藏候选区，顶栏切换按钮变为「← 返回四选二」。
  - 自由选将列表置于 `.gi-free-scroll`（`max-height + overflow-y:auto`），滚动只作用于该容器而非整页。

构建（`WW_SKIP_STATIC_COPY=1 pnpm -F ./packages/extension/WhichWay build`）与 `pnpm eslint`（改动四文件）均通过。

### 瑰丽理想 · 选将/招募：体力护盾条 + 卡片抽象复用 + 性能与交互优化

针对选将卡片的四项改进：完整体力/护盾展示、自由选将加载优化、整卡可点、卡片抽象为可复用组件并接入「天灾信使」招募。

- `ui/components/common/format.ts`
  - `CharacterDef.hp` 兼容 `number | [number, number]`；新增 `rawHpPair()` 归一化体力/上限（缺省一方互相回填）。
  - 修正 `opMaxHp`（旧版无 `maxHp` 时错误默认 4，现按 `maxHp ?? hp ?? 4`）；新增 `opHp(id)`（初始体力值，可能小于上限）。
  - 新增 `opHpView(id)` → `{ hp, maxHp, hujia, compact }`：`compact = 上限+护盾 > 6`，决定用格子还是纯数字展示。
  - 新增图片 URL 辅助 `hpFullIcon/hpEmptyIcon/hpShieldIcon`（`image/ui/actualHp.png` / `emptyHp.png` / `shield.png`）。
- 新增 `ui/components/common/OperatorHp.vue`：体力/护盾条。常规态按上限铺 `actualHp`（满）+`emptyHp`（空）+ 按护盾数铺 `shield`（无护盾不显示）；`compact` 态改「actualHp 体力/上限 [shield 护盾]」纯数字（无护盾省略护盾段）。
- 新增 `ui/components/common/OperatorCard.vue`（替代并删除 `OperatorPickCard.vue`）：**通用干员卡片，选将与招募复用**。左列 = 皮肤立绘 + 翻译名 + `OperatorHp` + `#meta` 插槽；右列 = 技能（自身滚动、`v-html` 保留 HTML）。整卡 `@click` 即 `emit('toggle')`（`locked` 时不响应），满足「点击整个卡片即可选择」。props：`picked / locked / showCheck`（招募关角标）。
- `ui/components/title/InitialSelectView.vue`
  - 改用 `OperatorCard`。
  - **自由选将增量渲染**：`visibleFree = filteredFree.slice(0, shown)`，容器 `@scroll` 触底时 `shown += 24`，搜索/切池 `watch` 重置；不再一次性挂载上百张卡片。底部提示「已显示 N / 总数」。
- `ui/components/camp/RecruitView.vue`
  - 候选改用同一 `OperatorCard`（`:show-check=false`、整卡点击即 `acceptCandidate`、满员 `locked`），经 `#meta` 显示「点击卡片招募 · 1 级」。
  - 新增顶栏「🎲 刷新候选」按钮，`canRefresh = !ctrl.hasRecruitedToday()` 门控；无候选空态同步受限。
- `state/campaign.ts`
  - `CampaignData` 增 `recruitDay`（`createInitialCampaign` 初始化 0、`normalizeCampaign` 为旧档补默认）。
  - `acceptCandidate` 成功后写 `recruitDay = day`；新增 `hasRecruitedToday()`。因按 `day` 比较，换天自动恢复刷新能力。
- `ui/store.ts`：`rollRecruits()` 在 `hasRecruitedToday()` 时直接拦截并告警。

构建与 `pnpm eslint`（改动七文件）均通过。

### 修复：下发 BattleInit 时 DataCloneError（postMessage 拒绝 Proxy）

现象：进入战斗报 `[GloriousIdeal] 下发 BattleInit 失败 DataCloneError: ... could not be cloned`（battleHost `sendInit`）。

- 根因：`view` 为 Vue `reactive`，`view.ctrl.data.roster.find(...).equipped` 是响应式 **Proxy 数组**；`store.moveTo` 把它原样塞进 `allyEquips` 下发，而 `postMessage` 走结构化克隆，V8 **拒绝克隆 Proxy**（`Object`/`Array` 皆然）。`allyLevel/allyEquip/party/preHp` 都产出普通值，唯 `equipped` 漏了。
- `ui/store.ts`：`allyEquips` 构建改为 `[...（equipped ?? []）]`，先展开为普通字符串数组再下发。

构建与 `pnpm eslint` 均通过。

### 瑰丽理想 · 战斗内「队友手牌 / 装备」覆盖层

在真实对局（iframe 子实例 realm）内，为我方在场干员卡片挂信息面板，方便查看队友手牌与装备。

- 新增 `battleOverlay.ts`：`installBattleOverlays()`（角色初始化完成后装一次，战斗结束 `uninstall()` 还原）。
  - 引擎事实：`Player` 即 `position:absolute` 的 `HTMLDivElement`，可作绝对定位锚点；手牌 `player.getCards("h")`（`Card.name` → `get.translation` 取牌名）；暂停 `game.pause()/resume()`；`game.me` 为当前操控者。
  - **手牌面板**（卡片右侧）：仅非当前操控的我方干员显示，列最多 4 张牌名 + `…另 N 张`；点击弹「全部手牌」浮层。当前操控者（`game.me`）隐藏此面板（自己看得见手牌）。
  - **装备面板**：卡片下方（非操控者）或上方（`game.me`）显示已穿戴装备图标（`equipIds` → `getEquipment`，图标 `image/model/GloriousIdeal/equips/{img||id}.png`，`onerror` 回退默认图）；点击图标弹「全部装备 + 效果（desc）」浮层。
  - **浮层暂停**：打开时 `game.pause()`（仅当此前未暂停才记录），关闭且无其它浮层时 `game.resume()`；卸载强制关闭并恢复。
  - **动态刷新**：`lib.onphase` 每阶段刷新手牌列表；包裹 `game.swapPlayer/swapControl`，换人后 `game.me` 变更即重排（操控者手牌隐藏、装备置顶）。
  - 注入单个 `<style>`（`#gi-battle-overlay-style`），面板内普通 div 显式复位 `position:static`（规避引擎全局 `div{position:absolute}`）。
- `dungeon.ts`：`import { installBattleOverlays }`；`normalize()` 末尾（角色+手牌就位、装备 effect 之后）幂等安装 `overlays`；`finish()` 中 `overlays?.uninstall()`（先于 sideControl 卸载）。

构建、`pnpm eslint`、入口红线自检（`chunks/` 无反向 `from "./extension.js"`）均通过。

### 瑰丽理想 · 手牌覆盖层：卡背面板（手牌数 + 牌名）+ 本体 dialog 展开 + 贴边换向

- **手牌面板改为整块卡背**：面板 150×123（cardbackOL.png 原图 170×139 的比例），背景 `image/model/GloriousIdeal/ui/cardbackOL.png`，去掉原来的深色底+边框。
  - `num` 区（左下）＝**手牌数**（`player.getCards("h").length`）。
  - `Card` 区（右侧）＝**手牌牌名**（最多 4 张）：红牌（红心/方块）用红字、黑牌（黑桃/梅花）用黑字。
- **展开用本体 dialog**：`ui.create.dialog("hidden", 标题)` + `dialog.add(cards, true)` 渲染**完整卡牌**（本体的 card 按钮预设内部 `copy()`，原件不会离开角色手牌区，也避开 `init()` 的副作用）。暂停守卫抽成 `holdPause()/releasePause()` 供自建浮层与 dialog 共用；`dialogs` 记录挡住淡出期间重复点击；`uninstall()` 一并撤掉残留 dialog。
- **贴边换向**：用 `player.getBoundingClientRect().right` 与视口宽比较（阈值 `HAND_PANEL_W=150`），右侧放不下时改挂到卡片左侧。

### 瑰丽理想 · 战斗覆盖层 Vue 化（删除注入的 `<style>` 字符串）

原 `battleOverlay.ts` 靠 `injectStyle()` 往 `document.head` 塞一段 `#gi-battle-overlay-style` 字符串，可读性差且样式与结构分离。改为 Vue 组件，`battleOverlay.ts` 只剩引擎接线。

- 新增 `ui/components/battle/`：
  - `battleOverlayTypes.ts`：`HandCardView{ name, red }`、`EquipView`、`AllyOverlayState`、`EquipModalState` 与 `HAND_MAX / HAND_PANEL_W / HAND_PANEL_H` 常量。组件只吃纯数据，不碰引擎对象。
  - `BattleAllyOverlay.vue`：每个我方干员一个实例。卡背手牌面板（`num` 手牌数 + 牌名按红黑着色）与装备图标条（复用 `common/EquipIcon.vue`），点击 `emit("openHand"/"openEquip")`。
  - `BattleEquipModal.vue`：装备详情浮层，单例挂在 `document.body`，靠 `reactive` 容器 `{ equip }` 驱动显隐。
  - `BattleDialogClose.vue`：本体 dialog 里的「关闭」按钮（独立小 app 挂进 dialog 的宿主 div，定位由宿主行内样式负责）。
- `battleOverlay.ts`：删除 `injectStyle()/STYLE_ID/cardBackUrl()`；改为 `createApp(SFC, props).mount(host)` + `app.unmount()`。`refresh()` 只改 `reactive` 状态，不再动 DOM 结构；`uninstall()` 逐实例卸载 app 并移除宿主。
- 引擎全局 `div{display:inline-block;position:absolute;transition:all .5s}`（`apps/core/layout/default/layout.css:31`）对组件内部的普通流 div 是致命的，两处对抗：
  - `.gi-bvem div{position:static;transition:none}` —— 否则浮层每一行都叠在同一位置。
  - `.gi-bvo, .gi-bvo div{transition:none}` —— 覆盖层不要 0.5s 动画。
- 子 realm 没有 `ui/App.vue` 的主题变量，在覆盖层根节点上补 `--gi-line2/--gi-panel2`，`EquipIcon.vue` 才不会画成透明底（自定义属性会继承进子组件）。
- 每个干员的宿主 div 铺满卡片但设 `pointer-events:none`，面板/图标各自恢复 `auto`；否则会挡住点将。
- 样式投递链确认：vite `assetFileNames: "css/viteAutoCreateStyle[extname]"` → `src/file.js#autoLoadCSS` 扫 `css/` 全目录 → `src/init.js:55`，**每个 realm 都注入**，故战斗 iframe 能拿到 scoped CSS。

构建（`✓ built in 4.11s`，chunk `GloriousIdeal-battleOverlay-shared-*.js` 140.05 kB）、`pnpm eslint`、入口红线自检均通过；产物内 `gi-battle-overlay-style` 出现 0 次（注入样式确已消失），`gi-bvo-hand/gi-bvo-num/gi-bvo-card/gi-bvo-equips/gi-bvem-mask/gi-bvdc` 均出现在 `css/viteAutoCreateStyle.css`。**未做浏览器实测**（已知 browser MCP 无法加载 dev app），需手动验证：
1. 卡背面板上「左下手牌数 + 右侧牌名列表」落位是否与图一致，红牌红字/黑牌黑字是否正确；
2. 右侧贴边的角色面板翻到卡片左侧；
3. 点击手牌面板展开为本体 dialog 完整卡牌、对局暂停，「关闭」按钮可用且关闭后恢复；
4. 点击装备图标弹 Vue 浮层，多行不重叠、遮罩点击/✕ 均可关；
5. 覆盖层不挡点将，干员阵后面板与装备条一起隐藏，战斗结束无残留浮层。

### 瑰丽理想 · 手牌面板版式按图调整（数字移到牌背图标下方 + 牌名纵向一行一张 + 缩小贴边）

策划给出版式图，四点调整，全部落在 scoped CSS 与两个常量上，`battleOverlay.ts` 未改逻辑。

- `battleOverlayTypes.ts`：面板 `HAND_PANEL_W/H` 由 150×123 缩到 **112×92**（仍守 cardbackOL.png 的 170:139 比例）。贴边换向阈值引用同一常量，自动跟着变小。
- `BattleAllyOverlay.vue`
  - **数字位置**：卡背 PNG 自带的牌背图标在左侧约 20%~42% 宽、52%~70% 高处，故 `.gi-bvo-num` 从「左下」(`left:3%/bottom:16%`) 改为落在图标**正下方** (`left:15%; width:28%; bottom:9%`)，字号 15→13px 配合缩小的面板。
  - **牌名纵向**：`.gi-bvo-cards` 由 `flex-wrap:wrap` 网格改为 `flex-direction:column; align-items:center; justify-content:center; gap:2px`，一行一张；`.gi-bvo-card` 加 `white-space:nowrap`（长牌名如「雌雄双股剑」不换行，超出由 `overflow:hidden` 裁）。区域 `inset:6% 2% 6% 37%`，与数字列错开不重叠。
  - **贴近角色**：`.gi-bvo-hand` 的 `top:2px; margin-left:4px` → `top:0; margin-left:0`；`.is-flip` 原先为覆盖 `margin-right:4px` 而写的三条已删（无残留 margin 需要清）。
- 顺带确认：产物 `chunks/` 不 CLEAN（596 个历史 chunk 堆积，同名 `GloriousIdeal-battleOverlay-shared-*` 有 26 份），入口只引用最新 hash，属既有现象，本次未动。

构建（`✓ built in 4.96s`，chunk 140.07 kB）、`pnpm eslint` 通过；`css/viteAutoCreateStyle.css` 内已确认 `gi-bvo-hand{...top:0;margin-left:0}`、`gi-bvo-num{left:15%;bottom:9%;font-size:13px}`、`gi-bvo-cards{inset:6% 2% 6% 37%;flex-direction:column}`，chunk 内 `112` 已内联。**未做浏览器实测**，需手动验证：数字是否正好落在牌背图标下方、牌名一行一张是否被裁、缩小后 11px 牌名是否可读、面板是否紧贴卡片右缘（贴边角色是否翻到左侧且不挡将）。

### 瑰丽理想 · 展开的手牌：实时同步（详列与缩略一起）＋多窗共存语义更正

> 本节里「展开的手牌用本体 dialog（`dialog.static` 堆叠 + margin 错开）」的实现已被下一节 R10 整体替换成自建浮层；**实时同步那套（MutationObserver / handSignature / 500ms 兜底）仍然有效**，只是推给的对象从 dialog 换成面板。

策划反馈：① 摸牌后展示不更新（缩略面板和展开的 dialog 都要同步）；② 补充说明「不点关闭按钮就关不掉、能同时开好几个」**是他要的效果**，不是缺陷。

> 更正记录：上一轮我把 ② 当成两个 bug，实现了「单例 + 点外部/Esc/再点面板自动关闭」，方向反了。本轮已全部撤销，只保留同步部分。

- **实时同步**：
  - 根因——`lib.onphase` 只在**回合边界**触发，摸牌/出牌当下不刷新。而 `player.getCards("h")` 读的就是 `node.handcards1/2` 的子节点（`Player.iterableGetCards` 直接遍历这两个容器），所以给每名干员这两个容器挂 `MutationObserver({childList:true})`，变化经 `scheduleRefresh()`（微任务合并）→ `refresh()`。`game.me` 的 `handcards1` 会被挪到底部手牌栏，但**节点本身不变**，观察不受影响。
  - `refresh()` 末尾调 `syncHandDialogs()`：把手牌推给**每一扇**展开中的窗，标题同步为「XX的手牌（N）」（`dialog.setCaption`）。
  - dialog 内的卡牌重画由 `renderHandCards()` 负责：只替换 `dialog.content` 里带 `.gi-hand-box` 标记的那个 `.buttons` 容器，caption 与关闭按钮宿主不动。用 `handSignature()`（`cardid:name+number+suit` 拼接）逐窗比对，牌没变就不重建按钮。
  - 展开期间共用一个 500ms 兜底轮询（`handSyncTimer`），因为「牌面内容变化但 childList 不变」（变化类技能/临时改名）观察器看不到；最后一扇窗关掉即 `stopHandSync()` 停表。
- **多窗共存 + 只走关闭按钮**（按更正后的需求）：
  - `handDialog: HandDialog | null` 换回 `dialogs: HandDialog[]`；`closeHandDialog(rec)` 改成按记录关，`uninstall()` 遍历 `dialogs.slice()` 收尾（各自 `releasePause()`，计数型暂停天然支持多持有者）。
  - **删掉** `onOutsidePointerDown`、`onKeyDown`(Esc)、`toggleHandDialog` 三个自动关闭入口——唯一的关闭路径是窗内 Vue 小应用 `BattleDialogClose` 的「关闭」按钮。副作用是装备浮层也不再支持 Esc（遮罩点击与 ✕ 仍可用），与「只能主动关」一致。
  - 关键引擎事实：`Dialog.open()` 会遍历 `ui.dialogs`，对**非 `static`** 的已有窗调 `hide()`（`.hidden{opacity:0;pointer-events:none}`）——直接开第二扇会把第一扇隐掉。故建完窗即置 `dialog.static = true`（引擎「堆叠对话框」语义，`open()` 只对它们 `unfocus()`，而 `unfocus()` 仅在「堆叠对话框虚化」配置打开时加 `.transparent`）。注意这是**属性**，与引擎 `ui.click.count` 里的 `classList.add("static")`（纯 CSS 类）不是一回事。
  - 本体布局给 `.dialog` 写死 `top/left`（`layout/default/layout.css:1801`），多扇窗会叠在同一坐标；因此按打开顺序给窗加 `marginLeft/marginTop`（每扇 28px 阶梯）。用 margin 而非 `transform`，避开引擎拖窗用的 `transform`/`_dragtransform`。
  - 同一干员重复点面板 → 直接 return（既不叠第二扇也不关），关闭只认按钮。
- **踩过的坑**：先按引擎自己的 `ui.click.count`（点手牌数看手牌）抄了 `ui.create.handcardsContainer()` + `addCards()`，随后放弃——`.handcards-container` 的盒子样式只写在 `layout/newlayout/global.css`，而本体默认布局是 `mobile`，换布局就会退化成无 flex/无滚动的裸 div，收缩负边距会把牌叠成一团。改用每种布局都有样式的 `.buttons` 网格 + 自建变更比对。
- **另一处修正**：关 dialog 从 `dialog.delete()` 换成 `dialog.close()`。dialog 是 `open()` 过的（进了 `ui.dialogs`），只 `delete()` 会让它作为游离节点留在栈里，引擎之后 `close()` 自己的 dialog 时会拿它当栈顶 `show()` 出来。
- **已知边界**（未处理，供实测判断）：若引擎自己正开着模态窗（如技能结算的选牌框）时点开干员面板，`open()` 会把那扇隐掉；本模块的窗关掉时 `close()` 会把栈顶重新 `show()`，所以是暂时遮挡而非永久卡死。

构建（`✓ built in 2.63s`，chunk 141.48 kB）、`pnpm eslint`、入口红线自检均通过；产物内已确认 `marginLeft` 阶梯在、`"pointerdown"` 与 `Escape` 计数为 0（自动关闭确实移除）。**未做浏览器实测**，需手动验证：
1. 点甲的手牌窗不点「关闭」→ 点画面任意处、按 Esc、再点甲的面板都不关；
2. 依次点乙、丙的面板 → 三扇窗同时在屏上，且位置阶梯错开、各自标题与牌面正确；
3. 展开中让任一干员摸牌/出牌/被拆牌 → 该窗详列与其卡背缩略（牌名 + 手牌数 + 标题括号里的数）同帧变化，别的窗不受影响；
4. 逐扇点「关闭」→ 全关后对局恢复（暂停计数归零，不残留 paused），定时器停；
5. 干员阵亡/被移出 DOM 时其窗保留为空窗，等玩家自己点关闭（本轮不再自动替他关）。

### 瑰丽理想 · R10：详细手牌改自建浮层（弃用引擎 dialog）＋卡背牌名全量可滚轮

策划两点：① 点开后的详细面板**不要用 dialog 接口**（存在覆盖情况），自己写一个 UI；② 粗略展示手牌的卡背面板，牌数超出时牌名列表也要继续列出来，并**开启滚轮**。

- **① 自建详细面板**（`ui/components/battle/BattleHandPanel.vue` 新增）
  - 一块 `position:fixed` 挂 `document.body` 的浮层（宿主 div 铺在视口左上角、`width/height:0` 不占面积），标题 + 「关闭」按钮 + 滚动卡片区都由 Vue 画；`z-index:999998`（装备浮层遮罩 999999 之下）。
  - **卡牌本体仍是引擎真实牌面**：组件 `onMounted` 时把卡片区元素通过 `ready` 事件交回 `battleOverlay.ts`，那边用 `ui.create.buttons(cards, "card", box, true)` 往里出牌（预设内部 `copy()`，原件不离手牌区，皮肤/立绘照常）。空手牌由组件按 `panel.count===0` 显示「没有手牌」。
  - 定位改由自己算：`panelPos(player)` 取干员 `getBoundingClientRect()`，优先挂卡片右侧、放不下翻左侧，最后夹进视口；坐标写进 reactive 的 `x/y`，每帧 `syncHandPanels()` 重算 → 换人/布局变化自动跟随。创建时就把坐标算好，避免「从左上角滑进来」。
  - 生命周期不变：**只有面板上的「关闭」按钮能关**、支持多块共存（每名干员至多一块，重复点面板 no-op）、暂停计数 `holdPause/releasePause` 逐块收发、`uninstall()` 遍历 `panels.slice()` 收尾。
  - 于是 `ui.create.dialog` / `dialog.static` / `dialog.close()` / `setCaption()` / margin 阶梯错位这一整套**全部删掉**，`BattleDialogClose.vue` 也删了（关闭按钮现在归面板组件自己）；引擎 `ui.dialogs` 栈不再被我们碰，也就没有互相覆盖。
  - CSS 坑：全局 `div{display:inline-block;position:absolute;transition:all .5s}` 仍要复位，但**不能写 `.gi-bhp div{position:static}`**——那会连带打掉本体卡牌 `.card{position:relative}`，牌面 `.info/.range/.name` 全靠它定位。只单独复位自己的 `.gi-bhp-bar`/`.gi-bhp-cards`，面板根元素另补 `transition:none`（否则跟随时整块滑动）。
- **② 卡背牌名列表**（`BattleAllyOverlay.vue`）
  - 去掉 4 张上限：`refresh()` 里 `e.state.hand = cards.map(handView)`（原来 `slice(0, HAND_MAX)`），组件也不再 `shown = hand.slice(...)`，直接 `v-for` 全量；`HAND_MAX` 常量删除。
  - 列表 `.gi-bvo-cards`：`justify-content:center`→`flex-start`（居中时超出会两头都看不着），`overflow:hidden`→`overflow-y:auto; overflow-x:hidden`，加 `overscroll-behavior:contain` + `scrollbar-width:none` / `::-webkit-scrollbar{display:none}`（卡背面板上不show滚动条），模板挂 `@wheel.stop` 只让滚轮滚这份列表、不冒泡给引擎。

构建（`✓ built in 5.57s`，chunk 142.66 kB，入口 `GloriousIdeal-battleChild/battleHost/GloriousIdeal` 三处已引用新 hash `DEmxL_MT`）、`pnpm eslint` 退出 0、入口红线自检为空；产物 CSS 已确认 `.gi-bhp{position:fixed;transition:none;z-index:999998;...}`、`.gi-bvo-cards{...justify-content:flex-start;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none}`，chunk 内 `create.dialog` 出现次数为 0。**未做浏览器实测**，需手动验证：
1. 点干员卡背 → 右侧出现自建面板展示真实卡牌；右侧放不下（贴边干员）翻到左侧；面板不遮这张卡本身；
2. 面板开着时引擎弹自己的结算对话框 → 互不隐藏（这是本轮换掉 dialog 的目的）；
3. 连开两块以上 → 都在屏上、各贴自己的干员、标题与牌面互不串；
4. 摸牌/出牌 → 面板牌面、标题数字、卡背缩略同帧更新；换操控角色后面板跟着挪位；
5. 卡背面板牌数 >7 张时列表能滚轮上下滚，且滚动不带动对局画面/不触发引擎滚轮行为；
6. 只点「关闭」才关；全关后对局恢复（不残留暂停），战斗结束无残留面板/宿主/定时器。

### 瑰丽理想 · R11：详细手牌窗可拖动（interactjs）＋改默认居中竖版＋z-index 移到宿主

策划两点：① 详细窗要**支持拖动**（优先找现成开源库、注意开源协议），且 **z-index 得写在 `.gi-bhp` 的父元素上**才生效；② 不必贴武将展开，**默认居中**就没有边界问题；窗要**高大于宽**、且**不留多余空白**。

- **拖动用 interactjs 1.10.28**（`taye/interact.js`，**MIT**）
  - 协议核对：驶舰之向本体是 `GPL-3.0-only`，MIT 是宽松许可、可直接并入 GPL 作品，只需保留版权声明——interactjs 包内 `LICENSE` 随依赖存在，构建产物只是使用它的 API，不冲突。
  - 选型对比（都 MIT）：`vue-draggable-resizable@3.0.0` 要求传**数值** width/height，跟本轮「高度随牌数自撑」正好冲突；`vue3-draggable-resizable@1.6.5`、`draggable-resizable-vue3@1.0.94-beta` 维护度低。interactjs 只管手势、不接管布局，最贴合。
  - 安装：`pnpm -F ./packages/extension/WhichWay add interactjs` → 依赖 `@interactjs/types@1.10.28`（只作为 interactjs 的内层依赖存在，没提到顶层 `node_modules`），所以 `battleOverlay.ts` 里**不引它的类型包**，只本地声明用到的 `interface Interactable { unset(): unknown }`。
  - 接入：`bindPanelDrag(rec, shiftX)` 绑在**面板根元素**上，`allowFrom: ".gi-bhp-bar"`（只能拖标题栏，牌面区留给点牌/滚轮）、`ignoreFrom: ".gi-bhp-close"`（别把点关闭拖成移动）、`modifiers:[interact.modifiers.restrictRect({restriction:"parent"})]` 把窗夹在宿主＝视口内；`move` 里累加 `dx/dy` 写 `transform: translate(...)`。关闭时 `rec.drag?.unset()`——interactjs 的监听挂在 document 上，DOM 删掉不会自己解绑。
  - 组件 `ready` 事件多交一个元素：`(box, root)`，`HandPanel` 记录新增 `root`。标题栏 CSS 补 `cursor:move; touch-action:none`（interactjs 靠 pointer 事件，触屏不给 `touch-action:none` 会被浏览器手势抢走）。
- **z-index 位置错→对**（策划点得准）：宿主是 `position:fixed`，**fixed 元素自带层叠上下文**，宿主 `z-index:auto` 时面板自己的 `999998` 只在宿主那一层里比大小，压不过引擎对话框。现在宿主 `cssText` 为 `position:fixed;inset:0;z-index:999998;display:flex;align-items:center;justify-content:center;pointer-events:none`，`.gi-bhp` 的 z-index 删掉、改成 `pointer-events:auto`（宿主不吃点击，免得挡住对局）。
- **默认居中 + 竖版 + 去多余空间**
  - **删掉** `panelPos()`、`HandPanelState.x/y`、`HAND_VIEW_W/HAND_VIEW_H`，`syncHandPanels()` 不再每帧跟位置（窗归玩家拖）。于是「右侧放不下翻左侧」「换人后跟随挪位」这些边界逻辑一并消失。
  - 尺寸：`width:240px`（正好两张本体卡牌 104 + 左右 4 margin = 112×2，再加 6 padding 与 1 边框）、`height` 交内容自撑、`max-height:78vh` 超出给卡片区滚轮 → 4 张牌以上天然高大于宽；`padding` 10→6、`gap` 6→4，空手牌时「没有手牌」的 `margin:auto 0` 改成 `4px 0`（不再靠撑满高度居中）。
  - **多窗错位**（策划没提，但「默认居中」和「允许多块共存」碰一起会完全叠成一摞）：第 2 块起按已开窗数往右错 `28px`（上限 5 档），错开的正好是标题栏左侧，底下那扇仍然可拖可辨。不想要就把 `openHandPanel` 里的 `shiftX` 置 0。

构建（`✓ built in 3.14s`，`GloriousIdeal-battleOverlay-shared` 从 142.66 kB → **281.11 kB / gzip 77.05 kB**，涨幅就是 interactjs 的 UMD 全量包；只用拖动的话后续可按需引 `@interactjs/core` + `@interactjs/plugin-draggable` 瘦身）、`pnpm eslint` 退出 0、入口红线自检为空；产物已确认 `allowFrom:".gi-bhp-bar"`/`restrictRect`/`transform:translate()` 在、宿主串含 `z-index:999998` 而 CSS 里 `.gi-bhp{position:relative;...;pointer-events:auto}` **不含** z-index。另外单独跑 `tsc` 校验过 interactjs 的类型解析与 `esModuleInterop` 默认导入（临时文件已删）。**未做浏览器实测**，需手动验证：
1. 点卡背 → 窗出现在**视口正中**（不贴武将），4 张牌时高大于宽、牌数少时窗跟着变矮不留空白；
2. 拖标题栏能挪动，拖牌面区不动；拖到屏幕边缘被夹住、出不去；点「关闭」不会被误判成拖动；
3. 引擎弹自己的结算对话框/装备浮层时，手牌窗仍在其上（z-index 生效）；反过来手牌窗也压得住对局；
4. 摸牌/出牌 → 窗内牌面、标题数字、卡背缩略仍实时同步（拖动后位置不受刷新影响，不会跳回中间）；
5. 连开两扇 → 第二扇往右错开、两扇标题栏都露得出来，各自独立拖动、独立关闭；
6. 全部关闭后对局恢复（暂停计数归零），战斗结束 `uninstall` 无残留面板/宿主，拖动监听 `unset` 后不再响应已消失的窗。

### 瑰丽理想 · Phase D（R12）：掉落层 + 障碍/宝箱交互 + 撤退与结算页

策划案 Phase D：`generateDungeon` 补 obstacle/treasure 产出、战斗依胜负与难度发消耗品/兑换物/装备、撤退按「全员阵亡丢弃、有存活带回」处理。数值口径由用户明确给定，其余按策划案占位（下面逐条标了哪些是**待平衡**）。

- **`data/loot.ts`（新增，掉落层全在这里）**
  - 装备掉落**两段式**：先判「掉不掉装备」（基础概率 `EQUIP_DROP_BASE_CHANCE = 0.1`），掉了再抽品级。API：`addEquipDropChance(delta)` 累加、`equipDropChance()` 读当前值（夹在 0~1）、`resetEquipDropChance()` 每局开局清零。
  - 品级权重按难度（用户给定）：`RARITY_WEIGHTS` = 侦查 0.8/0.2/0/0、小队 0.6/0.3/0.1/0、主力 0.4/0.3/0.2/0.1（普通/罕见/史诗/传奇）；某档品级池为空时逐级降级，不出空结果。
  - `rollBattleRewards(win, difficulty)`：胜利才有内容——消耗品包 50%、兑换物 35%、局内货币 `randInt(10,20) × {侦查1, 小队1.5, 主力2}`、外加一次装备判定（以上概率与倍率均**待平衡**，取自策划案）；失败只回一个空包。
  - `rollTreasureLoot(difficulty)`：宝箱必出消耗品 + 兑换物 50% + 货币 40%，装备判定额外带 `TREASURE_EQUIP_BONUS = 0.15`（待平衡）。
  - `CONSUMABLE_RECYCLE_PRICE = 2`：**除战前补给站（原价出售）外，任何回收都按每个 2 源石碇**——结算页的随身补给回收就用它。
  - `LootBundle = { items, equips, originite }` 与 `emptyLoot/mergeLoot/lootItemList` 辅助。
- **`data/equipment.ts`**：品质从三档扩到四档，新增 `legendary`（标签「传奇」，`RARITY_ORDER` 3），原 `rare` 标签改为「罕见」；补 3 件传奇装备（天灾核心/卡兹戴尔纪念碑/星钢法典，数值**待平衡**）。
- **`dungeon.ts`**：`generateDungeon` 现在会真产出事件节点——通路节点洗牌后按驻扎点规模分配：宝箱 `clamp(round(outposts*0.4), 2, 6)` 个、障碍 `clamp(round(outposts*0.3), 1, 4)` 个（比例**待平衡**；一个节点只带一种事件，池子不够就少出）。新增 `isEventNode()`、`isBlockedObstacle()`（障碍未 `cleared` 就挡路），`DungeonNode` 增 `decided?`（已经答复过、不再重复弹窗）。
  - **`BattleResult` 去掉了 `rewards` 字段**：掉落改在**父 realm** roll（`moveTo` 里、`rollBattleRewards`），因为 `addEquipDropChance` 是模块级累加器，战斗子 iframe 有自己的一份模块实例，在那边 roll 会绕过加成。同理 `BattleInit` **没有**加 `difficulty` 参数。
- **`state/campaign.ts`**
  - `DungeonRun` 增四字段并全部入档：`loot`（一路暂存）、`startConsumables`（出发时各类消耗品持有量，回收基准）、`snapshot`（进本时每名干员的 等级/经验/压力/体力，结算页对比用）、`settleWin`（`null`=仍在探索；已判胜负则等结算页确认）。`normalizeCampaign` 对旧档全部补齐。
  - `beginRun` 会 `resetEquipDropChance()` 并打两份快照。
  - 节点交互：`clearObstacle(index, "supply" | "force")`（后勤小队扣 1；或全员 −1 体力 +12 压力，可能当场把人挖死——`OBSTACLE` 常量在 `data/resources.ts`）、`openTreasure(index)`（扣 1 后勤小队，roll 进 `run.loot`）、`dismissNode(index)`（不消耗；宝箱＝直接路过，障碍＝继续堵着）。**铲障碍不给任何收获**（用户口径）。
  - `settlePreview()` 纯读预览（与实际落库口径一致：回收量按「战利品入账后」的持有量算）；`finishRun()` 是**唯一落库点**：有存活带回（消耗品/兑换物进背包、装备进全局仓库、局内源石碇 1:1 变现为局外源石碇、背包放不下的溢出记进 `lost`）→ 全员阵亡则整包丢弃并清掉随身消耗品；随后按 `settleWin` 记副本经验/BOSS 首杀。
  - `applyBattleResult()` 改为返回 `{ win, deaths, ended }`：战败不再自行清进行态/进第二天，只 `requestSettlement(false)`；小队被打光同样如此。
- **UI**
  - 新增 `ui/components/battle/NodeDialog.vue`：走上障碍/宝箱即弹窗答复。障碍三选项（派后勤小队 / 亲手挖开（有人体力 ≤ 损耗值时给红色警示）/ 放弃交互且继续堵路），宝箱两选项（撬开 / 不碰它）。
  - 新增 `ui/components/battle/RunSummary.vue`（phase `settle`）：顶部状态条 + 讨伐成功/撤退结算标题；**全员阵亡**时红条提示、清单整体划线；每名干员列 体力/压力/经验/等级 的前→后与差值；带回（或遗落）物资清单含装备品级徽章；随身补给回收逐条列出并按 `×2` 合计。确认按钮才调 `store.confirmSettlement()`。
  - `DungeonView.vue`：行动区去掉「撤离并结算」，改为 **✋交互**（脚下待处理时）/ **🏆完成讨伐**（主将已被击败）/ **🏳️撤退**（**二次确认浮层**，说明按讨伐失败计）；`canGo()` 在脚下是未铲障碍时一律不可前往；新增路障图标 🪨、`blocked` 节点样式与图例、悬停提示。
  - `BattleReport.vue`：「获得奖励」区改读 `report.loot`（物品/装备+品级/源石碇），并注明「结算页统一入账」。
  - `store.ts`：`endDungeon()` 删除，改为 `requestSettlement/retreat/canComplete/completeDungeon/confirmSettlement`；`resumeRun()` 在 `settleWin != null` 时直接回结算页（刷新也不丢结算）；`App.vue` 注册 `settle` 相位与 `NodeDialog` 浮层。

构建（`WW_SKIP_STATIC_COPY=1 pnpm -F ./packages/extension/WhichWay build` → `✓ built in 2.53s`）、`pnpm eslint packages/extension/WhichWay/src/GloriousIdeal/` 退出 0、入口红线自检为空；产物 chunk 已确认含「随身补给回收」「确认撤退」「派后勤小队清开」三段文案。**未做浏览器实测**（本机 MCP 起不了 dev app），需手动验证：
1. 进副本后行动区只有 交互/完成讨伐/撤退 三个按钮，没有「返回营地」；点撤退弹二次确认，「再想想」留在原地；
2. 走上 🪨 → 弹窗三选项：派后勤小队（无库存时置灰）能铲开且**无任何收获**；亲手挖开让全员 −1 体力 +12 压力（有人因此倒下会进墓园）；放弃交互后脚下所有邻居都不再可点，「✋交互」可反复重开弹窗；
3. 走上 ✨ → 撬开要花 1 后勤小队、提示「结算时入账」且不立刻进背包；选「不碰它」则零消耗零收获、路照常能走；
4. 战斗简报的「获得奖励」列出本场物品/装备/源石碇，确认前后背包数字不变（收获先在暂存行囊）；
5. 撤退/完成 → 结算页：每人 体力·压力·经验 前后与差值正确，「带回物资」与实际入账一致，回收合计 = 件数 × 2；确认后营地源石碇增量 = 回收 + 局内货币变现 + `loot.originite`，装备进全局仓库、可在干员详情穿戴；
6. 小队全灭 → 结算页顶部红条 + 清单划线，确认后背包/仓库/货币都拿不到，随身消耗品清空；
7. 连打若干场主力难度 → 至少出现过一次「史诗/传奇」徽章，侦查难度不得出史诗以上（掉率 0）；
8. 已判胜负后刷新页面 → 直接回到结算页而不是副本地图。

修复（玩家实测报错 `Uncaught ReferenceError: getDungeon is not defined`，来自结算页确认 → `finishRun`）：`finishRun` 里「特殊副本通关即整局胜利」那句调用了 `getDungeon()`，但 `state/campaign.ts` 的 `../data/dungeons.js` 只 import 了 `DUNGEONS/DIFFICULTY/DUNGEON_EXP_CAP/Difficulty`。esbuild 不查未定义标识符、ESLint 的 `no-undef` 对 TS 关闭，所以构建与 lint 都没拦住，运行到那条分支才炸。现在把 `getDungeon` 补进 import；顺带补上 `applyBattleResult` 在无进行态分支漏掉的 `ended: false`（返回类型声明了 `ended`）。凯尔希军的收尾本身是通的：`winGame()` 置 `data.win` → `confirmSettlement()` → `goCamp()` 检到 `data.win` 播胜利结算屏。
自查命令（这轮新加的固定检查）：`npx tsc --noEmit -p tsconfig.json | grep GloriousIdeal.*TS2304` —— 现在只剩 `GameStatusPlayer` 两处（`WhichWay/typings` 里的全局类型，根 tsconfig 收不到，属历史噪音），campaign/store/loot 三层已无未定义标识符。



## 2026-10-02

### 干员技能包全量排查（`src/packs/character`，268 个文件）

按四条重点逐项扫描：StepContent 残留、`player.when()` 链回调是否异步、`Lib.element.player` 返回值的解构写法、文件内冗余代码。共改动 16 个文件。

#### 修复：`const { result } = await` 解构（await GameEvent 恒为 undefined，发动即抛 TypeError）

引擎里 `await <GameEvent>` 走 `then()` 只 await 结算完成、返回 `undefined`，结果对象必须用 `.forResult()` 取，因此下列解构在技能发动时必然崩溃：

- **修复**：斗士塔露拉【灼息】`async cost` 解构 `await player.chooseTarget()` 恒为 undefined，改为 `.forResult()` 取结果。
- **修复**：逻格斯【摆渡】`async content` 同上，改为 `const result = await player.chooseTarget(...)…forResult()`。
- **修复**：斯卡蒂【鲸猎】`async content` 同上，改为 `.forResult()`。
- **修复**：斯卡蒂【倏浪】解构 `await player.chooseToUse()` 后 `result` 从未被使用（解构本身就抛），改为不绑定变量的 `await ….forResult()`。
- 复核：全目录已无 `const { result } = await` 残留（0 处）；赋值型 `await` 共 117 处均已带 `.forResult()`，0 处遗漏。

#### 清理：async content 内残留的 StepContent 步骤标记

- **清理**：闪击【炫目】删除 `("step 1");` —— 所在 content 已是 `async content`，该语句在异步内容里只是无效空表达式（步骤标记仅对 StepContent 生效）。
- **清理**：陨星【流铭】删除 `("step 1");`，原因同上。
- 复核：全目录 `content`/`cost` 已无非异步定义（0 处），数组形 StepContent（`content: [`）亦为 0 处。

#### 改造：`player.when()` 链的 `.then()`/`.step()` 回调统一为 AsyncContent

非异步回调会被 `when()` 以「函数源码字符串重编译」的方式执行，只能拿到引擎注入的 `event/trigger/player/lib/game/ui/get/ai/_status`，任何外层闭包变量都会丢；改成 async 后按闭包直接执行。逐个核对回调体后为：

- **改造**：煌【严训】、双月【设彀】、玛恩纳【敛芒】、桥夹克里夫【雷霆】、松桐【先筹】、太刀侠火龙S黑角【登龙】、云青萍【录武】——`.then()` 回调改为 `async (event, trigger, player) => {}`，显式形参与原注入实参一致（其中【录武】的 when 挂在 `target` 上，保留 `player` 绑定到 when 持有者，行为不变）。
- **改造**：特克诺【塑偶】、真言【聆心】、普瑞赛斯【千面】——回调体本就为空或只引用模块级对象，改 async 属统一写法，行为不变。
- **改造**：聆音【虔颂】——`.step()` 回调改 async；`step()` 一直以闭包执行，行为不变。
- 复核：全目录 `.then()`/`.step()` 已无非异步回调（0 处）。

#### 排查结论：冗余代码

- 注册层面干净：268 个文件共 639 个技能键、258 个武将 id，无跨文件重复注册、无文件名/武将 id 不匹配、无文件内重复 key。
- 已删除的死配置：本次未删（属描述性文案，非代码 bug），但发现三类残留：`hongxuemrfz.ts` 的 `sujimrfz_ban(_info)`、`ailinimrfz.ts` 的 `zhidengmrfz2(_info)`、`midiexiangmrfz.ts` 的 `nianshoumrfz2` 在全扩展内都没有对应技能，属改名后遗留的无用翻译键。
- 发现迁移遗留：`addSkill/addTempSkill` 引用的派生技能（`sujimrfz2`、`zhuguangmrfz2/3`、`hechimrfz2`、`guirenmrfz2`、`dizhumrfzx`、`jinghuamrfz2` 等 23 个）只存在于旧构建 `dist/extension/WhichWay/src/character/packs/…`，模块化拆分时未搬进 `src/packs/character`，引擎 `addSkill` 对不存在的技能直接 return，导致这些技能的后续效果静默失效（已恢复，见下节）。
- `rendongmrfz.ts`【阴虎】的 `switch (num)` 只有 `case 3/2/1`，标记累计到 4 及以上时无任何分支命中（且 `case 3` 依赖 fallthrough），疑为逻辑缺陷，未改动。

### 迁移遗留技能恢复（24 个派生技能 + 13 条技能名翻译，18 个文件）

定义一律从旧构建 `dist/extension/WhichWay/src/character/packs/legend/legend1SJZX.js` 逐字取回（只做机械还原：打包器改名的 `event2/trigger2/player2/result2` → `event/trigger/player/result`、`var`→`let`、`function(`→`function (`、缩进对齐各文件既有风格），按「谁调用就归位到谁的文件」插入该干员文件 `skill({})` 的末尾；旧构建里存在、拆分时一并丢失的 13 条技能名翻译补进同文件的 `translate({})`。唯一写法调整：【守望】标记的旧式无参 `content: function() {}` 改成 `async content(event, trigger, player)`，步骤体不变。ESLint 复核：18 个文件在恢复块内 0 报错、无语法错误，剩余报错全是改动前就存在的 `no-var`。

- **恢复**：耀骑士临光【逐光】`zhuguangmrfz2`（防止决斗伤害并四选一，含改写 `kuanmrfz`/`zhuguangmrfz_change` 存储的分支）与 `zhuguangmrfz3`（修改版决斗全场 directHit）——此前 `addSkill` 直接 return，【逐光】的全部后续效果静默失效。
- **恢复**：百炼嘉维尔【锯袭】`juximrfz2`（用【杀】结算后从扩张区取牌并清空）与【医学】`yixuemrfz2`（下一轮开始时自清的回血加成标记）。
- **恢复**：淬羽赫默【人本】`renbenmrfz2`（遵守宣言者出牌阶段交牌摸一，带 `renbenmrfz2_lose` 子技能）、`renbenmrfz3`（不遵守者的攻击范围削减）与【砥柱】`dizhumrfzx`（“夜灯”标记本体：伤害-1，致命则防止并移除）。
- **恢复**：保存者【守望】`shouwangmrfz2`（“保存”标记持有者摸牌后回摸给守望者）——它的 filter 排除 `shouwangmrfz_draw`、现有 `shouwangmrfz_draw` 的 filter 排除 `shouwangmrfz2`，两处本就互为防回环判断，恢复后【守望②】的双向摸牌才成立。
- **恢复**：陈【呵斥】`hechimrfz2`（“斥”标记本体：手牌上限-#、弃牌阶段结束清除）与 `chencaidanmrfz`（10% 概率 `logSkill` 的彩蛋目标；不补回会让这次恢复自己引入一个悬空引用）。
- **恢复**：麒麟R夜刀【鬼人】`guirenmrfz2`（按本阶段已用次数扣手牌上限，`init` 负责把 storage 归零——此前 `storage.guirenmrfz2++` 是在 undefined 上自增得 NaN）与【乱舞】`luanwumrfza`（把目标复制进父事件两次）——后者缺失时【乱舞】号称“结算三次”实际只结算一次。
- **恢复**：水月【镜花】`jinghuamrfz2`（此【杀】造成的伤害记录不足 3 点时，结算结束后失去 1 点体力）。
- **恢复**：仇白【入隙】`ruximrfz2`（按标记数增加【杀】使用次数，`onremove` 清标记）。
- **恢复**：刻俄柏【拾荒】`shihuangmrfz2`（阶段结束自清的“本阶段已拾取”flag，父技能 `usable: 2` 的门槛判断依赖它）。
- **恢复**：灵知【思涌】`siyongmrfz2`（已用花色 storage 的标记本体，配合 `markSkill` 显示“当前已使用花色：$”）。
- **恢复**：闪灵【力场】`lichangmrfz2`、伺夜【狼群】`langqunmrfz2`、老鲤【明事】`mingshimrfz2`、安洁莉娜【信使】`xinshimrfz2` —— 四个 `{}`/`charlotte` 纯 flag 技能，缺失时 `addTempSkill` 不落账，`hasSkill()`/`tempSkills.xinshimrfz2` 恒假，目标与次数限制全部失效。
- **恢复**：鸿雪【速记】`sujimrfz2`（“弱点”标记本体）——`sujimrfz_damage` 全程靠 `hasSkill("sujimrfz2")` 找目标，缺失时【速记】的增伤/无视防具整条链失效；同时补回翻译 `sujimrfz2: "速记"`。
- **恢复**：赫拉格【盈亏】`yingkuimrfza`、菲亚梅塔【述难】`shunanmrfza` —— 两者都只被 `logSkill` 引用（`{ audio: 2 }`）。`logSkill` 以 `lib.translate[name]` 为开关，故一并补回旧构建里的 `yingkuimrfza: "盈亏"`；旧构建本来就没有 `shunanmrfza` 的翻译，按原样保留（该次播报仍不弹技能名，属旧行为）。
- **恢复**：缪尔赛思 `kaiyuanmrfz`（旧版【源流】整段定义 + `kaiyuanmrfz(_info)` 翻译）。该干员现已改用重制的 `yuanliumrfz`，但仍写着 `audio: "kaiyuanmrfz"`（音频文件确为 `kaiyuanmrfz1/2.mp3`）并两处 `logSkill("kaiyuanmrfz")`；旧构建同样保留这份不挂角色的定义，恢复后 `logSkill` 才拿得到“源流”，否则【源流】发动完全不播报。
- 忠实保留的旧疑点：`renbenmrfz3` 的 `attackRange` 旧构建就写作 `num - Math.max(2, atk)`，与文案“攻击范围-X（X=选‘是’的人数）”不符（最少扣 2），本次只恢复不改数值。
- 复核：`src` 技能键 1414 → 1441；“被引用但全扩展无定义”的技能 id 从 53 降至 30，剩余为核心跨包引用（`qinggang2` 等在 `apps/core/card`）与上节记录的 11 个确实不存在的 flag 名。

## 2026-10-06

### 麦哲伦【龙腾】AsyncContent 重构（`src/packs/character/maizhelunmrfz.ts`）

- **重构**：麦哲伦【龙腾】`longtengmrfz` 及六个 subSkill 按技能描述重写为 AsyncContent——去掉 `// step N`/`goto` 脚手架和 `event.cards`/`event.cards2` 传值，改用局部 `const`；`_trick` 与 `_equip` 里逐字重复的“额外指定目标”filter/ai 提到文件顶层 `longtengCanAddTarget`/`longtengAddTargetAI`；“哪些牌算弃进了弃牌堆”提到 `getLongtengDiscardedCards`，让 `filter` 与 `content` 共用同一份口径（旧代码 `content` 用了更宽的判断）；`_changeI` 的三行 `if` 改 `longtengMarkImages` 表 + 循环；`_equip` 的 `if/else if` 链改 `switch`。技能 id（`_changeI`/`_basic_1`/`_basic_2`/`_trick`/`_trick2`/`_equip`/`_clear`）、`global`/`group`、提示文案、AI 取值、`audio: 8`/`markimage`/`intro`/`onremove`/`ai.expose` 全部保持；各触发条件集合与旧版等价（仅调整判断顺序：先查失效标记再查牌类型）。
- **修复**：【龙腾】`content` 首行 `event.cards2 = cards[0];` 写在 `const cards = []` 之前，触发 TDZ `ReferenceError`——即旧版发动【龙腾】直接抛错；该赋值本身也是死代码（全技能无人再读 `event.cards2`），重构后一并消失。
- **修复**：【龙腾】锦囊分支 `chooseBool(是否令此牌伤害+1)` 选“否”时旧代码仍执行 `trigger.baseDamage++`（原 `step 4` 无条件跑），现只在答“是”时加伤，符合“你可以令此牌造成的伤害+1”。
- **修复**：`addTempSkill("longtengmrfz_trick2")`（“然后本回合此技能失效”）旧代码只在“牌带伤害标签”分支里登记，无伤害标签的普通锦囊加完目标后本回合还能再发动一次；现改为只要实际加了目标就本回合失效。
- **修复**：`_clear` 里 `current.getExpansions()` 被调用两次（判断一次、取值一次），改为取一次复用。
- 校验：`pnpm eslint` 该文件仅剩 `kanchamrfz.check` 里一处历史 `no-var`（【勘查】不在本次范围内，未动）；未打包、未进游戏实测（浏览器 MCP 起不了 dev app），游戏内表现需手动验证。

## 2026-10-09

### 配音兼容修复：候选裁剪从解析层挪回播放层（`src/audio/index.ts`）

驶舰之向与千幻聆音同开时，千幻武将卡界面的**本体武将台词全部消失**。根因是修希尔达语音时把「只留一条候选」做在了**解析层**：`get.Audio` 就是引擎的 `Audio` 类本身（`get/index.js:22`），`appendHook("get.Audio.skill")` / `("get.Audio.die")` 的 after 钩子对所有调用方生效，`filterExistingAudio` 把解析结果压成 `{audioList:[一条], fileList:[一条], textList:[一条]}`（在线组合还直接返回冻结的空 `onlineAudioStub`）。千幻的卡片台词 100% 走 `game.parseSkillTextMap`（`lib.qhly_sanguotaici = {}` ⇒ `characterTaici` 恒 undefined 必走兜底），于是本体武将只剩一句、且那句没有 `#技能1` 翻译时 shousha 主题会把全部台词槽清空；本体详情弹窗读 `.textList` 的位置同样受害。而 `game.tryAudio` 的无限重试只存在于**播放层**（`game/index.js:2569-2602`），且所有播放入口（`trySkillAudio` 2686、`tryDieAudio` 2699、弹窗预览 `ui/click/index.js:3705/3730/4079/4104`）传给它的 `audioList` 一律是 `fileList` 字符串数组。

- **修复**：删除 `filterExistingAudio`、`onlineAudioStub` 与两个 `get.Audio.skill`/`get.Audio.die` after 钩子，改为新增 `trimOwnAudioList(audioList)` + `appendHook("game.tryAudio", { before })`：把候选里**属于本扩展**的条目收敛成一条确实存在的文件（全缺则整批剔除，在线配音不刷 404 靠这里），本体技能与其它扩展的候选原样交回引擎。台词 `textList`/`textMap` 从此不再被改动。`game.playAudio` 的 onError 熔断保留（弹窗复用同一 `playAudio` 闭包时，单条候选失败仍会因 `refresh` 已置真而循环，裁剪不足以覆盖该场景）。
- **修复（隐患 1）**：`game.trySkillAudio` 的去重（`isRepeatedSkillAudio`/`markSkillAudioPlayed`）此前对所有技能无差别生效，会误吞本体武将技能 30 秒内第二次触发的配音；现用 `window.whichWaySave.hasSkill(skill) || hasSkill(trueSkill)` 门控，只对本扩展技能记录/拦截。
- **修复（隐患 2）**：`applySkillAudio` 总改写 `info.audio` 却只在旧值**不是字符串**时备份，借用配音（`audio: "eagle"`）拿不到备份 ⇒ `refreshAudioIndex` 无法还原、切换默认配音语言后借用语义永久丢失。改为 `if (!this._originalAudio.has(skill))` 首次无条件备份。
- **修复（隐患 3）**：`initAllAudio` 的共享技能循环把干员名推进 `lib.skill[getReferSkill(skill)].audioname`，却没有 `applySkillAudio` 里那道 `hasSkill(target)` 守卫，会污染本体技能的共享数组；已补齐守卫（顺带不再把借用技能登记进 `_suffixSkills`，`getAudioBaseName` 对借用技能改为返回终点技能名，与引擎解析一致）。
- **调整**：`auditEngineAudioList` 签名改为接收播放层候选 `audioList`，去重键为「本扩展候选文件拼接串」；措辞不再宣称「无限重试」，改为提示候选数与磁盘文件数对不上。`game.trySkillAudio` 钩子内两处引用 `get.Audio.skill` 的注释同步改为 `game.tryAudio`。
- 校验：`pnpm eslint packages/extension/WhichWay/src/audio/index.ts` 通过（0 报错）。**未构建、未游戏内实测**（浏览器 MCP 无法加载 dev app）。手动清单：①千幻+驶舰同开时本体武将卡台词全部恢复；②驶舰干员仍无台词（无翻译，预期）且无 404 风暴；③希尔达类部分缺失干员配音一句播完即止；④本体技能二次触发配音正常；⑤切换默认语言后 `audio: "eagle"` 类技能能还原；⑥本体技能 `audioname` 不再出现 WhichWay 干员名。

## 2026-10-10

### 格拉尼【骑术】两处修复 + 特殊马注册流程重构（`src/packs/character/gelainimrfz.ts`）

- **修复（锁定技②完全不生效）**：`mod.targetEnabled` 里把使用者当成了自己——`game.checkMod` 的 `targetEnabled` 是从**被指定者**的技能池执行的（`lib.filter.targetEnabled` → `game.checkMod(card, player, target, "unchanged", "targetEnabled", target)`），所以形参 `player` 是【杀】的使用者、`target` 才是格拉尼。旧代码用 `player.hasEmptySlot(3)`/`player.getEquips(3)` 判的是**攻击方**的防御马栏，格拉尼自己出牌时反而可能误拦。现改为以 `target` 为准，并加 `player === target` 守卫（只拦“其他角色”）。
- **修复（锁定技②会放行不该放行的牌）**：旧代码在点数合规时 `return true`，而 `lib.filter.targetEnabled` 对 mod 结果只要不是 `"unchanged"` 就 `Boolean()` 直接返回，`true` 会**短路掉牌自身的 `filterTarget`**（距离/已死亡/已指定过目标等判定全部跳过，等于把【杀】改成可乱指定）。现改为只在点数 ≤ 马栏点数之和时 `return false`，其余情况 `return undefined` 不表态。
- **修复（①描述不符：追加的【杀】静默失效）**：`content` 用 `chooseUseTarget` 出这张牌却没传 `addCount: false`，而 `chooseUseTarget` 第一步就检查 `lib.filter.cardUsable`（`content.ts:2627`）——本回合那张【杀】已经把次数用满，于是事件直接 `result={bool:false}` 结束，表现就是“能弹选牌框、选完什么都没发生”。现改为选完牌和目标后 `player.useCard(vcard, targets, cards, false)` 走 `addCount=false`，既绕过次数检查也不占用次数。
- **修复（①与描述不符：目标问了两遍且问错了人）**：旧代码两处 `filterTarget` 用的集合是**受到伤害的角色本身**（`[trigger.player].filter(...)`），而描述要求的是「该角色的**上家**」；并且 `chooseCardTarget` 选完一次目标后 `chooseUseTarget` 又弹一次同一个目标。现新增 `getQishuTargets(player, damagedList)` 统一口径（取上家 + `player.canUse("sha", 上家)` 合法性过滤，`canUse` 的第四参默认不校验次数，正是追加杀需要的），`filter`/`ai`/`prompt2`/`content` 全部复用，弹窗收敛为「一次选牌+选目标」。
- **修复（①把“你可以”做成了“你必须”）**：`chooseCardTarget` 的 `forced: true` 会去掉取消按钮（`game/check.js:89`）。已去掉，玩家可不追加。顺带 `ai` 旧写法 `[..].some(char => get.effect(...))` 返回布尔值且负收益也算真，改为收益求和。
- **重构（新增一匹马从 4 处改动降到 1 处）**：原来一匹马要写 `card()` + `cardTranslate()` + `cardSkill()` 三个块，外加 `ORGS`/`HORSES`/`HORSES_SKILLS`/`HORSES_INFOS` 四个按下标对齐的平行数组（下标写错即静默错位）。现改为单一 `HORSE_DEFS: HorseDef[]` 表 + `registerHorse(def)`：`subtype`（`equip3`/`equip4`）与 `distance`（`globalTo:1`/`globalFrom:-1`）由 `slot` 推导，卡牌/技能翻译、`audio:false`/`equipSkill:true` 默认值统一补，技能体写成 `skill: (skillId) => ExtendedSkill` 以便日蚀的 `group`、黑贝丝的 `storage`/`addTip` 引用自己的 id 而不再硬编下标。「飞驹」的选马列表也改成从同一张表 `game.createCard()` 生成，加马不再需要改 `content`。
  - 卡牌 id（`{Org}_gelanimrfz`）、技能 id（`{Org}_skill_gelanimrfz`）、花色点数、装备价值、各技能逻辑与文案全部保持原样；顺手删掉黑贝丝 `cost` 里残留的 `console.log`。
  - 复核时发现并修回一处重构过程引入的偏差：黑贝丝 `filter` 的 `getAllGlobalHistory(...).length` 一度被写成少了 `.length`，导致 `typeof num === "number"` 恒假、技能永不触发；已恢复 `.length` 并把 `typeof` 冗余判断简化为 `isPrime(num)`。
- 校验：`pnpm eslint packages/extension/WhichWay/src/packs/character/gelainimrfz.ts` 通过（0 报错）。**未构建、未游戏内实测**（浏览器 MCP 起不了 dev app）。手动清单：①格拉尼装防御马（哥本哈根/达利阿拉伯）后，他人以点数 ≤ 马栏点数之和的【杀】应无法指定她，点数更大或无点数的【杀】可指定，且她**自己**出【杀】不受限制；②出【杀】造成伤害后应弹一次「选一张手牌 + 选受害者上家」的框、带取消按钮，选完这张【杀】真的结算（即使本回合【杀】次数已用完）；③目标不可达（上家不在距离内/已死亡）时不弹框；④飞驹开局选马仍是防御马+进攻马各一张、装备后技能（回血/废除马栏/判定阶段杀/失去手牌摸牌）表现不变。

### 武将卡界面三处修改：背景图标尺寸 / 背景加载延迟 / 衍生技能与衍生卡牌（`src/characterCard/`）

- **修复（「背景」图标过大）**：`image/ui/back_switch.png` 是 36×36 的方图，而 `.btn-img` 只写了 `width: 50px` 没约束高度，其它四个图标（skill/skin/mode/resume.png 均 60×45）按 50px 宽出来是 50×37.5，这个方形图标却出来 50×50，上下都溢出 38px 高的按钮。现补 `max-height: 38px` + `object-fit: scale-down`：60×45 的仍是 50×37.5（观感不变），方图被夹到 38×38，`scale-down` 保证不把 36px 的图放大糊掉。
- **修复（选背景明显延迟）**：两处。
  - `BackgroundPanel.vue` 原来把十几张背景（`image/background` 合计约 19MB，单张 0.2–3.6MB）全部写成 CSS `background-image`，面板一挂载就一次性全取、且要等解码；改为 `<img loading="lazy" decoding="async" fetchpriority="low">`，滚进视口才取，并把 `getFileTree` 的扫描结果缓存在模块级（面板每次开关都重新 mount，目录内容不会变，第二次起不再发 readdir+stat 的 IPC）。占位用 `img` 自己的深色底色，不用透明度渐显——那样一旦 `load` 不触发就会留一张永远看不见的透明图。
  - `CharacterCard.vue` 原来点一下就直接改容器 `backgroundImage`，浏览器要等新图解码完才上色，中间是纯空窗。现在 `background`（选中值，面板高亮立刻跟随、配置立刻落盘）与 `shownBackground`（真正画上去的）分开：先 `new Image().decode()`，解码完成再一次性换；`decode()` reject（图坏/不支持）时照样切，不让界面永久停在旧背景；连点时用 `background.value === value` 判断只让最后一次选择上画，避免先解码完的那张顶掉后选的那张。
- **调整（衍生技不再与主技能平级）**：`SkillPanel.vue` 原来把 `lib.skill[x].derivation` 拉平成顶层条目（`.dskillname` 区分颜色），衍生技看起来和干员自己的技能并列。现在每名技能一个 `.skillWrapper`，衍生内容渲染在该条目**内部**的 `.derivationBox`（标题「衍生技能」），试听按钮仍播主技能的音、「自动发动」仍写 `lib.config.autoskilllist`，行为与旧版一致。
- **新增（衍生卡牌）**：衍生条目里带 `lib.skill[x].equipSkill` 的表示它有对应的装备牌（如格拉尼【飞驹】的四匹马），这类不再列成技能，而是用 `game.createCard(cardId)` + `ui.create.buttons([card], "card", host, true)`（内部走 `ui.create.buttonPresets.card`）画出真正的引擎牌面，放进单独的 `.derivationCardBox`（标题「衍生卡牌」）并与文字说明并排。
  - `lib.card` 只有「牌 → 技能」（`lib.card[id].skills`）这一层、没有反向索引，故在模块级扫一遍 `lib.card` 建「技能 → 牌」反查表并缓存。
  - `game.createCard` 的**原件挂在 `ui.special`**，card 预设 `copy(false)` 出副本后原件已无用，故 `node.remove()`，否则每开一次面板攒一批幽灵牌。传 `noclick`：展示用，不该参与任何结算。
  - 超出字面要求的一处判断（可回退）：有些 `derivation` 直接写的是**卡牌 id**（老实【拾剑】→ `jianzhumrfz`），这种也画成牌面；`equipSkill` 查不到对应牌（牌包被关等）时退回列成衍生技能，信息不丢。
- **新增（衍生区可折叠）**：「衍生技能」「衍生卡牌」两块各加一个折叠开关，**默认展开**，状态存在条目上（`item.foldDerivations` / `item.foldCards`）。开关是 `.derivationTitle` 的 `::before` 伪元素（展开 `content: "-"`、折叠 `content: "+"`，18px/700/16px 宽/`line-height:1`），整行标题即热区（`cursor:pointer` + `user-select:none`）；`--ak-font-label`/`--ak-accent`/`--ak-dur-fast` 扩展里目前没有定义，一律写了回退值（沿用标题自己的字体与 `currentColor`，过渡 0.2s），折叠态额外 `transform: rotate(90deg)`——加号转 90° 看上去仍是加号，于是过渡表现为「符号转过来变成减号」而不是凭空加动画。折叠用 `v-show` 而不是 `v-if`：牌面是 `renderCards()` 命令式塞进挂载点的，`v-if` 会把挂载点连同牌面一起销毁、再展开时 `hasChildNodes()` 的判空逻辑就再也补不回来了。
- 校验：`pnpm eslint` 三个文件 0 报错；另用 `vue/compiler-sfc` 的 `parse`/`compileScript`/`compileTemplate` 逐一编译 `SkillPanel.vue`、`BackgroundPanel.vue`、`CharacterCard.vue`，均无错误（两个面板新增了与 `<script setup>` 并存的模块级 `<script>` 块，需确认可合并）。**未构建、未游戏内实测**（浏览器 MCP 起不了 dev app）。手动清单：①顶栏五个图标大小观感一致、「背景」不再溢出；②首次打开背景面板列表立出、缩略图随滚动逐张出现；③点选大背景时旧背景保持到新高图就绪、不闪空窗，连点多张最终停在最后一张；④格拉尼技能面板出现「衍生技能」+「衍生卡牌」两块，四匹马牌面带花色/点数缺失时的「无」字角标、牌面右侧显示马名与描述；⑤老实【拾剑】的【剑助】显示为武器牌面；⑥无 deriv 的干员面板与旧版一致、拖动排序与「自动发动」照常；⑦点「衍生技能」/「衍生卡牌」标题行能收起/展开（标题前的符号 −／+ 随之切换），**衍生卡牌折叠后再展开牌面仍在**（不出现空白格）。

### 武将卡背景来源：新增 `dynamicSkin/background` 目录 + 「武将卡背景来源」设置（`src/file.js`、`src/characterCard/`）

- **新增来源目录**：`whichWayFile.pathShceme` 加 `dybg:` → `extension/WhichWay/dynamicSkin/background/`（本次实测该目录 48 张 PNG、合计约 82MB，全是活动场景图，自带 `default.png`）。
  - 过程中曾写成 `ext:dynamicSkin/background/`：`ext:` 是**引擎**的前缀（`ext:WhichWay/…` → `extension/WhichWay/…`，见 `src/skin/index.ts:356`、`src/audio/index.ts:1240`），而 `compilePath` 只认本扩展自己的 scheme、不会替换它，于是 `getFileTree` 与缩略图 `src` 拿到的都是未编译的原始串（列目录与图片双双失败）。换 `dybg:` 后与现有 `dyc:`/`bg:` 无前缀冲突（`compilePath` 是逐 key `startsWith` + `replace`，`"dybg:…"` 既不以 `dyc:` 开头也不以 `bg:` 开头）。
- **新增设置项**「武将卡背景来源」（键 `characterCardBackgroundSource`，选项 `featured` 精选 / `all` 全部，**默认精选**）：在 `src/characterCard/index.ts` 构造器里再注册一个 `onConfig`，priority 769 紧跟样式开关的 770，菜单里就挨着排。
- **配置名/文案/读取抽到 `src/characterCard/backgroundSource.ts`**（`BACKGROUND_SOURCE_CONFIG_NAME`、`backgroundSourceItems`、`getBackgroundSourceMode()`）。单独成模块的原因：面板不能反过来 import `characterCard/index.ts`——`index.ts` → `CharacterCard.vue` → `BackgroundPanel.vue` 已经是链路，再导回来就是循环依赖。读取沿用样式开关那套「值缺失/异常按默认处理」的写法，从未配置过即精选。
- **面板行为**：`featured` 只扫 `dybg:`（`image/background` 那十几张 JPG 不再扫描、也不再一次性取图）；`all` 才扫 `dybg:` + `ui:background/` + `bg:`。
  - 列表顺序改为「按来源分组、组内按文件名字典序」，不再对整个列表做全局字典序（旧写法会把 `bg:` 的图排在最前，与「精选优先」的意图相反）。
  - 模块级缓存由 `cachedList` 改成 `cached = { mode, list }`：模式一变就重扫，否则改了设置还把旧模式的列表端出去。
- **需要知道的副作用**：切到精选时 `ui:background/default.png` 不再出现在列表里——正在使用的背景（`characterCardBackground` 的配置值）不受影响、照常画着，只是面板里没有对应条目可高亮；`dynamicSkin/background` 自己有 `default.png` 可作回退。
- 校验：`pnpm eslint` 四个文件（`file.js`、`characterCard/index.ts`、`characterCard/backgroundSource.ts`、`panels/BackgroundPanel.vue`）0 报错；另用 `vue/compiler-sfc` 的 `parse`/`compileScript`/`compileTemplate`/`compileStyle` 编译 `BackgroundPanel.vue`，脚本/模板/样式均 0 错误。**未构建、未游戏内实测**（浏览器 MCP 起不了 dev app）。手动清单：①设置里出现「武将卡背景来源」，默认「精选」，文案为 精选/全部；②精选下背景面板只列 `dynamicSkin/background` 的图、打开明显变快；③切「全部」后重开面板多出 `image/background` 与 `image/ui/background` 的图；④切回「精选」不再看到旧模式的列表（缓存按模式失效）；⑤选中 `dynamicSkin/background` 里任意图后武将卡背景真的换掉（验证 `dybg:` 编译出的 URL 可用、缩略图滚进视口才取）。

### 构建：chunk 去掉 `[hash]`（发布后用户 `chunks/` 无限增大的问题）

- **现象**：`vite.config.ts` 的 `chunkFileNames` 返回 `chunks/${name}-[hash].js`，而 `emptyOutDir` 必须为 `false`（见同文件注释：先清空会让 2200+ 个音频进入「部分存在」的中间状态，触发引擎 `game.tryAudio` 的重试死循环）。两者叠加 = 每次构建都**只新增、从不删除** chunk；发布又是按文件名覆盖到用户目录，于是用户每更新一次就攒一批永不再被引用的死文件。实测本机 `apps/core/extension/WhichWay/chunks/` 已有 38 个文件（历史上堆到 596 个，同名 `GloriousIdeal-battleOverlay-shared-*` 有 26 份），其中 `characterCard-*`、`configUI-*`、`init-*` 各自都是「上一版构建留下的孤儿 + 本次的」两份不同 md5 的文件。
- **改法一（主因）**：`chunkFileNames` 去掉 `-[hash]` → `chunks/${name}.js`。名字仍按源码路径推导（`src/x/index.ts` → `x`、共享 chunk → `x-shared`），同名 chunk 每次构建**就地覆盖**，用户侧目录大小与更新次数无关。
  - 去掉 hash 后靠什么避免重名覆盖：`derive` 对 `src/**` 全部真实模块路径是**单射**的（已用脚本跑过：`src` 下每个文件都过一遍 `derive`，得到 417 个互不相同的名字、0 冲突），而每个 chunk 只有一个 `facadeModuleId`，所以同一批产物内不会撞名；即使将来出现 `src/a.ts` 与 `src/a/index.ts` 这种折叠，rollup 会静默把后者改成 `chunks/a2.js`（已用小样例实测：不报错、不覆盖、引用路径同步更新），因此也不需要为了去重而加 hash。
  - 顺带的好处：更新时入口与 chunk 名字稳定，不会再出现「只复制到部分新文件 → 入口引用的旧 hash 文件缺失」这种半更新状态。
- **改法二（回收存量）**：新增内联插件 `pruneStaleChunks`（`apply: "build"`，`writeBundle` 阶段）。它拿本次 bundle 的 chunk 文件名集合，删除 `<outDir>/chunks/` 里**不在集合内的 `.js`**（只碰这一个目录、只碰 `.js`，audio/image/dynamicSkin 一律不动；先写后删）。执行时机在写盘之后，所以新产物已经就位。`WW_KEEP_OLD_CHUNKS=1` 可临时关掉（做新旧产物对比时用）。
- **两处注释同步更正**：`emptyOutDir: false` 的理由原来写的是「产物 JS 都带 hash，旧的残留不会被引用，所以不清空是安全的」——这句正是问题所在，已改为「靠固定文件名 + prune 插件保证不膨胀，而不是靠 hash」。
- **需要知道的代价**：chunk 名不再随内容变化 ⇒ 更新后浏览器若命中 HTTP 缓存，可能仍旧拿到旧内容。这一点**并非新增风险**：入口 `extension.js` 与 `css/viteAutoCreateStyle.css` 从来就是固定名，本扩展一直是靠覆盖同名文件发布的；真遇到顽固缓存，正确做法是在 import 处加查询串，而不是把 hash 加回文件名。
- **注意**：`packages/extension/WhichWay/AGENTS.md` 第 35 行仍写着「产物 JS 都带 hash…因此构建前不必、也不要手动清空输出目录」，本次未改（项目指令文件需你确认），下一句应改为「chunk 名固定 + 构建后自动清理过期 chunk」。
- 校验：`pnpm eslint packages/extension/WhichWay/vite.config.ts` 0 报错；derive 单射性与 rollup 撞名行为分别用脚本和最小 rollup 样例实测（临时目录，未写入本仓库）。**未跑 `pnpm build`**（按约定构建由你执行；且首次构建会在 `apps/core/extension/WhichWay/chunks/` 删除约 38 个旧 hash 文件，建议先关掉游戏再构建，避免正在跑的页面去取已被删掉的旧 chunk）。手动清单：①构建后 `chunks/` 只剩本次产物（控制台逐条打印「删除过期 chunk」）；②连续构建两次，`chunks/` 文件数与文件名**完全不变**（只覆盖内容）；③游戏内打开武将卡、干员面板、瑰丽理想等动态模块照常（动态 import 路径已随名字更新）；④`css/viteAutoCreateStyle.css` 与 audio/image 目录不受影响。

## 2026-10-11

### 修复：虎狼丸【荒咬】不按描述结算（`src/packs/character/hulangwanmrfz.ts`）

对照 `huangyaomrfz_info` / `huangyaomrfz_rewirte_info` 排查，定位到 4 处偏差。

- **「同色」判定必抛异常（主因）**：`filter` 里写的是 `card.cards.length > 0`，但实体牌 `Card` 类**根本没有 `cards` 属性**（`cards` 只存在于 `VCard`/`get.copy`，见 `library/element/vcard.js:52,131`）。而 `get.autoViewAs` 造出的纯虚拟牌一定带 `cards: []`。结果就是：上一张是纯虚拟牌 ⇒ `length > 0` 为假 ⇒ 不触发；上一张是**实体牌**（正是描述要的情形）⇒ 读 `undefined.length` 抛 `TypeError`。该异常发生在 `lib.filter.filterTrigger`（`library/index.js:11135`，无 try 包裹）里，被 `arrangeTrigger` 的 content 抛出 ⇒ 该次触发整体失败。净效果：【荒咬】原版几乎从不正常发动。
  - 改为 `hasPhysicalCard()`：`get.itemtype(card) === "card" || Array.isArray(card.cards) && card.cards.length > 0`，即「实体牌本身，或由实体牌转化/消耗而来的虚拟牌」，与描述「有对应实体牌的牌」一致。
- **「上一张」取错对象**：原 `getLastUsed` 直接取 `getAllGlobalHistory("useCard")` 的倒数第二条，不会跳过纯虚拟的使用。【荒咬】自己视为使用的那张【杀】（无实体牌、颜色为 `none`）会占住「上一张」，把后续同色链切断。
  - 改为**以当前事件为锚点向前回溯**（`histories.lastIndexOf(event)`），取最近一张有实体牌的使用牌；当前事件尚未入历史时退化为从表尾开始。
- **伤害归属判定不可靠**：原判定用 `evt.getParent("huangyaomrfz")` 取到父事件后比较 `huangyaomrfz_triggered !== true`。`getParent(name)` 在未命中时返回的是 `{}`（`gameEvent.ts:152-170`，`forced` 为假值时），`!!evt2` 恒真，实际只靠 `storage.huangyaomrfz` 兜住。
  - 改为直接比对身份 `evt.getParent("huangyaomrfz") === event`（内容事件确实以技能名创建，见 `content.ts:4281` `game.createEvent(event.skill)`），并去掉多余的 `event.huangyaomrfz_triggered` 标记；同时删掉一段重复扫描 + 遗留的 `console.log` 调试输出。
- **AI 在「无法使用【杀】」时强行出杀**：`cost` 的 `ai` 原写法为「友好且能出杀 ⇒ 选项二，否则 ⇒ 选项一」，因此当 `controls` 里没有「选项一」（`canUse` 判过不了，多为距离不够）时仍返回 `"选项一"`。`chooseControl` 会把该值当作结果（`content.ts:8342-8350`，`indexOf` 得 -1 也不拦），content 于是照常 `chooseUseTarget` ⇒ AI 托管下会视为使用一张**本不该用**的【杀】，且此路径不检距离。
  - 改为先判 `controls.includes("选项一")`，不可用则一律「选项二」。
- **未改动（待你确认口径）**：
  - 「修改【荒咬】直到下次使用【荒咬】」目前实现为「下次【荒咬】发动**并结算完 `huangyaomrfzEnd`** 时才恢复」，即下一次发动仍按修改版结算。若要「下次发动即用原版」，需把失效时机挪到 `huangyaomrfzBefore/Begin`。
  - 【荒咬】没有写 `locked: true`（描述是锁定技）。因引擎在 `typeof info.cost === "function"` 时直接进 cost（`content.ts:4150`），不会弹「是否发动」，行为上是锁定的，只差描述配色/锁图标这类观感，故未动。
  - 选项二那条 `disableSkill(`${event.name}_effect`, "huangyaomrfz")` 参数方向是对的：`disabledSkills` 的 **key 是被禁用的技能、value 是禁用来源**（`player.js:11575` + `game.filterSkills` 按 key 剔除），官方觉醒同此用法。
- 校验：`pnpm eslint packages/extension/WhichWay/src/packs/character/hulangwanmrfz.ts` 无报错。**未构建、未游戏内实测**（browser MCP 起不了 dev app）。改前备份在 `packages/extension/WhichWay/hulangwanmrfz.ts.bak-20261011`。
- 手动验证清单：①两名其他角色连续使用同色**实体牌**后，虎狼丸应弹「选项一/选项二」（控制台不再有 TypeError）；②选项一的【杀】未造成伤害 ⇒ 失去 1 点体力并出现「荒咬·修改」标记；③修改后无视颜色，且造成伤害后摸「已损失体力值」张牌；④选项二摸 1 张牌且本轮【荒咬】真正失效，下一轮恢复；⑤AI 托管 + 目标不在距离内 ⇒ 只能选「选项二」，不再强行出杀；⑥虎狼丸自己用牌不触发【荒咬】。

### 扩展介绍页美化 + 作者头像 / LLM logo（`src/config/extIntro.vue`）

原页面是「一张大图 + 纯文本列表」，过于简陋。重写为卡片式版面，并补上作者头像与协力 LLM 的 logo（素材均在 `image/decoration/`，名单与 `src/package/author.vue` 对齐）。

- **封面**：`SJZX.jpg` 改为圆角 hero 图，底部叠渐变遮罩，左下角放 `SJZXStar6.png` 星标条 + 一行 tagline（封面自带的金色标题与二维码不再被裁切）。
- **作者 / 协力 LLM 卡片**：作者（TheLeaderOne→`1.jpg`、圣晴天空→`0.jpg`）为金环圆形头像 + 姓名 + 分工；LLM（DeepSeek-v4.1-Flash→`deepseek.png`、Qwen3.8-Flash→`qwen.png`）为白底圆形 chip + 名称胶囊（GitHub 标是纯黑透明底，深色面板上必须垫白底才看得见，故 chip 统一白底）；另加一枚「访问扩展仓库」胶囊（`github.png`，点击 `window.open` 仓库地址）。
- **感谢名单**：由 `<ul>` 改为胶囊标签流（设计者金色、特别感谢灰白），`whichWayConfigData.thanks` 数据源不变。
- **资料来源**：列表改为金色 ◆ 自定义符号 + 二级缩进列表，去掉浏览器默认圆点。
- **资源与反馈**：QQ 群 / 百度网盘改为两张并排二维码卡片（白底容器保证扫码识别、`loading="lazy"`），复制入口从「下划线文字」改成圆角按钮，复制逻辑（Clipboard API + execCommand 降级）原样保留。
- **版式**：根节点改 `flex column + gap`、`max-width: 760px` 居中；各区块为半透明深色卡片 + 金色描边；标题用扩展自带 `lishu` 字体 + 两侧渐隐分割线，替换原来的「←← →→」文本箭头。所有栅格用 `auto-fit minmax(...)`，在引擎设置弹窗与游戏内快速设置（`configUI/main.vue` 的 `.displayArea`，85% 宽滚动区、深色背景图）两种宿主下都能自适应；`main.vue` 里对 `.whichWay-intro` 的宽度 `!important` 覆盖继续生效。
- 校验：`vue/compiler-sfc` parse + compileScript + compileTemplate 通过，`pnpm eslint src/config/extIntro.vue` 无报错。**未构建、未游戏内实测**（browser MCP 起不了 dev app）。
- 手动验证清单：①引擎「设置 → 扩展信息（点击后展开）」展开后封面/头像/LLM chip/二维码卡片均正常显示且无横向溢出；②游戏内快速设置「扩展介绍」面板滚动浏览同上，窄窗口下二维码卡片自动折行；③「复制群号 / 复制链接」按钮点击后弹「✅ 已复制」；④「访问扩展仓库」点击打开 GitHub；⑤深色背景下金色标题与白色文字对比清晰。
- 备注：`configUI/main.vue` 里 `.qr-code, .baidu-icon` 两条 `!important` 覆盖因旧类名已删除而失效（无副作用，未动该文件）。

### 修复：扩展介绍页所有 DOM 元素重叠（`src/config/extIntro.vue`）

美化后实测所有元素叠在原点。根因是引擎全局样式 `apps/core/layout/default/layout.css:31` 的裸元素选择器 `div { display: inline-block; position: absolute; transition: all 0.5s; }`——它命中每一个未自行声明 `position` 的 `<div>`。本次改版里根节点 `.whichWay-intro` 及 `.people-grid / .person / .person-name / .person-role / .llm-row / .llm / .tag-grid / .qr-grid / .qr-card / .qr-box / .qr-caption / .qr-value` 全是只设了 `display`、没设 `position` 的 div，被全局规则打成 `position: absolute` 后集体脱离文档流叠在一起（`<section>/<header>/<img>/<span>/<p>` 等非 div 不受影响，故 `.card` 区块本身没塌）。

- 修复：给上述每个 div 类补显式 `position: relative`（`.hero-shade / .hero-foot` 保持原本有意的 `absolute`），`.qr-box` 顺带补 `display: block`。scoped 类选择器带 `[data-v-*]` 特异度 (0,2,0)，稳压全局 `div` 的 (0,0,1)，`display: flex/grid` 也不再被全局 `inline-block` 干扰。
- 校验：`vue/compiler-sfc` 编译通过、`pnpm eslint src/config/extIntro.vue` 无报错；已断言编译后 scoped CSS 中各 div 类解析为 `position: relative`、遮罩/页脚为 `absolute`。**仍未游戏内实测**（browser MCP 起不了 dev app）。
- 复核清单：①游戏内快速设置「扩展介绍」面板与引擎设置弹窗两处，各卡片自上而下正常排列、不再重叠；②封面遮罩只盖 hero 图、星标条压在封面底部；③作者头像/LLM chip 在各自卡片内横排；④两张二维码卡片并排、白底可扫。

### 调整：「访问扩展仓库」从「协力 LLM」中拆出（`src/config/extIntro.vue`）

原先仓库入口是混在 `.llm-row` 里的一枚 `.llm.llm-link` 胶囊，与 DeepSeek / Qwen 并列，语义上被当成一类 LLM。按反馈把它单独成块：

- 模板：`协力 LLM` 行只保留 `agents` 遍历；新增 `扩展仓库` 的 `section-title` + `.repo-row > .repo-link`（GitHub chip + 两行文案：`访问扩展仓库` 标题与仓库 URL）。点击行为不变（`openUrl(repoUrl)`）。
- 样式：新增 `.repo-row / .repo-link / .repo-text / .repo-name / .repo-url`（`.repo-row / .repo-link` 为 div，已补 `position: relative` 防前述全局 `div{position:absolute}` 塌陷；`.repo-link` 用 `inline-flex` + 悬停金色高亮）。移除已不再使用的 `.llm-link / .llm-link:hover`。`.llm-chip` 复用不变。
- 校验：`vue/compiler-sfc` 编译通过、`pnpm eslint src/config/extIntro.vue` 无报错，已断言 `.repo-row / .repo-link` 编译后为 `position: relative`、`.llm-link` 已从产物移除。**仍未游戏内实测**。

### 新增：更新公告面板「截图本页」导出（`src/configUI/component/updateCurrent.vue`）

需求是给 `updateCurrent.vue` 这个界面加 DOM 截图能力。选型对比了 GitHub 开源方案并核对协议（扩展 GPL-3.0-only，只引宽松许可）：`modern-screenshot`（MIT，活跃，2026‑04 有提交）> `html-to-image`（MIT，同类 foreignObject 方案）> `html2canvas`（MIT 但基本停更、对本面板用到的多层渐变/现代 CSS 还原差）。选定 **modern-screenshot 4.7.0（MIT）**，对现代 CSS 还原最好。

- `package.json`：新增依赖 `modern-screenshot: ^4.7.0`（已 `pnpm install` 落地到扩展 node_modules，确认 MIT、导出含 `domToPng`、`filter?: (el: Node) => boolean`）。
- 组件：根节点加 `ref="rootRef"`；标题下方新增操作栏 `.UpdateCurrentActions > button.capture-btn`，点击调用截图。逻辑：
  - 截图前临时把根节点（原本是 `height:calc(100%-40px)+overflow:auto` 的滚动容器）改成 `height:auto; overflow:visible`，让整页内容（滚动区之外）都进图，`finally` 还原；
  - `await import("modern-screenshot")` 懒加载（不进主包解析路径，避开入口红线），`domToPng(node, { scale: 2, backgroundColor:"#1e2733", filter: 排除 .UpdateCurrentActions })`——操作栏（按钮自身）不进图；
  - 生成 `驶舰之向-更新公告-v{版本}.png` 经 `<a download>` 下载；`capturing` 期间按钮禁用并显示「截图中…」，失败 `console.error` + `alert`。
- 样式：`.UpdateCurrentActions / .capture-btn` 均显式 `position: relative`（同样是 div，防引擎全局 `div{position:absolute}` 塌陷）。
- 校验：`vue/compiler-sfc` parse+script+template+style 通过、`pnpm eslint src/configUI/component/updateCurrent.vue` 无报错；已核对依赖安装与 API 导出。**未游戏内实测截图效果**（browser MCP 起不了 dev app）——需你在 `pnpm dev` 里打开「设置 → 驶舰之向快速设置 → 更新公告」点按钮验证：PNG 是否含全部公告内容、干员/卡牌按钮组与立绘是否正常进图、操作栏是否被排除。
- 已知风险：立绘走 `ext:/blob/data:` 需同源可读才能内联进 SVG；扩展自定义字体（lishu 等）由 modern-screenshot 尝试抓取内联，若拿不到会用回退字体。若图里缺图/缺字，多半是这两点，届时再调 `filter`/`fontEmbedCSS`。

### 调整：截图三处修正（`src/configUI/component/updateCurrent.vue`）

首版实测反馈：①截到的页面过大（下半屏全是空白）、②非开发者模式不该显示按钮、③图片文件过大。逐条修：

- **页面过大**：根因是引擎全局 `div { transition: all 0.5s }`（`apps/core/layout/default/layout.css:34`）——把根节点改成 `height:auto` 时带了 0.5s 过渡，`domToXxx` 同步取到的还是旧的大高度，于是把整屏空白截了进去。改为截图前一并 `transition:none; position:static; height:auto; max-height:none; overflow:visible` + `void node.offsetHeight` 强制回流，尺寸立即按内容收缩；`finally` 逐个还原。（`.updateCurrent` 原本没写 `position`，也被全局 `div{position:absolute}` 命中，这里顺带 `position:static`。）
- **仅开发者模式**：`import { whichWayUtil } from "../../utill"`，`const devMode = whichWayUtil.isDeveloperMode()`，操作栏加 `v-if="devMode"`（与 `src/component/sort.vue` 同一判定口径）。非开发者模式下按钮不渲染。
- **压缩图片**：`domToPng` 换成 `domToJpeg(node, { scale: 1.5, quality: 0.82, backgroundColor:"#1e2733", filter })`，文件名改 `.jpg`。scale 由 2 降到 1.5、PNG→JPEG(0.82)，配合去掉空白，体积显著下降；JPEG 无透明故保留深色 `backgroundColor`。
- 校验：`vue/compiler-sfc` 全量编译通过、`pnpm eslint` 无报错；已核对 `domToJpeg(node, options)` 与 `Options.quality` 存在于 4.7.0 的 `index.d.ts`。**仍未游戏内实测**——请开发者模式下重开「更新公告」页点按钮复核：图片高度贴合内容、无大片空白、文件明显变小、非开发者模式下看不到按钮。

### 修正：截图右侧/底部仍大片空白 = 画布尺寸取了缩放后尺寸（`src/configUI/component/updateCurrent.vue`）

上一版只压了纵向、横向空白仍在。真因：无名杀用 `document.body.style.transform = scale(zoom)` 把整个 UI 缩放适配窗口（`apps/core/noname/ui/index.js:606-608`），而 modern-screenshot 未显式传 `width/height` 时回退用 `node.getBoundingClientRect()`（**缩放后**尺寸）建画布，克隆体却按**未缩放布局**渲染（body 的 scale 不被克隆进去）——`zoom > 1` 时画布比内容大，内容贴左上、右侧与底部多出空白。

- 修复：强制回流后取 `node.offsetWidth / node.offsetHeight`（布局像素、不受 transform 影响），显式传给 `domToJpeg({ width, height, ... })`，让画布尺寸与克隆体一致，消除两个方向的空白。
- 校验：`vue/compiler-sfc` + `pnpm eslint` 通过。**仍未游戏内实测**——请**重新构建**后（上一张仍是 `.png`，说明改动尚未编译进产物）复核：截图应紧贴公告内容、右侧与底部无多余空白。若仍偏大/偏小，多半是 `offsetWidth` 含了滚动条宽，届时改用 `clientWidth` 或再减 `padding`。

## 2026-10-12

### 新增：本地留包 + 一键打包到 scripts（`scripts/release.bat` / `scripts/pack-local.bat`）

需求两条：① `release.bat` 打包完成后在本地留下 output 包与 output-core 包；② 新增 bat 把这两个包（可选 output / output-core / 全部）打包到 `scripts/` 下。

- `scripts/release.bat`：新增 `:export_tree <tree-sha> <target-dir>` 子程序，在 push-only 复读块之后、推送之前把两棵提交树导出到本地目录——`output` 树（`!MERGE!`）→ `release\output`，`output-core` 树（`!CORE!`）→ `release\output-core`。放在推送前且 `call` 不判 errorlevel，故取消推送 / 导出失败都不影响发布主流程，只是本地包缺失时告警。
  - **为什么走「pushd + ASCII tar」而不是 `git archive <sha> | tar -xf - -C "<dir>"`**：仓库在中文路径 `F:\无名杀\...` 下，把 CJK 路径作为参数传给外部 `tar.exe` 存在代码页乱码风险（这也是本脚本早先刻意用 Node 助手 `make-core-index.cjs` 处理 CJK 路径的同类原因）。改为先 `pushd` 到目标目录（cmd 内建，正确处理 CJK），再 `git archive -o export.tar "<sha>"`（sha 与 export.tar 全 ASCII）→ `tar -xf export.tar` → `del` → `popd`，全程不让 git/tar 收到 CJK 参数。
  - 顶部说明块与 `[INFO]` 补注：产物落在 gitignore 的 `release\` 目录；`release/` 已加入 `.gitignore`（原 `output` 规则只盖得到 `release/output`，盖不到 `release/output-core`，否则下次 `release.bat` 的「工作区必须干净」预检会被未跟踪文件挡下）。
- `scripts/pack-local.bat`（新增，ASCII + CRLF，与 release.bat 同规范）：读 `release\output` / `release\output-core`，用 PowerShell `Compress-Archive` 压成 `scripts\WhichWay-<version>.zip` 与 `WhichWay-<version>-core.zip`（`<version>` 取 `git describe` 的 output 分支最新 `v*`，无标签回退 `local`）。参数 `output` | `core` | `all`（默认 `all`）。源目录缺失/空则 `[WARN]` 跳过并提示先跑 `release.bat`。CJK 路径经 `$env:WP_SRC`（进程环境变量，UTF‑16 无损传给子进程）拼 `\*` 交给 Compress-Archive，避开命令行代码页问题；不依赖 `tar`。
  - 已知：本地 `output` 包内含注入的 `.github/workflows/release.yml`（导出的是打了 tag 的整棵树），比 CI 产物多一份 CI 配置，无害。
- 校验：脚本纯静态检查——`release.bat` 改后仍 ASCII-only、580 行全 CRLF 无裸 LF；`pack-local.bat` 同样 ASCII+CRLF。**未实跑批处理**（cmd 交互 + 需真实 git 仓库状态），请你择机验证：① `release.bat v1.x.y` 跑完 `release\output`、`release\output-core` 目录确有内容；② `git status` 仍干净（`release/` 被忽略）；③ `pack-local.bat`（及分别传 `output`/`core`）在 `scripts\` 生成对应 zip，解压后为扩展内容根目录。

### 适配：更新历史页识别 v1.5.6 的 Markdown 条目（`src/configUI/component/updateLog.vue`）

历史日志 `updateContent.txt` 里，v1.5.6 之前的版本条目都是「`"新增干员：xxx",`」这种带引号/逗号的写法，而本版 `2026.10.12 v1.5.6` 改用了 Markdown：`- **新增皮肤**: xxx`、行内代码写成转义反引号 `` \`code\` ``。`updateLog.vue` 的 `formatUpdateItem` 只做了旧格式的关键词高亮，没处理 `- `、`**`、`` \` ``，于是新版条目在「更新历史」页原样显示一堆 `**`/反斜杠、读不出来（版本号 `2026.10.12 v1.5.6` 本身能被 `parseUpdateLog` 的正则识别，问题出在条目正文渲染）。

- `src/updateLog/markdown.js`：把内部助手 `renderInline` 改为 `export`（行为不变），供历史页复用同一套行内 Markdown 渲染（`**粗体**`/`` `代码` ``/`~~删除~~`/`[链接]()`），与更新公告口径一致。
- `src/configUI/component/updateLog.vue`：重写 `formatUpdateItem`，五步顺序固定——①还原转义反引号 `` \` ``→`` ` ``；②去掉行首 Markdown 列表标记 `- `/`* `/`+ `（条目本身已是 `<li>`）；③还原历史实体的 `&lt;/&gt;`（`<br>`、`<s>` 等仍按原样渲染，老格式不受影响）；④`renderInline(text)` 渲染行内 Markdown；⑤关键词高亮。
  - 关键坑：原实现直接在整串上跑 `修复.*?的bug` 这类可跨标记的正则做 `<span>` 包裹；改成先渲染 HTML 再高亮后，若仍整串替换，`<span>` 会把 `<strong>`/`<code>` 夹在中间 → 标签错位、整卡片染色。故新增 `highlightPlainText()`：用 `/(<[^>]+>)/` 切分，**只在标签之外的文本片段**做高亮替换，保证 HTML 结构合法。
  - 已知降级：像 `**修复**：\`x\`…的bug` 这种「修复」与「的bug」被 `<code>` 隔开的情形，跨标签的高亮不再命中（粗体标签本身已表意，可接受）。
  - 顺带清理：`updateLog.vue` 模板里 `v-for="(version, index)"` 的 `index` 未使用（`vue/no-unused-vars`），删为 `v-for="version in ..."`。
  - 样式：`.update-item` 内新增 `:deep(code.md-code)/:deep(strong)/:deep(a.md-a)/:deep(del)` 规则（`v-html` 内容不带 scoped 属性，必须 `:deep`），深色面板上代码块用金色底、粗体金色。
- 校验：`vue/compiler-sfc` parse+script+template+style 全通过、`pnpm eslint src/configUI/component/updateLog.vue` 无报错；已用真实 v1.5.6 各条目 + 老格式条目 + 含 `<s>`/`<br>`/通配 `/*` 的条目跑 `renderInline`+`formatUpdateItem`，逐条断言**标签平衡（无错配）**、`**`/`` \` ``/`- ` 均消失、`/*` 安全留在 `<code>` 内。**未游戏内实测**（browser MCP 起不了 dev app）。`markdown.js` 仍有一条**改动前既有**的 `no-control-regex`（第 121 行 `\u0000` 占位符，非本次引入，未触碰）。
- 手动验证清单：①「设置 → 更新历史」v1.5.6 卡片条目显示为「**新增皮肤**：…」（粗体生效、无星号/反斜杠/短横），代码项如 `override.ts` 呈代码样式；②v1.5.1 及更早的引号型条目照常显示、关键词仍着色；③`GALLUS²`、`/*` 等不被误当强调；④含 `<s>沟槽的</s>`、`<br>` 的老条目渲染与改造前一致。

### 实现：旅骨（`lvgumrfz`）技能「奋身」（`fenshenmrfz`）

按 `fenshenmrfz_info` 描述把原先只有 `audio` 的空壳技能补全为「当有角色勾玉颜色变化后，你可以…」的三选一触发技。`src/packs/character/lvgumrfz.ts`。

- **触发映射**：描述里的「勾玉颜色变化」按引擎语义映射为 `trigger:{ global: "changeHp" }`（体力实际增减时触发；`loseMaxHp` 不走 `changeHp`，故背水减上限不会自触发）。「目标角色」取 `trigger.player`（本次体力变化的角色，含旅骨自己）。
- **三选一交互**：`player.chooseControl({controls:list})` + `prompt2` 展示技能全文 + `cancel2` 放弃；list 按当前可选项动态拼（体力≥2 才有选项1、有手牌才有选项2、体力上限≥2 才有背水），全不可用则 `filter` 直接返回 false 不打扰。
- **选项1「失去体力」**：`Math.ceil(hp/2)` 向上取整流失体力（要求 `hp≥2`，避免自入濒死），随后你与目标各摸 1 张（`player.draw()` / `target.draw()`，目标为旅骨自身则共摸 2 张）。
- **选项2「弃牌用锦囊」**：弃一半手牌 `Math.max(1, floor(h/2))`（向下取整、至少 1，与选项1的向上取整刻意不对称）。用 `player.chooseToDiscard({position:"h",selectCard:num,forced})`——经查 content 尾部（`content.ts:6104`）`chooseToDiscard` 未设 `chooseonly` 时会自动 `player.discard`，故**不再重复弃置**。再 `chooseControl` 选一张多目标锦囊（池= `nanman/wanjian/taoyuan/wugu`，皆 `selectTarget:-1` 群体牌；`shandian` 单体故排除），用 `get.autoViewAs({name})` + `chooseUseTarget({card}).set("viewAs",true)` 视为使用。
- **背水**：`loseMaxHp(1)` → 摸（新）体力上限张牌 → `addTempSkill("fenshenmrfz_beishui","roundEnd")` → `delete player.getStat("skill").zuoqianmrfz` 重置「座浅」的 `usable:1`。背水增益做成 `subSkill.beishui`（`mark`+`intro`+`mod.cardUsableTarget`）：`cardUsableTarget(card,player,target,result)` 命中 `target.getDamagedHp()>0` 返回 `true`、否则透传 `result`，正是 `cardUsable` 次数用尽后按目标放行的钩子（`index.js:11512/11664`），实现「本轮对已受伤角色使用牌无次数限制」。临时 subskill 仅在 `addTempSkill` 后进入 `getModableSkills`（对齐 `dekesasimrfz` 的 `jianyumrfz_debuff` 先例），平时不常驻。
- **递归锁**：选项1自身 `loseHp` 会再次触发 `changeHp`，用 `player.storage.fenshenmrfz_lock` 仅在 `loseHp` 前后加解锁拦截自我连锁（try/finally 保证释放）；选项2 锦囊造成的对他角色伤害**仍会合法连锁**触发奋身（资源单调收敛，不会无限）。AI：`get.attitude2` 判敌友，倾向背水爆发→群体锦囊→摸牌，其余 `cancel2`；锦囊选择同理偏好。
- 校验：`pnpm eslint packages/extension/WhichWay/src/packs/character/lvgumrfz.ts` 通过（EXIT=0）。**未游戏内实测**（browser MCP 起不了 dev app）；构建由你自行执行。多目标锦囊池取标准四群体牌，若设计上还想纳入其它群体锦囊（如 `huogong`/`leifu` 等扩展牌）可再调整。






### 重构：旅骨「奋身」（`fenshenmrfz`）按评审意见 v2（`src/packs/character/lvgumrfz.ts`）

上一版实现被判定不符合要求，按 5 条评审意见重写（触发/背水/多目标判断/自我来源/选项归属全部改指到既有参考技能）。

- **① 勾玉颜色变化触发 → 参考 `olzhuohun`**：`trigger` 由 `{global:"changeHp"}` 改为 `{global:["changeHpAfter","loseMaxHpAfter","gainMaxHpAfter"]}`；`filter` 采用 `get.hpColor(changed)` 与 `get.hpColor({hp:originalHp,maxHp:originalMaxHp})` 比较，并复刻 `olzhuohun` 的 `_status.globalHistory[last]["everything"]` 去重循环，使一次颜色跃迁只在「结算后定格」的那次变化事件上触发一次（`loseMaxHp` 也计入，故背水减上限同样是合法触发时机）。
- **④「不因【奋身】」判断 → 参考 `zishu`**：`filter` 首行 `if (event.getParent("fenshenmrfz", true)) return false;`（`forced=true` 才会在找不到时返回 `undefined` 而非 `{}`）。技能 content 事件名即 `fenshenmrfz`，其内 `loseHp`/视用锦囊/`loseMaxHp` 引发的再次变化，父链命中即被排除。据此**删除了 v1 的 `player.storage.fenshenmrfz_lock` 递归锁**，并同步把 `fenshenmrfz_info` 描述订正为「当有角色勾玉颜色**不因【奋身】**而变化后…」。
- **⑤ 选项归属 → 参考 `mbhanyong`**：三选一的 `chooseControl` 从 `content` 迁入 `async cost(...)`，返回 `event.result={bool:true,cost_data:{key}}`；`content` 只 `event.cost_data.key` 分支执行（选项按当前可行动态生成，全不可用则 cost 空返回、不弹框）。
- **③ 多目标锦囊判断 → 参考 `tyxunshi`**：不再硬编码 `nanman/wanjian/taoyuan/wugu`，改为 `getMultitargetTricks()` 扫描 `lib.card`，以 `info.multitarget || info.ai?.tag?.multitarget` 判定（`tyxunshi`/引擎的 multitarget 标记；标准群体牌该标记在 `ai.tag`，故一并纳入），随本体/扩展群体锦囊自动扩展。
- **② 背水机制 → 参考 `mbhanyong`**：`loseMaxHp(1)` → 摸（新）体力上限张 → `addTempSkill("fenshenmrfz_beishui","roundEnd")` → 重置【座浅】`usable`；增益仍为 `subSkill.beishui.mod.cardUsableTarget`（命中已受伤目标放行次数限制）。
- 校验：`pnpm eslint packages/extension/WhichWay/src/packs/character/lvgumrfz.ts` 通过。**未游戏内实测**（browser MCP 起不了 dev app），构建由你自行执行。
