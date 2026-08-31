import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("aiguozhemrfz", {
			sex: "male",
			group: "zhmrfz",
			hp: 4,
			skills: ["xinjunxingmrfz","youjimrfz"],
		});

skill({
	"xinjunxingmrfz": {
			audio: 2,
			direct: true,
			locked: true,
			derivation: ["sptunjiang", "reqiaobian", "xinlvli", "rezhanjue"],
			trigger: {
				player: ["phaseChange", "drawAfter", "loseAfter"],
			},
			filter: function (event, player) {
				if (event.name === "draw") return event.num > 0;
				else if (event.name === "lose") return event.type == "discard";
				else if (event.name === "phase")
					return !player.storage.xinjunxingmrfz || !player.storage.xinjunxingmrfz.isSubset(player.getSkills(null, false, false));
				return false;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				if (!Array.isArray(player.storage.xinjunxingmrfz)) player.storage.xinjunxingmrfz = [];
				if (trigger.name === "draw") {
					player.storage.xinjunxingmrfz = ["sptunjiang", "reqiaobian"];
				} else if (trigger.name === "lose") {
					player.storage.xinjunxingmrfz = ["xinlvli", "rezhanjue"];
				} else {
					await player.removeSkill(["sptunjiang", "reqiaobian", "xinlvli", "rezhanjue"]);
					player.addSkill(player.storage.xinjunxingmrfz);
					// @ts-ignore
					player.logSkill("xinjunxingmrfz");
				}
			},
		},
	"youjimrfz": {
			//audio:2,
			onremove: true,
			forced: true,
			init: function (player) {
				player.storage.youjimrfz = [];
			},
			trigger: {
				player: "phaseBegin",
			},
			async content(event, trigger, player) {
				// step 0
				if (player.isUnderControl()) {
					game.swapPlayerAuto(player);
				}

				const chooseButton = function (phases,resolve) {
					const event = _status.event;
					if (!event._result) event._result = {};
					event._result.phases = [];
					event._result.phases2 = [];
					const endphases = event._result.phases;
					const rphases = event._result.phases2;
					const dialog = ui.create.dialog("【游击】:你可以掉换执行阶段的顺序</br>执行顺序为由左到右依次执行", "hidden");
					event.dialog = dialog;
					const table = document.createElement("div");
					table.classList.add("add-setting");
					table.style.margin = "0";
					table.style.width = "100%";
					table.style.position = "relative";
					const tdList = [];

					const clickHandler = function () {
						if (_status.dragged) return;
						if (_status.justdragged) return;
						_status.tempNoButton = true;
						setTimeout(function () {
							_status.tempNoButton = false;
						}, 500);
						const link = this.link;
						if (!this.classList.contains("bluebg")) {
							if (endphases.length >= 2) return;
							endphases.push(link);
							this.classList.add("bluebg");
						} else {
							this.classList.remove("bluebg");
							endphases.splice(endphases.indexOf(link), 1);
						}
						for (let i = 0; i < tdList.length; i++) {
							if (tdList[i] !== this) {
								tdList[i].classList.remove("bluebg");
							}
						}

						if (endphases.length === 2) {
							const index1 = phases.indexOf(endphases[0]);
							const index2 = phases.indexOf(endphases[1]);
							if (index1 >= 0 && index2 >= 0 && index1 < tdList.length && index2 < tdList.length) {
								const tempNode = tdList[index1];
								const tempNode2 = tdList[index2];
								const tempLink = tempNode.link;
								const tempIndex = phases.indexOf(tempNode.link);

								tempNode.link = tempNode2.link;
								tempNode.innerHTML = "<span>" + get.tranPhase(tempNode2.link) + "</span>";
								tempNode2.link = tempLink;
								tempNode2.innerHTML = "<span>" + get.tranPhase(tempLink) + "</span>";

								phases[index1] = tempNode.link;
								phases[index2] = tempNode2.link;

								tempNode.classList.remove("bluebg");
								tempNode2.classList.remove("bluebg");

								event._result.phases2 = phases;
								event._result.phases.length = 0;
							}
						}
					};

					for (let i = 0; i < phases.length; i++) {
						const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
						td.link = phases[i];
						table.appendChild(td);
						td.innerHTML = "<span>" + get.tranPhase(phases[i]) + "</span>";
						tdList.push(td);
						td.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickHandler);
					}
					dialog.content.appendChild(table);
					dialog.add("  ");
					dialog.open();

					event.switchToAuto = function () {
						event.dialog.close();
						event.control.close();
						game.resume();
						_status.imchoosing = false;
					};

					event.control = ui.create.control("ok", function (link) {
						event.dialog.close();
						event.control.close();
						game.resume();
						_status.imchoosing = false;
						if(resolve) resolve(true);
					});

					for (let i = 0; i < event.dialog.buttons.length; i++) {
						event.dialog.buttons[i].classList.add("selectable");
					}
					game.pause();
				};

				const switchToAuto = function () {
					_status.imchoosing = false;
					event._result = {
						bool: true,
						phases2: ["phaseUse", "phaseDraw", "phaseDiscard", "phaseZhunbei", "phaseJieshu", "phaseJudge"],
					};
					if (event.dialog) event.dialog.close();
					if (event.control) event.control.close();
				};

				if (event.isMine()) {
					await new Promise(resolve => {
						chooseButton(trigger.phaseList,resolve);
					});
				} else if (event.isOnline()) {
					event.player.send(chooseButton, trigger.phaseList);
					event.player.wait();
					game.pause();
				} else {
					switchToAuto();
				}

				// step 1
				const map = event.result || event._result;
				trigger.phaseList = map.phases2.length ? map.phases2 : trigger.phaseList;
				game.log(player, "阶段执行顺序为", `#y${get.translation(trigger.phaseList)}`);
			},
		},
});

translate({
	"aiguozhemrfz": "爱国者",
	"xinjunxingmrfz": "军行",
	"xinjunxingmrfz_info": "锁定技，你的任意阶段结束时，若你本阶段最后一次手牌数变化是因[弃置而置入弃牌堆/摸牌]而导致，你失去以此法获得的所有技能，然后获得[“膂力”和“战绝”/“屯江”和“巧变”]。",
	"youjimrfz": "游击",
	"youjimrfz_info": "锁定技，回合开始时，你选择以任意顺序执行本回合的所有阶段。",
});

characterIntro("aiguozhemrfz", "摘自PRTS的梗概</br>爱国者，本名博卓卡斯替，整合运动干部，霜星的养父。属于萨卡兹中的古老分支——温迪戈，且是最后一位纯血温迪戈。与凯尔希和特蕾西娅是旧识。曾与赫拉格同为乌萨斯军官，后不幸感染矿石病并隐瞒了病情。因在镇压感染者暴动中误杀自己的儿子格罗瓦兹尔而决定放弃军官身份组成游击队，在乌萨斯的雪原上游走，保护感染者。在雪原上的矿场救下即将被处死的霜星。后在塔露拉的邀请下加入整合运动。对下属整合运动军纪要求十分严格。非常尊敬赫拉格，并与其达成了互不开战的承诺。在守卫切尔诺伯格核心城时固执地与罗德岛发生战斗，最终以自己的阵亡反抗命运。");
