import { lib, game, ui, get, ai, _status, Game, Get } from "noname";
import { ContentExt } from "./library/element/content.js";
import { PlayerExt } from "./library/element/player.js";
import { CardExt } from "./library/element/card.js";
import { GameExt } from "./game/index.js";
import { GetExt } from "./get/index.js";
import { GameEventExt } from "./library/element/gameEvent.js";
import { onBeforeContent } from "../hooks/index.js";
import { skillCustomFunc } from "./custom/skill.ts";
import { ArrayExt } from "./jsExt/ArrayExt.js";
import { HTMLDivElementExt } from "./jsExt/HTMLDivElementExt.js";
import { weinaData } from "./custom/weina.js";
// import { Player } from "@/library/element/index.js";
// import { Card } from "@/library/element/index.js";

window.whichWaySave.weinaData = weinaData;

window.whichWay.nonameEx ??= {};
const nonameEx = window.whichWay.nonameEx;
/**
 * 拓展的一些函数,这些函数只会在写武将的时候用到
 */
nonameEx["customFuc"] = {
	skill: skillCustomFunc,
};

/**
 * 这一坨都要废弃,至于为什么没有废弃,因为我懒得改了
 * @deprecated
 */

nonameEx.jsExt ??= {};
nonameEx["ArrayExt"] = patchPrototypeWhichWay(ArrayExt, Array.prototype, Array.prototype)
nonameEx["HTMLDivElementExt"] = patchPrototypeWhichWay(HTMLDivElementExt, HTMLDivElement.prototype)

onBeforeContent({
	name: "WhichWayNonameEx",
	fn: async () => {
		nonameEx["CardExt"] = patchPrototypeWhichWay(CardExt, lib.element.card);
		nonameEx["PlayerExt"] = patchPrototypeWhichWay(PlayerExt,lib.element.player);
		nonameEx["GameExt"] = patchPrototypeWhichWay(GameExt, Game.prototype);
		nonameEx["GetExt"] = patchPrototypeWhichWay(GetExt, Get.prototype);
		nonameEx["GameEventExt"] = patchPrototypeWhichWay(GameEventExt, lib.element.GameEvent.prototype);

		nonameEx["ContentExt"] = ContentExt;
		Object.assign(lib.element.content, ContentExt);

		/**
		 * 挂载 `player.ext`（增强版选牌接口，支持判定区）。
		 *
		 * ⚠️ 不能只靠 `patchPrototypeWhichWay`：它只注入**函数**（`typeof descriptor.value !== "function"`
		 * 直接 continue），而 `ext` 是个对象，会被跳过。所以这里单独 define 到 Player 原型上
		 * （用 getter 让每个实例拿到同一个对象，避免每个玩家各建一份）。
		 */
		if (!("ext" in lib.element.player)) {
			Object.defineProperty(lib.element.player, "ext", {
				enumerable: false,
				configurable: true,
				get() {
					//懒挂载：首次访问时把 ext 里的方法绑定到当前实例上，
					//这样 `player.ext.chooseCard(...)` 内部的 `this` 就是该玩家
					if (!this._whichWayExtCache) {
						Object.defineProperty(this, "_whichWayExtCache", {
							enumerable: false,
							configurable: true,
							writable: true,
							value: buildPlayerExt(this),
						});
					}
					return this._whichWayExtCache;
				},
			});
			nonameEx["PlayerExtChooser"] = { mounted: true };
		}

		// nonameEx["CardExt"] = CardExt.prototype;
		// Object.assign(lib.element.card, nonameEx["CardExt"]);

		// nonameEx["PlayerExt"] = PlayerExt.prototype;
		// Object.assign(lib.element.player, nonameEx["PlayerExt"]);

		await import("./custom/override.js");
	},
});

/**
 * 为一个玩家实例构建 `player.ext`（增强版选牌接口）。
 *
 * 为什么按实例构建而不是挂共享对象：`player.ext.chooseCard(...)` 里的 `this` 必须是
 * 发起选择的那个玩家（内部要 `this.getCards("j")`、`this.chooseCard(...)`），
 * 共享对象会让 `this` 指向共享对象自己。
 *
 * @param {any} player 玩家实例
 * @returns {{ chooseCardTarget: Function, chooseCard: Function }}
 */
function buildPlayerExt(player) {
	/**
	 * 选牌 + 选目标（支持判定区）。
	 * @param {Record<string, any>} [params] 与本体 `chooseCardTarget` 相同
	 */
	const chooseCardTarget = (params = {}) => {
		const next = game.createEvent("extChooseCardTarget");
		next.player = player;
		Object.assign(next, params);
		next.setContent("extChooseCardTarget");
		next._args = [params];
		return next;
	};

	/**
	 * 选牌（支持判定区），不选目标。
	 * @param {Record<string, any>} [params] 与本体 `chooseCard` 相同
	 */
	const chooseCard = (params = {}) => {
		const next = game.createEvent("extChooseCard");
		next.player = player;
		Object.assign(next, params);
		next.setContent("extChooseCard");
		next._args = [params];
		return next;
	};

	return { chooseCardTarget, chooseCard };
}

function patchPrototypeWhichWay(ExtensionClass, NativePrototype, BasePrototype) {
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
			writable: true,
		});

		injectedMethods[key] = descriptor.value;
	}

	return {
		injected: injectedMethods,
		count: Object.keys(injectedMethods).length,
		target: NativePrototype,
		source: ExtensionClass,
		base: BasePrototype,
		timestamp: Date.now(),
	};
}
