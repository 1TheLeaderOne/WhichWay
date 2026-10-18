# 瑰丽理想 WhichWay 更新日志

## 2026-10-18

### 调整：设置界面默认显示 `autoLoad: true` 的面板（无标记时退回第一个）

- **现象与根因**：`configUI/main.vue` 的 `onMounted` 总是把 `currentPanel` 设为 `panels[0]`（更新公告），`autoLoad` 只用来触发 `onLoad` 回调、不影响选中项；因此「征稿在前」虽然标了 `autoLoad: true`，打开设置界面时默认显示的仍是「更新公告」。
- **修复**：`onMounted` 改为 `const defaultPanel = panels.find(p => p.autoLoad) || panels[0];`，选中该项并在有 `onLoad` 时调用；`panels` 为空则直接返回。用户手动点选面板的逻辑（`selectPanel`）保持不变。
- 校验：`pnpm eslint` 该文件通过；构建通过，产物 `chunks/configUI.js` 为 `c.find(t => t.autoLoad) || c[0]` 且随后 `g.value = s.name`。**未游戏内实测**：打开设置界面应默认停在「征稿在前」并高亮菜单按钮。

### 修复：扩展内绕过引擎、直接 `new Audio` 播放的配音/音效不受无名杀「游戏音量」控制

- **现象与根因**：网络配音（PRTS，`whichWayWebPlay` / `whichWayWebPlayDie`）是扩展自己 `new Audio(url)` 播的，没设 `volume` ⇒ 浏览器默认满音量；而引擎自己的音频在 `game.playAudio` / `playSkillAudio` 里统一设 `audio.volume = lib.config.volumn_audio / 8`（`game/index.js:2505`、`:2725`，`volumn_audio` 取值 0~8、默认 8）。所以调低「游戏音量」后本体音效会变小、这些配音仍是满音量。本地配音多数走引擎 `game.playAudio` 是正常的，但代码里还有三处同样直接 `new Audio` 的漏网：`whichWayUtil.playSound`（克洛丝技能）、`char_4162_cathy` 的变身/还原音效、`kelisitengmrfz` 的菜单语音。
- **修复**：上述 6 个 `new Audio` 站点全部在 `play()` 之前补 `audio.volume = lib.config.volumn_audio / 8;`（换算与引擎逐字一致，创建时读取，行为等同引擎「每次播放新建 audio 时应用当前音量」）：`audio/webPlay.ts`、`audio/webPlayDie.ts`（各补 `import { lib } from "noname";`）、`utill.js` 的 `playSound`、`char_4162_cathy.ts` 两处、`kelisitengmrfz.ts` 一处（后三者已有 `lib` 导入）。
- 校验：`pnpm eslint` 六个文件在改动行上无新增报错（`char_4162_cathy.ts` / `kelisitengmrfz.ts` 共 19 条 `no-var` 是这两份文件里既有的 `var` 书写，与本次改动行无关）；构建通过，产物里六处都落地：`chunks/audio.js` 2 处、`chunks/utill.js` 1 处、`chunks/packs.js` 3 处，均为 `*.volume = *.config.volumn_audio / 8`。**未游戏内实测**：需人工把「游戏音量」调到一半，分别触发一次在线技能配音、一次「行动失败」阵亡配音、克洛丝技能音效、断铁变身/还原音效与凯尔希菜单语音，确认响度与本体一致。

## 2026-10-17

### 修复：把「审计出的高/中/低已复核问题」逐条落到源码（card / character / nonameEx / skin / extCompatible / 注册链 / GloriousIdeal）

用户要求「修复高、中、低三个已复核问题，其余问题请忽略」。**开工前提（诚实说明）**：上一轮的审计报告原文没有落盘（临时目录只剩中间产物），所以下面每一条都是重新读代码、并去引擎实现（`apps/core/noname/**`）核对契约之后**二次证实**才动手的；证实不了的宁可不动，全部列在末尾「只报告、未动手」。第四节（已推翻）与第五节（存疑）按要求整体跳过。

- **`packs/card/sjzx_zhuihuomrfz.ts`（A-2，火焰伤害打两次 + 来源写错）**：`.damage({ nature: "fire" }).set("source", "nosource")` 是把字符串 `"nosource"` 当成 source 事件属性写进去（引擎读的是 `event.nosource` 布尔），而且没写 `num`；两个分支还都缺 `return`，第一个分支打完会继续落到下面 `result?.bool` 的 else 再吃一次。改为 `player.damage({ num: 1, nature: "fire", nosource: true })` 并在每个分支后 `return`。
- **`packs/card/ksl_lulitongxinmrfz.ts`（filterTarget 形参倒置）**：`filterTarget` 的引擎签名是 `(card, player, target)`，原来写成 `(card, target, player)` ⇒ 判定里 `player`/`target` 互换，合法性完全反了。`char_459_tachak.ts:76` 有同一写法，但它不在清单里，见末尾「待裁决」。
- **`packs/card/dazijimrfz.ts`（技能 id 写错）**：`player.hasSkill("dazijimrfz_buff")` 里没有这个技能（真正的大自在 buff 是 `dazijimrfzskill_buff`），恒假 ⇒ 已经挂着 buff 的角色会被再挂一次。
- **`packs/character/char_4177_brigid.ts`（三岩的减伤从未生效）**：`subSkill` 只声明了名字，没有对应的技能条目。`Player.addSkill` 在 `lib.skill[id]` 不存在时**直接 return** ⇒ 名字进不了 `skills`，`hasSkill("sanyanmrfz_recovered")` 恒假（引擎确实会把 subSkill 注册成 `父_子` 键，见 `library/zhanfa.js:3119`、`game/index.js:8761`，所以补上子技能定义就能生效）。在 `count` 之后补 `recovered: { silent: true }`。
- **`packs/character/char_206_gnosis.ts`（“已用花色”标记既不上屏也清不掉）**：`addTempSkill`/`markSkill` 用的 `siyongmrfz2` 在 `lib.skill` 里根本没有条目，而 `markSkill` 无 `info` 时要读 `lib.skill[name].intro`，读不到就 return（`player.js:10495`）。补技能条目：`silent` + `intro.content`（显示 `get.translation(storage) + "已用花色"`）+ `onremove` 删 storage，避免到期后 storage 残留。
- **`nonameEx/custom/override.ts`（兵临城下「弃牌」分支永远走不到）**：`player.chooseControl({...})` 既不 `await` 也不 `forResult()`，紧接着读的 `result` 还是上面那次判定的结果（没有 `control` 属性）⇒ 只会平白吃一次伤害，且控件还没点完结算就抢先跑完。改成 `const { control } = await player.chooseControl({ controls, ai }).forResult();`（规范见 `nonameEx/library/element/content.ts:3657`）。
- **`nonameEx/library/element/player.js`（隐匿一次就把武将定义改坏）**：`reUnseen` 里 `var skills = lib.character[name][3];` 拿的是**定义本体**——`game.addCharacter`（`game/index.js:6031`）把同一个数组引用同时存进 `lib.character` 和 `lib.characterPack`，原来的 `add`/`splice` 就地作用在它上面 ⇒ 二技能牌名被并进主技能、没有 `_info` 翻译的技能被永久删除，下一局这个武将的技能列表就是坏的。改成 `.slice(0)` 取副本。
- **`nonameEx/custom/weina.js`（伪裔时机清单恒为全集）**：`if ((!name) in this.translation)` 里 `(!name)` 是布尔，`true`/`false` 不可能是翻译表的键 ⇒ 条件恒假，一个时机都没剔除，返回的是整个 `lib.hookmap`；而且边遍历数组边 `names.remove()` 会跳过被前移的下一项。改成 `Object.keys(this.name).filter(name => name in newTranslation)`（判据用 `newTranslation`：上一步已把裸时机名展开成 `xxxBegin`/`xxxAfter` 并删裸名，只有落在这张表里的时机才有中文名可显示）。
- **`nonameEx/get/index.js`（四处）**：① `lib.card[name]` 取到 `undefined` 时后面读 `info.notarget` 直接抛 TypeError ⇒ 补 `if (!info) return 0;`；② `Math.max(info.selectTarget)` 传数组恒 NaN（先转成 `"1,2"` 再转数字），改 `Math.max(...info.selectTarget)`；③ `!info.notarget && info.selectTarget && info.selectTarget === 1` 中间那段多余，且 `selectTarget` 未定义时返回 `undefined` 而非 `false`（与 `@return {boolean}` 不符），改为 `!info.notarget && info.selectTarget === 1`；④ `isView` 的数组分支只调用递归却不 `return` ⇒ 数组进来恒返回假，改成「有一张命中即 true，否则 false」。
- **`extCompatible/decade.js`（十周年动画补丁重复安装）**：`disableAnimation()` 每次执行都往 `AnimationPlayer.prototype` 上装包装，`copyPlaySpine` 记的却是**上一层包装**而不是原始实现 ⇒ 配置从 `partly` 直接切到 `disable` 后再切回「启用」，动画永久坏掉。首行加 `if (decadeUI.AnimationPlayer.prototype.copyPlaySpine) return;` 幂等守卫，`copyPlaySpine` 改记 `originalPlaySpine`。顺带修同文件的 `whichWayUtil.config === "partly"`——比的是函数本身，恒假，应为 `whichWayUtil.config("banDecadeUIAnimation") === "partly"`。
- **`skin/spineWork.js`（动皮计时器从没清过 + 无配置时崩）**：缓存结构是 `spineCache.get(dynamicName)[playerid][action]`，判断里多写了一层 `[dynamicName]` ⇒ 取到 `undefined`，`clearTimeout` 永不执行，同一动作连播会叠两个计时器、先那个提前收掉画面。另一处 `actionConfig` 缺失只 warn 不 `return`，紧接着建 `SpinePlayer` 读 `actionConfig.action` 抛 TypeError，还把立绘层 `display:none` 留下没人恢复 ⇒ 补 `return`。
- **`skin/index.ts`（四处）**：① `init()` 是模块顶层 `await whichWaySkin.init()` 的一环，皮肤数据/位置档案一抛（无 fs 后端、首帧写缓存失败）整个 `init()` 就 reject，后面的 `onInit`/`onConfig`/`onArenaReady` 全不注册 ⇒ 配音、模组、干员连带失效，链尾补 `.catch` 只降级皮肤层；② `mode === "piqie"` 里 `{ ...lib.config.sjzxDycAssets }` 是浅拷贝，随后的 `skin.action = skin.action[0]` 写在嵌套对象上 ⇒ **直接改到 lib.config 里那份存盘数据**，数组形态被永久削成字符串，改 `structuredClone(lib.config.sjzxDycAssets ?? {})`（引擎本身已在用 `structuredClone`，见 `game/index.js:7142`）；③ 「更新皮肤数据」按钮只在 `.then` 里复位 `updatingSkinData`，`autoUpdateSkinData` 一 reject 就永久停在 `true`，之后每次点都只弹「请勿重复操作」，改成 `try/catch/finally`，失败也别再报「更新完成」；④ 皮肤键名用 `file.name.replace(".jpg","").replace(".png","")`，`a.png.jpg` 这类名字会被剥两刀，统一走 `whichWayFile.removeExt(file.name)`。
- **`packs/hooks.ts`（两处「看着有效其实是空操作」）**：① `[...hooks].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))` —— 注册路径只 push `{ key, obj }`，没有任何 API 能传 `priority`，每项都是 `undefined`，排序恒为 `0-0`；既然不生效就删掉这个「支持优先级」的假象，执行顺序即注册顺序；② `finalValue = fn(obj, key, hookName) || finalValue` 两个毛病：传 `obj` 让每个 execute 都从原始值起步（后一个覆盖前一个，链式预处理失效），而 `||` 又把合法返回的 `0`/`""`/`false` 当成「没返回」退回原值 ⇒ 改为 `const next = fn(finalValue, key, hookName); if (next !== undefined) finalValue = next;`。
- **`packs/index.ts`（三处）**：① 声明了 `CHARACTER_PACKS` 之外的包名（多半写错）时 `lib.characterPack[data.pack]` 是 `undefined`，`[name] ??=` 抛 TypeError 打断**整批** character 注册 ⇒ 兜底建表并 `console.warn`；② 统一势力分支只补了 `lib.translate["sjzx_group"]`，`sjzx_group` 从来不在 `lib.group` 里（分立势力分支会注册），`game.countGroup()`（`game/index.js:10321`）按 `lib.group` 枚举 ⇒ 按势力判定的技能把干员当未知势力，补 `lib.group.push`；③ 每次启动无条件 `lib.config.cards.push("mrfzcard")` ⇒ 玩家在「卡牌包」菜单关掉它，重启就被强开，改成用 `extension_WhichWay_cardPackDefaulted` 标志只在首次默认加入并 `saveConfig`，之后尊重玩家开关。
- **`packs/base/index.ts`（`getDesigner` 的 `fromStorage` 对对象入参完全不起作用）**：调用方（`packs/index.ts`「都没声明才查设计者记录」）传 `true` 期望读 `charDes`，但记录查询只写在字符串分支 ⇒ 对象进来一路掉到缺省设计者。补 `if (fromStorage && config.charId)` 读 `whichWayCharacterPack.designer[config.charId]`。
- **`GloriousIdeal/battleHost.ts`（A-12：`directstart` 泄漏给父实例下次启动）**：iframe 子实例靠 `localStorage.setItem(lib.configprefix + "directstart", "true")` 静默 boot，引擎在 `init/index.ts:476` 消费后自行清掉——但前提是这个子实例真的启动了。看门狗超时与「建 iframe 失败」两条兜底路径都直接 `finish(fallbackResult(init))`，标志原样留在 localStorage ⇒ 父实例**下一次开游戏跳过选模式直接开局**。在 `cleanup()` 里补 `localStorage.removeItem(...)`（`finish` 必经，正常路径下子实例已自清，重复 remove 无害）。
- **`GloriousIdeal/state/campaign.ts`（三处）**：① `unityGrowMod` 用 `UNITY_TIERS.find(t => unity >= t.min && unity <= t.max)`，而团结度可以是小数（`starvation` 是 `-0.2`）⇒ `50.5`/`100.5` 这类值掉进档位间隙，倍率静默变成 `0`（阶梯修正失效），取整后落档；② `beginRun` 里 `hp` 直接按引用进 `run.hp`（`maxHp` 却拷了），而调用方 `ui/store.ts:379` 随后 `view.dungeonHp = hp` ⇒ 战役内的缺粮/障碍/战斗结算写 `run.hp` 会同时改到 UI 那份「副本外快照」，改成 `{ ...hp }`；③ `ensureShopToday` 的条件 `if (s.day === this.data.day && s.stock.length) return;` 与它自己的文档注释（「跨天则重 roll」）矛盾：当天货架被买空后重开商店会**免费补满库存**，顺带把 `s.refreshLeft` 重置回当日额度 ⇒ 刷新次数等于无限。改为同一天直接返回。
- **`GloriousIdeal/ui/components/common/StatusBar.vue`（结束旅程误点即清档）**：`endJourney()` 里 `clearCampaignSave()` 直接抹存档，按钮却是一点就走。改成与 `DungeonView.vue` 的「撤退」同一套二次确认（`endAsk` + 再想想 / 确认结束），文案 `清空存档、回到标题？`，样式复用全局 `gi-btn-*`。

**只报告、未动手**（证实了现象，但正确做法要作者意图）：

- `packs/character/char_300_phenxi.ts:17` 的 `hasSkill("lvwaimrfz_ban")`：全仓库没有这个技能的定义，也没有任何授予方 ⇒ 恒假。但它的语义是「没有禁止方就照常发动」，补定义或删判定都会改变技能行为，需要确认「禁止方」本应由谁给。
- `packs/index.ts:113-117`、`:21`（后者在注释里）：现象存在但属于既有约定，不在本轮清单内。
- `packs/hooks.ts:194`（校验本身是对的）、`:227`（重复 key 直接抛错是设计选择，改成覆盖会掩盖注册冲突）。
- `GloriousIdeal/battleHost.ts` 的另外两条同源风险：`gi-battle-ready` 一到就 `clearTimeout(watchdog)`，此后再无任何兜底 ⇒ 子实例 boot 完却不回传 `gi-battle-result`（真人局时长无界，不能简单加超时）会让 `runBattle` 永不 settle、`message` 监听常驻；`sendInit()` 只在 RAF 动画走到 `fade` 时下发 ⇒ 后台标签页 RAF 被节流时 init 永不下发。这两个都需要设计「谁负责判死」，不是可证的最小修复。

**判为假阳性**（复核后确认不是问题）：A-3、A-4、A-6、A-11①、`cuoe` 的 `failToUse`、`teleixiyamrfz:49`、`puruisaisimrfz:474`、`amiya:92`。

**待裁决**：`packs/character/char_459_tachak.ts:76` 与本轮已修的卡牌侧 `filterTarget` 形参倒置是同一类问题（引擎签名 `(card, player, target)`），已确证但**不在清单里**，没有动，等一句「要不要一起改」。

- 校验：`pnpm eslint` 跑全部 15 个改动文件 ⇒ 新增/改动文件 0 error；`weina.js`（78/82/351 `no-prototype-builtins`）与 `player.js:289`（`no-self-assign`）共 4 条报错**是既有债务**，用 `git show HEAD:…` 逐行比对确认行号与内容在改动前就存在，未顺手改（改这些会扩面到无关代码）。`WW_SKIP_STATIC_COPY=1 pnpm -F ./packages/extension/WhichWay build` 通过，并到产物里逐条抽查落地：`chunks/GloriousIdeal-battleHost.js` 含 `removeItem(lib.configprefix+"directstart")`；`chunks/GloriousIdeal-battleOverlay-shared.js` 含 `Math.floor(this.data.unity)` 与 `清空存档、回到标题`；`chunks/packs.js` 含 `siyongmrfz2` 与「已用花色」；`chunks/` 里还能搜到 `copyPlaySpine`、`cardPackDefaulted`、`sjzxDycAssets` 的新写法。**未游戏内实测**：需要人工确认的四件事——三岩【三岩】减伤触发后 intro 是否显示（此前恒不显示）、兵临城下「弃牌」分支现在能否选到、十周年动画在 `partly ⇄ disable` 来回切一次后是否还能恢复、瑰丽理想打完一场战斗回到标题后**下一次开游戏**是否还弹选模式（这条正是 A-12 的验收点）。

## 2026-10-16

### 撤回：立绘「放大画布 + 夹取」方案（方向错了，已完整回滚）

上一条记录的 A″ 方案（内层换成 Z 倍画布 + `left/top` 定位 + `|x|,|y| ≤ |Z−1|/2` 夹取）**用户判定不符合预期，已全部撤回**，代码回到改动前状态（`PortraitLayers.vue` 从嵌套 git 工作树恢复，`avatarBackground.ts`/`portraitPos.ts`/`portraitDrag.ts`/`portraitPosSetting.vue` 逐处改回原文，本轮未提交任何东西，所以撤回就是改回文本而不是 `git checkout` —— 这几个文件里还有此前会话的未提交内容）。

- **为什么错**：用户点出「有些立绘本来比框大得多，只是因为大小关系其余部分被截掉了；到了边界应该把被截掉的部分露出来，而不是把移动限制住」。这条批评成立，而且指出了我方案的根本缺陷：截断发生在 `cover` 的**绘制阶段**（贴合系数按框的宽高比裁掉原图，横图塞进竖框能裁掉 60% 的宽度），画布无论多大、怎么夹，`cover` 出来的内容与裁掉的量都不变 ⇒ 夹取只是把「空白」换成「拖不动」，被裁掉的画面依然看不到。正确的方向是**让内层承载完整原图**（按原图自身宽高比铺），框只是取景窗，平移就是在这张完整的图里取景，边界由原图自己的边缘决定。
- 保留下来的**有效副产品**（重做方案时要一并带上，别丢）：① 引擎全局 `div { transition: all 0.5s }`（`apps/core/layout/default/layout.css:31`）一直在给内层的 `transform` 加 0.5s 缓动 ⇒ 拖动慢半拍、松手后画面还在追，绘制层必须显式 `transition: none`；② 用「内层元素自身尺寸」代替 `transform` 来承载缩放，比重绘走一遍 `createVNode + render()` 更省（每次重绘只剩几次样式写入）。
- 下一步（待用户审阅方案后再执行）：内层改为**永不自裁**的完整原图画布，`pos.json` 的 `x/y/scale` 单位与含义不变，可拖范围由「原图边缘」而非「框边缘」决定。


### 改动：立绘内层改成「装着完整原图的 `<img>` 画布」，拖到边界显示被裁掉的部分（方案 B1）

按上一条的批评重做。用户确认的两个选择：**B1（内层用 `<img>` 承载完整原图）** + **硬停在原图边缘（永不露白）**。

- **几何（`src/skin/portraitPos.ts` 新增 `getCover` / `clampOffset` / `PortraitCover`）**：内层画布的宽高比取**原图**的，尺寸取「`scale` 倍框」的 cover 贴合矩形 —— `cover.x = scale·max(1, 原图比/框比)`、`cover.y = scale·max(1, 框比/原图比)`。贴合那一轴恰好 `scale` 倍框边长（所以默认 1.5 的画面与改动前 `transform: scale(1.5)` 逐像素一致），溢出那一轴则是 `scale × 两边宽高比之比` —— 那一截正是旧 `cover` **从来没画出来**的内容，现在它实实在在在 DOM 里，拖过去就能看到（实测一张 2000×1200 的皮肤进 114×174 的武将卡：`cover.x = 3.82`，也就是可拖范围从旧写法的 ±0.25 变成 ±1.41，老存档里 `x=0.79` 这种过去被判为「越界」的值现在落在合法范围内、显示的是真正的原图像素）。
  - 定位不用 `transform`：`width/height = cover·100%`、`left/top = (50 + v·100 − cover·50)%`，四个值全是相对框的百分比 ⇒ `pos.json` 的 `x/y` 单位（偏移 ÷ 框尺寸）直接线性还原，与分辨率、与 `ui_zoom` 都无关，`portraitDrag.ts` 的换算一行都不用改。
  - 夹取 `|x| ≤ |cover.x − 1| / 2`（`y` 同理）：`cover ≥ 1` 时上限就是**原图自己的边缘**与框边齐平的位置，再往外只剩背板 ⇒ 硬停在图边缘；取绝对值是为了兼顾滚轮缩到 `cover < 1`（立绘比框小）的情况，那时同一条界限变成「整张画布留在框内」，能挪但不能探出框外。旧写法在 `cover < 1` 时会把界限算成负数、把 `x=0` 拖成非零，`Math.abs` 顺带堵掉了这个坑。
- **绘制侧 `src/skin/PortraitLayers.vue`**：内层由 `div` + `background` 换成 `<img>`，props 契约（`image`/`offsetX`/`offsetY`/`scale`）不变，`avatarBackground.ts` 的挂载与 `render()` 调用点一字未动。
  - **原图比例怎么来**：`img.naturalWidth/naturalHeight`（读解码尺寸，**不碰布局**，不像 `offsetWidth` 会强制重排）在 `load` 时取；框比例取外层（= 宿主节点尺寸）的 `clientWidth/clientHeight`。量不到任何一个时退回 `{x: scale, y: scale}`，配 `object-fit: cover` 就正好是旧画面 ⇒ 首帧绝不会是空白，图加载完只是让画布在溢出轴变大、多显示内容。
  - **为什么要 `ResizeObserver`**：`paintPortrait` 常常在节点还没进文档时就跑完（`$init` 途中），那一刻 `clientWidth` 是 0、框比例量不到，画布会永远停在兜底的「框 × scale」，完整原图白装。观察者负责元素真正有尺寸时补测一次；回调只写一个 ref、不改观察目标尺寸，不会出现回环告警，`onBeforeUnmount` 里 `disconnect`。
  - `imgSrc` 从 `url("…")` 里拆裸路径，空串 / `none` / `url(undefined)` 一律当没图（`v-if` 直接不渲染）并带 `@error` 兜底 —— 否则会去请求一个必然 404 的地址，在卡面正中挂出一枚碎图图标。另加 `draggable="false"`、`pointer-events: none`、`user-select: none`，`object-position: center top` 与引擎给立绘的 `background-position` 对齐。
  - 两层都显式 `transition: none`（撤回说明里的副产品①：`layout.css:31` 的全局 `div { transition: all .5s }`）；`portraitUseCover`（「立绘/皮肤直接用 cover 铺满」）改在这里现取（函数而不是 `computed`，理由不变：`lib.config` 不是响应式数据），开启时按 `{x:0, y:0, scale:1}` 画 ⇒ 画布正好等于框的 cover 贴合矩形，与引擎原生 cover 一致。
