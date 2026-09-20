import { get as e, lib as g } from "noname";
import { whichWayUtil as m } from "./utill-DpF3UCI4.js";
import { registerHookContextAt as p, onConfig as c, onSetDev as y } from "./hooks-BscfO9lD.js";
const s = {
  persona: {
    group: "女",
    sort: "联动-女神异闻录",
    reallyGroup: "persona",
    logo: "persona",
    filter: !1
  },
  suimrfz: {
    group: "岁",
    sort: "炎国-岁兽",
    reallyGroup: "sui",
    logo: "sui"
  },
  luomrfz: {
    group: "罗",
    sort: "罗德岛",
    reallyGroup: "rhodes",
    logo: "rhodes"
  },
  xiemrfz: {
    group: "谢",
    sort: "谢拉格",
    reallyGroup: "karlan",
    logo: "karlan"
  },
  bamrfz: {
    group: "巴",
    sort: "卡兹戴尔-巴别塔",
    reallyGroup: "babel",
    logo: "babel"
  },
  yimrfz: {
    group: "伊",
    sort: "伊比利亚",
    reallyGroup: "iberia",
    logo: "iberia"
  },
  laimrfz: {
    group: "莱",
    sort: "莱塔尼亚",
    reallyGroup: "leithanien",
    logo: "leithanien"
  },
  xumrfz: {
    group: "叙",
    sort: "叙拉古",
    reallyGroup: "siracusa",
    logo: "siracusa"
  },
  haimrfz: {
    group: "海",
    sort: "海嗣",
    reallyGroup: "egir",
    logo: "egir"
  },
  liemrfz: {
    group: "深",
    sort: "深海猎人",
    reallyGroup: "abyssal",
    logo: "abyssal"
  },
  qimrfz: {
    group: "企",
    sort: "企鹅物流",
    reallyGroup: "penguin",
    logo: "penguin"
  },
  kamrfz: {
    group: "卡",
    sort: "卡西米尔",
    reallyGroup: "kazimierz",
    logo: "kazimierz"
  },
  gemrfz: {
    group: "哥",
    sort: "哥伦比亚",
    reallyGroup: "columbia",
    logo: "columbia"
  },
  longmrfz: {
    group: "龙",
    sort: "炎国-龙门",
    reallyGroup: "lgd",
    logo: "lgd"
  },
  weimrfz: {
    group: "维",
    sort: "维多利亚",
    reallyGroup: "victoria",
    logo: "victoria"
  },
  lamrfz: {
    group: "拉",
    sort: "拉特兰",
    reallyGroup: "laterano",
    logo: "laterano"
  },
  shimrfz: {
    group: "使",
    sort: "使徒",
    reallyGroup: "followers",
    logo: "followers"
  },
  wumrfz: {
    group: "乌",
    sort: "乌萨斯",
    reallyGroup: "ursus",
    logo: "ursus"
  },
  samrfz: {
    group: "萨",
    sort: "萨尔贡",
    reallyGroup: "sargon",
    logo: "sargon"
  },
  othermrfz: {
    group: "联",
    sort: "联动",
    reallyGroup: "rainbow",
    logo: "rainbow"
  },
  yanmrfz: {
    group: "炎",
    sort: "炎国",
    reallyGroup: "yan",
    logo: "yan"
  },
  limrfz: {
    group: "鲤",
    sort: "炎-龙门-鲤氏侦探事务所",
    reallyGroup: "lee",
    logo: "lee"
  },
  ximrfz: {
    group: "汐",
    sort: "汐斯塔",
    reallyGroup: "siesta",
    logo: "siesta"
  },
  hongmrfz: {
    group: "红",
    sort: "卡西米尔-红松骑士团",
    reallyGroup: "pinus",
    logo: "pinus"
  },
  dongmrfz: {
    group: "东",
    sort: "东国",
    reallyGroup: "higashi",
    logo: "higashi"
  },
  lymrfz: {
    group: "茵",
    sort: "哥伦比亚-莱茵生命",
    reallyGroup: "rhine",
    logo: "rhine"
  },
  shenmrfz: {
    group: "深",
    sort: "深池",
    reallyGroup: "tara",
    logo: "tara"
  },
  //前文明在明日方舟里没有对应势力，不配真实势力与图标（角色卡回退为显示势力文字）
  qianmrfz: {
    group: "前",
    sort: "前文明"
  },
  mimrfz: {
    group: "诺",
    sort: "米诺斯",
    reallyGroup: "minos",
    logo: "minos"
  },
  samimrfz: {
    group: "米",
    sort: "萨米",
    reallyGroup: "sami",
    logo: "sami"
  },
  //同上：整合运动在 image/camplogo/arknight 里没有对应图标
  zhmrfz: {
    group: "整",
    sort: "整合运动"
  },
  leimrfz: {
    group: "雷",
    sort: "雷姆必拓",
    reallyGroup: "rim",
    logo: "rim"
  },
  bomrfz: {
    group: "玻",
    sort: "玻利瓦尔",
    reallyGroup: "bolivar",
    logo: "bolivar"
  },
  //同上：卡兹戴尔相关（军事委员会 / 卡兹戴尔）没有独立图标，巴别塔另有 bamrfz
  junmrfz: {
    group: "军",
    sort: "卡兹戴尔-军事委员会"
  },
  kaizidaiermrfz: {
    group: "卡",
    sort: "卡兹戴尔"
  },
  a_groupmrfz: {
    group: "阿",
    sort: "阿戈尔",
    reallyGroup: "abyssal",
    logo: "abyssal"
  }
}, X = (r, n, a) => (a ? s[a] ?? Object.values(s).find((o) => o.reallyGroup === a || o.logo === a) : void 0) ?? s[r] ?? Object.values(s).find((o) => !!o.reallyGroup && o.reallyGroup === n), d = {
  tongmaimrfz: function(r) {
    let n = "你可以令一名深海猎人的角色回复一点体力或复原武将牌", a = r.storage.tongmaimrfz;
    return a || (a = []), a.includes(0) && (n = n.replace(
      "回复一点体力",
      "<font color=#696969>回复一点体力</font>"
    )), a.includes(1) && (n = n.replace(
      "复原武将牌",
      "<font color=#696969>复原武将牌</font>"
    )), `宗族技，每轮每项限一次，当你于回合外造成伤害后，${n}。`;
  },
  chonggoumrfz: function(r) {
    return r.storage.chonggoumrfz ? "摸牌阶段开始时，若你的手牌数不小于你的体力值，你可以弃置所有手牌，回复一点体力，然后摸X张牌。（X=弃置牌的数量）" : "摸牌阶段开始时，若你的手牌数不小于你的体力值<span class=thundertext>且已受伤</span>，你可以弃置所有手牌，回复一点体力，然后摸X张牌。（X=弃置牌的数量<span class=thundertext>-已损失体力值</span>）";
  },
  kuanmrfz: function(r) {
    return r.storage.kuanmrfz ? "锁定技，游戏开始时，你废除所有装备栏和判定区并摸3张牌）；你可以将装备牌当【杀】、【闪】或【酒】使用或打出，你的装备牌不计入手牌上限。" : "锁定技，游戏开始时，你废除所有装备栏和判定区并摸3张牌<span class=thundertext>；判定阶段，你依次进行【乐不思蜀】和【兵粮寸断】的判定</span>；你可以将装备牌当【杀】、【闪】或【酒】使用或打出，你的装备牌不计入手牌上限。";
  },
  zhuguangmrfz: function(r) {
    return r.storage.zhuguangmrfz_change ? "准备阶段，你可以选择一名角色，视为对其使用【决斗】且此牌不可被其他角色响应，当你因此牌对其他角色造成伤害时，你可以选择一项：①删除【苦暗】描述中蓝色的文字；②摸两张牌。" : "准备阶段，你可以选择一名角色，视为对其使用【决斗】，当你因此牌对其他角色造成伤害时，你可以防止此伤害，然后选择一项：①删除【苦暗】描述中蓝色的文字；②修改【逐光】的描述；③摸一张牌。";
  },
  shuoguangmrfz: function(r) {
    return r.storage.shuoguangmrfz ? "<font color=#696969>锁定技，你跳过你的第一个弃牌阶段。</font>" : "锁定技，你跳过你的第一个弃牌阶段。";
  },
  xunlumrfz: function(r) {
    return "锁定技，摸牌阶段，你改为随机摸<span class=thundertext>" + r.storage.xunlumrfz_draw + "</span>至6张牌；准备阶段，你将本回合出牌阶段使用【杀】的基数随机改为<span class=firetext>" + r.storage.xunlumrfz_sha + "</span>至5次；你的手牌上限随机改为<span class=greentext>" + r.storage.xunlumrfz_h + "</span>至8张。当你造成伤害时，你可以令一个有颜色的数字+1。（有颜色的数字的最大值至多为4，且本技能中的随机生成的随机数均符合正态分布）";
  },
  chaoshengmrfz: function(r) {
    return r.countMark("jianshumrfz") == 15 ? "结束阶段，若你连续<span class=thundertext>1</span>个回合没有造成过伤害，你可以摸两张牌并回复一点体力。" : "结束阶段，若你连续<span class=thundertext>" + r.countMark("jianshumrfz") >= 10 && r.countMark("jianshumrfz") < 15 ? "2" : 3 - Math.floor(r.countMark("jianshumrfz") / 5) + "</span>个回合没有造成过伤害，你可以选择摸两张牌或回复一点体力。";
  },
  heishimrfz: function(r) {
    return r.hasSkill("junumrfz_effect") ? "锁定技，你的【杀】无视防具；你对有防具的角色造成的伤害+1，对与你距离小于等于3的角色造成的伤害+1。" : "锁定技，你的使用的【杀】仅能指定与你距离不大于2的角色为目标，你的【杀】无视防具；你对有防具的角色造成的伤害+1，对与你距离为1的角色造成的伤害+1。";
  },
  xuezhanmrfz: function(r) {
    return r.storage.xuezhanmrfz ? "<font color=#696969>锁定技，当你首次即将死亡时，取消之，然后你将体力值和体力上限调整至2，并摸4张牌。</font>" : "锁定技，当你首次即将死亡时，取消之，然后你将体力值和体力上限调整至2，并摸4张牌。";
  },
  dunpaomrfz: function(r) {
    return r.storage.dunpaomrfz ? "锁定技，你的手牌上限+2。" : "锁定技，你的攻击范围+5，你不能指定与你距离为1的角色为目标；当你使用【杀】对距离你大于1的角色造成伤害时，该角色进行判断，若不为红色，此伤害+1；回合开始时，你可以修改此技能。";
  },
  biaohaomrfz: function(r) {
    return "蓄力技（<font color=#e00500>" + r.countMark("charge") + "</font>/4），出牌阶段限两次，你可以弃置一张带有伤害类标签的牌，然后你增加一点蓄力值；你可以按照下列规则消耗蓄力值：①：消耗1点蓄力值，视为使用一张【杀】；②：出牌阶段，消耗4点蓄力值，视为使用三张【杀】和一张【万箭齐发】，然后失去3点体力。";
  },
  dianjingmrfz: function(r) {
    return r.storage.dianjingmrfz ? "转换技，当你使用转化牌时，你可以从牌堆中获得与你使用的转化牌的<font color=#696969>阳:牌名相同；</font><span class=thundertext>阴:类型相同</span>的牌。" : "转换技，当你使用转化牌时，你可以从牌堆中获得与你使用的转化牌的<span class=thundertext>阳:牌名相同</span><font color=#696969>；阴:类型相同</font>的牌。";
  },
  yongwomrfz: function(r) {
    return r.isTurnedOver() ? "①锁定技，<span class=thundertext>当你武将牌背面朝上时，你获得如下效果:1.当你的上家或下家使用牌后，其须弃置一张牌，其每累计因此弃置两张牌，你对其造成一点伤害，然后你可以选择将你的武将牌翻面；2.其他角色计算与你的距离+1；</span><font color=#696969>当你的武将牌正面朝上时，你获得如下效果：1.当你于一轮内首次进入濒死状态时，你将体力值回复至1，然后将你的武将牌翻面；2.任意角色的回合结束阶段，若你本回合受到或造成了伤害，你可以将你的武将牌翻面。</font>②锁定技，当你翻面至正面朝上时，你摸两张牌。" : "①锁定技，<font color=#696969>当你武将牌背面朝上时，你获得如下效果:1.当你的上家或下家使用牌后，其须弃置一张牌，其每累计因此弃置两张牌，你对其造成一点伤害，然后你可以选择将你的武将牌翻面；2.其他角色计算与你的距离+1；</font><span class=thundertext>当你的武将牌正面朝上时，你获得如下效果：1.当你于一轮内首次进入濒死状态时，你将体力值回复至1，然后将你的武将牌翻面；2.任意角色的回合结束阶段，若你本回合受到或造成了伤害，你可以将你的武将牌翻面。</span>②锁定技，当你翻面至正面朝上时，你摸两张牌。";
  },
  yuechuimrfz: function(r) {
    var n = r.countMark("yuechuimrfz") > 0 ? r.countMark("yuechuimrfz") : 1;
    return `当你使用【杀】后，你可以摸[ ${n} ]张牌，然后你可以选择依次执行下列任意个效果:<br>1.弃置一张装备牌，令[]中的数字+1（至多为3）;<br>2.对与其距离为1的一名其他角色造成一点伤害。`;
  },
  zhenzamrfz: function(r) {
    return "①锁定技，游戏开始时你获得一个‘壁’标记；当有角色获得‘壁’标记时，若其没有护甲，其获得一点护甲；每轮各限两次，每名角色的准备阶段(<span class=thundertext>已发动:" + (r.hasMark("zhenzamrfz_time1") ? r.countMark("zhenzamrfz_time1") : 0) + "次</span>)或有其他角色因你造成的伤害而进入濒死状态时(<span class=thundertext>已发动:" + (r.hasMark("zhenzamrfz_time2") ? r.countMark("zhenzamrfz_time2") : 0) + "次</span>)，若你没有‘壁’标记，你获得一个‘壁’标记。②有‘壁’标记的角色受到伤害后，若其因此伤害触发过护甲且没有护甲，其可以随机获得攻击范围内一名其他角色的" + (r.storage.liuliemrfz ? "两" : "一") + "张牌并对其造成一点伤害。";
  },
  yiyinmrfz: function(r) {
    return "①蓄力技（" + r.countMark("charge") + "/3），出牌阶段，你可以弃置一张带有伤害类标签的牌，然后增加一点蓄力值。②当你使用【杀】的时，你可以消耗一点蓄力值并令此【杀】的伤害基数+1。";
  },
  kuangyumrfz: function(r) {
    return r.storage.kuangyumrfz ? "每回合每名角色限一次，当你使用单一目标的锦囊牌指定其他角色为目标后，若该角色没有‘风起’标志，你可以使其获得一个“风起”标记（持续到其回合结束），且令其下回合随机跳过两个阶段，若该角色在你的攻击范围内，其于此牌结算完成之前，你对有‘风起’标记的角色造成的伤害+1。" : "每回合每名角色限一次，当你使用单一目标的普通锦囊牌或【杀】指定其他角色为目标后，若该角色没有‘风起’标志，你可以使其获得一个“风起”标记（持续到其回合结束），且令其下回合随机跳过两个阶段，若该角色在你的攻击范围内，其于此牌结算完成之前，你对有‘风起’标记的角色造成的伤害+1，然后若对其造成了伤害，你修改【狂语】直到下一轮开始。";
  },
  amy_qingyanmrfz: function(r) {
    for (var n = "①锁定技，", a = "。②出牌阶段结束时，你可以删除【青焱①】中[]、{}或（）的内容直到本轮结束，然后令一名其他角色获得你删除的内容的效果直到其回合结束。", o = "", f = [r.storage.amy_qingyanmrfz_damage, r.storage.amy_qingyanmrfz_time, r.storage.amy_qingyanmrfz_direct], t = [
      '<span style="text-decoration:line-through">{你每回合使用的第一张【杀】的伤害基数+1},</span>',
      '<span style="text-decoration:line-through">[你使用【杀】的次数+1],</span>',
      '<span style="text-decoration:line-through">(你使用的【杀】需要两张【闪】才可抵消),</span>'
    ], z = ["{你每回合使用的第一张【杀】的伤害基数+1},", "[你使用【杀】的次数+1],", "(你使用的【杀】需要两张【闪】才可抵消),"], u = 0; u < f.length; u++)
      f[u] ? o = o + t[u] : o = o + z[u];
    return n + o + a;
  },
  xinyongwomrfz: function(r) {
    return r.storage.xinyongwomrfz ? "转换技，<span class=thundertext>阳：当你进入濒死状态时，你可以回复至一点体力；</span><font color=#696969>阴：当你武将牌从正面朝上至背面朝上时，你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害。</font>" : "转换技，<font color=#696969>阳：当你进入濒死状态时，你可以回复至一点体力；</font><span class=thundertext>阴：当你武将牌从正面朝上至背面朝上时，你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害。</span>";
  },
  chongdanmrfz: function(r) {
    var n = "";
    return r.storage.chongdanmrfz && r.storage.chongdanmrfz_player ? n = "<font color=#696969>造成</font>/<font color=#696969>受到</font>" : r.storage.chongdanmrfz && !r.storage.chongdanmrfz_player ? n = "<font color=#696969>造成</font>/受到" : r.storage.chongdanmrfz_player && !r.storage.chongdanmrfz ? n = "造成/<font color=#696969>受到</font>" : n = "造成/受到", "锁定技，每轮你至多能使用2X张牌；每轮每项限一次你第一次[" + n + "]伤害后，你摸等同于你体力值张牌或回复等同你手牌数点体力。（X=你的体力上限）";
  },
  tianyimrfz: function(r) {
    return r.storage.tianyimrfz ? "转换技，一名角色的判定阶段，你可以，<span class=thundertext>阳：观看牌堆顶两张牌，并将其置于牌堆顶或牌堆底；</span><font color=#696969>阴：进行一次判定，并获得判定牌，本回合此牌视为【闪】，若判定结果为♣，你本局游戏使用【杀】的次数+1（至多+3）。</font>" : "转换技，一名角色的判定阶段，你可以，<font color=#696969>阳：观看牌堆顶两张牌，并将其置于牌堆顶或牌堆底；</span><span class=thundertext>阴：进行一次判定，并获得判定牌，本回合此牌视为【闪】，若判定结果为♣，你本局游戏使用【杀】的次数+1（至多+3）。</font>";
  },
  yirenmrfz: function(r) {
    return "蓄力技（<span class=thundertext>" + (r.countMark("charge") != null ? r.countMark("charge") : 0) + "</span>/∞）。①锁定技，回合结束时，你增加X点蓄力值。（X=本回合出牌阶段剩余使用【杀】的次数）②出牌阶段，你可以消耗[<span class=thundertext> " + (r.storage.yirenmrfz_use != null ? Math.min(r.storage.yirenmrfz_use, 5) : 1) + " </span>]点蓄力值，弃置两张手牌并选择至多两名其他角色，视为你对其各使用一张【杀】（目标必须合法且不计入次数限制）且其下个回合使用【杀】的次数-1，然后令[ ]中的数字+1（至多为5）。";
  },
  xujimrfz: function(r) {
    var n = r.storage.shiyumrfz_buff;
    return n || (n = 0), "弃牌阶段开始时，若你本回合出牌阶段没有使用牌指定其他角色为目标，你可以令你下一张【杀】的伤害基数+1，然后你的手牌上限+5且选择一项:1.摸[ " + (2 + n) + " ]张牌；2.使用一张【杀】且此杀需要[ " + (2 + n) + " ]张【闪】才可抵消。";
  },
  suijiamrfz: function(r) {
    var n = r.storage?.suijiamrfz?.del, a = r.storage?.suijiamrfz?.damage;
    return "锁定技，当你造成伤害时" + (n == !0 ? "" : "，[ 若其有护甲 ]，则") + "，此伤害+{ " + (1 + a || 1) + " }。";
  },
  yxliumingmrfz: function(r) {
    var n = r.hasSkill("yxliumingmrfz_ban");
    return n ? "①锁定技，游戏开始时或一名角色的回合开始时，若你武将牌上没有‘铭’，你将牌堆顶的一张牌置于你的武将牌上，称之为‘铭’。<font color=#696969>②锁定技，当你成为其他角色使用的牌的目标后，若此牌[花色/点数]与‘铭’[相同/不同]，则[你获得武将牌上的‘铭’/此牌对你无效，然后你失去此技能直到当前回合结束]。</font>③你可以使用‘铭’。" : "①锁定技，游戏开始时或一名角色的回合开始时，若你武将牌上没有‘铭’，你将牌堆顶的一张牌置于你的武将牌上，称之为‘铭’。②锁定技，当你成为其他角色使用的牌的目标后，若此牌[花色/点数]与‘铭’[相同/不同]，则[你获得武将牌上的‘铭’/此牌对你无效，然后你失去此技能直到当前回合结束]。③你可以使用‘铭’。";
  },
  lianmangmrfz: function(r) {
    var n = "锁定技。<br>①当你成为其他角色使用牌的目标后，你重铸至多X张牌（X=此牌牌名的字数），若你：1.因此重铸了带有伤害类标签的牌，你摸一张牌；2.因此重铸了所有手牌，对使用者造成一点伤害，然后你不能使用或打出手牌直到此牌结算完毕或你进入濒死状态。<br>②当你造成伤害时，你改为令你回复等量体力或摸等量的牌。";
    return r.hasSkill("zhanmangmrfz_ban") ? "<font color=#696969>" + n + "</font>" : n;
  },
  zhuixiongmrfz: function(r) {
    return `出牌阶段限${r.hasSkill("yinhumrfz_addcount") ? "两" : "一"}次，你可以视为对一名在你攻击范围内的其他角色使用一张不可被【无懈可击】响应的【决斗】，此决斗的造成的伤害+Y（Y=因此决斗而打出的【杀】）。`;
  },
  dichenmrfz(r) {
    let a = (r.storage.dichenmrfz || [1, 2, 3, 4]).length, o = [
      "<br>1.弃置判定区所有牌",
      "<br>2.摸两张牌",
      "<br>3.回复一点体力并在其回合结束时获得Y张【影】（Y=5-其手牌数）",
      "<br>4.复原武将牌"
    ], f = o.map((z) => z.slice(6)), t = "出牌阶段限一次，你可以令一名攻击范围内的角色或你依次执行至第X项:";
    return t += o.slice(0, a).join("；"), a !== 4 && (t += "、"), t += f.slice(a).join("、"), t += "，然后将此项并入上一项。<br>(X=你的攻击距离-你与其的距离+1)", t;
  },
  sanyanmrfz: function(r) {
    let n = [
      "任意角色的回合结束时，其每满足下列一项你便摸两张牌并删除此项直到本轮结束：",
      "1.回复过体力值；",
      "2.使用过装备牌；",
      "3.获得过牌。",
      "然后你可以令至多X名其他角色摸一张牌。（X=满足的项数）"
    ];
    if (!r?.storage?.sanyanmrfz) return n.join("<br>");
    let a = r.storage.sanyanmrfz;
    return a.includes("recover") || (n[1] = `<s>${n[1]}</s>`), a.includes("useCard") || (n[2] = `<s>${n[2]}</s>`), a.includes("gain") || (n[3] = `<s>${n[3]}</s>`), n.join("<br>");
  },
  qiancimrfz(r) {
    return `出牌阶段限${e.cnNumber((r.storage.qiancimrfz || 0) + 1)}次，你可以将一张手牌交给一名其他角色，并展示其三张手牌，对其造成X点伤害，然后若你因此:<br>1.造成了伤害，你回复一点体力；<br>2.杀死了一名角色，你令本技能出牌阶段可发动的次数+1。<br>（X=展示的牌中伤害类牌的数量）`;
  },
  youlinmrfz(r) {
    return `出牌阶段限${r.hasSkill("youlinmrfz_addCount") ? "两" : "一"}次，你可以展示M张手牌并展示N张牌堆顶的牌（M+N=3），选择至多三名角色，然后根据你展示的牌这些角色执行对应的选项并获得X-M个“沫”标记：<br>1.点数均不同：获得一点护甲;<br>2.花色均不同：摸X张牌;<br>3.类型均不同：本技能本阶段改成“出牌阶段限两次”。（X=执行的选项数）`;
  },
  tiandingmrfz(r) {
    let n = r.getHistory("useSkill", (o) => o.skill === "tiandingmrfz").length, a = r.storage.tiandingmrfz || 2;
    return `每回合限${e.cnNumber(a)}次(已使用<font color="red">${e.cnNumber(n)}</font>次)，每个阶段开始时，你可以进行一次判定并获得判定牌，若判定牌为红，你本回合使用【杀】的次数和攻击距离+1且本技能本回合发动次数+1，反之你跳过此阶段。`;
  },
  wozhimrfz(r) {
    return e.skillInfoTranslation(r.storage.zhanyemrfz ? "wozhimrfz_rewrite" : "wozhimrfz");
  },
  guishimrfz(r) {
    return e.skillInfoTranslation(r.storage.zhanyemrfz ? "guishimrfz_rewrite" : "guishimrfz");
  },
  tanxianmrfz(r) {
    let { draw: n, sha: a, attack: o } = r.storage.tanxianmrfz, f = `锁定技。<br>①你的额定摸牌数为#r${n}#;出牌阶段【杀】的使用次数+#r${a}#;你的基础攻击范围为#r${o}#;<br>②你的回合结束时，你令其中最大的数字-1，然后须重新分配此技能所有红色的数字。`;
    return m.colorize(f);
  },
  yulimrfz(r) {
    return r.storage.yulimrfz ? e.skillInfoTranslation("yulimrfz_rewirte") : e.skillInfoTranslation("yulimrfz");
  },
  sulimrfz(r) {
    return r.storage.yulimrfz ? "出牌阶段，你可以弃置至多两张本阶段未以此法弃置过的类型的牌,若这两张牌的类型均不为你手牌中唯一最多的类型,你摸X张牌。（X=你手牌中没有的类型的数量）" : e.skillInfoTranslation("sulimrfz");
  },
  juetumrfz(r) {
    let a = `出牌阶段限一次，你可以摸#r${r?.storage?.juetumrfz?.draw || 3}#张牌，并与一名其他角色进行拼点，没有赢的角色受到一点伤害，若你首次以该点数拼点获胜，本技能红色数字+1，反之若你没赢，本技能红色数字-1（红色数字至少为1）。`;
    return m.colorize(a);
  },
  lvmaimrfz(r) {
    let n = "转换技，当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为①♠︎②♣︎③♥︎④♦︎，你摸一张牌。";
    switch (r.storage.lvmaimrfz) {
      case 0:
        n = "转换技，当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为①♠︎#s②♣︎③♥︎④♦︎#，你摸一张牌。";
        break;
      case 1:
        n = "转换技，当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为#s①♠︎#②♣︎③#s♥︎④♦︎#，你摸一张牌。";
        break;
      case 2:
        n = "转换技，当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为#s①♠︎②♣︎#③♥︎#s④♦︎#，你摸一张牌。";
        break;
      case 3:
        n = "转换技，当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为#s①♠︎②♣︎③♥︎#④♦︎，你摸一张牌。";
        break;
    }
    return m.colorize(n);
  },
  wenchoumrfz(r) {
    return m.colorize(`你的任意阶段开始时，你可以重铸一张牌，若你重铸的牌是：<br>①【杀】或武器牌：令包含你在内的至多两名角色将手牌调整至#r${r?.storage?.wenchoumrfz || 4}#并跳过此阶段；<br>②非伤害类基本牌：你视为使用一张无距离和次数限制的【杀】，然后此技能本回合失效，并令此技能中的红色数字-1。`);
  },
  titimrfz_mingshimrfz(r) {
    return m.colorize(`转换技，${r.storage.titimrfz_mingshimrfz ? "#s阳：出牌阶段限一次#;#y阴：当你受到伤害后#" : "#r阳：出牌阶段限一次#;#s阴：当你受到伤害后#"}。你可以展示手牌，并使用其中一张普通锦囊牌，你因此使用的普通锦囊牌额外结算Y次。（Y=你手牌中普通锦囊牌的数量）`);
  }
}, h = {
  林登万: ["linshimrfz", "zuolemrfz", "maennamrfz", "kongxianmrfz", "ailinimrfz", "hongxuemrfz", "xiaoyangmrfz", "yinhuimrfz", "lingzhimrfz", "liumingmrfz", "chizuimrfz", "niyanmrfz", "chengshanmrfz", "wmrfz", "sikadimrfz", "spdegoumrfz", "kaierximrfz", "shanmrfz", "geleidiyamrfz", "chenmrfz", "xingxiongmrfz", "kanielianmrfz", "kuiyingmrfz", "mositimamrfz", "keebomrfz", "feiyameitamrfz", "jicimrfz", "helagemrfz", "wendimrfz", "senranmrfz", "ashmrfz", "kamimrfz", "nianmrfz", "lingmrfz", "fengdimrfz", "qinliumrfz", "laolimrfz", "amrfz", "heimrfz", "chongyuemrfz", "anjielinamrfz", "haojiaomrfz", "xigymrfz", "yanweimrfz", "nengtianshimrfz", "yuanyamrfz", "midiexiangmrfz", "spzzxpmrfz", "shuiyuemrfz", "spyoulingshamrfz", "qiubaimrfz", "baitiemrfz", "weinamrfz", "siyemrfz", "spjiaweiermrfz", "semrfz", "linmrfz", "spyedaomrfz", "yineisimrfz", "heijianmrfz", "yifulitemrfz", "shanlingmrfz", "maizhelunmrfz", "palasimrfz", "xiaguangmrfz"],
  圣晴天空: ["ailinimrfz", "hongxuemrfz", "xiaoyangmrfz", "yinhuimrfz", "lingzhimrfz", "liumingmrfz", "chizuimrfz", "niyanmrfz", "chengshanmrfz", "wmrfz", "sikadimrfz", "spdegoumrfz", "kaierximrfz", "shanmrfz", "geleidiyamrfz", "chenmrfz", "xingxiongmrfz", "kanielianmrfz", "kuiyingmrfz", "mositimamrfz", "keebomrfz", "feiyameitamrfz", "jicimrfz", "helagemrfz", "wendimrfz", "senranmrfz", "ashmrfz", "kamimrfz", "nianmrfz", "lingmrfz", "fengdimrfz", "qinliumrfz", "laolimrfz", "amrfz", "heimrfz", "chongyuemrfz", "anjielinamrfz", "haojiaomrfz", "xigymrfz", "yanweimrfz", "nengtianshimrfz", "yuanyamrfz", "midiexiangmrfz", "spzzxpmrfz", "shuiyuemrfz", "spyoulingshamrfz", "qiubaimrfz", "baitiemrfz", "weinamrfz", "siyemrfz", "spjiaweiermrfz", "semrfz", "linmrfz", "spyedaomrfz", "yineisimrfz", "heijianmrfz", "yifulitemrfz", "shanlingmrfz", "maizhelunmrfz", "palasimrfz", "xiaguangmrfz"],
  今天整点什么: ["linshimrfz", "zuolemrfz", "kongxianmrfz"],
  落尘星河: ["qiaojiakelifumrfz", "maennamrfz"]
};
let l = {};
for (let r in h) {
  let n = h[r];
  Array.isArray(n) ? n.forEach((a) => {
    l[a] ??= [], l[a].add(r);
  }) : (l[n] ??= [], l[n].add(r));
}
const k = {
  ...l
};
class b {
  /**
   * 设计者
   * @type {Record<string, string[]>}
   */
  designer = k;
  /**
   * 初始化
   * 旧式武将包已迁移至新式体系（src/packs/character/），此处不再加载旧式包，
   * 仅保留翻译初始化、init 钩子上下文与统一势力配置。
   */
  async init() {
    this.initTranslate(), p("init", 0, []), c({
      priority: 401,
      name: "unityGroup_add",
      obj: {
        name: "unityGroup",
        options: {
          name: "统一势力",
          intro: "开启后本扩展所有武将将统一势力。",
          init: !0
        }
      }
    }), c({
      priority: 997,
      name: "whichWayNumberOfExtChars_add",
      obj: {
        name: "numberOfExtChars",
        options: {
          name: `已实装干员数:${window.whichWaySave.allCharacters.length}`,
          clear: !0
        }
      }
    });
  }
  /**
   * 初始化翻译
   * 角色/技能/称号/介绍翻译已迁移至新式体系（src/packs/character/*mrfz/index.ts），
   * 此处仅保留新式体系未覆盖的内容：
   *   - lib.dynamicTranslate：动态翻译函数
   *   - 势力分组翻译（groupData）
   */
  initTranslate() {
    g.dynamicTranslate = d;
    for (let n in s)
      g.translate[n + "_group"] = s[n].sort;
  }
  /**
   * 获取角色设计者
   * @param {string | WhichWayCharacter } char - 角色名
   * @param {boolean} [igDefault=false] - 是否忽略默认设计者
   * @param {boolean} [fromStorage=false] - 是否从charDes中获取
   * @returns {string[]} 角色设计者
   */
  getDesigner(n, a = !1, o = !1) {
    if (e.is.object(n) && !n?.whichWay || typeof n == "string" && !window.whichWaySave.hasChar(n))
      return ["佚名"];
    if (typeof n == "string") {
      if (Object.keys(i.designer).includes(n)) return i.designer[n];
    } else if (e.is.object(n)) {
      if (n.whichWay.designer && n.whichWay.designer.length > 0 && !o) return n.whichWay.designer;
      if (Object.keys(i.designer).includes(n.whichWay.charId)) return i.designer[n.whichWay.charId];
    }
    return a ? ["佚名"] : ["林登万"];
  }
  /**
   * 获取角色阵营
   * @param {string} name - 角色名
   * @returns {string | undefined} 角色阵营
   */
  getCamp(n) {
    let a = e.character(n);
    return a.whichWay?.arknight.camp || a.group;
  }
}
const i = new b(), { getDesigner: x, getCamp: w, designer: _ } = i;
await i.init();
y({
  name: "whichWayCharacterPack_dev",
  fn: () => {
    window.whichWayCharacterPack = i;
  }
});
window.whichWay.register("characterPack", i);
const M = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  designer: _,
  getCamp: w,
  getDesigner: x
}, Symbol.toStringTag, { value: "Module" }));
export {
  s as a,
  w as b,
  X as c,
  _ as d,
  x as g,
  M as i
};
