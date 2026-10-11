import { lib as d } from "noname";
import { whichWayHooksApi as h } from "./hooks.js";
import { w } from "./version-shared.js";
async function f(n) {
  const e = /* @__PURE__ */ new Map();
  for (const a of n) {
    if (e.has(a.name)) throw new Error(`[stageLoader] 阶段名重复: ${a.name}`);
    e.set(a.name, a);
  }
  const t = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), i = (a) => {
    const s = t.get(a.name);
    if (s) return s;
    const l = (async () => {
      a.deps?.length && await Promise.all(
        a.deps.map((r) => {
          const c = e.get(r);
          if (!c) throw new Error(`[stageLoader] 阶段 "${a.name}" 依赖了不存在的阶段 "${r}"`);
          return i(c);
        })
      );
      const p = performance.now();
      try {
        await a.load();
      } catch (r) {
        if (console.error(`[WhichWay] 阶段 "${a.name}" 加载失败`, r), !a.optional) throw r;
      } finally {
        o.set(a.name, performance.now() - p);
      }
    })();
    return t.set(a.name, l), l;
  };
  return await Promise.all(n.map(i)), n.map((a) => [a.name, o.get(a.name) ?? 0]);
}
const m = [], u = (n) => {
  const e = m.map(([o, i]) => `  ${o.padEnd(26)} ${i.toFixed(0).padStart(5)} ms`), t = [...m].sort((o, i) => i[1] - o[1]).slice(0, 3).map(([o]) => o);
  console.groupCollapsed(`%c[WhichWay] 加载完成 · 总计 ${n.toFixed(0)}ms`, "color:#4a9eff;font-weight:bold;"), console.log("%c阶段耗时（无依赖的阶段并发执行，各行之和 ≥ 总计）", "color:#888;font-weight:bold;"), console.log(e.join(`
`)), t.length && console.log(`%c最耗时: ${t.join(" / ")}`, "color:#e67e22;"), console.groupEnd();
}, b = async () => {
  d.translate.extension_WhichWay = "驶舰之向", w.checkVersionCompatible();
  const n = [
    //导入toast组件
    { name: "toast", load: () => import("./toast.js") },
    //导入文件管理组件
    { name: "file", load: () => import("./file.js") },
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
    // 还处于测试阶段,暂时不进行添加
    {
      name: "gloriousIdeal(新模式)",
      optional: !0,
      load: async () => {
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
    { name: "skin", load: () => import("./skin-confOverride-shared.js").then((o) => o.i) },
    //导入poptip
    { name: "poptip", load: () => import("./poptip.js") },
    //导入tips
    { name: "tips", load: () => import("./tips.js") },
    //导入角色卡片
    { name: "characterCard", load: () => import("./characterCard.js") },
    //扩展适配
    { name: "extCompatible", load: () => import("./extCompatible.js") },
    //导入更新日志
    { name: "updateLog", load: () => import("./updateLog-shared.js").then((o) => o.i) },
    //快速设置界面
    { name: "configUI", load: () => import("./configUI.js") },
    //导入模组系统
    { name: "modules", load: () => import("./modules.js") }
  ], e = performance.now();
  m.push(...await f(n));
  const t = performance.now();
  await h.init(), m.push(["hooksApi.init(pendingRun)", performance.now() - t]), u(performance.now() - e);
};
export {
  b as whichWayInit
};
