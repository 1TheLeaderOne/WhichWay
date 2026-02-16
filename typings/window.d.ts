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