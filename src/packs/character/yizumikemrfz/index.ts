import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("yizumikemrfz", {
			sex: "male",
			group: "haimrfz",
			hp: 3,
			skills: ["chanshimrfz"],
		});

skill({
	"chanshimrfz": {
			audio: false,
			trigger: {
				source: "damageEnd",
				global: "roundStart",
			},
			// @ts-ignore
			filter: function (event, player) {
				return !player.hasSkill("chanshimrfz_ban");
			},
			async content(event, trigger, player) {
				// step 0
				player.addTempSkill("chanshimrfz_ban", "phaseEnd");

				let list;
				if (_status.characterlist) {
					list = [];
					for (let i = 0; i < _status.characterlist.length; i++) {
						const name = _status.characterlist[i];
						list.push(name);
					}
				} else if (_status.connectMode) {
					list = get.charactersOL();
				} else {
					list = get.gainableCharacters();
				}

				const players = game.players.concat(game.dead);
				for (let i = 0; i < players.length; i++) {
					list.remove(players[i].name);
					list.remove(players[i].name1);
					list.remove(players[i].name2);
				}

				list = list.randomGets(2);
				const skills = [];
				for (const char of list) {
					skills.addArray(lib.character[char][3]);
				}

				if (!list.length || !skills.length) {
					return;
				}

				if (player.isUnderControl()) {
					game.swapPlayerAuto(player);
				}

				const switchToAuto = function () {
					_status.imchoosing = false;
					event._result = {
						bool: true,
						skills: skills.randomGets(1),
					};
					if (event.dialog) event.dialog.close();
					if (event.control) event.control.close();
				};

				const chooseButton = async function (list, skills,resolve) {
					const event = _status.event;
					if (!event._result) event._result = {};
					event._result.skills = [];
					const rSkill = event._result.skills;
					const dialog = ui.create.dialog("请获得一个技能", [list, "character"], "hidden");
					event.dialog = dialog;
					const table = document.createElement("div");
					table.classList.add("add-setting");
					table.style.margin = "0";
					table.style.width = "100%";
					table.style.position = "relative";

					for (let i = 0; i < skills.length; i++) {
						const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
						td.link = skills[i];
						table.appendChild(td);
						td.innerHTML = "<span>" + get.translation(skills[i]) + "</span>";
						td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
							if (_status.dragged) return;
							if (_status.justdragged) return;
							_status.tempNoButton = true;
							setTimeout(function () {
								_status.tempNoButton = false;
							}, 500);
							const link = this.link;
							if (!this.classList.contains("bluebg")) {
								if (rSkill.length >= 1) return;
								rSkill.add(link);
								this.classList.add("bluebg");
							} else {
								this.classList.remove("bluebg");
								rSkill.remove(link);
							}
						});
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
					game.countChoose();
				};

				if (event.isMine()) {
					await new Promise(resolve => {
						chooseButton(list, skills,resolve);
					})
				} else if (event.isOnline()) {
					event.player.send(chooseButton, list, skills);
					event.player.wait();
					game.pause();
				} else {
					switchToAuto();
				}

				// step 1
				const map = event.result || event._result;
				if (map && map.skills && map.skills.length) {
					for (const skill of map.skills) {
						player.addSkillLog(skill);
					}
				}

				game.broadcastAll(function (list) {
					game.expandSkills(list);
					for (const skill of list) {
						const info = lib.skill[skill];
						if (!info) continue;
						if (!info.audioname2) info.audioname2 = {};
						info.audioname2.old_yuanshu = "weidi";
					}
				}, map.skills);
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
});

translate({
	"yizumikemrfz": "伊祖米克",
	"chanshimrfz": "阐释",
	"chanshimrfz_info": "每回合限一次，每轮开始时或你造成伤害后，你可以从两张武将牌中选择并获得其中一个技能。",
});

characterIntro("yizumikemrfz", "临近进化奇点的完美生物，大群的建言者与引领者，“后生的初生”，海嗣。");