- **`src/skin/avatarBackground.ts`**：新增 `getPortraitCover(node, scale)` —— 从 `layers.host` 里取 `<img>` 的 `naturalWidth/Height` 与承载层 `clientWidth/Height` 算出当前画布的覆盖倍数，读不到（图未解码、节点未入文档）返回 `undefined`。对外契约（`mountPortrait`/`hasPortraitLayers`/`repaintPortrait`/`getPortraitKey`）不变，影子副本照旧是「未调位的原样」，三处读不到子元素的地方（战报浅克隆、`smoothAvatar`、`ui.fakeme`）行为不变。
- **拖拽侧 `src/skin/portraitDrag.ts`**：`apply()` 先 `getPortraitCover(node, next.scale)` 再 `clampOffset` 才写 `setPos`/`repaintPortrait` ⇒ **存的东西与画面一致**（绘制侧还会再夹一次兜底，但那样 HUD 会显示越界值、且下一次 `moveBy` 是从越界值起算，等于「死区」）。模块头原来写着「本模块改的是 CSS `transform`」，改为「改的是 `pos.json` 的偏移比例与倍率」，并说明拖过头会停在原图边缘。
- **文案**：`PortraitPos.scale` 补「画布 = `scale` 倍框的 cover 贴合矩形，倍率越大可拖范围越大」；开发面板 `portraitPosSetting.vue` 的模块头与读数旁提示改成「内层是完整原图的画布，框只是取景窗」「可拖范围 = 原图比框多出来的那一截，拖到图边读数停住 ≠ 拖拽失灵」。
- 校验：`pnpm eslint` 五个改动文件全通过；`WW_SKIP_STATIC_COPY=1` 构建通过，产物 `chunks/skin-PortraitLayers-shared.js` 里 `translate(`/`transform:` 均 0 命中，能看到 `<img>` 分支（`v-if="imgSrc && !imgBroken"`、`onLoad`/`onError`）、百分比样式数学 `left: ${50 + x·100 − cover.x·50}%`、`querySelector("img")` 版 `getPortraitCover`，以及夹取函数 `Math.abs(cover − 1) / 2`；`css/viteAutoCreateStyle.css` 的 `.sjzxPortraitImage` 已变成 `object-fit:cover;object-position:center top;transition:none;pointer-events:none`，`.sjzxPortraitWrapper` 带 `transition:none`。几何用 node 遍历 13 种原图比例 × 5 种框比例 × `scale∈{0.2…5}` × 11 个偏移（35,035 组）演算：`cover ≥ 1` 的轴上画布**恒包住框**、`cover < 1` 的轴**恒在框内**，0 例违例；画布中心与 `0.5 + x` 误差 0；`clampOffset` 幂等。引擎侧确认 `layout.css` 与各主题 `style.css` **没有任何 `img` 选择器**，所以 `<img>` 不会被全局规则改尺寸。**未游戏内实测**：需要人工看三处 —— 场上头像（主将/副将，尤其横图皮肤能拖出被裁的左右两侧）、选将/对话框武将卡、开发面板预览与拖拽手感（这次应当明显更跟手）；另外首帧「先按框 × scale 画、图加载完再补全」理论上有一次极短的比例跳变，需现场确认是否可接受。


### 改动：把 `skin_table.json` 加进明日方舟数据的更新队列（bat + 游戏内镜像 + 启动不解析）

用户要求 `update-arknight-data` 把 `skin_table.json` 一起下载。这张表此前是「四张表清单里没有的那个孤儿」——`scripts/update-portraits.mjs` 的头部注释就写着**没有任何脚本刷新它**，于是本地那份停在 9/29，新干员在 `character_table` 里有、在 `skin_table` 里一条皮肤都没有（`char_4231_clemnt`/`char_393_toledo`/`char_4232_hbound` 都是这么漏的）。

- `scripts/update-arknight-data.bat`：`FILES` 追加 `skin_table`（第 4 步的安装与第 3 步的比对都是遍历 `%FILES%`，所以清单加一项就够了）；`[2/4]` 的校验规则加 `skin_table:d=>Object.keys(d.charSkins).length>1000`（内联 node 脚本按文件头的约束继续保持不含 `!` 与 `&`；上游真改了字段名就让 TypeError 非零退出 ⇒ 走 `:fail_invalid`，什么都不写）；头部文件清单补 `skin_table.json`，并写明它是这份清单的**例外**——运行时不读，只是开发脚本要按 `portraitId` 反查形态。
- `src/arknight/index.ts`：`updateFile` 同步加 `skin_table`（bat 头部规定两边是镜像，改动顺带给 `updateFile` 补了这条约束的注释）。**关键配套**：`loadSkipFiles` 也加 `skin_table`——启动期 `loadArknightData` 是「扫目录里所有不在 skip 清单里的 json 全读进内存」（`index.ts:99`），不加这一条就等于每次开游戏白解析 2.7MB 且**没有任何运行时代码用它**（运行时的皮肤数据来自 `json/cache/skin.json`）。注释里同时说明：往 skip 清单加文件名**不需要**动 `slimCacheSchema`，因为裁剪只产出 `ArknightSlimData` 那三张表，`skin_table` 从来进不了缓存。
- 连带文案：`scripts/index-menu.mjs` 的菜单摘要「四张表」→「五张表」；`scripts/update-portraits.mjs` 头部「没有任何脚本刷新它」与 `--update-tables` 那行用法说明改成「现在已经会刷新，但新鲜程度取决于最近谁跑过更新脚本」——所以那张「形态全集 = skin_table ∪ 干员表」的并集兜底**照旧保留**，别当成可以删的冗余。
- 校验：把 bat 的内联校验脚本原样拿去跑本地 `json/arknight/` ⇒ 五张表全 `[ OK ]`；`cmd //c update-arknight-data.bat --check --source-only --no-pause` 真实跑通（远端 `skin_table.json` HTTP 200、2,684,928 bytes，比对报 `changed`）；再去掉 `--check` 真装一次 ⇒ 源树与 `apps/core/extension/WhichWay/json/arknight/` 两处都更新，`json/cache/arknight.json` 已删（下次启动重建精简缓存）。新表 `charSkins` 2386→2410 条、顶层键与 `portraitId` 结构不变，且 clemnt/toledo/hbound **三人现在都在表里**（这条改动的直接收益）。`pnpm eslint src/arknight/index.ts` 通过、构建通过，产物 `chunks/arknight.js` 里 `updateFile` 与 `loadSkipFiles` 两个数组都带 `skin_table`。`node --check` 两个改过的 mjs 通过（注：`scripts/*.mjs` 不在任何 lint 目标里，直接 `pnpm eslint` 它们会报成片既有的 `no-undef`，与本次改动无关）。**未游戏内实测**：新装机首次 `autoUpdate` 会多下 2.7MB 这件事只做了逻辑推演。

### 改动：右侧预览区布局回到第一版（左列的干员卡保留）

用户要求把右侧恢复成「修完 `.stageSide` 重叠与 HUD/双经典形象两个 bug 之后的那一版」，所以只撤回右列，左列的武将卡清单是最近这条需求本身，留着：

- 右列恢复 `toolRow → skinRow → stage( previewCard + stageSide )`：`.picker-col` 回到 34%、`.stage-col` 66%；`.toolHint` 恢复 `margin-left:auto`（不再独占一行），长按提示也回到开着拖拽时自动隐去的那句 `右键{{ dragOn ? "" : " / 长按两秒" }}切到下一个干员`；皮肤行 `.skinRow/.skinBtn/.skinBtnActive` 与舞台 `.stage/.stageDragging`（整块背景提亮，而不是只描一圈边）照抄；`.previewCard` 回到 200px 宽、`aspect-ratio:114/174`、`overflow:hidden`，读数列 `.stageSide`（干员名/id/当前皮肤/`x/y/scale` + `.sideTip`）回到它右边。上一版临时加的 `.portrait/.portraitEditing/.previewCard` 组合卡（自带皮肤行 + 读数的那种）整体删除。
- 长按/右键的监听回到 `.stage`（`onStagePointerDown/onStagePointerUp`，`pointerleave/cancel` 一并复位计时器），`.previewCard` 上只留 `@pointerup`/`@wheel` 两个 `posVersion++` 的刷新点——与第一版一致。
- 逻辑侧不动：`skinsOf()`、`chooseSkin()`、`watch(selected)` 的按需复位、选中卡 `scrollIntoView`、以及「右列 `.skinRow` 只渲染按钮、不再自带已调整标记」——标记的唯一出处是左列卡里的 `.skinFlag`。`.sideTip` 多留了一句「预览与场上同一套画法，框外不显示」，那是前几次纠正的结论，跟布局无关。
- 校验：`pnpm eslint` 通过、构建通过；产物 `css/viteAutoCreateStyle.css` 里 `.skinRow/.stageDragging/.stageSide/.sideLine` 全部回来且都带 `position:relative`，`.previewCard[data-v-acbac973]` 为 `width:200px;…;overflow:hidden`，`portraitEditing/cardEditing` 在 CSS 与 `chunks/configUI.js` 中均 0 命中，`.listCard` 仍在。**未游戏内实测**：右侧舞台在 66% 宽、左边还塞得下 210px 卡片列的情况下会不会挤压读数列，需要人眼看。


### 改动：干员列表的每个条目改成武将卡（`charPicker.vue` 开 `#item` 插槽）

用户再次澄清：「改为一个武将卡」指的是 **`char-grid` 下的所有条目**，不是把右下的预览搬到左列 ⇒ 上一节的左右互换撤回（回到「左列搜索+列表 / 右列工具+预览」），条目形态改造落在列表上。

- **`charPicker.vue` 加具名插槽 `#item`**：模板里 `v-for` 的每一项改成 `v-if="$slots.item"` 走 `<slot name="item" :char :active :pick />`、否则维持原来的文字标签，所以配音设置与模组切换两个调用方**一行没动**、观感不变；搜索/过滤/`filtered` 事件仍旧只在本组件里，插槽只负责「长什么样」与「怎么选中」。作用域里的干员id 叫 `char` 而不是 `name`：`name` 会和插槽自身的 `name="item"` 撞成同名属性（`vue/no-duplicate-attributes` 直接报错）。
- **「皮肤位置调整」的条目卡**（`.listCard`）：卡头 = 中文名 + 干员id，卡身 = 该干员**全部**皮肤行（`经典形象` 也在内，沿用「数据里有就不重复兜」的写法），每行右侧「已调整 / 未调整」= `posData[干员id]` 里有没有这个皮肤键。点卡头选人，点皮肤行选皮肤（`@click.stop`，否则冒泡到卡片本体白选一次人）。
  - 取清单从「只算选中项的 `computed`」改成函数 `skinsOf(charId)`：左列要一次渲染所有干员的卡。函数里读 `posVersion`，模板渲染时这条依赖就进了本组件的渲染 effect，所以拖完松手整列的「已调整」一起翻。
  - 配套改的复位逻辑：原来 `watch(selected)` 无条件把 `currentSkin` 打回「经典形象」，会把「点某张皮肤顺带选人」这条路刚选定的皮肤抹掉。改成 `chooseSkin` 先落 `currentSkin` 再落 `selected`，`watch(selected)` 只在「这张皮肤在新干员名下不存在」时才复位（复位本身仍然必要：拿上一个干员的皮肤名去查新的会查不到、画不出）。另外换人后把 `.listCardActive` 用 `scrollIntoView({block:"nearest"})` 滚进可视区——皮肤只能在左列那张卡上选，卡滚出视野就得手翻。
  - ~~右列因此不再自带皮肤清单~~（已被上一节撤回：右列恢复成第一版的 `toolRow + skinRow + stage/stageSide`，左列的卡保持不变）。
- **预览的画法仍旧一动不动**：`.portrait` 保持 `overflow:hidden` 的框内裁切，拖拽态只加一圈 `box-shadow` 亮边，不出现 `contain`/放开 overflow 之类的近似渲染（见上一节的教训）。
- 校验：`pnpm eslint` 两文件通过、构建通过；产物 `css/viteAutoCreateStyle.css` 有 `.listCard/.listSkin/.skinFlag[data-v-350cb50f]`（均带 `position:relative`），`chunks/configUI.js` 里 `$slots.item` 分支存在，另两个调用方（`audioSetting.vue`/`moduleSetting.vue`）未传插槽 ⇒ 仍走默认标签。**未游戏内实测**：一屏几十张卡 × 每张数行皮肤的排版与滚动开销需要人眼确认。


### 修复：撤销「拖拽中显示完整立绘」的渲染改动 + 武将卡从左列改起（`portraitPosSetting.vue`）

> ⚠️ 本节第二条「武将卡搬到左列」已被上一节撤回：要改的一直是 `char-grid` 的**条目形态**，左右位置已恢复成「左列搜索+列表 / 右列预览」。撤销渲染改动那部分仍然有效。

用户实测上一节后给出两条纠正，都成立：

- **展开态那套改动整体撤销**（`.cardEditing` 的 `overflow:visible` / `:deep(div){overflow:visible!important}` / `:deep(.sjzxPortraitImage){background-size:contain}` / 缩小到 150px + `margin-bottom:60px` / 关掉影子副本的 `background-image:none!important` 全删）。原因正如反馈所指：**「把整张图露出来」与「所见即游戏内效果」是同一枚硬币的两面，不可能同时成立**。偏移与缩放是按框的尺寸换算的，`cover → contain` 一改，图的贴合基准就从「按长边铺满」变成「按短边贴合」，同一份 pos 在面板里落在完全不同的位置（严重偏差）；被裁掉的那部分本来就在框外，放开 overflow 只是让它糊到卡片下面的文字与其它层上，加上影子副本/背板层，看起来就成了「多份立绘」。
  - 现在面板只做一件事：**跟场上逐像素同构**。`.previewCard` 恢复 `overflow:hidden` 的那圈裁切，拖拽态只给 `.opCard` 描一圈亮边（`border-color` + `box-shadow`）当模式指示，**不碰立绘的任何画法**。提示语也改成「框外的部分不显示（游戏里也不显示）——拖拽是把想露出的部分拖进框里，不是预览整张原图」。
  - 组件顶注补了这条取舍的理由，防止以后又被当成「忘了做完整预览」重新加回去。
- **武将卡搬到左列**：`.card-col`（36%，含工具行 + 武将卡 + 提示）在左，`.picker-col`（64%，搜索 + 干员列表）在右。工具行的 `.toolHint` 改成 `flex: 1 1 100%` 独占一行——这一列只有三成宽，跟两个按钮横排会把按钮顶出面板。原来包卡片的 `.stage` 舞台层整个删掉（卡片有自己的边框，不需要第二层框），`contextmenu` 换人改绑到 `.opCard`。
- 校验：`pnpm eslint` 通过、构建通过；产物 `css/viteAutoCreateStyle.css` 中 `contain`/`overflow:visible` 相关规则 **0 命中**，`.previewCard[data-v-790bfb0a]` 带 `overflow:hidden`，`.cardEditing[data-v-790bfb0a]` 只剩 `border-color:#1ac2fd;box-shadow:0 0 6px #1ac2fd99`；`chunks/configUI.js` 里 `stageEditing/stage-col` 0 命中、`card-col/cardEditing/已调整/未调整` 均在。**未游戏内实测**：需要确认展开/收起拖拽时立绘位置不再漂移、无重复影像，且左列卡片与右列列表的比例观感正常。


### 改动：开发面板改为「一张武将卡」+ 拖拽中显示完整立绘 + 候选只列方舟实装干员

> ⚠️ 本节第一条「拖拽中显示完整立绘」已被上一节整体撤销（渲染方案会破坏位置一致性），只有「一张武将卡」的数据部分（皮肤清单 + 已调整标记 + 候选过滤）保留下来；卡片现在位于**左列**。

用户提的两条，都落在 `src/configUI/component/portraitPosSetting.vue`（外加 `avatarBackground.ts` 的一行导出）：

- **拖拽时被裁掉的立绘要能看全**。裁切其实有三层，缺一层都露不出来：① 本面板 `.previewCard` 自己的 `overflow: hidden`；② `ensureLayers()` 建的宿主 div，它的 `overflow: hidden` 是**内联样式**，只能 `!important` 盖；③ `PortraitLayers.vue` 外层 `.sjzxPortraitWrapper` 的 `overflow: hidden`（子组件的 scoped 类，要 `:deep`）。而且**光放开 overflow 不够**：背景的绘制区域永远是元素自己的盒子，`cover` 裁掉的像素不会因为你允许溢出就冒出来 ⇒ 内层同时换 `background-size: contain`（按短边贴合，整张必然完整），外层那条 `.cardEditing :deep(div){overflow:visible!important}` 负责 ②③。顺带关掉宿主节点自身的**影子副本**（`mountPortrait` 写在节点上的内联 `background-image`，给战报浅克隆/smoothAvatar/fakeme 用的）：它按 cover 裁切且不带内层位移，留着会在框里叠一份错位的同图，所以 `background-image: none !important`。
  - 缩放（默认 1.5 倍）后立绘必然溢出卡框，所以拖拽中把预览从 220px 缩到 150px 并留 `margin-bottom: 60px` 空白：位置设定存的是**框宽/框高的比例**（见 `PortraitLayers.vue`），与盒子像素无关，缩小不改变构图，只是让溢出的部分落在空白而不是压在皮肤清单上。`.stage` 明确**不写** `overflow: auto/hidden`，否则等于又把「完整图」切回去。
  - 代价写进卡下的提示了：拖拽中的显示与游戏内的裁切效果不一致；不开拖拽时仍是所见即游戏内效果。
- **右侧改成一张武将卡**：`.opCard` 竖排包含 立绘预览 → 中文名 + 干员id → 皮肤清单 → `x/y/scale` 读数，原先的 `.stageSide` 文字列与独立 `.skinRow` 一并删掉。皮肤清单每项右侧挂「已调整 / 未调整」：判据是 `posData[干员id]` 里**有没有这个皮肤键**（`isAdjusted()` 用 `hasOwnProperty`），不能拿 `getPos` 的返回值判断——它对缺失条目是「返回默认值、不写库」，照值读会把每个干员的经典形象都显示成已调整。清单 `computed` 里读 `posVersion`，所以拖完松手就当场亮起来，不必切皮肤。「经典形象」沿用上一节的修法：只在皮肤数据里缺这条时才兜一张，不无条件前置。长按两秒的监听从 `.stage` 挪到卡片本身（`.stage` 现在还要承接溢出，绑在那儿会拖一下就想换人）。
- **隐藏无法调整的干员**：`avatarBackground.ts` 把 `isArkOperator` 导出，面板的候选列表改成 `allCharacters.filter(isArkOperator)`——与「套两层背景」用的是**同一个判据**，不会出现列出来一个选了画不出/调了没效果的角色。非方舟角色（本体武将、其它扩展）本来就走引擎原流程，`pos.json` 对他们没有意义。
- 校验：`pnpm eslint`（`avatarBackground.ts` + 面板）通过、构建通过；产物核对 `css/viteAutoCreateStyle.css` 三条展开态规则齐（`.cardEditing[data-v-3b3da893]{width:150px;margin-bottom:60px;overflow:visible;background-image:none!important}`、`.cardEditing…div{overflow:visible!important}`、`.cardEditing….sjzxPortraitImage{background-size:contain}`，且 `.cardEditing` 在 `.previewCard` **之后**，同权重靠顺序胜出），`chunks/configUI.js` 有「已调整/未调整/该干员没有可显示的皮肤」与 `allCharacters?.filter(…)`，`stageSide/skinRow/stageDragging` 在 CSS 与 chunk 里均为 0 命中。**未游戏内实测**：溢出后压在哪些元素上、`contain` 下拖拽手感如何，需要人眼看。


### 修复：开发面板换干员后 HUD 读数不消失 + 皮肤行出现两个「经典形象」

用户实测反馈两个 bug（都是上一节新增的「皮肤位置调整」面板带出来的）：

- **`toastSJZX` 残留**：拖拽 HUD 用的是 `showToast(msg, true, "topLeft", id)`——`duration: true` 就是**永不自动消失**，全靠人撤。而撤它的代码只在 `stopPortraitDragging()`（游戏内退出拖拽模式）里遍历 `hudToastIds` 做，`enablePortraitDrag()` 返回的还原函数只拆监听、还原内联样式，**不碰 toast**。开发面板切干员/切皮肤/关拖拽走的恰恰只有这个还原函数（模式开关还开着，不会去退模式），于是上一条 `[干员 · 皮肤] x=… y=… scale=…` 就一直挂在左上角。修法：把 id 从 `showHud` 里提到 `enablePortraitDrag` 作用域成 `hudId`（闭包本来就按 `key` 定死，换皮肤时新旧各持自己的 id），还原函数末尾 `removeToastById(hudId)` + `hudToastIds.delete(hudId)`——幂等，游戏内 `stopPortraitDragging` 再遍历一遍也只是空转。
- **两个「经典形象」按钮**：`skinList` 自己前置了一张 `经典形象`，而 `whichWaySkin.getCharacterSkin(name)` 返回的表里**本来就有**同名条目（`skin/index.ts` 的 `onInit` 给每个干员 `skins = { 经典形象: {...}, ...原表 }`，路径同样是 `getCharacterPortraitPath`）⇒ 重复。改成先查 `skins[DEFAULT_SKIN_NAME]`，没有才兜一张（皮肤数据尚未建好时仍能预览立绘），有就直接用表里那条、也顺带保住它在最前的顺序。
- 校验：`pnpm eslint` 两处通过、构建通过；产物核对 `chunks/skin-PortraitLayers-shared.js` 里还原函数已是 `…style.touchAction = p.touchAction, rt.removeToastById(n), Bt.delete(n)`。**未游戏内实测**：需确认切干员/切皮肤/关拖拽三条路径下读数都及时消失、皮肤行只剩一个「经典形象」。

### 修复：「皮肤位置调整」面板右侧读数叠成一团（`portraitPosSetting.vue` 漏写 `position` / `display`）

用户报告 `.stageSide` 下的元素重叠。根因不是面板自己的样式，而是引擎全局那条 `div { display: inline-block; position: absolute; transition: all 0.5s }`（`apps/core/layout/default/layout.css:31`）：**任何没自行声明 `position` 的 `<div>` 都被强制绝对定位**，脱离 flex/normal flow 后又因为没有 `left/top` 而各自落回「静态位置」，于是一排 `.sideLine` 全叠在同一坐标。同一条规则还带 `display:inline-block`，所以光补 `position` 只解决重叠、文字仍会横排挤成一行。

- 漏写 `position` 的其实是五个类：`.sideLine`、`.sideTip`、`.toolBtn`、`.toolHint`、`.skinBtn`（上一版只给容器级元素写了 `position: relative`，条目级全漏）⇒ 逐条补上。
- `.stageSide` 额外改成 `display: flex; flex-direction: column`：flex 子项会被 blockify，才压掉全局的 `inline-block`，读数才能一行一条。工具行/皮肤行本来就是 flex 容器，条目自动免疫，所以那里只需补 `position`。
- 样式块开头补了一段注释写明「每个 div 都必须显式写 `position`」的原因，免得下次又当成冗余样式删掉。
- 校验：`pnpm eslint` 通过、构建通过；产物 `css/viteAutoCreateStyle.css` 内 `.toolBtn/.toolHint/.skinBtn/.sideLine/.sideTip` 均以 `position:relative` 开头，`.stageSide` 有 `display:flex;flex-direction:column`（scope id 随改动变为 `data-v-3d35441a`）。**仍未游戏内实测**。

### 修复 + 补遗漏：动皮开关按钮被动皮层盖住（`z-index`）、动皮容器缺回边缘模糊（`src/characterCard/CharacterCard.vue`）

上一节把动皮搬进独立容器后留下的两个问题，用户一并指出：

- **开关按钮 `.charSkinBottomUIWrapper` 补 `z-index: 3`**。动皮容器由 `spineWork.js:258-259` 建成 `.sjzxDycWrapper` 并挂 `id="sjzxDycWrapper-animation"`，`css/spine.css:70` 给这条 id 规则写了 `z-index: var(--SJZX-dyc-index)`（`css/variable.css:2` 值为 **2**），另有 `pointer-events: none`。而 `.charDycWrapper` 是 `position:absolute` + `z-index:auto`，**不构成层叠上下文**，所以那个 2 是直接参与卡面根上下文比较的；上一节把按钮提到根容器后它自己没有层级（auto），于是被动皮层压在下面——看不见也点不到。给 3 只要求「高于 2」，不与卡面上更高的层抢（再往上只有 `promptSJZX` 那类 92/114514 的提示层）。
- **`.charDycWrapper > .charDyc` 加回 radial-gradient 遮罩**（`mask-image: radial-gradient(circle at center,#fff 60%,#fff0 80%)` + `-webkit-` 前缀，`mask-size: 100% 100%` 保证只糊边、不改变构图）。这段遮罩是嵌套 git 里 `d5be05e3 干员归一化step 6` 从 `.charImage` 上删掉的（`git log -S"mask-image"` 找到的原始写法），静态立绘现在没有它，动皮作为「画在立绘位置上的一层」缺了就会边缘硬切、和背板对不上。**位置取挂载元素而不是外层 wrapper**：`mask` 会连同子树一起裁，动皮容器是 `.charDyc` 的子元素，所以遮罩写在本元素上就能把 canvas 与 `.bg` 一并裁掉；而本元素的盒子（`width:100%` + `aspect-ratio:2/3`）正是原来 `.charImage` 那个盒子，遮罩的圆心与半径才能落回改动前的位置（外层 wrapper 是 90% 高、带 `bottom/right` 定位，几何不一样）。
- 校验：`pnpm eslint` 通过、构建通过，产物 `css/viteAutoCreateStyle.css` 里 `.charDycWrapper>.charDyc[data-v-f6da6488]` 带完整 `mask-*`/`-webkit-mask-*`，`.charSkinBottomUIWrapper[data-v-f6da6488]` 末尾有 `z-index:3`。**未游戏内实测**（browser MCP 起不了 dev app）。

