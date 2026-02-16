import "noname";
import { whichWayHooksApi } from "./src/hooks/index.js";
import { whichWayInit } from "./src/init.js";
import { whichWayUtil } from "./src/utill.js";
import { whichWayVersion } from "./src/version.js";
await start();
await whichWayHooksApi.extension();
const type = "extension";
function extension() {
  return {
    name: "WhichWay",
    arenaReady: async function() {
      await whichWayHooksApi.arenaReady();
    },
    content: async function(config, pack) {
      await whichWayHooksApi.content(config, pack);
    },
    prepare: async function() {
      await whichWayHooksApi.prepare();
    },
    precontent: async function() {
      await whichWayHooksApi.precontent();
    },
    config: whichWayHooksApi.config,
    help: {},
    package: {
      character: {
        character: {},
        translate: {}
      },
      card: {
        card: {},
        translate: {},
        list: []
      },
      skill: {
        skill: {},
        translate: {}
      },
      intro: "",
      author: "TheLeaderOne、圣晴天空",
      diskURL: "",
      forumURL: "",
      version: whichWayVersion.ext
    },
    files: { character: [], card: [], skill: [], audio: [] },
    connect: true
  };
}
async function start() {
  await import("./src/whichWay.js");
  await import("./src/globalSave/index.js");
  await whichWayInit();
  await whichWayUtil.developerSet();
}
export {
  extension as default,
  type
};
//# sourceMappingURL=extension.js.map
