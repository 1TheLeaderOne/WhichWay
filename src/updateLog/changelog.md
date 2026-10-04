# 瑰丽理想 WhichWay 更新日志

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
