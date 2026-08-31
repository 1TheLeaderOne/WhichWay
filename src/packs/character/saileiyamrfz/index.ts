import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("saileiyamrfz", { pack: "legendSJZX",
			sex: "female",
			group: "lymrfz",
			hp: 3,
			maxHp: 4,
			skills: ["panshimrfz","newgaihuamrfz"],
		});

skill({
	"newgaihuamrfz": {
			audio: "gaihuamrfz",
			enable: ["chooseToUse", "chooseToRespond"],
			hiddenCard: function (player, name) {
				if (lib.inpile.includes(name) && !player.hasSkill("newgaihuamrfz_ban") && get.type(name) == "basic") return true;
			},
			filter: function (event, player) {
				if (event.responded || event.newgaihuamrfz || player.hasSkill("newgaihuamrfz_ban")) return false;
				for (var i of lib.inpile) {
					if (get.type(i) == "basic" && event.filterCard({ name: i }, player, event)) return true;
				}
				return false;
			},
			direct: true,
			async content(event, trigger, player) {
				let evt = event.getParent(2),
					storage = player.storage.newgaihuamrfz_clear;
				if (!evt) return;
				evt.set("newgaihuamrfz", true);
				let list = ["牌堆顶三张牌"],
					list2 = ["选项一"],
					hd = [];
				if (ui.discardPile.childNodes.length > 2) {
					list.add("弃牌堆顶三张牌");
					list2.add("选项二");
				} else list.add('<span style="opacity:0.5">弃牌堆顶三张牌(不可选:弃牌堆牌数小于3）</span>');
				for (var i of game.players) {
					if (get.distance(player, i) > 1) continue;
					if (i.countCards("h") < 1) continue;
					if (i == player) continue;
					hd = hd.concat(i.getCards("h"));
				}
				if (hd.length > 0) {
					list.add("与你距离不大于1的其他角色的手牌");
					list2.add("选项三");
				} else list.add('<span style="opacity:0.5">与你距离不大于1的其他角色的手牌(不可选:你距离不大于1的其他角色没有手牌）</span>');
				const { control } = await player
					.chooseControl(list2, "cancel2")
					.set("choiceList", list)
					.set("ai", function () {
						var list = _status.event.list,
							player = _status.event.player,
							hd = _status.event.hd;
						if (
							game.countPlayer(current => {
								return player != current && get.distance(player, current) <= 1 && get.distance(player, current) < 0;
							}) < 1 ||
							hd.length < 3
						)
							list.remove("选项三");
						if (list.length == 0) return "cancel2";
						return list.randomGet();
					})
					.set("list", list2)
					.set("hd", hd)
					.forResult();
				if (!control || control == "cancel2") {
					evt.goto(0);
					return;
				}
				var cards = [];
				switch (control) {
					case "选项一":
						//@ts-ignore
						cards = get.cards(3, true);
						break;
					case "选项二":
						var num = 3;
						while (num--) {
							if (ui.discardPile.hasChildNodes() == false) {
								break;
							}
							//@ts-ignore
							var cardx = ui.discardPile.removeChild(ui.discardPile.firstChild);
							//@ts-ignore
							cardx.original = "d";
							cards.push(cardx);
						}
						for (let i = cards.length - 1; i >= 0; i--) {
							ui.discardPile.insertBefore(cards[i], ui.discardPile.firstChild);
						}
						break;
					case "选项三":
						cards = hd;
						break;
				}
				const { links } = await player
					.chooseButton(["【钙化】:选择要" + (evt.name == "chooseToUse" ? "使用" : "打出") + "的牌", cards])
					.set("filterButton", function (button) {
						var player = _status.event.player,
							event = _status.event;
						return _status.event.cards.includes(button.link);
					})
					.set(
						"cards",
						cards.filter(function (card) {
							if (get.type(card) != "basic") return false;
							return evt.filterCard(card, evt.player, evt);
						})
					)
					.set("ai", function (button) {
						var evt = _status.event.getParent(3);
						if (evt && evt.ai) {
							var tmp = _status.event;
							_status.event = evt;
							var result = (evt.ai || event.ai1)(button.link, _status.event.player, evt);
							_status.event = tmp;
							return result;
						}
						return 1;
					})
					.forResult();
				if (!links) {
					evt.goto(0);
					return;
				}
				var card = links[0],
					name = links[0].name;
				if (_status.currentPhase == player)
					player.addTempSkill("newgaihuamrfz_ban", {
						global: "phaseBeginStart",
					});
				if (evt.name == "chooseToUse") {
					game.broadcastAll(
						function (result, name) {
							lib.skill.newgaihuamrfz_backup.viewAs = {
								name: name,
								cards: [result],
								isCard: true,
							};
						},
						card,
						name
					);
					let evtx = event.getParent(2);
					if (!evtx) return;
					evtx.set("_backupevent", "newgaihuamrfz_backup");
					evtx.set("openskilldialog", "请选择" + get.translation(card) + "的目标");
					evtx.backup("newgaihuamrfz_backup");
					//@ts-ignore
					player.logSkill("gaihuamrfz");
				} else {
					delete evt.result.skill;
					delete evt.result.used;
					evt.result.card = get.autoViewAs(card);
					evt.result.cards = [card];
					//@ts-ignore
					player.logSkill("gaihuamrfz");
					evt.redo();
					return;
				}
				evt.goto(0);
			},
			ai: {
				effect: {
					target: function (card, player, target, effect) {
						if (get.tag(card, "respondShan")) return 0.7;
						if (get.tag(card, "respondSha")) return 0.7;
					},
				},
				order: 11,
				respondShan: true,
				respondSha: true,
				result: {
					player: function (player) {
						if (_status.event.dying) return get.attitude(player, _status.event.dying);
						return 1;
					},
				},
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
	"panshimrfz": {
			mod: {
				targetEnabled: function (card, player, target) {
					for (var i of game.players) {
						if (i.getHistory("useCard").length > 0) return;
					}
					return false;
				},
			},
			audio: 2,
			forced: true,
			trigger: { player: "useCard" },
			filter: function (event, player) {
				if (player.getHistory("useCard").length > 1) return false;
				return (
					event.card &&
					//@ts-ignore
					(get.type2(event.card) == "trick" || (get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name)))
				);
			},
			async content(event, trigger, player) {
				//@ts-ignore
				trigger.directHit.addArray(
					game.filterPlayer(function (current) {
						return current != player;
					})
				);
			},
		},
});

translate({
	"saileiyamrfz": "塞雷娅",
	"newgaihuamrfz": "钙化",
	"newgaihuamrfz_info": "每回合限一次，当你需要使用基本牌时，你可以选择观看：</br>①牌堆顶三张牌；</br>②弃牌堆顶三张牌；</br>③与你距离不大于1的其他角色的手牌；</br>若你观看的牌中有此牌，你可以使用或打出之，若当前回合角色不为你，则视为未发动过此技能。",
	"panshimrfz": "磐石",
	"panshimrfz_info": "锁定技，你不能成为每回合第一张牌的目标；你每回合使用的第一张牌不可被其他角色响应。",
});

characterTitle("saileiyamrfz", "<font color=#FFF68F>守望者</font>");

characterIntro("saileiyamrfz", "塞雷娅，前莱茵生命防卫科主任。于生命科学、微生物学、源石技艺等领域皆有建树，同时于歼灭战、要员保全、异常事态处理等任务中表现出强大实力。</br>目前与罗德岛在科研等多个领域皆有合作，同时，正与罗德岛针对深入合作计划进行磋商。");
