import { _status as s } from "noname";
import { whichWayUtil as u } from "./utill.js";
import { l as m } from "./GloriousIdeal-battleOverlay-shared.js";
let a = !1;
function l() {
  try {
    if (u.isDeveloperMode()) return;
    if (!a) {
      const t = document.createElement("style");
      t.textContent = "#system{display:none !important;}", (document.head || document.documentElement).appendChild(t), a = !0;
    }
    const e = document.getElementById("system");
    e && (e.style.display = "none");
  } catch {
  }
}
function g() {
  const e = location.origin && location.origin !== "null" ? location.origin : "*", t = window.parent;
  l(), s.paused = !0;
  let r = !1;
  const i = (n) => {
    if (e !== "*" && n.origin !== e) return;
    const o = n.data;
    !o || o.type !== "gi-battle-init" || !o.init || r || (r = !0, window.removeEventListener("message", i), s.paused = !1, l(), m(o.init).then((c) => {
      try {
        t.postMessage({ type: "gi-battle-result", result: c }, e);
      } catch (d) {
        console.error("[GloriousIdeal] 子实例回传战斗结果失败", d);
      }
    }));
  };
  window.addEventListener("message", i);
  try {
    t.postMessage({ type: "gi-battle-ready" }, e);
  } catch (n) {
    console.error("[GloriousIdeal] 子实例上报就绪失败", n);
  }
}
export {
  g as runBattleChild
};
