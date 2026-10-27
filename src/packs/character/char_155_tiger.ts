import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, dynamicTranslate } from "../hooks.ts";

character("char_155_tiger", { pack: "epicSJZX", sex: "female", group: "weimrfz", hp: 4, skills: ["suijiamrfz", "huquanmrfz"] });

skill({
	suijiamrfz: {
		init: function (player) {
			player.storage.suijiamrfz = {
				del: false,
				damage: 0,
			};
		},
		onremove: true,
		audio: ["3星结束行动","部署2"],
		trigger: { source: "damageBegin" },
		filter: function (event, player) {
			let isdel = player.storage.suijiamrfz["del"];
			return (isdel == false && event.player.hujia > 0) || isdel == true;
		},
		forced: true,
		intro:{
			content(storage, player, skill) {
				if(!storage || Object.keys(storage).length<1) return `·无效果`;
				let texts:string[] = [];
				if(storage.del === true){
					texts.push("·【碎甲】已修改");
				}
				if(storage.damage > 0){
					texts.push(`·【碎甲】中的数字+${storage.damage}`);
				}
				return texts.join("<br>");
			},
		},
		async content(event, trigger, player) {
			trigger.num += 1 + player.storage.suijiamrfz["damage"] || 1;
		},
		group: "suijiamrfz_clear",
		subSkill: {
			clear: {
				charlotte: true,
				silent: true,
				trigger: { player: "phaseEnd" },
				async content(event, trigger, player) {
					player.storage.suijiamrfz["damage"] = 0;
				},
			},
		},
	},
	huquanmrfz: {
		audio: ["行动开始","任命队长"],
		enable: ["chooseToRespond", "chooseToUse"],
		hiddenCard: function (player, name) {
			if (player.countCards("h") < 1 || player.hasSkill("huquanmrfz_ban")) return false;
			if (name != "shan" && name != "wuxie") return false;
			return true;
		},
		filter: function (event, player) {
			if (player.hasSkill("huquanmrfz_ban") || player.countCards("h") < 1) return false;
			for (let name of ["wuxie", "shan"]) {
				if (event.filterCard({ name: name, isCard: true }, player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog: function (event, player) {
				let vcards:any[] = [];
				for (let name of ["wuxie", "shan"]) {
					let card = { name: name, isCard: true };
					if (event.filterCard && event.filterCard(card, player, event)) {
						if (name == "shan") vcards.push(["基本", "", name]);
						if (name == "wuxie") vcards.push(["锦囊", "", name]);
					}
				}
				/**
				 * @type {Dialog}
				 */
				//@ts-ignore
				let dialog = ui.create.dialog("虎拳", [vcards, "vcard"], "hidden");
				//@ts-ignore
				dialog.direct = true;
				return dialog;
			},
			backup: function (links, player) {
				return {
					filterCard: card => {
						return (card?.number || 0) > 5;
					},
					selectCard: 1,
					viewAs: {
						name: links[0][2],
					},
					popname: true,
					async precontent(event, trigger, player) {
						let result:Partial<Result>;

						const list:string[] = [];
						const controls:string[] = []
						if (!player.storage.suijiamrfz)
							player.storage.suijiamrfz = {
								del: false,
								damage: 0,
							};
						if(player.hasSkill("suijiamrfz")){
							list.push("【碎甲】中{ }内的数字+1直到你下个回合结束");
							controls.push("加数字");
						}
						if (player.hasSkill("suijiamrfz") && player.storage.suijiamrfz["del"] == false){controls.push("删描述"); list.push("删除【碎甲】中[ ]内的描述");}
						if(player.countCards("h",card=>get.name(card)==="sha"&&player.hasUseTarget(card))>0){ list.push("使用一张【杀】");controls.push("使用杀");}
						if(controls.length < 1){
							player.chat("没有可选的选项！");
							return;
						}
						else if (controls.length > 1){
							result = await player
								.chooseControl({
									controls,
									ai(event, player) {
										if(controls.includes("删描述")) return "删描述";
										if(controls.includes("使用杀")){
											if(player.hasCard(card=>{
												return get.name(card) === "sha" && game.hasPlayer(c=>get.effect(c,card,player,player)>0)
											})){ return "使用杀";}
										}
										return controls[0];
									},
								})
								.set("choiceList", list)
								.set("displayIndex",false)
								.set("prompt", "【虎拳】:请选择一项")
								.forResult();}
						else {
							result = {
								control:controls[0]
							};
						}

						// if (result && result.index == 0) {
						// 	player.storage.suijiamrfz["damage"] = +1;
						// } else player.storage.suijiamrfz["del"] = true;
						// //@ts-ignore
						// player.logSkill("huquanmrfz");
						// player.addTempSkill("huquanmrfz_ban", { global: "phaseEnd" });
						if(!result.control) return;
						switch(result.control){
							case "加数字":
								player.storage.suijiamrfz["damage"] = +1;
								player.markSkill("suijiamrfz");
								break;
							case "删描述":
								player.storage.suijiamrfz["del"] = true;
								player.markSkill("suijiamrfz");
								break;
							case "使用杀":
								await player.chooseToUse({
									forced:true,
									filterCard(card, player, event) {
										if(get.name(card)!=="sha") return false;
										return lib.filter.filterCard(card,player,get.event());
									},
									filterTarget:lib.filter.targetEnabled,
									prompt:"【虎拳】:请使用一张【杀】",
								})
						}
					},
				};
			},
			prompt: function (links, player) {
				return "【虎拳】：视为使用一张【" + get.translation(links[0][2]) + "】";
			},
		},
		ai: {
			respondShan: true,
			order: 10,
			skillTagFilter: function (player, tag, arg) {
				return (
					player.countCards("h", function (card) {
						return (card?.number || 0) > 5;
					}) > 0 && !player.hasSkill("huquanmrfz_ban")
				);
			},
			result: { player: 1 },
		},
		subSkill: {
			ban: {
				charlotte: true,
			},
		},
	},
});

translate({
	char_155_tiger: "因陀罗",
	suijiamrfz: "碎甲",
	suijiamrfz_info: "锁定技，当你造成伤害时，[ 若其有护甲 ]，则此伤害+{ 1 }。",
	huquanmrfz: "虎拳",
	huquanmrfz_info: "每回合限一次，当你需要使用【闪】或【无懈可击】时，你可以将一张点数不小于6的手牌当作【闪】或【无懈可击】使用或打出，然后你选择一项：1.删除【碎甲】中[ ]内的描述;2.令【碎甲】中{ }内的数字+1直到你下个回合结束;3.使用一张【杀】。",
});

characterIntro("char_155_tiger", "因陀罗，维多利亚格拉斯哥帮武斗派头目。推进之王的下属之一。在罗德岛担任推进之王的直属护卫，偶尔会被邀请参与一些实战指导的工作（其实就是实战训练的对手）。");

characterTitle("char_155_tiger","传讯者");

dynamicTranslate("suijiamrfz", function (player) {
	var del = player.storage?.suijiamrfz?.["del"];
	var damage = player.storage?.suijiamrfz?.["damage"];
	return "锁定技，当你造成伤害时" + (del == true ? "" : "，[ 若其有护甲 ]，则") + "，此伤害+{ " + ((1 + damage) || 1) + " }。";
});