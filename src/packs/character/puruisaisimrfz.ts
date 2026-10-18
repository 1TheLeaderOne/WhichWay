import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("puruisaisimrfz", { pack: "plotSJZX", sex: "female", group: "qianmrfz", hp: 3, skills: ["qianmianmrfz", "neihuamrfz"] });

skill({
	qianmianmrfz: {
		audio: 2,
		trigger: { player: ["chooseToUseBegin", "chooseToRespondBegin"] },
		getResAndUseCard(event, player) {
			let result: string[] = [];
			for (let name of lib.inpile) {
				if (event.filterCard && event.filterCard({ name: name, suit: "none", number: null }, player, event)) result.add(name);
			}
			return result;
		},
		hiddenCard(player, name) {
			return player.countCards("h") > 0;
		},
		filter(event, player) {
			return ((event.respondTo && event.respondTo[0] !== player) || event.type === "wuxie") && player.countCards("h") > 0 && lib.skill.qianmianmrfz.getResAndUseCard(event, player).length > 0;
		},
		forced: true,
		async content(event, trigger, player) {
			let names = lib.skill.qianmianmrfz.getResAndUseCard(trigger, player);
			let cardx = trigger.card;
			if (names.length === 1) {
				player
					.when({ player: ["chooseToUseAfter", "chooseToRespondAfter"] })
					.step(async (event, trigger, player) => {})
					.assign({
						mod: {
							cardname(card:Card, player, name) {
								if (card.name !== cardx.name) return names[0];
							},
						},
					});
			}
		},
	},
	neihuamrfz: {
		audio: 2,
		trigger: { player: ["useCardAfter", "respondAfter"] },
		// @ts-ignore
		init(player, skill) {
			player.storage.neihuamrfz = [];
			lib.translate["neihuamrfzx"] = "信息流";
		},
		filter(event, player) {
			let nameList = player.getExpansions("neihuamrfz").map(card => card.name);
			// @ts-ignore
			return !nameList.includes(event.card.name) && !event.cards.some(card => card.neihuamrfz);
		},
		forced: true,
		mark: true,
		marktext: "信息流",
		intro: {
			name: "信息流",
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile({cards});
		},
		// @ts-ignore
		async content(event, trigger, player) {
			let card = trigger.card;
			let cardcopy = ui.create.card();
			let info = ["none", null, get.name(card), get.nature(card), undefined];
			// @ts-ignore
			cardcopy.init(info);
			// @ts-ignore
			cardcopy.neihuamrfz = true;
			// @ts-ignore
			player.addToExpansion(cardcopy, player, "give").gaintag.add("neihuamrfz");
		},
		group: ["neihuamrfz_snyc", "neihuamrfz_destroy", "neihuamrfz_snyc_lose"],
		subSkill: {
			destroy: {
				silent: true,
				charlotte: true,
				trigger: {
					global: ["loseEnd", "cardsDiscardEnd"],
				},
				// @ts-ignore
				filter(event, player) {
					if (event.name == "lose" && event.position != ui.discardPile) return false;
					for (let card of event.cards) {
						// @ts-ignore
						if (card.neihuamrfz) return true;
					}
					return false;
				},
				// @ts-ignore
				async content(event, trigger, player) {
					let cards = [];
					for (let card of trigger.cards) {
						// @ts-ignore
						if (card.neihuamrfz) cards.push(card);
					}
					game.cardsGotoSpecial(cards);
					game.log(cards, "被移出了游戏");
				},
			},
			snyc: {
				silent: true,
				charlotte: true,
				trigger: {
					player: ["addToExpansionAfter"],
				},
				// @ts-ignore
				filter(event, player) {
					// @ts-ignore
					return event.cards.some(card => card.neihuamrfz);
				},
				// @ts-ignore
				async content(event, trigger, player) {
					// @ts-ignore
					let cards = trigger.cards.filter(card => card.neihuamrfz);
					let cardsx = cards.map(card => {
						let cardx = ui.create.card();
						// @ts-ignore
						cardx.init(get.cardInfo(card));
						// @ts-ignore
						cardx._cardid = card.cardid;
						// @ts-ignore
						cardx.neihuamrfz = true;
						return cardx;
					});
					player.directgains(cardsx, null, "neihuamrfzx");
				},
			},
			snyc_lose: {
				silent: true,
				charlotte: true,
				trigger: {
					player: ["loseBegin"],
				},
				// filter 返回数组恒真（空数组也为真），要用 some 才会在没有内化牌时不触发
				filter(event, player) {
					return event.cards.some(card => card.neihuamrfz);
				},
				// @ts-ignore
				async content(event, trigger, player) {
					let cards = trigger.cards;
					let loseCards = player.getExpansions("neihuamrfz").filter(card => {
						// @ts-ignore
						return cards.some(cardt => cardt._cardid === card.cardid);
					});
					game.cardsGotoSpecial(loseCards, false);
				},
			},
		},
	},
	bianyimrfz: {
		audio: 4,
		trigger: {
			global: "roundStart",
			source: "damageEnd",
		},
		GetAllSkills(player) {
			let list = {};
			let ownSkills = get.translation(player.getSkills(true, false, false));
			for (let key in lib.character) {
				if (!lib.character[key][3]) continue;
				let skills = lib.character[key][3];
				for (let i of skills) {
					if (!lib.translate[i]) continue;
					if (ownSkills.includes(lib.translate[i])) continue;
					list[i] = lib.translate[i];
				}
			}
			return list;
		},
		async content(event, trigger, player) {
			// ------------------------- 工具函数 -------------------------

			/**
			 * 从对象中随机取出指定数量的、互不重复的键
			 * @param {Record<string, any>} obj 源对象
			 * @param {number} num 需要取出的键数量
			 * @returns {string[]} 随机选中的键名数组
			 */
			function getRandomKeys(obj, num) {
				let keys = Object.keys(obj);
				let selectedKeys: any[] = [];
				for (let i = 0; i < num; i++) {
					let randomIndex = Math.floor(Math.random() * keys.length);
					selectedKeys.push(keys[randomIndex]);
					keys.splice(randomIndex, 1);
				}
				return selectedKeys;
			}

			/**
			 * 从字符串数组中提取所有不重复的中文字符
			 * @param {string[]} arr 字符串数组
			 * @returns {string[]} 去重后的中文字符数组
			 */
			function extractChineseCharacters(arr) {
				let chineseRegex = /[\u4e00-\u9fa5]/g;
				/** @type {Set<string>} */
				let chineseSet = new Set();

				arr.forEach(function (str) {
					let chineseChars = str.match(chineseRegex);
					if (chineseChars) {
						chineseChars.forEach(function (char) {
							chineseSet.add(char);
						});
					}
				});
				return Array.from(chineseSet);
			}

			/**
			 * 从数组中随机取出指定数量的、互不重复的元素
			 * @param {any[]} arr 源数组
			 * @param {number} num 需要取出的元素数量
			 * @returns {any[]} 随机选出的元素数组
			 */
			function getRandomElements(arr, num) {
				/** @type {any[]} */
				let result: any[] = [];
				let len = arr.length;
				/** @type {number[]} */
				let indices: any[] = [];

				for (let i = 0; i < len; i++) {
					indices.push(i);
				}

				for (let j = 0; j < num; j++) {
					let randomIndex = Math.floor(Math.random() * indices.length);
					let index = indices[randomIndex];
					result.push(arr[index]);
					indices.splice(randomIndex, 1);
				}
				return result;
			}

			/**
			 * 在字符集合中寻找两两组合后能命中技能名的词
			 * @param {string[]} arrA 可组成的技能中文名集合
			 * @param {string[]} arrB 可用的中文字符集合
			 * @returns {string[]} 所有能组成的技能名
			 */
			function findWordCombinations(arrA, arrB) {
				/** @type {string[]} */
				let combinations: string[] = [];

				for (let i = 0; i < arrB.length - 1; i++) {
					for (let j = i + 1; j < arrB.length; j++) {
						let word1 = arrB[i] + arrB[j];
						let word2 = arrB[j] + arrB[i];
						// console.log(word1, word2);
						if (arrA.includes(word1)) {
							combinations.push(word1);
						}
						if (arrA.includes(word2)) {
							combinations.push(word2);
						}
					}
				}
				return combinations;
			}

			/**
			 * 通过值反查对象中对应的键
			 * @param {Record<string, any>} obj 源对象
			 * @param {any} value 目标值
			 * @returns {string[] | null} 匹配到的键数组；未找到时返回 null
			 */
			function findKeysByValue(obj, value) {
				let keys: string[] = [];
				for (let key in obj) {
					if (obj[key] && obj[key] === value) {
						keys.push(key);
					}
				}
				if (keys.length == 0) return null;
				return keys;
			}

			/**
			 * AI 自动选择能够拼出技能的汉字
			 * @param {[number, string][]} list 汉字列表（[索引, 汉字]）
			 * @param {any} findWord 可组成的技能结果集合
			 * @returns {number[]} 被选中元素的索引数组
			 */
			function autoChoose(list, findWord) {
				/** @type {number[]} */
				let index: number[] = [];
				// 注意：为避免与外层形参 list 冲突（let 不允许重复声明），此处更名为 listValues
				let listValues = list.map(i => i[1]);
				let findWordChars = findWord.randomGet();
				for (let i of findWordChars) {
					for (let j = 0; j < listValues.length; j++) {
						if (i != listValues[j]) continue;
						index.push(j);
					}
				}
				return index;
			}

			/**
			 * 获取完全无法参与组成技能的汉字索引
			 * @param {[number, string][]} arr 汉字列表（[索引, 汉字]）
			 * @param {string[]} skills 可组成的技能名集合
			 * @returns {number[]} 无法组成技能的汉字索引
			 */
			function getCannotCharacters(arr, skills) {
				/** @type {number[]} */
				let index: number[] = [];
				let listValues = arr.map(i => i[1]);
				for (let name of skills) {
					for (let j of name) {
						for (let k = 0; k < listValues.length; k++) {
							if (j != listValues[k]) continue;
							index.push(k);
						}
					}
				}
				return index;
			}

			// ------------------------- 技能部分 -------------------------

			/** @type {string[]} 全部技能的中文名集合 */
			let allCNSkills: string[] = [];
			/** @type {Record<string, string>} 玩家尚未拥有的技能映射（键为技能 id，值为中文名） */
			let ENSkills = lib.skill.bianyimrfz.GetAllSkills(player);
			for (let key in ENSkills) {
				allCNSkills.push(ENSkills[key]);
			}

			// 提前声明，使 while 循环结束后依然可以访问
			/** @type {string[]} 随机抽取的候选汉字 */
			let randomCN;
			/** @type {string[]} 当前候选汉字可组成的技能名 */
			let findWord;

			// 性能挑战（划掉）
			//技能库不够大时可能永远凑不满 15 个组合，原来的 while(true) 会重抽到死把整局卡住，这里给 200 次兜底
			let tries = 0;
			while (++tries <= 200) {
				let skillsList = getRandomKeys(lib.skill.bianyimrfz.GetAllSkills(player), 100);
				/** @type {string[]} */
				let CNSkills: string[] = [];
				for (let i of skillsList) {
					CNSkills.add(get.translation(i));
				}
				let CNCharacters = extractChineseCharacters(CNSkills);
				randomCN = getRandomElements(CNCharacters, Math.min(CNCharacters.length, 50));
				findWord = findWordCombinations(allCNSkills, randomCN);
				// 保底技能数 默认15 不给调了喵
				let num = 15;
				if (findWord.length > num) break;
			}

			/** @type {[number, string][]} 候选汉字列表 */
			let list: [number, string][] = [];
			// @ts-ignore
			for (let i = 0; i < randomCN.length; i++) {
				list[i] = [i, randomCN[i]];
			}
			if (list.length == 0) {
				player.popup("纳尼？没有技能了？！");
				return;
			}

			/**
			 * 计算 AI 不能选择的汉字索引
			 * @param {[number, string][]} list 汉字列表
			 * @returns {number[]} 不可选的索引数组
			 */
			let fun1 = list => {
				// 不给调了喵
				let per = 75;
				if (per == 0) return [];
				//per 是百分数，直接乘会算出 75 倍长度，getRandomElements 取超量时会补进一堆 undefined，等于没抽样
				let filterEnd = getRandomElements(list, Math.floor(list.length * (per / 100)));
				return filterEnd;
			};

			game.broadcastAll(function (player) {
				//@ts-ignore
				player.forceCountChoose = { chooseButton: 30 };
			}, player);

			/** @type {any[]} 选择按钮列表 */
			let buttonList: any[] = [`编译:请选择至少两个汉字（推荐选两个汉字）`];
			let count = 0;
			for (let i = 0; i < Math.ceil(list.length / 10); i++) {
				buttonList.push([list.slice(count, count + 10 >= list.length ? list.length : count + 10), "tdnodes"]);
				count += 10;
			}
			buttonList.push(`存在有${findWord.length}个技能`);

			/** @type {{ links: number[] }} */
			const { links } =
				event.isMine() == false
					? { links: autoChoose(list, findWord) }
					: await player
							.chooseButton({ createDialog: buttonList })
							.set("forced", true)
							.set("selectButton", [2, Infinity])
							.set("filterButton", function (button) {
								// 注意：为避免与外层 list 冲突，此处更名为 cannotList
								let cannotList = _status.event.cannot;
								if (cannotList.length == 0) return true;
								if (cannotList.includes(button.link)) return true;
								return false;
							})
							.set("ai", () => {
								//@ts-ignore
								_status.tmp_PRTS_endTime = true;
							})
							.set("cannot", fun1(getCannotCharacters(list, findWord)))
							.forResult();

			game.broadcastAll(function (player) {
				//@ts-ignore
				delete player.forceCountChoose;
			}, player);

			/** @type {string} 玩家最终拼出的技能中文名 */
			let CsSkill: string = "";

			/**
			 * 失败提示 & 日志输出
			 * @param {any} player 当前玩家
			 * @param {boolean} [end=false] 是否为超时结束
			 * @returns {void}
			 */
			let fun2 = (player, end = false) => {
				if (!end) player.popup(`没有${CsSkill}`);
				else player.popup(`时间耗尽`);
				game.log(`可组成的技能有:${findWord}`);
			};

			// @ts-ignore
			if (!links || _status.tmp_PRTS_endTime) {
				fun2(player, true);
				// @ts-ignore
				delete _status.tmp_PRTS_endTime;
				return;
			}

			// @ts-ignore
			for (let i of links) {
				CsSkill = CsSkill + list[i][1];
			}
			/** @type {string[] | null} 与拼出名称对应的技能 id 列表 */
			let findkey = findKeysByValue(ENSkills, CsSkill);
			if (findkey != null) {
				/** @type {string[]} 各同名技能的描述文本 */
				let introSkills: string[] = [];
				for (let i of findkey) {
					introSkills.push(get.skillInfoTranslation(i));
				}
				/** @type {{ index: number }} */
				const { index } =
					findkey.length == 1
						? { index: 0 }
						: await player
								.chooseControl()
								.set("choiceList", introSkills)
								.set("prompt", `请选择一个版本的【${get.translation(findkey[0])}】`)
								// @ts-ignore
								.set("ai", () => get.rand(0, findkey.length - 1))
								.forResult();
				if (!index && index != 0) return;
				let info = get.info(findkey[index]);
				if (!info.audioname2) info.audioname2 = {};
				info.audioname2[player.name] = "bianyimrfz";
				player.addSkill(findkey[index]);
			} else {
				fun2(player);
			}
		},
	},
});

translate({
	puruisaisimrfz: "普瑞赛斯",
	qianmianmrfz: "千面",
	qianmianmrfz_info: "锁定技，当你成为牌的目标时或你需要使用【无懈可击】时，你所有的手牌均视为可以响应此牌的牌直到此牌结算完毕。",
	neihuamrfz: "内化",
	neihuamrfz_info: "锁定技。<br>当你使用或打出牌后，若“信息流”中没有与此牌相同牌名的牌，你创建一张与此牌名相同且无花色和点数的牌置入“信息流”之中；<br>你如手牌般使用或打出“信息流”中的牌，且当“信息流”中的牌进入弃牌堆后，销毁之。",
	bianyimrfz: "编译",
	bianyimrfz_info: "每轮开始时或你造成伤害后，你可以随机抽取100个技能名，从这100个技能名随机抽取50个汉字，然后你在30秒内从这些汉字中选择两个汉字，使其组成一个技能名，若此技能名存在于技能库中，你获得此技能。",
});

characterTitle("puruisaisimrfz", "<font color=#77be6a>女祭司</font>");

characterIntro("puruisaisimrfz", "博士面对石棺的回忆中的神秘女性人物，是源石的起点，曾与博士亲密无间。");
