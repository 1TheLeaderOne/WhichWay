import { lib } from "noname";
import { whichWayHooksApi } from "./hooks/index.js";
import { whichWayVersion } from "./version.js";
const _wwTimings = [];
const _wwTotal = performance.now();
const _wwMark = async (label, mod) => {
  const s = performance.now();
  const m = await mod();
  _wwTimings.push([label, performance.now() - s]);
  return m;
};
const _wwFlushTimings = () => {
  const total = performance.now() - _wwTotal;
  const lines = _wwTimings.map(([label, ms]) => `  ${label.padEnd(28)} ${ms.toFixed(0).padStart(5)} ms`);
  const top = [..._wwTimings].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([l]) => l);
  console.groupCollapsed(`%c[WhichWay] 加载完成 · 总计 ${total.toFixed(0)}ms`, "color:#4a9eff;font-weight:bold;");
  console.log(`%c耗时明细（总 ${total.toFixed(0)}ms）`, "color:#888;font-weight:bold;");
  console.log(lines.join("\n"));
  if (top.length) console.log(`%c最耗时: ${top.join(" / ")}`, "color:#e67e22;");
  console.groupEnd();
};
const whichWayInit = async () => {
  lib.translate.extension_WhichWay = "驶舰之向";
  whichWayVersion.checkVersionCompatible();
  await _wwMark("toast", () => import("./toast/index.js"));
  await _wwMark("file", () => import("./file.js"));
  await _wwMark("css", async () => {
    await window.whichWay.file.autoLoadCSS();
  });
  await _wwMark("override", () => import("./override/index.js"));
  await _wwMark("nonameEx", () => import("./nonameEx/index.js"));
  await _wwMark("config", () => import("./config/index.js"));
  await _wwMark("videoPlayer", () => import("./videoPlayer/index.js"));
  await _wwMark("base(配置)", () => import("./packs/base/index.js"));
  await _wwMark("packs(新)", () => import("./packs/index.js"));
  await _wwMark("arknight", () => import("./arknight/index.js"));
  await _wwMark("audio", () => import("./audio/index.js"));
  await _wwMark("skin", () => import("./skin/index.js"));
  await _wwMark("poptip", () => import("./poptip/index.js"));
  await _wwMark("tips", () => import("./tips/index.js"));
  await _wwMark("characterCard", () => import("./characterCard/index.js"));
  await _wwMark("extCompatible", () => import("./extCompatible/index.js"));
  await _wwMark("updateLog", () => import("./updateLog/index.js"));
  await _wwMark("configUI", () => import("./configUI/index.js"));
  await _wwMark("modules", () => import("./modules/index.js"));
  await _wwMark("hooksApi.init(pendingRun)", async () => {
    await whichWayHooksApi.init();
  });
  _wwFlushTimings();
};
export {
  whichWayInit
};
