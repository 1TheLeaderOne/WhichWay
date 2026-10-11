import "noname";
await import("./chunks/whichWay.js");
await import("./chunks/globalSave.js");
const { whichWayInit: i } = await import("./chunks/init.js"), { whichWayHooksApi: a } = await import("./chunks/hooks.js"), { whichWayUtil: e } = await import("./chunks/utill.js"), { mainPackage: o } = await import("./chunks/package.js");
await i();
await e.developerSet();
await a.extension();
const r = "extension";
function p() {
  return {
    name: "WhichWay",
    arenaReady: async function() {
      await a.arenaReady();
    },
    content: async function(t, n) {
      await a.content(t, n);
    },
    prepare: async function() {
      await a.prepare();
    },
    precontent: async function() {
      await a.precontent();
    },
    config: a.config,
    help: {},
    package: o(),
    files: { character: [], card: [], skill: [], audio: [] },
    connect: !0
  };
}
export {
  p as default,
  r as type
};
