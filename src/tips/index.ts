import { onArenaReady, onSetDev } from "../hooks/index.js";
import { lib, game, ui, get, ai, _status } from "noname";
import { addPromptTo, removePromptsFrom } from "./prompt.js";

type delPromptFitler = boolean | ((event: GameEvent, trigger: delTrigger, player: Player) => boolean);

type autoDelPrompt = {
	card: Record<string, delPromptFitler>;
	player: Record<string, delPromptFitler>;
};
type delTrigger =
	| "addGroup"
	| "addNature"
	| "checkBegin"
	| "checkCard"
	| "checkTarget"
	| "checkButton"
	| "checkEnd"
	| "uncheckBegin"
	| "uncheckCard"
	| "uncheckTarget"
	| "uncheckButton"
	| "uncheckEnd"
	| "checkOverflow"
	| "checkTipBottom"
	| "checkDamage1"
	| "checkDamage2"
	| "checkDamage3"
	| "checkDamage4"
	| "checkDie"
	| "checkUpdate"
	| "checkSkillAnimate"
	| "addSkillCheck"
	| "removeSkillCheck"
	| "refreshSkin";

class WhichWayTips {
	registerHook(name: delTrigger, fn?: (triggerName: delTrigger, ...args: [GameEvent, Card, Player, any]) => any) {
		if (!fn) fn = this._hookTriggerDefaultFunc;
		if (this.triggerHooks[name]) {
			console.warn(`[WhichWayTips] hook ${name} already registered`);
			return;
		}
		this.triggerHooks[name] = fn;
		//@ts-ignore
		if (lib.hooks[name]) lib.hooks[name].push((...args) => fn(name, ...args));
		else throw new Error(`[WhichWayTips] hook ${name} not found`);
	}

	private _hookTriggerDefaultFunc(triggerName: delTrigger, ...args: [GameEvent, Card, Player]) {
		const [event] = args;
		if (!event) return;
		const pendingDelete:Record<"player" | "card", Array<string>> = {
			player:[],
			card:[]
		};
		const prompts = whichWayTips.autoDelPrompt;
		if (Object.keys(prompts.card).length === 0 && Object.keys(prompts.player).length === 0) return;
		for (const char of game.players.concat(game.dead)) {
			for (const id in prompts.player) {
				const playerPrompt = prompts.player[id];
				if (typeof playerPrompt === "function") {
					if (playerPrompt(event, triggerName, char)) {
						whichWayTips.removePrompt(char, id);
						pendingDelete.player.add(id);
					}
				} else if (playerPrompt === true) {
					whichWayTips.removePrompt(char, id);
					pendingDelete.player.add(id);
				}
			}
			for (const card of char.getCards("h")) {
				for (const id in prompts.card) {
					const cardPrompt = prompts.card[id];
					if (typeof cardPrompt === "function") {
						if (cardPrompt(event, triggerName, char)) {
							whichWayTips.removePrompt(card, id);
							pendingDelete.card.add(id);
						}
					} else if (cardPrompt === true) {
						whichWayTips.removePrompt(card, id);
						pendingDelete.card.add(id);
					}
				}
			}
		}
		if (pendingDelete.player.length) {
			pendingDelete.player.forEach(id=>{
				delete prompts.player[id];
			})
		}
		if(pendingDelete.card.length){
			pendingDelete.card.forEach(id=>{
				delete prompts.card[id];
			})
		}
	}

	getID(el: Card | Player): string {
		//@ts-ignore
		return get.itemtype(el) === "player" ? el.playerid : el.cardid;
	}

	registerDel(el: Card | Player, del: delTrigger, id: string, filter?: delPromptFitler) {
		const isPlayer = this.isPlayer(el);
		this.autoDelPrompt ??= { player: {}, card: {} };
		this.autoDelPrompt[isPlayer ? "player" : "card"][id] = filter || true;
		if (!this.triggerHooks[del]) this.registerHook(del);
	}

	isPlayer: (el: Card | Player) => boolean = el => get.itemtype(el) === "player";

	/**
	 * 在卡牌 / 角色上添加一条提示（同 id 则更新文本）。
	 *
	 * 提示的 DOM 与样式由 `src/tips/promptSJZX.vue` 组件负责（原 `css/extension.css` 里的
	 * `.promptSJZX` 系列已挪进该组件，`.promptSJZX-Wrapper` 也由组件渲染 —— 不会再出现
	 * "只挂了 `.promptSJZX`、导致 `.promptSJZX-Wrapper .promptSJZX` 匹配不上"的情况），
	 * 这里只负责登记与（配合 `registerDel` 的）自动清除。
	 *
	 * **卡牌提示默认「离手自动清除」**：卡牌离开手牌区（进弃牌堆 / 装备区 / 判定区 / 牌堆 / 特殊区…）后，
	 * 该牌上所有未声明保留的提示都会被清掉；需要让提示跟着牌走时把 `keepOnLeave` 传 `true`。
	 *
	 * @param el 目标卡牌 / 角色
	 * @param str 提示内容（按 HTML 渲染，与改造前 `innerHTML` 一致）
	 * @param id 提示 id，缺省用内容本身；同 id 视为更新
	 * @param del 自动清除的触发时机
	 * @param keepOnLeave 仅对卡牌提示有意义：离开手牌区后是否保留，默认 false（自动清除）
	 */
	addPrompt(el: Card | Player, str: string, id?: string, del?: delTrigger, keepOnLeave = false): Card | Player {
		const promptID = id || str;
		addPromptTo(el as unknown as HTMLElement, {
			id: promptID,
			text: str,
			type: this.isPlayer(el) ? "character" : "card",
			keepOnLeave,
		});
		if (del) this.registerDel(el, del, promptID);
		return el;
	}

	/**
	 * 移除卡牌 / 角色上的提示（删空后容器会自动收掉）
	 * @param el 目标卡牌 / 角色
	 * @param id 只移除该 id 的提示；不传则移除全部
	 */
	removePrompt(el: Card | Player, id?: string): Card | Player {
		removePromptsFrom(el as unknown as HTMLElement, typeof id === "string" ? id : void 0);
		return el;
	}

	autoDelPrompt: autoDelPrompt = {
		player: {},
		card: {},
	};

	//@ts-ignore
	triggerHooks: Record<delTrigger, Function> = {};
}

export const whichWayTips = new WhichWayTips();

onSetDev({
	name: "WhichWayTips_dev",
	fn() {
		//@ts-ignore
		window.whichWayTips = whichWayTips;
	},
});

window.whichWay.register("tips", whichWayTips);
