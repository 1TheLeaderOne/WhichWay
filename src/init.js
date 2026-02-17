import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayHooksApi } from "./hooks/index.js";
import { whichWayVersion } from "./version.js";

/**
 * 驶舰之向初始化
 */
export const whichWayInit = async () => {
    /**
     * 别问,我也不知道为什么,删了就报错
     */
    await new Promise(resolve => setTimeout(resolve, 600));

    //配置中文翻译
    lib.translate.extension_WhichWay = "驶舰之向";

    //检查版本
    whichWayVersion.checkVersionCompatible();

    //导入toast组件
    await import("./toast/index.ts");

    //导入文件管理组件
    await import("./file.js");

    //@ts-ignore 加载css
    await window.whichWay.file.autoLoadCSS()

    //导入覆盖API
    await import("./override/index.js");

    /**
     * 导入noname扩展
     * TODO 这坨东西真要该全删了xd
     */
    await import("./nonameEx/index.js");

    //导入配置
    await import("./config/index.js");

    //————————————武将包————————————//

    /**
     * 牢的添加将包的方法
     */
    await import("./character/index.js");
    await import("./card/index.js");

    /**
     * 新的添加将包的方法
     */
    await import("./packs/index.ts");

    //导入明日方舟数据
    await import("./arknight/index.ts");

    //导入音频组件
    await import("./audio/index.ts");

    //导入皮肤
    await import("./skin/index.ts");

    //导入poptip
    await import("./poptip/index.js");

    //导入tips
    await import("./tips/index.ts")

    //导入角色卡片
    await import("./characterCard/index.ts");

    //扩展适配
    await import("./extCompatible/index.js");

    //导入更新日志
    await import("./updateLog/index.js");

    //快速设置界面
    await import("./configUI/index.js");

    //导入模组系统
    await import("./modules/index.js")

    await whichWayHooksApi.init();
}