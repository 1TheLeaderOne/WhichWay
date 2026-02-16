declare interface whichWayConfig extends whichWayConfigOptions {
    whichWayConfig?: {
        /**
         * 优先级越高越靠前
         * 功能的范围在801-899之间
         * 设置的范围在399-799之间
         * 致谢的范围在<399
         * 扩展介绍的范围在>899
         */
        priority: number;
    };
}

declare type whichWayConfigOptions = {
    /** 选项中文 */
    name: string;
    /** 选项介绍 */
    intro?: string;
    init?: any;
    clear?: boolean;
    onclick?: (...args: any[]) => void;
    /**
     * TODO
     * 待补充
     */
    [key:string]: any;
}