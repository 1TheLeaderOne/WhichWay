import { lib as e, game as a } from "noname";
const s = "gloriousideal", t = "特蕾西娅与瑰丽理想";
function l() {
  const o = s;
  if (e.mode[o]) return !1;
  e.config.all.mode.includes(o) || e.config.all.mode.push(o), e.translate[o] = t, e.mode[o] = {
    name: t,
    config: r(),
    // 选模式页背景（OnloadSplash 会用 parseResourceAddress 解析；图片见
    // image/mode/backgroud/gloriousideal.png，构建时随 image/ 整体复制）
    splash: "ext:WhichWay/image/mode/backgroud/gloriousideal.png",
    fromextension: !0
  }, e.init["setMode_" + o] = async () => {
    await a.import("mode", () => c(o));
  };
  try {
    const n = "WhichWay";
    e.config.extensionInfo[n] ??= {}, e.config.extensionInfo[n].mode ??= [], e.config.extensionInfo[n].mode.includes(o) || e.config.extensionInfo[n].mode.push(o);
  } catch (n) {
    console.warn("[GloriousIdeal] 写入扩展信息失败（不影响使用）", n);
  }
  return console.info(`[GloriousIdeal] 模式已注册：${t}（${o}）`), !0;
}
function r() {
  return {
    // example: {
    //   name: "示例配置",
    //   init: 1,
    // },
  };
}
function c(o) {
  return {
    name: o,
    // 模式特有技能/卡牌若需要可在此注册（TODO）
    async start() {
      const { start: n } = await import("./GloriousIdeal-battleOverlay-shared.js").then((i) => i.s);
      await n();
    }
  };
}
export {
  s as GLORIOUS_IDEAL_MODE,
  t as GLORIOUS_IDEAL_NAME,
  l as registerGloriousIdealMode
};
