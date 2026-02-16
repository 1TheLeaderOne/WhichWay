import { lib, game, ui, get, ai, _status } from "noname";

export class PlayerExt extends lib.element.Player {
	/**
	 * 移除手牌中所有的（驶舰之向）提示
	 * @param { string } id 删除指定id的描述，不填删除所有
	 */
	removePromptSJZX(id){
		let cards = this.getCards("h");
		cards.forEach(card=>card.removePromptSJZX(id));
	}

	/**
	 * 设置某一个技能的使用次数
	 * @param { number } num 清除次数
	 * @param { string } skill 技能名  
	 */
	setSkillCount(skill,num){
		if(!this.getSkills().includes(skill)){
			console.warn(`${get.translation(this)}(${this.name}) 没有技能 ${skill}`)
		}

		if(this.getStat("skill")?.[skill]){ 
			this.getStat("skill")[skill] += num;
			//@ts-ignore
			if(typeof this.stat.allSkills === "number") this.stat.allSkills += num;
		}

		if(typeof this.storage?.counttrigger?.[skill] === "number"){
			this.storage.counttrigger[skill] += num;
		}
	}

	//@ts-ignore
	chooseCardHand(choose) {
		var next = game.createEvent("chooseCardHand");
		//@ts-ignore
		next.player = this;
		if (arguments.length == 1 && get.is.object(choose)) {
			for (var i in choose) {
				next[i] = choose[i];
			}
		} else {
			//@ts-ignore
			for (var i = 0; i < arguments.length; i++) {
				if(Array.isArray(arguments[i])){
					next.cards = arguments[i];
				}
				else if (typeof arguments[i] == "number") {
					next.selectCard = [arguments[i], arguments[i]];
				} else if (get.itemtype(arguments[i]) == "select") {
					next.selectCard = arguments[i];
				} else if (typeof arguments[i] == "boolean") {
					next.forced = arguments[i];
				} else if (get.itemtype(arguments[i]) == "position") {
					next.position = arguments[i];
				} else if (typeof arguments[i] == "function") {
					if (next.filterCard) {
						next.ai = arguments[i];
					} else {
						next.filterCard = arguments[i];
					}
				} else if (typeof arguments[i] == "object" && arguments[i]) {
					next.filterCard = get.filter(arguments[i]);
				} else if (arguments[i] == "glow_result") {
					//@ts-ignore
					next.glow_result = true;
				} else if (arguments[i] == "allowChooseAll") {
					next.allowChooseAll = true;
				} else if (typeof arguments[i] == "string") {
					get.evtprompt(next, arguments[i]);
				}
			}
		}
		if (next.filterCard == undefined) {
			next.filterCard = lib.filter.all;
		}
		if (next.selectCard == undefined) {
			next.selectCard = [1, 1];
		}
		if (next.ai == undefined) {
			next.ai = get.unuseful3;
		}
		//@ts-ignore
		next.autochoose = function () {
			if (!this.forced) {
				return false;
			}
			if (typeof this.selectCard == "function") {
				return false;
			}
			if (this.complexCard || this.complexSelect || this.filterOk) {
				return false;
			}
			if (this.type === "compare") {
				return false;
			}
			var cards = this.player.getCards(this.position);
			if (cards.some(card => !this.filterCard(card, this.player, this))) {
				return false;
			}
			return get.select(this.selectCard)[0] >= this.player.countCards(this.position);
		};
		//@ts-ignore
		next.setContent("chooseCardHand");
		next._args = Array.from(arguments);
		return next;
	}

	/**
	 * 显示提示
	 * @param {string} str 显示的内容
	 * @param {string} nature 颜色
	 * @param {boolean} [clear=false] 是否清除原内容
	 */
	showPrompt(str, nature, clear = false) {
		let node;
		if(clear === true) {
			if(this.node.prompt){
				this.node.prompt.remove();
				delete this.node.prompt;
			}
		}
		
		if (this.node.prompt) {
			node = this.node.prompt;
			node.innerHTML = node.innerHTML;
		} else {
			node = ui.create.div("promptCharacterSJZX", this);
			this.node.prompt = node;
			ui.refresh(node);
		}
		node.classList.add("promptCharacterSJZX");
		node.classList.add("hiddenSJZX");
		node.innerHTML = node.innerHTML + str;
		node.dataset.nature = nature || "soil";

		/**
		 * @param {HTMLElement} container - 要调整字体大小的元素。
		 * @description 调整字体大小，直到元素内容完全显示在容器中。
		 */
		const adjustFontSizeForLines = function (container) {
			if (!container) return;

			const lines = container.querySelectorAll(".promptTextSJZX");
			const containerWidth = container.clientWidth;

			lines.forEach(line => {
				let fontSize = parseFloat(window.getComputedStyle(line).fontSize);

				//@ts-ignore
				const isOverflowing = () => line.offsetWidth > containerWidth - 10;

				while (isOverflowing() && fontSize > 12) {
					fontSize -= 1;
					//@ts-ignore
					line.style.fontSize = `${fontSize}px`;
				}
			});
		};

		adjustFontSizeForLines(node);

		requestAnimationFrame(() => {
			node.classList.remove("hiddenSJZX");
		});
	}

