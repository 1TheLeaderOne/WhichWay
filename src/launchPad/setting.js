import { game, lib } from "noname";
const LAUNCH_PAD_ID = "whichway-carousel";
const LAUNCH_PAD_NAME = "驶舰之向";
const LAUNCH_PAD_CONFIG_KEY = "extension_WhichWay_launchPad";
const PREV_STYLE_KEY = "WhichWay_launchpad_prevStyle";
const LEGACY_AUTOSET_KEY = "extension_WhichWay_launchpad_autoset";
const STOCK_SPLASH_ID = "style1";
function readConfig(key) {
  try {
    return lib.config[key];
  } catch {
    return void 0;
  }
}
function writeConfig(key, value) {
  try {
    game.saveConfig(key, value);
  } catch (e) {
    console.warn(`[launchPad] 写入配置 ${key} 失败`, e);
  }
}
function isLaunchPadEnabled() {
  return readConfig(LAUNCH_PAD_CONFIG_KEY) === true;
}
function getCurrentSplashStyle() {
  const v = readConfig("splash_style");
  return typeof v === "string" && v ? v : "";
}
function isLaunchPadActive() {
  return getCurrentSplashStyle() === LAUNCH_PAD_ID;
}
function applyLaunchPadStyle(on) {
  const cur = getCurrentSplashStyle();
  if (on) {
    if (cur && cur !== LAUNCH_PAD_ID) writeConfig(PREV_STYLE_KEY, cur);
    writeConfig("splash_style", LAUNCH_PAD_ID);
  } else if (cur === LAUNCH_PAD_ID) {
    const prev = readConfig(PREV_STYLE_KEY);
    writeConfig("splash_style", typeof prev === "string" && prev && prev !== LAUNCH_PAD_ID ? prev : STOCK_SPLASH_ID);
  }
  writeConfig(LAUNCH_PAD_CONFIG_KEY, !!on);
}
function ensureLaunchPadDefault() {
  const known = typeof readConfig(LAUNCH_PAD_CONFIG_KEY) === "boolean";
  if (known) {
    if (isLaunchPadEnabled() && getCurrentSplashStyle() && !isLaunchPadActive()) {
      writeConfig(LAUNCH_PAD_CONFIG_KEY, false);
    }
    return;
  }
  const style = getCurrentSplashStyle();
  const legacy = readConfig(LEGACY_AUTOSET_KEY) === true;
  const on = legacy || !style || style === STOCK_SPLASH_ID || style === LAUNCH_PAD_ID;
  if (on) applyLaunchPadStyle(true);
  else writeConfig(LAUNCH_PAD_CONFIG_KEY, false);
}
export {
  LAUNCH_PAD_CONFIG_KEY,
  LAUNCH_PAD_ID,
  LAUNCH_PAD_NAME,
  applyLaunchPadStyle,
  ensureLaunchPadDefault,
  getCurrentSplashStyle,
  isLaunchPadActive,
  isLaunchPadEnabled
};