### 新增：干员搜索通用工具 `src/configUI/charSearch.ts`

搜索规则原先抄在 `charPicker.vue` 里（中文名 + 干员id + 中文名拼音 + 各技能中文名/技能id，`pinyin-pro` 转拼音并 try/catch 兜底），新面板还要再来一份 ⇒ 抽成模块：

- `charDisplayName(name)`：`get.translation` 后剥掉 `<font>` 之类标签，展示与索引用同一个纯文本。
- `createCharSearchIndex(names)` → `Map<干员id, 已小写待匹配串>`；拼音每个干员都要转一遍，列表大时不便宜，调用方务必放在 `computed` 里复用。
- `filterCharsByQuery(names, query, index)`：空关键词原样返回；除了原文匹配，再去掉空格比一次（`amiya` 要能命中拼音 `a mi ya`）。
- 展示层不抽：各面板的列表/下拉/轮切长得不一样，这里只管「搜不搜得到」。`charPicker.vue` 改为调用这三个函数（模板与样式没动），顺带**新增 `filtered` 事件**把过滤结果透出——轮切「下一个干员」必须按当前搜索结果走，不然搜完还是在全量表里跳。

### 新增：configUI「皮肤位置调整」开发面板（`src/configUI/component/portraitPosSetting.vue`，仅开发者模式注册）

用户要求四项：可搜索选人、轮切展示真实双层 DOM、一个开拖拽的按钮、一个复制 `pos.json` 的按钮；并且**只在开发者模式下启用**。

- **注册点带开关**（`main.vue`）：`...(whichWayUtil.isDeveloperMode() ? [{ name: "皮肤位置调整", component: PortraitPosSetting }] : [])` 插在「模组切换」与「征稿在前」之间。`panels` 是 setup 里的普通数组，所以取的是**打开界面那一刻**的 `devMode`；普通玩家根本不会构建出这个组件实例。
- **预览就是场上那套两层 DOM**，不是仿制品：`whichWaySkin.addPortrait` 的底层 `mountPortrait(node, path)`（装重定向 + 两层背景 + 影子副本），位置设定读的是同一份 `pos.json`。用户此前确认过形态选「两层背景真实结构」，所以在这里调好的构图，进游戏所见即所得。预览节点 `.previewCard` 用引擎头像的比例 `114/174`，两层背景是 `inset:0` 绝对定位，因此它必须有 `position:relative` + 自身尺寸。
- **拖拽复用游戏内那一份实现**：`portraitDrag.ts` 里的 `enableNode` 导出成 `enablePortraitDrag(node)`（返回还原函数）。它按 `getPortraitKey(node)` 从节点当前 `background-image` 反解「干员id+皮肤名」，所以 `mountPortrait` 过的预览节点天然能拖——`illustration/character/<id>.png` 归到「经典形象」，`illustration/skin/<id>/<文件>` 归到该皮肤名。开关拖拽**只拆/装监听、不重画**（重画会把用户正在看的东西闪掉一次）；装不上（返回 undefined）就 toast 并把按钮退回关闭态。切换干员/皮肤时 `repaint()` 先拆旧监听再画，`dragOn` 为真则画完重装 ⇒ 满足「切换下一个角色也会自动开启拖拽」。
- **轮切**：右键（`@contextmenu.prevent`）或长按左键两秒取 `candidates`（= 当前搜索结果，为空退回全量表）里的下一个，到底回绕；`selected` 不在列表里（刚搜过关键字）时 `indexOf` 为 -1 ⇒ 从第一个开始。长按计时只在 `dragOn` 为假且左键时挂，松手/移出/取消都 `clearTimeout`（开着拖拽时长按是要拖的）。
- **复制按钮**：新增 `serializePosFile()`（`portraitPos.ts`），键序与 `JSON.stringify(…, null, "\t")` 参数都跟落盘那条同形，复制出来可直接粘回文件；按下先 `flushPortraitPos()` 再取文本，保证剪贴板内容与磁盘一致。`navigator.clipboard` 在非安全上下文会 reject，退回临时 `textarea` + `execCommand("copy")`，再失败就打印控制台。
- **HUD 数字**：`pos.json` 的内存表不是响应式数据，靠预览节点上的 `pointerup` / `wheel` 自增 `posVersion` 来重读（拖拽模块只 `stopPropagation`，不 `stopImmediatePropagation`，同元素上 Vue 的监听照常触发）。
- 退出面板 `onBeforeUnmount` 拆监听并 `flushPortraitPos()`。顺带清掉 `portraitPos.ts` 里重复的 `whichWayUtil` import、把落盘的 `schema` 提为常量 `POS_SCHEMA`（原来两处字面量 `1` 一个都没名字）。
- ⚠ 与「调位」无关但会踩的点：落盘位置是**运行时**扩展目录（dev 下即 `apps/core/extension/WhichWay/json/pos.json`），不是 `packages/.../json/pos.json`（那份是随包发布的空白模板，完整构建还会被 `viteStaticCopy` 覆盖）。

### 新增：设置项「立绘/皮肤直接用cover铺满」（`portraitUseCover`，默认关）

用户要求：开启后皮肤与立绘按 `background-size:cover` 铺，忽略自定义 pos；默认仍用自定义 pos。确认的范围是**场上头像 + 武将卡按钮**，即两层 DOM 那一套（CharacterCard 的 `.charImage` 用的是 `contain`，本次不动；拖拽入口也不因开启而屏蔽）。

- `skin/index.ts` 注册 `onConfig`（`priority: 757`，与 754/755/756 不重号）：`extension_WhichWay_portraitUseCover`，`init: false`。
- `PortraitLayers.vue` 的 `imageStyle` 在该设置下**不写 `transform`**（内层 CSS 本来就是 `cover` + `center top`），于是「cover 模式」= 只剩背板与 cover，`pos.json` 的偏移与默认 1.5 倍缩放全部忽略。
- **为什么是函数而不是 `computed`**：`whichWayUtil.config` 读的是 `lib.config`，不是响应式数据；一个无响应式依赖的 `computed` 只会算一次并永久缓存，而两层 DOM 的组件实例在换肤时是被 `render()` **patch 复用**的（`ensureLayers().setImage` 每次 `render(createVNode(...))`，同容器第二次调用走 patch 而不是重建），那样改完设置永远读不到新值。改成在 `imageStyle` 里调用 `coverOnly()`，就跟着每次重绘（换肤 / `$reinit` / 拖拽刷新）重新读一次——配置项的 `intro` 里「改完需要换肤或重开一局才生效」据此写的。
- 注意 cover 模式下**拖拽仍在写 `pos.json`**（本次没动拖拽入口）：表现是「拖了没反应」，回到自定义 pos 模式后那些值又生效。
- 校验：`pnpm eslint` 全部改动文件通过（零输出）、`WW_SKIP_STATIC_COPY=1 vite build` 通过；产物核对 `chunks/configUI.js` 有 `皮肤位置调整` / `portraitPosSetting` / `复制 pos.json` / `无法拖拽` / `writeText`，`css/viteAutoCreateStyle.css` 有 `.pos-setting`/`.previewCard`/`.stageDragging`（同一 `data-v-a02ad03a`），`chunks/skin-PortraitLayers-shared.js` 有 `portraitUseCover`×3 且已无 `useCoverOnly`。**未游戏内实测**：面板的轮切手感、拖拽落点与 cover 开关的观感都要人工确认。

### 改动：武将卡动皮独立容器 `charDycWrapper`，与静态立绘 `charImageWrapper` 互斥渲染（`src/characterCard/CharacterCard.vue`）

用户要求：动皮原本挂在 `charImageWrapper` 里，现在复制一个等大的容器专门挂动皮（挂载元素类名改为 `charDyc`），**有动皮时只渲染 `charDycWrapper`、不渲染 `charImageWrapper`，反之亦然**。

- **互斥条件 `dycShown = hasDynamicSkin && dynamicEnabled && spineWorker.needEnable()`**（即「动皮此刻真的会画出来」）。按「有没有动皮数据」来分叉是不够的：`hasDynamicSkin` 为真但动皮被关掉时，`charDycWrapper` 会空着而静态立绘又没渲染 ⇒ 卡面一片空白。`needEnable()` 是 `whichWayUtil.config` 的同步读值、不是响应式数据，所以它只在上面两个 ref 变化时重算，够用。
- **挂载点从 `charImage` 换成 `charDyc`**，三处 `spineWorker.updateDyc(props.name, charImageEl.value)`（`onMounted` / 换肤 `onSkinChange` / 开关 `toggleDynamicSkin`）统一改调新的 `mountDyc()`：`await nextTick()` 后再把 `dycMountEl`（`dycShown ? charDycEl : charImageEl`）交给 `updateDyc`。`nextTick` 是必需的——`onMounted` 里 `refreshDynamicSkin()` 才把 `dycShown` 翻真，`charDycWrapper` 要等这一次渲染才存在；给 `charImageEl` 的那次调用也不会挂错东西，因为 `updateDyc` 在 `banSkin[name][skin] === true`（动皮已关）时就 return，只剩清理。场上玩家的循环（`updateDyc(props.name, player)`）保持不变。
- **动皮开关按钮 `.charSkinBottomUIWrapper` 提到根容器下，和两个容器平级**（原来嵌在 `charImageWrapper` 内）。留在里面会被 `v-if` 一起卸载——关掉动皮的那一刻按钮自己也消失，就再也打不开了。提到根容器后百分比基准变了，尺寸按「原容器 30% 宽 / 90% 高，按钮区占它 100% 宽 / 10% 高」换算回根容器：`width:30%; height:9%; bottom:0; right:42%`，落点与改动前一致。
- **卸载即回收，靠的是 `loadDyc` 里已有的 `target.onRemoved(...)`**：它对 Player 和普通元素都注册，回调 `spineWorker.dispose()` 停渲染循环、丢 GL 上下文并把 `spineCache` 里按 `className`（现在是 `"charDyc"`）记的那项删掉。Vue 造的普通 `<div>` 之所以有 `onRemoved`，是 `src/nonameEx/index.js:34` 的 `patchPrototypeWhichWay(HTMLDivElementExt, HTMLDivElement.prototype)` 把方法直接装到了 `HTMLDivElement.prototype` 上（core 自己不提供）。挂载元素类名换成 `charDyc` 还顺带把 `spineCache` 的键与静态立绘分开（非 Player 目标按 `className` 记账）。
- ⚠ 已知的一处极端竞态（未处理，属于刻意不做）：极快连点「开→关→开」时，`onRemoved` 的 dispose 有 10ms 延迟，第二次「开」可能命中还没删掉的 `"charDyc"` 缓存项、把 `display` 恢复到一个已经脱离文档的旧容器上，表现为这一次要点一下别处才会重新挂上。常规单击切换不受影响。
- 顺带记录（**没有改**）：`.charSkinBottomUIWrapper > .buttonText` 这条规则从改动前就一直匹配不上（`buttonText` 实际嵌在 `buttonWrapper` 里，选择器要求它是 `charSkinBottomUIWrapper` 的直接子元素），即按钮文字从来没吃到 `dy_sjzx / 20px / bolder`。本次只是把选择器前缀去掉，保持了同样的层级关系 ⇒ 观感与改动前完全一致；要让它生效属于另一处观感决定。
- 校验：`pnpm eslint` 该文件通过、`WW_SKIP_STATIC_COPY=1 vite build` 通过；产物核对 `css/viteAutoCreateStyle.css` 有 `.charImageWrapper,.charDycWrapper` 合并规则、`.charDycWrapper>.charDyc`、重锚定后的 `.charSkinBottomUIWrapper{width:30%;height:9%;right:42%}`，`chunks/characterCard-CharacterCard-shared.js` 里 `K = computed(hasDynamicSkin && dynamicEnabled && needEnable())`、`v-if/v-else` 两个容器与平级按钮均如预期，组件内只剩 `mountDyc` 与玩家循环两处 `updateDyc`。**未游戏内实测**（browser MCP 起不了 dev app），互斥渲染的实际观感需人工确认。

## 2026-10-15

### 修复：立绘补齐脚本「远端明明有 `char_4231_clemnt` 却报不出来」，并把缓存 json 挪进 `scripts/cache/`

用户报告两点：①`scripts/update-portraits.mjs` 漏掉了远端存在的 `char_4231_clemnt`；②缓存 json 别放系统临时目录，改放 `scripts/cache`。

**根因有两层，都不在「下载/压缩」那一段**：

1. **形态全集取自 `skin_table`，而本地 `json/arknight/skin_table.json` 是过期的，且没有任何脚本会刷新它**。`scripts/update-arknight-data.bat:54` 的 `FILES` 与 `src/arknight/index.ts:618` 的 `updateFile` 都是同一份四张表清单（character / charword / handbook_team / char_patch），里面没有 skin_table。旧代码 `const forms = IDS.length ? IDS : [...byForm.keys()]` 直接以 skin_table 的形态为全集 ⇒ clemnt 这类「`character_table` 里有、skin_table 里一条皮肤都没有」的新干员**连进入分类循环的资格都没有**，`unknown`（只收 `--ids` 里查不到的 id）和 `noRemote` 都不会提到它——表现为「脚本执行时却没有这个角色」，且不报错。
   修法：形态全集改成 `skin_table 的形态 ∪ 干员表里 isCharacter 的形态`，并新增 `noSkin` 这一类（干员表里有、本地皮肤表没有条目 = 表过期，`portraitId` 根本无从得知），单列报告并指明「重跑加 `--update-tables`」。顺带把 `have.has(form)` 提到循环最前面：本地已有图的形态一律算 `done`，不再因为表里查不到而被误报成 `unknown`。
2. **补最新的 skin_table 后，站点的 `char_arts` 依然没有这三个人的全身立绘**（`char_4231_clemnt` / `char_393_toledo` / `char_4232_hbound` 三个，`--update-tables --dry-run` 实测 `远端未收录 3`）。但 `raw/char_portrait`（半身像）三个人的 `_1`/`_2` 都在，`raw/char_avatar`（头像）也有。也就是说剩下的缺口是站点收录范围问题，不是脚本 bug。
   实测两目录的性质差异：`char_arts` 1935 个文件、0.8~3.5MB，就是本仓库 `character/` 放的东西（现有 453 张长边 1280）；`char_portrait` 1413 个文件、约 120KB、**180x360**（走完整下载+压缩链路验证过：`char_4231_clemnt_2.png` 119KB → 37KB，`magick identify` = 180x360）。分辨率差一个数量级，混进同一目录会让武将卡明显发虚 ⇒ **半身像只做成显式可选，不作默认回落**。

**新增 `--sources`（逗号分隔，顺序即优先级，默认 `char_arts`）**：可选值限定为 `char_arts`(全身立绘) / `char_portrait`(半身像)，传别的（含 `char_avatar`，它命名规则是 `char_<形态>`/`char_<形态>_2`，跟 `portraitId` 对不上）就地报错退出 1。`pickArt` 改成按目录顺序逐个试、目录内仍「精二优先→初始替代」，计划的 kind 对非默认来源加前缀（`半身像·精二`），落盘位置不变。每个来源目录各抓/各缓存一份清单（`<目录>_index.json`），加一个来源只是多一次清单请求。**默认行为与改动前完全一致**：不带 `--sources` 时不会多打一个请求、也不会多出任何半身像计划。

**缓存目录（第 2 点要求）**：`CACHE` 默认值从 `os.tmpdir()/whichway-portraits` 改成 `path.join(HERE, "cache")` = `scripts/cache/`，`import os` 随之删除。清单 `<目录>_index.json`、原始图 `arts/<目录>/*.png`、`--update-tables` 的两张临时表现在都在 `scripts/cache/` 下，`.gitignore` 补了 `scripts/cache/`（清单就 400KB+，原图更大，绝不能进版本库）。原始图**按来源目录分子文件夹**存放：两个目录有 1100+ 个同名文件（半身像与全身立绘只差体积），平铺会把缓存互相顶掉、断点续传会复用错图。旧的 `os.tmpdir()` 缓存没做迁移（新位置第一次跑会自动重抓清单；那是 7 天缓存，不是数据资产）。日志与文档头里「临时目录」的措辞一并改成「缓存目录」，`--cache` 参数说明补上默认值。

