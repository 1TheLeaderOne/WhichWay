declare interface Window {
    /**
     * 驶舰之向所有组件
     */
    whichWay: WhichWay;
    
    /**
     * 驶舰之向全局存储
     */
    whichWaySave:import("../src/globalSave/index.js").WhichWaySave;

    /**
     * 驶舰之向钩子组件
     * 只有开发者模式才会暴露出来
     */
    whichWayHooks?:any;

    /**
     * 驶舰之向新手帮助组件
     * 只有开发者模式才会暴露出来；正式环境请用 window.whichWay.helper。
     */
    whichWayHelper?: import("../src/helper/index.js").WhichWayHelper;

    /**
     * 开发者模式下的新手帮助演示入口（等价于 window.whichWayHelper.runDemo()）
     */
    whichWayHelperDemo?: () => import("../src/helper/index.js").WhichWayHelper;
}

type WhichWay = {
    /**
     * 注册组件
     * @param {string} name - 组件名称
     * @param {any} component - 组件对象
     */
    register: (name: string, component: any) => void;

    [key:string]:any
};

type customCharacterAudioConfig = {
    lang: string;
    skills : string[];
}