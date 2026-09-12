import { onConfig } from "../hooks/index.js";
import { whichWayToast } from "../toast/index.js";
import { ensureLaunchPadDefault, LAUNCH_PAD_NAME, applyLaunchPadStyle, isLaunchPadEnabled, LAUNCH_PAD_CONFIG_KEY } from "./setting.js";
const CONFIG_NAME = "launchPad";
let registered = false;
function registerLaunchPadConfig() {
  if (registered) return false;
  ensureLaunchPadDefault();
  onConfig({
    name: CONFIG_NAME,
    priority: 798,
    obj: {
      name: CONFIG_NAME,
      options: {
        name: `${LAUNCH_PAD_NAME}启动页`,
        intro: "开启后,游戏启动页默认切换为「驶舰之向」视差轮播（下次启动游戏时生效;也可在 选项→外观→启动页 中手动切换）",
        init: isLaunchPadEnabled(),
        onclick(bool) {
          applyLaunchPadStyle(bool);
          whichWayToast.showToast(
            bool ? `[${LAUNCH_PAD_NAME}] 已开启驶舰之向启动页,下次启动游戏时生效` : `[${LAUNCH_PAD_NAME}] 已关闭驶舰之向启动页,已还原为之前的启动页样式`,
            3e3,
            "topLeft",
            "configTips_launchPad"
          );
        }
      }
    }
  });
  registered = true;
  console.info(`[launchPad] 设置项已注册：${CONFIG_NAME}（${LAUNCH_PAD_CONFIG_KEY}）`);
  return true;
}
export {
  registerLaunchPadConfig
};
