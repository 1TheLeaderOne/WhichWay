import { get, ui } from "noname";
import { onSetDev, onConfig } from "../hooks/index.js";
import { whichWayToast } from "../toast/index.js";
import { whichWayConfigData } from "./data.js";
import ExtIntro from "./extIntro.vue.js";
import { createApp } from "vue";
const whichWayOriginConfig = {
  //分界线
  introtip: {
    name: '<a style="cursor: pointer;font-weight: bold;"><font color=#ffa10a><—欢迎游玩驶舰之向扩展—></font></a>',
    clear: true,
    whichWayConfig: {
      priority: 1e3
    }
  },
  //扩展介绍
  intromrfz: {
    name: '<div class="whichWayExtIntro">▶扩展信息（点击后展开）</div>',
    clear: true,
    onclick: function() {
      if (this.whichWayExtIntro_more === void 0) {
        var more = ui.create.div(".whichWayExtIntro");
        createApp(ExtIntro).mount(more);
        this.parentNode.insertBefore(more, this.nextSibling);
        this.whichWayExtIntro_more = more;
        this.innerHTML = '<div class="hth_menu">▼扩展信息（点击后折叠）</div>';
      } else {
        this.parentNode.removeChild(this.whichWayExtIntro_more);
        delete this.whichWayExtIntro_more;
        this.innerHTML = '<div class="hth_menu">▶扩展信息（点击后展开）</div>';
      }
    },
    whichWayConfig: {
      priority: 999
    }
  },
  settip_utill: {
    name: "<font color=#ed7e78><————功能————></font></a>",
    clear: true,
    whichWayConfig: {
      priority: 900
    }
  },
  getMoreSkin: {
    name: "<button type=`button`>获取更多皮肤</button>",
    clear: true,
    onclick() {
      alert("[驶舰之向]本皮肤包是由群友 @零羽白瑠 提供!\n需要您自行移动到扩展目录下的皮肤文件夹下下\n扩展皮肤文件夹路径: extension/WhichWay/skin");
      window.open("https://pan.baidu.com/s/1PJx78ZTdUVEZm3sgW0y11w?pwd=4e04");
      whichWayToast.showToast("[驶舰之向] 已打开链接，请自行下载皮肤包<br>如果没有弹出页面,请注意是否被拦截了!", 5e3, "topLeft", "configTips_getMoreSkin");
    },
    whichWayConfig: {
      priority: 888
    }
  },
  settip: {
    name: "<font color=#ed7e78><————设置————></font></a>",
    clear: true,
    whichWayConfig: {
      priority: 800
    }
  },
  devMode: {
    name: "开发者模式",
    intro: "开启后会将所有组件暴露在全局,方便调试,在开发服务器无论是否开启都会强制进入开发者模式",
    init: false,
    whichWayConfig: {
      priority: 799
    }
  },
  designerThanksTitle: {
    name: "<font color=#ed7e78><———干员设计———></font></a>",
    clear: true,
    whichWayConfig: {
      priority: 400
    }
  },
  designerThanks: {
    name: `<font color = "blue">以下排名不分先后</font>${whichWayConfigData.thanks.designer.map((name) => `<br>${name}`).join("")}`,
    clear: true,
    whichWayConfig: {
      priority: 399
    }
  },
  SpecialAcknowledgmentTip: {
    name: "<font color=#ed7e78><————致谢————></font></a>",
    clear: true,
    whichWayConfig: {
      priority: 300
    }
  },
  SpecialAcknowledgment: {
    name: `<font color = "blue">以下排名不分先后</font>${whichWayConfigData.thanks.special.map((name) => `<br>${name}`).join("")}`,
    clear: true,
    whichWayConfig: {
      priority: 299
    }
  }
};
class WhichWayConfig {
  constructor() {
    this.initConfig(whichWayOriginConfig);
    for (let configName in this.initializedConfig) {
      onConfig(this.initializedConfig[configName]);
    }
  }
  /**已初始化完毕的配置选项 */
  initializedConfig = {};
  /** 已注册的配置选项 */
  get config() {
    return window.whichWay.hooks._hooks.config;
  }
  data = whichWayConfigData;
  /**
   * 初始化配置
   * @param {Object} configs 配置选项
   */
  initConfig(configs) {
    for (let configName in configs) {
      if (configName in this.initializedConfig) {
        console.warn(`[WhichWayConfig] 配置项 ${configName} 已存在`);
        continue;
      }
      let config = {
        name: configName,
        priority: 0
      };
      let info = configs[configName];
      if (info.whichWayConfig) {
        let setting = info.whichWayConfig;
        if (typeof setting.priority === "number") config.priority = setting.priority;
        if (typeof setting.fn === "function") config.fn = setting.fn;
        else if (typeof setting.obj === "object") config.obj = setting.obj;
      }
      if (!config.fn && !config.obj) {
        config.obj ??= {
          name: configName,
          options: info
        };
      }
      this.initializedConfig[configName] = config;
    }
  }
  /**
   * 获取驶舰之向背景数据
   * @param {Object} [data] - 背景数据对象
   * @param {boolean} [enumerable=false] - 是否包含可枚举的属性
   * @param {boolean} [all=false] - 是否返回所有数据
   * @returns {Object} - 返回包含背景名称、翻译和内容的对象
   */
  getBackgroundData(data, enumerable = false, all) {
    if (!get.is.object(data)) data = this.data.background;
    let result = {
      name: [],
      translate: [],
      obj: {}
    };
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value && typeof value === "object" && "enumerable" in value) {
        if (value.enumerable || enumerable) {
          result["name"].push(key);
          result["translate"].push(value);
          result.obj[key] = value.content;
        }
      } else {
        result["name"].push(key);
        result["translate"].push(value);
        result.obj[key] = value;
      }
    });
    return all === true ? result : result.obj;
  }
}
const whichWayConfig = new WhichWayConfig();
onSetDev({
  name: "whichWayConfig_dev",
  fn: function() {
    window.whichWayConfig = whichWayConfig;
  }
});
window.whichWay.register("config", whichWayConfig);
export {
  whichWayConfig
};
//# sourceMappingURL=index.js.map