	/**
	 * @description: 获取卡牌的使用次数，cardusable返回的是false则为0次
	 * @param {string | VCard} card 牌
	 * @param {boolean} pure 是否仅返回次数
	 *
	 * @return {number}
	 */
	getCardUsable2(card, pure) {
		var player = this;
		if (typeof card == "string") {
			card = { name: card };
		}
		card = get.autoViewAs(card);
		var num = get.info(card).usable;
		if (typeof num == "function") num = num(card, player);
		num = game.checkMod(card, player, num, "cardUsable", player);
		if (typeof num === "boolean" && num === false) return 0;
		if (typeof num != "number") return Infinity;
		if (!pure && _status.currentPhase == player) {
			return num - player.countUsed(card);
		}
		return num;
	}

	/**
	 * @description: 是否满足某个应变条件
	 * @param {string | 'kongchao' | 'canqu' | 'zhuzhan' | 'fujia' } conditional 条件
	 * @param {GameEvent} event 事件
	 *
	 * @return {boolean}
	 */
	satisfyYingbian(conditional, event = get.event()) {
		const newConditions = new Map([...lib.yingbian.condition.simple, ...lib.yingbian.condition.complex]);
		if (typeof conditional !== "string") throw new TypeError("The parameter type is incorrect");
		if (!Array.from(newConditions.keys()).includes(conditional)) throw new Error("The conditional does not exist");
		const targetCondition = newConditions.get(conditional);
		return event.forceYingbian === true ? true : targetCondition(event);
	}

	/**
	 * @description: 重新隐匿
	 * @param {boolean} noChange 是否不改变体力/体力上限
	 * @return {void}
	 */
	async reUnseen(noChange) {
		var player = this;
		var name = player.name || player.name1;
		let skillName = "noChangeSJZX_mark" + name;
		if (noChange != false) {
			lib.skill[skillName] = {
				charlotte: true,
				mark: true,
				intro: {
					content: "隐匿前体力值",
				},
			};
			lib.translate[skillName] = `${player.hp}/${player.maxHp}`;
			player.storage[skillName] = {
				hp: player.hp,
				maxHp: player.maxHp,
			};
			player.addTempSkill(skillName, { player: "showCharacterAfter" });
			player
				.when("showCharacterAfter")
				.then(() => {
					player.hp = hp;
					player.maxHp = maxHp;
					delete player.storage[skillName];
				})
				.vars({
					hp: player.hp,
					maxHp: player.maxHp,
					skillName: skillName,
				});
			// .emb({ firstDo: true });
		}
		if (name && lib.character[name]) {
			player.storage.rawHp = player.hp;
			player.storage.rawMaxHp = player.maxHp;
			player.hp = 1;
			player.maxHp = 1;
			player.update();
			var skills = lib.character[name][3];
			if (player.name2) {
				for (var i of lib.character[player.name2][3]) {
					skills.add(i);
				}
			}
			for (var i = 0; i < skills.length; i++) {
				if (!lib.translate[skills[i] + "_info"]) {
					skills.splice(i--, 1);
				}
			}
			for (var i of skills) {
				player.removeSkill(i);
			}
			if (!player.hiddenSkills) player.hiddenSkills = [];
			player.hiddenSkills.addArray(skills);
			player.classList.add("unseen");
			if (player.name2) player.classList.add("unseen2");
			player.name = "unknown";
			if (!player.node.name_seat && !_status.video) {
				player.node.name_seat = ui.create.div(".name.name_seat", get.verticalStr(get.translation(player.name)), player);
				player.node.name_seat.dataset.nature = get.groupnature(player.group);
			}
			player.sex = "male";
			player.storage.nohp = true;
			player.node.hp.hide();
			player.update();
		}
		if (noChange != false) {
			setTimeout(() => {
				let text = document.querySelector(".mark-text.small-text");
				if (text && text.textContent) text.textContent = lib.translate[skillName];
			}, 500);
		}
	}

