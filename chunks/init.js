import { lib as r } from "noname";
import { whichWayHooksApi as l } from "./hooks.js";
import { w as m, m as s, r as c } from "./arknight-arkidMigration-shared.js";
const e = [], p = (i) => {
  const n = e.map(([o, t]) => `  ${o.padEnd(26)} ${t.toFixed(0).padStart(5)} ms`), a = [...e].sort((o, t) => t[1] - o[1]).slice(0, 3).map(([o]) => o);
  console.groupCollapsed(`%c[WhichWay] 加载完成 · 总计 ${i.toFixed(0)}ms`, "color:#4a9eff;font-weight:bold;"), console.log("%c阶段耗时（无依赖的阶段并发执行，各行之和 ≥ 总计）", "color:#888;font-weight:bold;"), console.log(n.join(`
`)), a.length && console.log(`%c最耗时: ${a.join(" / ")}`, "color:#e67e22;"), console.groupEnd();
}, u = async () => {
  r.translate.extension_WhichWay = "驶舰之向", m.checkVersionCompatible(), s();
  const i = [
    //导入toast组件
    { name: "toast", load: () => import("./toast.js") },
    //导入文件管理组件
    //load 里额外建立两份目录索引：所有取图点（武将注册、皮肤「经典形象」、动皮静图）都在同步路径上，
    //必须在 onBeforeInit 之前把 illustration/character 与 illustration/skin 的清单扫好备查。
    {
      name: "file",
      load: async () => {
        const { whichWayFile: o } = await import("./file.js");
        await Promise.all([o.initCharacterPortraitIndex(), o.initSkinFileIndex()]);
      }
    },
    //@ts-ignore 加载css（要等 file 阶段把实例注册到 window.whichWay.file 上）
    {
      name: "css",
      deps: ["file"],
      load: async () => {
        await window.whichWay.file.autoLoadCSS();
      }
    },
    //导入覆盖API
    { name: "override", load: () => import("./override.js") },
    /**
     * 导入noname扩展
     * TODO 这坨东西真要该全删了xd
     */
    { name: "nonameEx", load: () => import("./nonameEx.js") },
    //导入配置
    { name: "config", load: () => import("./config-data-shared.js").then((o) => o.i) },
    //————————————启动页美化（WhichWay 视差轮播）————————————//
    // 注册自定义启动页样式：玩家可在「选项 → 外观 → 启动页样式」中选择。
    // 在引擎构建 splash 选项前注册即可（WhichWay 扩展加载早于引擎 splash 初始化）。
    // optional：启动页美化失败不应影响扩展本体。
    {
      name: "launchPad(启动页美化)",
      optional: !0,
      load: async () => {
        const { registerLaunchPadSplash: o } = await import("./launchPad.js");
        o();
      }
    },
    //————————————模式：特蕾西娅与瑰丽理想————————————//
    {
      name: "gloriousIdeal",
      optional: !0,
      load: async () => {
        if (d() !== !0) return;
        const { registerGloriousIdealMode: o } = await import("./GloriousIdeal.js");
        o();
      }
    },
    //导入视频播放组件
    { name: "videoPlayer", load: () => import("./videoPlayer.js") },
    //————————————武将包————————————//
    /**
     * 基础配置（势力/设计者/翻译）
     */
    { name: "base(配置)", load: () => import("./packs-base-characterDesigner-shared.js").then((o) => o.i) },
    /**
     * 新的添加将包的方法（干员/卡牌模块清单在构建期由 import.meta.glob 确定，
     * 整个武将包只占一个 chunk）
     */
    { name: "packs(新)", load: () => import("./packs.js") },
    //导入明日方舟数据
    { name: "arknight", load: () => import("./arknight.js") },
    //导入音频组件
    { name: "audio", load: () => import("./audio.js") },
    //导入皮肤
    { name: "skin", load: () => import("./skin-PortraitLayers-shared.js").then((o) => o.c) },
    //导入poptip
    { name: "poptip", load: () => import("./poptip.js") },
    //导入tips
    { name: "tips", load: () => import("./tips.js") },
    //导入角色卡片
    { name: "characterCard", load: () => import("./characterCard-CharacterCard-shared.js").then((o) => o.i) },
    //扩展适配
    { name: "extCompatible", load: () => import("./extCompatible.js") },
    //导入更新日志
    { name: "updateLog", load: () => import("./updateLog-shared.js").then((o) => o.i) },
    //快速设置界面
    { name: "configUI", load: () => import("./configUI.js") },
    //导入模组系统
    { name: "modules", load: () => import("./modules.js") }
  ], n = performance.now();
  e.push(...await c(i));
  const a = performance.now();
  await l.init(), e.push(["hooksApi.init(pendingRun)", performance.now() - a]), p(performance.now() - n);
}, d = () => document.querySelectorAll('script[type="module"][src*="/@vite/"]').length > 0;
export {
  d as isViteDevServer,
  u as whichWayInit
};
