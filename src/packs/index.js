import __variableDynamicImportRuntimeHelper from "../../_virtual/dynamic-import-helper.js";
import { lib, get, game } from "noname";
import { whichWayFile } from "../file.js";
import { onBeforeInit, onSetDev } from "../hooks/index.js";
import { pendingRun, registerExecute, packHooks } from "./hooks.js";
import { initCharConfig } from "./base/extCharConfig.js";
import { designer, getDesigner } from "./base/index.js";
import { whichWayUtil } from "../utill.js";
import { groupData } from "./base/groups.js";
import { whichWayArknight } from "../arknight/index.js";
class WhichWayPackManager {
  static CHARACTER_PACKS = ["epicSJZX", "legendSJZX", "especialSJZX", "plotSJZX", "specialSJZX", "rareSJZX", "mediocreSJZX", "normalSJZX"];
  /**
   * 初始化
   */
  async init() {
    this.pendingRun = pendingRun;
    await this.initCharacterPack();
    await this.initCardPack();
    registerExecute("translate", (trans, name) => {
      if (name.endsWith("_prefix")) {
        let tran = this.setNamePrefix(trans);
        trans = tran.name || trans;
      }
      trans = whichWayUtil.colorize(trans);
      return trans;
    });
    onBeforeInit({
      name: "whichWayPackManager_init",
      fn: async () => {
        for (const fn of this.pendingRun) {
          await fn();
        }
      }
    });
  }
  async initCharacterPack() {
    const t0 = performance.now();
    const { files, folders } = await whichWayFile.getFileTree("src:packs/character/", 1);
    const tList = performance.now() - t0;
    const importTasks = [];
    const loadedFlats = /* @__PURE__ */ new Set();
    for (const file of files) {
      if (!/\.(ts|js)$/.test(file.name)) continue;
      const name = whichWayFile.removeExt(file.name);
      if (!name.endsWith("mrfz")) continue;
      loadedFlats.add(name);
      importTasks.push(
        (async () => {
          try {
            await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({}), `./character/${name}.js`, 3);
          } catch (e) {
            try {
              await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./character/Castle3mrfz.ts": () => import("./character/Castle3mrfz.js"), "./character/Christinemrfz.ts": () => import("./character/Christinemrfz.js"), "./character/Lancet2mrfz.ts": () => import("./character/Lancet2mrfz.js"), "./character/PhonoR0mrfz.ts": () => import("./character/PhonoR0mrfz.js"), "./character/THRMEXmrfz.ts": () => import("./character/THRMEXmrfz.js"), "./character/acemrfz.ts": () => import("./character/acemrfz.js"), "./character/aibulanamrfz.ts": () => import("./character/aibulanamrfz.js"), "./character/aiguozhemrfz.ts": () => import("./character/aiguozhemrfz.js"), "./character/ailinimrfz.ts": () => import("./character/ailinimrfz.js"), "./character/ailisimrfz.ts": () => import("./character/ailisimrfz.js"), "./character/alannamrfz.ts": () => import("./character/alannamrfz.js"), "./character/amiyamrfz.ts": () => import("./character/amiyamrfz.js"), "./character/amrfz.ts": () => import("./character/amrfz.js"), "./character/anjielinamrfz.ts": () => import("./character/anjielinamrfz.js"), "./character/anzhelamrfz.ts": () => import("./character/anzhelamrfz.js"), "./character/ashmrfz.ts": () => import("./character/ashmrfz.js"), "./character/asikalunmrfz.ts": () => import("./character/asikalunmrfz.js"), "./character/bafanhailingmrfz.ts": () => import("./character/bafanhailingmrfz.js"), "./character/baidurenmrfz.ts": () => import("./character/baidurenmrfz.js"), "./character/baijinmrfz.ts": () => import("./character/baijinmrfz.js"), "./character/baimianxiaomrfz.ts": () => import("./character/baimianxiaomrfz.js"), "./character/baitiemrfz.ts": () => import("./character/baitiemrfz.js"), "./character/baocunzhemrfz.ts": () => import("./character/baocunzhemrfz.js"), "./character/beiluoneimrfz.ts": () => import("./character/beiluoneimrfz.js"), "./character/bobumrfz.ts": () => import("./character/bobumrfz.js"), "./character/bohuimrfz.ts": () => import("./character/bohuimrfz.js"), "./character/botanimrfz.ts": () => import("./character/botanimrfz.js"), "./character/caidumrfz.ts": () => import("./character/caidumrfz.js"), "./character/ceshimrfz.ts": () => import("./character/ceshimrfz.js"), "./character/chengfengmrfz.ts": () => import("./character/chengfengmrfz.js"), "./character/chengshanmrfz.ts": () => import("./character/chengshanmrfz.js"), "./character/chenmrfz.ts": () => import("./character/chenmrfz.js"), "./character/chizuimrfz.ts": () => import("./character/chizuimrfz.js"), "./character/chongyuemrfz.ts": () => import("./character/chongyuemrfz.js"), "./character/chuxuemrfz.ts": () => import("./character/chuxuemrfz.js"), "./character/cimeimrfz.ts": () => import("./character/cimeimrfz.js"), "./character/cuoemrfz.ts": () => import("./character/cuoemrfz.js"), "./character/daifeienmrfz.ts": () => import("./character/daifeienmrfz.js"), "./character/dekesasimrfz.ts": () => import("./character/dekesasimrfz.js"), "./character/dianhumrfz.ts": () => import("./character/dianhumrfz.js"), "./character/dibimrfz.ts": () => import("./character/dibimrfz.js"), "./character/docmrfz.ts": () => import("./character/docmrfz.js"), "./character/dongshimrfz.ts": () => import("./character/dongshimrfz.js"), "./character/doushitalulamrfz.ts": () => import("./character/doushitalulamrfz.js"), "./character/duoluoximrfz.ts": () => import("./character/duoluoximrfz.js"), "./character/elamrfz.ts": () => import("./character/elamrfz.js"), "./character/extratranslatemrfz.ts": () => import("./character/extratranslatemrfz.js"), "./character/feilaimrfz.ts": () => import("./character/feilaimrfz.js"), "./character/feiyameitamrfz.ts": () => import("./character/feiyameitamrfz.js"), "./character/fengchuanxiangzimrfz.ts": () => import("./character/fengchuanxiangzimrfz.js"), "./character/fengdimrfz.ts": () => import("./character/fengdimrfz.js"), "./character/fengwan_zhioumrfz.ts": () => import("./character/fengwan_zhioumrfz.js"), "./character/fengwanmrfz.ts": () => import("./character/fengwanmrfz.js"), "./character/fengxumrfz.ts": () => import("./character/fengxumrfz.js"), "./character/friston3mrfz.ts": () => import("./character/friston3mrfz.js"), "./character/fulankamrfz.ts": () => import("./character/fulankamrfz.js"), "./character/fuzoumrfz.ts": () => import("./character/fuzoumrfz.js"), "./character/gallusmrfz.ts": () => import("./character/gallusmrfz.js"), "./character/gelaokesimrfz.ts": () => import("./character/gelaokesimrfz.js"), "./character/geleidiyamrfz.ts": () => import("./character/geleidiyamrfz.js"), "./character/guiyanmrfz.ts": () => import("./character/guiyanmrfz.js"), "./character/hadiyamrfz.ts": () => import("./character/hadiyamrfz.js"), "./character/haidimrfz.ts": () => import("./character/haidimrfz.js"), "./character/haimomrfz.ts": () => import("./character/haimomrfz.js"), "./character/hainimrfz.ts": () => import("./character/hainimrfz.js"), "./character/haojiaomrfz.ts": () => import("./character/haojiaomrfz.js"), "./character/hedeleimrfz.ts": () => import("./character/hedeleimrfz.js"), "./character/heijianmrfz.ts": () => import("./character/heijianmrfz.js"), "./character/heimrfz.ts": () => import("./character/heimrfz.js"), "./character/helagemrfz.ts": () => import("./character/helagemrfz.js"), "./character/hongmrfz.ts": () => import("./character/hongmrfz.js"), "./character/hongsunmrfz.ts": () => import("./character/hongsunmrfz.js"), "./character/hongxuemrfz.ts": () => import("./character/hongxuemrfz.js"), "./character/huangmrfz.ts": () => import("./character/huangmrfz.js"), "./character/huoerhaiyamrfz.ts": () => import("./character/huoerhaiyamrfz.js"), "./character/innamrfz.ts": () => import("./character/innamrfz.js"), "./character/jianmrfz.ts": () => import("./character/jianmrfz.js"), "./character/jiaxintamrfz.ts": () => import("./character/jiaxintamrfz.js"), "./character/jicimrfz.ts": () => import("./character/jicimrfz.js"), "./character/jiemrfz.ts": () => import("./character/jiemrfz.js"), "./character/jingzhemrfz.ts": () => import("./character/jingzhemrfz.js"), "./character/jiushenmrfz.ts": () => import("./character/jiushenmrfz.js"), "./character/jixingmrfz.ts": () => import("./character/jixingmrfz.js"), "./character/jumrfz.ts": () => import("./character/jumrfz.js"), "./character/kaierximrfz.ts": () => import("./character/kaierximrfz.js"), "./character/kaiselinmrfz.ts": () => import("./character/kaiselinmrfz.js"), "./character/kamimrfz.ts": () => import("./character/kamimrfz.js"), "./character/kanielianmrfz.ts": () => import("./character/kanielianmrfz.js"), "./character/keebomrfz.ts": () => import("./character/keebomrfz.js"), "./character/kelisitengmrfz.ts": () => import("./character/kelisitengmrfz.js"), "./character/keluxiermrfz.ts": () => import("./character/keluxiermrfz.js"), "./character/kongxianmrfz.ts": () => import("./character/kongxianmrfz.js"), "./character/kuiyingmrfz.ts": () => import("./character/kuiyingmrfz.js"), "./character/laiousimrfz.ts": () => import("./character/laiousimrfz.js"), "./character/laiyimrfz.ts": () => import("./character/laiyimrfz.js"), "./character/landumrfz.ts": () => import("./character/landumrfz.js"), "./character/laolimrfz.ts": () => import("./character/laolimrfz.js"), "./character/leimiuanmrfz.ts": () => import("./character/leimiuanmrfz.js"), "./character/liexiangmrfz.ts": () => import("./character/liexiangmrfz.js"), "./character/lindongmrfz.ts": () => import("./character/lindongmrfz.js"), "./character/linglanmrfz.ts": () => import("./character/linglanmrfz.js"), "./character/lingmrfz.ts": () => import("./character/lingmrfz.js"), "./character/linguangmrfz.ts": () => import("./character/linguangmrfz.js"), "./character/lingyinmrfz.ts": () => import("./character/lingyinmrfz.js"), "./character/lingzhimrfz.ts": () => import("./character/lingzhimrfz.js"), "./character/linmrfz.ts": () => import("./character/linmrfz.js"), "./character/linshimrfz.ts": () => import("./character/linshimrfz.js"), "./character/liumingmrfz.ts": () => import("./character/liumingmrfz.js"), "./character/longshelanmrfz.ts": () => import("./character/longshelanmrfz.js"), "./character/luogesimrfz.ts": () => import("./character/luogesimrfz.js"), "./character/lutuomrfz.ts": () => import("./character/lutuomrfz.js"), "./character/maennamrfz.ts": () => import("./character/maennamrfz.js"), "./character/maizhelunmrfz.ts": () => import("./character/maizhelunmrfz.js"), "./character/maluxiermrfz.ts": () => import("./character/maluxiermrfz.js"), "./character/medical_amiyamrfz.ts": () => import("./character/medical_amiyamrfz.js"), "./character/meiermrfz.ts": () => import("./character/meiermrfz.js"), "./character/midiexiangmrfz.ts": () => import("./character/midiexiangmrfz.js"), "./character/migelumrfz.ts": () => import("./character/migelumrfz.js"), "./character/minermrfz.ts": () => import("./character/minermrfz.js"), "./character/mingjiaomrfz.ts": () => import("./character/mingjiaomrfz.js"), "./character/miumiumrfz.ts": () => import("./character/miumiumrfz.js"), "./character/mon3trmrfz.ts": () => import("./character/mon3trmrfz.js"), "./character/mositimamrfz.ts": () => import("./character/mositimamrfz.js"), "./character/mowangmrfz.ts": () => import("./character/mowangmrfz.js"), "./character/muouwuzhemrfz.ts": () => import("./character/muouwuzhemrfz.js"), "./character/muqianmrfz.ts": () => import("./character/muqianmrfz.js"), "./character/narentuyamrfz.ts": () => import("./character/narentuyamrfz.js"), "./character/nasitimrfz.ts": () => import("./character/nasitimrfz.js"), "./character/nengtianshimrfz.ts": () => import("./character/nengtianshimrfz.js"), "./character/nianmrfz.ts": () => import("./character/nianmrfz.js"), "./character/nifumrfz.ts": () => import("./character/nifumrfz.js"), "./character/niyanmrfz.ts": () => import("./character/niyanmrfz.js"), "./character/nuoweiermrfz.ts": () => import("./character/nuoweiermrfz.js"), "./character/palasimrfz.ts": () => import("./character/palasimrfz.js"), "./character/paxinghaomrfz.ts": () => import("./character/paxinghaomrfz.js"), "./character/peipeimrfz.ts": () => import("./character/peipeimrfz.js"), "./character/plot_keluxiermrfz.ts": () => import("./character/plot_keluxiermrfz.js"), "./character/puruisaisimrfz.ts": () => import("./character/puruisaisimrfz.js"), "./character/qiaojiakelifumrfz.ts": () => import("./character/qiaojiakelifumrfz.js"), "./character/qierchakemrfz.ts": () => import("./character/qierchakemrfz.js"), "./character/qinliumrfz.ts": () => import("./character/qinliumrfz.js"), "./character/qiubaimrfz.ts": () => import("./character/qiubaimrfz.js"), "./character/rendongmrfz.ts": () => import("./character/rendongmrfz.js"), "./character/ruoyemumrfz.ts": () => import("./character/ruoyemumrfz.js"), "./character/saileiyamrfz.ts": () => import("./character/saileiyamrfz.js"), "./character/sanjiaochuhuamrfz.ts": () => import("./character/sanjiaochuhuamrfz.js"), "./character/sbchenmrfz.ts": () => import("./character/sbchenmrfz.js"), "./character/semrfz.ts": () => import("./character/semrfz.js"), "./character/senranmrfz.ts": () => import("./character/senranmrfz.js"), "./character/senximrfz.ts": () => import("./character/senximrfz.js"), "./character/shanbimrfz.ts": () => import("./character/shanbimrfz.js"), "./character/shanjimrfz.ts": () => import("./character/shanjimrfz.js"), "./character/shanlingmrfz.ts": () => import("./character/shanlingmrfz.js"), "./character/shanmrfz.ts": () => import("./character/shanmrfz.js"), "./character/shendianmrfz.ts": () => import("./character/shendianmrfz.js"), "./character/shenxunmrfz.ts": () => import("./character/shenxunmrfz.js"), "./character/shijunzhemrfz.ts": () => import("./character/shijunzhemrfz.js"), "./character/shixiemrfz.ts": () => import("./character/shixiemrfz.js"), "./character/shiximrfz.ts": () => import("./character/shiximrfz.js"), "./character/shuanghuamrfz.ts": () => import("./character/shuanghuamrfz.js"), "./character/shuangwangmrfz.ts": () => import("./character/shuangwangmrfz.js"), "./character/shuangyemrfz.ts": () => import("./character/shuangyemrfz.js"), "./character/shuidengxinmrfz.ts": () => import("./character/shuidengxinmrfz.js"), "./character/shuiyuemrfz.ts": () => import("./character/shuiyuemrfz.js"), "./character/shumrfz.ts": () => import("./character/shumrfz.js"), "./character/sikadimrfz.ts": () => import("./character/sikadimrfz.js"), "./character/siyemrfz.ts": () => import("./character/siyemrfz.js"), "./character/songtongmrfz.ts": () => import("./character/songtongmrfz.js"), "./character/spamiyamrfz.ts": () => import("./character/spamiyamrfz.js"), "./character/spanjielinamrfz.ts": () => import("./character/spanjielinamrfz.js"), "./character/spchuxuemrfz.ts": () => import("./character/spchuxuemrfz.js"), "./character/spdegoumrfz.ts": () => import("./character/spdegoumrfz.js"), "./character/spfenmrfz.ts": () => import("./character/spfenmrfz.js"), "./character/spfurongmrfz.ts": () => import("./character/spfurongmrfz.js"), "./character/spheijiaomrfz.ts": () => import("./character/spheijiaomrfz.js"), "./character/sphemomrfz.ts": () => import("./character/sphemomrfz.js"), "./character/spjiaweiermrfz.ts": () => import("./character/spjiaweiermrfz.js"), "./character/spjicimrfz.ts": () => import("./character/spjicimrfz.js"), "./character/spjiexikamrfz.ts": () => import("./character/spjiexikamrfz.js"), "./character/spjingzhemrfz.ts": () => import("./character/spjingzhemrfz.js"), "./character/spkaierximrfz.ts": () => import("./character/spkaierximrfz.js"), "./character/spkongbaomrfz.ts": () => import("./character/spkongbaomrfz.js"), "./character/splapulandemrfz.ts": () => import("./character/splapulandemrfz.js"), "./character/splingdongmrfz.ts": () => import("./character/splingdongmrfz.js"), "./character/splinguangmrfz.ts": () => import("./character/splinguangmrfz.js"), "./character/spnengtianshimrfz.ts": () => import("./character/spnengtianshimrfz.js"), "./character/spshihuaiyamrfz.ts": () => import("./character/spshihuaiyamrfz.js"), "./character/spsikadimrfz.ts": () => import("./character/spsikadimrfz.js"), "./character/spsongzangrenmrfz.ts": () => import("./character/spsongzangrenmrfz.js"), "./character/sptiaoxiangshimrfz.ts": () => import("./character/sptiaoxiangshimrfz.js"), "./character/spweicaomrfz.ts": () => import("./character/spweicaomrfz.js"), "./character/spweinamrfz.ts": () => import("./character/spweinamrfz.js"), "./character/spxiaoyangmrfz.ts": () => import("./character/spxiaoyangmrfz.js"), "./character/spxingxiongmrfz.ts": () => import("./character/spxingxiongmrfz.js"), "./character/spxingyuanmrfz.ts": () => import("./character/spxingyuanmrfz.js"), "./character/spyedaomrfz.ts": () => import("./character/spyedaomrfz.js"), "./character/spyinhuimrfz.ts": () => import("./character/spyinhuimrfz.js"), "./character/spyoulingshamrfz.ts": () => import("./character/spyoulingshamrfz.js"), "./character/spzilanmrfz.ts": () => import("./character/spzilanmrfz.js"), "./character/spzzxpmrfz.ts": () => import("./character/spzzxpmrfz.js"), "./character/suocaomrfz.ts": () => import("./character/suocaomrfz.js"), "./character/suxinmrfz.ts": () => import("./character/suxinmrfz.js"), "./character/talaidingzhenmrfz.ts": () => import("./character/talaidingzhenmrfz.js"), "./character/taojinniangmrfz.ts": () => import("./character/taojinniangmrfz.js"), "./character/tekenuomrfz.ts": () => import("./character/tekenuomrfz.js"), "./character/teleixisimrfz.ts": () => import("./character/teleixisimrfz.js"), "./character/teleixiyamrfz.ts": () => import("./character/teleixiyamrfz.js"), "./character/tianhuomrfz.ts": () => import("./character/tianhuomrfz.js"), "./character/tiankonghemrfz.ts": () => import("./character/tiankonghemrfz.js"), "./character/tifengmrfz.ts": () => import("./character/tifengmrfz.js"), "./character/titimrfz.ts": () => import("./character/titimrfz.js"), "./character/wanqingmrfz.ts": () => import("./character/wanqingmrfz.js"), "./character/weinamrfz.ts": () => import("./character/weinamrfz.js"), "./character/weishidaiermrfz.ts": () => import("./character/weishidaiermrfz.js"), "./character/weiweiannamrfz.ts": () => import("./character/weiweiannamrfz.js"), "./character/weiyimrfz.ts": () => import("./character/weiyimrfz.js"), "./character/wendimrfz.ts": () => import("./character/wendimrfz.js"), "./character/wenmimrfz.ts": () => import("./character/wenmimrfz.js"), "./character/wmrfz.ts": () => import("./character/wmrfz.js"), "./character/wuerbianmrfz.ts": () => import("./character/wuerbianmrfz.js"), "./character/wujiumrfz.ts": () => import("./character/wujiumrfz.js"), "./character/xiaguangmrfz.ts": () => import("./character/xiaguangmrfz.js"), "./character/xiangshimrfz.ts": () => import("./character/xiangshimrfz.js"), "./character/xiaomanmrfz.ts": () => import("./character/xiaomanmrfz.js"), "./character/xiaoyangmrfz.ts": () => import("./character/xiaoyangmrfz.js"), "./character/xielvmrfz.ts": () => import("./character/xielvmrfz.js"), "./character/xierdamrfz.ts": () => import("./character/xierdamrfz.js"), "./character/xigymrfz.ts": () => import("./character/xigymrfz.js"), "./character/xingjimrfz.ts": () => import("./character/xingjimrfz.js"), "./character/xingxiongmrfz.ts": () => import("./character/xingxiongmrfz.js"), "./character/xingyuanmrfz.ts": () => import("./character/xingyuanmrfz.js"), "./character/xingzhumrfz.ts": () => import("./character/xingzhumrfz.js"), "./character/xinyangjiaobanjimrfz.ts": () => import("./character/xinyangjiaobanjimrfz.js"), "./character/xirenmrfz.ts": () => import("./character/xirenmrfz.js"), "./character/xiyinmrfz.ts": () => import("./character/xiyinmrfz.js"), "./character/xueliemrfz.ts": () => import("./character/xueliemrfz.js"), "./character/xunlanmrfz.ts": () => import("./character/xunlanmrfz.js"), "./character/yanweimrfz.ts": () => import("./character/yanweimrfz.js"), "./character/yaxinmrfz.ts": () => import("./character/yaxinmrfz.js"), "./character/yelamrfz.ts": () => import("./character/yelamrfz.js"), "./character/yemomrfz.ts": () => import("./character/yemomrfz.js"), "./character/yeyingmrfz.ts": () => import("./character/yeyingmrfz.js"), "./character/yifulitemrfz.ts": () => import("./character/yifulitemrfz.js"), "./character/yindelaiximrfz.ts": () => import("./character/yindelaiximrfz.js"), "./character/yineisimrfz.ts": () => import("./character/yineisimrfz.js"), "./character/yinhuimrfz.ts": () => import("./character/yinhuimrfz.js"), "./character/yintuoluomrfz.ts": () => import("./character/yintuoluomrfz.js"), "./character/yizumikemrfz.ts": () => import("./character/yizumikemrfz.js"), "./character/youtiansiruomaimrfz.ts": () => import("./character/youtiansiruomaimrfz.js"), "./character/yuanyamrfz.ts": () => import("./character/yuanyamrfz.js"), "./character/yueyuemrfz.ts": () => import("./character/yueyuemrfz.js"), "./character/yumaobimrfz.ts": () => import("./character/yumaobimrfz.js"), "./character/yumrfz.ts": () => import("./character/yumrfz.js"), "./character/yunjimrfz.ts": () => import("./character/yunjimrfz.js"), "./character/yunqingpingmrfz.ts": () => import("./character/yunqingpingmrfz.js"), "./character/yunxingmrfz.ts": () => import("./character/yunxingmrfz.js"), "./character/zaolumrfz.ts": () => import("./character/zaolumrfz.js"), "./character/zhanchemrfz.ts": () => import("./character/zhanchemrfz.js"), "./character/zhenyanmrfz.ts": () => import("./character/zhenyanmrfz.js"), "./character/zheyamrfz.ts": () => import("./character/zheyamrfz.js"), "./character/zhisongmrfz.ts": () => import("./character/zhisongmrfz.js"), "./character/zhuhuangmrfz.ts": () => import("./character/zhuhuangmrfz.js"), "./character/ziyeyaomrfz.ts": () => import("./character/ziyeyaomrfz.js"), "./character/zuolemrfz.ts": () => import("./character/zuolemrfz.js") }), `./character/${name}.ts`, 3);
            } catch (e2) {
              console.warn(`${name} 加载失败 : ${e2}`);
            }
          }
        })()
      );
    }
    for (const folder of folders) {
      const name = folder.name;
      if (!name.endsWith("mrfz")) continue;
      if (loadedFlats.has(name)) continue;
      importTasks.push(
        (async () => {
          try {
            await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({}), `./character/${name}/index.js`, 4);
          } catch (e) {
            try {
              await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./character/wangmrfz/index.ts": () => import("./character/wangmrfz/index.js") }), `./character/${name}/index.ts`, 4);
            } catch (e2) {
              console.warn(`${name} 加载失败 : ${e2}`);
            }
          }
        })()
      );
    }
    const t1 = performance.now();
    const limit = 16;
    let cursor = 0;
    const workers = Array.from({ length: Math.min(limit, importTasks.length) }, async () => {
      while (true) {
        const idx = cursor++;
        if (idx >= importTasks.length) return;
        await importTasks[idx];
      }
    });
    await Promise.all(workers);
    const tImports = performance.now() - t1;
    const t2 = performance.now();
    this.register();
    const tRegister = performance.now() - t2;
    const total = tList + tImports + tRegister;
    if (total > 500) {
      console.groupCollapsed(`%c[WhichWay·packs] initCharacterPack ${total.toFixed(0)}ms`, "color:#e67e22;");
      console.log(`  listDirNames:    ${tList.toFixed(0)}ms`);
      console.log(`  imports (限16):  ${tImports.toFixed(0)}ms  (${importTasks.length} 模块)`);
      console.log(`  register:        ${tRegister.toFixed(0)}ms`);
      console.groupEnd();
    }
    for (const name of WhichWayPackManager.CHARACTER_PACKS) {
      lib.characterPack[name] ??= {};
      if (!lib.config.characters.includes(name)) lib.config.characters.push(name);
      let translate = lib.config.extension_WhichWay_compatibleMode === true ? `驶舰:${this.getPackTranslation(name)}` : "<img style='width:90px;height:25px;' src=" + lib.assetURL + `extension/WhichWay/image/decoration/${this.getPackTranslation(name, 1)}.png>`;
      lib.translate[`${name}_character_config`] = translate;
    }
    registerExecute("character", (char, name) => {
      if (Array.isArray(char)) char = get.convertedCharacter(char);
      char.img = whichWayFile.compilePath(`img:character/${name}.jpg`);
      char = initCharConfig(char);
      char.whichWay.reallyGroup = char.group;
      char.whichWay.charId = name;
      if (!char.pack) {
        char.pack = "specialSJZX";
      }
      lib.characterPack[char.pack][name] ??= char;
      if (char.designer) {
        char.whichWay.designer = Array.isArray(char.designer) ? char.designer : [char.designer];
        designer[name] ??= [];
        designer[name].push(...char.whichWay.designer.filter((designerx) => !designer[name].includes(designerx)));
      } else {
        char.whichWay.designer = getDesigner(char, false, true);
      }
      if (!whichWayUtil.config("unityGroup")) {
        if (this._addedGroup === false) {
          this._addedGroup = true;
          let data = groupData;
          for (let key in data) {
            lib.group.push(key);
            lib.groupnature[key] = key;
            lib.translate[key] = data[key].group;
            lib.translate[key + "2"] = data[key].group;
          }
        }
      } else {
        char.group = "sjzx_group";
        if (!lib.translate["sjzx_group"]) lib.translate["sjzx_group"] = "泰拉";
      }
      whichWayArknight.addShcema(name, char);
      whichWayArknight.initCharArknight(char);
      return char;
    });
  }
  /**
   * 初始化卡牌包
   *
   * 与干员加载同一模式（性能红线，勿改）：
   * - getFileTree 单层扫描 src:packs/card/ 下的扁平文件（{卡牌}.ts）
   * - 16 并发窗口限流并行 import，避免过度并行打爆 vite 文件句柄
   * - 卡牌模块顶层只调用 card()/cardSkill()/cardTranslate() 钩子缓冲进 packHooks
   *   （这三个钩子不进 pendingRun，不会自动落库），统一在本方法内收集后组装
   *   mrfzcard 包，game.import("card") 注册给引擎
   *
   * 新增卡牌：在 src/packs/card/ 下新建 {新卡}.ts 即可自动加载，
   * 无需修改任何文件。共享技能（多卡共用的）请放入 shared.ts。
   */
  async initCardPack() {
    const t0 = performance.now();
    const { files } = await whichWayFile.getFileTree("src:packs/card/", 1);
    const tList = performance.now() - t0;
    const importTasks = [];
    for (const file of files) {
      if (!/\.(ts|js)$/.test(file.name)) continue;
      const name = whichWayFile.removeExt(file.name);
      if (name === "index") continue;
      importTasks.push(
        (async () => {
          try {
            await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({}), `./card/${name}.js`, 3);
          } catch (e) {
            try {
              await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./card/DP27mrfz.ts": () => import("./card/DP27mrfz.js"), "./card/baitiemrfzcard1.ts": () => import("./card/baitiemrfzcard1.js"), "./card/baitiemrfzcard2.ts": () => import("./card/baitiemrfzcard2.js"), "./card/baitiemrfzcard3.ts": () => import("./card/baitiemrfzcard3.js"), "./card/cuoe_huanyoumrfzCard.ts": () => import("./card/cuoe_huanyoumrfzCard.js"), "./card/dazijimrfz.ts": () => import("./card/dazijimrfz.js"), "./card/jianzhumrfz.ts": () => import("./card/jianzhumrfz.js"), "./card/jingtouE1mrfz.ts": () => import("./card/jingtouE1mrfz.js"), "./card/jingtouE2mrfz.ts": () => import("./card/jingtouE2mrfz.js"), "./card/jingtouE3mrfz.ts": () => import("./card/jingtouE3mrfz.js"), "./card/jingtouE4mrfz.ts": () => import("./card/jingtouE4mrfz.js"), "./card/jingtouE5mrfz.ts": () => import("./card/jingtouE5mrfz.js"), "./card/ksl_lulitongxinmrfz.ts": () => import("./card/ksl_lulitongxinmrfz.js"), "./card/shadishoumrfz.ts": () => import("./card/shadishoumrfz.js"), "./card/shared.ts": () => import("./card/shared.js"), "./card/sjzx_zhuihuomrfz.ts": () => import("./card/sjzx_zhuihuomrfz.js") }), `./card/${name}.ts`, 3);
            } catch (e2) {
              console.warn(`${name} 卡牌加载失败 : ${e2}`);
            }
          }
        })()
      );
    }
    const t1 = performance.now();
    const limit = 16;
    let cursor = 0;
    const workers = Array.from({ length: Math.min(limit, importTasks.length) }, async () => {
      while (true) {
        const idx = cursor++;
        if (idx >= importTasks.length) return;
        await importTasks[idx];
      }
    });
    await Promise.all(workers);
    const tImports = performance.now() - t1;
    const t2 = performance.now();
    const cardHooks = packHooks.getHooks("card");
    const skillHooks = packHooks.getHooks("cardSkill");
    const transHooks = packHooks.getHooks("cardTranslate");
    const card = {};
    const skill = {};
    const translate = {};
    for (const h of cardHooks) card[h.key] = h.obj;
    for (const h of skillHooks) skill[h.key] = h.obj;
    for (const h of transHooks) translate[h.key] = h.obj;
    for (const cardKey of Object.keys(card)) {
      const infoKey = `${cardKey}_info`;
      if (translate[infoKey] === void 0) {
        translate[infoKey] = translate[cardKey] ?? cardKey;
      }
    }
    const mrfzcard = { name: "mrfzcard", connect: true, card, skill, translate, list: [] };
    lib.translate["mrfzcard_card_config"] = "驶舰之向";
    if (!lib.config.cards.includes("mrfzcard")) lib.config.cards.push("mrfzcard");
    await game.import("card", () => mrfzcard);
    const tAssemble = performance.now() - t2;
    const total = tList + tImports + tAssemble;
    if (total > 500) {
      console.groupCollapsed(`%c[WhichWay·packs] initCardPack ${total.toFixed(0)}ms`, "color:#e67e22;");
      console.log(`  listFiles:      ${tList.toFixed(0)}ms`);
      console.log(`  imports (限16): ${tImports.toFixed(0)}ms  (${importTasks.length} 模块)`);
      console.log(`  assemble:       ${tAssemble.toFixed(0)}ms`);
      console.groupEnd();
    }
  }
  getPackTranslation(str, index) {
    let translateMap = {
      legendSJZX: ["6星", "SJZXStar6"],
      epicSJZX: ["5星", "SJZXStar5"],
      rareSJZX: ["4星", "SJZXStar4"],
      normalSJZX: ["3星", "SJZXStar3"],
      especialSJZX: ["2星", "SJZXStar2"],
      mediocreSJZX: ["1星", "SJZXStar1"],
      plotSJZX: ["剧情", "SJZXPlot"],
      specialSJZX: ["特殊", "SJZXSpecial"]
    };
    return translateMap[str][index ? index : 0];
  }
  setNamePrefix(obj) {
    const layout = {
      amiya: {
        color: "#191970",
        nature: "woodmm"
      }
    };
    const defaultColor = {
      color: "#00FFFF",
      nature: "woodmm"
    };
    if (typeof obj === "string") {
      obj = {
        name: obj,
        ...defaultColor
      };
    }
    if (layout[obj.layout]) {
      obj = {
        name: obj.name,
        ...layout[obj.layout]
      };
    }
    lib.namePrefix.set(obj.name, {
      color: obj.color,
      nature: obj.nature
    });
    return obj;
  }
  /**
   * 为allCharacters和allSkills添加数据
   */
  register() {
    const characters = this._hooks.getHooks("character");
    const skills = this._hooks.getHooks("skill");
    const knownChars = new Set(window.whichWaySave.allCharacters);
    for (const char of characters) {
      const name = char.key;
      if (!knownChars.has(name)) {
        knownChars.add(name);
        window.whichWaySave.allCharacters.push(name);
      }
    }
    const knownSkills = new Set(window.whichWaySave.allSkills);
    for (const skill of skills) {
      const name = skill.key;
      if (!knownSkills.has(name)) {
        knownSkills.add(name);
        window.whichWaySave.allSkills.push(name);
      }
    }
  }
  pendingRun = [];
  _addedGroup = false;
  _hooks = packHooks;
}
const whichWayPackManager = new WhichWayPackManager();
await whichWayPackManager.init();
window.whichWay.register("packManager", whichWayPackManager);
onSetDev({
  name: "whichWayPackManager_Dev",
  fn: () => {
    window.whichWayPackManager = whichWayPackManager;
  }
});
export {
  whichWayPackManager
};
