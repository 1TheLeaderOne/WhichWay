import { lib, get } from "noname";
const CAROUSEL_ART = "ext:WhichWay/image/splash/carousel/";
const CAROUSEL_COUNT = 18;
const MODE_DESC = {
  identity: "身份局：主公与忠臣讨伐内奸与反贼的经典对局",
  guozhan: "国战：群雄逐鹿，问鼎中原",
  boss: "身份 3v3：三人小队携手挑战高难 BOSS",
  brawl: "乱斗模式：规则与武将池大幅改动的娱乐对局",
  versus: "1v1 对决：单挑见真章",
  doudizhu: "斗地主：农民与地主的三方博弈",
  tafang: "塔防模式：以将筑塔，抵御进犯",
  stone: "炉石模式：趣味性对抗玩法",
  chess: "战旗模式：战场如棋局",
  connect: "联机对战：与好友线上切磋",
  single: "单人挑战：自己与 AI 的对局",
  guandu: "官渡之战：历史战役还原"
};
const MODE_ART_MAP = {};
function resolveBg(raw) {
  if (!raw) return "";
  try {
    const url = lib.init.parseResourceAddress(raw);
    return url?.href || "";
  } catch {
    return "";
  }
}
function carouselArt(n) {
  const idx = (n % CAROUSEL_COUNT + CAROUSEL_COUNT) % CAROUSEL_COUNT + 1;
  return resolveBg(`${CAROUSEL_ART}carousel_${idx}.png`);
}
function isStockMode(mode) {
  return Array.isArray(lib.config.all.stockmode) && lib.config.all.stockmode.includes(mode);
}
function modeCover(mode, order) {
  const fixed = MODE_ART_MAP[mode];
  if (typeof fixed === "number") return carouselArt(fixed - 1);
  if (isStockMode(mode)) return carouselArt(order);
  const own = resolveBg(lib.mode[mode]?.splash);
  return own || carouselArt(order);
}
function buildLaunchPadItems() {
  const modes = Array.isArray(lib.config.all.mode) ? lib.config.all.mode : [];
  return modes.map((mode, i) => {
    let title = "";
    try {
      title = get.translation(mode) || mode;
    } catch {
      title = mode;
    }
    const stock = isStockMode(mode);
    const cover = modeCover(mode, i);
    return {
      mode,
      serial: String(i + 1).padStart(2, "0"),
      title,
      desc: MODE_DESC[mode] || (stock ? "选择此模式开始游戏" : "WhichWay 提供的自定义玩法"),
      art: cover,
      thumb: cover
    };
  }).filter((item) => item.art || item.thumb);
}
export {
  buildLaunchPadItems
};