**顺带**：清单条数改按「去掉子目录后的条目数」报（`children` 里夹着目录项，`char_portrait` 报 1414 实际可比对 1413）；文档头补「为什么形态全集不能只看 skin_table」「两个图片目录的差别」两段，并把已经过期的「当前缺 24 张」改成「先看 `--dry-run`」。上一节里那句「`--update-tables` 只写到临时目录（`os.tmpdir()/whichway-portraits）」保留原文不改（历史记录），以本节为准。

**验证**：`prettier --check` 通过、`node --check` 通过、文件仍是 LF（428 行尾全 LF、0 CRLF）。行为实测：①默认 `--dry-run --offline` → 新增的 `皮肤表缺条目 3` 一行点出 toledo/clemnt/hbound 并给出 `--update-tables` 指引（改前这三个字都不出现）；②`--update-tables --dry-run --ids` 三人 → `远端未收录 3`，证明「表补齐后仍缺图」是站点范围问题；③`--sources char_arts,char_portrait` 同一批 → 三条 `[半身像·精二]` 计划；④真实下载链路用 `--out` 指向系统临时目录跑通（落点没碰仓库资源），⑤`--sources char_avatar` / `--sources nope` 均退出 1。**未做的事**：没有把任何半身像写进 `image/illustration/character/`（默认路径不收，要收请显式加 `--sources`）；没有改 `update-arknight-data.bat` 去刷新 skin_table（那会牵动它的文件清单与校验规则，且 skin_table 运行时并不加载，属另一个决定）；`scripts/cache/char_avatar_index.json` 是排查时抓的，脚本不认它，已删。

### 整理 `scripts/`：三份发布脚本合并成 `release.bat` 的三个子命令，并新增 `index.bat` 编号菜单启动器

用户要求两件事：①合并功能重复的 `release.bat` / `release-dev.bat` / `pack-local.bat`；②写一个 `index.bat`，列出 `scripts/` 下的脚本、输入编号即进入该脚本的执行界面并弹出它的使用说明。

**①合并（`scripts/release.bat` 整体重写，另外两份已删）**——三条流水线共用同一批子过程，命令分派在文件头：

- `release.bat release <version> [baseline] [--push-only]` = 原 `release.bat`：构建 → dev-output 提交 → `commit-tree -p output -p dev-output` 打标签 → `node make-core-index.cjs` + 临时 index 生成 output-core → `git push --atomic`（推前 `git ls-remote` 预检远端同名标签：同 hash 就从 reflist 剔除，异 hash 直接中止并给两条出路），最后把 output / output-core 导出到 `release\`。
- `release.bat dev [--no-zip] [--push-only]` = 原 `release-dev.bat`：构建 → dev-output 提交 → 本地 `WhichWay-dev-<sha7>.zip` → 只推 dev-output。
- `release.bat pack [output|core|all]` = 原 `pack-local.bat`：把 `release\output`、`release\output-core` 压成 `scripts\WhichWay-<version>.zip` / `-core.zip`。
- 抽出来的共享子过程：`:do_build`、`:make_dev_output`（temp `GIT_INDEX_FILE` + `--work-tree` + `write-tree`/`commit-tree`/`update-ref`，并注入 `.github/workflows/release.yml` 的 blob）、`:zip_wrapped`、`:zip_flat`、`:export_tree`（`git archive` 绕开中文路径）、`:describe_output_tag`、`:require_clean_tree`、`:require_branches`、`:require_vite`、`:remember_head`/`:report_head`、`:normalize_version`、`:network_hints`、`:refs_ready`（push-only 从 ref 回读，不重建提交）。全程仍是 plumbing，不切分支、不动工作树。
- **刻意保留的差异**：`pack` 出来的包根就是扩展内容（没有 `WhichWay/` 顶层，沿用 `Compress-Archive`，不依赖 tar），`dev` 出来的包带 `WhichWay/` 顶层（drop-in 安装包，tar 优先、PowerShell 兜底）。统一布局会悄悄改变产物形态，所以只共用代码、不共用格式。
- **顺带修掉一个一直存在的历史缺陷**：旧 `pack-local.bat` 把 `git describe --tags --abbrev=0 --exclude=*-core` 写在 `for /f ('…')` 里，而 cmd 的 `for /f` 会把 `=` 当分隔符拆掉 ⇒ 那条 describe 从来没成功过，zip 名里的版本号恒回退成 `local`。现在统一走 `:describe_output_tag`（先重定向到 `%TEMP%` 的临时文件，再用 `for /f "usebackq"` 读回）。实测 `release.bat pack` 现在能拿到 `v1.5.6`。
- 暂存文件全部挪到 `%TEMP%\whichway-release`（原来散在仓库里），失败或中断不会留下半成品。

**②`scripts/index.bat` + `scripts/index-menu.mjs`**——`index.bat` 是 ASCII+CRLF 薄壳（只做 `where node` 检查后转 `node index-menu.mjs %*`），菜单、中文标签与说明全部在 mjs 侧：切 UTF-8 代码页这件事按 `find-arkid.mjs` 的做法只能在 node 里做（bat 里 `for /f` 探测 chcp 会派生子 cmd 抽干管道 stdin）。

- 列表 = 扫描 `scripts/` 的 `.bat/.cmd/.mjs/.cjs`，排除启动器自身（`index.bat`、`index-menu.mjs`），按分类分组连续编号（`发布 / 打包`、`游戏数据`、`立绘 / 图片`、`一次性迁移`、`内部`，未登记的落「其他」且摘要取文档头首行，所以新增脚本不会漏）。
- 「弹出使用说明」不另写一份文案：`.bat` 抠文件开头连续的 `REM` 块、`.mjs/.cjs` 抠开头的 JSDoc 块，取出 `Usage:`/`用法：` 下面缩进的那一段显示，并把带 `⚠`/「不可逆」的**整段**（含换行续写的那几行——`split-illustration` 的「先加 --dry-run」就写在第二行）提到前面。改脚本的文档头，菜单自动跟着变。bat 里为躲 cmd 转义写的 `^<version^>` / `[output^|core]` 显示时还原成尖括号和竖线。
- 选中 → 显示说明 → 问参数 → 回显整条命令 → `[Y/n]` 确认 → 执行。确认**只认 `y`/`yes`/空回车**，其它输入一律取消：写成「非 `n` 即同意」时，一次笔误（实测把 `q` 当成参数喂进去）就直接执行了脚本本身。子进程 `stdio: "inherit"`、`cwd` = 扩展包根，所以脚本自己的交互（`release.bat` 推送前的 `pause`、`find-arkid` 的循环查询）在菜单里和直接双击一样；跑子进程前 `menu.pause()`、跑完 `resume()`，让子进程独占键盘。
- 免交互用法：`index.bat <编号> [参数…]` 直接执行（不确认），`index.bat --list` 只打印编号表，`--help` 打印用法。退出码会透传（实测 `9`→1、`99`→2、`--list`→0）。
- **启动器不软化任何脚本**：`split-illustration`（默认剪切）、`rename-to-arkid`（默认只检查）、`compress-skin --inplace` 仍然要自己写 `--dry-run`/`--apply`，说明栏会把它们的 ⚠ 行顶在前面。

**踩到并记录的两个批处理/Node 事实**（本轮实测，非推断）：

- `REM` 行里的裸 `<`、`>`、`|` 在这台机器（cmd 10.0.26200）**不会再被当重定向解析**：顶层、`if ()` 块内、`for %%x in () do ()` 块内三种位置都试过，既不报错也不生成文件。`find-arkid.bat` 头顶记的「REM 里的尖括号会变成真重定向」这条在本次实测中没有复现；`release.bat` 的用法行仍写成 `^<version^>`（无害且向后兼容旧 cmd），菜单负责把脱义符还原回来。
- 从 node 启动 `.bat` 必须显式走 cmd（Node 直接 spawn `.bat` 会 EINVAL），且引号要**整条再包一层**：`cmd /d /s /c ""<绝对路径>" pack "two words""` 配 `windowsVerbatimArguments: true` 才正确分成 `%~1=pack`、`%~2=two words`；不包外层引号时 cmd 会把首尾引号吃掉一部分并报「不是内部或外部命令」。
- 菜单原先用 `async/await` + `rl.question`：readline 会在同一个数据块里同步抛出多行，await 的续体是微任务，等它跑起来时后面几行已经没人接 ⇒ 管道/重定向喂进来的「编号+参数+确认」整段丢失，还会以退出码 13（unsettled top-level await）收场。改成 `find-arkid.mjs` 那种递归 `rl.question` 回调链后，A/B/C 三种管道脚本（取消、带参数执行、无效编号）全部走通。

**删除与同步**：`scripts/release-dev.bat`、`scripts/pack-local.bat` 已删（两份都被包内嵌套 git 跟踪，`git checkout -- scripts/<name>` 即可恢复）；`.gitignore` 里 `release/` 的注释从 `(release.bat -> pack-local.bat)` 改成 `(release.bat release -> release.bat pack)`；`release.bat` 内一处指向 `pack-local.bat` 的注释改为不带文件名的描述。

**验证**：静态与只读路径实跑通过——无参数/未知命令/缺版本/版本号非法（`1.5.9`、`v`）四条 usage 与校验分支；`pack`（无 `release\` 时两条 `[WARN]` 跳过、版本取到 `v1.5.6`）；`dev` 与 `release v9.9.9` 都在「工作树必须干净」预检处中止，**没进构建、没进推送**；`release.bat` 仍是 ASCII-only + 全 CRLF 无裸 LF。**未实跑的路径（需要你择机验证）**：`release`/`dev` 的构建+提交+`git push`、`--push-only` 从 ref 回读、`:export_tree` 与两种 zip 布局的实际内容、以及远端标签预检的两条分支——这些要么推共享分支、要么改分支头，我没有执行。菜单侧已验 `--list` / 直接执行 / 三种管道输入流程，**真实键盘的 TTY 交互未实测**（本机无法在受控终端里扮演用户），请你双击 `index.bat` 确认列表对齐、`q` 退出、以及进 `release.bat dev` 后 `pause` 是否还接得住按键。
另外本轮只动 `scripts/` 与 `.gitignore`，没碰扩展运行时代码 ⇒ 无需构建。

### 修复：皮肤路径解析不到时写出 `[皮肤名, undefined]`，导致立绘两层背景画成 `url(undefined)`（烈夏）

用户报告：烈夏（`char_194_leto`）在 `src/skin/avatarBackground.ts` 的两层遮罩里 background 的 url 是 `undefined`，但 `get.character("char_194_leto")` 明明有 `img`。

**根因不在 `avatarBackground.ts`，而在皮肤配置数据**：`paintPortrait()` 是借引擎的 `setBackground` 离屏算 url 的，所以问题必然出在引擎那条 `src` 赋值链上。`apps/core/noname/init/polyfill.ts:205-206` 是 `if (type === "character" && lib.config.skin[name] && !noskin) src = lib.config.skin[name][1];`——**只判断键在不在，键在就无条件取 `[1]`，完全不看 `[1]` 是不是有效路径**，于是排在它后面的 `else if (imgPrefixUrl)`（即 `nameinfo.img`，polyfill.ts:182/207）这条有效分支被一条空路径配置挤掉。接着 `setBackgroundImage`（polyfill.ts:250-262）按 `url("${lib.assetURL}${v}")` 字符串拼接，`undefined` 被拼成字面量 `url("…undefined")`。两层遮罩拿到的就是这个，表现为「武将数据有 img，画出来却是 undefined」。

**写进 `lib.config.skin` 的那条 undefined 来自 `syncAllSkinConfig()`**（`src/skin/index.ts`）：`loadFrom` 的三条存档源里，字符串形态（`whichWaySave.skinConfig` / `qhly_skinset.skin`）走 `getCharacterSkin(key, removeExt(val))?.path ?? existing?.[1]`，两者都取不到时**照样写** `self._skinStore[key] = [val, path]`；数组形态（本体 `lib.config.skin`）的 `?? val[1]` 同理，且存档经 JSON 往返后 `undefined` 会变成 `null`；最露骨的是 `else if (typeof val === "string") { self._skinStore[key] = [val, undefined]; }` 直接显式写 undefined。三条都会流到末尾的 `lib.config.skin = full`。

**烈夏为什么必然命中**：`initSkinData()` 只扫 `skin:`（= `image/illustration/skin/`），而烈夏的皮肤 `来日欢歌.jpg` **只在旧目录 `image/skin/char_194_leto/` 里**——目录迁移时就 deliberately 没搬（本次会话核对：`image/skin/` 里未被 `illustration/skin/` 覆盖的只剩 `char_194_leto/来日欢歌.jpg`、`char_4204_mantra/万籁俱寂.jpg`、`amiyamrfz/`、`spkeluosi/`、`aikuisimrfz/` 五项，且 1.5.6 缓存 `json/cache/skin.json` 的 369 个角色里既没有 `char_194_leto` 键、也没有任何「经典形象」条目）。所以 `getCharacterSkin("char_194_leto", *)` 恒为 `undefined`，而存档里那条选择（改名迁移 `arkidMigration.ts:144` 换键不换值，选择会一路保留）就把 `[来日欢歌.jpg, undefined]` 顶进了 `lib.config.skin`。
另外「经典形象」条目是 `onInit` 钩子注入的，而 `syncAllSkinConfig()` 在 `init()` 的那个 `await` 里就跑完了 ⇒ **同步期间 `skinData` 里根本没有任何角色的「经典形象」**，所以存档里等于「经典形象」的选择同样会解析失败——这条以后要动注入时机时得记住。

**修法（只动数据源头，不改引擎、不给渲染层加兜底）**：`loadFrom` 的三个写入点统一走新加的 `store(key, skinName, path)`——路径是非空字符串才写，否则 `delete this._skinStore[key]` 并 `console.warn`。删键后引擎自然落到 `nameinfo.img`（= `src/packs/index.ts:149` 注册的 `whichWayFile.getCharacterPortraitPath(name)`，即「经典形象」立绘），观感上等于「回落到经典形象」；又因为末尾的 `lib.config.skin = full` / `transformSkinData(full)` 会同时重存 `skin` 与 `skinConfig`，这条失效存档**下次启动就自愈、不会再复现**。顺序语义保持不变：`skinOverride` 的优先级仍是「后写的源赢」，只是源与源之间的兜底（`?? existing?.[1]` / `?? val[1]`）现在只在拿到的是字符串时才成立。顺带把 `_skinStore` 与 `syncSkin` 的 value 类型从 `[string, string | undefined]` 收紧成 `[string, string]`，把这个不变量写进类型；`setCharacterSkin` 本来就有 `if (!skinData) return false` 的前置检查，是唯一另一个写入点，不需要改。

**没动的相关问题（等确认，属资源操作）**：
- 要让烈夏的「来日欢歌」重新可用，只需把 `image/skin/char_194_leto/来日欢歌.jpg` **复制**一份到 `image/illustration/skin/char_194_leto/`（旧目录按惯例保留未动），搬完还得让皮肤缓存重建（配置面板的「更新皮肤数据」按钮，或删 `json/cache/skin.json`），否则 `autoUpdateSkinData()` 仍读 1.5.6 的旧缓存。`char_4204_mantra/万籁俱寂.jpg` 同理。本次未擅自搬文件。
- `amiyamrfz`（只有旧 `image/character/amiyamrfz.jpg`）、`spkeluosi`、`aikuisimrfz` 三个自定义 id 在 `illustration/character/` 下**完全没有立绘** ⇒ `char.img` 指向不存在的 `illustration/character/*.jpg`，回落到经典形象也是一张空图；这是立绘覆盖缺口，与本 bug 无关，未处理。

**验证**：`prettier --check` 与 `pnpm eslint src/skin/index.ts` 均 0 问题；完整构建（不带 `WW_SKIP_STATIC_COPY`，9.30s，`vite-plugin-static-copy` Copied 12 items）通过，产物 `chunks/skin-PortraitLayers-shared.js:7531` 里已是 `console.warn(...) , delete e._skinStore[n]`，且整个 chunk 中不再出现写 `undefined` 的形态。`store()/loadFrom()` 用 node 离线按真实目录形态跑了 5 组：①烈夏（只在旧目录，字符串源）→ 键被丢弃、无 undefined；②本体数组源带着仍存在的旧 `image/skin/...` 路径 → 保留该路径；③存档被 JSON 压成 `[名, null]` → 丢弃；④阿米娅「报童.jpg」→ 解析到 `illustration/skin/char_002_amiya/报童.png` 并保留；⑤本体在前+驶舰字符串在后（名字解析不到但已有有效路径）→ 沿用已有路径。**实机未验证**（浏览器 MCP 加载不了 dev app）：烈夏进场/换肤/选将卡是否显示经典形象、控制台是否打出的那条 warn、以及失效选择被清理后皮肤面板的回显，都要人工进游戏确认。

### 结城理两个人格面具技能补「当前转换技状态」可见（`intro.content` + `dynamicTranslate`）

`thanatos_mrfz`/`orpheus_mrfz` 此前只在选目标的 `prompt2` 里说一次当前分支，平时看不出 ☯ 切到了①还是②。本次给两个技能各加 `intro`（标记角标 + 悬停内容）和一条 `dynamicTranslate` 动态翻译，全部改在 `src/packs/character/char_4217_makoto.ts`。

- **`dynamicTranslate` 走扩展自有钩子**：`char_4217_makoto.ts:2` 的 import 补上它（`src/packs/hooks.ts:20` 的 `_FUNCTION_HOOKS`，条目在 `pendingRun` 时由 `_runHooks` 写进 `lib.dynamicTranslate[key]`）。顺序安全：`src/packs/base/index.ts:66` 的 `lib.dynamicTranslate = dynamicTranslate`（整表赋值）是模块求值期跑的，早于 `onBeforeInit` 里的 pendingRun，所以钩子条目不会被盖掉；`src/packs/base/translate/dynamicTranslate.js` 里也没有同名键，不会撞上 `_runHooks` 的重复键抛错。
- **动态翻译是「整体替换」而不是追加**：`get.skillInfoTranslation`（`get/index.js:4021-4031`）只要 `lib.dynamicTranslate[name]` 存在就不再读 `_info`，所以描述必须返回完整文案。做法是把两段静态描述提成 `THANATOS_INFO`/`ORPHEUS_INFO` 常量，`translate({...})` 与 `dynamicTranslate({...})` 共用同一份，动态版把描述里的 `[①…;②…]` 分支段按当前状态上色（在用的红、没在用的灰），末尾再拼一行已经算好数值的当前分支注脚。上色与注脚都自己调 `whichWayUtil.colorize("#r…#")`——`dynamicTranslate` 没有像 `translate` 那样注册 `registerExecute` 预处理（`src/packs/index.ts:68-77` 只注册了 translate），不自己 colorize 就会把 `#r` 原样显示。悬停技能名的对话框走 `ui/click/index.js:3083-3084`（直接拼 HTML，`<br>` 与 poptip 标签都活着）。
- **角标用 `intro.markcount` 返回字符串**：`updateMark` 取角标数值时 `typeof intro.markcount == "function"` 排第一优先级，且最终是 `markcount.innerHTML = num`（`player.js:4883-4903`），所以直接返回 `①`/`②` 就能显示，不必用容易被读成「有几个标记」的 1/2。悬停内容走 `get.storageintro` 的 default 分支 `type(content, player, skill)`（`get/index.js:5096-5098`），签名与同文件 `bujimrfz_handcard`、佩德洛 `funanmrfz` 一致。
- **推翻上一节「不加 ☯」的判断**：那条说 ☯ 初始角度对 number storage 取 `countMark(name) % limit`（`player.js:10704-10705`），①会显示成 180°、②显示成 0°，与布尔约定相反——这点属实，但结论错了。因为 `changeZhuanhuanji` 广播的 `$changeZhuanhuanji` 做的是**相对**旋转 `mark.firstChild.reversed += 360 / limit`（`player.js:2397-2406`）而不是按 storage 重算，切一次就翻一次奇偶，和 `countMark % 2` 的奇偶完全一致（①：180→360→540…，②：0→180→…），朝向始终自洽；而 `marktext` 只在导入期由 `game.finishSkill` 写死成 `lib.translate[id+"_bg"]`（`game/index.js:8830`），本来就没法按状态换字形。所以 ☯ 照加（它就是「本技能是转换技」的记号），**真正分辨①/②靠角标和悬停内容**。
- **`zhuanhuanji` 函数里补 `player.syncStorage(skill)`**：默认广播只转 ☯、不重算角标；`syncStorage` → `game.addVideo("storage", …)` 在非联机非录像路径里会顺手 `player.updateMarks()`（`game/index.js:5010-5026`），角标与悬停内容就跟着刷新。⚠️ 联机下 `addVideo` 直接 return，且函数式 `zhuanhuanji` 本来就不广播 storage（`player.js:2349-2355`，只有 `zhuanhuanji == "number"` 走 `addMark` 才同步）⇒ 远端的 ☯ 朝向靠相对旋转仍是对的，但角标/悬停要等下一次任意 storage 同步才更新。这是引擎对函数式转换技的既有限制，本扩展所有 ☯ 技能（佩德洛、黛丝山等）同样如此，本次未处理。
- **顺手统一的两处**：① `personaValue(player, mark)`——原来塔纳托斯和俄尔普斯各写了一份一模一样的 `mark === 1 ? player.hp : player.getDamagedHp()`，现在合并，显示与结算共用；② 新增 `personaState(player, skill)` 读状态（只有 `storage === 2` 才算②，未初始化等一律按①），`filter`/`cost`/`content` 里裸读 `player.storage[...]` 的地方全部改走它，避免 `init` 没跑时 `undefined` 混进显示。塔纳托斯的 `prompt2` 也不再重复 `prompt: get.prompt()` 已经渲染的技能名，并去掉原先②分支把「本技能的状态切换条件……」直接拼接、没有 `<br>` 的残句。
- 验证：`prettier --check` 通过、`npx eslint` 0 报错、`WW_SKIP_STATIC_COPY=1 vite build` 3.52s 通过（本次只改 JS，无新增静态资源，故不再跑完整构建）；产物核对 `chunks/packs.js`：两个技能对象都有 `mark: !0, marktext: "☯"`、`intro.markcount`/`intro.content` 在、`zhuanhuanji` 里带 `syncStorage`、`dynamicTranslate` 注册已压缩成 `ae({thanatos_mrfz(g){…},orpheus_mrfz(g){…}})`；注脚字符串在 node 里模拟 `colorize` 跑过，含 poptip 标签也不会残留 `#`。**实机未验证**（浏览器 MCP 加载不了 dev app）：`.markcount` 里塞全角 `①/②` 的排版、☯ 朝向与分支的实际对应、切状态后角标与悬停内容的刷新时机，都要进游戏确认。
- **（同日追加）描述本身改成「当前分支红、另一支灰」**：上一版的可见性全靠末尾那行注脚，正文里 `[①…;②…]` 两段仍是同一种颜色，读的人得自己比对。现在 `dynamicTranslate` 先把正文上色再拼注脚——新增 `colorBranches(text, mark)`，用 `/\[①([^;\]]*);②([^\]]*)\]/g` 把 `[①甲;②乙]` 就地换成 `#r①甲#;#s②乙#`（状态②时反过来），色码沿用扩展既有约定：`#r`=red、`#s`=`#696969` 灰（见 `whichWayUtil.colorize` 的 `colorMap`），写法与 `dynamicTranslate.js` 里的 `titimrfz_mingshimrfz`、`lvmaimrfz` 一致。
  - 为什么是「正则改写静态文案」而不是像 `lvmaimrfz` 那样每个状态重写一句长句：塔纳托斯有 2 处分支段、俄尔普斯有 3 处，`THANATOS_INFO`/`ORPHEUS_INFO` 同时又喂给 `translate()` 当图鉴描述，写两份迟早各自漂移；改写静态串则天然同源，且**上色只发生在 `dynamicTranslate` 里**，图鉴/无主视角看到的仍是完整未上色的两个分支。
  - `get.poptip("shandian")` 生成的是 `<noname-poptip poptip = shandian></noname-poptip>`（`apps/core/noname/library/poptip.js:152-161`），不含 `;`、`]`、`#`，所以既不会被这条正则误切成两段，也不会打断 `colorize` 的 `#x…#` 匹配；塔纳托斯第二处分支段末尾那个半角 `)`（原文 `[…])`）保持原样没动。
  - 注脚暂时保留没有删：正文上色后仍缺「X/Y 到底等于几」，注脚给的是算好的数值（`#r①X=体力值=三：…#`），`intro.content`（标记悬停）和 `prompt2`（选目标提示）也共用同一份文案。若觉得和红色正文重复，删掉 `dynamicTranslate` 里那句 `+ "<br>" + xxxNote(player)` 即可，另外两处不受影响。
  - 验证：`npx eslint` 0 报错；在 node 里照抄 `colorize` 的实现跑两技能 × 两状态共 4 组，红/灰 span 数量与分支段数一致、`[①` 残留 0、除 `#696969` 自身外无残留 `#`。**实机未验证**：灰字（`#696969`）在默认字体/背景下的可读性、以及注脚与红字并排的观感，要进游戏确认。


### 修复：结城理 `Uncaught (in promise) TypeError: o.targets is not iterable`

实机崩在 `orpheus_mrfz.content` 的目标循环（产物 `apps/core/extension/WhichWay/chunks/packs.js:32301` 的 `for (let g of o.targets)`，栈里 `content.ts:4307` 正是 `createTrigger` 的 `await next`）。根因**不在选目标本身**，而在技能上的 `forced: true`：

- `content.ts:4125` 是 `if (event.revealed || info.forced) { result = { bool: true }; }`，这个 `if` 把下面整个 `else` 分支（`info.direct` / `typeof info.cost === "function"` / `chooseBool`）**全部跳过**。所以 forced 技能的 `cost` 根本不会执行，目标一个都没选。
- 而 `createTrigger` 只在 `result.targets` 非空时才把目标写进 content 事件（`content.ts:4259-4260` 取 `result.targets.slice(0)`，`4295-4297` 用 `get.itemtype(targets) == "players"` 才 `next.targets = …`），空值路径下 `event.targets` 压根不会被赋值 ⇒ content 一上手就是 `undefined`。`{bool:true}` 恰好又满足了 `4236` 的门禁，于是必然进 content、必然抛错。
- 表现与用户报告一致：**回合结束时弹都不弹就直接报错**。修法是把 `forced` 去掉，让 `cost` 真正跑起来；`cost` 里 `chooseTarget` 的取消按钮本身就是「不发动」，语义与「回合结束时你令……」相符。
- **`thanatos_mrfz` 同步去掉 `forced`**：它是同一条引擎规则的必然受害者（`forced: true` + `cost` 选目标 + content 里 `const targets = event.targets`），只要脱离濒死后 `filter` 通过就会一样抛错。这属于用户已存在的代码，但不是「顺手改」——是同一个 bug 的第二次出现，改法与俄尔普斯一致，只删一个属性；如果原作者本意是「强制发动且必须选满」，那就得把选目标从 `cost` 挪进 `content`（本扩展 `char_4219_yukari.ts:261-289` 的 `if (result.bool && result.targets)` 写法），本次没往那个方向改。
- 排查过程中被否证的两个猜测（记下来免得下次重走）：`ui.click.ok` 确实无条件写 `{bool:true, targets:ui.selected.targets.slice()}`（`ui/click/index.js:3098-3105`），但手动路径的空目标点确定进不来——`game.Check.processSelection` 在 `uiSelected.length < range[0] && (!event.forced || selectableItems || complexSelect)` 时会把 `ok` 判假（`game/check.js:89`），`ok` 假则不生成「确定」按钮（`check.js:200` → `game.check` 的 `confirm += "o"` 只在 `ok` 时加），框选松手那处也先过 `if (game.check())`（`ui/click/index.js:1800`）；AI 路径同理，`ai.basic.chooseTarget` 在没有可选目标时 `return range[0] == 0 || ok`（`ai/basic.js:206`）返回假，且它读的 `event.forced` 是 chooseTarget 事件的属性，`GameEvent` 构造器不继承父事件属性（`gameEvent.ts:20-35`）。
- 全仓审计：`src/packs` 下按「同一技能对象里既有 `forced: true` 又有 `cost:` 且 content 读 `event.targets`」扫了一遍，除这两个外没有其他命中。
- 验证：`prettier --check` 通过、`npx eslint` 0 报错、`WW_SKIP_STATIC_COPY=1 vite build` 2.78s 通过，并在产物里确认两个技能对象上 `forced` 已消失（`packs.js:32188`/`32268` 起的 `thanatos_mrfz`/`orpheus_mrfz` 只剩 `audio`/`charlotte`）。**实机仍待用户复测**：这次报错本身就是上一节「实机未验证」漏掉的真实缺陷，目标框弹出与两段回复/摸牌的结算仍需人工确认。
- 顺带把上一节欠的完整构建补跑了（不带 `WW_SKIP_STATIC_COPY`，9.30s，`vite-plugin-static-copy` Copied 12 items），源目录与 `apps/core` 产物两侧的静态资源重新对齐。

### 补完结城理的两个技能：`orpheus_mrfz`（俄尔普斯）与 `fuanmrfz`（赴暗）

`src/packs/character/char_4217_makoto.ts` 里这两个技能此前只有 `audio`（空壳），按 `translate` 已有的描述补完实现。

- **俄尔普斯整体照搬同角色已实现的塔纳托斯**：`storage[skill]` 取 1/2、`zhuanhuanji` 写成函数形式自己翻转、切换时机靠 `subSkill.change` 在 `player:"dying"` 上调 `player.changeZhuanhuanji()`。必须自己写切换是因为**引擎从不自动转换**：`changeZhuanhuanji`（`apps/core/noname/library/element/player.js:2346`）在 noname 里除了定义之外零调用点，本体武将全是自己在 content 里调；而「失去此技能不重置状态」也天然成立——`removeSkill` 只在 `info.onremove` 为 `"storage"`/`true`/数组时才删 `storage`（`player.js:11854-11881`），`init` 又只在该角色**首次**获得技能时跑（`initedSkills` 去重，`player.js:11092`）。
- **两分支的语义**：状态①令至多 Y（=体力值）名角色**各**回复 1 点；状态②令 1 名角色回复 Y（=已损失体力值）点。即 `maxTarget = mark===1 ? y : 1`、`numPerTarget = mark===1 ? 1 : y`。`filter` 用 `y >= 1` 早退（状态②在满血时 Y=0，发动无意义），写法与塔纳托斯一致。
- **「溢出的体力值改为摸等量张牌」= 自己算，不等引擎回报**：`content.recover` 会把 `num` 夹到 `maxHp - hp`（`content.ts:12345-12347`），所以按 `recoverNum = Math.max(0, Math.min(num, target.getDamagedHp()))`、`overflow = num - recoverNum` 分两段结算，`recover({num, source: player})` + `draw(overflow)`。**`Math.max(0, …)` 不是多余的**：体力上限被压低时 `getDamagedHp()` 返回负数（`player.js:3280-3285`），不夹零会让 overflow 反而多摸牌。
- **满血角色也必须可选**（回复不掉的会变成摸牌），但 `chooseTarget` 省略 `filterTarget` 时默认值是 `lib.filter.all`（`player.js:6753`）——那连阵亡角色都能点，所以显式写 `target.isIn()`。AI 与塔纳托斯相反：收益技优先友方，`get.attitude2(target) < 0 ? -1 : 1`。
- **没有给俄尔普斯加 ☯ 转换技标记**（塔纳托斯同样没有）：`marktext:"☯"` 的初始角度在 `storage` 为 number 时取的是 `countMark(name) % limit`（`player.js:10698-10712`），而这两个技能从不 `addMark`，加了标记会显示成与 `storage` 相反的分支。当前状态仍照塔纳托斯的做法写在 `prompt2` 里。
- **赴暗用「创」式实现**（引擎 `buqu` 同款）：`addToExpansion(get.cards(3-Z), "gain2")` + `gaintag.add("fuanmrfz")`，牌由 `getExpansions("fuanmrfz")` 取回；`marktext/intro:{content:"expansion",markcount:"expansion"}` 让坚在武将牌上可见可数，`onremove` 把坚扫进弃牌堆免得技能被拆后留孤儿牌。
- **触发时机的关键差别**：赴暗挂 `trigger:{player:"dying"}` + `firstDo` + `priority:20`，而引擎周泰的 `buqu` 挂 `chooseToUseBefore`。因为 `content.dying` 第一步就是 `await event.trigger("dying")`（`content.ts:12409`），它跑在求桃（`_save`）之前；`dyingAfter` 则是事件循环按 `name+"After"` 自动补发的（`gameEvent.ts:253/284`，全仓无手写触发点），所以塔纳托斯的「脱离濒死后」照常工作。同理**不需要 `trigger.cancel()`**：`recoverTo(1)` 走到 `content.changeHp` 时会把角色移出 `_status.dying` 并 `finish()` 掉 dying/`_save` 事件（`content.ts:12356-12368`），dying 流程第二步的 `player.hp > 0` 判据随即成立。
- **「相同点数的牌」按「点数不唯一的坚全部弃掉」实现**（含新置的几张彼此重复），而不是只弃新牌：这样留存的坚始终点数互不相同，下一次发动的判据才有确定含义。无重复才把体力调到 1（`recoverTo(1)` = `recover(1 - getHp(true))`，与 buqu 的 `recover(1 - hp)` 等价）。
- **Z 的口径**：`PERSONAS = ["thanatos_mrfz","orpheus_mrfz"]`（`src/poptip/poptip.js` 的「人格面具」条目明确只有这两个），Z = 当前持有数 ⇒ 坚的张数为 3/2/1。`filter` 里额外要 `fuanCount(player) > 0`：将来若真加第三个面具，0 张牌会让「无重复」白送一次回复至 1，宁可技能不放。
- **文案两处同步**：`orpheus_mrfz_info` 结尾原来挂着从塔纳托斯复制来的残句 `（Y = 你的[①体力值;②已损失体力值])名角色[①摸一张牌;②回复一点体力]`，改成与实现一致的 `…各回复[①一;②Y]点体力…（Y = 你的[①体力值;②已损失体力值]）`，`src/poptip/poptip.js:75` 里同一份文本一并改掉；赴暗的「至于武将牌上」补正为「置于」。
- **没动的相邻问题**：`bujimrfz.derivation` 写的是 `["thanatos","orpheus"]`，缺 `mrfz` 后缀，而 poptip 的衍生技反查靠 `lib.translate[<id>]`（`src/poptip/index.js:30-56`）⇒ 该列表当前不生效。它属于不羁，本次未擅自修改。
- 验证：`prettier --check` 两文件通过、`pnpm eslint` 两文件 0 报错、`WW_SKIP_STATIC_COPY=1 vite build` 3.44s 通过且 `chunks/packs.js` 内 `orpheus_mrfz` 命中 11 次、`fuanmrfz` 命中 7 次、`gaintag.add("fuanmrfz")` 在；重复点数与溢出折算的算术用 node 离线跑了 6 组用例（三张同点、空坚、满血目标、上限被压的目标、满血时的状态②）结果均符合预期。**实机未验证**（浏览器 MCP 加载不了 dev app）：坚的置牌动画与 mark 计数、状态②一次回复多点+补牌的顺序、回合结束时目标框的可选范围、以及濒死时赴暗与塔纳托斯/俄尔普斯两个 `change` 子技能的触发先后，都要人工进游戏确认。本次跳过了静态资源复制，下次仍应跑一次完整构建。

## 2026-10-14

### 新增：立绘透明图层处理 `src/skin/avatarBackground.ts` + `src/skin/PortraitLayers.vue`

明日方舟立绘带透明区域时，透出来的是引擎贴的**本体默认武将图**：`HTMLDivElement.setBackground(name,"character")` 走的是 `setBackgroundImage([立绘, lib.characterDefaultPicturePath + sex])`（`apps/core/noname/init/polyfill.ts:226-232`），即 `url(立绘),url(保底图)` 两层背景。新增模块用 `whichWayAPIOverride.appendHook` 劫持三处绘制入口，把驶舰之向角色的立绘改画进 `PortraitLayers.vue` 的两层子元素（`.sjzxPortraitWrapper` 铺 `ui:background/default.png` + `overflow:hidden`，`.sjzxPortraitImage` 只贴立绘，贴完用 `firstLayer()` 把保底图层削掉）；**其余角色一律走引擎原流程，节点上连子元素都不会多**。由 `src/skin/index.ts` 静态 import 带入（skin 阶段），钩子在 content 阶段注册。

- **落点选 `src/skin/avatarBackground.ts` 而不是需求里写的 `src/skin.ts`**：`src/skin/` 目录已存在，`src/skin.ts` 曾作为重复文件删除（见 `updateContent.txt:31`），再加一个同名文件会让今后的 `from "./skin.js"` 解析到 `skin.ts` 而不是 `skin/index.ts`。
- 劫持点：`lib.element.player.$init` / `$reinit`（主将 `node.avatar`、副将 `node.avatar2`）、`ui.create.buttonPresets.character`（对话框里的武将卡按钮：选将、观战、`characterx` 都走它，`ui/create/index.js:3508-3510`）。**武将卡按钮刻意用 `after` 而不是 `before`**：按钮节点是在预设内部建的（`:3353`），`before` 拿不到；判角色用 `result.link` 而不是入参 `item`，因为 `characterx` 会在内部把 `item` 换成 `lib.characterReplace` 里的随机一个（`:3360-3362`）。代价是引擎会先按原样画一次、我们再覆盖一次（多一次无用绘制，观感无差）。`after` 每条分支都返回 `undefined`，不会顶掉 `appendHook` 的返回值替换语义。
- **`ui.create.buttonPresets.player` 没有动**：它同样有保底图层问题（`ui/create/index.js:3533/3536`），但本次需求只点名了 `character`，不扩范围。
- **两层 DOM 抽成 `PortraitLayers.vue`**，既被 `avatarBackground.ts` 用底层 `render(createVNode(PortraitLayers, { image }), host)` 挂进引擎节点，也能当普通组件直接 `<PortraitLayers image="…" />` 用。
  - 选 `createVNode`+`render` 而不是 `createApp().mount()`：`render()` 是**同步**挂载与打补丁（响应式更新才是异步的），且 `render(null, host)` 就是卸载，换皮肤时不必等一个 tick。
  - 必须垫一个空的宿主 div：`render()` 会接管容器的全部子节点，直接拿引擎的 `.avatar` / `.button.character` 当容器会把 `.name`/`.hp`/`.identity`/`.avatarbg` 一起清掉。
  - 立绘 URL 走**离屏 scratch div** 让引擎自己算（`resolveBackgroundImage()`）：贴图路径的解析（皮肤配置、`ext:`/`mode:`/`img:` 前缀、国战 `gz_`、扩展名兜底）全在 `setBackground` 里，重写一遍必然走偏。算完只把 `url(...)` 交给 Vue 的 `image` prop，避免命令式写的内联样式被下一次 patch 抹掉。
  - `scoped` 样式照常生效（`__scopeId` 不依赖 app context），构建后进 `css/viteAutoCreateStyle.css`（`assetFileNames` 固定 + `autoLoadCSS()` 扫全目录）。
- **重定向而非一次性改写**：`$init` 时给 `node.avatar` / `node.avatar2` 装上自有属性 `setBackground` / `setBackgroundImage`，「是不是干员」在每次调用时判断。因为除 `$init`/`$reinit` 外还有 `changeSkin`(player.js:3761,3800,3822)、`$reinit12/21`(3963-3978)、`setAvatar`(4523-4528)、皮肤菜单 avatarSetter、本扩展 `refreshSkin()`、以及干员技能里直接改头像的 `setBackgroundImage`（`char_416_zumama`、`shuangwangmrfz`）都会再画一次，不重定向就会被我们加的子元素盖住，表现为「换皮肤没反应」。装一次即可覆盖全部路径：引擎从不重建 `player.node.avatar`（全仓只有 `game.logv` 的战报卡节点与 `card.js:481` 赋过 `node.avatar`）。换回普通角色时 `dispose()` 撤掉两层，否则引擎画在节点自身的图会被子元素盖住。
- **节点自身保留一份「只贴立绘」的影子副本**（不带保底图层）。这是给读不到子节点的四处用的：`game.logv` 的战报卡头像是 `player.node.avatar.cloneNode()` **浅克隆**（game/index.js:9239/9265/9303/9321，只带属性与内联样式）、`smoothAvatar` 的淡出层抄 `getComputedStyle(.avatar).background`（player.js:4209）、`ui.fakeme` 抄 `.avatar` 的内联 `background-image`（3971/3984/4100/4531）、以及 `game.damage` 的全屏属性动画抄 `avatar.style.backgroundImage`（player.js:16337）。立绘只画在子元素上的话这几处全是空白。影子副本不会露馅：不透明处被内层（同图、同尺寸、同 `cover`+水平居中定位）完全盖住，透明处节点自己也是透明的，所以半透明的 `default.png`（1024×576，alpha 最低 0.769）透出来的仍只有卡面。为此 `ensureLayers()` 会把节点自身的 `background-size`/`background-position-x` 钉成与内层一致。
- **因此没有钩 `game.logv`**：`logv` 内部 `game.broadcast(game.logv, …)`（9220）会把**当时属性上的函数**反编译成源码文本发给远端（`client.js:52-69` → `get.funcInfoOL`），`appendHook` 的 wrapper 闭包引用了 `original/before/after`，在客户端是未定义变量 ⇒ 主机正常、远端战报栏全空。影子副本让浅克隆天然可用，不必冒这个险。（注：`game.trySkillAudio`/`tryDieAudio` 早已被本扩展以同样方式钩住且同样自广播，属既有隐患，本次未动。）
- 层级：两层元素 `prepend` 到最前，`smoothAvatar` 的 `.fullsize`、阵亡卡的 `.avatarbg grayscale1`、武将卡的 `.name`/`.hp`/`.identity`、`ui/create/index.js:3475` 的 `.button.replaceButton` 都是后加的兄弟节点，按树序仍画在我们上面；动皮容器 `.sjzxDycWrapper` 自带 `z-index:2` 不受影响。宿主与外层都 `pointer-events:none`，`ui.click.avatar` / `ui.click.button` 照常可点。
- **CSS 审计**（注入的宿主 div 会不会被元素级子选择器打中）：全仓扫 `.avatar`/`.button`/`.player` 的 `> div` 规则，只有 `layout.css:620 #historybar > div > .avatar > div` 与 `chess.css:152/161 .fakeme.player > div > div` 是元素级的，两处都打不中——战报栏的 `.avatar` 是浅克隆、从不含宿主 div；`.fakeme.player`（`ui.chessinfo`，chess.js:416 / tafang.js:202）的 `> div > div` 是棋子格本身，宿主 div 要再深一层。其余 `.button.character > .name/.hp/.intro/.identity`、`.button.replaceButton > div` 全是类选择器，不匹配 `.sjzxPortrait*`。全局 `div{position:absolute;transition:all .5s}`（layout.css:31）里 `transition` 对 `background-image` 无效，无副作用。
- `setBackground` 的 `db:` 分支是异步的（polyfill.ts:211-213），此刻内联样式还没写，故 `firstLayer()` 取到空值时直接 return，不动影子副本，免得把上一张好图冲掉。驶舰之向干员的立绘一律走 `lib.config.skin`，到不了那个分支。
- 已知观感差异（非缺陷）：战报卡头像、`ui.fakeme`、全屏属性动画只有立绘、没有 `default.png` 背板——影子副本刻意只贴立绘，否则背板会被节点与外层各画一次（0.769 → 约 0.947 不透明度），与需求的「外层背景为 default.png」不符。
- 验证：`pnpm eslint` 两文件 0 报错；`firstLayer()` 正则用 node-repl 跑了 6 组用例（含带空格文件名 `夏卉 FA017.png`、带括号文件名、单层、空串、`none`）全部符合预期；构建产物 `chunks/skin-PortraitLayers-shared.js` 内含 `whichWaySkinAvatarBackground`、编译后的组件（`props:{image:{}}` + `__scopeId`）与三个 `appendHook`，`css/viteAutoCreateStyle.css` 含两条 scoped 规则，`_export_sfc` 独立在 `chunks/_plugin-vue_export-helper.js`、`chunks/` 内无反向 `from "./extension.js"`（顶层 await 死锁红线自查通过）。**实机未验证**（浏览器 MCP 加载不了 dev app），观感需人工进游戏确认；仓库也没有任何 headless DOM 依赖，无法离线跑 DOM 断言。

### 收窄：立绘两层背景只对明日方舟干员生效

`src/skin/avatarBackground.ts` 的判据从 `whichWaySave.hasChar(name)` 换成 `whichWayArknight.isArknght(name)`（两处：`installRedirect()` 装上去的 `node.setBackground` 重定向、`ui.create.buttonPresets.character` 的 `after` 钩子读 `result.link`）。

- 两个判据的实际差别只在「**是方舟干员但本扩展没做**」这一档：`hasChar` 查 `allCharacters`（扩展已实装的 258 个），`isArknght` 查 `vaildArkId`（`character_table` + `char_patch_table.patchChars` 过滤 `isCharacter` 后的全量约 1400 个）。本体武将与其它扩展的角色两边都判假，仍走引擎原流程、节点上不多子元素。
- 判据只需要「这是个方舟干员」：干员id 已与方舟 uid 统一、立绘也按 uid 落盘，透明图层问题来自方舟立绘本身，与「扩展有没有实装」无关。用 `exsitArk`（已实装干员）会把未实装但被别的扩展/自定包引进来的方舟立绘漏掉。
- 阶段顺序有保障：`isArknght` 依赖 `vaildArkId`，由 `arknight.init()` 里的 `buildVaildArkId()` 在 **arknight 阶段（init.js:129）** 构造，`avatarBackground.ts` 由 **skin 阶段（init.js:135）** 静态 import 带入；且钩子是在 content 阶段才注册的，判定时数据必然已就位。
- `vaildArkId` 是数组、`isArknght` 是线性 `includes`（约 1400 项）。这里没有换成 Set：调用点只在「画一次头像 / 建一个武将卡按钮」时各触发一次，不在每帧或每干员×每技能的循环里，量级与引擎自己的 `lib.config.characters.includes` 相当。

### 删除 `image/illustration/skin/` 下全部「初始立绘」「精一立绘」

`scripts/split-illustration.mjs` 的产物分三档：`ILLUST_2`（精二）→ `character/[形态id].png`，`ILLUST_1` → `skin/[形态id]/精一立绘.png`，`ILLUST_0` → `skin/[形态id]/初始立绘.png`。游戏内只用精二与具名皮肤，这两档 459 个文件属于死资产，已从 **源目录与构建产物两侧同时删除**：

- `packages/extension/WhichWay/image/illustration/skin/`：460 目录 / 983 文件 → **369 目录 / 524 文件**（删 459 文件，顺带清掉 91 个空目录）。
- `apps/core/extension/WhichWay/image/illustration/skin/`：同样 369 / 524。**必须手工同步**：`vite.config.ts` 里 `emptyOutDir:false`，构建不会清理产物目录，只删源目录的话 dev/构建产物里旧文件仍在。
- 另删 `apps/core/extension/WhichWay/json/cache/skin.json`：`autoUpdateSkinData(false)` 在缓存 `version === whichWayVersion.ext` 时直接 return，而缓存里写的就是 `1.5.6`（当前 `src/version.js` 的 `ext`），不删的话游戏内皮肤清单仍会列出已删除的两档。`clearSkinCacheOnce()` 帮不上忙——它的开关是 `whichWayVersion.ext.startsWith("1.6")`，在 1.5.6 下是休眠的。
- **可回滚**：`packages/extension/WhichWay/` 自带一个嵌套 git 仓库（外层 `F:/无名杀` 的 `.gitignore:34` 忽略了 `packages/extension/`，但嵌套仓库追踪这些图片），459 个文件删除前状态干净，`git restore` 即可取回。本次**未提交**。查这类中文路径要用 `git -c core.quotepath=false ls-files`，默认的 `git ls-files` 会把非 ASCII 转义成 `\345\210\235...` 导致 grep 全部落空。
- **已知遗留**：已经装了旧版、且 `json/cache/skin.json` 里 `version` 已是 `1.5.6` 的玩家，皮肤清单会继续显示这两档，直到扩展版本号变动或手动点「更新皮肤数据」。

### 明日方舟干员名反查索引：排除升变形态、同名取首个

`src/arknight/index.ts` 的 `_getArkNameIndex()`（`addShcema` 的旧式命名干员反查用）原先按 gamedata 的 `name` 建索引且**后写覆盖前写**。而 `loadShcema()` 会把 `char_patch_table.patchChars` 并进 `character_table`，阿米娅三形态的 `name` 全是「阿米娅」，于是 `"阿米娅"` 反查到 `char_1037_amiya3`（医疗阿米娅）。改为：跳过 `patchChars` 里的键 + 同名只保留首个命中者。

- 用真实缓存数据（`json/cache/arknight.json`，schema 1 / version 1.5.6）跑了前后对照：全表 454 个名字里 **10 条映射被修正**，除阿米娅外还有 9 条同名预备干员/罗德岛精英（如 `郁金香 char_608_acpion → char_513_apionr`、`Sharp char_609_acguad → char_508_aguard`）——原先一律落到 `_6xx_` 那批「敌方/NPC 占位形态」上。
- 索引规模不变（454），只是取值变了；`patchChars` 只有 `char_1001_amiya2` / `char_1037_amiya3` 两个键，本体形态走 `addShcema` 的恒等分支，不依赖这张反查表。

### 未定位：阿米娅【同感】播放成医疗阿米娅的配音

**没能复现，也没能定位到成因，此项未修复。** 按现有源码逐层追下来，`char_002_amiya` 的 `newtongganmrfz`（`audio: ["任命队长","作战中1"]`）必然拼出正确地址，已排除的路径与证据：

- `extUID["char_002_amiya"]`：`compileVoicePath` 只读 `shcema.transfer(uid,"character","whichWayUID")`，即这张表。用真实缓存 + 274 个干员模块的译名，把 `loadShcema` 两个循环与 `addShcema`（258 个已注册干员，按注册序）完整模拟一遍，结果恒为 `char_002_amiya`；`char_1037_amiya3` 亦为自身。上一条修的索引缺陷**够不到这里**——反查分支只对「id 不是方舟 uid」的干员生效，全仓 20 个这类 id（`acemrfz` / `plot_keluxiermrfz` 等）没有一个译名是「阿米娅」。
- 构建产物与源码一致：`chunks/packs.js` 里 `newtongganmrfz` 的 `audio` 仍是 `["任命队长","作战中1"]`，`char_1037_amiya3` 的技能是 `["tongqingmrfz","cibeimrfz"]`（`audio: 2`），两者无交集；全仓 grep `newtongganmrfz` 只命中 `char_002_amiya.ts`，`modules/` 里没有任何 amiya/tonggan 条目，所以 `_webPlayMap.get("newtongganmrfz")` 只可能有 `char_002_amiya` 一个键。
- 不是本地文件串味：`apps/core/extension/WhichWay/audio/` 下 `find -iname "*newtonggan*"` 为空，在线配音是唯一来源（只有 `tongganmrfz*.mp3` / `tonggan_discardmrfz*.mp3` 这批旧技能的遗留文件，引擎解析不到）。
- 不是 PRTS 侧同名：`char_002_amiya/cn_018.wav`（129698B）与 `char_1037_amiya3/cn_018.wav`（164394B）实测 md5 不同，gamedata 的 `voiceAsset` 与台词也不同（「我不会辜负大家的。」vs「我感受到了那么多的悲伤……」），所以地址里的 uid 一旦是 `char_002_amiya`，听到的就不可能是医疗阿米娅。
- 标题→序号没错位：`shcema.audio` 的 `name[15]="任命队长"↔index[15]="018"`、`name[22]="作战中1"↔index[22]="025"`，与 gamedata 里 `char_002_amiya_CN_018/CN_025` 的 `voiceTitle` 一致。
- `getReferSkill` 不参与：`audio` 是数组不是字符串，`_resolveReferSkill` 直接返回自身；被改写成 `"ext:WhichWay/audio/CN_MANDARIN:2"` 之后再查也因 `lib.skill["ext:…"]` 不存在而回落到 `lastName`。

要在实机定位，请在游戏里开控制台跑这一行，它会把「谁在播、播的什么地址」一次性打出来：

```js
const w = whichWay.audio.getWebPlay("newtongganmrfz", "char_002_amiya");
console.log("extUID:", whichWay.arknight.shcema.transfer("char_002_amiya", "character", "whichWayUID"),
	"webPlay.char:", w?.char, "titles:", w?.voicesTitle, "urls:", w?.voiceUrl,
	"_webPlayMap keys:", [...(whichWay.audio._webPlayMap.get("newtongganmrfz")?.keys() ?? [])]);
```

若 `urls` 里是 `char_002_amiya` 而听到的仍是医疗阿米娅，问题就在扩展之外（千幻聆音等配音替换类扩展、或浏览器/客户端的音频缓存）；若 `urls` 里是 `char_1037_amiya3`，把上面这行的输出贴回来即可继续查。

- 顺带记录两个**本次未动**的既有问题：`legacyCharIds.ts` 没有 `amiyamrfz` 条目（旧版阿米娅的阵亡配音 `audio/{CN_MANDARIN,JP}/die/amiyamrfz.mp3` 因此没被改名，而 `die/char_002_amiya.mp3` 不存在 ⇒ 阿米娅没有本地阵亡配音，只能走在线）；`modules/index.ts` 的开局前分支把**模块名**传给了 `getCharModules(char)`（该方法要的是干员名）。

### 修复：旧 id → uid 对照表补录阿米娅与望，并把表外置成 `json/legacyCharIds.json`

对照表 = `src/arknight/legacyCharIds.ts`（改名前玩家存档里的旧干员id → 明日方舟uid，只被 `arkidMigration.ts` 消费）。缺两条：

- **`amiyamrfz → char_002_amiya`**：`scripts/arkid-rename-map.json` 里根本没有这条（254 条映射中不存在 `amiyamrfz`），因为 `--gen-map` 是**扫描当时的干员文件**产映射的，而阿米娅是手工改成 uid 的 ⇒ 旧 id 从文件名上消失，脚本再也扫不出来。
- **`wangmrfz → char_2027_wang`**：映射表里有这条，但 `--apply` 因 `{id}_${key}` 动态键把它跳过了（changelog 任务二一节记过），干员文件后来仍被整体改成 `char_2027_wang/index.ts`（内部的 `wangmrfz_${key}` 也已同步改成 `char_2027_wang_${key}`，见该文件 46/305/322/327/431 行）⇒ 注册的是 uid、存档里的旧键没人认领。

改动：

- **表体落到 `json/legacyCharIds.json`（255 条，tab 缩进）**，`legacyCharIds.ts` 退化成读取入口。**用静态 `import json` 而不是 `whichWayFile.readFile`**：迁移必须赶在任何阶段模块求值之前跑完（`init.js:47-49` 的注释），改成异步读文件等于把一次性迁移压在 `game.promises` 上，环境不支持或读失败就是**静默丢配置**；静态 import 由 vite 的 json 插件编进 `chunks/arknight-arkidMigration-shared.js`（已核对产物含 `amiyamrfz:`/`wangmrfz:` 两个键），同时 `viteStaticCopy` 的 `{ src: "json" }` 会把原文件一并带到产物的 `json/` 下，人读/外部工具复用都还在。
- **`--gen-migration` 现在写两个文件**（JSON + 读取入口），并补了两条收录规则，否则重新生成会把上面两条再丢掉：① 被 `skipped` 但「旧 id 已不在注册表、新 uid 已在注册表」的干员照样进表（自动捞回 `wangmrfz`）；② 新增 `MANUAL_MIGRATIONS` 手工补录表（`amiyamrfz`），旧 id 仍注册在表时只告警不写入。
- **迁移标记位从布尔改成「表条目数」**（`arkidMigrated`）：老值 `true ≠ 255` ⇒ 已经迁移过的存档会**再跑一次**，新条目才可能生效（不这么改，这次补录对任何已有存档都是空操作）。重跑是安全的：`remapKeys` 命中新键就丢弃旧键、`remapIdsInString` 只在整段标识符匹配时动手，全部幂等；且表里没有任何 value 同时是另一个 key，不存在二次改写。
- 写入 JSON 用 `JSON.stringify(…, null, "\t")` 而不是照搬 TS 对象字面量的写法：**JSON 不允许可尾逗号**，第一版直接拼 `,` 收尾导致 `vite:json` 构建失败（`Failed to parse JSON file … 256:32`）。
- 排查过的碰撞风险：`wangmrfz` 现在只是「旧干员id」，不是技能id——`char_2027_wang` 的派生技能是 `char_2027_wang_wangmrfz`（`years`/`yearsTrans` 的内层键 `wangmrfz` 只是拼键用的字面量），所以 `migrateAudioConfig` 里「跟着干员id 换 `custom[*].skills`」不会误伤技能名。
- 验证：`--gen-migration` 跑两遍产物字节一致（幂等）；`pnpm eslint` 两文件 0 报错；`WW_SKIP_STATIC_COPY=1 vite build` 通过。**实机未验证**。
- **本次未动的遗留**（都是**资源文件名**还是旧 id，与对照表无关，要动得改名资源，等确认）：`audio/{CN_MANDARIN,JP}/die/amiyamrfz.mp3`（⇒ 阿米娅仍无本地阵亡配音）、`image/character/amiyamrfz.jpg`、`image/skin/amiyamrfz/`、`image/character/wangmrfz.jpg`、`dynamicSkin/illust/wangmrfz/经典形象`；另外 `src/skin/dynamicConfig.js:1200` 的键还写着 `wangmrfz` ⇒ 望的动皮配置从改名那天起就是死条目（`--apply` 跳过它时漏改的跨文件引用，`CROSS_FILES` 名单里是有这个文件的）。

### 新增：皮肤拖拽调位缩放 `src/skin/portraitPos.ts` + `src/skin/portraitDrag.ts` + `json/pos.json`

给玩家一个自助调整干员立绘/皮肤**位置与大小**的入口：场上系统栏按钮「皮肤拖拽」→ 拖动改位置、滚轮/双指改大小，结果落盘 `json/pos.json`，之后每次加载立绘都按这份设定画。三层分工：`portraitPos.ts` 只管数据（读/写/查），`avatarBackground.ts` 管画（`Layers.setImage(url, pos)`），`portraitDrag.ts` 管交互（Pointer Events）。

- **只有明日方舟干员能拖，是结构决定的而不是判据**：可拖的前提是节点上挂着 `PortraitLayers` 的两层背景（`hasPortraitLayers(node)`），而背景本身只在 `isArknght` 为真时才建（见上一条「收窄」）。本体武将/其它扩展角色的节点没有子元素，拖了没有东西可动。
- **默认缩放 1.5 从 `PortraitLayers.vue` 的硬编码 `transform: scale(1.5)` 变成组件缺省值**（`DEFAULT_PORTRAIT_SCALE`）：原来写死在 `<style>` 里就被 scoped 样式锁住，行内 style 覆盖不掉，也就没法调。改成 `withDefaults` 后「没有配置 = 1.5 倍、不偏移」，老用户观感零变化。
- **存档单位是比例而不是像素**（`x/y` = 偏移量 ÷ 立绘框尺寸，`scale` = 绝对倍率）：这样一份配置与窗口分辨率、与无名杀自带缩放都无关。`translate(…%, …%)` 的百分比按元素自身尺寸换算，而内层就是 `inset:0` 的框（等于节点尺寸），还原是线性的。
- **无名杀自带缩水的处理**：`ui_zoom` 的实现是 `document.body.style.transform = scale(zoom)`（`apps/core/noname/ui/index.js:601-614`，比值存在 `game.documentZoom`），于是 `PointerEvent.clientX` 的**屏幕像素**与 CSS 的**布局像素**差一个倍数。所有位移先 `delta / (game.documentZoom || 1)` 换算成布局像素再除以 `node.clientWidth/Height`（`clientWidth` 是不含 transform 的布局尺寸，正好是分母）。不除的话 150% 缩放下拖动会超出实际距离一半。
- **配置键从 `background-image` 的 url 反解**（`resolvePortraitKey`：`…/skin/{干员id}/{皮肤名}.png` ⇒ 干员+皮肤；`…/character/{干员id}.png` ⇒ 「经典形象」），而不是直接取角色名：绘制入口之一（`installRedirect` 里的 `setBackgroundImage` 重定向）只有图片路径没有角色名，两条入口必须能还原出同一个键。**要 `decodeURIComponent`**：浏览器序列化 `style.backgroundImage` 时会把空格与中文转成 `%20`/`%E4%B8%AD`，而 `mountPortrait` 是自己拼的原始路径，不解码同一个皮肤会有两个键。
- **不用 interactjs**：仓库里已有这个依赖（MIT），但只有 `GloriousIdeal/battleOverlay.ts` 用它，拖进来等于给 `chunks/skin-PortraitLayers-shared.js`（已 405kB）再叠 ~140kB 只为一个 div 的拖拽。改用 Pointer Events 一套 API 同时覆盖鼠标/单指，双指 `pointermove` 按间距比值缩放，`setPointerCapture` 保证拖出头像不断。
- **拖拽模式吃掉 `click`**：引擎的点击查看绑在 `player` 节点（头像的父级）上，不拦的话每拖一次弹一次玩家菜单。代价是拖拽模式期间点立绘不会打开玩家菜单——这个模式本来就是用来调图的。
- **落盘节奏**：`setPos` 只写内存 + 300ms 合并写盘（每个 move 都发 IPC 会打爆），松手与退出拖拽时 `flushSave()` 立刻补一次，避免「调完立刻关游戏」丢掉最后一次调整。
- **进模式先 `snapshotPos()`，浮动条给「重置本次调整」**：调坏了能当场回滚，不用去翻 `json/pos.json`。
- **HUD 的 toast id 自己记账**（`hudToastIds`）而不是像动皮那样遍历 `whichWayToast.toastRegistry`：id 是按干员动态生成的，而 `toastRegistry` 带自定义 `get` 方法、键类型不规整，遍历它既难写也容易被后续改动打中。
- **已知取舍 —— 节点上的影子副本不跟随 `transform`**：影子副本（`node.style.backgroundImage`，供战报浅克隆/`smoothAvatar`/`ui.fakeme` 读）要是也位移就得写 `node.style.transform`，而 `.avatar` 的 transform 会连带动到 `.name`/`.hp` 等兄弟层。它本来也从不带内层那个默认 1.5 倍缩放，所以只是维持原状。
- **开发仓库里 `json/pos.json` 会被下一次构建覆写**：`viteStaticCopy` 的 `{ src: "json" }` 把源目录的空白 `pos.json` 拷进产物，而运行时写的也是同一个文件（`extDir` 就是 `apps/core/extension/WhichWay`）⇒ 在 dev 里调好位置、再跑一次 `vite build` 就回到默认。打包给玩家不受影响（玩家目录没有构建过程），但**调试时别把「构建后位置没了」当成 bug**。
- 拖拽对象取 `game.players.concat(game.dead)` 的 `node.avatar`/`node.avatar2`（与 `refreshSkin()` 同源），阵亡角色也留着，方便一并调构图。
- 验证：`pnpm eslint` 全部改动文件 0 报错；`WW_SKIP_STATIC_COPY=1 vite build` 通过；`resolvePortraitKey` 的 url 解析用 node 跑了 6 组形态（编码/未编码、皮肤目录/立绘目录、裸路径、空串）符合预期；**完整 `vite build`（不带 `WW_SKIP_STATIC_COPY`）已通过**，`viteStaticCopy` 报「Copied 12 items」，产物里确实有 `css/portraitDrag.css` 与 `json/pos.json`（缺了这两个：浮动条没样式、`loadPos` 读空文件，属于静默降级，所以必须跑一次不带跳过的构建）。**实机未验证**（浏览器 MCP 加载不了 dev app）：拖拽手感、`documentZoom` 换算是否真的对齐、双指捏合在移动端的表现都需人工进游戏确认。

### 改动：武将卡立绘改为直接展示原始图片

`src/characterCard/CharacterCard.vue` 的 `.charImageWrapper > .charImage` 去掉径向 `mask-image` 渐隐，`background-size` 从 `cover` 改 `contain`（配 `no-repeat`），`aspect-ratio: 2/3` 与 `width: 100%` 保留（`spineWorker.updateDyc` 挂的就是这个元素，尺寸锚点不能动）。武将卡要的是「看清这张图原本长什么样」，所以不裁剪、不渐隐；场上头像是另一套观感（`PortraitLayers.vue` 的 `cover` + `pos.json` 调位），**卡面刻意不读那份配置**，避免「在场上调过位置之后卡面跟着跑」。

### 新增：主动贴干员图 `whichWaySkin.addPortrait()` / `mountPortrait()`

本模块原有的绘制入口全是被动的（引擎 `setBackground` 时改道），主动往一个节点上贴干员立绘/皮肤的场景（投稿预览、自定义面板、对话框卡片）没有劫持可用，直接写 `style.backgroundImage` 会踩回「透明区域透出底下的东西」的老问题。

- `avatarBackground.ts` 导出 `mountPortrait(node, image, pos?)`：`installRedirect` + `ensureLayers` + `setImage`，与劫持路径**同一套组件、同一份位置设定、同一份影子副本**，保证同一张图在两处观感一致。`image` 接受 scheme 路径（`illu:`/`skin:` 等，走 `whichWayFile.compilePath`）或已写好的 `url(...)`；`pos` 留空则按路径反解 `pos.json`。节点必须是 div 且有尺寸（两层背景是 `position:absolute; inset:0`）。
- `WhichWaySkin.addPortrait(node, name, skin?)`：把「干员名 + 皮肤名」解析成图片路径再转交上面那个函数——指定皮肤走 `getCharacterSkin`，留空走 `getCurrentSkinPath`（即该干员当前生效的皮肤）。解析不到就返回 `false` 且不动节点。
- 不校验干员身份：`mountPortrait` 是底层能力，调用方既然指定了图就该由它决定贴谁；带干员名的那层校验在 `addPortrait` 的查表失败里已经体现了。

### 新增：ConfigUI「征稿在前」面板 `src/configUI/component/solicitForth.vue`

列出**明日方舟有、驶舰之向还没做**的干员，卡牌为「立绘 + 中文名 + 干员id」，右上角打「未实装」角标；同时提供搜索框，可按干员id、中文名、拼音检索。已在 `main.vue` 的 `panels` 末尾注册为「征稿在前」。

- 数据源就是 `vaildArkId` 与 `exsitArk` 的差集（`exsitArk` 由武将包构造流程 `addShcema` 逐个登记，恒为其子集）——**不需要另维护一份「待做清单」**，实装一个就自动从这页消失。名字取 `arknightData.character_table[id].name`（`loadShcema` 已把 `char_patch_table.patchChars` 并进主表，升变形态也有名）。
- 图片走 `<img loading="lazy" decoding="async" fetchpriority="low">` 而不是 `background-image`：未实装名单约 200 条（全量 463 名干员 − 已实装 258 个注册id），背景图会一次性全部解码，原生懒加载只滚到附近才要图；`fetchpriority=low` 沿用 `BackgroundPanel.vue` 处理几十兆大图的同一套写法。
- **有没有图不靠猜**：用启动期扫目录建的 `whichWayFile.characterPortraitExt` 索引判存在（没条目就是本地真没这张图，渲染「暂无立绘」占位），避免 463 个干员里没做过的那批全发一次 404。
- 搜索串 = `干员id + 中文名 + 全拼（带空格与不带空格两种写法）`，`pinyin-pro` 用法与 `charPicker.vue`/`backgroundSet.vue` 一致；索引在 `onMounted` 一次算好，输入时只做字符串匹配。
- 搜索语义区分三种情况，免得玩家以为搜索坏了：命中未实装 → 进结果列表；命中的是**已实装**干员 → 明确告知「明日方舟里有，驶舰之向也已实装」；表里根本没有 → 「没有找到这个id／名字／拼音」。
- 卡牌图片用 `object-fit: contain` + `object-position: center top`：这页要的是看清鹰角画了什么，不裁剪也不套 `pos.json` 的调位。
- 验证：`pnpm eslint` 新文件 0 报错、`WW_SKIP_STATIC_COPY=1 vite build` 通过（`chunks/configUI.js` 29.58 → 33.85 kB）。**实机未验证**：这一页依赖运行期的 `vaildArkId`/`exsitArk`，离线只能验数据源与构建，列表数量与懒加载表现需进游戏确认。

### 修复：两层背景把武将卡/头像的圆角盖成直角

`ui.create.buttonPresets.character`（以及场上的 `.avatar`）本身是**带圆角**的：主题样式表给 `.avatar`/`.avatar2`/`.button`/`.card`/`.player` 写了 `border-radius: 8px`（`apps/core/theme/woodden/style.css:6-23`、`theme/simple/style.css` 同构），玩家还能用「圆角大小」设置改成 4px / 0 / 16px（`layout/default/layout.css` 的 `#window[data-radius_size=…] .avatar, … .button`，配置项见 `library/index.js:3750`，默认 `default` 即 8px）。

劫持之后两层背景是**实心方块**，把宿主这圈圆角整个盖住 ⇒ 观感上「圆角属性没了」。修法是让两层跟着宿主走，两处各加一条：

- `avatarBackground.ts` 的中间宿主 div（`ensureLayers()` 里防 `render()` 抢子节点而垫的那层）：内联样式补 `border-radius:inherit;overflow:hidden`。
- `PortraitLayers.vue` 的 `.sjzxPortraitWrapper`：补 `border-radius: inherit`（它自己已有 `overflow:hidden`，所以内层 `transform` 放大/偏移后照样被圆角裁掉）。

用 `inherit` 而不是抄一个 8px：`border-radius` 不是继承属性，但 `inherit` 关键字显式取**父元素的计算值**，于是宿主是 4/8/16px、甚至 `long` 布局的 `8px 8px 0 0` 都能对上，换主题与改设置都不用回这里改数字。`mountPortrait()` 走同一个 `ensureLayers()`，主动贴图的节点一并修好。**实机未验证**（只看得到代码层：圆角是运行时按宿主计算值裁的）。

### 修复/改动：`pos.json` 落盘可见性 + `posData` 暴露到 `whichWaySkin`

排查结论：**数据一直在写**，只是写的不是仓库里那份。落盘路径是运行时的扩展目录（`extDir = lib.assetURL + extension/WhichWay/` ⇒ 开发时是 `apps/core/extension/WhichWay/json/pos.json`），而 `packages/extension/WhichWay/json/pos.json` 只是随包发布的空白模板，所以「拖完去看源目录的 pos.json 是空的」是必然现象，不是没存。本次改动：

- **删掉源目录的空白模板 `json/pos.json`**：`viteStaticCopy` 的 `{ src: "json" }` 会把整个 `json/` 覆盖复制到产物，于是**每次完整构建都会把玩家（开发时就是玩家本人）调好的位置抹回空白**——实测确实抹过一回（14:18 产物里还有 `char_4051_akkord` 的一条，之后被 12:41 那次构建的复制盖掉）。而 `loadPos()` 本来就容忍文件缺失（先 `exsitFile` 再读），`writeFileAsJson` 会 `createDir` + 建文件，所以模板没有存在的必要：删了以后重建不再动运行时数据。插件只复制、不删除目标侧的多余文件（`json/cache/skin.json` 一直活得好好的），因此产物里已有的 pos.json 也不受这次删除影响。
- **`portraitPos.ts` 抽出 `writePosFile()`**（原来 `scheduleSave`/`flushSave` 各写一遍同样的调用），开发模式下每次成功写盘打一行 `[whichWayPortraitPos] 已写入 <绝对路径> 共 N 名干员`：位置到底进了哪个文件，看日志就行，不必猜。
- **`getPosData()` 导出活引用**，`WhichWaySkin` 上加 `posData` getter（+ `getPortraitPos(name, skin)` 与 `flushPortraitPos()`）：控制台 `whichWaySkin.posData` 直接看当前生效的配置。给的是**同一个对象**而不是拷贝——调试要的就是内存现状；改了它不会自动落盘，所以要落盘用 `flushPortraitPos()`。
- 顺带清掉 `portraitPos.ts` 里没用上的 `game` import。
- 验证：`pnpm eslint` 全绿；`WW_SKIP_STATIC_COPY=1 vite build` 通过（本次刻意用跳过复制的构建，避免又抹一次数据）；离线核对 `writeFileAsJson(obj, path, name)` 与 `game.promises.writeFile(data, path, name)` 签名一致（`src/file.js:421`、`apps/core/noname/game/promises.js:84`）。**实机未验证**。

### 改动：「征稿在前」排除游戏内无法获取的角色

需求：明日方舟里有一批「有完整干员数据、有立绘，但玩家拿不到」的角色（预备干员系列、Sharp/Pith/Touch/Stormeye/Raidian/Misery/Mechanist/暮落/郁金香、盟约·辅助干员），不该出现在征稿名单里。

- **判据是角色表的 `isNotObtainable`**（`json/arknight/character_table.json`）。离线核对：全表 1382 条**每条都有这个布尔**，`true` 恰好 29 条，逐条对上了需求点名的所有例子 —— 14 条预备干员（`char_5xx_r*` 5 条 + `char_6xx_c*` 9 条）、Sharp×3（含 `char_617_sharp2` 领主·Sharp）、Pith×2、Touch×2、Stormeye×2、郁金香×2、Raidian、Misery、Mechanist、暮落(`char_512_aprot`)、盟约·辅助干员(`char_616_pithst`)；而阿消(`char_277_sqrrel`)、洛洛(`char_4040_rockr`)、罗宾(`char_451_robin`)、迷迭香(`char_391_rosmon`) 全是 `false`。
  **不要换成别的判据**：`rarity` 这类拿不到的也有 TIER_5/6；`itemObtainApproach` 只是 `null`，而剧情赠送的阿米娅是「主题曲剧情」、罗宾是「活动获得」，靠它会把可获取的也排除掉；id 前缀（`char_5xx`/`char_6xx`）同理不成立 —— 4xx/5xx 段里就有黑角 `char_500_noirc`、杜林 `char_501_durin`、夜刀 `char_502_nblade`、巡林者 `char_503_rang` 四名可获取干员（整个 5xx~6xx 段的可获取项只有这四条，其余全是预备干员与 NPC）。`char_patch_table.patchChars` 只有升变阿米娅 2 条，也都是 `false`。
- **三处同步**（改精简缓存白名单的老规矩）：`slimArknightData()` 两个循环都带上 `isNotObtainable`、`typings/arknight.d.ts` 的 `ArknightCharacterSlim` 补 `isNotObtainable?: boolean`、`slimCacheSchema` 1 → **2**。⚠️ 下次启动会走慢路径重建精简缓存（读 16MB 全量，一次性几百毫秒），这是设计好的失效机制，不是变慢的 bug。
- **新增 `WhichWayArknight.isObtainable(id)`**：查 `character_table[id] ?? patchChars[id]`，**字段缺失一律按可获取**（宁可多列一条待征稿，也不要把正常干员悄悄藏起来）。没有动 `vaildArkId`/`isArknght` —— 那些角色在场上/配音侧仍然是方舟干员，只是不进征稿名单。
- `solicitForth.vue`：条目加 `obtainable` 字段，`solicitable = 未实装 && 可获取` 作为列表与计数的唯一来源（计数文案改成「未实装 N / 共 M 名可获取干员」，离线核对 465 名干员 − 29 = **436** 名可获取，名单会相应少 29 条）；搜索命中无法获取的角色时不再报「表里没找到」，而是明确说「明日方舟里有，但游戏内无法获取（预备干员／活动 NPC 一类），不列入征稿名单」—— 否则搜「郁金香」会得到一个假话。
- 验证：`pnpm eslint` 全绿、`WW_SKIP_STATIC_COPY=1 vite build` 通过（`chunks/configUI.js` 33.85 → 34.65 kB）、`node` 离线核对计数与 29 条明细。**实机未验证**：29 条里没有任何一条被本扩展实装（逐个查过 `src/packs/character/` 目录），所以差集直接少 29，逻辑上不会有「已实装却消失」的情况，但列表数字与搜索提示仍需进游戏确认。

### 改动：「征稿在前」改为左右两栏 + 投稿渠道与规则

需求：版面从一列改成左右两栏，左栏（60%）放 `.submit-poster`／`search-box`／`card-grid`，右栏新增「群二维码 + 展示/复制群号」与四条投稿规则（其中 `ol费祎` 要能点开武将卡当强度参照）。

- **左栏 `flex: 0 0 60%`，右栏 `flex: 1 1 0`（不是 `40%`）**：`60% + 40% + gap` 已经大于容器宽度，写成 40% 会让右栏被压缩、左栏反而超出六成；让右栏「吃剩下的全部」才保住左栏精确的 60%。两栏都补 `min-width: 0; min-height: 0` —— flex 子项的 `min-height` 默认是 `auto`，不压成 0 的话 `.card-grid` 与 `.right-pane` 的 `overflow: auto` 会被内容顶开、根本不滚。搜索状态行跟着搜索框留在左栏（它是对这次搜索的反馈，属于名单那一侧）。
- **右栏一（投稿渠道）**：二维码 `image/decoration/qq1.jpg`（⚠️ 需求写的是 `qq1.png`，**仓库里实际只有 `qq1.jpg`**，且文件内容本来就是 PNG 编码、只有扩展名是 jpg，459×448）+ 群号 **104537053**。群号**直接显示**（不做隐藏/显示切换），下面两个按钮：「加入群聊」`window.open` QQ 的加群链接（`GROUP_JOIN_URL`，与 `config/index.js:61`、`package/index.ts:60` 的开外链方式一致；这条链接和二维码是**同一个来源**，里面的 `_wv`/`authKey`/`noverify` 由 QQ 生成、会过期，换二维码必须同时换它），「复制群号」把结果写在按钮文案上（1.5s 后恢复，`onBeforeUnmount` 清计时器）。
  - 复制先走 `navigator.clipboard.writeText`，不可用或拒绝时退回隐藏 textarea + `document.execCommand("copy")` —— 客户端的 `file:` 与局域网 http 都不是安全上下文，Clipboard API 在那里直接缺席。textarea 用 `position: fixed` 而不是 `absolute`：无名杀给 `body` 写了 `position:absolute; overflow:hidden`，绝对定位的偏移元素可能被裁掉而选不中。
- **右栏二（投稿规则）**：四条规则用 `<ol>`（编号由列表自己给，不再手写在文本里）。`ol费祎` 渲染成醒目链接（`#1ac2fd` + 加粗 + 下划线 + hover 发光 + `cursor:pointer`），点击调 `ui.click.charactercard("ol_feiyi", null, true)`。
  - id 存在性离线核对过：`apps/core/character/sp/character.js:396` 有 `ol_feiyi`、`sp/translate.js:1151` 译名「费祎」。它不是驶舰之向角色 ⇒ `whichWayCharacterCard.shouldUseStyle` 在默认配置（「扩展角色」）下不接管 ⇒ 走引擎原版卡。
  - **z-index 冲突与解法**：原版卡挂在 `.popup-container`（`layout/default/menu.css:17` 的 `z-index: 10`，`:62` 给它 `position:absolute` 铺满），而本设置面板的容器 `.whichWayConfigUIApp` 挂在 `document.body` 上是 `z-index: 19`（`configUI/index.js:46`）。`#window` 只是 `ui.create.div("#window.hidden", document.body)`（`ui/create/index.js:2291`），CSS 里的 `#window`（`layout.css:42-49`）**不带 `position`** ⇒ 不构成层叠上下文 ⇒ 两层在根层叠上下文里直接比大小 ⇒ 卡被面板整个盖住。解法：`ui.click.charactercard` 是同步函数、最后一句就是 `ui.window.appendChild(layer)`（`ui/click/index.js:4301`），所以调用完立刻把 `ui.window.lastElementChild` 提到 `z-index: 20`（与本扩展武将卡的容器同值，`characterCard/index.ts:134`）。判据同时要求 `.popup-container` **和** 内部有 `.menubg.charactercard`：配置改成「所有角色」时扩展的劫持会 `return false`、由本扩展自己的卡接管（容器进 `body`、已经是 `z-index:20`），那种情况下 `lastElementChild` 不是这层，不该去动它。
  - 第三参 `noedit=true` 让「收藏」「禁用」变灰（`ui/click/index.js:3467/3492`）：这是给人看的参照卡，不该顺手改玩家的配置。**刻意没有传 `resume`** —— 引擎的 `clicklayer` 只在 `resume` 为真时才 `game.resume2()`，而本面板 `show()` 已经 `game.pause2()`（`game/index.js:7276`，只管 `_status.paused2`）；传了 `resume` 会变成「关掉卡片后设置界面还开着，但游戏已经不再暂停」。
  - `feiyiAvailable = !!lib.character["ol_feiyi"]`：SP 内容包被关掉时规则文字保留、降级成普通文本，避免给出一个点了没反应的链接。
- **图片地址从 CSS 的相对 `url()` 换成脚本里的 `compilePath()` + 内联 `:style`/`:src`**（`.poster` 与二维码两处）。两个理由：相对 `url()` 在产物里解析不到扩展目录（自动样式表里那些 `./../../../image/…` 从 `css/` 出发指向的是 `apps/core/image/…`），且 1.5MB 的 `poster.png` 会被内联成 base64 —— 去掉这四条相对 url 后 `css/viteAutoCreateStyle.css` 从 **2.69MB 降到 251KB**。顺带删掉了 template 里没有任何元素用到的 `.submit-box/.submit-group/.count-box/.QRCode-*` 草稿样式。⚠️ `countText` 这个 computed 到今天仍然没有任何元素渲染它，本次没有动它、也没有顺手把它显示出来。
- 验证：`pnpm eslint`、`prettier --check` 全绿，`WW_SKIP_STATIC_COPY=1 vite build` 通过（`chunks/configUI.js` 34.65 → 38.13 kB，加群链接原样进了 chunk（`&` 没被转义丢弃）），产物 CSS 里已无相对 url 也无 qq/poster 的 base64。**实机未验证**：60/40 分栏的实际高度传递、二维码在右栏的缩放观感、「加入群聊」能不能真的拉起外部浏览器、复制按钮的反馈、以及点 `ol费祎` 时卡片是否真浮在设置面板之上，都必须进游戏看。本次没新增资源（`qq1.jpg`/`poster.png` 早就随包复制过去了），所以跳过复制的构建不影响可运行性，但下次仍应跑一次完整构建。

### 新增：`scripts/update-portraits.mjs` 补齐缺失的干员立绘

需求是「查缺 → 下载 → 压缩 → 归位」，并允许我换掉「先下 `character_table.json` + `skin_table.json` 再比对」的原方案。**实际方案：零大表下载，一次目录清单**。

- **站点接口（逆向自前端，改版时先看这几条）**：
  - 接口清单在 `https://torappu.prts.wiki/api/v1/openapi.json`（服务名 `ak-asset-storage`，MIT）。取资源文件用 `GET /api/v1/files/{path}` 列目录——**路径里的斜杠必须编码成 `%2F`**（`/api/v1/files/raw%2Fchar_arts`），且**必须带 `accept: application/json`**，否则网关把它当前端路由、200 返回 SPA 的 HTML。一次请求 408KB 就拿到 `raw/char_arts` 全部 1935 个文件的 `name/path/size`。
  - 取图 URL 抄前端 `AssetContent` 的拼法：`raw/…` 段换成 `assets/…`、只对最后一段做 `encodeURIComponent` ⇒ `https://torappu.prts.wiki/assets/char_arts/{portraitId}b.png`。
  - ⚠️ **未知路径不返回 404，而是 200 + 前端 HTML**，所以每份响应都先校验（清单校验能解析出 `children`、图片校验 PNG 签名 `89504e470d0a1a0a`）再落盘；清单里的 `size` 只用来判断临时缓存能否复用（CDN 若重新编码过 PNG，签名对就收下并只打一行警告，别让整批图卡死）。
- **为什么清单比两张大表好**：缺哪张图本地就算得出来（`json/arknight/skin_table.json` 给 portraitId，`image/illustration/character/` 给已有项），要问服务器的只有「远端到底有没有、叫什么名」。12MB 的两张表换成 408KB 的一次清单，还避免按猜测打 404：1377 个形态里远端只收录了 396 个基础立绘（其余是皮肤图，token/召唤物一个都没有）。`--update-tables` 仍保留原方案，但只写到临时目录（`os.tmpdir()/whichway-portraits`），**不动仓库的 `json/arknight/`**；要把新数据固化还是跑 `update-arknight-data.bat`。
- **命名与分类沿用 `split-illustration.mjs`**：先查 `{portraitId}b.png`、没有再查 `{portraitId}.png`（低星干员只有不带 b 的版本，如 `char_123_fang_1.png`）；落盘一律 `character/[形态id].png`。取 `ILLUST_2`（精二），**取不到就用 `ILLUST_0`（初始）替代** —— 即需求的「四星以下没有精二立绘」，判据用「skin_table 里有没有 ILLUST_2 条目」而不是 `rarity`：rarity 只说明该不该有，条目才说明拿得到哪张图，顺带覆盖了「有精二但站点未收录」。
- **范围口径与游戏侧一致**（抄 `src/arknight/index.ts`）：`isCharacter` = `subProfessionId` 存在且不以 `notchar` 开头；`isObtainable` = `isNotObtainable !== true`。`--scope obtainable`（默认）/ `char` / `any`，或 `--ids` 指定。
- **对公益服务器的负担**（需求第 3 条）：默认范围当前只缺 24 张 ⇒ 24 次图片请求 + 至多 1 次清单；串行（`--jobs` 上限 3）、每张间隔默认 400ms、清单缓存 7 天（`--max-age`/`--refresh-index`/`--offline`）、原始图落临时目录且**字节数与远端一致就复用**（中断重跑不重复下载）、`--limit` 限单次量。范围放大时报告里会直接印出「待下载 N / 原始合计 X MB」再决定。
- **压缩参数与 `compress-skin.mjs` 同构**（`-auto-orient -strip -colorspace sRGB -resize 1280x1280> -colors 256 -quality 9 -define png:compression-level=9`，不加抖动），magick 先写同目录 `.tmp.png` 再 `rename`（同目录 rename 原子，游戏读不到半张图）；**即使「压缩无收益」也照样落盘**——这一步的目的是让干员有图，不是省体积。⚠️ 只新增、从不覆盖：目标已有 png/jpg 就跳过，本地资源永不被改写。
- 实测：默认范围 24 张全部成功，原始 16.45MB → 落盘 4.47MB（约 3.7×，平均 251 色），`character/` 从 408 个形态补到 432；`--dry-run` 复跑「待下载 0」幂等。剩余缺口：4 个形态站点确实没有图（`char_4188_confes`、`char_4215_buddy`、`token_10007_phatom_twin`、`trap_079_allydonq`），`--scope char` 还有 26 张（预备干员与活动 NPC）、`any` 再多 2 张——**本次刻意没下**，它们不进征稿名单，要补再跑一次。
- 验证：`prettier --check` 通过；`pnpm eslint` 报 44 条 `no-undef (console/process)`——**与既有脚本同病**（`split-illustration.mjs` 同样报 17 条），根 eslint 配置只给 `src/**` 配了浏览器 globals，`scripts/*.mjs` 不在任何 lint script 的范围内，故未为此改配置。图像正确性用 `magick identify` + 人眼看抽查（`char_120_hibisc.png` 1280×1280 带 alpha、透明背景正常）。**实机未验证**：新增的是资源文件，运行目录 `apps/core/extension/WhichWay/image/illustration/character/` 要靠一次**不带** `WW_SKIP_STATIC_COPY` 的完整构建才会拿到（下次构建顺带完成，届时 24 张新图会进包）。

## 2026-10-13

### 任务一：`whichWayArknight` 新增干员id 清单与归属判断

`src/arknight/index.ts`（按需求原样拼写标识符）：
- `vaildArkId: string[]`：**全部**明日方舟干员uid 清单，`init()` 里在 `loadArknightData()` 之后由 `buildVaildArkId()` 构造，数据源是 `character_table` + `char_patch_table.patchChars`（第三张表没有干员主体，故不取），只收 `isCharacter()` 判真的条目。
- `isArknght(id)`：id 是否落在 `vaildArkId` 里。
- `addVaildArk(id)`：往 `vaildArkId` 追加（内部先去重）。
- `exsitArk: string[]`：扩展**已经做出干员**的明日方舟id，由 `addExsitArk(id)` 登记；登记点挂在武将包构造路径上（`addShcema()` 的三个成功分支，被 `src/packs/index.ts` 的 `registerExecute("character")` 调用），并且只登记 `isArknght()` 为真的id，保证 `exsitArk ⊆ vaildArkId`。
纯新增，不改任何既有行为。

### 任务二：干员id 全套改名为明日方舟uid（253 个）

新增 `scripts/rename-to-arkid.mjs`，模式：`--gen-map`（扫干员包+gamedata 出映射表）→ 检查 → `--apply` → `--revert`（按 journal 回滚）｜`--derived`（只补派生翻译键）｜`--gen-migration`（出迁移表）。
- **改名范围（全套同步）**：`src/packs/character` 文件名+文件内干员id；引擎按「名字+后缀」派生的 `{id}_prefix` / `{id}_ab` / `{id}_info`；立绘 `image/character`、皮肤 `image/skin/{id}/`、证章 `image/modules`、动皮 `dynamicSkin/illust`、死亡配音 `audio/{语言}/die`、`audio/{语言}/{技能}_{干员}{n}.mp3`、`image/skill/{技能}/{id}.png`、卡id 由 `${NAME}` 拼出时的 `image/card/{卡}_{干员}.png`；跨文件引用 `dynamicConfig.js`、`characterDesigner.js`、`packs/card`、`modules/data.ts`、`GloriousIdeal`、`css/skills.css`。
- **254 条映射里实改 253 条**，`wangmrfz` 跳过：它自身文件里有 `wangmrfz_${key}` 模板拼接键，改名会让派生键失配。`plot_keluxiermrfz` 按约定保留原名（uid 与主凯尔希冲突），21 个无对应uid 的干员也保留原名 ⇒ `character/` 现存 275 个模块，253 个 `char_*` + 22 个旧式命名。
- **刻意不动**：技能id / 卡牌id / 势力id；以干员id 为前缀的技能id（`fengxumrfz_youyimrfz` 这类注册与引用是同一串字面量，保持原样即自洽）；`shcema.js`、`groups.js`（有干员与势力同名，如 `hongmrfz`）；`*.md` 历史日志。
- 落盘 1182 次资源改名（`file=253 img=253 skin=202 dieAudio=369 skillAudio=40 dycIllust=56 cardImg=4 otherImg=5`）+ 263 个文本文件 + 派生键 34 文件/38 键；回滚只靠 `scripts/arkid-rename-journal.json` 与 `_backup_before_arkid_rename_src/`（`packages/extension` 被外层 gitignore）。
- `src/packs/index.ts` 的干员 glob 由 `*mrfz.ts` 改为 `*.ts` / `*/index.ts`（新id 不再以 mrfz 结尾），并核对当前 275 个条目全部命中新 glob，模块集合无增减。
- 静态资源里唯一按旧id 索引的运行时文件是 `json/cache/skin.json`（皮肤索引），已由改名脚本删除，下次启动因文件缺失自动重建。
- 验证：全量残留扫描（src 文本文件 0 处旧id，仅 `NEVER` 两个文件里的势力id `hongmrfz` 与文档注释里的 `wangmrfz` 为有意保留）；注册/立绘/皮肤齐备性对账 0 缺失；`root tsconfig` 的 `tsc --noEmit` 里新增文件 0 报错（仅 `packs/index.ts:197` 一处 `filter` 报错，改名前的备份里同样存在，属既有问题）。

### 一次性旧干员id 存档迁移 `src/arknight/arkidMigration.ts`

改名前的玩家存档里键还是旧id，不改写就会出现皮肤丢失、配音语言回退、模组失效、战役进度查不到干员。新增迁移模块，在 `whichWayInit()` 里**任何阶段模块求值之前**同步调用（`globalSave` 在入口就抓取了配置对象引用，所以全部**原地改写**不换对象），完成后写标记位 `extension_WhichWay_arkidMigrated` 不再重复执行（与 `characterPackDefaulted` 同一套一次性开关写法）。
- 覆盖：`extension_WhichWay_skinConfig`、本体 `skin`（键 + `[名, 路径]` 里的 `image/skin/{旧id}/` 段）、`qhly_skinset`（skin/skinAudioList/audioReplace/djtoggle）、`banSkinSJZX`、`extension_WhichWay_audioConfig.custom`（键 + 其 `skills` 列表）、`modulesSet`、`whichWay_ConfictedSkin_selectedSkins`、瑰丽理想 `localStorage` 战役存档（递归换键与等于旧id 的字符串值）。
- 映射表 `src/arknight/legacyCharIds.ts`（253 条）由 `--gen-migration` 从映射表生成，勿手改。落库一律沿用各子系统既有调用形态（含 `saveConfig("skin", …, undefined)` 会被默认参数变成 `extension_WhichWay_skin` 的既有行为），不趁机改语义。
- 瑰丽理想 `SAVE_KEY` 写字面量而不 import `campaign.ts`：那个模块只在开发服务器下加载，迁移要在所有环境跑。
- 单项失败只 `console.error` 跳过，其余继续；整体异常则不写标记位，下次启动重试。
- 验证：`esbuild` 把模块连 stub 依赖打成临时脚本离线跑 18 项断言（键换、对象引用不变、路径换、战役递归、新旧键并存时保留新值、二次调用不再存盘）全绿；过程中抓出并修掉两个真缺陷——`deepRemap` 原先不换「对象属性值正好是id」（`roster[].id`）、`remapKeys` 的 `delete` 漏在 else 分支导致新旧键并存。实机未验证（浏览器 MCP 加载不了 dev app），`pnpm eslint` 与 `WW_SKIP_STATIC_COPY=1` 构建通过。

### 新增立绘分离脚本 `scripts/split-illustration.mjs`

把 `image/illustration/source`（501 张明日方舟原始立绘，文件名 = `portraitId + "b" + 扩展名`）按 gamedata `json/arknight/skin_table.json` 分离：
- **角色 id 口径**：用 `skinId` 里 `@`/`#` 之前的「形态 id」（普通干员即 charId，如 `char_002_amiya`），能自然区分阿米娅三形态（`char_002_amiya` / `char_1001_amiya2` / `char_1037_amiya3`）——它们 `charId` 相同但形态 id 不同，不会在 `character/` 撞名。
- **分类规则**：
  - 精二（`skinGroupId === "ILLUST_2"`）→ `character/[形态id].png`
  - 真实皮肤（有 `displaySkin.skinName`）→ `skin/[形态id]/[皮肤中文名].png`
  - 初始/精一（`ILLUST_0`/`ILLUST_1`，gamedata 无中文名）→ `skin/[形态id]/初始立绘.png`｜`精一立绘.png`
  - `_sp` 变体（文件 `{portraitId}_spb.png`，对应 gamedata `spPortraitId = "sp_"+portraitId`，是**同一皮肤的异格立绘**而非独立干员）→ 与母皮肤同目录，命名 `[母皮肤中文名][皮肤序号].png`（序号取自 skinId 的 `#N`，如 kalts 皮肤「时遗」的异格 → `时遗14.png`）
