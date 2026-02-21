import { lib } from "noname";
import { whichWayHooksApi } from "./hooks/index.js";
import { whichWayVersion } from "./version.js";
const whichWayInit = async () => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  lib.translate.extension_WhichWay = "驶舰之向";
  whichWayVersion.checkVersionCompatible();
  await import("./toast/index.js");
  await import("./file.js");
  await window.whichWay.file.autoLoadCSS();
  await import("./override/index.js");
  await import("./nonameEx/index.js");
  await import("./config/index.js");
  await import("./character/index.js");
  await import("./card/index.js");
  await import("./packs/index.js");
  await import("./arknight/index.js");
  await import("./audio/index.js");
  await import("./skin/index.js");
  await import("./poptip/index.js");
  await import("./tips/index.js");
  await import("./characterCard/index.js");
  await import("./extCompatible/index.js");
  await import("./updateLog/index.js");
  await import("./configUI/index.js");
  await import("./modules/index.js");
  await whichWayHooksApi.init();
};
export {
  whichWayInit
};
//# sourceMappingURL=init.js.map
