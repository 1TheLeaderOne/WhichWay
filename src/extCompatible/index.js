import { onContent, onSetDev } from "../hooks/index.js";
import { decadeExtCompatible } from "./decade.js";
import { qianhuanSetting } from "./qianhuan.js";
import { skinSwitchtCompatible } from "./skinSwitch.js";

class WhichWayExtCompatible {
    async init(){
        this.qianhuan = qianhuanSetting;
        this.decade = decadeExtCompatible;
        this.skinSwitch = skinSwitchtCompatible;

        onContent({
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