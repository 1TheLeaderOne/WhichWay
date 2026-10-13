import { lib, game, ui, get, ai, _status } from "noname";
import { addPromptTo, removePromptsFrom } from "../../../tips/prompt.js";

export class CardExt extends lib.element.Card {
	/**
	 * 移除卡牌上的（驶舰之向）提示
	 * @param {string} [id] 只移除该 id 的提示；不传则移除全部
	 * @returns {this}
	 */
	removePromptSJZX(id){
		removePromptsFrom(this, typeof id === "string" ? id : void 0);
		return this;
	}

	/**
	 * 在卡牌上添加一条提示（同 id 则更新文本）
	 *
	 * DOM 与样式都在 `src/tips/promptSJZX.vue` 组件里（wrapper 也由组件渲染，
	 * 不会再出现"没有 `.promptSJZX-Wrapper` 祖先导致样式匹配不上"的问题）。
	 * @param {string} str 提示内容（按 HTML 渲染）
	 * @param {string} [id] 提示 id，缺省用内容本身
	 * @returns {this}
	 */
	addPromptSJZX(str,id){
		addPromptTo(this, { id: id || str, text: str, type: "card" });
		return this;
	}

	isConnect() {
		//@ts-ignore
		game.broadcastAll(() => {
			_status.sxrmConnectCards ??= [];
		});
		return _status.sxrmConnectCards.includes(this);
	}

	addConnect() {
        if(this.isConnect()) return this;
		//@ts-ignore
		game.broadcastAll(connect => {
			connect.addGaintag("visible_sxrm_connect_tag");
			_status.sxrmConnectCards.add(connect);
			//@ts-ignore
		}, this);
        //@ts-ignore
		const owner = get.owner(this);
			if (owner?.isIn()) {
				owner.markSkill("_sxrm_connect");
			}
		this.refreshMark();
		return this;
	}

	removeConnect() {
		_status.sxrmConnectCards ??= [];
		_status.sxrmConnectCards.remove(this);
		//@ts-ignore
		game.broadcast(connectCards => {
			_status.sxrmConnectCards = connectCards;
			//@ts-ignore
		}, _status.sxrmConnectCards);
		//@ts-ignore
		game.broadcastAll(card => {
			card.removeGaintag("visible_sxrm_connect_tag");
			//@ts-ignore
		}, this);
		this.refreshMark();
		return this;
	}

	refreshMark() {
		//@ts-ignore
		game.filterPlayer(current => {
            //@ts-ignore
			if (current.getCards("h",card=>card.isConnect()).length) {
				current.markSkill("_sxrm_connect");
			} else {
				current.unmarkSkill("_sxrm_connect");
			}
		});
	}
}