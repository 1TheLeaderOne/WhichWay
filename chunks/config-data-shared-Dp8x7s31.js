import { get as _, ui as x } from "noname";
import { onConfig as T, onSetDev as j } from "./hooks-BscfO9lD.js";
import { whichWayToast as v } from "./toast-BKImUKDM.js";
import { whichWayFile as k } from "./file-CXhVBbUa.js";
import { computed as u, openBlock as d, createElementBlock as p, createElementVNode as i, createStaticVNode as w, Fragment as b, renderList as C, toDisplayString as g, createTextVNode as m, createApp as S } from "vue";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const h = {
  /**
  * @type {Object} 背景图片
   */
  background: {
    url: {
      content: k.compilePath("bg:"),
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
    designer: ["涵涵", "今天整点什么/光阴", "落尘星河", "TheLeaderOne", "圣晴天空", "培嵩"],
    special: ["容若（动皮指导）", "果敢心（提供意见）", "灭蚁强小风儿（测试）", "零羽白瑠（测试、额外皮肤包作者）", "Flandre（动皮参数和皮肤提供）", "豆姜（测试）"]
  }
}, I = { class: "whichWay-intro" }, P = ["src"], A = { class: "voice-list" }, $ = { class: "voice-list" }, B = { class: "custom" }, L = ["src"], M = { class: "custom" }, z = ["src"], W = "https://prts.wiki/", N = {
  __name: "extIntro",
  setup(c) {
    const s = u(() => h.thanks.designer), l = u(() => h.thanks.special), r = u(() => k.compilePath("dec:")), e = (n) => `${r.value}/${n}`, a = (n) => {
      if (typeof n != "string") {
        alert("❌ 复制失败：内容必须是文本");
        return;
      }
      if (n = n.trim(), !n) {
        alert("❌ 复制失败：内容为空");
        return;
      }
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText == "function") {
          navigator.clipboard.writeText(n).then(
            () => alert("✅ 已复制"),
            (t) => {
              console.error("Clipboard API 失败:", t), o(n);
            }
          );
          return;
        }
        o(n);
      } catch (t) {
        console.error("复制过程出错:", t), o(n);
      }
    };
    function o(n) {
      const t = document.createElement("textarea");
      t.value = n, t.style.cssText = "position:absolute;left:-9999px;top:-9999px;", document.body.appendChild(t), t.select(), t.setSelectionRange(0, n.length);
      const f = document.execCommand("copy");
      document.body.removeChild(t), alert(f ? "✅ 已复制" : "❌ 复制失败，请手动选择并复制");
    }
    return (n, t) => (d(), p("div", I, [
      i("img", {
        src: e("SJZX.jpg"),
        alt: "扩展封面",
        class: "main-image"
      }, null, 8, P),
      t[5] || (t[5] = w('<div class="section-title" data-v-ea1d3cff><span class="title-arrow" data-v-ea1d3cff>←←</span><span class="title-text" data-v-ea1d3cff>扩展介绍</span><span class="title-arrow" data-v-ea1d3cff>→→</span></div><p data-v-ea1d3cff>本扩展主要由<span class="highlight" data-v-ea1d3cff>林登万</span>制作，武将技能设计主要由<span class="highlight" data-v-ea1d3cff>林登万</span>和<span class="highlight" data-v-ea1d3cff>圣晴天空</span>提供。</p><div class="section-title" data-v-ea1d3cff><span class="title-arrow" data-v-ea1d3cff>←←</span><span class="title-text" data-v-ea1d3cff>感谢名单</span><span class="title-arrow" data-v-ea1d3cff>→→</span></div><p data-v-ea1d3cff>感谢以下干员设计者对本扩展的支持：</p>', 4)),
      i("ul", A, [
        (d(!0), p(b, null, C(s.value, (f) => (d(), p("li", {
          key: `${f}`
        }, g(f), 1))), 128))
      ]),
      t[6] || (t[6] = i("p", null, "感谢以下人员对本扩展的支持：", -1)),
      i("ul", $, [
        (d(!0), p(b, null, C(l.value, (f) => (d(), p("li", {
          key: `${f}`
        }, g(f), 1))), 128))
      ]),
      t[7] || (t[7] = i("div", { class: "section-title" }, [
        i("span", { class: "title-arrow" }, "←←"),
        i("span", { class: "title-text" }, "资料来源"),
        i("span", { class: "title-arrow" }, "→→")
      ], -1)),
      i("p", null, [
        t[2] || (t[2] = m(" 干员介绍和势力均参考 PRTS，大部分干员语言也来自 PRTS： ", -1)),
        i("a", {
          href: W,
          target: "_blank",
          rel: "noopener noreferrer",
          class: "link"
        }, g(W))
      ]),
      t[8] || (t[8] = w('<p data-v-ea1d3cff>少部分干员（主要是剧情角色）配音使用 B 站 UP 主配音或 AI 合成：</p><ul class="voice-list" data-v-ea1d3cff><li data-v-ea1d3cff> 保存者、克丽斯腾： <a href="https://www.bilibili.com/video/BV1Yh411L72H" target="_blank" rel="noopener noreferrer" class="link" data-v-ea1d3cff> BV1Yh411L72H </a></li><li data-v-ea1d3cff> AI 配音（GPT-SoVITS）： <ul class="sub-list" data-v-ea1d3cff><li data-v-ea1d3cff>特雷西斯（音源：赫德雷、赫拉格）</li><li data-v-ea1d3cff>特蕾西娅（音源：黍、九色鹿）</li><li data-v-ea1d3cff>普瑞赛斯（音源：魔王、黍）</li><li data-v-ea1d3cff>特蕾西娅 &amp; 特雷西斯（音源：赫德雷、赫拉格、黍、九色鹿）</li></ul></li><li data-v-ea1d3cff> ACE： <span class="highlight" data-v-ea1d3cff>明日方舟：黎明前奏</span></li></ul><div class="section-title" data-v-ea1d3cff><span class="title-arrow" data-v-ea1d3cff>←←</span><span class="title-text" data-v-ea1d3cff>资源下载与 BUG 反馈</span><span class="title-arrow" data-v-ea1d3cff>→→</span></div>', 3)),
      i("div", B, [
        t[3] || (t[3] = m(" 反馈 bug、提供意见或资源下载可以加 QQ 群： ", -1)),
        i("span", {
          class: "copyable link",
          onClick: t[0] || (t[0] = (f) => a("104537053"))
        }, " 104537053（点击复制群号） ")
      ]),
      i("img", {
        src: e("qq1.jpg"),
        alt: "QQ群二维码",
        class: "qr-code"
      }, null, 8, L),
      i("div", M, [
        t[4] || (t[4] = m(" 百度网盘链接： ", -1)),
        i("span", {
          class: "copyable link",
          onClick: t[1] || (t[1] = (f) => a("https://pan.baidu.com/s/1Dw4pXRujfIaSfTBC_qDAiw?pwd=mess"))
        }, " 【点击复制链接】密码 mess ")
      ]),
      i("img", {
        src: e("baidupan.png"),
        alt: "百度网盘图标",
        class: "baidu-icon"
      }, null, 8, z)
    ]));
  }
}, V = /* @__PURE__ */ E(N, [["__scopeId", "data-v-ea1d3cff"]]), D = {
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
        var c = x.create.div(".whichWayExtIntro");
        S(V).mount(c), this.parentNode.insertBefore(c, this.nextSibling), this.whichWayExtIntro_more = c, this.innerHTML = '<div class="hth_menu">▼扩展信息（点击后折叠）</div>';
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
扩展皮肤文件夹路径: extension/WhichWay/skin`), window.open("https://pan.baidu.com/s/1PJx78ZTdUVEZm3sgW0y11w?pwd=4e04"), v.showToast("[驶舰之向] 已打开链接，请自行下载皮肤包<br>如果没有弹出页面,请注意是否被拦截了!", 5e3, "topLeft", "configTips_getMoreSkin");
    },
    whichWayConfig: {
      priority: 888
    }
  },
  fetchGithub: {
    name: "<button type=`button`>获取最新版本</button>",
    clear: !0,
    onclick() {
      window.open("https://github.com/1TheLeaderOne/WhichWay"), v.showToast("[驶舰之向] 已打开本扩展仓库<br>如果没有弹出页面,请注意是否被拦截了!", 5e3, "topLeft", "configTips_fetchGithub");
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
    name: `<font color = "blue">以下排名不分先后</font>${h.thanks.designer.map((c) => `<br>${c}`).join("")}`,
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
    name: `<font color = "blue">以下排名不分先后</font>${h.thanks.special.map((c) => `<br>${c}`).join("")}`,
    clear: !0,
    whichWayConfig: {
      priority: 299
    }
  }
};
class O {
  constructor() {
    this.initConfig(D);
    for (let s in this.initializedConfig)
      T(this.initializedConfig[s]);
  }
  /**已初始化完毕的配置选项 */
  initializedConfig = {};
  /** 已注册的配置选项 */
  get config() {
    return window.whichWay.hooks._hooks.config;
  }
  data = h;
  /**
   * 初始化配置
   * @param {Object} configs 配置选项
   */
  initConfig(s) {
    for (let l in s) {
      if (l in this.initializedConfig) {
        console.warn(`[WhichWayConfig] 配置项 ${l} 已存在`);
        continue;
      }
      let r = {
        name: l,
        priority: 0
      }, e = s[l];
      if (e.whichWayConfig) {
        let a = e.whichWayConfig;
        typeof a.priority == "number" && (r.priority = a.priority), typeof a.fn == "function" ? r.fn = a.fn : typeof a.obj == "object" && (r.obj = a.obj);
      }
      !r.fn && !r.obj && (r.obj ??= {
        name: l,
        options: e
      }), this.initializedConfig[l] = r;
    }
  }
  /**
   * 获取驶舰之向背景数据
   * @param {Object} [data] - 背景数据对象
   * @param {boolean} [enumerable=false] - 是否包含可枚举的属性
   * @param {boolean} [all=false] - 是否返回所有数据
   * @returns {Object} - 返回包含背景名称、翻译和内容的对象
   */
  getBackgroundData(s, l = !1, r) {
    _.is.object(s) || (s = this.data.background);
    let e = {
      name: [],
      translate: [],
      obj: {}
    };
    return Object.keys(s).forEach((a) => {
      const o = s[a];
      o && typeof o == "object" && "enumerable" in o ? (o.enumerable || l) && (e.name.push(a), e.translate.push(o), e.obj[a] = o.content) : (e.name.push(a), e.translate.push(o), e.obj[a] = o);
    }), r === !0 ? e : e.obj;
  }
}
const y = new O();
j({
  name: "whichWayConfig_dev",
  fn: function() {
    window.whichWayConfig = y;
  }
});
window.whichWay.register("config", y);
const R = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  whichWayConfig: y
}, Symbol.toStringTag, { value: "Module" }));
export {
  V as E,
  R as i,
  y as w
};