	adjustHandCardTo(num) {
		if (typeof num !== "number") return console.error("ERROR:num must be number!");
		let differ = this.countCards("h") - num;
		if (differ > 0) this.chooseToDiscard(true, `请弃置${get.cnNumber(this.countCards("h") - num)}张牌`, differ);
		else if (differ < 0) this.draw(Math.abs(differ));
	}

	canUseCardAtt(card, isfriend, distance) {
		if (distance === undefined) distance = true;
		if (isfriend === undefined) isfriend = true;
		return game.hasPlayer(current => {
			var att = get.attitude(current, this);
			return this.canUse(card, current, distance) && (isfriend == true ? att > 0 : att < 0);
		});
	}

	getNumberInRange() {
		var num = 0,
			players = game.filterPlayer();
		for (var i = 0; i < players.length; i++) {
			if (this.inRange(players[i])) {
				num++;
			}
		}
		return num;
	}

	/**
	 * @param {string} mark
	 * @param {string} path
	 * @param {boolean} bool
	 * @description 改变标记图片
	 */
	changeMarkImage(mark, path, bool = false) {
		if (bool) path = 'url("' + path + '")';
		else path = 'url("extension/驶舰之向/image/orther/' + path + '.png")';
		if (this.marks[mark]) {
			this.marks[mark].style.backgroundImage = path;
		}
	}

	recastCount() {
		if (!this.storage._recastGain || typeof this.storage._recastGain != "number") return 0;
		return this.storage._recastGain;
	}

	isAction() {
		var history = this.actionHistory;
		for (var i = history.length - 1; i >= 0; i--) {
			if (history[i].isMe) return true;
			if (history[i].isRound) break;
		}
		return false;
	}

	removeAllmark(str, bool = true) {
		this.unmarkSkill(str);
		if (bool == false) {
			return this.removeMark(str, this.countMark(str), false);
		} else return this.removeMark(str, this.countMark(str));
	}

	isTypeExpansions(str, type) {
		if (
			this.getExpansions(str).filter(function (magic) {
				return get.type2(magic) == type;
			}).length
		)
			return true;
		return false;
	}

	isPhase(phase, notmeisok) {
		if (!notmeisok && _status.currentPhase != this) return false;
		return _status.event.name == phase || _status.event.getParent(phase).name == phase;
	}

	canUseToAnyone(card, distance = true, includeme = true) {
		if (typeof card == "string") card = { name: card, isCard: true };
		for (var i = 0; i < game.players.length; i++) {
			if (includeme == false && game.players[i] == this) continue;
			if (distance != false) {
				if (this.canUse(card, game.players[i], false)) {
					return true;
				}
			} else {
				if (this.canUse(card, game.players[i])) {
					return true;
				}
			}
		}
		return false;
	}

	isMaxHandCardLimit(equal) {
		var nh = this.getHandcardLimit();
		for (var i = 0; i < game.players.length; i++) {
			if (game.players[i].isOut() || game.players[i] == this) continue;
			if (equal) {
				if (game.players[i].getHandcardLimit() >= nh) return false;
			} else {
				if (game.players[i].getHandcardLimit() > nh) return false;
			}
		}
		return true;
	}

	isMinHandCardLimit(equal) {
		var nh = this.getHandcardLimit();
		for (var i = 0; i < game.players.length; i++) {
			if (game.players[i].isOut() || game.players[i] == this) continue;
			if (equal) {
				if (game.players[i].getHandcardLimit() <= nh) return false;
			} else {
				if (game.players[i].getHandcardLimit() < nh) return false;
			}
		}
		return true;
	}

	getSkillsList(disable, tag) {
		if (disable !== true) disable = false;
		if (typeof tag === "string") tag = [tag];
		let player = this;
		var list = [];
		var listm = [];
		var listv = [];
		if (player.name1 != undefined) listm = lib.character[player.name1][3];
		else listm = lib.character[player.name][3];
		if (player.name2 != undefined) listv = lib.character[player.name2][3];
		listm = listm.concat(listv);
		var func = function (skill) {
			var info = get.info(skill);
			if (!info || info.charlotte) return false;
			if (Array.isArray(tag)) {
				for (var i of tag) {
					if (info[i]) return false;
				}
			}
			return true;
		};
		for (var i = 0; i < listm.length; i++) {
			if (func(listm[i])) list.add(listm[i]);
		}
		if (player.disabledSkills && disable) {
			for (var key in player.disabledSkills) {
				list.remove(key);
			}
		}
		return list;
	}
};