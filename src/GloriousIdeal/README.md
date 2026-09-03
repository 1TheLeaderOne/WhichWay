# GloriousIdeal ——「特蕾西娅与瑰丽理想」模式（框架版）

> 源设计案：`特蕾西娅与瑰丽理想.docx`。本目录把策划案落成**可运行的框架**：
> 模式可注册进主菜单、营地区/招募/派遣/副本探索/每日结算流程可跑通；
> 数值表与标准对垒战斗是占位，按 TODO 逐项补全即可。

## 目录结构

```
GloriousIdeal/
├── index.ts           模式注册入口（lib.mode + setMode_ + 模式本体；splash 指向
│                      image/mode/backgroud/gloriousideal.png，构建随 image/ 复制）
├── start.ts           模式启动入口：挂载 Vue 应用（start 支持 async）
├── dungeon.ts         副本探索图生成与行动/遭遇占位（startBattle TODO）
├── data/              策划案数值表（资源/团结度、建筑、干员、物品、副本×难度）
├── state/campaign.ts  战役状态（CampaignData）与推进逻辑（CampaignController）+ 存档
└── ui/
    ├── store.ts       Vue 响应式状态（view）与全部页面流转 action
    ├── App.vue        根组件：phase 路由 + 全局设计系统样式（gi-* 令牌与基础类）
    └── components/    按「系统」拆分，各自独立目录、独立演进：
        ├── common/      StatusBar 顶栏状态条 / format.ts 展示辅助（中文名/状态徽章/星等）
        ├── title/       TitleScreen 标题页 · EndScreen 结算页（着陆/收尾屏）
        ├── camp/        营地系统（经营养成）：CampView 主页（建筑网格+侧栏行动中心）、
        │                BuildingCard 建筑卡、RosterTable 名册、RecruitView 招募
        └── battle/      战斗系统（出征链路）：DispatchView 战前准备（选人×选副本难度）、
                         DungeonView 副本探索（节点地图）；真实对垒战斗接入时在本目录新增
                         Battle 层（HUD/对局接管），UI 与 camp 系互不耦合
```

> UI 一律用 Vue 3 编写（与 WhichWay 其它界面一致：createApp + .vue）。
> 页面只读 `view`/`CONFIG`、只调 store action；改动数值去 data/，改动流程去 store.ts。
> 样式：基础类（gi-btn / gi-card / gi-badge / gi-progress / 主题色变量）统一定义在
> App.vue 的全局 `<style>`，新页面直接用；页面级专属布局与动画放各自组件 `<style scoped>`。

## 无名杀模式接入机制（研究结论，写代码时务必保持）

- **菜单注册**：`lib.mode[name] = { name, config, fromextension:true }` +
  `lib.config.all.mode.push(name)` + `lib.init["setMode_" + name]`（选定后
  `game.import("mode", ...)` 导入本体）。等价于引擎的 `game.addMode(name, info, info2)`。
- **启动链路**：选择模式 → `lib.config.mode` 变更 → 重载 → `init/index.ts`
  `loadMode(currentMode)`（可携带 library/game/ui/get/ai 扩展与 `init()`）→
  `lib.init.start = currentMode.start` → `ui.create.arena()` →
  `game.createEvent("game", false).setContent(lib.init.start)` 执行 **async** 根事件。
- **模式存储**：`lib.storage` 是按模式隔离的（`game.save(key, value)` / `game.save(key)` 删除）。
- **干员池**：`window.whichWaySave.allCharacters`（引擎真正可用需在模式局中正常加载扩展角色）。

## TODO 路线（对照策划案）

- [ ] **标准对垒战斗**：`dungeon.ts → startBattle()`。用 party 干员建玩家阵营、按难度生成
      敌人阵营；体力跨战斗保留、手牌每场重置；击杀数回流压力结算。
- [ ] **战斗结算**：任务 绘图/清扫/击败boss 真判定；副本经验、掉落、小队全灭不归还物资。
- [ ] **压力全链路**：折磨负面（出牌阶段末弃牌/濒死流失体力/压力+20%）；美德五项实现。
- [ ] **建筑升级数值**：data/buildings.ts 的 cost 全为 0，需填入设计者给定数值。
- [ ] **商店/养成**：砍诺特商品与折扣、干员培养升星后的战斗内加成（开局摸牌/护甲等）。
- [ ] **招募候选**：1 级 4 名候选已实现；刷新次数、更高等级更多候选待补。
- [ ] **UI 打磨**：Vue 组件化已完成（camp/battle 系统拆分）；干员头像立绘、结算面板、
      技能/装备展示、战斗 HUD 待做。

## 构建/调试

```bash
# 从仓库根构建扩展（产物在 apps/core/extension/WhichWay）
pnpm -F ./packages/extension/WhichWay build
# 然后 pnpm dev 起本体，主菜单 → 新模式 → 特蕾西娅与瑰丽理想
```
控制台会打印 `[GloriousIdeal]` 前缀日志；`window.GloriousIdealDebug` 可看运行中 controller。
