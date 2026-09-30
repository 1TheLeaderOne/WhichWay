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
