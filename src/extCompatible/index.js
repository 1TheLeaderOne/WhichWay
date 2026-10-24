import { onArenaReady, onSetDev } from "../hooks/index.js";
import { decadeExtCompatible } from "./decade.js";
import { qianhuanSetting } from "./qianhuan.js";
import { skinSwitchtCompatible } from "./skinSwitch.js";

class WhichWayExtCompatible {
    async init(){
        this.qianhuan = qianhuanSetting;
        this.decade = decadeExtCompatible;
        this.skinSwitch = skinSwitchtCompatible;

        /**
         * 把驶舰之向的动皮资产交给「皮肤切换 / 千幻」。
         *
         * ⚠️ 必须挂 `arenaReady` 而不是 `content`：`decadeUI.dynamicSkin` 在 `content` 阶段
         * 会被**整体覆盖** —— 十周年UI 的 `setupDynamicSkin()` 直接换对象、
         * 「皮肤切换」的 `updateDecadeDynamicSkin()` 按 `saveSkinParams` 逐字段合并；
         * 而 `content` 是各扩展 `Promise.allSettled` 并发跑的，此刻写进去会被它们盖掉。
         * `arenaReady` 在所有扩展 content 跑完后才触发
         * （`init/index.ts:597` → `ui/create/index.js:3133-3136`）。
         */
        onArenaReady({
            name:"whichWayExtCompatible_skinSwitch",
            fn:()=>{
                this.skinSwitch();
            }
        })
    }

    /**
     * 千幻相关配置
     * @type {any}
     */
    qianhuan;

    decade;

    skinSwitch;
}

export const whichWayExtCompatible = new WhichWayExtCompatible();

await whichWayExtCompatible.init();

onSetDev({
    name: "whichWayExtCompatible_setDev",
    fn(){
        //@ts-ignore
        window.whichWayExtCompatible = whichWayExtCompatible;
    },
})

window.whichWay.register("extCompatible", whichWayExtCompatible);