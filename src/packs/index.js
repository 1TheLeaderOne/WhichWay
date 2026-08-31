import __variableDynamicImportRuntimeHelper from "../../_virtual/dynamic-import-helper.js";
import { lib, get } from "noname";
import { whichWayFile } from "../file.js";
import { onSetDev, onBeforeInit } from "../hooks/index.js";
import { pendingRun, registerExecute, packHooks } from "./hooks.js";
import { initCharConfig } from "../character/extCharConfig.js";
import { designer, getDesigner } from "../character/index.js";
import { whichWayUtil } from "../utill.js";
import { groupData } from "../character/groups.js";
import { whichWayArknight } from "../arknight/index.js";
class WhichWayPackManager {
  static CHARACTER_PACKS = [
    "epicSJZX",
    "legendSJZX",
    "especialSJZX",
    "plotSJZX",
    "specialSJZX",
    "rareSJZX",
    "mediocreSJZX",
    "normalSJZX"
  ];
  /**
   * 初始化
   */
  async init() {
    this.pendingRun = pendingRun;
    await this.initCharacterPack();
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
    const { files, folders } = await whichWayFile.getFileTree("src:packs/character/");
    for (const file of files) {
      const name = whichWayFile.removeExt(file.name);
      if (!name.endsWith("mrfz")) continue;
      await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({}), `./character/${name}.js`, 3);
    }
    for (const folder of folders) {
      if (!folder.name.endsWith("mrfz")) continue;
      for (const file of folder.files) {
        try {
          await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({}), `./character/${folder.name}/index.js`, 4);
        } catch (e) {
          await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./character/Castle3mrfz/index.ts": () => import("./character/Castle3mrfz/index.js"), "./character/Christinemrfz/index.ts": () => import("./character/Christinemrfz/index.js"), "./character/Lancet2mrfz/index.ts": () => import("./character/Lancet2mrfz/index.js"), "./character/PhonoR0mrfz/index.ts": () => import("./character/PhonoR0mrfz/index.js"), "./character/THRMEXmrfz/index.ts": () => import("./character/THRMEXmrfz/index.js"), "./character/acemrfz/index.ts": () => import("./character/acemrfz/index.js"), "./character/aibulanamrfz/index.ts": () => import("./character/aibulanamrfz/index.js"), "./character/aiguozhemrfz/index.ts": () => import("./character/aiguozhemrfz/index.js"), "./character/ailinimrfz/index.ts": () => import("./character/ailinimrfz/index.js"), "./character/ailisimrfz/index.ts": () => import("./character/ailisimrfz/index.js"), "./character/alannamrfz/index.ts": () => import("./character/alannamrfz/index.js"), "./character/amiyamrfz/index.ts": () => import("./character/amiyamrfz/index.js"), "./character/amrfz/index.ts": () => import("./character/amrfz/index.js"), "./character/anjielinamrfz/index.ts": () => import("./character/anjielinamrfz/index.js"), "./character/anzhelamrfz/index.ts": () => import("./character/anzhelamrfz/index.js"), "./character/ashmrfz/index.ts": () => import("./character/ashmrfz/index.js"), "./character/asikalunmrfz/index.ts": () => import("./character/asikalunmrfz/index.js"), "./character/bafanhailingmrfz/index.ts": () => import("./character/bafanhailingmrfz/index.js"), "./character/baidurenmrfz/index.ts": () => import("./character/baidurenmrfz/index.js"), "./character/baijinmrfz/index.ts": () => import("./character/baijinmrfz/index.js"), "./character/baimianxiaomrfz/index.ts": () => import("./character/baimianxiaomrfz/index.js"), "./character/baitiemrfz/index.ts": () => import("./character/baitiemrfz/index.js"), "./character/baocunzhemrfz/index.ts": () => import("./character/baocunzhemrfz/index.js"), "./character/bobumrfz/index.ts": () => import("./character/bobumrfz/index.js"), "./character/bohuimrfz/index.ts": () => import("./character/bohuimrfz/index.js"), "./character/caidumrfz/index.ts": () => import("./character/caidumrfz/index.js"), "./character/ceshimrfz/index.ts": () => import("./character/ceshimrfz/index.js"), "./character/chengfengmrfz/index.ts": () => import("./character/chengfengmrfz/index.js"), "./character/chengshanmrfz/index.ts": () => import("./character/chengshanmrfz/index.js"), "./character/chenmrfz/index.ts": () => import("./character/chenmrfz/index.js"), "./character/chizuimrfz/index.ts": () => import("./character/chizuimrfz/index.js"), "./character/chongyuemrfz/index.ts": () => import("./character/chongyuemrfz/index.js"), "./character/chuxuemrfz/index.ts": () => import("./character/chuxuemrfz/index.js"), "./character/cimeimrfz/index.ts": () => import("./character/cimeimrfz/index.js"), "./character/cuoemrfz/index.ts": () => import("./character/cuoemrfz/index.js"), "./character/daifeienmrfz/index.ts": () => import("./character/daifeienmrfz/index.js"), "./character/dekesasimrfz/index.ts": () => import("./character/dekesasimrfz/index.js"), "./character/dianhumrfz/index.ts": () => import("./character/dianhumrfz/index.js"), "./character/dibimrfz/index.ts": () => import("./character/dibimrfz/index.js"), "./character/docmrfz/index.ts": () => import("./character/docmrfz/index.js"), "./character/dongshimrfz/index.ts": () => import("./character/dongshimrfz/index.js"), "./character/doushitalulamrfz/index.ts": () => import("./character/doushitalulamrfz/index.js"), "./character/duoluoximrfz/index.ts": () => import("./character/duoluoximrfz/index.js"), "./character/elamrfz/index.ts": () => import("./character/elamrfz/index.js"), "./character/extratranslatemrfz/index.ts": () => import("./character/extratranslatemrfz/index.js"), "./character/feilaimrfz/index.ts": () => import("./character/feilaimrfz/index.js"), "./character/feiyameitamrfz/index.ts": () => import("./character/feiyameitamrfz/index.js"), "./character/fengchuanxiangzimrfz/index.ts": () => import("./character/fengchuanxiangzimrfz/index.js"), "./character/fengdimrfz/index.ts": () => import("./character/fengdimrfz/index.js"), "./character/fengwan_zhioumrfz/index.ts": () => import("./character/fengwan_zhioumrfz/index.js"), "./character/fengwanmrfz/index.ts": () => import("./character/fengwanmrfz/index.js"), "./character/friston3mrfz/index.ts": () => import("./character/friston3mrfz/index.js"), "./character/fulankamrfz/index.ts": () => import("./character/fulankamrfz/index.js"), "./character/gelaokesimrfz/index.ts": () => import("./character/gelaokesimrfz/index.js"), "./character/geleidiyamrfz/index.ts": () => import("./character/geleidiyamrfz/index.js"), "./character/guiyanmrfz/index.ts": () => import("./character/guiyanmrfz/index.js"), "./character/hadiyamrfz/index.ts": () => import("./character/hadiyamrfz/index.js"), "./character/haidimrfz/index.ts": () => import("./character/haidimrfz/index.js"), "./character/haimomrfz/index.ts": () => import("./character/haimomrfz/index.js"), "./character/hainimrfz/index.ts": () => import("./character/hainimrfz/index.js"), "./character/haojiaomrfz/index.ts": () => import("./character/haojiaomrfz/index.js"), "./character/hedeleimrfz/index.ts": () => import("./character/hedeleimrfz/index.js"), "./character/heijianmrfz/index.ts": () => import("./character/heijianmrfz/index.js"), "./character/heimrfz/index.ts": () => import("./character/heimrfz/index.js"), "./character/helagemrfz/index.ts": () => import("./character/helagemrfz/index.js"), "./character/hongmrfz/index.ts": () => import("./character/hongmrfz/index.js"), "./character/hongsunmrfz/index.ts": () => import("./character/hongsunmrfz/index.js"), "./character/hongxuemrfz/index.ts": () => import("./character/hongxuemrfz/index.js"), "./character/huangmrfz/index.ts": () => import("./character/huangmrfz/index.js"), "./character/huoerhaiyamrfz/index.ts": () => import("./character/huoerhaiyamrfz/index.js"), "./character/innamrfz/index.ts": () => import("./character/innamrfz/index.js"), "./character/jianmrfz/index.ts": () => import("./character/jianmrfz/index.js"), "./character/jiaxintamrfz/index.ts": () => import("./character/jiaxintamrfz/index.js"), "./character/jicimrfz/index.ts": () => import("./character/jicimrfz/index.js"), "./character/jingzhemrfz/index.ts": () => import("./character/jingzhemrfz/index.js"), "./character/jiushenmrfz/index.ts": () => import("./character/jiushenmrfz/index.js"), "./character/jixingmrfz/index.ts": () => import("./character/jixingmrfz/index.js"), "./character/kaierximrfz/index.ts": () => import("./character/kaierximrfz/index.js"), "./character/kaiselinmrfz/index.ts": () => import("./character/kaiselinmrfz/index.js"), "./character/kamimrfz/index.ts": () => import("./character/kamimrfz/index.js"), "./character/kanielianmrfz/index.ts": () => import("./character/kanielianmrfz/index.js"), "./character/keebomrfz/index.ts": () => import("./character/keebomrfz/index.js"), "./character/kelisitengmrfz/index.ts": () => import("./character/kelisitengmrfz/index.js"), "./character/kongxianmrfz/index.ts": () => import("./character/kongxianmrfz/index.js"), "./character/kuiyingmrfz/index.ts": () => import("./character/kuiyingmrfz/index.js"), "./character/laiousimrfz/index.ts": () => import("./character/laiousimrfz/index.js"), "./character/laiyimrfz/index.ts": () => import("./character/laiyimrfz/index.js"), "./character/landumrfz/index.ts": () => import("./character/landumrfz/index.js"), "./character/laolimrfz/index.ts": () => import("./character/laolimrfz/index.js"), "./character/leimiuanmrfz/index.ts": () => import("./character/leimiuanmrfz/index.js"), "./character/lindongmrfz/index.ts": () => import("./character/lindongmrfz/index.js"), "./character/linglanmrfz/index.ts": () => import("./character/linglanmrfz/index.js"), "./character/lingmrfz/index.ts": () => import("./character/lingmrfz/index.js"), "./character/linguangmrfz/index.ts": () => import("./character/linguangmrfz/index.js"), "./character/lingyinmrfz/index.ts": () => import("./character/lingyinmrfz/index.js"), "./character/lingzhimrfz/index.ts": () => import("./character/lingzhimrfz/index.js"), "./character/linmrfz/index.ts": () => import("./character/linmrfz/index.js"), "./character/linshimrfz/index.ts": () => import("./character/linshimrfz/index.js"), "./character/liumingmrfz/index.ts": () => import("./character/liumingmrfz/index.js"), "./character/longshelanmrfz/index.ts": () => import("./character/longshelanmrfz/index.js"), "./character/luogesimrfz/index.ts": () => import("./character/luogesimrfz/index.js"), "./character/lutuomrfz/index.ts": () => import("./character/lutuomrfz/index.js"), "./character/maennamrfz/index.ts": () => import("./character/maennamrfz/index.js"), "./character/maizhelunmrfz/index.ts": () => import("./character/maizhelunmrfz/index.js"), "./character/maluxiermrfz/index.ts": () => import("./character/maluxiermrfz/index.js"), "./character/medical_amiyamrfz/index.ts": () => import("./character/medical_amiyamrfz/index.js"), "./character/meiermrfz/index.ts": () => import("./character/meiermrfz/index.js"), "./character/midiexiangmrfz/index.ts": () => import("./character/midiexiangmrfz/index.js"), "./character/minermrfz/index.ts": () => import("./character/minermrfz/index.js"), "./character/mingjiaomrfz/index.ts": () => import("./character/mingjiaomrfz/index.js"), "./character/miumiumrfz/index.ts": () => import("./character/miumiumrfz/index.js"), "./character/mon3trmrfz/index.ts": () => import("./character/mon3trmrfz/index.js"), "./character/mositimamrfz/index.ts": () => import("./character/mositimamrfz/index.js"), "./character/mowangmrfz/index.ts": () => import("./character/mowangmrfz/index.js"), "./character/muouwuzhemrfz/index.ts": () => import("./character/muouwuzhemrfz/index.js"), "./character/muqianmrfz/index.ts": () => import("./character/muqianmrfz/index.js"), "./character/narentuyamrfz/index.ts": () => import("./character/narentuyamrfz/index.js"), "./character/nasitimrfz/index.ts": () => import("./character/nasitimrfz/index.js"), "./character/nengtianshimrfz/index.ts": () => import("./character/nengtianshimrfz/index.js"), "./character/nianmrfz/index.ts": () => import("./character/nianmrfz/index.js"), "./character/nifumrfz/index.ts": () => import("./character/nifumrfz/index.js"), "./character/niyanmrfz/index.ts": () => import("./character/niyanmrfz/index.js"), "./character/nuoweiermrfz/index.ts": () => import("./character/nuoweiermrfz/index.js"), "./character/palasimrfz/index.ts": () => import("./character/palasimrfz/index.js"), "./character/paxinghaomrfz/index.ts": () => import("./character/paxinghaomrfz/index.js"), "./character/peipeimrfz/index.ts": () => import("./character/peipeimrfz/index.js"), "./character/plot_keluxiermrfz/index.ts": () => import("./character/plot_keluxiermrfz/index.js"), "./character/puruisaisimrfz/index.ts": () => import("./character/puruisaisimrfz/index.js"), "./character/qiaojiakelifumrfz/index.ts": () => import("./character/qiaojiakelifumrfz/index.js"), "./character/qierchakemrfz/index.ts": () => import("./character/qierchakemrfz/index.js"), "./character/qinliumrfz/index.ts": () => import("./character/qinliumrfz/index.js"), "./character/qiubaimrfz/index.ts": () => import("./character/qiubaimrfz/index.js"), "./character/rendongmrfz/index.ts": () => import("./character/rendongmrfz/index.js"), "./character/ruoyemumrfz/index.ts": () => import("./character/ruoyemumrfz/index.js"), "./character/saileiyamrfz/index.ts": () => import("./character/saileiyamrfz/index.js"), "./character/sanjiaochuhuamrfz/index.ts": () => import("./character/sanjiaochuhuamrfz/index.js"), "./character/semrfz/index.ts": () => import("./character/semrfz/index.js"), "./character/senranmrfz/index.ts": () => import("./character/senranmrfz/index.js"), "./character/senximrfz/index.ts": () => import("./character/senximrfz/index.js"), "./character/shanjimrfz/index.ts": () => import("./character/shanjimrfz/index.js"), "./character/shanlingmrfz/index.ts": () => import("./character/shanlingmrfz/index.js"), "./character/shanmrfz/index.ts": () => import("./character/shanmrfz/index.js"), "./character/shendianmrfz/index.ts": () => import("./character/shendianmrfz/index.js"), "./character/shenxunmrfz/index.ts": () => import("./character/shenxunmrfz/index.js"), "./character/shijunzhemrfz/index.ts": () => import("./character/shijunzhemrfz/index.js"), "./character/shixiemrfz/index.ts": () => import("./character/shixiemrfz/index.js"), "./character/shuanghuamrfz/index.ts": () => import("./character/shuanghuamrfz/index.js"), "./character/shuangwangmrfz/index.ts": () => import("./character/shuangwangmrfz/index.js"), "./character/shuangyemrfz/index.ts": () => import("./character/shuangyemrfz/index.js"), "./character/shuidengxinmrfz/index.ts": () => import("./character/shuidengxinmrfz/index.js"), "./character/shuiyuemrfz/index.ts": () => import("./character/shuiyuemrfz/index.js"), "./character/shumrfz/index.ts": () => import("./character/shumrfz/index.js"), "./character/sikadimrfz/index.ts": () => import("./character/sikadimrfz/index.js"), "./character/siyemrfz/index.ts": () => import("./character/siyemrfz/index.js"), "./character/songtongmrfz/index.ts": () => import("./character/songtongmrfz/index.js"), "./character/spamiyamrfz/index.ts": () => import("./character/spamiyamrfz/index.js"), "./character/spchuxuemrfz/index.ts": () => import("./character/spchuxuemrfz/index.js"), "./character/spdegoumrfz/index.ts": () => import("./character/spdegoumrfz/index.js"), "./character/spfenmrfz/index.ts": () => import("./character/spfenmrfz/index.js"), "./character/spfurongmrfz/index.ts": () => import("./character/spfurongmrfz/index.js"), "./character/spheijiaomrfz/index.ts": () => import("./character/spheijiaomrfz/index.js"), "./character/sphemomrfz/index.ts": () => import("./character/sphemomrfz/index.js"), "./character/spjiaweiermrfz/index.ts": () => import("./character/spjiaweiermrfz/index.js"), "./character/spjicimrfz/index.ts": () => import("./character/spjicimrfz/index.js"), "./character/spjiexikamrfz/index.ts": () => import("./character/spjiexikamrfz/index.js"), "./character/spjingzhemrfz/index.ts": () => import("./character/spjingzhemrfz/index.js"), "./character/splapulandemrfz/index.ts": () => import("./character/splapulandemrfz/index.js"), "./character/splinguangmrfz/index.ts": () => import("./character/splinguangmrfz/index.js"), "./character/spnengtianshimrfz/index.ts": () => import("./character/spnengtianshimrfz/index.js"), "./character/spshihuaiyamrfz/index.ts": () => import("./character/spshihuaiyamrfz/index.js"), "./character/spsikadimrfz/index.ts": () => import("./character/spsikadimrfz/index.js"), "./character/spsongzangrenmrfz/index.ts": () => import("./character/spsongzangrenmrfz/index.js"), "./character/sptiaoxiangshimrfz/index.ts": () => import("./character/sptiaoxiangshimrfz/index.js"), "./character/spweicaomrfz/index.ts": () => import("./character/spweicaomrfz/index.js"), "./character/spweinamrfz/index.ts": () => import("./character/spweinamrfz/index.js"), "./character/spxiaoyangmrfz/index.ts": () => import("./character/spxiaoyangmrfz/index.js"), "./character/spxingxiongmrfz/index.ts": () => import("./character/spxingxiongmrfz/index.js"), "./character/spxingyuanmrfz/index.ts": () => import("./character/spxingyuanmrfz/index.js"), "./character/spyedaomrfz/index.ts": () => import("./character/spyedaomrfz/index.js"), "./character/spyinhuimrfz/index.ts": () => import("./character/spyinhuimrfz/index.js"), "./character/spyoulingshamrfz/index.ts": () => import("./character/spyoulingshamrfz/index.js"), "./character/spzzxpmrfz/index.ts": () => import("./character/spzzxpmrfz/index.js"), "./character/suocaomrfz/index.ts": () => import("./character/suocaomrfz/index.js"), "./character/suxinmrfz/index.ts": () => import("./character/suxinmrfz/index.js"), "./character/talaidingzhenmrfz/index.ts": () => import("./character/talaidingzhenmrfz/index.js"), "./character/tekenuomrfz/index.ts": () => import("./character/tekenuomrfz/index.js"), "./character/teleixisimrfz/index.ts": () => import("./character/teleixisimrfz/index.js"), "./character/teleixiyamrfz/index.ts": () => import("./character/teleixiyamrfz/index.js"), "./character/tianhuomrfz/index.ts": () => import("./character/tianhuomrfz/index.js"), "./character/tiankonghemrfz/index.ts": () => import("./character/tiankonghemrfz/index.js"), "./character/tifengmrfz/index.ts": () => import("./character/tifengmrfz/index.js"), "./character/titimrfz/index.ts": () => import("./character/titimrfz/index.js"), "./character/wanqingmrfz/index.ts": () => import("./character/wanqingmrfz/index.js"), "./character/weinamrfz/index.ts": () => import("./character/weinamrfz/index.js"), "./character/weishidaiermrfz/index.ts": () => import("./character/weishidaiermrfz/index.js"), "./character/weiweiannamrfz/index.ts": () => import("./character/weiweiannamrfz/index.js"), "./character/wendimrfz/index.ts": () => import("./character/wendimrfz/index.js"), "./character/wenmimrfz/index.ts": () => import("./character/wenmimrfz/index.js"), "./character/wmrfz/index.ts": () => import("./character/wmrfz/index.js"), "./character/wuerbianmrfz/index.ts": () => import("./character/wuerbianmrfz/index.js"), "./character/xiaguangmrfz/index.ts": () => import("./character/xiaguangmrfz/index.js"), "./character/xiangshimrfz/index.ts": () => import("./character/xiangshimrfz/index.js"), "./character/xiaomanmrfz/index.ts": () => import("./character/xiaomanmrfz/index.js"), "./character/xiaoyangmrfz/index.ts": () => import("./character/xiaoyangmrfz/index.js"), "./character/xielvmrfz/index.ts": () => import("./character/xielvmrfz/index.js"), "./character/xierdamrfz/index.ts": () => import("./character/xierdamrfz/index.js"), "./character/xigymrfz/index.ts": () => import("./character/xigymrfz/index.js"), "./character/xingjimrfz/index.ts": () => import("./character/xingjimrfz/index.js"), "./character/xingxiongmrfz/index.ts": () => import("./character/xingxiongmrfz/index.js"), "./character/xingyuanmrfz/index.ts": () => import("./character/xingyuanmrfz/index.js"), "./character/xingzhumrfz/index.ts": () => import("./character/xingzhumrfz/index.js"), "./character/xinyangjiaobanjimrfz/index.ts": () => import("./character/xinyangjiaobanjimrfz/index.js"), "./character/xirenmrfz/index.ts": () => import("./character/xirenmrfz/index.js"), "./character/xiyinmrfz/index.ts": () => import("./character/xiyinmrfz/index.js"), "./character/xueliemrfz/index.ts": () => import("./character/xueliemrfz/index.js"), "./character/xunlanmrfz/index.ts": () => import("./character/xunlanmrfz/index.js"), "./character/yanweimrfz/index.ts": () => import("./character/yanweimrfz/index.js"), "./character/yaxinmrfz/index.ts": () => import("./character/yaxinmrfz/index.js"), "./character/yelamrfz/index.ts": () => import("./character/yelamrfz/index.js"), "./character/yemomrfz/index.ts": () => import("./character/yemomrfz/index.js"), "./character/yeyingmrfz/index.ts": () => import("./character/yeyingmrfz/index.js"), "./character/yifulitemrfz/index.ts": () => import("./character/yifulitemrfz/index.js"), "./character/yindelaiximrfz/index.ts": () => import("./character/yindelaiximrfz/index.js"), "./character/yineisimrfz/index.ts": () => import("./character/yineisimrfz/index.js"), "./character/yinhuimrfz/index.ts": () => import("./character/yinhuimrfz/index.js"), "./character/yintuoluomrfz/index.ts": () => import("./character/yintuoluomrfz/index.js"), "./character/yizumikemrfz/index.ts": () => import("./character/yizumikemrfz/index.js"), "./character/youtiansiruomaimrfz/index.ts": () => import("./character/youtiansiruomaimrfz/index.js"), "./character/yuanyamrfz/index.ts": () => import("./character/yuanyamrfz/index.js"), "./character/yueyuemrfz/index.ts": () => import("./character/yueyuemrfz/index.js"), "./character/yumaobimrfz/index.ts": () => import("./character/yumaobimrfz/index.js"), "./character/yumrfz/index.ts": () => import("./character/yumrfz/index.js"), "./character/yunjimrfz/index.ts": () => import("./character/yunjimrfz/index.js"), "./character/yunqingpingmrfz/index.ts": () => import("./character/yunqingpingmrfz/index.js"), "./character/yunxingmrfz/index.ts": () => import("./character/yunxingmrfz/index.js"), "./character/zaolumrfz/index.ts": () => import("./character/zaolumrfz/index.js"), "./character/zhanchemrfz/index.ts": () => import("./character/zhanchemrfz/index.js"), "./character/zhenyanmrfz/index.ts": () => import("./character/zhenyanmrfz/index.js"), "./character/zheyamrfz/index.ts": () => import("./character/zheyamrfz/index.js"), "./character/zhisongmrfz/index.ts": () => import("./character/zhisongmrfz/index.js"), "./character/zhuhuangmrfz/index.ts": () => import("./character/zhuhuangmrfz/index.js"), "./character/ziyeyaomrfz/index.ts": () => import("./character/ziyeyaomrfz/index.js"), "./character/zuolemrfz/index.ts": () => import("./character/zuolemrfz/index.js") }), `./character/${folder.name}/index.ts`, 4);
        }
      }
    }
    this.register();
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
      whichWayArknight.addShcema(name);
      whichWayArknight.initCharArknight(char);
      return char;
    });
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
    for (const char of characters) {
      const name = char.key;
      if (!window.whichWaySave.allCharacters.includes(name)) {
        window.whichWaySave.allCharacters.push(name);
      }
    }
    for (const skill of skills) {
      const name = skill.key;
      if (!window.whichWaySave.allSkills.includes(name)) {
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
//# sourceMappingURL=index.js.map