- 反查用「`portraitId+"b"`」「`portraitId+"_spb"`」两键，不从文件名硬拆角色 id；皮肤中文名做 Windows 非法字符清洗。
- 默认执行**剪切(move)**；`--copy` 改复制、`--dry-run` 只预览。目标已存在或计划内撞名一律跳过不覆盖。
- `--dry-run` 实测：501 张全部命中、0 未匹配、0 冲突（精二 137 / 皮肤 203 / 皮肤·异格 4 / 初始 156 / 精一 1）。
- 已用 **`--copy` 复制模式执行**：`character/` 137 张、`skin/` 364 张（159 个形态子目录）、`source/` 原件 501 张保留未动。阿米娅三形态精二分别落 `char_002_amiya.png`/`char_1001_amiya2.png`/`char_1037_amiya3.png`。

### 新增皮肤压缩脚本 `scripts/compress-skin.mjs`

`test/skin` 里 1394 张立绘约 7.9GB、普遍 1300–2400px，远超游戏内显示需求。用 ImageMagick 7（`magick`）批量降体积：
- 策略：`-auto-orient -strip -colorspace sRGB -resize <MAX>x<MAX>>`（只缩不放）。默认长边上限 1280（`--max` 可调）。
- **默认输出 PNG（保留逐像素 alpha）+ 调色板量化**：`-colors 256` 把真彩降为 ≤256 色调色板 PNG，是进一步压缩的主力；再叠 `-define png:compression-level=9 -define png:compression-strategy=0`。
  - **刻意不加抖动**：实测 FloydSteinberg 抖动产生的噪声会让 PNG 体积反弹数倍（同图 418KB→1.38MB）。渐变色带明显时才用 `--dither` 换取平滑（体积变大），或 `--colors 0` 退回真彩 PNG（体积最大、无量化痕迹）。
