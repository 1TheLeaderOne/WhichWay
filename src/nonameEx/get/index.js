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
		//name 可能是 undefined 之外的非法牌名（比如未收录的自定义牌），lib.card[name] 取到 undefined 时
		//下面读 info.notarget 会直接抛 TypeError，把整段判定带崩。
		if (!info) return 0;
		if (info.notarget) {
			return 0;
		}
		if (info.selectTarget !== undefined) {
			if (Array.isArray(info.selectTarget)) {
				//Math.max 收到数组参数会先把数组转成 "1,2" 这样的字符串 ⇒ 恒返回 NaN，要展开
				return Math.max(...info.selectTarget);
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

		//中间那个 info.selectTarget && 是多余的，而且在 selectTarget 未定义时整个表达式会返回 undefined
		//而不是 false，与 @return {boolean} 不符。
		return !info.notarget && info.selectTarget === 1;
	}

	isView(card) {
		if (Array.isArray(card)) {
			//原来的循环只调用递归却没有 return，数组进来恒返回 undefined（假值）⇒ 「数组永远不算 view」。
			//按本函数的判据（不是「单张且名称对得上的实牌」就算 view），数组里只要有一张命中就算命中。
			for (var i of card) {
				if (this.isView(i)) return true;
			}
			return false;
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