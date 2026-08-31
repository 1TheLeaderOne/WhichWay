import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("yumrfz", {
			sex: "male",
			group: "suimrfz",
			hp: 4,
			skills: ["qizaomrfz","zhonglemrfz"],
			pack:"legendSJZX",
		});

skill({
	"zhonglemrfz": {
			init(player) {
				game.broadcastAll(() => {
					lib.translate["zhonglemrfz_tag"] = "判定区";
					lib.card.wugu.content = async function (event, trigger, player) {
						let result;
						const target = event.target;
						const card = event.card;

						// step 0
						for (let i = 0; i < ui.dialogs.length; i++) {
							//@ts-ignore
							if (ui.dialogs[i].videoId === event.preResult) {
								event.dialog = ui.dialogs[i];
								break;
							}
						}
						if (!event.dialog || event.dialog.buttons.length === 0) {
							return;
						}
						if (event.dialog.buttons.length > 1) {
							let num = 1;
							if (card.storage && typeof card.storage.extraChooseNum === "number") {
								num += card.storage.extraChooseNum;
							}
							const next = target.chooseButton(true);
							next.set("ai", button => {
								const aiPlayer = _status.event.player;
								const btnCard = button.link;
								let val = get.value(btnCard, aiPlayer);
								if (get.tag(btnCard, "recover")) {
									val += game.countPlayer(t => {
										return t.hp < 2 && get.attitude(aiPlayer, t) > 0 && lib.filter.cardSavable(btnCard, aiPlayer, t);
									});
									//@ts-ignore
									if (aiPlayer.hp <= 2 && game.checkMod(btnCard, aiPlayer, "unchanged", "cardEnabled2", aiPlayer)) val *= 2;
								}
								return val;
							});
							next.set("selectButton", num);
							next.set("dialog", event.preResult);
							next.set("closeDialog", false);
							next.set("dialogdisplay", true);
							result = await next.forResult();
						} else {
							event.directButton = event.dialog.buttons;
						}

						// step 1
						const dialog = event.dialog;
						let cards = [];
						if (event.directButton) {
							cards = event.directButton.map(i => i.link);
						} else {
							for (const i of dialog.buttons) {
								if (result.links.includes(i.link)) {
									cards.push(i.link);
								}
							}
							if (!cards.length) cards = event.dialog.buttons.map(i => i.link);
						}
						let button;
						const buttons = [];
						for (let i = 0; i < dialog.buttons.length; i++) {
							if (cards.includes(dialog.buttons[i].link)) {
								button = dialog.buttons[i];
								button.querySelector(".info").innerHTML = (t => {
									if (t._tempTranslate) return t._tempTranslate;
									const name = t.name;
									if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
									return get.translation(name);
								})(target);
								buttons.push(button);
							}
						}
						dialog.buttons.remove(...buttons);
						const capt = get.translation(target) + "选择了" + get.translation(buttons.map(i => i.link));
						if (cards && cards.length > 0) {
							await target.gain(cards, "visible");
							target.$gain2(cards);
							game.broadcast(
								function (cards, id, name, capt) {
									var dialog = get.idDialog(id);
									if (dialog) {
										//@ts-ignore
										dialog.content.firstChild.innerHTML = capt;
										for (var i = 0; i < dialog.buttons.length; i++) {
											//@ts-ignore
											if (cards.includes(dialog.buttons[i].link)) {
												//@ts-ignore
												dialog.buttons[i].querySelector(".info").innerHTML = name;
												dialog.buttons.splice(i--, 1);
											}
										}
									}
								},
								cards,
								dialog.videoId,
								(t => {
									if (t._tempTranslate) return t._tempTranslate;
									const name = t.name;
									if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
									return get.translation(name);
								})(target),
								capt
							);
						}
						dialog.content.firstChild.innerHTML = capt;
						game.addVideo("dialogCapt", null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
						game.log(
							target,
							"选择了",
							buttons.map(i => i.link)
						);
						await game.delay();
					};
				});
			},
			audio: 2,
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			filter(event, player) {
				return player.countCards("j") > 0 && player.hasUseTarget({ name: "wugu" });
			},
			async cost(event, trigger, player) {
				if (player.isUnderControl(true) && !_status.auto) {
					var cards = player.getCards("j");
					var cardsx = cards.map(card => {
						var cardx = ui.create.card();
						//@ts-ignore
						cardx.init(get.cardInfo(card));
						//@ts-ignore
						cardx._cardid = card.cardid;
						return cardx;
					});
					await player.directgains(cardsx, null, "zhonglemrfz_tag");
					const { result } = await player.chooseCardTarget({
						prompt: "是否要发动【众乐】？",
						prompt2: "你可以将你判定区内任意牌当作至多指定相同目标数的【五谷丰登】使用",
						filterCard(card) {
							return card.hasGaintag("zhonglemrfz_tag");
						},
						selectCard: [1, Infinity],
						selectTarget: [1, Infinity],
						filterTarget(card, player, target) {
							return player.canUse("wugu", target);
						},
						filterOk() {
							return ui.selected.targets.length === ui.selected.cards.length;
						},
						position: "s",
					});
					var cards2 = player.getCards("s", card => card.hasGaintag("zhonglemrfz_tag"));
					if (player.isOnline2()) {
						player.send(
							function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) ui.updatehl();
							},
							cards2,
							player
						);
					}
					cards2.forEach(i => i.delete());
					if (player == game.me) ui.updatehl();
					event.result = result;
				} else {
					let cards = player.getCards("j");
					let targets = game.filterPlayer(target => get.attitude(player, target) > 0);
					cards.sort((a, b) => {
						return player.getUseValue(a) - player.getUseValue(b);
					});
					if (targets.length > cards.length) {
						targets = targets.splice(0, cards.length);
					}
					let result = {
						targets: targets,
						cards: cards.slice(0, targets.length),
						bool: true,
					};
					event.result = result;
				}
			},
			async content(event, trigger, player) {
				let { targets, cards } = event;
				if (player.isUnderControl(true) && !_status.auto)
					//@ts-ignore
					cards = cards.map(card => {
						let j = player.getCards("j");
						//@ts-ignore
						return j.find(i => i.cardid === card._cardid);
					});
				console.log(cards);
				await player.useCard(
					{
						name: "wugu",
						storage: {
							extraCardsNum: targets.length,
							extraChooseNum: 1,
						},
					},
					targets,
					cards,
					false
				);
			},
		},
	"qizaomrfz": {
			audio: 2,
			trigger: {
				player: "useCardAfter",
			},
			filter(event, player) {
				return !player
					.getCards("j")
					.map(i => get.suit(i))
					.includes(get.suit(event.card));
			},
			async content(event, trigger, player) {
				await player.draw();
				const { cards } = await player
					.chooseCard(true, "【起灶】:请蓄谋一次")
					.set("ai", card => {
						const player = get.player();
						if (player.hasValueTarget(card)) return player.getUseValue(card);
						return 0;
					})
					.set("tipText", true)
					.forResult();
				//@ts-ignore
				player.addJudge({ name: "xumou_jsrg" }, cards);
			},
		},
});

translate({
	"yumrfz": "余",
	"zhonglemrfz": "众乐",
	"zhonglemrfz_info": "准备阶段，你可以将你判定区内任意牌当作至多指定相同目标数的【五谷丰登】使用且亮出两倍于指定人数的牌，每个人选择两张牌。",
	"qizaomrfz": "起灶",
	"qizaomrfz_info": "当你使用一张牌后，若你判定区中没有与此牌花色相同牌，你可以摸一张牌并进行一次蓄谋。",
});

characterTitle("yumrfz", "<font color='#b8860b'>灶里乾坤</font>");

characterIntro("yumrfz", "余，炎国厨师，拥有丰富的烹饪经验。现通过审核，以访客身份驻留罗德岛以便探亲访友，同时也为罗德岛提供烹饪支持。");
