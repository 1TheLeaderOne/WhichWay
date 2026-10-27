import { onSetDev } from "../hooks";

/**
 * 存放一些封装好的用于AI判断的函数
 */
class WhichwayAI {
    /**
     * 如果拆其牌,是否会触发白银回血
     */
    triggerBaiyin(target:Player):boolean{
        return target.countCards("e","baiyin") > 0 && target.getDamagedHp() > 0;
    }
}

export const whichwayAI = new WhichwayAI();

window.whichWay.register("whichwayAI",whichwayAI);

onSetDev({
    name: "whichwayAI",
    fn: () => {
        //@ts-ignore
        window.whichwayAI = whichwayAI;
    },
});