- 实测（3 张透明 RGBA 样本，默认参数）：合计省 **82%**（4.12MB→757KB），单张 -58%~-86%；量化后 **alpha 几乎无损**（透明均值 0.4880→0.4878、0~1 全量程保留），颜色 RMSE 仅 1.3%。对照：`--colors 0` 真彩 PNG 省约 58%；`--format jpg` 省约 96% 但会把透明区拍平烙上底色。
- 安全默认：不覆盖原图，产物写到 `<目录名>_compressed/`；`--inplace` 才就地替换，且首次覆盖前把原件备份到 `<目录名>_backup_original/`（按源扩展名存）；换格式时删旧扩展名文件；单张若没变小则丢弃产物保留原图。
- 选项：`--dir --max --quality --bg --format(png|jpg|keep) --colors(默认 256，0=真彩) --dither --jobs --dry-run --inplace`。
- 未跑全量（批量改资源不可逆，交由用户执行）。

### 新增干员id 查询工具 `scripts/find-arkid.bat` + `scripts/find-arkid.mjs`

输入明日方舟角色中文名，输出对应干员id（如 `温米` → `char_4081_warmy`），方便改名后查id。
- **`bat` 只是薄壳**（ASCII-only + CRLF，`where node` 预检后直接调 `node find-arkid.mjs`），全部解析/匹配逻辑在 `.mjs`：批处理读不动 8MB 的 JSON，且只有 node 能稳态处理 UTF-8 收发。
- **数据源**：`json/arknight/character_table.json` + `char_patch_table.json` 的 `patchChars`（异格/升变形态与本体同名但id 不同，只查前者会漏阿米娅三形态）；按 `src/arknight/index.ts` 的 `isCharacter()` 同一口径过滤（`subProfessionId` 存在且非 `notchar*`），否则 `trap_627_xb2amy 阿米娅` 这类陷阱会混进结果。
- **匹配**：名字精确命中优先，否则模糊（名字或id 片段包含），多条全部列出并给条数；异格形态标注「（异格/升变形态）」。
- **UTF-8 代码页切换放在 `.mjs` 里而不是 bat**：bat 里只要出现 `for /f ... in ('chcp')` 探测旧代码页，派生的子 cmd 会继承并抽干重定向/管道的 stdin，node 立刻读到 EOF、交互模式一行结果都不出（实测复现）。改在 node 侧用 `spawnSync("chcp", { stdio: ["ignore", ...] })`（子进程拿 NUL 句柄，不碰父进程 stdin），进入时切 65001、`process.on("exit")` 还原原代码页，仅 win32 生效、非控制台环境自动跳过。
- 三种用法实测通过：交互循环（`q`/空行退出）、命令行给名（`find-arkid.bat 温米` → `char_4081_warmy`）、管道喂名单（`find-arkid.bat < 名单.txt`）。`scripts/*.mjs` 与同目录既有脚本一样不在 lint 范围内（同样只报 `no-undef` 的 process/console，属仓库既有状态），未改动构建产物。

