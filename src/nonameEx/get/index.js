import { lib, game, ui, get, ai, _status, Get } from "noname";

export class GetExt extends Get {
	/**
	 * 获取此牌的目标数
	 * @param { VCard | string } card
	 * @returns {number}
	 */
	targetCounts(card){
		//@ts-ignore
		let name = card?.name;
		if(typeof card === "string") name = card;
		else if(card === undefined) return 0;

		let info = lib.card[name];
		if (info.notarget) {
			return 0;
		}
		if (info.selectTarget !== undefined) {
			if (Array.isArray(info.selectTarget)) {
				return Math.max(info.selectTarget);
			}
			else if(info.selectTarget === -1 && info.toself){
				return 1;
			}
			else{
				return info.selectTarget === -1 ? Infinity : info.selectTarget;
			}
		}
		return info.filterTarget ? 1 : 0;
	}

	/**
	 * @description: 判断该牌是否为单一目标
	 * @param {Card | string} card
	 *
	 * @return {boolean}
	 */
	isSingle(card){
		if(typeof card === "string") card = {name:card};
		let info = get.info(card);

		return !info.notarget && info.selectTarget && info.selectTarget === 1;
	}

	isView(card) {
		if (Array.isArray(card)) {
			for (var i of card) {
				this.isView(i);
			}
		}
		else if (card && get.is.object(card)) {
			if (!card.cards || !card.cards[0]) return true;
			if (card.cards.length > 1) return true;
			if (card.name != card.cards[0].name) return true;
			return false;
		}
		else {
			throw new Error(
				`The first parameter of type must be Array or VCard!`
			);
		}
	}

	tranPhase (input) {
		let phase = [
			"phaseZhunbei",
			"phaseJudge",
			"phaseDraw",
			"phaseUse",
			"phaseDiscard",
			"phaseJieshu",
		];
		let cn = [
			"准备阶段",
			"判定阶段",
			"摸牌阶段",
			"出牌阶段",
			"弃牌阶段",
			"结束阶段",
		];

		if (typeof input === "string") {
			for (let i = 0; i < phase.length; i++) {
				if (input === phase[i]) {
					return cn[i];
				}
			}
		} else if (Array.isArray(input)) {
			let result = [];
			input.forEach((item) => {
				for (let i = 0; i < phase.length; i++) {
					if (item === phase[i]) {
						result.push(cn[i]);
						break;
					}
				}
			});
			return result;
		}
	}

	randomNumberSJZX() {
		const randomNumber = Math.floor(Math.random() * 1000000);
		const paddedNumber = randomNumber.toString().padStart(6, "0");
		return paddedNumber + "SJZX";
	}
}