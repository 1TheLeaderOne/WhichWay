import { get as E, ui as $ } from "noname";
import { onConfig as I, onSetDev as L } from "./hooks.js";
import { whichWayToast as W } from "./toast.js";
import { whichWayFile as w } from "./file.js";
import { computed as m, openBlock as p, createElementBlock as h, createElementVNode as e, Fragment as y, renderList as v, unref as k, toDisplayString as g, createStaticVNode as x, createTextVNode as P, createApp as q } from "vue";
import { _ as A } from "./_plugin-vue_export-helper.js";
const u = {
  /**
  * @type {Object} 背景图片
   */
  background: {
    url: {
      content: w.compilePath("bg:"),
      enumerable: !1
    },
    default: {
      content: "默认",
      enumerable: !1
    },
    // 背景图片
    landLife: "生命之地",
    illumination: "照明",
    dew: "朝露",
    ecologicalPark: "生态园",
    FantasyGarden: "空想花庭",
    PrimevalChaos: "洪荒",
    hope: "希望",
    ideal: "理想",
    priestess: "普瑞赛斯",
    breakingCage: "破笼",
    battlefront: "战线",
    companion: "挚友",
    PeaceAndProsperity: "话升平",
    liberty: "无拘",
    peer: "同行",
    MonumentalMelodyTracey: "特蕾西娅-熠曲丰碑"
  },
  thanks: {
    designer: ["涵涵", "今天整点什么/光阴", "落尘星河", "TheLeaderOne", "圣晴天空", "培嵩", "Flandre"],
    special: ["容若（动皮指导）", "果敢心（提供意见）", "灭蚁强小风儿（测试）", "零羽白瑠（测试、额外皮肤包作者）", "Flandre（动皮参数和皮肤提供、测试）", "豆姜（测试）"]
  }
}, B = { class: "whichWay-intro" }, O = { class: "hero" }, z = ["src"], M = { class: "hero-foot" }, D = ["src"], F = { class: "card-intro" }, G = { class: "people-flex" }, N = ["src", "alt"], U = { class: "person-name" }, V = { class: "person-role" }, Q = { class: "llm-row" }, H = { class: "llm-chip" }, R = ["src", "alt"], Z = { class: "llm-name" }, J = { class: "repo-row" }, X = { class: "llm-chip" }, Y = ["src"], K = { class: "card-intro" }, tt = { class: "tag-grid" }, et = { class: "tag-grid" }, ot = { class: "card-intro" }, it = { class: "qr-grid" }, nt = { class: "qr-card" }, st = { class: "qr-box" }, at = ["src"], rt = { class: "qr-card" }, lt = { class: "qr-box" }, ct = ["src"], T = "https://prts.wiki/", S = "https://github.com/1TheLeaderOne/WhichWay", dt = {
  __name: "extIntro",
  setup(d) {
    const r = m(() => u.thanks.designer), l = m(() => u.thanks.special), a = m(() => w.compilePath("dec:")), n = m(() => w.compilePath("logo:")), s = [
      { name: "TheLeaderOne", role: "扩展制作 · 技能设计", avatar: "1.jpg" },
      { name: "圣晴天空", role: "技能设计", avatar: "0.jpg" }
    ].map((o) => ({ ...o, avatar: `${a.value}/${o.avatar}` })), c = [
      { name: "DeepSeek-v4.1-Flash", logo: "DeepSeek.png" },
      { name: "Qwen3.8-Flash", logo: "Qwen.png" }
    ].map((o) => ({ ...o, logo: `${n.value}/${o.logo}` })), f = (o) => `${a.value}/${o}`, j = (o) => {
      window.open(o);
    }, C = (o) => {
      if (typeof o != "string") {
        alert("❌ 复制失败：内容必须是文本");
        return;
      }
      if (o = o.trim(), !o) {
        alert("❌ 复制失败：内容为空");
        return;
      }
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText == "function") {
          navigator.clipboard.writeText(o).then(
            () => alert("✅ 已复制"),
            (t) => {
              console.error("Clipboard API 失败:", t), b(o);
            }
          );
          return;
        }
        b(o);
      } catch (t) {
        console.error("复制过程出错:", t), b(o);
      }
    };
    function b(o) {
      const t = document.createElement("textarea");
      t.value = o, t.style.cssText = "position:absolute;left:-9999px;top:-9999px;", document.body.appendChild(t), t.select(), t.setSelectionRange(0, o.length);
      const i = document.execCommand("copy");
      document.body.removeChild(t), alert(i ? "✅ 已复制" : "❌ 复制失败，请手动选择并复制");
    }
    return (o, t) => (p(), h("div", B, [
      e("header", O, [
        e("img", {
          class: "hero-bg",
          src: f("SJZX.jpg"),
          alt: "驶舰之向封面"
        }, null, 8, z),
        t[4] || (t[4] = e("div", { class: "hero-shade" }, null, -1)),
        e("div", M, [
          e("img", {
            class: "hero-badge",
            src: f("SJZXStar6.png"),
            alt: "驶舰之向"
          }, null, 8, D),
          t[3] || (t[3] = e("span", { class: "hero-tagline" }, "明日方舟 × 无名杀 · 同人武将扩展", -1))
        ])
      ]),
      e("section", F, [
        t[6] || (t[6] = e("h2", { class: "section-title" }, "作者", -1)),
        e("div", G, [
          (p(!0), h(y, null, v(k(s), (i) => (p(), h("div", {
            key: i.name,
            class: "person"
          }, [
            e("img", {
              class: "avatar",
              src: i.avatar,
              alt: i.name
            }, null, 8, N),
            e("div", U, g(i.name), 1),
            e("div", V, g(i.role), 1)
          ]))), 128))
        ]),
        t[7] || (t[7] = e("h2", { class: "section-title" }, "协力 LLM", -1)),
        e("div", Q, [
          (p(!0), h(y, null, v(k(c), (i) => (p(), h("div", {
            key: i.name,
            class: "llm"
          }, [
            e("span", H, [
              e("img", {
                src: i.logo,
                alt: i.name
              }, null, 8, R)
            ]),
            e("span", Z, g(i.name), 1)
          ]))), 128))
        ]),
        t[8] || (t[8] = e("h2", { class: "section-title" }, "扩展仓库", -1)),
        e("div", J, [
          e("div", {
            class: "repo-link",
            onClick: t[0] || (t[0] = (i) => j(S))
          }, [
            e("span", X, [
              e("img", {
                src: f("github.png"),
                alt: "GitHub"
              }, null, 8, Y)
            ]),
            e("span", { class: "repo-text" }, [
              t[5] || (t[5] = e("span", { class: "repo-name" }, "访问扩展仓库", -1)),
              e("span", { class: "repo-url" }, g(S))
            ])
          ])
        ])
      ]),
      t[20] || (t[20] = x('<section class="card-intro" data-v-07211413><h2 class="section-title" data-v-07211413>扩展介绍</h2><p class="para" data-v-07211413>本扩展主要由<span class="highlight" data-v-07211413>林登万</span>制作，武将技能设计主要由<span class="highlight" data-v-07211413>林登万</span>和<span class="highlight" data-v-07211413>圣晴天空</span>提供。</p></section>', 1)),
      e("section", K, [
        t[9] || (t[9] = e("h2", { class: "section-title" }, "感谢名单", -1)),
        t[10] || (t[10] = e("h3", { class: "sub-title" }, "干员设计者", -1)),
        e("div", tt, [
          (p(!0), h(y, null, v(r.value, (i) => (p(), h("span", {
            key: `designer-${i}`,
            class: "tag tag-gold"
          }, g(i), 1))), 128))
        ]),
        t[11] || (t[11] = e("h3", { class: "sub-title" }, "特别感谢", -1)),
        e("div", et, [
          (p(!0), h(y, null, v(l.value, (i) => (p(), h("span", {
            key: `special-${i}`,
            class: "tag"
          }, g(i), 1))), 128))
        ])
      ]),
      e("section", { class: "card-intro" }, [
        t[13] || (t[13] = e("h2", { class: "section-title" }, "资料来源", -1)),
        e("p", { class: "para" }, [
          t[12] || (t[12] = P(" 干员介绍和势力均参考 PRTS，大部分干员语言也来自 PRTS： ", -1)),
          e("a", {
            href: T,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "link"
          }, g(T))
        ]),
        t[14] || (t[14] = x('<p class="para" data-v-07211413>少部分干员（主要是剧情角色）配音使用 B 站 UP 主配音或 AI 合成：</p><ul class="voice-list" data-v-07211413><li data-v-07211413> 保存者、克丽斯腾： <a href="https://www.bilibili.com/video/BV1Yh411L72H" target="_blank" rel="noopener noreferrer" class="link" data-v-07211413>BV1Yh411L72H</a></li><li data-v-07211413> AI 配音（GPT-SoVITS）： <ul class="sub-list" data-v-07211413><li data-v-07211413>特雷西斯（音源：赫德雷、赫拉格）</li><li data-v-07211413>特蕾西娅（音源：黍、九色鹿）</li><li data-v-07211413>普瑞赛斯（音源：魔王、黍）</li><li data-v-07211413>特蕾西娅 &amp; 特雷西斯（音源：赫德雷、赫拉格、黍、九色鹿）</li></ul></li><li data-v-07211413>ACE：<span class="highlight" data-v-07211413>明日方舟：黎明前奏</span></li></ul>', 2))
      ]),
      e("section", ot, [
        t[19] || (t[19] = e("h2", { class: "section-title" }, "资源下载与 BUG 反馈", -1)),
        e("div", it, [
          e("div", nt, [
            e("div", st, [
              e("img", {
                src: f("qq1.jpg"),
                alt: "QQ群二维码",
                loading: "lazy",
                decoding: "async"
              }, null, 8, at)
            ]),
            t[15] || (t[15] = e("div", { class: "qr-caption" }, "QQ 群", -1)),
            t[16] || (t[16] = e("div", { class: "qr-value" }, "104537053", -1)),
            e("button", {
              type: "button",
              class: "copy-btn",
              onClick: t[1] || (t[1] = (i) => C("104537053"))
            }, "复制群号")
          ]),
          e("div", rt, [
            e("div", lt, [
              e("img", {
                src: f("baidupan.png"),
                alt: "百度网盘二维码",
                loading: "lazy",
                decoding: "async"
              }, null, 8, ct)
            ]),
            t[17] || (t[17] = e("div", { class: "qr-caption" }, "百度网盘", -1)),
            t[18] || (t[18] = e("div", { class: "qr-value" }, "提取码 mess", -1)),
            e("button", {
              type: "button",
              class: "copy-btn",
              onClick: t[2] || (t[2] = (i) => C("https://pan.baidu.com/s/1Dw4pXRujfIaSfTBC_qDAiw?pwd=mess"))
            }, "复制链接")
          ])
        ])
      ]),
      t[21] || (t[21] = e("footer", { class: "foot" }, "本扩展为《明日方舟》同人作品，素材版权归原作者与鹰角网络所有。", -1))
    ]));
  }
}, pt = /* @__PURE__ */ A(dt, [["__scopeId", "data-v-07211413"]]), ht = {
  //分界线
  introtip: {
    name: '<a style="cursor: pointer;font-weight: bold;"><font color=#ffa10a><—欢迎游玩驶舰之向扩展—></font></a>',
    clear: !0,
    whichWayConfig: {
      priority: 1e3
    }
  },
  //扩展介绍
  intromrfz: {
    name: '<div class="whichWayExtIntro">▶扩展信息（点击后展开）</div>',
    clear: !0,
    onclick: function() {
      if (this.whichWayExtIntro_more === void 0) {
        var d = $.create.div(".whichWayExtIntro");
        q(pt).mount(d), this.parentNode.insertBefore(d, this.nextSibling), this.whichWayExtIntro_more = d, this.innerHTML = '<div class="hth_menu">▼扩展信息（点击后折叠）</div>';
      } else
        this.parentNode.removeChild(this.whichWayExtIntro_more), delete this.whichWayExtIntro_more, this.innerHTML = '<div class="hth_menu">▶扩展信息（点击后展开）</div>';
    },
    whichWayConfig: {
      priority: 999
    }
  },
  settip_utill: {
    name: "<font color=#ed7e78><————功能————></font></a>",
    clear: !0,
    whichWayConfig: {
      priority: 900
    }
  },
  getMoreSkin: {
    name: "<button type=`button`>获取更多皮肤</button>",
    clear: !0,
    onclick() {
      alert(`[驶舰之向]本皮肤包是由群友 @零羽白瑠 提供!
需要您自行移动到扩展目录下的皮肤文件夹下下
扩展皮肤文件夹路径: extension/WhichWay/skin`), window.open("https://pan.baidu.com/s/1PJx78ZTdUVEZm3sgW0y11w?pwd=4e04"), W.showToast("[驶舰之向] 已打开链接，请自行下载皮肤包<br>如果没有弹出页面,请注意是否被拦截了!", 5e3, "topLeft", "configTips_getMoreSkin");
    },
    whichWayConfig: {
      priority: 888
    }
  },
  fetchGithub: {
    name: "<button type=`button`>获取最新版本</button>",
    clear: !0,
    onclick() {
      window.open("https://github.com/1TheLeaderOne/WhichWay"), W.showToast("[驶舰之向] 已打开本扩展仓库<br>如果没有弹出页面,请注意是否被拦截了!", 5e3, "topLeft", "configTips_fetchGithub");
    },
    whichWayConfig: {
      priority: 887
    }
  },
  settip: {
    name: "<font color=#ed7e78><————设置————></font></a>",
    clear: !0,
    whichWayConfig: {
      priority: 800
    }
  },
  devMode: {
    name: "开发者模式",
    intro: "开启后会将所有组件暴露在全局,方便调试,在开发服务器无论是否开启都会强制进入开发者模式",
    init: !1,
    whichWayConfig: {
      priority: 799
    }
  },
  // 注：「驶舰之向启动页」开关不在这里声明，而是由 src/launchPad/config.ts 通过
  // onConfig 钩子注册（保持启动页模块自包含，避免与主配置表耦合）。
  designerThanksTitle: {
    name: "<font color=#ed7e78><———干员设计———></font></a>",
    clear: !0,
    whichWayConfig: {
      priority: 400
    }
  },
  designerThanks: {
    name: `<font color = "blue">以下排名不分先后</font>${u.thanks.designer.map((d) => `<br>${d}`).join("")}`,
    clear: !0,
    whichWayConfig: {
      priority: 399
    }
  },
  SpecialAcknowledgmentTip: {
    name: "<font color=#ed7e78><————致谢————></font></a>",
    clear: !0,
    whichWayConfig: {
      priority: 300
    }
  },
  SpecialAcknowledgment: {
    name: `<font color = "blue">以下排名不分先后</font>${u.thanks.special.map((d) => `<br>${d}`).join("")}`,
    clear: !0,
    whichWayConfig: {
      priority: 299
    }
  }
};
class gt {
  constructor() {
    this.initConfig(ht);
    for (let r in this.initializedConfig)
      I(this.initializedConfig[r]);
  }
  /**已初始化完毕的配置选项 */
  initializedConfig = {};
  /** 已注册的配置选项 */
  get config() {
    return window.whichWay.hooks._hooks.config;
  }
  data = u;
  /**
   * 初始化配置
   * @param {Object} configs 配置选项
   */
  initConfig(r) {
    for (let l in r) {
      if (l in this.initializedConfig) {
        console.warn(`[WhichWayConfig] 配置项 ${l} 已存在`);
        continue;
      }
      let a = {
        name: l,
        priority: 0
      }, n = r[l];
      if (n.whichWayConfig) {
        let s = n.whichWayConfig;
        typeof s.priority == "number" && (a.priority = s.priority), typeof s.fn == "function" ? a.fn = s.fn : typeof s.obj == "object" && (a.obj = s.obj);
      }
      !a.fn && !a.obj && (a.obj ??= {
        name: l,
        options: n
      }), this.initializedConfig[l] = a;
    }
  }
  /**
   * 获取驶舰之向背景数据
   * @param {Object} [data] - 背景数据对象
   * @param {boolean} [enumerable=false] - 是否包含可枚举的属性
   * @param {boolean} [all=false] - 是否返回所有数据
   * @returns {Object} - 返回包含背景名称、翻译和内容的对象
   */
  getBackgroundData(r, l = !1, a) {
    E.is.object(r) || (r = this.data.background);
    let n = {
      name: [],
      translate: [],
      obj: {}
    };
    return Object.keys(r).forEach((s) => {
      const c = r[s];
      c && typeof c == "object" && "enumerable" in c ? (c.enumerable || l) && (n.name.push(s), n.translate.push(c), n.obj[s] = c.content) : (n.name.push(s), n.translate.push(c), n.obj[s] = c);
    }), a === !0 ? n : n.obj;
  }
}
const _ = new gt();
L({
  name: "whichWayConfig_dev",
  fn: function() {
    window.whichWayConfig = _;
  }
});
window.whichWay.register("config", _);
const wt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  whichWayConfig: _
}, Symbol.toStringTag, { value: "Module" }));
export {
  pt as E,
  wt as i,
  _ as w
};
