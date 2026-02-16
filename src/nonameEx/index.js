import { Game, Get, lib } from "noname";
import { ContentExt } from "./library/element/content.js";
import { PlayerExt } from "./library/element/player.js";
import { CardExt } from "./library/element/card.js";
import { GameExt } from "./game/index.js";
import { GetExt } from "./get/index.js";
import { GameEventExt } from "./library/element/gameEvent.js";
import { onBeforeContent } from "../hooks/index.js";
import { skillCustomFunc } from "./custom/skill.js";
import { ArrayExt } from "./jsExt/ArrayExt.js";
import { HTMLDivElementExt } from "./jsExt/HTMLDivElementExt.js";
import { weinaData } from "./custom/weina.js";
window.whichWaySave.weinaData = weinaData;
window.whichWay.nonameEx ??= {};
const nonameEx = window.whichWay.nonameEx;
nonameEx["customFuc"] = {
  skill: skillCustomFunc
};
nonameEx.jsExt ??= {};
nonameEx["ArrayExt"] = patchPrototypeWhitherHelm(ArrayExt, Array.prototype, Array.prototype);
nonameEx["HTMLDivElementExt"] = patchPrototypeWhitherHelm(HTMLDivElementExt, HTMLDivElement.prototype);
onBeforeContent({
  name: "WhichWayNonameEx",
  fn: async () => {
    nonameEx["GameExt"] = patchPrototypeWhitherHelm(GameExt, Game.prototype);
    nonameEx["GetExt"] = patchPrototypeWhitherHelm(GetExt, Get.prototype);
    nonameEx["GameEventExt"] = patchPrototypeWhitherHelm(GameEventExt, lib.element.GameEvent.prototype);
    nonameEx["ContentExt"] = ContentExt;
    Object.assign(lib.element.content, ContentExt);
    nonameEx["CardExt"] = new CardExt();
    Object.assign(lib.element.card, nonameEx["CardExt"]);
    nonameEx["PlayerExt"] = new PlayerExt();
    Object.assign(lib.element.player, nonameEx["PlayerExt"]);
    await import("./custom/override.js");
  }
});
function patchPrototypeWhitherHelm(ExtensionClass, NativePrototype, BasePrototype) {
  BasePrototype = BasePrototype || Object.getPrototypeOf(NativePrototype);
  const descriptors = Object.getOwnPropertyDescriptors(ExtensionClass.prototype);
  const injectedMethods = {};
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (key === "constructor") continue;
    if (typeof descriptor.value !== "function") continue;
    if (key in BasePrototype) continue;
    Object.defineProperty(NativePrototype, key, {
      ...descriptor,
      enumerable: false,
      configurable: true,
      writable: true
    });
    injectedMethods[key] = descriptor.value;
  }
  return {
    injected: injectedMethods,
    count: Object.keys(injectedMethods).length,
    target: NativePrototype,
    source: ExtensionClass,
    base: BasePrototype,
    timestamp: Date.now()
  };
}
//# sourceMappingURL=index.js.map
