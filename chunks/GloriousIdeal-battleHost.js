import { lib as O } from "noname";
import { whichWayFile as T } from "./file.js";
const L = 3e4, R = 5e3, _ = 500, D = 250, C = 320, z = [
  "battlefront.jpg",
  "PrimevalChaos.jpg",
  "breakingCage.jpg",
  "MonumentalMelodyTracey.jpg",
  "PeaceAndProsperity.jpg",
  "FantasyGarden.jpg",
  "ecologicalPark.jpg",
  "dew.jpg",
  "hope.jpg",
  "ideal.jpg",
  "illumination.jpg",
  "landLife.jpg",
  "liberty.jpg",
  "peer.jpg",
  "priestess.jpg"
], G = () => {
  const t = z[Math.floor(Math.random() * z.length)];
  try {
    return T.compilePath(`img:background/${t}`);
  } catch {
    return "";
  }
}, U = () => {
  const t = new URL(location.href);
  return t.searchParams.set("giBattle", "1"), t.href;
}, A = (t) => {
  const l = Math.random() > 0.4, r = {};
  for (const n of t.party) r[n] = Math.max(0, Math.floor((t.allyHp[n] ?? 4) - (l ? 1 : 2)));
  return { win: l, nodeIndex: t.nodeIndex, finalHp: r, killedEnemies: [], kills: {}, deaths: {} };
};
function q(t) {
  return new Promise((l) => {
    const r = location.origin && location.origin !== "null" ? location.origin : "*", n = document.createElement("iframe");
    n.id = "gi-battle-frame", n.setAttribute("allow", "autoplay"), Object.assign(n.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      border: "0",
      zIndex: "99999",
      background: "#000"
    });
    const a = document.createElement("div");
    Object.assign(a.style, {
      position: "fixed",
      inset: "0",
      zIndex: "100000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-end",
      backgroundColor: "#05070d",
      overflow: "hidden",
      opacity: "1",
      transition: `opacity ${C}ms ease`,
      pointerEvents: "all"
    });
    const y = G(), x = document.createElement("div");
    Object.assign(x.style, {
      position: "absolute",
      inset: "0",
      zIndex: "0",
      backgroundColor: "#0a0d15",
      backgroundImage: y ? `url("${y}")` : "",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    });
    const w = document.createElement("div");
    Object.assign(w.style, {
      position: "absolute",
      inset: "0",
      zIndex: "1",
      background: "linear-gradient(180deg, rgba(6,8,14,0.35) 0%, rgba(6,8,14,0.62) 100%)"
    });
    const d = document.createElement("div");
    d.textContent = "战斗载入中…", Object.assign(d.style, {
      position: "relative",
      zIndex: "2",
      color: "rgba(236,222,184,0.9)",
      fontSize: "16px",
      letterSpacing: "2px",
      marginBottom: "14px",
      textShadow: "0 1px 6px rgba(0,0,0,0.6)",
      fontFamily: "sans-serif"
    });
    const m = document.createElement("div");
    Object.assign(m.style, {
      position: "relative",
      zIndex: "2",
      width: "min(420px, 70vw)",
      height: "8px",
      marginBottom: "48px",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.14)",
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)"
    });
    const g = document.createElement("div");
    Object.assign(g.style, {
      width: "0%",
      height: "100%",
      borderRadius: "999px",
      background: "linear-gradient(90deg, #d8a84c, #ecc068)",
      transition: "width 80ms linear"
    }), m.appendChild(g), a.appendChild(x), a.appendChild(w), a.appendChild(d), a.appendChild(m);
    let p = !1, v = !1, f = !1, c = 0, s;
    const j = () => {
      if (f) {
        f = !1;
        try {
          a.remove();
        } catch {
        }
      }
    }, P = () => {
      c && cancelAnimationFrame(c), window.removeEventListener("message", k), s !== void 0 && clearTimeout(s), localStorage.removeItem(O.configprefix + "directstart"), j();
      try {
        n.remove();
      } catch {
      }
    }, u = (e) => {
      p || (p = !0, P(), l(e));
    }, B = () => {
      try {
        n.contentWindow?.postMessage({ type: "gi-battle-init", init: t }, r);
      } catch (e) {
        console.error("[GloriousIdeal] 下发 BattleInit 失败", e);
      }
    }, k = (e) => {
      if (r !== "*" && e.origin !== r) return;
      const o = e.data;
      !o || typeof o != "object" || (o.type === "gi-battle-ready" ? (s !== void 0 && (clearTimeout(s), s = void 0), v = !0) : o.type === "gi-battle-result" && o.result && u(o.result));
    }, F = performance.now();
    let i = "climb", h = 0, M = 0, I = 0, S = 0;
    const b = (e) => {
      g.style.width = e + "%";
    }, E = () => {
      if (p) return;
      const e = performance.now();
      if (i === "climb") {
        const o = Math.min(90, (e - F) / R * 90);
        b(o), v && (i = "zoom", h = o, M = e);
      } else if (i === "zoom") {
        const o = Math.min(1, (e - M) / _);
        b(h + (100 - h) * o), o >= 1 && (i = "hold", I = e);
      } else if (i === "hold")
        b(100), e - I >= D && (i = "fade", S = e, a.style.opacity = "0", B());
      else if (i === "fade" && e - S >= C) {
        j();
        return;
      }
      c = requestAnimationFrame(E);
    };
    s = setTimeout(() => {
      console.error("[GloriousIdeal] 战斗子实例超时未就绪，使用占位结算兜底"), u(A(t));
    }, L), window.addEventListener("message", k);
    try {
      localStorage.setItem(O.configprefix + "directstart", "true"), document.body.appendChild(n), document.body.appendChild(a), f = !0, n.src = U(), c = requestAnimationFrame(E);
    } catch (e) {
      console.error("[GloriousIdeal] 创建战斗 iframe 失败，使用占位结算兜底", e), u(A(t));
    }
  });
}
export {
  q as startBattle
};
