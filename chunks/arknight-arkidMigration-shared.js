import { lib as _, game as g } from "noname";
import { whichWayUtil as i } from "./utill.js";
import { onSetDev as x, onExtension as w } from "./hooks.js";
const y = {
  noname: {
    //最佳版本
    new: "1.11.6",
    //最低版本
    over: "1.11.5.2"
  },
  ext: "1.6"
};
class b {
  get lastCheckedExtVersion() {
    return i.config("lastCheckedExtVersion") || "";
  }
  get lastCheckedNonameVersion() {
    return i.config("lastCheckedNonameVersion") || "";
  }
  get noname() {
    return y.noname;
  }
  get ext() {
    return y.ext;
  }
  /**
   * 扩展版本是否发生变化
   */
  extVersionChanged = !1;
  /**
   * 本体版本是否发生变化
   */
  nonameVersionChanged = !1;
  /**
   * 检查版本兼容性：
   * - 仅当（当前扩展版本, 当前无名杀版本）与上次检查的组合不同时，才执行检查
   * - 兼容则静默通过；不兼容则弹窗，之后仍记录该组合为“已检查”
   */
  checkVersionCompatible() {
    const s = this.checkVersion(this.ext, this.lastCheckedExtVersion) === 0, c = this.checkVersion(_.version, this.lastCheckedNonameVersion) === 0;
    if (s && c)
      return;
    this.extVersionChanged = !s, this.nonameVersionChanged = !c;
    const o = this.checkVersion(_.version, this.noname.over), n = this.checkVersion(_.version, this.noname.new);
    this._saveLastCheckedVersions(), o < 0 ? confirm(
      `⚠️ 【驶舰之向】当前无名杀版本 (${_.version}) 低于最低要求 (${this.noname.over})！
可能导致严重错误或崩溃。
推荐升级至 ${this.noname.new}。
点击“确定”将立即禁用本扩展。`
    ) && i.disableExtension() : n !== 0 && confirm(
      `ℹ️ 【驶舰之向】当前无名杀版本 (${_.version}) 与推荐版本 (${this.noname.new}) 不一致。
部分新功能可能受限或表现异常。
点击“确定”可禁用本扩展。`
    ) && i.disableExtension();
  }
  /**
   * 保存当前版本组合为“已检查”
   * @private
   */
  _saveLastCheckedVersions() {
    i.saveConfig("lastCheckedExtVersion", this.ext), i.saveConfig("lastCheckedNonameVersion", _.version);
  }
  /**
   * 版本比较：v1 vs v2
   * @param {string} v1
   * @param {string} v2
   * @returns {number} -1: v1 < v2, 0: v1 == v2, 1: v1 > v2
   */
  checkVersion(s, c) {
    if (!s || !c) return s === c ? 0 : s ? 1 : -1;
    const o = s.split(".").map(Number), n = c.split(".").map(Number), r = Math.max(o.length, n.length);
    for (let t = 0; t < r; t++) {
      const e = o[t] || 0, m = n[t] || 0;
      if (e < m) return -1;
      if (e > m) return 1;
    }
    return 0;
  }
}
const k = new b();
x({
  name: "whichWayVersion_dev",
  fn: () => {
    window.whichWayVersion = k;
  },
  priority: 0
});
w({
  name: "whichWayVersion_register",
  fn: () => {
    window.whichWay.register("version", k);
  }
});
async function ys(a) {
  const s = /* @__PURE__ */ new Map();
  for (const r of a) {
    if (s.has(r.name)) throw new Error(`[stageLoader] 阶段名重复: ${r.name}`);
    s.set(r.name, r);
  }
  const c = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), n = (r) => {
    const t = c.get(r.name);
    if (t) return t;
    const e = (async () => {
      r.deps?.length && await Promise.all(
        r.deps.map((z) => {
          const u = s.get(z);
          if (!u) throw new Error(`[stageLoader] 阶段 "${r.name}" 依赖了不存在的阶段 "${z}"`);
          return n(u);
        })
      );
      const m = performance.now();
      try {
        await r.load();
      } catch (z) {
        if (console.error(`[WhichWay] 阶段 "${r.name}" 加载失败`, z), !r.optional) throw z;
      } finally {
        o.set(r.name, performance.now() - m);
      }
    })();
    return c.set(r.name, e), e;
  };
  return await Promise.all(a.map(n)), a.map((r) => [r.name, o.get(r.name) ?? 0]);
}
const v = "char_450_necras", C = "char_4218_aigis", j = "char_4009_irene", V = "char_338_iris", W = "char_4178_alanna", S = "char_002_amiya", E = "char_225_haak", q = "char_291_aglina", $ = "char_218_cuttle", I = "char_456_ash", A = "char_4132_ascln", O = "char_4186_tmoris", N = "char_4166_varkis", L = "char_204_platnm", M = "char_128_plosis", R = "char_4072_ironmn", J = "char_4037_demetr", P = "char_487_bobb", U = "char_252_bibeak", D = "char_4223_botany", G = "char_4155_talr", K = "char_286_cast3", T = "char_445_wscoot", X = "char_377_gdglow", Z = "char_010_chen", Y = "char_4065_judge", H = "char_2024_chyue", B = "char_4198_christ", F = "char_174_slbell", Q = "char_494_vendla", nn = "char_362_saga", rn = "char_4110_delphn", cn = "char_102_texas", an = "char_4195_radian", sn = "char_4191_tippi", on = "char_4125_rdoc", tn = "char_4208_wintim", en = "char_4048_doroth", _n = "char_4123_ela", hn = "char_4148_philae", mn = "char_300_phenxi", fn = "char_4182_oblvns", zn = "char_222_bpipe", ln = "char_4016_kazema", un = "char_4222_taraxa", gn = "char_4093_frston", yn = "char_106_franka", dn = "char_4031_liesel", pn = "char_4227_gallus", kn = "char_220_grani", xn = "char_326_glacus", wn = "char_474_glady", bn = "char_4163_rosesa", vn = "char_394_hadiya", Cn = "char_4045_heidi", jn = "char_4066_highmo", Vn = "char_4079_haini", Wn = "char_4039_horn", Sn = "char_4088_hodrer", En = "char_4046_ebnhlz", qn = "char_340_shwaz", $n = "char_188_helage", In = "char_144_red", An = "char_4023_rfalcn", On = "char_4055_bgsnow", Nn = "char_017_huang", Ln = "char_4220_kormr", Mn = "char_4027_heyak", Rn = "char_4124_iana", Jn = "char_4116_blkkgt", Pn = "char_4237_jcinta", Un = "char_293_thorns", Dn = "char_306_leizi", Gn = "char_1042_phatm2", Kn = "char_4230_mcnist", Tn = "char_4203_kichi", Xn = "char_4221_ju", Zn = "char_003_kalts", Yn = "char_4162_cathy", Hn = "char_472_pasngr", Bn = "char_426_billro", Fn = "char_2013_cerber", Qn = "char_4231_clemnt", nr = "char_4228_closur", rr = "char_332_archet", cr = "char_250_phatom", ar = "char_4142_laios", sr = "char_4117_ray", or = "char_285_medic2", tr = "char_129_bluep", ir = "char_322_lmlee", er = "char_4193_lemuen", _r = "char_194_leto", hr = "char_4225_tanya", mr = "char_115_headbr", fr = "char_358_lisa", zr = "char_2023_ling", lr = "char_148_nearl", ur = "char_4187_graceb", gr = "char_206_gnosis", yr = "char_4080_lin", dr = "char_4102_threye", pr = "char_4042_lumen", kr = "char_486_takila", xr = "char_4133_logos", wr = "char_4130_luton", br = "char_4232_hbound", vr = "char_4064_mlynar", Cr = "char_248_mgllan", jr = "char_4141_marcil", Vr = "char_1037_amiya3", Wr = "char_242_otter", Sr = "char_391_rosmon", Er = "char_122_beagle", qr = "char_4071_peper", $r = "char_249_mlyss", Ir = "char_4229_aphris", Ar = "char_4179_monstr", Or = "char_213_mostma", Nr = "char_4134_cetsyr", Lr = "char_4171_wulfen", Mr = "char_4138_narant", Rr = "char_4212_nasti", Jr = "char_103_angel", Pr = "char_2014_nian", Ur = "char_4146_nymph", Dr = "char_311_mudrok", Gr = "char_4173_nowell", Kr = "char_485_pallas", Tr = "char_4234_pedro", Xr = "char_4058_pepe", Zr = "char_4136_phonor", Yr = "char_4144_chilc", Hr = "char_479_sleach", Br = "char_4082_qiubai", Fr = "char_4026_vulpis", Qr = "char_4183_mortis", nc = "char_202_demkni", rc = "char_4184_dolris", cc = "char_1050_chen3", ac = "char_350_surtr", sc = "char_416_zumama", oc = "char_4143_sensi", tc = "char_4235_thumpy", ic = "char_457_blitz", ec = "char_147_shining", _c = "char_264_f12yin", hc = "char_469_indigo", mc = "char_4137_udflow", fc = "char_1502_crosly", zc = "char_215_mantic", lc = "char_4236_tmslot", uc = "char_458_rfrost", gc = "char_193_frostl", yc = "char_4177_brigid", dc = "char_437_mizuki", pc = "char_2025_shu", kc = "char_263_skadi", xc = "char_427_vigil", wc = "char_4199_makiri", bc = "char_1001_amiya2", vc = "char_1015_aglna2", Cc = "char_1046_sbell2", jc = "char_1028_texas2", Vc = "char_1036_fang2", Wc = "char_1024_hbisc2", Sc = "char_1030_noirc2", Ec = "char_1031_slent2", qc = "char_1026_gvial2", $c = "char_1039_thorn2", Ic = "char_1034_jesca2", Ac = "char_1043_leizi2", Oc = "char_1052_kalts2", Nc = "char_1049_catap2", Lc = "char_1038_whitw2", Mc = "char_1051_headb2", Rc = "char_1014_nearl2", Jc = "char_1041_angel2", Pc = "char_1033_swire2", Uc = "char_1012_skadi2", Dc = "char_1032_excu2", Gc = "char_1022_flwr2", Kc = "char_1020_reed2", Tc = "char_1019_siege2", Xc = "char_1016_agoat2", Zc = "char_1044_hsgma2", Yc = "char_1047_halo2", Hc = "char_1029_yato2", Bc = "char_1045_svash2", Fc = "char_1023_ghost2", Qc = "char_1048_orchd2", na = "char_1013_chen2", ra = "char_4139_papyrs", ca = "char_245_cello", aa = "char_151_myrtle", sa = "char_4164_tecno", oa = "char_376_therex", ta = "char_166_skfire", ia = "char_4213_skybx", ea = "char_2012_typhon", _a = "char_4056_titi", ha = "char_2027_wang", ma = "char_4119_wanqin", fa = "char_112_siege", za = "char_1035_wisdel", la = "char_4098_vvana", ua = "char_4226_veen", ga = "char_400_weedy", ya = "char_4081_warmy", da = "char_113_cqbw", pa = "char_4145_ulpia", ka = "char_4224_turdus", xa = "char_423_blemsh", wa = "char_4214_cairn", ba = "char_497_ctable", va = "char_4122_grabds", Ca = "char_180_amgoat", ja = "char_4051_akkord", Va = "char_2015_dusk", Wa = "char_274_astesi", Sa = "char_136_hsguma", Ea = "char_135_halo", qa = "char_4172_xingzh", $a = "char_4194_rmixer", Ia = "char_4151_tinman", Aa = "char_336_folivo", Oa = "char_4211_snhunt", Na = "char_4052_surfer", La = "char_420_flamtl", Ma = "char_173_slchan", Ra = "char_4013_kjera", Ja = "char_164_nightm", Pa = "char_179_cgbird", Ua = "char_134_ifrit", Da = "char_4010_etlchi", Ga = "char_4087_ines", Ka = "char_172_svrash", Ta = "char_155_tiger", Xa = "char_4185_amoris", Za = "char_430_fartth", Ya = "char_4100_caper", Ha = "char_4219_yukari", Ba = "char_421_crow", Fa = "char_2026_yu", Qa = "char_4165_ctrail", ns = "char_4196_reckpr", rs = "char_219_meteo", cs = "char_197_poca", as = "char_459_tachak", ss = "char_4204_mantra", os = "char_4207_branch", ts = "char_4011_lessng", is = "char_1040_blaze2", es = "char_4202_haruka", _s = "char_4121_zuole", hs = {
  aibulanamrfz: v,
  aiguisimrfz: C,
  ailinimrfz: j,
  ailisimrfz: V,
  alannamrfz: W,
  amiyamrfz: S,
  amrfz: E,
  anjielinamrfz: q,
  anzhelamrfz: $,
  ashmrfz: I,
  asikalunmrfz: A,
  bafanhailingmrfz: O,
  baidurenmrfz: N,
  baijinmrfz: L,
  baimianxiaomrfz: M,
  baitiemrfz: R,
  beiluoneimrfz: J,
  bobumrfz: P,
  bohuimrfz: U,
  botanimrfz: D,
  caidumrfz: G,
  Castle3mrfz: K,
  chengfengmrfz: T,
  chengshanmrfz: X,
  chenmrfz: Z,
  chizuimrfz: Y,
  chongyuemrfz: H,
  Christinemrfz: B,
  chuxuemrfz: F,
  cimeimrfz: Q,
  cuoemrfz: nn,
  daifeienmrfz: rn,
  dekesasimrfz: cn,
  dianhumrfz: an,
  dibimrfz: sn,
  docmrfz: on,
  dongshimrfz: tn,
  duoluoximrfz: en,
  elamrfz: _n,
  feilaimrfz: hn,
  feiyameitamrfz: mn,
  fengchuanxiangzimrfz: fn,
  fengdimrfz: zn,
  fengwanmrfz: ln,
  fengxumrfz: un,
  friston3mrfz: gn,
  fulankamrfz: yn,
  fuzoumrfz: dn,
  gallusmrfz: pn,
  gelanimrfz: kn,
  gelaokesimrfz: xn,
  geleidiyamrfz: wn,
  guiyanmrfz: bn,
  hadiyamrfz: vn,
  haidimrfz: Cn,
  haimomrfz: jn,
  hainimrfz: Vn,
  haojiaomrfz: Wn,
  hedeleimrfz: Sn,
  heijianmrfz: En,
  heimrfz: qn,
  helagemrfz: $n,
  hongmrfz: In,
  hongsunmrfz: An,
  hongxuemrfz: On,
  huangmrfz: Nn,
  hulangwanmrfz: Ln,
  huoerhaiyamrfz: Mn,
  innamrfz: Rn,
  jianmrfz: Jn,
  jiaxintamrfz: Pn,
  jicimrfz: Un,
  jingzhemrfz: Dn,
  jiushenmrfz: Gn,
  jixieshimrfz: Kn,
  jixingmrfz: Tn,
  jumrfz: Xn,
  kaierximrfz: Zn,
  kaiselinmrfz: Yn,
  kamimrfz: Hn,
  kanielianmrfz: Bn,
  keebomrfz: Fn,
  kelaimenshamrfz: Qn,
  keluxiermrfz: nr,
  kongxianmrfz: rr,
  kuiyingmrfz: cr,
  laiousimrfz: ar,
  laiyimrfz: sr,
  Lancet2mrfz: or,
  landumrfz: tr,
  laolimrfz: ir,
  leimiuanmrfz: er,
  liexiamrfz: _r,
  liexiangmrfz: hr,
  lindongmrfz: mr,
  linglanmrfz: fr,
  lingmrfz: zr,
  linguangmrfz: lr,
  lingyinmrfz: ur,
  lingzhimrfz: gr,
  linmrfz: yr,
  linshimrfz: dr,
  liumingmrfz: pr,
  longshelanmrfz: kr,
  luogesimrfz: xr,
  lutuomrfz: wr,
  lvgumrfz: br,
  maennamrfz: vr,
  maizhelunmrfz: Cr,
  maluxiermrfz: jr,
  medical_amiyamrfz: Vr,
  meiermrfz: Wr,
  midiexiangmrfz: Sr,
  migelumrfz: Er,
  mingjiaomrfz: qr,
  miumiumrfz: $r,
  miuyinmrfz: Ir,
  mon3trmrfz: Ar,
  mositimamrfz: Or,
  mowangmrfz: Nr,
  muqianmrfz: Lr,
  narentuyamrfz: Mr,
  nasitimrfz: Rr,
  nengtianshimrfz: Jr,
  nianmrfz: Pr,
  nifumrfz: Ur,
  niyanmrfz: Dr,
  nuoweiermrfz: Gr,
  palasimrfz: Kr,
  peideluomrfz: Tr,
  peipeimrfz: Xr,
  PhonoR0mrfz: Zr,
  qierchakemrfz: Yr,
  qinliumrfz: Hr,
  qiubaimrfz: Br,
  rendongmrfz: Fr,
  ruoyemumrfz: Qr,
  saileiyamrfz: nc,
  sanjiaochuhuamrfz: rc,
  sbchenmrfz: cc,
  semrfz: ac,
  senranmrfz: sc,
  senximrfz: oc,
  shanbimrfz: tc,
  shanjimrfz: ic,
  shanlingmrfz: ec,
  shanmrfz: _c,
  shendianmrfz: hc,
  shenxunmrfz: mc,
  shijunzhemrfz: fc,
  shixiemrfz: zc,
  shiximrfz: lc,
  shuanghuamrfz: uc,
  shuangyemrfz: gc,
  shuidengxinmrfz: yc,
  shuiyuemrfz: dc,
  shumrfz: pc,
  sikadimrfz: kc,
  siyemrfz: xc,
  songtongmrfz: wc,
  spamiyamrfz: bc,
  spanjielinamrfz: vc,
  spchuxuemrfz: Cc,
  spdegoumrfz: jc,
  spfenmrfz: Vc,
  spfurongmrfz: Wc,
  spheijiaomrfz: Sc,
  sphemomrfz: Ec,
  spjiaweiermrfz: qc,
  spjicimrfz: $c,
  spjiexikamrfz: Ic,
  spjingzhemrfz: Ac,
  spkaierximrfz: Oc,
  spkongbaomrfz: Nc,
  splapulandemrfz: Lc,
  splingdongmrfz: Mc,
  splinguangmrfz: Rc,
  spnengtianshimrfz: Jc,
  spshihuaiyamrfz: Pc,
  spsikadimrfz: Uc,
  spsongzangrenmrfz: Dc,
  sptiaoxiangshimrfz: Gc,
  spweicaomrfz: Kc,
  spweinamrfz: Tc,
  spxiaoyangmrfz: Xc,
  spxingxiongmrfz: Zc,
  spxingyuanmrfz: Yc,
  spyedaomrfz: Hc,
  spyinhuimrfz: Bc,
  spyoulingshamrfz: Fc,
  spzilanmrfz: Qc,
  spzzxpmrfz: na,
  suocaomrfz: ra,
  suxinmrfz: ca,
  taojinniangmrfz: aa,
  tekenuomrfz: sa,
  THRMEXmrfz: oa,
  tianhuomrfz: ta,
  tiankonghemrfz: ia,
  tifengmrfz: ea,
  titimrfz: _a,
  wangmrfz: ha,
  wanqingmrfz: ma,
  weinamrfz: fa,
  weishidaiermrfz: za,
  weiweiannamrfz: la,
  weiyimrfz: ua,
  wendimrfz: ga,
  wenmimrfz: ya,
  wmrfz: da,
  wuerbianmrfz: pa,
  wujiumrfz: ka,
  xiaguangmrfz: xa,
  xiangshimrfz: wa,
  xiaogemrfz: ba,
  xiaomanmrfz: va,
  xiaoyangmrfz: Ca,
  xielvmrfz: ja,
  xigymrfz: Va,
  xingjimrfz: Wa,
  xingxiongmrfz: Sa,
  xingyuanmrfz: Ea,
  xingzhumrfz: qa,
  xinyangjiaobanjimrfz: $a,
  xirenmrfz: Ia,
  xiyinmrfz: Aa,
  xueliemrfz: Oa,
  xunlanmrfz: Na,
  yanweimrfz: La,
  yaxinmrfz: Ma,
  yelamrfz: Ra,
  yemomrfz: Ja,
  yeyingmrfz: Pa,
  yifulitemrfz: Ua,
  yindelaiximrfz: Da,
  yineisimrfz: Ga,
  yinhuimrfz: Ka,
  yintuoluomrfz: Ta,
  youtiansiruomaimrfz: Xa,
  yuanyamrfz: Za,
  yueyuemrfz: Ya,
  yueyuyoujialimrfz: Ha,
  yumaobimrfz: Ba,
  yumrfz: Fa,
  yunjimrfz: Qa,
  yunqingpingmrfz: ns,
  yunxingmrfz: rs,
  zaolumrfz: cs,
  zhanchemrfz: as,
  zhenyanmrfz: ss,
  zheyamrfz: os,
  zhisongmrfz: ts,
  zhuhuangmrfz: is,
  ziyeyaomrfz: es,
  zuolemrfz: _s
}, f = hs, d = "arkidMigrated";
function h(a) {
  if (!a || typeof a != "object") return 0;
  let s = 0;
  for (const c of Object.keys(a)) {
    const o = f[c];
    o !== void 0 && (Object.prototype.hasOwnProperty.call(a, o) || (a[o] = a[c]), delete a[c], s++);
  }
  return s;
}
function ms(a) {
  return a.replace(/[A-Za-z0-9_]+/g, (s) => f[s] ?? s);
}
function l(a) {
  if (Array.isArray(a)) {
    let c = 0;
    for (let o = 0; o < a.length; o++) {
      const n = a[o];
      if (typeof n == "string") {
        const r = f[n];
        r !== void 0 && (a[o] = r, c++);
      } else c += l(n);
    }
    return c;
  }
  if (!a || typeof a != "object") return 0;
  let s = h(a);
  for (const c in a) {
    const o = a[c];
    if (typeof o == "string") {
      const n = f[o];
      n !== void 0 && (a[c] = n, s++);
    } else s += l(o);
  }
  return s;
}
const p = "gloriousIdeal_campaign_v1";
function fs() {
  let a = null;
  try {
    a = localStorage.getItem(p);
  } catch {
    return 0;
  }
  if (!a) return 0;
  try {
    const s = JSON.parse(a), c = l(s);
    return c && localStorage.setItem(p, JSON.stringify(s)), c;
  } catch (s) {
    return console.error("[WhichWay] 瑰丽理想战役存档迁移失败，已跳过", s), 0;
  }
}
function zs(a) {
  const s = a?.audioConfig, c = h(s?.custom);
  for (const o of Object.values(s?.custom ?? {}))
    Array.isArray(o.skills) && (o.skills = o.skills.map((n) => f[n] ?? n));
  return c && i.saveConfig("audioConfig", s), c;
}
function ds() {
  const a = Object.keys(f).length;
  if (i.config(d) === a) return;
  const s = [], c = (n, r) => {
    try {
      const t = r();
      t && s.push(`${n} ${t}`);
    } catch (t) {
      console.error(`[WhichWay] ${n} 迁移失败，已跳过`, t);
    }
  }, o = window.whichWaySave;
  c("皮肤", () => {
    const n = h(o?.skinConfig);
    return n && i.saveConfig("skinConfig", o.skinConfig), n;
  }), c("本体皮肤", () => {
    const n = _.config.skin;
    if (!n) return 0;
    let r = h(n);
    for (const t of Object.values(n)) {
      if (!Array.isArray(t)) continue;
      const e = t[1];
      if (typeof e != "string") continue;
      const m = ms(e);
      m !== e && (t[1] = m, r++);
    }
    return r && i.saveConfig("skin", n, void 0), r;
  }), c("千幻皮肤", () => {
    const n = _.config.qhly_skinset;
    if (!n) return 0;
    let r = 0;
    for (const t of ["skin", "skinAudioList", "audioReplace", "djtoggle"]) r += h(n[t]);
    return r && i.saveConfig("qhly_skinset", n, void 0), r;
  }), c("禁用动皮", () => {
    const n = _.config.banSkinSJZX;
    if (!n) return 0;
    const r = h(n);
    return r && g.saveConfig("banSkinSJZX", n), r;
  }), c("配音", () => zs(o)), c("模组", () => {
    const n = o?.modulesSet, r = h(n);
    return r && i.saveConfig("modulesSet", n), r;
  }), c("冲突皮肤选择", () => {
    const n = i.config("whichWay_ConfictedSkin_selectedSkins");
    if (!n) return 0;
    const r = h(n);
    return r && i.saveConfig("whichWay_ConfictedSkin_selectedSkins", n), r;
  }), c("瑰丽理想", fs), g.saveConfig(`extension_WhichWay_${d}`, a), s.length && console.log(`%c[WhichWay] 旧干员id 存档迁移完成：${s.join("，")}`, "color:#4a9eff;");
}
export {
  ds as m,
  ys as r,
  k as w
};