### 清理：id 统一后无用的转化代码（`arkuid` 机制）

干员id 已全部换成明日方舟uid，「本扩展id → 明日方舟uid」的显式声明转化层失去意义，删除 `arkuid` 全套：
- 删除 3 处干员声明（`char_1001_amiya2` / `char_1037_amiya3` / `char_1052_kalts2`，声明值与注册名完全相同）、`typings/characterPack.d.ts` 的 `arkuid?: string` 字段，以及 `initCharArknight()` 里的 `arkuid ||` 短路。
- `loadShcema()`：去掉 `hasArkCharacters` 过滤与 `arkUidToNames` 索引及主循环里的 `declaredNames` 分支，改为「ark 表 key 本身就是已注册干员 ⇒ 恒等映射」（`window.whichWaySave.hasChar(key)`）。
- `addShcema()`：同一条恒等规则替代 `declaredArkuid` 分支（`isCharacter(id)` 为真即 `extUID[id]=id`、`arkUID[id]=id`），顺带删掉只服务于旧命名时代的 `allCharacters.find(译名===info.name)` 兜底分支；签名去掉没人使用的 `char` 形参（`src/packs/index.ts` 调用点同步）。
- 效果比对：`char_1052_kalts2` 在主表（名「凯尔希·思衡托」，`redirect.js` 里对应别名注释已停用）、`char_1001_amiya2`/`char_1037_amiya3` 只在 `patchChars`——`loadShcema()` 把 patch 形态并入 `character_table` 之后恒等分支同样命中，比原先「表内查不到就退化成按译名反查并 `角色不存在` 警告」更准。
- **保留**：`shcema.character` 双向映射、按译名反查、`redirect.js`（含 `normal` 译名别名表）。`src/packs/character` 里仍有 20 个 `char_*` 之外的旧式命名干员（`wangmrfz`、`plot_keluxiermrfz`、`teleixisimrfz` 等，无对应uid 或按约定保留原名），这条反查路径仍在服役；`legacyCharIds.ts` + `arkidMigration.ts` 是一次性**存档**迁移（旧键写在玩家配置里，与运行时id 无关），也保留。

### 清理：`scripts/` 下的无用脚本

逐个核对引用与可运行性后删除两个：
- `split-card.mjs`：入口 `scripts/card-index.template.js` 已不存在（`src/packs/card` 现为 16 个扁平模块，由 `packs/index.ts` 的 `import.meta.glob` 直接收集），脚本第一步 `readFileSync` 就必抛。
- `flatten-character.mjs`：把 `{id}/index.ts` 提升为 `{id}.ts` 的一次性工具，已跑完；目录里只剩 `char_2027_wang/`（`index.ts` + `control.vue`，两个文件本就不满足它的「单 index.ts」前提），再跑只会输出「跳过」。
- 保留并确认仍有用：`make-core-index.cjs`（`release.bat` 引用）、`release.bat` / `release-dev.bat` / `pack-local.bat` / `update-arknight-data.bat`、`rename-to-arkid.mjs` + `arkid-rename-journal.json` + `arkid-rename-map.json`（`packages/extension` 被 gitignore，这三件是唯一回滚路径）、`split-illustration.mjs`（立绘流水线，见下条）、`compress-skin.mjs`（默认目录 `test/skin` 已失效，但它接受 `--dir`，未改动默认值）、`find-arkid.*`。

### 立绘/皮肤目录迁移到 `image/illustration/`（png 优先 + jpg 兜底）

图片取值目录整体从 `image/character`、`image/skin` 换到 `image/illustration/character`、`image/illustration/skin`，**旧目录文件一律保留未动**：
- `src/file.js`：`skin:` scheme 改指 `image/illustration/skin/`，新增 `illu:` → `image/illustration/`。
- 格式探测：新增 `whichWayFile.initCharacterPortraitIndex()`（启动期扫一次 `illustration/character`，同 id 有 png 记 png、否则记 jpg）、`getCharacterPortraitFile(id)`、`getCharacterPortraitPath(id)`；规则即「存在 png 则用 png，否则用 jpg，不做 jpg 缺失兜底」。
- 调用点全部换成上述方法：`src/packs/index.ts` 的 `char.img`、`src/skin/index.ts` 的「经典形象」条目（`name` 也跟随真实扩展名，供 UI 与皮肤系统对齐）、`src/GloriousIdeal/ui/components/common/format.ts` 的 `opPortrait`。
- 索引在 `src/init.js` 的 `file` 阶段建立（所有取图点都在 `onBeforeInit` 的同步路径上，必须先把目录清单备好）；无 fs 后端时 `getFileTree` 返回空清单，索引为空 ⇒ 一律按 jpg 取值，不会抛错。
- 引擎侧连带生效：`get.skinPath()` 是按 `char.img` 的上上级目录推导皮肤目录，`char.img` 换到 `illustration/character` 后，引擎的皮肤查找自动落到 `illustration/skin/{id}/`。
- `syncAllSkinConfig()` 读本体 `lib.config.skin` 的 `[皮肤名, 路径]` 时改为**按皮肤名重新解析路径**（解析不到才沿用存档原值），否则目录整体迁移后存档里烙着的旧 `image/skin/...` 路径会永远压住新位置。
- `src/extCompatible/qianhuan.js`（千幻聆音/随笔录兼容层）的 `prefix` 与 `skin.standard` 同步指向 illustration 两个目录。
- `AGENTS.md` 里的立绘/皮肤约定与 scheme 清单同步更新。
- **当时未改**：`src/packs/card/cuoe_huanyoumrfzCard.ts` 仍指 `image/character/char_362_saga.jpg`——那时 `char_362_saga` 在 illustration 目录下 png/jpg 都没有，而卡牌 `image` 是静态字符串没有探测机会，改了就 404。补齐全量后该立绘已到位，这条引用已在下一条改成 `illustration/character/char_362_saga.png`。
- ⚠ 当时的磁盘覆盖率缺口（167 个干员无立绘、120 个干员皮肤仍只在 `image/skin/`）已由下一条「补齐全量 illustration 立绘」关闭。
- 验证：`pnpm eslint` 七个改动文件 0 报错；`WW_SKIP_STATIC_COPY=1 pnpm build` 通过，产物中 `getCharacterPortraitPath` 出现在 `packs.js` / `skin-*` / `GloriousIdeal-battleOverlay-*` 三个 chunk；`tsc --noEmit` 无新增报错（`file.js` / `init.js` / `packs/index.ts` / `arknight/index.ts` / `qianhuan.js` 全部 0 条，`skin/index.ts`、`format.ts` 只剩既有的 `.vue`/路径别名解析报错）。实机未验证（浏览器 MCP 加载不了 dev app）。

### 补齐全量 illustration 立绘与皮肤（重跑分离 + 压缩 + 旧图兜底）

