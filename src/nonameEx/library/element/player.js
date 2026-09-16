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

	/**
	 * 从传入的牌中选牌（假牌版）。
	 *
	 * 把 `params.cards` 里的每张牌复制成一张**假牌**直接置入自己的手牌（`directgains`，不触发获得事件），
	 * 玩家从这些假牌中挑选；选择期间自己的真实手牌会被折叠成只露左边缘的重叠条
	 * （鼠标悬停 / 触屏点选被折叠的牌可以展开查看），假牌则按正常间距平铺。
	 * 选择结束后假牌被全部删除、手牌布局完全复原。
	 *
	 * **参数是一个对象，字段与本体 `chooseCard` 一致**（`EventChooseCardParams`），另外多一个必填的 `cards`：
	 * - `cards`（必填）供玩家选择的牌，由 `Card` / `VCard` 原对象组成的数组；
	 * - `selectCard` 选择数量或范围（`number` 或 `[begin, end]`，`-1` 表示全选），默认 `[1, 1]`；
	 * - `filterCard` 可选牌过滤（函数 / `get.filter` 用的对象 / `true`），默认 `lib.filter.all`；
	 * - `ai` AI 选牌评分函数，默认 `get.unuseful3`；
	 * - `forced` 是否强制选择，默认 false；
	 * - `prompt` / `prompt2` / `promptx` 提示内容；
	 * - `complexCard` / `complexSelect` / `allowChooseAll` / `filterOk` / `hsskill` / `type` 与 `chooseCard` 同义；
	 * - `glow_result` 选完后高亮结果，注意高亮的是**原牌**（`result.links`），而不是选完即被删除的假牌；
	 * - `tagName` 假牌 gaintag 的显示名：临时写进 `lib.translate`（引擎会把 gaintag 的翻译渲染在牌面上），
	 *   选完还原；默认取事件名，常传技能名，这样牌面上显示技能的中文名；
	 * - `position` 会被忽略：内部固定用 `"s"`（假牌所在的特殊区），以免误选真手牌。
	 *
	 * 与旧做法的区别：
	 * - 临时牌走 `directgains` 带 gaintag，归入「特殊区」，因此**不污染真实手牌数据**
	 *   （`countCards("h")` / 手牌上限 / 弃牌结算都只看到真牌）。
	 * - `result.cards` 是玩家选中的假牌，它们对应的原牌（Card 或 VCard）放在 `result.links` 里。
	 *
	 * @param { import("@/library/element/Player/type.d").EventChooseCardParams & { cards: Array<Card|VCard> } } params 参数对象，见上方说明
	 * @returns { GameEvent } 可链式 `.set(...)`、可 `.forResult()` 的事件；
	 * result 形态与 `chooseCard` 一致（cards / targets / buttons / links / confirm / bool）。
	 * 其中 `result.cards` 是玩家选中的**假牌**（与本体语义相同），而这些假牌选完即被删除，
	 * 它们对应的真实值（调用方传入的 Card / VCard）放在 `result.links` 里；
	 * 玩家未做出选择时 `result.bool` 为 false、`result.cards` 与 `result.links` 都是空数组。
	 *
	 * @example
	 * ```js
	 * const cards = player.getCards("h");
	 * const result = await player
	 * 	.chooseFakeCard({ cards, selectCard: 1, prompt: "请选择一张手牌" })
	 * 	.forResult();
	 * // result.cards[0] 是玩家选中的假牌，result.links[0] 才是 cards 里的那一张原牌
	 * ```
	 */
	chooseFakeCard(params) {
		const next = game.createEvent("chooseFakeCard");
		next.player = this;

		//参数处理与本体 chooseCard 一致
		Object.assign(next, params);
		if (next.filterCard != null && typeof next.filterCard === "object") {
			next.filterCard = get.filter(next.filterCard);
		}
		if (typeof next.selectCard === "number") {
			next.selectCard = [next.selectCard, next.selectCard];
		}
		if (params != null && params.prompt != null) {
			delete next.prompt;
			get.evtprompt(next, params.prompt);
		}
		//cards 必须是一组牌；顺手复制一份，避免调用方之后改动原数组
		next.cards = Array.isArray(next.cards) ? next.cards.slice(0) : [];
		if (next.filterCard == undefined) {
			next.filterCard = lib.filter.all;
		}
		if (next.selectCard == undefined) {
			next.selectCard = [1, 1];
		}
		if (next.ai == undefined) {
			next.ai = get.unuseful3;
		}
		next.setContent("chooseFakeCard");
		next._args = [params];
		return next;
	}

	/**
	 * 同时选择角色（目标）与选项。
	 *
	 * 交互形态：**选项渲染在 `ui.control`（`#control`）里**，与引擎的「确定」同栏（与本体
	 * `chooseControl` 的 controlbar 形态一致），角色仍在战场点选；选项支持随已选目标动态变化
	 * （`controls` 可写成函数）。
	 *
	 * **必须同时选定目标与选项才会结束**：
	 * - 「确定」由引擎生成并被门控 —— 只有已点选选项（或该目标确实没有可选项）才会出现，
	 *   目标数不满足 `selectTarget` 范围时同样不会出现；
	 * - 「取消」按钮被隐藏（`fakeforce`），所以**没有**"只选目标、不选选项"就结束的路径；
	 * - 需要允许玩家放弃的调用方，请在 `controls` 里自己加 `"cancel2"` —— 点它即取消
	 *   （立即结束，`bool=false`、`control="cancel2"`、`confirm="cancel"`，与本体 `chooseControl` 一致）。
	 *
	 * 参数（对象式，全部可选）：
	 * - `filterTarget` / `selectTarget` / `filterOk` / `ai` / `forced` / `hsskill`：与本体 `chooseTarget` 完全一致；
	 * - `controls`：选项列表，`string[]`；也可写成 `(targets: Player[]) => string[]` 以随已选目标动态生成；
	 * - `choiceList`：等价于 `controls`（展示时会过 `get.translation`，值仍取原字符串）；
	 * - `controlAi`：AI 选择选项的方式，`(event, player) => number | string`（number 取 `controls` 下标；缺省取第一个选项）；
	 * - `prompt` / `prompt2`：对话框提示（`prompt` 支持 `get.evtprompt` 的 `"提示|提示2"` 写法）。
	 *
	 * 结果（`result`）：
	 * - `bool`：**同时**选中了目标与选项（且选项不是 `"cancel2"`）才为 true（任一环节缺失都为 false）；
	 * - `targets`：选中的角色。目标已选但未选选项（或选了 `"cancel2"` 取消）时**仍会保留**，便于调用方区分
	 *   “完全没选人”与“选了人没选选项”；目标本身未选/被取消时为空数组；
	 * - `control`：选中的选项原字符串（未选为 `undefined`；`"cancel2"` 视为取消）；
	 * - `index`：`control` 在当时的选项列表中的下标（未选为 -1）；
	 * - `confirm`：`"ok"` / `"cancel"`，与本体语义一致。
	 *
	 * @example
	 * ```js
	 * const result = await player
	 * 	.chooseTargetControl({
	 * 		filterTarget: (card, player, target) => target != player,
	 * 		selectTarget: 1,
	 * 		prompt: "选择一名角色，再选择一项",
	 * 		//想允许玩家放弃时，把 "cancel2" 也放进来（点它即取消，与 chooseControl 一致）
	 * 		controls: targets => (targets[0]?.countCards("h") > 0 ? ["弃置其一张牌", "令其摸一张牌"] : ["令其摸一张牌"]),
	 * 	})
	 * 	.forResult();
	 * if (result.bool) {
	 * 	// result.targets[0] 是选中的角色，result.control 是选中的选项
	 * }
	 * ```
	 */
	chooseTargetControl(params) {
		const next = game.createEvent("chooseTargetControl");
		next.player = this;

		//参数处理与本体 chooseTarget 一致（仅对象式）
		Object.assign(next, params);
		if (typeof next.selectTarget === "number") {
			next.selectTarget = [next.selectTarget, next.selectTarget];
		}
		if (next.filterTarget == undefined) {
			next.filterTarget = lib.filter.all;
		}
		if (next.selectTarget == undefined) {
			next.selectTarget = [1, 1];
		}
		if (next.ai == undefined) {
			next.ai = get.attitude2;
		}
		//选项列表：controls 优先，其次 choiceList；两者都没有时视为“没有可选项”
		if (next.controls == undefined && Array.isArray(next.choiceList)) {
			next.controls = next.choiceList.slice();
		}
		if (next.controls == undefined) {
			next.controls = [];
		}
		//prompt 支持 "提示|提示2" 写法（与本体一致）
		if (params && params.prompt != null) {
			delete next.prompt;
			get.evtprompt(next, params.prompt);
		}
		next.setContent("chooseTargetControl");
		next._args = [params];
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
		else path = 'url("extension/WhichWay/image/skill/' + path + '.png")';
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