上一条的覆盖率缺口根因是**素材源目录当时放漏了**：`test/skin` 只有 501 张（gamedata 全量为 1390 张，另有 4 张查无记录），分离自然只覆盖一半。补齐后重跑：
- **分离**：`node scripts/split-illustration.mjs --dir test/skin --copy`。源目录现为 1394 张，分类命中 1390（精二 400 / 皮肤 520 / 初始 465 / 异格 4 / 精一 1）、未匹配 4 张留在源目录（`char_281_popka_sale#17`、`token_10002_kalts_mon3tr` 三个形态）。脚本对「目标已存在」一律跳过不覆盖，501 张老图原样保留，实际新进 889 张。用 `--copy` 而不是默认的 move：**`test/skin` 留作未压缩原件的唯一备份**，压缩步骤就不必再造 `_backup_original/`。
- **压缩**：对本次新增的 889 张按 `compress-skin.mjs` 同款配方就地处理（`-resize 1280x1280>` + PNG 量化 256 色、无抖动、`png:compression-level=9`；jpg 走 q82 + 4:2:0 + 透明拍平），**1.93GB → 326MB，省 83%**，0 张失败、0 张无收益。逐张「无收益就保留原样」的判定照抄脚本，避免越压越大。
- **兜底**：分离后仍缺精二立绘的 10 个干员（`char_122_beagle`、`char_285_medic2`、`char_286_cast3`、`char_376_therex`、`char_4093_frston`、`char_4136_phonor`、`char_4220_kormr`、`char_4227_gallus`、`char_4231_clemnt`、`char_4232_hbound`）在 gamedata 里没有 `ILLUST_2` 记录，把旧 `image/character/{id}.jpg` 复制进 `illustration/character/` 并过同一套压缩（7 张有收益、3 张无收益原样保留，663KB→639KB）。
- **清掉本次带进来的非角色图**：`illustration/skin/` 下的 `trap_024_npcsld`、`trap_035_emperor`、`trap_304_izdoc`、`trap_305_izwsdl`、`trap_306_izklst`、`trap_307_izsvas`、`token_10002_kalts_mon3tr` 七个目录（陷阱/召唤物，不是干员）已删；`character/` 与 `skin/` 里其余「未注册干员」的形态（如 `char_120_hibisc`、`char_1011_lava2`）是真实明日方舟角色，留着备用。
- **最终覆盖率**：274 个注册干员里 **273 个有立绘（99.6%）**，唯一没有的是 `extratranslatemrfz`（「额外翻译」伪角色，三个目录都无图，也不需要）；**252 个有皮肤目录**，缺的 22 个全部是 gamedata 里就没有皮肤记录的自创/测试干员（`acemrfz`、`ceshimrfz`、`plot_keluxiermrfz` 等）与 `char_4231_clemnt`、`char_4232_hbound`，即「本来就没皮肤」。目录现共 1416 张（`character` 402 png + 31 jpg，`skin` 460 个目录 983 张）、516MB；同一干员不会既 png 又 jpg（已核对无重复基名），png 优先逻辑因此不会被旧 jpg 干扰。
- ⚠ **皮肤索引需重建**：`json/cache/skin.json` 只按扩展版本号失效，新增 983 张皮肤不会被自动扫到，已删除已装产物里的 `apps/core/extension/WhichWay/json/cache/skin.json`（下次启动自动重扫；`arknight.json` 那份不能删、也没删）。**发给玩家时同理**——不bump 版本就得让旧缓存失效，否则更新后皮肤列表仍是空的。
- 旧目录 `image/character`（32MB）、`image/skin`（76MB）仍一律保留未动。旧 `image/skin` 里另有 8 个已有 illustration 目录的干员存在 illustration 没有的文件名，其中 6 个是错别字重名（`触及星晨`↔`触及星辰`、`上任达伟镇`↔`《上任达维镇》`、`清风`↔`轻风 LB01`、`飞跃甜蜜之城`↔`飞越甜蜜之城`、`登如昼`↔`灯如昼`、`自由`↔`自由··失效`），搬过去会让皮肤列表出现重复条目，故**没动**；真正独有的只有 `char_194_leto/来日欢歌.jpg`、`char_4204_mantra/万籁俱寂.jpg` 两张（gamedata 无记录），需要的话单独搬这两张即可。
- 验证：全量 `pnpm build`（含静态资源复制）✓ built in 10.26s，`chunks/` 无反向 `./extension.js` 引用，产物侧 `image/illustration` 与源码同为 1416 张、516MB，`char_4079_haini.png`（1280x1133）与 `char_4232_hbound.jpg` 均已落位，产物里 0 个 trap_/token_ 目录。实机未验证（浏览器 MCP 加载不了 dev app）。

### 配音设置详情区扩展：立绘 + 技能试听 + 死亡配音

`configUI/component/audioSetting.vue`：选中干员后，`detail-col` 不再只列配音语言，改为展示——
- **干员立绘**：与武将卡同源，取 `whichWaySkin.getCurrentSkinPath(name)` 作背景图。
- **配音语言切换**：保留原有列表（`setCustomAudio` + `version` 强制重算）。
- **技能试听**：列出 `get.character(name).skills` 每个技能（`get.translation` 译名）+ 一个播放按钮，点击调 `whichWayAudio.playSkillAudio(skill, name)`（在线/本地由扩展自动分流），与 `characterCard/panels/SkillPanel.vue` 的试听按钮一致。
- **死亡配音试听**：按钮调引擎 `game.tryDieAudio(name)`，扩展的 `game.tryDieAudio` 钩子按在线/本地分流。
新增布局 div 均显式 `position: relative`（规避全局 `div{position:absolute}` 塌陷）；播放按钮复用 `image/ui/Play.png`。`pnpm eslint` 与 `WW_SKIP_STATIC_COPY=1` 构建均通过；未在实机验证（浏览器 MCP 无法加载 dev app）。

### ConfigUI 新增「配音设置」「模组切换」两个面板

在扩展设置界面（`驶舰之向` 系统菜单 → ConfigUI）左侧菜单新增两个功能，均可搜索并单独调整对应干员。

- `configUI/component/charPicker.vue`（新增，两面板共用）
  - 搜索框 + 干员列表；匹配串由「干员中文名 + 干员 id(拼音) + 中文名拼音(pinyin-pro) + 各技能中文名/技能 id」拼成，支持中文、拼音（罗马拼音/英文）、技能三种搜法，空格与非空格拼音都能命中。
  - 通过 `v-model` 双向绑定选中干员，本身只负责“选谁”，选中后展示什么由调用方决定。
- `configUI/component/audioSetting.vue`（新增，功能一：配音设置）
  - 候选=全部驶舰之向干员（`window.whichWaySave.allCharacters`）；右侧列出该干员可用配音语言（`whichWayAudio.getCharacterAvailableLang`）、高亮当前语言（`whichWayAudio.getCharacterLang`）。
  - 切换方式参考 `characterCard/CharacterCard.vue` 的配音选择：点选调 `whichWayAudio.setCustomAudio(char, lang)` 落库，配 `version` ref 强制重算（配音配置为非响应式）；非驶舰之向干员弹 toast 拦截。
- `configUI/component/moduleSetting.vue`（新增，功能二：模组切换）
  - 候选=真正配置了模组的干员（`Object.keys(whichWayCharacterModules.modules)`，当前为普瑞赛斯、嵯峨）；右侧直接复用武将卡的 `characterCard/panels/ModulePanel.vue`（`getCharModules`/`setCharModules` + 换模组重启提示），`<ModulePanel :key="selected">` 随所选干员重建。
- `configUI/main.vue`
  - `panels` 数组追加「配音设置」「模组切换」两项并 import 对应组件（新增标签页只需这一步）。

说明：配音面板的语言列表与武将卡一致，取干员的 `avaiableLangs`；无明日方舟配音数据的干员显示“暂无可切换的配音语言”。构建（`WW_SKIP_STATIC_COPY=1 pnpm -F ./packages/extension/WhichWay build`）与 `pnpm eslint` 均通过。

### 重构：模组系统 `getCharModules` 返回值类型精确化（不改运行时逻辑）

`src/modules/index.ts`、`typings/modules.d.ts`。原 `getCharModules(name, current)` 声明为 `characterModulesUIConfig | undefined`，但实际按 `current` 与 `name` 语义返回**三种形态**（单个模组 / 以模组 ID 为键的字典 / `undefined`），调用方（`ModulePanel.vue` 用 `getCharModules(name,false)` 取字典再 `Object.keys`、`getCharModules(name)?.id` 取单个；`setCharModules` 用字典索引 `modules[moduleName]`）都在依赖这个隐式约定，返回值含义混乱。

- `typings/modules.d.ts`：抽出 `characterModuleEffect`，给 `characterModulesUIConfig` 补可选 `effect?`（`initCharModules` 会读 `module.effect`，原类型没声明）；保留 `characterModulesUIConfigs`（字典）别名并注明语义。
- `src/modules/index.ts`：
  - 用 **TypeScript 函数重载**把三态写成精确契约——`getCharModules(name, current?: true)` 返回 `characterModulesUIConfig | undefined`，`getCharModules(name, current: false)` 返回 `characterModulesUIConfigs | undefined`，实现签名返回三者并集。运行时分支/守卫（`id==="default"`、`hasChar`、`modulesList.includes`、递归解析 `modulesSet[id]`）逐一保持不变。
  - 抽出私有 `buildDefaultModule(charName)` 复用基础证章构造；`current===false` 的字典改用显式 `characterModulesUIConfigs` 逐键构建（仍是引用原 `modules[name]` 对象并补 `url/id`，副作用与原实现一致）。
  - 去掉冗余 `(name as string as string)` 双重断言；局部改名（`id`/`charModules`/`allModules`）避免与类字段 `modules` 同名遮蔽；修正 `initCharModules` 里 `for` 循环 `}}` 的错乱缩进（纯排版，`module.name==="default"` 与循环内 `return` 等逻辑原样保留）。
- 兼容性：外部调用方无需改动即从隐式约定变为编译期精确类型（`.vue` 为 JS 不做类型检查，行为一致）。

遗留观察（未改，属既有逻辑）：`modulesList` 存的是模组**中文名**而非 ID，故按 ID 解析分支 6 依赖名称命中；`initCharModules` 判据用 `module.name==="default"`（而默认模组 `name` 是“基础证章”、`id` 才是 `default`）且 `for...of` 内用 `return` 提前退出整轮。这些保持原样，仅在此标注，是否修正待确认。

### 修正：上述两处既有逻辑（经确认后修复）

- `src/modules/data.ts`：`modulesList` 改为收集模组 **ID**（`Object.values(modules).flatMap(sub => Object.keys(sub))`），与 `getCharModules` 里按 ID 解析模组、以及角色/模组重名校验的语义一致（原实现取的是模组中文名，导致 ID 解析分支几乎命中不了）。
- `src/modules/index.ts` `initCharModules`：默认模组判据由 `module.name === "default"` 改为 `module.id === "default"`（默认模组 `name` 为“基础证章”、`id` 才是 `default`）；块内 `return` 改为 `continue`——原为 `forEach` 的 `return`（等价 continue），迁到 `for...of` 后若仍用 `return` 会在处理完美队后跳过其余干员。

#### 修复：新面板的 div 被全局样式强制成绝对定位导致布局塌陷

无名杀核心有一条全局规则 `apps/core/layout/default/layout.css:31` —— `div { display: inline-block; position: absolute; transition: all 0.5s; }`：任何没写 `position` 的 `<div>` 都会被强制绝对定位、脱离 flex/normal-flow，使左右分栏与干员列表叠成一团（这也是 CharacterCard/backgroundSet/ModulePanel 里几乎每个盒子都手写 `position: relative` 的原因）。

- `charPicker.vue` / `audioSetting.vue` / `moduleSetting.vue`：给所有参与布局的容器与 flex 子项（面板根、`picker-col`、`detail-col`、`detail-title`、`current-line`、`hint`、`lang-list`、`search-box`、`char-grid`、`char-item`、`empty-tip`）显式加 `position: relative`；仅配音语言项里刻意覆盖用的 `.choice/.nochoice/*.selectText` 保持 `absolute`。eslint + build 通过。

### 修复：皮肤名带空格时立绘读不出来（`url()` 未加引号）

「夏卉 FA017.png」这类皮肤名（明日方舟皮肤本身就有空格）走的是 CSS 背景图路径，而 CSS 的**无引号 `url()` 里不允许出现空格**——`url(extension/…/夏卉 FA017.png)` 是非法声明，浏览器会把**整条 `background-image` 丢掉**，表现出来就是选了带空格的皮肤后立绘空白。带空格的资源名共 61 个，且扩展内没有任何文件名含引号，所以加引号零风险。

排查范围核对：引擎侧本来就空格安全（`HTMLDivElement.prototype.setBackgroundImage` 已经输出 `url("${lib.assetURL}${img}")`，`setBackground` 直接取 `lib.config.skin[name][1]`；fs 后端 `assertValidPath` 只拦 `\0`，`requestBackend` 走 `URLSearchParams` 编码），需要改的只有扩展自己拼 `url()` 的地方。`new Image().src` 之类的赋值由 URL 解析器自动把空格转成 `%20`，不受影响。

- `src/characterCard/CharacterCard.vue`：模板两处改 `url('${…}')`（卡面背景、势力 logo）；脚本 `charImageStyle` 改 `url("${url}")`（立绘，主因）。
- `src/characterCard/panels/SkinPanel.vue`：皮肤缩略图 `url('${skin.path}')`。
- `src/characterCard/panels/ModulePanel.vue`：模组图 `url('${mod.url}')`。
- `src/configUI/component/audioSetting.vue`：配音设置面板立绘 `url("${url}")`。
- `src/skin/spineWork.js`：动皮背景层 `url("${bgUrl}")`。
- 取值前的 `url.startsWith("url")` 分支保留：兼容配置里已经写成完整 `url(...)` 的历史值。
- 验证：全 `src` 复扫动态拼 `url(` 的位置只剩带引号形态（静态 CSS 里是写死的字面量，无空格）；六个文件 `pnpm eslint` 0 报错；`WW_SKIP_STATIC_COPY=1` 构建通过，产物 `chunks/` 内可见 `url('` / `url("` 形态且无反向 `from "./extension.js"`。真机未验证（浏览器 MCP 加载不了 dev app）。
- 顺带记录（未改，属本体逻辑）：`apps/core/noname/library/index.js:369`、`init/index.ts:383-428` 的卡背/血量图也是无引号 `url(${…})`，用户自定义卡背文件名带空格会同样失效。

### 新增：v1.6 一次性删除皮肤缓存 `clearSkinCacheOnce()`（`src/skin/index.ts`）

皮肤索引缓存 `json/cache/skin.json` 里烙的是**扫描当时的图片路径**，而 `autoUpdateSkinData()` 只要「缓存版本号 == 当前扩展版本」就直接复用（`version === whichWayVersion.ext`）——目录迁移并不改版本号，坏路径会一路活到 1.6.x 的每个小版本。故按要求加一次性清理：

- 新增 `WhichWaySkin.clearSkinCacheOnce()`，在 `autoUpdateSkinData(forced)` **最前面**调用（必须早于读缓存的分支，否则本轮启动仍会用旧数据）。
- 版本门控：`whichWayVersion.ext.startsWith("1.6")`，非 1.6 直接返回 `false`。
- 一次性门控：标记位 `skinCacheClearedV16` → 落库 `extension_WhichWay_skinCacheClearedV16`，与 `arkidMigrated`/`characterPackDefaulted` 同一套写法（`whichWayUtil.config` 读、`saveConfig(key, true)` 写）。
- 删除前先 `exsitFile` 判定：本体的 `game.removeFile` 对不存在的路径是 **reject**（`library/fs/legacy.ts:79`）而不是静默成功，不能裸调；实际删除走 `game.promises.removeFile(whichWayFile.compilePath("json:cache/skin.json"))`（`whichWayFile` 自身没有删除方法）。
- 删除失败只 `console.error` 并**不写标记位**，下次启动重试；文件本就不存在视为已清理，照常写标记。
- 返回 `boolean`（本次是否执行了清理），便于开发者模式手动调用后确认。
- 已知冗余（按需求原样实现）：`version.js` 目前 `ext: "1.5.6"`，把版本升到 1.6 本身就会让版本门失配并触发重建，所以「升到 1.6 的首次启动」这次删除是重复的；它的实际价值在 1.6.x 后续小版本仍能强制重建一次。缓存清理与版本升级的先后由 `version.js` 决定，本次未擅自改动版本号。
- 验证：`pnpm eslint src/skin/index.ts` 0 报错；`WW_SKIP_STATIC_COPY=1` 构建通过，产物 `chunks/skin-confOverride-shared.js` 含 `clearSkinCacheOnce`。当前 `apps/core/extension/WhichWay/json/cache/skin.json` 已是迁移后重建的干净缓存（460 个干员、0 条 `image/character|image/skin` 旧路径），无需再手工删。

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

### 实现：托莱多（`char_393_toledo`）「贵胄 / 危言 / 伪裔」

把三个只有 `audio` 的空壳技能按卡面描述实现完（`src/packs/character/char_393_toledo.ts`）。

- **贵胄（`guizhoumrfz`）**：**游戏开始时**（`trigger: { global: "phaseBefore", player: "enterGame" }` + `filter` 判 `event.name != "phase" || game.phaseNumber == 0`，与 core 自带武将包 extra 的**七星 `qixing`** 同款写法；`content.ts` 里 `phaseBefore` 特意先于 `roundStart` 触发，注释即「处理“游戏开始时”的时机」），按**游戏内的全部势力 `lib.group`**（不是场上角色实际出现的势力）各随机授予 2 个主公技（判据只有 `lib.skill[x].zhuSkill === true`；势力↔技能对应关系扫 `lib.character` 全量武将牌），账本记在 `storage.guizhoumrfz`。授予走 `player.addSkill()` 而不是 `addSkillList`/`initSkills`——引擎只在「获得技能」那几处按 `zhuSkill && !isZhu2()` 丢弃主公技，`addSkill` 本身不过滤。
- **「无视身份与势力限制」**：发动/结算阶段引擎不再复查身份，限制全在共享的 `info.filter` 里，故用 `game.broadcastAll` 就地包一层：判定托莱多本人时临时 `isZhu = true`、临时把 `group` 换成该主公技的原势力，`try/finally` 还原。需要的值一律当参数传进广播体（广播体不能引用模块作用域自由变量），`guizhouWrapped` 保证同一技能只包一次。
- **失去主公技的补偿**：引擎没有「失去技能」时机，改由常驻子技能 `guizhoumrfz_check`（`global:roundStart` + `silent`/`direct`/`charlotte`）巡检账本，发现某项已不在身上就补发补偿（令一名角色选摸两张/回一点，非本人则托莱多再执行一次），档数同步重算；`onremove` 里批量清场时不计补偿。
- ⚠ **坑：`lib.character` 不是数组**。它是个 Proxy，`set` 时一律 `get.convertedCharacter()` 转成 `Character` 实例（`library/index.js:12309`）；数字下标（`data[1]`/`data[3]`）只是实例上保留的兼容 getter（`element/character.js:327/354`），所以 `Array.isArray(data)` 恒为假。`getZhuSkillPools` 最初按数组校验并取 `[1]/[3]`，结果池子整个为空、贵胄一个主公技都发不出。已改为直接读字段 `data.group` / `data.skills`（写新代码请照此用对象形式，别用数组下标）。
- ⚠ **坑：group 展开让 `hasSkill` 恒真**。触发技的收集只认 `lib.hook`（`addSkill` 时由 `addSkillTrigger` 写入），`game.expandSkills` 不参与触发收集；而父技能 `group` 里列了子技能，`hasSkill(子)` 会因为 group 展开直接返回真。所以判重必须用 `player.skills.includes(x)`（`addSkill` 自己也是这个口径），否则触发型子技能永远不会真正装上。
- **危言（`weiyanmrfz`）**：`player:phaseUseBegin` 锁定触发，`chooseControlList` 选「失去一个主公技 / 失去1点体力上限」（只有 1 项时不弹框；结果取 `result.index`，不是 `control`），然后对一名其他角色造成 1 点伤害。主公技列表用 `getSkills()`（不经 group 展开）现算，并**排除 `weiyimrfz` 自身**——伪裔既是档数来源又是分档开关，若允许把它消耗掉，档数会连同开关一起归零、整套分档效果永久失效。
- **伪裔（`weiyimrfz`）**：`zhuSkill: true`，非主公时开局会被引擎丢弃，故由贵胄补发一次。档数 = 持有主公技数（不含自身），每轮开始与每次增减后 `updateWeiyiCount` 重算。一档 `subSkill.handcard.mod.maxHandcard +1`；二档 `subSkill.draw` 在 `phaseDrawBegin2` 且 `!numFixed` 时 `trigger.num++`（对齐本体 `zf_phaseDraw`）。
- **三/四档 = 借「江山如故」的现成技能**：卡面写「八荒 / 火中」，而 `get.poptip("jsrgbahu")`、`get.poptip("jsrghuozhong")` 指向的是 core 自带武将包 jsrg 的 **跋扈**（准备阶段摸一张 + 杀次数上限+1）与 **惑众**（黑色非锦囊当兵粮寸断，令惑众持有者摸两张）——即同音误写，按 id 取用才是原意。因此三/四档不自己写 mod，直接按档数 `addSkill`/`removeSkill` 这两个技能；发放记录存 `storage.weiyimrfz_granted`，只回收自己发出去的，避免把【神宠】之类别人给的跋扈一并撤走。jsrg 未导入时 `lib.skill` 查不到，静默不生效。`get.poptip(skillId)` 是「技能 id 型词条」（`lib.poptip` 的 skill 类 idList 就是 `Object.keys(lib.skill)`），依赖该包已导入。
- ~~「游戏开始时」没有可靠时机，用第一轮 `roundStart` 等价~~ —— **已纠正**：`gameStart` 由各模式（`single/identity/versus/...`）在开局 `event.trigger("gameStart")` 发出，而 core 武将牌上写「游戏开始时」的技能（`qixing`、`identity_mingcha` 等）统一用 `global:phaseBefore` + `player:enterGame` + `game.phaseNumber == 0`，贵胄改成与它们一致；`weiyimrfz` 的「每轮开始时」仍留在 `roundStart`（卡面就是每轮），且 `phaseBefore` 先于 `roundStart`，开局授技会先算好档数再触发伪裔。
- 校验：`pnpm eslint` 两文件通过、`vite build` 通过，产物 `chunks/packs.js` 已 grep 核对（`skills.includes` 判重、`jsrgbahu`/`jsrghuozhong` 引用、`global: "phaseBefore", player: "enterGame"`、`lib.group.filter` 取势力全集均在）。**未游戏内实测**（browser MCP 起不了 dev app）。

### 实现：`scripts/update-portraits.mjs` 新增 GitHub 备份源（`github_skin` / `github_portrait`）

`--sources` 新增两个逻辑来源，指向 `github.com/yuanyan3060/ArknightsGameResource`：`github_skin` = 仓库 `skin/`（实测 1406 个全身立绘，命名同为 `{portraitId}b.png`），`github_portrait` = `portrait/`（实测 1415 个半身像，约 100~125KB）。默认来源仍是 `char_arts`，新来源只在显式 `--sources` 时启用，可与 PRTS 目录按顺序混排（前者取不到再回落后者）。

- **清单**：GitHub 用一次递归 `git/trees/main?recursive=1`（实测 28,354 条 / 7.3MB），按 `skin/`、`portrait/` 裁剪后分别写 `scripts/cache/github_*_index.json`（与 PRTS 缓存同格式、同 7 天有效期）；同一次运行同时选两个目录也只请求一次 tree。匿名 API 限流可用 `GITHUB_TOKEN`/`GH_TOKEN` 提升，token 只随 `api.github.com` 的清单请求发送，绝不发给 raw 域。
- **取图**：`assetUrl()` 改为按来源分派；GitHub 走 `--github-raw` 前缀（默认 `https://raw.githubusercontent.com`），路径逐段 `encodeURIComponent`，覆盖文件名里的 `#`/`+`（仓库里有 534 个这种变体）；`--github-ref` 默认 `main`。未编码的 `#` 会被当成 URL 锚点，取到错误文件。
- **复用**：PNG 签名校验、`--delay`/`--jobs`/`--limit`/`--offline`/`--refresh-index`、断点续传缓存、ImageMagick 压缩与「只新增不覆盖」全部沿用；原始图按逻辑来源分目录缓存，不会与 PRTS 同名图互顶。
- 校验：`node --check` 通过；`--sources github_skin,github_portrait --ids char_003_kalts,char_123_fang,char_002_amiya --dry-run` 实测 tree 拉取、两目录清单落缓存、精二/初始替代匹配（凯尔希 `char_003_kalts_2b.png`、阿米娅 `char_002_amiya_2b.png`、芬 `char_123_fang_1b.png`）均正确；`--offline` 可只读缓存复现同一计划。**未实测真实下载**：本机 `raw.githubusercontent.com` 不可达（普通图与 `#` 变体的 fetch 均失败），需在有直连或镜像的环境补跑；不可直连时用 `--github-raw` 指向路径结构相同的镜像前缀。ESLint 对该脚本报的 `process/console/fetch is not defined` 为改动前既有（`scripts/` 未声明 Node globals，`compress-skin.mjs` 同样报），本次未引入新的规则问题。
