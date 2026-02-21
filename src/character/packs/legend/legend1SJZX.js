import { lib, game, ui, get, ai, _status } from "noname";

/**
 * 六星武将第一部分
 * (都是牢武将了)
 * @type {WhichWayCharacterPack}
 */
export default {
	character: {
		ailinimrfz: ["female", "yimrfz", 3, ["zhidengmrfz", "shenpanmrfz", "liechaomrfz"], []],
		hongxuemrfz: ["female", "luomrfz", 4, ["ruibimrfz", "sujimrfz"], []],
		xiaoyangmrfz: ["female", "laimrfz", 3, ["qingyanmrfz", "luanhuomrfz"], []],
		yinhuimrfz: ["male", "xiemrfz", 4, ["xuebianmrfz", "tonghemrfz"], []],
		lingzhimrfz: ["male", "xiemrfz", 4, ["siyongmrfz"], []],
		liumingmrfz: ["male", "yimrfz", 4, ["fanyuanmrfz", "yingjimrfz", "new_weiguangmrfz"], []],
		chizuimrfz: ["female", "xumrfz", 4, ["newzhidianmrfz", "newpijimrfz"], []],
		niyanmrfz: ["female", "luomrfz", 4, ["sutumrfz", "wotumrfz"], []],
		chengshanmrfz: ["female", "luomrfz", 3, ["dianshanmrfz", "shidemrfz"], []],
		wmrfz: ["female", "bamrfz", 3, ["fukemrfz", "zhumengmrfz3"], []],
		sikadimrfz: ["female", "liemrfz", 4, ["jingliemrfz", "shulangmrfz", "tongmaimrfz"], ["clan:深海猎人"]],
		spdegoumrfz: ["female", "qimrfz", 4, ["laoyingmrfz", "yushimrfz"], []],
		maennamrfz: ["male", "kamrfz", 4, ["lianmangmrfz", "zhanmangmrfz", "xingyimrfz"], []],
		splinguangmrfz: ["female", "kamrfz", 4, ["zhuguangmrfz", "kuanmrfz", "shuoguangmrfz"], []],
		kaierximrfz: ["female", "luomrfz", 3, ["yuanlvemrfz", "chonggoumrfz", "yuanshimrfz", "m3mrfz"], ["zhu"]],
		shanmrfz: ["male", "gemrfz", 4, ["zhefumrfz", "yubianmrfz"], []],
		geleidiyamrfz: ["female", "liemrfz", "3/4", ["quliemrfz", "newxunxiangmrfz", "xueshuomrfz", "tongmaimrfz"], ["clan:深海猎人"]],
		chenmrfz: ["female", "longmrfz", 4, ["danweimrfz", "hechimrfz", "jueyingmrfz", "newjingsimrfz"], ["zhu"]],
		xingxiongmrfz: ["female", "longmrfz", "4/5", ["xinboremrfz", "xinyizhongmrfz"], []],
		kanielianmrfz: ["female", "laimrfz", 3, ["shazhenmrfz", "shacanmrfz", "shahuanmrfz"], []],
		kuiyingmrfz: ["male", "weimrfz", 3, ["xuyingmrfz", "xuegemrfz", "huanxiangmrfz"], []],
		mositimamrfz: ["female", "lamrfz", 3, ["shishimrfz", "huanshimrfz"], []],
		keebomrfz: ["female", "luomrfz", 3, ["jiemimrfz", "shihuangmrfz", "baokemrfz"], []],
		feiyameitamrfz: ["female", "lamrfz", 4, ["shunanmrfz"], []],
		jicimrfz: ["male", "yimrfz", 4, ["jihumrfz", "re_jianshumrfz"], []],
		helagemrfz: ["male", "wumrfz", 4, ["yingkuimrfz", "cangfengmrfz", "yuexiangmrfz"], []],
		wendimrfz: ["female", "luomrfz", 4, ["jiangpaomrfz", "newdanpaomrfz"], []],
		senranmrfz: ["female", "samrfz", "3/5", ["juezhanmrfz", "shanxiemrfz", "tieyimrfz"], []],
		ashmrfz: ["female", "othermrfz", "3/3/1", ["baigeimrfz", "wusumrfz", "wutoumrfz"], []],
		kamimrfz: ["male", "samrfz", 3, ["dianlianmrfz", "shazumrfz", "leibaomrfz"], []],
		nianmrfz: ["female", "suimrfz", 4, ["zhujimrfz", "tongyinmrfz", "tieyumrfz"], []],
		lingmrfz: ["female", "suimrfz", 3, ["shixingmrfz", "zuimengmrfz", "haojiumrfz"], []],
		fengdimrfz: ["female", "weimrfz", 4, ["newjuntongmrfz", "newpochengmrfz"], []],
		qinliumrfz: ["female", "weimrfz", 3, ["junqimrfz", "butuimrfz", "zhiqimrfz"], []],
		laolimrfz: ["male", "limrfz", 3, ["linhuamrfz", "mingshimrfz", "jixiongmrfz"], []],
		amrfz: ["male", "limrfz", "3/4/1", ["guaijiemrfz", "guaiyaomrfz", "qizhenmrfz"], []],
		heimrfz: ["female", "ximrfz", 4, ["heishimrfz", "ruitongmrfz", "junumrfz"], []],
		chongyuemrfz: ["male", "suimrfz", 3, ["shubianmrfz", "wubenmrfz", "wowumrfz"], []],
		anjielinamrfz: ["female", "xumrfz", 3, ["xinshimrfz", "fanzhongmrfz"], []],
		haojiaomrfz: ["female", "weimrfz", 4, ["xuezhanmrfz", "dunpaomrfz", "biaohaomrfz"], []],
		xigymrfz: ["female", "suimrfz", 3, ["huijuanmrfz", "dianjingmrfz", "cangjuanmrfz"], []],
		yanweimrfz: ["female", "hongmrfz", 4, ["fengjianmrfz", "hongsongmrfz"], []],
		nengtianshimrfz: ["female", "qimrfz", "3/3/1", ["lianshemrfz", "guozaimrfz"], []],
		yuanyamrfz: ["female", "hongmrfz", 4, ["bingximrfz", "ningshenmrfz", "yuanmengmrfz"], []],
		midiexiangmrfz: ["female", "luomrfz", 3, ["zhangyimrfz", "chongjimrfz", "nianshoumrfz"], []],
		spzzxpmrfz: ["female", "luomrfz", 3, ["yuyunmrfz", "shuiqiangmrfz", "jianfengmrfz"], []],
		shuiyuemrfz: ["male", "dongmrfz", 3, ["liqunmrfz", "chuangshangmrfz", "jinghuamrfz"], []],
		spyoulingshamrfz: ["female", "liemrfz", 3, ["xinyongwomrfz", "douzhengmrfz", "shensuimrfz", "tongmaimrfz"], ["clan:深海猎人"]],
		qiubaimrfz: ["female", "yanmrfz", 4, ["ruximrfz", "wenxuemrfz"], []],
		baitiemrfz: ["male", "weimrfz", 4, ["jigongmrfz", "jiefeimrfz"], []],
		weinamrfz: ["female", "weimrfz", 4, ["fensuimrfz", "yuechuimrfz"], []],
		siyemrfz: ["male", "xumrfz", 1, ["qunxingmrfz", "langqunmrfz"], []],
		spjiaweiermrfz: ["female", "luomrfz", 4, ["yixuemrfz", "juximrfz", "conghunmrfz"], []],
		semrfz: ["female", "luomrfz", 4, ["mojianmrfz", "huanghunmrfz", "yujinmrfz"], []],
		linmrfz: ["female", "yanmrfz", 3, ["zhenzamrfz", "liuliemrfz", "yinbimrfz"], []],
		duoluoximrfz: ["female", "lymrfz", 3, ["newgongzhenmrfz", "newmengxiangmrfz"], []],
		kongxianmrfz: ["female", "lamrfz", "3/3/1", ["sanyimrfz", "baofengmrfz", "tiexianmrfz"], []],
		spyedaomrfz: ["female", "othermrfz", "3/4", ["luanwumrfz"], []],
		yineisimrfz: ["female", "luomrfz", 3, ["yingzhimrfz", "yingshaomrfz"], []],
		miumiumrfz: ["female", "lymrfz", 3, ["yuanliumrfz", "shuilingmrfz", "xinjingshuimrfz"], []],
		heijianmrfz: ["male", "laimrfz", 3, ["newhuangxiangmrfz", "newjiyinmrfz"], []],
		yifulitemrfz: ["female", "lymrfz", 3, ["yanmomrfz", "yanbaomrfz", "huishenmrfz"], []],
		sphemomrfz: ["female", "lymrfz", 3, ["renbenmrfz", "dizhumrfz"], []],
		saileiyamrfz: ["female", "lymrfz", "3/4", ["panshimrfz", "newgaihuamrfz"], []],
		huangmrfz: ["female", "luomrfz", 4, ["newyanxunmrfz", "newfeixuemrfz"], []],
		linglanmrfz: ["female", "xumrfz", 3, ["newhualaomrfz", "newhemingmrfz", "wuyuemrfz"], []],
		shanlingmrfz: ["female", "shimrfz", 4, ["yubimrfz", "jiushumrfz", "lichangmrfz"], []],
		maluxiermrfz: ["female", "othermrfz", 3, ["kumomrfz", "cainvmrfz", "cangshumrfz"], []],
		spweinamrfz: ["female", "weimrfz", 4, ["zhongyuanmrfz", "futumrfz", "wangximrfz"], []],
		splapulandemrfz: ["female", "xumrfz", 3, ["shilangmrfz", "toulangmrfz", "kuanglangmrfz"], []],
		rendongmrfz: ["female", "xumrfz", 4, ["yinhumrfz", "zhuixiongmrfz"], []],
		shijunzhemrfz: ["female", "xumrfz", 4, ["fengyanmrfz", "weimingmrfz"], []],
		spjicimrfz: ["male", "yimrfz", 3, ["xinxiangmrfz", "haijiangmrfz", "fanyangmrfz"], []],
		yumrfz: ["male", "suimrfz", 4, ["qizaomrfz", "zhonglemrfz"], []],
		zhuhuangmrfz: ["female", "yanmrfz", "4/5", ["chongrangmrfz", "zhuoyanmrfz", "liaoyuanmrfz"], []],
	},
	skill: {
		//艾丽妮
		zhidengmrfz: {
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			audio: 2,
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget(get.prompt2("zhidengmrfz"), [0, player.hp], function (card, player, target) {
						return target.hp <= player.hp;
					})
					.set("ai", target => get.attitude2(target) > 0)
					.forResult();
			},
			async content(event, trigger, player) {
				const { targets } = event;
				game.asyncDraw(targets);

				//成就
				if (!player.storage._sjzxAch_denghuoweimingmrfz) player.storage._sjzxAch_denghuoweimingmrfz = 0;
				if (targets.length >= 2) player.storage._sjzxAch_denghuoweimingmrfz++;
			},
		},
		shenpanmrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filterTarget: function (card, player, target) {
				return player.canCompare(target);
			},
			filter: function (event, player) {
				return player.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				const { target } = event;
				const result = await player.chooseToCompare(target).forResult();
				if (result.bool) {
					target.addTempSkill("shenpanmrfz2");
					player.addTempSkill("shenpanmrfz3");
					player.storage.shenpanmrfz3 = target;
				}
			},
			ai: {
				order: 10,
				result: {
					player: function (player) {
						if (player.countCards("h", "sha") > 0) return 0.6;
						var num = player.countCards("h");
						if (num > player.hp) return 0;
						if (num == 1) return -2;
						if (num == 2) return -1;
						return -0.7;
					},
					target: function (player, target) {
						var num = target.countCards("h");
						if (num == 1) return -1;
						if (num == 2) return -0.7;
						return -0.5;
					},
				},
				threaten: 1.3,
			},
		},
		shenpanmrfz2: {
			charlotte: true,
			mark: true,
			intro: {
				content: "伊比利亚审判庭裁决你为异端",
			},
		},
		shenpanmrfz3: {
			mod: {
				globalFrom: function (from, to) {
					if (to == from.storage.shenpanmrfz3) {
						return -Infinity;
					}
				},
			},
			trigger: {
				player: "useCardToPlayered",
			},
			forced: true,
			charlotte: true,
			filter: function (event, player) {
				return event.target.hasSkill("shenpanmrfz2") && event.target.countCards("he") > 0;
			},
			check: function (event, player) {
				return get.attitude(player, event.player) < 0;
			},
			async content(event, trigger, player) {
				const result = await trigger.target.chooseToDiscard("he", true, 1).forResult();
				if (result.cards && result.cards.length > 0) player.gain(result.cards, "gain2");
			},
		},
		liechaomrfz: {
			audio: 2,
			trigger: {
				source: "damageBegin3",
			},
			filter: function (event) {
				if (event.parent === undefined || event.parent.name == "_lianhuan" || event.parent.name == "_lianhuan2") return false;
				if (event.card) {
					if (event.player.countCards("he") == 0) return true;
				}
				return false;
			},
			async content(event, trigger, player) {
				trigger.num++;
			},
			ai: {
				effect: {
					player: function (card, player, target, current) {
						if (
							card.name == "sha" &&
							target.countCards("h") == 0 &&
							!target.hasSkillTag("filterDamage", null, {
								player: player,
								card: card,
							})
						)
							return [1, 0, 1, -3];
					},
				},
			},
		},
		//鸿雪
		ruibimrfz: {
			audio: 3,
			enable: "phaseUse",
			derivation: ["dazijimrfzskill"],
			usable: 1,
			filter: function (event, player) {
				return (
					player.countCards("he") > 0 &&
					!player.isDisabled(1) &&
					!player.hasCard(function (card) {
						return card.name == "dazijimrfz";
					}, "e")
				);
			},
			filterCard: true,
			check: function (card) {
				return 6 - get.value(card);
			},
			async content(event, trigger, player) {
				const card = game.createCard("dazijimrfz", "heart", 2);
				player.$gain2(card);
				game.delayx();
				player.equip(card);
			},
			group: "ruibimrfz2",
			ai: {
				order: 12,
				result: {
					player: 1,
				},
			},
		},
		ruibimrfz2: {
			audio: "ruibimrfz",
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			forced: true,
			filter: function (event, player) {
				return !player.isDisabled(1) && (event.name != "phase" || game.phaseNumber == 0);
			},
			async content(event, trigger, player) {
				const card = game.createCard("dazijimrfz", "heart", 2);
				player.$gain2(card);
				game.delayx();
				player.equip(card);
				player.removeSkill("ruibimrfz2");
			},
		},
		sujimrfz: {
			audio: 2,
			trigger: {
				source: "damageSource",
			},
			forced: true,
			filter: function (event, player) {
				if (event.player == player) return false;
				if (event.card.name != "sha" || !player.isPhaseUsing()) return false;
				return event.player.isAlive();
			},
			async content(event, trigger, player) {
				trigger.player.addSkill("sujimrfz2");
			},
			group: ["sujimrfz_damage"],
		},
		sujimrfz2: {
			charlotte: true,
			mark: true,
			intro: {
				content: "鸿雪记住了你的弱点",
			},
		},
		sujimrfz_damage: {
			direct: true,
			trigger: { player: "useCardToPlayered" },
			filter: function (event, player) {
				if (!event.card || event.card.name != "sha" || player.hasSkill("sujimrfz_damage_ban")) return false;
				for (var i = 0; i < event.targets.length; i++) {
					var target = event.targets[i];
					if (target.hasSkill("sujimrfz2")) return true;
				}
			},
			async content(event, trigger, player) {
				for (var i = 0; i < trigger.targets.length; i++) {
					var target = trigger.targets[i];
					if (target.hasSkill("sujimrfz2")) {
						target.addTempSkill("qinggang2");
						target.storage.qinggang2.add(trigger.card);
						target.markSkill("qinggang2");
						target.addTempSkill("sujimrfz_damage_add");
						target.storage.sujimrfz_damage = {
							card: trigger.card,
						};
					}
				}
				player.addTempSkill("sujimrfz_damage_ban", "phaseEnd");
			},
			subSkill: {
				add: {
					onremove: function (player) {
						delete player.storage.sujimrfz_damage;
					},
					trigger: {
						player: "damageBegin3",
					},
					filter: function (event, player) {
						var info = player.storage.sujimrfz_damage;
						return event.card && event.card == info.card;
					},
					silent: true,
					popup: false,
					forced: true,
					charlotte: true,
					async content(event, trigger, player) {
						trigger.num++;
						//@ts-ignore
						player.logSkill("sujimrfz");
					},
				},
				ban: {
					charlotte: true,
				},
			},
		},
		//艾雅法拉
		cuofengmrfz: {
			group: ["cuofengmrfz_mark1", "cuofengmrfz_mark2"],
			audio: 2,
			preHidden: true,
			trigger: {
				player: "damageEnd",
			},
			filter: function (event, player) {
				var num = player.countMark("cuofengmrfz_mark1") + player.countMark("cuofengmrfz_mark2");
				if (num >= player.maxHp - 1) return false;
				return player.countCards("he") > 0;
			},
			async content(event, trigger, player) {
				"step 0";
				var list = ["摸牌阶段", "结束阶段"];
				const result = await player.chooseControl(list).forResult();
				if (result.control == "摸牌阶段") {
					player.addMark("cuofengmrfz_mark1", 1, false);
				} else {
					player.addMark("cuofengmrfz_mark2", 1, false);
				}
				player.chooseToDiscard("he", true, 1);
			},
			ai: {
				maixie: true,
				maixie_hp: true,
				effect: {
					target: function (card, player, target) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
						if (get.tag(card, "damage")) return [1, 0.55];
					},
				},
			},
		},
		cuofengmrfz_mark1: {
			intro: {
				content: "摸牌阶段额外摸#张牌",
			},
			trigger: {
				player: "phaseDrawBegin2",
			},
			filter: function (event, player) {
				return player.countMark("cuofengmrfz_mark1") > 0;
			},
			forced: true,
			async content(event, trigger, player) {
				var num = player.countMark("cuofengmrfz_mark1");
				trigger.num += num;
			},
		},
		cuofengmrfz_mark2: {
			intro: {
				content: "结束阶段摸#张牌",
			},
			trigger: {
				player: "phaseJieshuBegin",
			},
			filter: function (event, player) {
				return player.countMark("cuofengmrfz_mark2") > 0;
			},
			forced: true,
			async content(event, trigger, player) {
				var num = player.countMark("cuofengmrfz_mark2");
				player.draw(num);
			},
		},
		chengzhimrfz: {
			skillAnimation: true,
			animationColor: "wood",
			audio: 2,
			juexingji: true,
			unique: true,
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			filter: function (event, player) {
				var num = player.countMark("cuofengmrfz_mark1") + player.countMark("cuofengmrfz_mark2");
				if (num != player.maxHp - 1) return false;
				return !player.storage.chengzhimrfz;
			},
			forced: true,
			async content(event, trigger, player) {
				player.loseMaxHp();
				player.addSkill("zhuzhimrfz");
				game.log(player, "获得了技能", "#g【逐志】");
				player.awakenSkill(event.name);
				player.storage[event.name] = true;
			},
		},
		zhuzhimrfz: {
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			audio: 2,
			filter: function (event, player) {
				if (player.hp == 1 && player.countCards("he") <= 0) return false;
				return true;
			},
			async content(event, trigger, player) {
				if (player.hp > 1) {
					await player.damage("fire");
				} else {
					await player.chooseToDiscard("he", true, 1);
				}
				var num1 = player.countMark("cuofengmrfz_mark1") + player.countMark("cuofengmrfz_mark2");
				var num2 = Math.floor(num1 / 2);
				player.addTempSkill("zhuzhimrfz_mark", {
					player: "phaseAfter",
				});
				player.draw(num2);
			},
			ai: {
				basic: {
					order: 1,
				},
				result: {
					player: function (player) {
						if (player.hp < 2) return -1;
						return 1;
					},
				},
			},
		},
		zhuzhimrfz_mark: {
			mark: true,
			intro: {
				content: "黑暗追着她，她追着光。",
			},
			init: function (player, skill) {
				if (!player.storage[skill]) player.storage[skill] = 0;
			},
			onremove: true,
			mod: {
				maxHandcard: function (player, num) {
					var n = player.countMark("cuofengmrfz_mark1") + player.countMark("cuofengmrfz_mark2");
					return num + n;
				},
				cardUsable: function (card, player, num) {
					var n = player.countMark("cuofengmrfz_mark1") + player.countMark("cuofengmrfz_mark2");
					if (card.name == "sha") return num - 1 + n;
				},
			},
		},
		//银灰
		moucunmrfz: {
			trigger: {
				global: "roundStart",
			},
			intro: {
				content: "【鹰视】中的X为#。",
			},
			audio: 2,
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			async content(event, trigger, player) {
				player.removeMark("moucunmrfz2", player.countMark("moucunmrfz2"));
				const result = await player
					.chooseCardTarget({
						prompt: "请交给一名其他角色一至两张牌",
						filterCard: true,
						filterTarget: function (card, player, target) {
							var group = game.me.group;
							return player != target && target.group !== group;
						},
						ai1: function (card) {
							return 10 - get.value(card);
						},
						ai2: function (target) {
							if (get.attitude(player, target) <= 0) return get.attitude(player, target);
							return get.attitude(player, target) > 0;
						},
						selectCard: [1, 2],
						position: "he",
					})
					.forResult();
				if (result.bool && result.targets) {
					result.targets[0].gain(result.cards, player, "giveAuto");
					result.targets[0].addSkill("moucunmrfz3");
				}
			},
			group: "moucunmrfz2",
		},
		yingshimrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				//@ts-ignore
				return game.hasPlayer(current => lib.skill.yingshimrfz.filterTarget(null, player, current));
			},
			check: function (card) {
				return 6 - get.value(card);
			},
			filterTarget: function (card, player, target) {
				return target != player && target.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				const { target } = event;
				var num = player.countMark("moucunmrfz");
				if (num < 1) {
					player.viewHandcards(target);
				} else {
					var max = target.countCards("h");
					if (max > num) return player.gainPlayerCard(num, target, "h", true, "visible");
					if (num >= max) return player.gainPlayerCard(max, target, "h", true, "visible");
				}
				game.log(player, "观看了", target, "的手牌");
			},
			ai: {
				order: 6,
				result: {
					player: 0.5,
					target: function (player, target) {
						if (target.hasSkillTag("noh")) return 0;
						return -1;
					},
				},
			},
		},
		moucunmrfz2: {
			trigger: {
				global: "phaseUseEnd",
			},
			forced: true,
			filter: function (event, player) {
				if (!event.player.hasSkill("moucunmrfz3")) return false;
				return (
					event.player.getHistory("useCard", function (evt) {
						return evt.getParent("phaseUse") == event;
					}).length > 0
				);
			},
			async content(event, trigger, player) {
				var list = [];
				//@ts-ignore
				player.logSkill("moucunmrfz");
				//@ts-ignore
				trigger.player.getHistory("useCard", function (evt) {
					if (evt.getParent("phaseUse") == trigger) list.add(get.type2(evt.card));
				});
				player.draw(list.length);
				if (list.length > 2) {
					player.addMark("moucunmrfz", 1, false);
				} else {
					event.finish();
				}
			},
		},
		moucunmrfz3: {
			charlotte: true,
			mark: true,
			intro: {
				content: "银灰前来求学",
			},
		},
		//灵知
		siyongmrfz: {
			audio: 2,
			trigger: {
				player: "loseEnd",
			},
			filter: function (event, player) {
				if (event.getParent()?.name != "useCard" || player != _status.currentPhase) return false;
				var list = player.getStorage("siyongmrfz2");
				for (var i of event.cards) {
					if (!list.includes(get.suit(i, player))) return true;
				}
				return false;
			},
			async content(event, trigger, player) {
				if (!player.storage.siyongmrfz2) player.storage.siyongmrfz2 = [];
				for (var i of trigger.cards) player.storage.siyongmrfz2.add(get.suit(i, player));
				player.storage.siyongmrfz2.sort();
				player.addTempSkill("siyongmrfz2");
				player.markSkill("siyongmrfz2");

				if (
					game.hasPlayer(function (current) {
						return current != player && current.countCards("he") > 0;
					})
				) {
					const result = await player
						.chooseTarget("请选择一名其他角色获得其一张牌", true, function (card, player, target) {
							return target != player && target.countCards("he") > 0;
						})
						.set("ai", function (target) {
							var att = get.attitude(player, target);
							if (att >= 0) return 0;
							if (
								target.countCards("he", function (card) {
									return get.value(card) > 5;
								})
							)
								return -att;
							return Math.random();
						})
						.forResult();
					if (result.targets) {
						var target = result.targets[0];
						player.gainPlayerCard(1, target, "he", true);
					}
				} else {
					player.draw();
				}
			},
			forced: true,
		},
		siyongmrfz2: {
			onremove: true,
			intro: {
				content: "当前已使用花色：$",
			},
		},
		//旧流明
		yijianmrfz: {
			trigger: {
				player: "damageBegin",
			},
			audio: 2,
			forced: true,
			usable: 1,
			async content(event, trigger, player) {
				trigger.num--;
			},
		},
		weiguangmrfz: {
			audio: "new_weiguangmrfz",
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			forced: true,
			global: ["weiguangmrfz_mark", "weiguangmrfz_losemark"],
			filter: function (event, player) {
				return !player.hasMark("weiguangmrfz_mark");
			},
			async content(event, trigger, player) {
				player.addMark("weiguangmrfz_mark", 1);
			},
			group: "weiguangmrfz2",
		},
		weiguangmrfz_mark: {
			marktext: "火光",
			intro: {
				name: "火光",
				content: "流明希望人们能有余力擦去脸上的灰尘",
			},
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return num + player.countMark("weiguangmrfz_mark");
				},
				maxHandcard: function (player, num) {
					return num + player.countMark("weiguangmrfz_mark");
				},
			},
			trigger: {
				player: "phaseDrawBegin2",
			},
			forced: true,
			filter: function (event, player) {
				return player.hasMark("weiguangmrfz_mark");
			},
			async content(event, trigger, player) {
				trigger.num += player.countMark("weiguangmrfz_mark");
			},
		},
		weiguangmrfz_losemark: {
			trigger: {
				player: "phaseJieshuBegin",
			},
			forced: true,
			charlotte: true,
			filter: function (event, player) {
				return player.hasMark("weiguangmrfz_mark");
			},
			async content(event, trigger, player) {
				//@ts-ignore
				player.drawTo(Math.min(5, player.getHandcardLimit()));
				player.removeMark("weiguangmrfz_mark", 1);
				//@ts-ignore
				player.logSkill("new_weiguangmrfz");
			},
		},
		weiguangmrfz2: {
			enable: "phaseUse",
			usable: 1,
			filterTarget: true,
			prompt: "选择一名角色令其获得一个“火光”标记并对自己造成一点伤害，若该角色是你，你流失一点体力",
			async content(event, trigger, player) {
				const { target } = event;
				if (target == player) {
					player.loseHp();
				}
				player.damage();
				target.addMark("weiguangmrfz_mark");
				//@ts-ignore
				player.logSkill("new_weiguangmrfz");
			},
			ai: {
				order: 9,
				result: {
					target: function (player, target) {
						if (target.countCards("h") > 2) return 5;
						if (player == target && player.getDamagedHp() == 0) return 5;
						return 2;
					},
				},
				threaten: 2,
			},
		},
		//斥罪
		zhidianmrfz: {
			audio: 2,
			trigger: {
				global: "roundStart",
			},
			direct: true,
			async content(event, trigger, player) {
				var list = lib.inpile;
				var list2 = [];
				let result;

				for (var i = 0; i < list.length; i++) {
					var name = list[i];
					if (name == "shan" || name == "wuxie") continue;
					var type = get.type(name);
					if (name == "sha") {
						list2.push(["基本", "", "sha"]);
						list2.push(["基本", "", "sha", "fire"]);
						list2.push(["基本", "", "sha", "thunder"]);
					} else if (type == "basic") {
						list2.push(["基本", "", list[i]]);
					} else if (type == "trick") {
						list2.push(["锦囊", "", list[i]]);
					}
				}
				if (!list.length) return;
				else
					result = await player
						.chooseButton([get.prompt("zhidianmrfz"), [list, "vcard"]])
						.set("ai", function (button) {
							switch (button.link[2]) {
								case "wuxie":
									return 0.6 + Math.random();
								case "wuzhong":
								case "dongzhuxianji":
									return 0.5 + Math.random();
								case "guohe":
								case "zhujinqiyuan":
									return 0.4 + Math.random();
								case "sha":
									return 1 + Math.random();
								default:
									return Math.random();
							}
						})
						.forResult();
				if (result.bool === true && result.links) {
					var name = result.links[0][2];
					//@ts-ignore
					player.logSkill("zhidianmrfz");
					player.storage.zhidianmrfz = name;
					player.markSkill("zhidianmrfz");
					game.log(player, "声明了", "#g" + get.translation(name));
				}
			},
			intro: {
				content: "已声明【$】",
			},
			group: ["zhidianmrfz_use"],
		},
		zhidianmrfz_use: {
			trigger: {
				global: "useCard1",
			},
			silent: true,
			forced: true,
			charlotte: true,
			popup: false,
			firstDo: true,
			filter: function (event, player) {
				return event.card.name == player.storage.zhidianmrfz;
			},
			async content(event, trigger, player) {
				var target = trigger.player;
				if (target == player) {
					player.chooseToDiscard("he", true, 1);
					//@ts-ignore
					player.logSkill("zhidianmrfz");
				} else {
					if (target.countCards("he") == 0) event._result = { index: 1 };
					else {
						var str = get.translation(player);
						const { index } = await target
							.chooseControl()
							.set("choiceList", ["交给" + str + "一张牌", "失去一点体力"])
							.forResult();

						if (target !== player) {
							//@ts-ignore
							player.logSkill("zhidianmrfz");
							if (index === 0) {
								const { cards } = await target.chooseCard("he", true);
								if (cards) target.give(cards, player, true);
							} else {
								target.loseHp();
							}
						}
					}
				}
			},
		},
		pijimrfz: {
			audio: 2,
			trigger: {
				player: "damageEnd",
			},
			filter: function (event, player) {
				if (event.source == player) return false;
				return event.source != undefined;
			},
			forced: true,
			logTarget: "source",
			async content(event, trigger, player) {
				var num = player.maxHp - player.hp;
				if (num < 2) trigger.source.damage();
				if (num > 1) trigger.source.damage(2);
			},
			ai: {
				maixie_defend: true,
				effect: {
					target: function (card, player, target) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
						return 0.8;
						// if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
					},
				},
			},
		},
		//泥岩
		wotumrfz: {
			audio: 2,
			trigger: { player: "useCard2" },
			filter: function (event, player) {
				if (!event.cards) return false;
				return event.cards.length == 0 && !player.hasSkill("wotumrfz_ban");
			},
			frequent: true,
			async content(event, trigger, player) {
				player.changeHujia();
				player.addTempSkill("wotumrfz_ban", {
					global: "roundStart",
				});
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
		sutumrfz: {
			audio: 2,
			trigger: {
				player: "useCardAfter",
			},
			filter: function (event, player) {
				if (!event.card.isCard) return false;
				if (player.countCards("h") !== player.hp) return false;
				return event.cards && event.cards.length == 1;
			},
			async content(event, trigger, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						list.push(["基本", "", "sha"]);
						for (var j of lib.inpile_nature) list.push(["基本", "", "sha", j]);
					} else if (get.type(name) == "basic") list.push(["基本", "", name]);
					else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
				}
				const result = await player
					.chooseButton(["塑土", [list, "vcard"]], true)
					.set("ai", function (button) {
						//@ts-ignore
						var player = _status.event.getParent().player,
							card = {
								name: button.link[2],
								nature: button.link[3],
							};
						if (
							game.hasPlayer(function (current) {
								return (
									current != player &&
									get.attitude(player, current) < 0 &&
									current.countCards("he") > 0 &&
									get.distance(player, current) < 2
								);
							})
						)
							return "shunshou";
						if (
							game.hasPlayer(function (current) {
								return (
									current != player && get.attitude(player, current) < 0 && current.countCards("he") == 0 && player.inRange(current)
								);
							})
						)
							return "sha";
						//@ts-ignore
						return player.getUseValue(card, null, true) * _status.event.att;
					})
					.set("att", get.attitude(event.target, player) > 0 ? 1 : -1)
					.forResult();
				if (result.links) {
					var name = result.links[0][2];
					player.chooseUseTarget({ name: name, isCard: true }, true);
				}
			},
		},
		//澄闪
		dianyongmrfz: { audio: 2 },
		fuxiemrfz: { audio: 2 },
		dianshanmrfz: {
			mark: true,
			locked: true,
			zhuanhuanji: true,
			marktext: "☯",
			intro: {
				content: function (storage, player, skill) {
					if (player.storage.dianshanmrfz !== true)
						return "锁定技，当你成为其他角色使用的黑色牌的目标时,你对一名其他角色造成一点雷属性伤害";
					return "锁定技，当你成为其他角色使用的黑色牌的目标时,你弃置一名其他角色一张牌。";
				},
			},
			audio: "dianyongmrfz",
			trigger: {
				target: "useCardToTargeted",
			},
			forced: true,
			filter: function (event, player) {
				if (
					game.hasPlayer(function (current) {
						return current != player && !current.countCards("he");
					}) &&
					player.storage.dianshanmrfz !== true
				)
					return false;
				return player != event.player && get.color(event.card) == "black";
			},
			async content(event, trigger, player) {
				let result;
				player.changeZhuanhuanji("dianshanmrfz");
				if (player.storage.dianshanmrfz == true) {
					result = await player
						.chooseTarget(get.prompt("dianshanmrfz"), "对一名其他角色造成一点雷属性伤害", true, function (card, player, target) {
							return target != player;
						})
						.set("ai", target => -get.attitude(player, target))
						.forResult();
				} else {
					result = await player
						.chooseTarget(get.prompt("dianshanmrfz"), "弃置一名其他角色一张牌", true, function (card, player, target) {
							return target != player;
						})
						.set("ai", target => -get.attitude(player, target))
						.forResult();
				}
				if (result.bool && result.targets) {
					if (player.storage.dianshanmrfz == true) {
						result.targets[0].damage("thunder");
					} else {
						player.discardPlayerCard(result.targets[0], 1, "he", true);
					}
				}
			},
		},
		shidemrfz: {
			audio: "fuxiemrfz",
			direct: true,
			trigger: {
				player: ["useCard", "respond", "loseAfter"],
			},
			filter: function (event, player) {
				if (event.name != "lose") return true;
				if (event.type != "discard") return false;
				if (event.cards2) {
					for (var i = 0; i < event.cards2.length; i++) {
						return true;
					}
				}
				return false;
			},
			forced: true,
			async content(event, trigger, player) {
				if (player.isLinked()) player.link(false);
				else player.link();
			},
			group: "shidemrfz_draw",
			subSkill: {
				draw: {
					audio: "shidemrfz",
					forced: true,
					trigger: { player: "linkAfter" },
					filter: function (event, player) {
						return !player.isLinked();
					},
					async content(event, trigger, player) {
						player.draw();
					},
				},
			},
		},
		//w
		fukemrfz: {
			trigger: {
				player: "gainAfter",
			},
			filter: function (event, player) {
				if (
					!game.hasPlayer(function (current) {
						return current != player && current.countCards("he") > 0;
					})
				)
					return false;
				//@ts-ignore
				return event.getParent(3).name != "fukemrfz";
			},
			audio: 2,
			direct: true,
			async content(event, trigger, player) {
				var num = trigger.cards.length;
				const result = await player
					.chooseTarget(
						get.prompt("fukemrfz"),
						"获得至多" + get.translation(num) + "名角色的各一张牌，然后弃置等量的牌",
						[1, num],
						function (card, player, target) {
							return target.countCards("he") > 0 && player != target;
						},
						function (target) {
							var att = get.attitude(_status.event.player, target);
							if (target.hasSkill("tuntian")) return att / 10;
							return 1 - att;
						}
					)
					.forResult();
				if (result.bool && result.targets) {
					var num2 = result.targets.length;
					result.targets.sortBySeat();
					//@ts-ignore
					player.logSkill("fukemrfz", result.targets);
					player.chooseToDiscard(num2, true, "he");
					player.gainMultiple(result.targets, "he");
				}
			},
			ai: {
				threaten: 1.6,
				expose: 0.2,
			},
		},
		zhumengmrfz: {
			audio: 2,
			direct: true,
			trigger: {
				global: "roundStart",
			},
			firstDo: true,
			forced: true,
			async content(event, trigger, player) {
				player.removeMark("zhumengmrfz3", player.countMark("zhumengmrfz3"));
				player.unmarkSkill("zhumengmrfz2");
			},
		},
		zhumengmrfz2: {
			trigger: {
				global: "roundStart",
			},
			intro: {
				content: function (storage) {
					return get.translation(storage) + "牌";
				},
			},
			audio: 2,
			async content(event, trigger, player) {
				const result = await player.judge().forResult();
				if (!result.card) return;
				const card = result.card;
				player.markSkill("zhumengmrfz2");
				//@ts-ignore
				if (get.type(card) !== "delay") {
					//@ts-ignore
					player.storage.zhumengmrfz2 = get.type(card);
				} else {
					player.storage.zhumengmrfz2 = "trick";
				}
				//@ts-ignore
				player.addMark("zhumengmrfz3", get.number(card));
				//@ts-ignore
				player.logSkill("zhumengmrfz");
			},
		},
		zhumengmrfz3: {
			marktext: "梦",
			intro: {
				name: "梦",
				content: "萨卡兹的命运应该掌握在自己手中",
			},
			audio: "zhumengmrfz",
			trigger: {
				player: ["useCard", "respond"],
			},
			filter: function (event, player) {
				//@ts-ignore
				if (player.storage.zhumengmrfz2 == "trick" && get.type(event.card) == "delay") return true;
				//@ts-ignore
				return get.type(event.card) == player.storage.zhumengmrfz2 && player.countMark("zhumengmrfz3") > 0;
			},
			frequent: true,
			prompt: "是否摸一张牌",
			async content(event, trigger, player) {
				player.removeMark("zhumengmrfz3");
				player.draw();
			},
			group: ["zhumengmrfz2", "zhumengmrfz"],
		},
		//浊心斯卡蒂
		/**
		 * @description
		 */
		qianximrfz: {
			audio: 2,
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			derivation: ["qianximrfz_ban"],
			forced: true,
			filter: function (event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			async content(event, trigger, player) {
				var characterlist = [];
				for (var i = 0; i < game.players.length; i++) {
					var players = game.players[i];
					if (players == player) continue;
					characterlist.push(players.name);
				}
				if (!lib.config.isNoLimted_mrfz) {
					characterlist.remove("amiyamrfz");
					characterlist.remove("baocunzhemrfz");
				}
				var skills = [];
				//@ts-ignore
				for (var i of characterlist) {
					skills.addArray(lib.character[i][3]);
				}
				if (!characterlist.length || !skills.length) {
					event.finish();
					return;
				}
				if (player.isUnderControl()) {
					game.swapPlayerAuto(player);
				}
				var switchToAuto = function () {
					_status.imchoosing = false;
					event._result = {
						bool: true,
						skills: skills.randomGets(2),
					};
					if (event.dialog) event.dialog.close();
					if (event.control) event.control.close();
				};
				var chooseButton = function (list, skills) {
					var event = _status.event;
					if (!event._result) event._result = {};
					event._result.skills = [];
					var rSkill = event._result.skills;
					var dialog = ui.create.dialog("请获得两个技能", [list, "character"], "hidden");
					event.dialog = dialog;
					var table = document.createElement("div");
					table.classList.add("add-setting");
					table.style.margin = "0";
					table.style.width = "100%";
					table.style.position = "relative";
					for (var i = 0; i < skills.length; i++) {
						var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
						//@ts-ignore
						td.link = skills[i];
						table.appendChild(td);
						td.innerHTML = "<span>" + get.translation(skills[i]) + "</span>";
						td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
							if (_status.dragged) return;
							//@ts-ignore
							if (_status.justdragged) return;
							//@ts-ignore
							_status.tempNoButton = true;
							setTimeout(function () {
								//@ts-ignore
								_status.tempNoButton = false;
							}, 500);
							//@ts-ignore
							var link = this.link;
							if (!this.classList.contains("bluebg")) {
								if (rSkill.length >= 2) return;
								rSkill.add(link);
								this.classList.add("bluebg");
							} else {
								this.classList.remove("bluebg");
								rSkill.remove(link);
							}
						});
					}
					dialog.content.appendChild(table);
					dialog.add("　　");
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
					});
					for (var i = 0; i < event.dialog.buttons.length; i++) {
						event.dialog.buttons[i].classList.add("selectable");
					}
					game.pause();
					game.countChoose();
				};
				if (event.isMine()) {
					chooseButton(characterlist, skills);
				} else if (event.isOnline()) {
					event.player.send(chooseButton, characterlist, skills);
					event.player.wait();
					game.pause();
				} else {
					switchToAuto();
				}
				//@ts-ignore
				var map = event.result || result;
				if (map && map.skills && map.skills.length) {
					//@ts-ignore
					for (var i of map.skills) player.addSkillLog(i);
				}
				game.broadcastAll(function (list) {
					game.expandSkills(list);
					for (var i of list) {
						var info = lib.skill[i];
						if (!info) continue;
						if (!info.audioname2) info.audioname2 = {};
						info.audioname2.old_yuanshu = "weidi";
					}
				}, map.skills);
			},
		},
		//斯卡蒂
		geyaomrfz: {
			audio: 2,
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			async content(event, trigger, player) {
				const result = await player.draw("visible").forResult();
				if (!result.cards) return;
				var card = result.cards[0];
				if (get.type(card) == "equip") {
					player.addTempSkill("geyaomrfz_e");
				}
				if (get.type(card) == "trick" || get.type(card) == "delay") {
					player.addTempSkill("geyaomrfz_t");
				}
				if (get.type(card) == "basic") {
					player.addTempSkill("geyaomrfz_b");
				}
				game.log(player, "展示了一张", get.type(card), "牌");
			},
		},
		geyaomrfz_e: {
			mod: {
				targetInRange: function (card, player, target, now) {
					if (card.name == "sha") return true;
				},
				selectTarget: function (card, player, range) {
					if (card.name == "sha" && range[1] != -1) range[1] = Infinity;
				},
			},
			charlotte: true,
		},
		geyaomrfz_t: {
			trigger: {
				player: "useCard",
			},
			forced: true,
			charlotte: true,
			filter: function (event, player) {
				return event.card.name == "sha";
			},
			async content(event, trigger, player) {
				//@ts-ignore
				trigger.directHit.addArray(
					game.filterPlayer(function (current) {
						return current != player;
					})
				);
			},
			ai: {
				directHit_ai: true,
			},
		},
		geyaomrfz_b: {
			trigger: {
				player: "useCardToPlayered",
			},
			frequent: true,
			filter: function (event, player) {
				return event.card.name == "sha" && event.target.countCards("h") > 0;
			},
			check: function (event, player) {
				return get.attitude(player, event.target) < 0;
			},
			async content(event, trigger, player) {
				var color = get.color(trigger.card);
				player
					.gainPlayerCard(trigger.target, "h", "visible")
					.set("color", color)
					.set("filterButton", function (button) {
						var evt = _status.event;
						return get.color(button.link, evt.target) != evt.color;
					});
				//@ts-ignore
				player.logSkill("geyaomrfz", trigger.target);
			},
		},
		zhangenmrfz: {
			audio: 2,
			trigger: {
				player: "useCardAfter",
			},
			filter: function (event, player) {
				if (player.countCards("h") == 0) return false;
				return event.card.name == "sha" && player.getHistory("sourceDamage").length > 0;
			},
			check: function (event, player) {
				return (
					player.getCardUsable("sha") == 0 &&
					player.countCards("h", function (card) {
						return card.name == "sha";
					}) > 0
				);
			},
			async content(event, trigger, player) {
				player.chooseToDiscard("h", 1, true);
				trigger.addCount = false;
				if (player.stat[player.stat.length - 1].card.sha > 0) {
					player.stat[player.stat.length - 1].card.sha--;
				}
			},
		},
		//缄默德克萨斯
		yushimrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "phaseDrawBegin2" },
			async content(event, trigger, player) {
				var num = 8 - game.roundNumber;
				trigger.num = Math.max(3, num);
			},
		},
		laoyingmrfz: {
			audio: 2,
			usable: 1,
			trigger: { source: "damageEnd" },
			filter: function (event, player) {
				return (
					event.card &&
					event.getParent("phaseUse") &&
					//@ts-ignore
					event.getParent("phaseUse").player == player &&
					get.itemtype(event.cards) == "cards" &&
					get.position(event.cards[0], true) == "o"
				);
			},
			async content(event, trigger, player) {
				player.gain(trigger.cards, "gain2");
				var cardu = { name: trigger.card.name, isCard: true };
				//@ts-ignore
				if (get.type(cardu) == "basic") player.addTempSkill("laoyingmrfz_basic");
				else player.addTempSkill("laoyingmrfz_trick");
			},
			subSkill: {
				basic: {
					charlotte: true,
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + 1;
						},
					},
				},
				trick: {
					audio: "laoyingmrfz",
					trigger: { player: "useCard" },
					filter: function (event, player) {
						return get.type2(event.card) == "trick";
					},
					forced: true,
					charlotte: true,
					async content(event, trigger, player) {
						//@ts-ignore
						trigger.directHit.addArray(
							game.filterPlayer(function (current) {
								return current != player;
							})
						);
						player.removeSkill("laoyingmrfz_trick");
					},
					ai: {
						directHit_ai: true,
						skillTagFilter: function (player, tag, arg) {
							return get.type2(arg.card) == "trick";
						},
					},
				},
			},
		},
		//玛恩纳
		xunlumrfz: {
			audio: 2,
			group: ["xunlumrfz_draw", "xunlumrfz_sha", "xunlumrfz_h"],
			intro: {
				content: function (storage, player, skill) {
					return (
						"数字：<span class=thundertext>" +
						player.storage.xunlumrfz_draw +
						"</span> <span class=firetext>" +
						player.storage.xunlumrfz_sha +
						"</span> <span class=greentext>" +
						player.storage.xunlumrfz_h +
						"</span></br>本回合杀的数量：" +
						player.storage.xunlumrfz_sha2 +
						"</br>本回合手牌上限：" +
						player.storage.xunlumrfz_h2 +
						(player.storage.xunlumrfz2 ? "</br>已修改【寻路】" : "")
					);
				},
			},
			mark: true,
			onremove: true,
			trigger: { source: "damageEnd" },
			filter: function (event, player) {
				if (player.storage.xunlumrfz_draw + player.storage.xunlumrfz_sha + player.storage.xunlumrfz_h < 12) return true;
				return false;
			},
			async content(event, trigger, player) {
				var list = ["蓝色", "红色", "绿色"];
				const result = await player
					.chooseControl(list, "cancel2")
					.set("prompt", get.prompt("xunlumrfz"))
					.set(
						"prompt2",
						"令〖寻路〗中的一个数字+1</br>数字：<span class=thundertext>" +
							player.storage.xunlumrfz_draw +
							"</span> <span class=firetext>" +
							player.storage.xunlumrfz_sha +
							"</span> <span class=greentext>" +
							player.storage.xunlumrfz_h +
							"</span>"
					)
					.set("ai", function () {
						if (player.storage.xunlumrfz_draw < 4) return 0;
						if (player.storage.xunlumrfz_draw == 4 && player.storage.xunlumrfz_sha < 4) return 1;
						if (player.storage.xunlumrfz_h < 4) return 2;
						return 3;
					})
					.forResult();
				if (result.control != "cancel2") {
					if (result.control == "蓝色") {
						if (player.storage.xunlumrfz_draw < 4) {
							player.storage.xunlumrfz_draw++;
						}
					}
					if (result.control == "红色") {
						if (player.storage.xunlumrfz_sha < 4) {
							player.storage.xunlumrfz_sha++;
						}
					}
					if (result.control == "绿色") {
						if (player.storage.xunlumrfz_h < 4) {
							player.storage.xunlumrfz_h++;
						}
					}
					if (result.control == "修改【寻路】") {
						if (!player.storage.xunlumrfz2) {
							player.storage.xunlumrfz2 = true;
						}
					}
					player.markSkill("xunlumrfz");
				}
			},
		},
		//m-n
		//Math.random()*(n-m)+m;
		xunlumrfz_draw: {
			init: function (player) {
				player.storage.xunlumrfz_draw = 1;
				player.syncStorage("xunlumrfz_draw");
			},
			onremove: true,
			audio: 2,
			trigger: { player: "phaseDrawBegin2" },
			forced: true,
			async content(event, trigger, player) {
				//@ts-ignore
				var num = game.RDNbet(player.storage.xunlumrfz_draw, 6);
				trigger.num = Math.min(num, 6);
				//@ts-ignore
				player.logSkill("xunlumrfz");
				player.chat("可出" + player.storage.xunlumrfz_sha2 + "张杀</br>手牌上限为：" + player.storage.xunlumrfz_h2);
			},
		},
		xunlumrfz_sha: {
			init: function (player) {
				player.storage.xunlumrfz_sha = 0;
				player.syncStorage("xunlumrfz_sha");
			},
			onremove: true,
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			charlotte: true,
			firstDo: true,
			async content(event, trigger, player) {
				player.addTempSkill("xunlumrfz_sha2", {
					player: "phaseZhunbeiBegin",
				});
				//@ts-ignore
				player.storage.xunlumrfz_sha2 = game.RDNbet(player.storage.xunlumrfz_sha, 5);
				//@ts-ignore
				player.logSkill("xunlumrfz");
			},
		},
		xunlumrfz_sha2: {
			init: function (player) {
				player.storage.xunlumrfz_sha2 = 0;
				player.syncStorage("xunlumrfz_sha2");
			},
			onremove: true,
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return (num = Math.min(player.storage.xunlumrfz_sha2, 5));
				},
			},
		},
		xunlumrfz_h: {
			init: function (player) {
				player.storage.xunlumrfz_h = 3;
				player.syncStorage("xunlumrfz_h");
			},
			onremove: true,
			trigger: { player: "phaseZhunbeiBegin" },
			forced: true,
			charlotte: true,
			async content(event, trigger, player) {
				player.addTempSkill("xunlumrfz_h2", {
					player: "phaseZhunbeiBegin",
				});
				//@ts-ignore
				player.storage.xunlumrfz_h2 = game.RDNbet(player.storage.xunlumrfz_h, 8);
			},
		},
		xunlumrfz_h2: {
			init: function (player) {
				player.storage.xunlumrfz_h2 = 0;
				player.syncStorage("xunlumrfz_h2");
			},
			onremove: true,
			mod: {
				maxHandcard: function (player, num) {
					return (num = player.storage.xunlumrfz_h2);
				},
			},
		},
		xunlumrfz2: {
			charlotte: true,
		},
		//耀骑士临光
		zhuguangmrfz: {
			derivation: "zhuguangmrfz_rewrite",
			audio: 2,
			audioname: ["linguangmrfz"],
			trigger: { player: "phaseZhunbeiAfter" },
			filter: function (event, player) {
				return !player.storage.zhuguangmrfz_change;
			},
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget("选择一名其他角色，视为对其使用【决斗】", function (card, player, target) {
						return target != player;
					})
					.set("ai", function (target) {
						return -get.attitude(_status.event.player, target);
					})
					.forResult();
				player.addSkill("zhuguangmrfz2");
				if (result.bool && result.targets) {
					var target = result.targets[0];
					await player.useCard({ name: "juedou" }, true, target);
				}
				if (player.hasSkill("zhuguangmrfz2")) player.removeSkill("zhuguangmrfz2");
			},
			group: "zhuguangmrfz_change",
		},
		zhuguangmrfz2: {
			audio: false,
			silent: true,
			trigger: { source: "damageBegin2" },
			filter: function (event, player, card) {
				return event.card.name == "juedou";
			},
			prompt: function (event, player) {
				if (!player.storage.zhuguangmrfz_change) return "是否防止此伤害并选择一项";
				return "是否发动【逐光】";
			},
			frequent: function (event, player) {
				if (!player.storage.zhuguangmrfz_change) return false;
				return true;
			},
			async content(event, trigger, player) {
				"step 0";
				if (!player.storage.zhuguangmrfz_change) trigger.cancel();
				var list = [];
				if (!player.storage.kuanmrfz && player.hasSkill("kuanmrfz")) list.add("修改【苦暗】");
				if (!player.storage.zhuguangmrfz_change) list.add("修改【逐光】");
				if (!player.storage.zhuguangmrfz_change) list.add("摸一张牌");
				if (player.storage.zhuguangmrfz_change) list.add("摸两张牌");

				//判断是否只剩余一个选项
				if (list.length == 1) {
					player.draw(player.storage.zhuguangmrfz_change ? 2 : 1);
					//@ts-ignore
					player.logSkill("zhuguangmrfz");
					return;
				} else {
					list.add("cancel2");
					const result = await player
						.chooseControl(list)
						.set("prompt", get.prompt("zhuguangmrfz"))
						.set("prompt2", "选择一项")
						.set("ai", function () {
							if (!player.storage.zhuguangmrfz_change) return 1;
							if (!player.storage.kuanmrfz && player.hasSkill("kuanmrfz")) return 0;
							return [0, 1].randomGet();
						})
						.forResult();
					if (result.control != "cancel2") {
						//@ts-ignore
						player.logSkill("zhuguangmrfz");
						if (result.control == "修改【苦暗】") {
							player.storage.kuanmrfz = true;
						}
						if (result.control == "修改【逐光】") {
							player.storage.zhuguangmrfz_change = true;
						}
						if (result.control == "摸一张牌") {
							player.draw();
						}
						if (result.control == "摸两张牌") {
							player.draw(2);
						}
					}
				}
			},
		},
		zhuguangmrfz_change: {
			audio: "zhuguangmrfz",
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return player.storage.zhuguangmrfz_change;
			},
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget("选择一名其他角色，视为对其使用【决斗】，且此决斗不可响应", function (card, player, target) {
						return target != player;
					})
					.set("ai", function (target) {
						return -get.attitude(_status.event.player, target);
					})
					.forResult();
				player.addSkill(["zhuguangmrfz2", "zhuguangmrfz3"]);
				if (result.bool && result.targets) {
					var target = result.targets[0];
					await player.useCard({ name: "juedou", zhuguangmrfz: true }, true, target);
				}
				if (player.hasSkill("zhuguangmrfz2")) player.removeSkill("zhuguangmrfz2");
				if (player.hasSkill("zhuguangmrfz3")) player.removeSkill("zhuguangmrfz3");
			},
		},
		zhuguangmrfz3: {
			trigger: {
				player: "useCard",
			},
			forced: true,
			charlotte: true,
			silent: true,
			filter: function (event, player) {
				//@ts-ignore
				return event.card.name == "juedou" && event.card.zhuguangmrfz == true;
			},
			async content(event, trigger, player) {
				//@ts-ignore
				trigger.directHit.addArray(
					game.filterPlayer(function (current) {
						return current != player;
					})
				);
			},
			ai: {
				directHit_ai: true,
			},
		},
		kuanmrfz: {
			audio: 2,
			trigger: { global: "gameDrawAfter" },
			forced: true,
			async content(event, trigger, player) {
				player.disableEquip("equip1");
				player.disableEquip("equip2");
				player.disableEquip("equip3");
				player.disableEquip("equip4");
				player.disableEquip("equip5");
				player.disableJudge();
				player.draw(3);
			},
			group: ["kuanmrfz2", "kuanmrfz5"],
			mod: {
				ignoredHandcard: function (card, player) {
					if (get.type(card) == "equip") return true;
				},
				cardDiscardable: function (card, player, name) {
					if (name == "phaseDiscard" && get.type(card) == "equip") return false;
				},
			},
		},
		kuanmrfz2: {
			audio: 2,
			trigger: { player: "phaseJudgeBefore" },
			forced: true,
			filter: function (event, player) {
				return !player.storage.kuanmrfz;
			},
			async content(event, trigger, player) {
				const result = await player
					.judge(function (card) {
						if (get.suit(card) == "heart") return -2;
						return 1;
					})
					.forResult();
				if (result.suit !== "heart") {
					player.skip("phaseUse");
					game.log(player, "的<span class=thundertext>【乐不思蜀】</span>判定结果为", result.suit, ",", player, "跳过出牌阶段");
				} else {
					game.log(player, "的<span class=thundertext>【乐不思蜀】</span>判定结果为", result.suit, ",判定失败");
				}
				const result_bingliang = await player
					.judge(function (card) {
						if (get.suit(card) == "club") return -2;
						return 1;
					})
					.forResult();
				if (result_bingliang.suit !== "club") {
					player.skip("phaseDraw");
					game.log(player, "的<span class=thundertext>【兵粮寸断】</span>判定结果为", result_bingliang.suit, ",", player, "跳过摸牌阶段");
				} else {
					game.log(player, "的<span class=thundertext>【兵粮寸断】</span>判定结果为", result_bingliang.suit, ",判定失败");
				}
			},
		},
		kuanmrfz5: {
			audio: "kuanmrfz",
			enable: ["chooseToRespond", "chooseToUse"],
			filter: function (event, player) {
				if (
					event.type == "wuxie" ||
					player.countCards("h", function (card) {
						return get.type(card) == "equip";
					}) == 0
				)
					return false;
				for (var name of ["sha", "shan", "jiu"]) {
					if (event.filterCard({ name: name, isCard: true }, player, event)) return true;
				}
				return false;
			},
			chooseButton: {
				dialog: function (event, player) {
					var vcards = [];
					for (var name of ["sha", "shan", "jiu"]) {
						var card = { name: name, isCard: true };
						if (event.filterCard(card, player, event)) vcards.push(["基本", "", name]);
					}
					var dialog = ui.create.dialog("苦暗", [vcards, "vcard"], "hidden");
					//@ts-ignore
					dialog.direct = true;
					return dialog;
				},
				backup: function (links, player) {
					return {
						filterCard: function (card) {
							return get.type(card) == "equip";
						},
						selectCard: 1,
						viewAs: {
							name: links[0][2],
							isCard: false,
						},
						popname: true,
						async precontent(event, trigger, player) {
							//@ts-ignore
							player.logSkill("kuanmrfz");
						},
					};
				},
				prompt: function (links, player) {
					return "【苦暗】：使用一张【" + get.translation(links[0][2]) + "】";
				},
			},
			ai: {
				order: 3,
				respondSha: true,
				respondShan: true,
			},
		},
		shuoguangmrfz: {
			audio: 2,
			trigger: { player: "phaseDiscardBefore" },
			forced: true,
			filter: function (event, player) {
				return !player.storage.shuoguangmrfz;
			},
			async content(event, trigger, player) {
				trigger.cancel();
				player.storage.shuoguangmrfz = true;
			},
		},
		//凯尔希
		yuanlvemrfz: {
			audio: 2,
			trigger: { player: "drawBegin" },
			forced: true,
			filter: function (event, player) {
				//@ts-ignore
				return event.getParent(1) && event.getParent(1).name != "yuanlvemrfz";
			},
			async content(event, trigger, player) {
				let num = 0;
				if (!player.storage.yuanshimrfz || player.storage.yuanshimrfz_gain) {
					num = trigger.num;
				} else {
					num = trigger.num + 1;
				}
				if (trigger.parent && trigger.parent.name !== "phaseDraw") {
					player.chooseToGuanxing(num);
					player.draw(num);
				} else {
					player.chooseToGuanxing(num + 1);
					player.draw(num + 1);
				}
				trigger.cancel();
			},
		},
		chonggoumrfz: {
			intro: {
				content: "已修改【重构】。",
			},
			onremove: true,
			audio: 2,
			trigger: { player: "phaseDrawBegin2" },
			filter: function (event, player) {
				if (player.getDamagedHp() == 0 && !player.storage.chonggoumrfz) return false;
				return player.countCards("h") >= player.hp;
			},
			async content(event, trigger, player) {
				player.chooseToDiscard("h", player.countCards("h"), true);
				if (!player.storage.chonggoumrfz) {
					player.draw(player.countCards("h") - player.getDamagedHp());
				} else {
					player.draw(player.countCards("h"));
				}
				player.recover();
			},
		},
		yuanshimrfz: {
			intro: {
				content: "令【远略】中的X+1。",
			},
			onremove: true,
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			forced: true,
			audio: 3,
			direct: true,
			filter: function (event, player) {
				return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				var hs = player.getCards("h");
				if (hs.length) player.addGaintag(hs, "yuanshimrfz");
			},
			group: ["yuanshimrfz_basic", "yuanshimrfz_equip", "yuanshimrfz_trick", "yuanshimrfz_gain"],
			subSkill: {
				basic: {
					audio: "yuanshimrfz",
					trigger: {
						player: "useCard",
					},
					prompt: "是否令此牌不可响应",
					check: function (event, player) {
						if (event.card.name == "sha") return true;
						return false;
					},
					filter: function (event, player) {
						//@ts-ignore
						if (get.type(event.card) !== "basic") return false;
						return player.hasHistory("lose", function (evt) {
							if (event != evt.getParent()) return false;
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("yuanshimrfz")) return true;
							}
							return false;
						});
					},
					async content(event, trigger, player) {
						if (!player.storage.yuanshimrfz_gain) player.storage.yuanshimrfz_gain = true;
						//@ts-ignore
						trigger.directHit.addArray(
							game.filterPlayer(function (current) {
								return current != player;
							})
						);
					},
					ai: {
						directHit_ai: true,
					},
				},
				equip: {
					audio: "yuanshimrfz",
					trigger: { player: "useCard" },
					prompt: "是否摸一张牌",
					filter: function (event, player) {
						//@ts-ignore
						if (get.type(event.card) !== "equip" && get.type(event.card) !== "delay") return false;
						return player.hasHistory("lose", function (evt) {
							if (event != evt.getParent()) return false;
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("yuanshimrfz")) return true;
							}
							return false;
						});
					},
					async content(event, trigger, player) {
						if (!player.storage.yuanshimrfz_gain) player.storage.yuanshimrfz_gain = true;
						player.draw();
					},
				},
				trick: {
					audio: "yuanshimrfz",
					trigger: { player: "useCard" },
					prompt: function (event, player) {
						return "是否令" + get.translation(event.card) + "的目标+1/-1";
					},
					filter: function (event, player) {
						//@ts-ignore
						if (get.type(event.card) !== "trick") return false;
						//@ts-ignore
						return player.hasHistory("lose", function (evt) {
							if (event != evt.getParent()) return false;
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("yuanshimrfz")) return true;
							}
							return false;
						});
					},
					async content(event, trigger, player) {
						if (!player.storage.yuanshimrfz_gain) player.storage.yuanshimrfz_gain = true;
						var prompt2 = "为" + get.translation(trigger.card) + "增加或减少一个目标";
						const result = await player
							.chooseTarget(get.prompt("yuanshimrfz"), function (card, player, target) {
								var playerx = get.player();
								if (_status.event.targets.includes(target)) return true;
								return (
									lib.filter.targetEnabled2(_status.event.card, playerx, target) &&
									lib.filter.targetInRange(_status.event.card, playerx, target)
								);
							})
							.set("prompt2", prompt2)
							.set("ai", function (target) {
								var trigger = _status.event.getTrigger();
								var player = _status.event.player;
								return get.effect(target, trigger.card, player, player) * (_status.event.targets.includes(target) ? -1 : 1);
							})
							.set("targets", trigger.targets)
							.set("card", trigger.card)
							.forResult();
						if (result.targets) {
							player.line(result.targets);
							if (trigger.targets.includes(event.targets[0])) trigger.targets.removeArray(event.targets);
							else trigger.targets.addArray(event.targets);
						}
					},
				},
				gain: {
					audio: "yuanshimrfz",
					trigger: { player: "loseAfter" },
					forced: true,
					filter: function (event, player) {
						if (player.storage.yuanshimrfz || player.storage.chonggoumrfz) return false;
						return !player.hasCard(function (card) {
							return card.hasGaintag("yuanshimrfz");
						}, "h");
					},
					async content(event, trigger, player) {
						if (!player.storage.yuanshimrfz_gain) {
							player.storage.yuanshimrfz = true;
							player.markSkill("yuanshimrfz");
						} else {
							player.storage.chonggoumrfz = true;
							player.markSkill("chonggoumrfz");
						}
					},
				},
			},
		},
		m3mrfz: {
			audio: 2,
			trigger: {
				player: "dying",
			},
			zhuSkill: true,
			skillAnimation: true,
			animationColor: "red",
			mark: true,
			unique: true,
			limited: true,
			filter: function (event, player) {
				if (player.hp > 0) return false;
				return !player.storage.m3mrfz;
			},
			init: (player, skill) => (player.storage[skill] = false),
			check: function (event, player) {
				var num = player.countCards("h", function (card) {
					return card.name == "tao" || card.name == "jiu";
				});
				return player.hp + num <= 0;
			},
			async content(event, trigger, player) {
				player.awakenSkill("m3mrfz");
				player.removeSkill("chonggoumrfz");
				player.discard(player.getCards("hej"));
				player.recoverTo(2);
				player.storage.m3mrfz = true;
				player.loseMaxHp();
				player.turnOver(false);
				player.link(false);

				let targets = game.players.slice().remove(player);

				for (let target of targets) {
					const result = await target
						.chooseToDiscard(`【m3】:你可以弃置一张牌并令${get.translation(player)}摸一张牌`)
						.set("ai", card => {
							const player = get.player();
							/**
							 * @type {Player}
							 */
							//@ts-ignore
							const targetx = get.event().targetx;
							if (get.attitude(player, targetx) < 0) return -1;
							return 114514 - get.value(card);
						})
						.set("targetx", player)
						.forResult();
					if (result.cards) {
						target.line(player);
						await player.draw();
					}
				}
			},
		},
		//山
		zhuangtimrfz: {
			intro: {
				content: "已造成#点伤害",
			},
			audio: 2,
			forced: true,
			direct: true,
			trigger: { source: "damageEnd" },
			filter: function (event, player) {
				return player.maxHp < 15;
			},
			async content(event, trigger, player) {
				await player.addMark("zhuangtimrfz", trigger.num);
				var damage = player.countMark("zhuangtimrfz");
				if (damage > 1) {
					player.gainMaxHp(Math.floor(damage / 2));
					player.removeMark("zhuangtimrfz", Math.floor(damage / 2) * 2);
				}
			},
			group: ["zhuangtimrfz_use", "zhuangtimrfz_draw"],
			subSkill: {
				use: {
					audio: "zhuangtimrfz",
					usable: 1,
					enable: "phaseUse",
					filter: function (event, player) {
						for (var i of lib.inpile) {
							if (get.type(i) == "trick" && event.filterCard({ name: i, isCard: true }, player, event)) return true;
							if (get.type(i) == "basic" && event.filterCard({ name: i, isCard: true }, player, event)) return true;
						}
						return false;
					},
					chooseButton: {
						dialog: function (event, player) {
							var list = [];
							for (var i of lib.inpile) {
								if (get.type(i) == "trick" && event.filterCard({ name: i, isCard: true }, player, event)) list.push(["锦囊", "", i]);
								if (get.type(i) == "basic" && event.filterCard({ name: i, isCard: true }, player, event)) list.push(["基本", "", i]);
							}
							return ui.create.dialog("壮体", [list, "vcard"]);
						},
						check: function (button) {
							return _status.event.player.getUseValue({
								//@ts-ignore
								name: button.link[2],
								isCard: true,
							});
						},
						backup: function (links, player) {
							return {
								viewAs: {
									name: links[0][2],
									isCard: true,
								},
								filterCard: () => false,
								selectCard: -1,
								popname: true,
								async precontent(event, trigger, player) {
									//@ts-ignore
									player.logSkill("zhuangtimrfz");
									player.loseMaxHp();
								},
							};
						},
						prompt: function (links, player) {
							return "请选择" + get.translation(links[0][2]) + "的目标";
						},
					},
					ai: { order: 1, result: { player: 1 } },
				},
				draw: {
					audio: "zhuangtimrfz",
					trigger: { player: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						return false;
					},
					check: function (event, player) {
						return player.hp < 3;
					},
					promt: function (event, player) {
						return "是否失去" + player.getDamagedHp() + "点体力上限，摸" + Math.ceil(player.getDamagedHp() / 2) + "张牌。";
					},
					async content(event, trigger, player) {
						var num = player.getDamagedHp();
						player.loseMaxHp(num);
						player.draw(Math.ceil(num / 2));
					},
				},
			},
		},
		julimrfz: {
			audio: 2,
			trigger: { source: "damageBegin" },
			filter: function (event, player) {
				return player.getDamagedHp() >= event.player.hp;
			},
			check: function (event, player) {
				return get.attitude(player, event.player) < 0;
			},
			async content(event, trigger, player) {
				trigger.num++;
				var card = trigger.player.countCards("he");
				if (player.maxHp >= card) {
					const result = await player
						.chooseControl("确定", "cancel2")
						.set("prompt", "是否失去两点体力上限，令此伤害+1")
						.set("ai", function (event, player) {
							if (get.attitude(player, event.player) < 0 && player.maxHp >= 3) return 0;
							return 1;
						})
						.forResult();
					if (result.control !== "cancel2") {
						trigger.num++;
						player.loseMaxHp(2);
					}
				}
			},
		},

		//歌蕾蒂亚
		xunxiangmrfz: {
			audio: 2,
			usable: 2,
			enable: "phaseUse",
			filter: function (event, player) {
				if (player.hasSkill("xunxiangmrfz2")) return false;
				return game.hasPlayer(current => current.countCards("h") > 0);
			},
			filterTarget: function (card, player, target) {
				return target.countCards("h") > 0;
			},
			selectTarget: -1,
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				const { targets } = event;
				var num = [3, 1, 2].randomGet();
				if (num == 1) player.storage.xunxiangmrfz = "basic";
				if (num == 2) player.storage.xunxiangmrfz = "trick";
				if (num == 3) player.storage.xunxiangmrfz = "equip";
				game.log("<span class=thundertext>【寻相】</span>随机的类型为<span class=firetext>", player.storage.xunxiangmrfz, "牌</span>");
				player.popup(get.translation(player.storage.xunxiangmrfz) + "牌");
				targets.sortBySeat();
				var next = player
					.chooseCardOL(targets, "请选择要展示的牌", true)
					.set("ai", function (card) {
						return -get.value(card);
					})
					.set("source", player);
				next.aiCard = function (target) {
					var hs = target.getCards("h");
					return { bool: true, cards: [hs.randomGet()] };
				};
				next._args.remove("glow_result");

				await next;

				var cards = [];
				var num = 0;
				const result = next.forResult();
				event.videoId = lib.status.videoId++;
				for (var i = 0; i < targets.length; i++) {
					cards.push(result[i].cards[0]);
				}
				event.cards = cards;
				game.log(player, "展示了", targets, "的", cards);
				game.broadcastAll(
					function (targets, cards, id, player) {
						var dialog = ui.create.dialog(
							get.translation(player) +
								"发动了【寻相】</br><span class=firetext>【寻相】随机声明的类型为" +
								get.translation(player.storage.xunxiangmrfz) +
								"牌</span>",
							cards
						);
						//@ts-ignore
						dialog.videoId = id;
						var getName = function (target) {
							if (target._tempTranslate) return target._tempTranslate;
							var name = target.name;
							if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
							return get.translation(name);
						};
						for (var i = 0; i < targets.length; i++) {
							//@ts-ignore
							dialog.buttons[i].querySelector(".info").innerHTML = getName(targets[i]);
							if (get.type(result[i].cards[0]) == player.storage.xunxiangmrfz) num++;
							if (get.type(result[i].cards[0]) == "delay" && player.storage.xunxiangmrfz == "trick") num++;
						}
					},
					targets,
					cards,
					event.videoId,
					player
				);
				game.delay(4);
				if (num == 0) {
					const result = await player
						.chooseTarget("选择一名其他角色，你与其各流失一点体力", true, function (card, player, target) {
							return target != player;
						})
						.set("ai", target => get.attitude(player, target) < 2)
						.forResult();

					if (result.targets) {
						player.loseHp();
						var target = result.targets[0];
						target.loseHp();
					}
				} else {
					player.addTempSkill("xunxiangmrfz2", "phaseUseEnd");
					player.draw(num);
				}

				//@ts-ignore
				game.broadcastAll("closeDialog", event.videoId);
			},
			ai: {
				order: 12,
				result: {
					player: 5,
				},
			},
		},
		xunxiangmrfz2: {
			//检测用技能，无实际意义。
		},
		ronghangmrfz: {
			audio: 2,
			trigger: { player: "useCard" },
			forced: true,
			getLastUsed: function (player, event) {
				var history = player.getAllHistory("useCard");
				var index;
				if (event) index = history.indexOf(event) - 1;
				else index = history.length - 1;
				if (index >= 0) return history[index];
				return false;
			},
			filter: function (event, player) {
				var evtcard = event.card;
				var evt = lib.skill.ronghangmrfz.getLastUsed(player, event);
				if (!evt.card || !evt) return false;
				return get.tag(evtcard, "damage") > 0;
			},
			async content(event, trigger, player) {
				var lastcard = lib.skill.ronghangmrfz.getLastUsed(player, trigger);
				//@ts-ignore
				if (get.cardNameLength(lastcard.card) < get.cardNameLength(trigger.card)) {
					trigger.baseDamage++;
					player.popup("伤害基数+1");
				} else {
					var name = get.name(trigger.card);
					if (name == "sha") {
						trigger.addCount = false;
						if (player.stat[player.stat.length - 1].card.sha > 0) {
							player.stat[player.stat.length - 1].card.sha--;
						}
					} else if (name == "jiu") {
						trigger.addCount = false;
						if (player.stat[player.stat.length - 1].card.jiu > 0) {
							player.stat[player.stat.length - 1].card.jiu--;
						}
					}
					//@ts-ignore
					trigger.directHit.addArray(
						game.filterPlayer(function (current) {
							return current != player;
						})
					);
					player.popup("强中且无限制");
				}
			},
			ai: {
				directHit_ai: true,
				skillTagFilter: function (player, tag, arg) {
					var evtcard = lib.skill.ronghangmrfz.getLastUsed(player, event);
					return get.cardNameLength(evtcard) >= get.cardNameLength(arg.card);
				},
			},
		},
		//废弃技能，暂时无用
		// caiganmrfz: {
		// 	trigger: {
		// 		player: "gainAfter",
		// 	},
		// 	firstDo: true,
		// 	direct: true,
		// 	filter: function (event, player) {
		// 		return event.getParent(2).name != "caiganmrfz";
		// 	},
		// 	audio: 2,
		// 	content: function () {
		// 		"step 0";
		// 		player.chooseToDiscard("h", [1, Infinity], get.prompt("caiganmrfz"), function (card) {
		// 			return card.hasGaintag("caiganmrfz");
		// 		});
		// 		("step 1");
		// 		if (result.bool) {
		// 			var cards = result.cards;
		// 			player.draw(cards.length);
		// 			if (!player.storage.caiganmrfz_times) {
		// 				player.storage.caiganmrfz_times = true;
		// 				player.draw();
		// 			}
		// 		}
		// 	},
		// 	ai: {
		// 		threaten: 1.6,
		// 		expose: 0.2,
		// 	},
		// 	group: ["caiganmrfz_mark", "caiganmrfz_remove", "caiganmrfz_times"],
		// 	subSkill: {
		// 		mark: {
		// 			trigger: {
		// 				player: "gainBegin",
		// 			},
		// 			silent: true,
		// 			content: function () {
		// 				trigger.gaintag.add("caiganmrfz");
		// 			},
		// 		},
		// 		remove: {
		// 			trigger: {
		// 				player: "gainAfter",
		// 			},
		// 			silent: true,
		// 			forced: true,
		// 			charlotte: true,
		// 			content: function () {
		// 				player.removeGaintag("caiganmrfz");
		// 			},
		// 		},
		// 		times: {
		// 			trigger: {
		// 				global: "phaseEnd",
		// 			},
		// 			silent: true,
		// 			filter: function (event, player) {
		// 				return player.storage.caiganmrfz_times;
		// 			},
		// 			content: function () {
		// 				player.storage.caiganmrfz_times = false;
		// 			},
		// 		},
		// 	},
		// },
		jingsimrfz: {
			onremove: true,
			intro: { content: "已使用的牌：$" },
			trigger: { player: "useCard" },
			audio: 2,
			frequent: true,
			filter: function (event, player) {
				return !player.getStorage("jingsimrfz").includes(event.card.name);
			},
			async content(event, trigger, player) {
				player.draw();
				player.markAuto("jingsimrfz", [trigger.card.name]);
			},
		},
		//旧星熊
		banruomrfz: {
			audio: 4,
			onremove: true,
			init: function (player) {
				player.storage.banruomrfz = true;
				player.syncStorage("banruomrfz");
			},
			intro: {
				content: function (storage, player, skill) {
					if (player.storage.banruomrfz) return "星熊的巨盾将会保护她和她想保护的人";
					return "盾牌破损，但她并未后退";
				},
			},
			mark: true,
			trigger: { player: "damageBegin3" },
			filter: function (event, player) {
				return player.storage.banruomrfz;
			},
			prompt: "是否取消此次伤害",
			async content(event, trigger, player) {
				trigger.cancel();
			},
			mod: {
				maxHandcardBase: function (player, num) {
					if (player.storage.banruomrfz) return player.maxHp;
				},
			},
			group: ["banruomrfz_lose", "banruomrfz_draw", "banruomrfz_round", "banruomrfz_atk"],
			subSkill: {
				lose: {
					forced: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return player.storage.banruomrfz;
					},
					firstDo: true,
					async content(event, trigger, player) {
						player.storage.banruomrfz = false;
					},
				},
				draw: {
					forced: true,
					popup: false,
					trigger: { player: "phaseDrawBegin2" },
					filter: function (event, player) {
						return player.storage.banruomrfz;
					},
					async content(event, trigger, player) {
						trigger.num--;
					},
				},
				round: {
					forced: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return game.roundNumber > player.maxHp && player.storage.banruomrfz;
					},
					async content(event, trigger, player) {
						player.storage.banruomrfz = false;
						//@ts-ignore
						player.logSkill("banruomrfz");
					},
				},
				atk: {
					forced: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return !player.storage.banruomrfz;
					},
					async content(event, trigger, player) {
						player.removeSkill("banruomrfz_atk");
						player.addSkill("banruomrfz2");
						//@ts-ignore
						player.logSkill("banruomrfz");
					},
				},
			},
			ai: {
				effect: {
					target: function (card, player, target, current) {
						if (!player.storage.banruomrfz) return;
						if (get.tag(card, "damage")) return "zerotarget";
						if (get.type(card) == "trick" && get.tag(card, "damage")) {
							return "zeroplayertarget";
						}
					},
				},
			},
		},
		banruomrfz2: {
			mark: true,
			onremove: true,
			intro: {
				content: "星熊放下了她的盾",
			},
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return (num += 1);
				},
			},
			group: ["banruomrfz2_damage", "banruomrfz2_lose"],
			subSkill: {
				damage: {
					forced: true,
					usable: 1,
					trigger: { source: "damageBegin" },
					async content(event, trigger, player) {
						trigger.num++;
						//@ts-ignore
						player.logSkill("banruomrfz");
					},
				},
				lose: {
					forced: true,
					trigger: { global: "phaseEnd" },
					async content(event, trigger, player) {
						player.removeSkill("banruomrfz2");
					},
				},
			},
		},
		yizhongmrfz: {
			audio: 2,
			trigger: { global: "damageBegin3" },
			filter: function (event, player) {
				return get.distance(player, event.player) <= 1 && event.player != player && player.countCards("he") > 0;
			},
			check: function (event, player) {
				return get.attitude(player, event.player) > 0;
			},
			prompt: function (event, player) {
				return "是否弃置一张牌并为" + get.translation(event.player) + "承担伤害";
			},
			async content(event, trigger, player) {
				player.chooseToDiscard(true, "he");
				trigger.cancel();
				player.damage(trigger.num, trigger.source || "nosource", "nocard");
			},
			group: "yizhongmrfz2",
		},
		yizhongmrfz2: {
			trigger: { player: "damageEnd" },
			firstDo: true,
			filter: function (event, player) {
				return event.parent && event.parent.name == "yizhongmrfz";
			},
			prompt: "是否摸两张牌",
			async content(event, trigger, player) {
				player.draw(2);
			},
		},
		//卡涅利安
		shazhenmrfz: {
			audio: 2,
			forced: true,
			mark: true,
			init: function (player) {
				player.storage.shazhenmrfz = false;
				player.syncStorage("shazhenmrfz");
			},
			intro: {
				content: function (storage, player, skill) {
					if (!player.storage.shazhenmrfz || game.roundNumber == 1)
						return "沙暴环绕着卡涅利安</br>【沙阵】剩余次数：" + (2 - player.countMark("shazhenmrfz_damage"));
					return "沙暴散去";
				},
			},
			onremove: true,
			trigger: { player: "damageBegin3" },
			filter: function (event, player) {
				return (game.roundNumber == 1 || !player.storage.shazhenmrfz) && player.countMark("shazhenmrfz_damage") < 2;
			},
			async content(event, trigger, player) {
				trigger.num--;
				player.addMark("shazhenmrfz_damage", 1);
			},
			mod: {
				maxHandcardBase: function (player, num) {
					if (!player.storage.shazhenmrfz) return (num += 2);
				},
			},
			group: ["shazhenmrfz_damage", "shazhenmrfz_clear"],
			subSkill: {
				damage: {
					forced: true,
					silent: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return !event.player.hasMark("shacanmrfz");
					},
					async content(event, trigger, player) {
						player.storage.shazhenmrfz = true;
					},
				},
				clear: {
					forced: true,
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.storage.shazhenmrfz || player.countMark("shazhenmrfz_damage") > 0;
					},
					async content(event, trigger, player) {
						player.storage.shazhenmrfz = false;
						player.removeMark("shazhenmrfz_damage", player.countMark("shazhenmrfz_damage"));
					},
				},
			},
		},
		shacanmrfz: {
			marktext: "噬",
			intro: {
				name: "噬",
				content: function (storage, player, skill) {
					return (
						"<span class=firetext>食噬之印</span></br>还需交给卡涅利安" +
						(2 - player.countMark("shacanmrfz2")) +
						"张牌即可消除一个‘噬’标记"
					);
				},
			},
			onremove: true,
			trigger: { source: "damageEnd" },
			audio: 2,
			filter: function (event, player) {
				return event.player.isAlive() && event.player.countMark("shacanmrfz") < 2;
			},
			prompt: function (event, player) {
				return "是否令" + get.translation(event.player) + "获得一个‘噬’标记";
			},
			check: function (event, player) {
				return get.attitude(player, event.player) <= 0;
			},
			async content(event, trigger, player) {
				trigger.player.addMark("shacanmrfz");
			},
			group: ["shacanmrfz_remove", "shacanmrfz_gain"],
			subSkill: {
				remove: {
					forced: true,
					charlotte: true,
					silent: true,
					trigger: { player: "gainEnd" },
					filter: function (event, player) {
						return event.source && event.source.isAlive() && event.source != player && event.source.hasMark("shacanmrfz");
					},
					logTarget: "source",
					async content(event, trigger, player) {
						var target = trigger.source;
						var num = target.countMark("shacanmrfz2");
						target.addMark("shacanmrfz2", trigger.cards.length, false);
						if (num > 1) {
							target.removeMark("shacanmrfz", Math.floor(num / 2));
							target.removeMark("shacanmrfz2", Math.floor(num / 2) * 2);
						}
					},
				},
				gain: {
					trigger: { global: "phaseUseBegin" },
					filter: function (event, player) {
						return event.player.hasMark("shacanmrfz") && (player.getDamagedHp() > 0 || event.player.countCards("he") > 0);
					},
					direct: true,
					charlotte: true,
					async content(event, trigger, player) {
						var target = trigger.player;
						var list = [];
						if (player.getDamagedHp() > 0) list.add("回血");
						if (target.countCards("he") > 0) list.add("交牌");
						const result = await target
							.chooseControl(list)
							.set("prompt", "选择一项")
							.set("ai", function (player) {
								return 0;
							})
							.forResult();
						if (result.control == "cancel2") event.finish();
						if (result.control == "回血") {
							player.recover();
							target.removeMark("shacanmrfz");
							//@ts-ignore
							player.logSkill("shacanmrfz");
							event.finish();
						}
						if (result.control == "交牌") {
							const resultx = await target
								.chooseCard(target.countCards("he") > 1 ? 2 : 1, "展示两张牌", true, "he")
								.set("ai", function (card) {
									return get.value(card);
								})
								.forResult();
							if (resultx.bool && resultx.cards && resultx.cards.length) {
								if (resultx.cards.length == 1) {
									player.gain(resultx.cards, target, "give");
									//@ts-ignore
									player.logSkill("shacanmrfz");
									return;
								} else {
									const resulty = await player
										.chooseButton(["选择获得其中的一张牌", result.cards], true)
										.set("ai", button => get.value(button.link))
										.forResult();
									player.gain(result.links, target, "give");
									//@ts-ignore
									player.logSkill("shacanmrfz");
								}
							}
						}
					},
				},
			},
		},
		shacanmrfz2: {
			//检测用技能，无实际意义
		},
		shahuanmrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filterTarget: function (card, player, target) {
				return target != player && target.countMark("shacanmrfz") < 1;
			},
			async content(event, trigger, player) {
				target.addMark("shacanmrfz");
			},
			ai: {
				order: 10,
				expose: 0.4,
				result: {
					target: -1,
				},
				threaten: 2,
			},
		},
		//陈
		danweimrfz: {
			onremove: true,
			intro: {
				content: "已有#个胆",
			},
			audio: 2,
			usable: 2,
			trigger: { global: ["respond", "useCard"] },
			filter: function (event, player) {
				if (!event.respondTo) return false;
				if (player != event.respondTo[0]) return false;
				return event.cards.filterInD("o").filterInD("d").length > 0;
			},
			logTarget: "player",
			async content(event, trigger, player) {
				var cards = trigger.cards.filterInD("o").filterInD("d");
				player.gain(cards, "log", "gain2");
				player.addMark("danweimrfz");
			},
			group: ["danweimrfz_use"],
			subSkill: {
				use: {
					audio: "danweimrfz",
					trigger: { player: ["respond", "useCard"] },
					usable: 2,
					filter: function (event, player) {
						if (!event.respondTo) return false;
						return event.cards.filterInD("o").filterInD("d").length > 0;
					},
					logTarget: "player",
					async content(event, trigger, player) {
						var cards = [];
						if (get.itemtype(trigger.respondTo[1]) == "card") cards.push(trigger.respondTo[1]);
						else if (trigger.respondTo[1].cards) cards.addArray(trigger.respondTo[1].cards);
						cards = cards.filterInD("o").filterInD("d");
						player.gain(cards, "gain2", "log");
						player.addMark("danweimrfz");
					},
				},
			},
		},
		hechimrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			selectTarget: 1,
			filterTarget: true,
			filter: function (event, player) {
				return player.countMark("danweimrfz") > 0 || player.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				const { target } = event;

				let result;
				if (player.countCards("h") == 0) result = { index: 1 };
				if (player.countMark("danweimrfz") == 0) result = { index: 0 };
				if (player.countMark("danweimrfz") > 0 && player.countCards("h") > 0)
					result = await player
						.chooseControl()
						.set("choiceList", [
							"弃置一张手牌", //0
							"失去一个‘胆’", //1
						])
						.set("ai", function (card) {
							var player = _status.event.player;
							if (
								player.hasCard(function (card) {
									return get.value(card) < 7;
								}, "h")
							)
								return 0;
							return 1;
						})
						.forResult();
				if (result && result.index == 0) {
					await player.chooseToDiscard(true, "h", "弃置一张手牌");
				} else {
					player.removeMark("danweimrfz");
				}

				if (!target.hasSkill("hechimrfz2")) target.addSkill("hechimrfz2");
				target.addMark("hechimrfz2");
				target.draw(2);
				if (target != player) player.draw();
			},
			ai: {
				order: 13,
			},
		},
		hechimrfz2: {
			onremove: true,
			mark: true,
			marktext: "斥",
			intro: {
				name: "呵斥",
				content: "受到了陈的*龙门粗口*，手牌上限-#",
			},
			trigger: { player: "phaseDiscardEnd" },
			forced: true,
			charlotte: true,
			silent: true,
			async content(event, trigger, player) {
				player.removeMark("hechimrfz2", player.countMark("hechimrfz2"));
				player.removeSkill("hechimrfz2");
				//@ts-ignore 彩蛋
				if (Math.random() < 0.1) player.logSkill("chencaidanmrfz");
			},
			mod: {
				maxHandcardBase: function (player, num) {
					return (num -= player.countMark("hechimrfz2"));
				},
			},
		},
		jueyingmrfz: {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return player.countMark("danweimrfz") >= 5;
			},
			async content(event, trigger, player) {
				player.removeMark("danweimrfz", 5);

				let num = 0;
				while (num < 2) {
					await player.chooseUseTarget(
						{
							name: "sha",
							nature: "thunder",
							isCard: true,
						},
						"请选择雷【杀】的目标（雷【杀】：" + num + "/2；普通【杀】:0/1）",
						false,
						"nodistance"
					);
					num++;
				}

				player.chooseUseTarget(
					{
						name: "sha",
						isCard: true,
					},
					"请选择【杀】的目标（雷【杀】：2/2；普通【杀】:1/1）",
					false,
					"nodistance"
				);
			},
		},
		chencaidanmrfz: {
			//彩蛋
			audio: 3,
		},
		newjingsimrfz: {
			audio: 2,
			zhuSkill: true,
			trigger: { global: "useCardToTarget" },
			filter: function (event, player) {
				if (player.hasSkill("newjingsimrfz_ban")) return false;
				if (event.targets.length > 1) return false;
				if (event.player == player || event.target == player || event.source == player || player == _status.currentPhase) return false;
				return event.card.name == "sha" || event.card.name == "juedou";
			},
			direct: true,
			async content(event, trigger, player) {
				var target = trigger.target,
					card = trigger.card;
				const result = await target
					.chooseBool("【警司】：是否请求将此" + get.translation(trigger.card) + "的目标改为" + get.translation(player) + "?")
					.set("ai", function () {
						var player = _status.event.player,
							target = _status.event.getTrigger().player;
						return get.attitude(player, target) > 2;
					})
					.forResult();
				if (result.bool) {
					const { bool } = await player
						.chooseBool(
							"【警司】：是否接受" + get.translation(trigger.player) + "的请求，令" + get.translation(trigger.card) + "的目标改为你？"
						)
						.set("ai", function () {
							var player = _status.event.player,
								target = _status.event.getTrigger().player;
							var nametmp = _status.event.name;
							if (
								nametmp == "sha" &&
								player.countCards("h", function (card) {
									return card.name == "shan";
								}) < 1
							)
								return false;
							if (
								nametmp == "juedou" &&
								player.countCards("h", function (card) {
									return card.name == "sha";
								}) < 2
							)
								return false;
							if (player.hp < 3) return false;
							return get.attitude(player, target) > 2;
						})
						.set("name", trigger.card.name)
						.forResult();
					if (bool === true) {
						player.draw();
						player.addMark("danweimrfz");
						player.addTempSkill("newjingsimrfz_ban", "phaseEnd");
						var target = trigger.target;
						trigger.targets.remove(target);
						//@ts-ignore
						trigger.getParent().triggeredTargets1.remove(target);
						trigger.untrigger();
						game.delayx();
						trigger.targets.push(player);
						trigger.player.line(player, "fire");
						game.log(trigger.card, "的目标被改为", player);
						//@ts-ignore
						player.logSkill("newjingsimrfz");
					}
				}
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
		//新艾雅法拉
		luanhuomrfz: {
			onremove: true,
			marktext: "火",
			intro: {
				name: "乱火",
				content: "本轮已执行回合数：#",
			},
			audio: 2,
			trigger: { player: "damageBegin2" },
			filter: function (event, player) {
				return event.nature == "fire";
			},
			forced: true,
			direct: true,
			async content(event, trigger, player) {
				trigger.cancel();
			},
			ai: {
				nofire: true,
				effect: {
					target: function (card, player, target, current) {
						if (get.tag(card, "fireDamage")) return "zerotarget";
					},
				},
			},
			group: ["luanhuomrfz_fire", "luanhuomrfz_times", "luanhuomrfz_clear", "luanhuomrfz_damage"],
			subSkill: {
				fire: {
					audio: "luanhuomrfz",
					trigger: { source: "damageBegin" },
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return event.nature != "fire";
					},
					async content(event, trigger, player) {
						trigger.cancel();
						trigger.player.damage(trigger.num, player, "fire");
					},
				},
				times: {
					forced: true,
					charlotte: true,
					silent: true,
					trigger: { player: "phaseBegin" },
					async content(event, trigger, player) {
						player.addMark("luanhuomrfz");
					},
				},
				clear: {
					forced: true,
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.countMark("luanhuomrfz") > 0;
					},
					async content(event, trigger, player) {
						player.removeMark("luanhuomrfz", player.countMark("luanhuomrfz"));
					},
				},
				damage: {
					audio: "luanhuomrfz",
					trigger: { player: "phaseZhunbeiBegin" },
					async content(event, trigger, player) {
						var num = player.countMark("luanhuomrfz");
						var str1 = "对至多" + get.cnNumber(num, true) + "名其他角色造成一点伤害";
						var str2 = "对一名其他角色造成" + get.cnNumber(num, true) + "点伤害";
						if (num == 1) {
							const { targets } = await player
								.chooseTarget(get.prompt2("luanhuomrfz"), function (card, player, target) {
									return player != target;
								})
								.set("ai", function (target) {
									var player = _status.event.player;
									return get.damageEffect(target, player, player);
								})
								.forResult();
							if (targets) targets[0].damage();
						} else {
							const { control } = await player
								.chooseControl(str1, str2)
								.set("ai", function (event, player) {
									if (num > 2) return 0;
									return 1;
								})
								.forResult();
							if (control === str1 && num > 1) {
								player.storage.luanhuomrfz_damage = true;
								let { targets } = await player
									.chooseTarget(
										[1, num],
										"对至多" + get.cnNumber(num, true) + "名其他角色造成一点伤害",
										function (card, player, target) {
											return player != target;
										}
									)
									.set("ai", function (target) {
										var player = _status.event.player;
										return get.damageEffect(target, player, player);
									})
									.forResult();
								if (!targets) return;
								for (var i = 0; i < targets.length; i++) targets[i].damage(player);
							} else if (control === str2 && num > 1) {
								player.storage.luanhuomrfz_damage = false;
								let { targets } = await player
									.chooseTarget("对一名其他角色造成" + get.cnNumber(num, true) + "点伤害", function (card, player, target) {
										return player != target;
									})
									.set("ai", function (target) {
										var player = _status.event.player;
										return get.damageEffect(target, player, player);
									})
									.forResult();
								if (!targets) return;
								targets[0].damage(num);
							}
						}
					},
				},
			},
		},
		qingyanmrfz: {
			audio: 2,
			trigger: { player: "phaseUseEnd" },
			filter: function (event, player) {
				if (player.hasMark("qingyanmrfz")) return false;
				return (
					player.getHistory("useCard", function (evt) {
						return evt.getParent("phaseUse") == event;
					}).length > 0
				);
			},
			direct: true,
			async content(event, trigger, player) {
				var list = [];
				//@ts-ignore
				player.getHistory("useCard", function (evt) {
					if (evt.getParent("phaseUse") == trigger) list.add(get.type2(evt.card));
				});
				if (list.length >= 3) {
					const result = await player.chooseBool("【勤研】：是否于本回合结束后额外执行一个回合？").forResult();
					if (!result.bool) return;
					player.insertPhase();
					player.addMark("qingyanmrfz", 1);
					//@ts-ignore
					player.logSkill("qingyanmrfz");
				}
			},
			group: "qingyanmrfz_clear",
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					direct: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.hasMark("qingyanmrfz");
					},
					async content(event, trigger, player) {
						player.removeMark("qingyanmrfz", player.countMark("qingyanmrfz"));
					},
				},
			},
		},
		//傀影
		xuyingmrfz: {
			intro: {
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			audio: 2,
			trigger: { player: "useCard" },
			direct: true,
			notemp: true,
			filter: function (event, player) {
				if (event.xuyingmrfz_buff || !event.targets.length || player.hasSkill("xuyingmrfz_buff")) return false;
				//@ts-ignore
				var type = get.type(event.card, false);
				if (type != "basic" && type != "trick" && player.getExpansions("xuyingmrfz").length > 0) return false;
				return player.getExpansions("xuyingmrfz").filter(function (magic) {
					return get.type2(magic) != get.type2(event.card);
				}).length;
			},
			async content(event, trigger, player) {
				var cards = player.getExpansions("xuyingmrfz").filter(function (magic) {
					return get.type2(magic) != get.type2(trigger.card);
				});
				if (!cards.length) return;
				const { links } = await player.chooseButton(["你可以选择移去一张与你使用的牌类型不同的“虚影”，令此牌结算两次", cards]).forResult();
				if (links) {
					//@ts-ignore
					player.logSkill("xuyingmrfz");
					player.loseToDiscardpile(links);
					player.addTempSkill("xuyingmrfz_buff", "phaseUseAfter");
					trigger.xuyingmrfz_buff = player;
				}
			},
			group: ["xuyingmrfz_discard", "xuyingmrfz_judge"],
			subSkill: {
				discard: {
					audio: "xuyingmrfz",
					trigger: { global: "loseAfter" },
					filter: function (event, player) {
						if (event.type != "discard" || event.getlx === false) return false;
						if (player.getExpansions("xuyingmrfz").length >= 3) return false;
						var cards = event.cards.slice(0);
						var evt = event.getl(player);
						for (var i = 0; i < cards.length; i++) {
							//@ts-ignore
							if (cards[i].original != "j" && get.suit(cards[i], event.player) == "spade" && get.position(cards[i], true) == "d") {
								return true;
							}
						}
						return false;
					},
					direct: true,
					async content(event, trigger, player) {
						if (trigger.delay == false) game.delay();

						var cards = [],
							cards2 = trigger.cards.slice(0),
							evt = trigger.getl(player);
						var num = player.getExpansions("xuyingmrfz").length;
						for (var i = 0; i < cards2.length; i++) {
							//@ts-ignore
							if (cards2[i].original != "j" && get.suit(cards2[i], trigger.player) == "spade" && get.position(cards2[i], true) == "d") {
								//@ts-ignore
								cards.push(cards2[i]);
							}
						}

						let result;

						if (cards.length && num + cards.length <= 3) {
							result = await player
								.chooseButton(["虚影：选择置于武将牌上的牌", cards], [1, cards.length])
								.set("ai", function (button) {
									return get.value(button.link, _status.event.player, "raw");
								})
								.forResult();
						} else if (cards.length) {
							result = await player
								.chooseButton(["虚影：选择置于武将牌上的牌", cards], [1, 3 - num])
								.set("ai", function (button) {
									return get.value(button.link, _status.event.player, "raw");
								})
								.forResult();
						}

						if (result && result.bool && result.links && result.links.length) {
							//@ts-ignore
							player.logSkill("xuyingmrfz");
							player.addToExpansion(result.links, player, "giveAuto").gaintag.add("xuyingmrfz");
						}
					},
				},
				judge: {
					audio: 2,
					trigger: { global: "cardsDiscardAfter" },
					direct: true,
					filter: function (event, player) {
						//@ts-ignore
						var evt = event.getParent().relatedEvent;
						if (!evt || evt.name != "judge") return;
						if (player.getExpansions("xuyingmrfz").length >= 3) return false;
						if (get.position(event.cards[0], true) != "d") return false;
						return get.suit(event.cards[0]) == "spade";
					},
					async content(event, trigger, player) {
						var card = trigger.cards.length;
						var num = player.getExpansions("xuyingmrfz").length;

						let result;
						if (card + num <= 3)
							result = await player
								.chooseButton(["虚影：选择置于武将牌上的牌", trigger.cards], [1, card])
								.set("ai", function (button) {
									return get.value(button.link, _status.event.player, "raw");
								})
								.forResult();
						else
							result = await player
								.chooseButton(["虚影：选择置于武将牌上的牌", trigger.cards], [1, 3 - num])
								.set("ai", function (button) {
									return get.value(button.link, _status.event.player, "raw");
								})
								.forResult();

						if (result && result.links && result.bool && result.links.length) {
							//@ts-ignore
							player.logSkill("xuyingmrfz");
							player.addToExpansion(result.links, player, "giveAuto").gaintag.add("xuyingmrfz");
						}
					},
				},
				buff: {
					trigger: { global: "useCardToTargeted" },
					forced: true,
					charlotte: true,
					popup: false,
					lastDo: true,
					filter: function (event, player) {
						return (
							event.parent && event.parent.xuyingmrfz_buff == player && event.targets.length == event.parent.triggeredTargets4.length
						);
					},
					async content(event, trigger, player) {
						if (!trigger.parent) return;
						trigger.parent.targets = trigger.parent.targets.concat(trigger.targets);
						trigger.parent.triggeredTargets4 = trigger.parent.triggeredTargets4.concat(trigger.targets);
						player.removeSkill("xuyingmrfz_buff");
					},
					onremove: true,
				},
			},
		},
		xuegemrfz: {
			audio: 2,
			trigger: { player: "damageEnd" },
			filter: function (event, player) {
				return game.hasPlayer(function (target) {
					return target != player && player.inRange(target);
				});
			},
			check: function (event, player) {
				return game.hasPlayer(function (target) {
					return target != player && get.attitude(player, target) < 2 && player.inRange(target);
				});
			},
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget("请选择【血歌】的目标", "对一名你的攻击范围内其他角色造成一点伤害", true, function (card, player, target) {
						return target != player && player.inRange(target);
					})
					.set("ai", target => -get.attitude(player, target))
					.forResult();

				if (result.targets) {
					player.line(result.targets);
					result.targets[0].damage();
					if (result.targets[0].hp > player.hp || player.getExpansions("xuyingmrfz").length >= 3) event.finish();
				}

				if (player.countCards("he") && player.getExpansions("xuyingmrfz").length >= 3) return;

				const { cards } = await player
					.chooseCard("你可以将一张牌置于武将牌上作为“虚影”", "he")
					.set("ai", card => 6 - get.value(card))
					.forResult();
				if (cards && cards.length) {
					player.addToExpansion(cards, player, "giveAuto").gaintag.add("xuyingmrfz");
				}
			},
		},
		huanxiangmrfz: {
			audio: 2,
			trigger: { player: "useCardAfter" },
			filter: function (event, player) {
				return event.card && (event.card.name == "shan" || event.card.name == "wuxie");
			},
			frequent: true,
			async content(event, trigger, player) {
				player.draw();
			},
		},
		//莫斯提马
		huanshimrfz: {
			audio: 2,
			direct: true,
			trigger: { player: "phaseEnd" },
			getNum: function () {
				var num = 0;
				//@ts-ignore
				game.getGlobalHistory("cardMove", function (evt) {
					if (evt.name == "lose" && evt.type == "discard") num += evt.cards2.length;
				});
				return num;
			},
			filter: function (event, player) {
				return (
					lib.skill.huanshimrfz.getNum() > 0 &&
					game.hasPlayer(function (target) {
						return target != player && !player.hasSkill("huanshimrfz_buff1");
					})
				);
			},
			async content(event, trigger, player) {
				var num = lib.skill.huanshimrfz.getNum();
				("step 0");
				const result = await player
					.chooseTarget(
						get.prompt("huanshimrfz"),
						"你可以选择至多" +
							get.cnNumber(num) +
							"名角色令其下个回合内：①其使用的第一张【杀】指定目标时，取消之，然后其获得这张【杀】。",
						[1, num],
						function (card, player, target) {
							return target != player && !player.hasSkill("huanshimrfz_buff1");
						}
					)
					.set("ai", target => -get.attitude(player, target))
					.forResult();
				if (result.targets) {
					for (var i of result.targets) {
						i.addSkill(["huanshimrfz_buff1", "huanshimrfz_buff2"]);
						player.line(i);
					}
					//@ts-ignore
					player.logSkill("huanshimrfz");
				}
			},
			subSkill: {
				tmp: {
					silent: true,
					charlotte: true,
				},
				buff1: {
					direct: true,
					charlotte: true,
					trigger: { player: "useCardToPlayered" },
					filter: function (event, player) {
						if (player.hasSkill("huanshimrfz_tmp")) return false;
						return event.card.name == "sha";
					},
					async content(event, trigger, player) {
						var cards = [];
						for (var i = 0; i < trigger.cards.length; i++) {
							if (get.position(trigger.cards[i], true) == "o") {
								cards.push(trigger.cards[i]);
							}
						}
						player.gain(cards, "gain2");
						//@ts-ignore
						trigger.getParent().excluded.addArray(trigger.targets);
						player.addTempSkill("huanshimrfz_tmp", "phaseEnd");
					},
				},
				buff2: {
					onremove: true,
					mark: true,
					marktext: "缓",
					intro: {
						name: "主观缓时",
						content: "行动受到限制",
					},
					direct: true,
					charlotte: true,
					silent: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return player.hasSkill("huanshimrfz_buff1") || player.hasSkill("huanshimrfz_buff2");
					},
					async content(event, trigger, player) {
						player.removeSkill("huanshimrfz_buff1");
						player.removeSkill("huanshimrfz_buff2");
					},
				},
			},
		},
		shishimrfz: {
			audio: 2,
			trigger: { player: "drawBegin" },
			filter: function (event, player) {
				return (
					//@ts-ignore
					(event.getParent("phaseDraw") && event.getParent("phaseDraw").player == player) ||
					//@ts-ignore
					(event.getParent("phaseUse") && event.getParent("phaseUse").player == player)
				);
			},
			async content(event, trigger, player) {
				trigger.num += player.countMark("shishimrfz") + 1;
				player.addMark("shishimrfz", 1);
			},
			group: "shishimrfz_discard",
			subSkill: {
				discard: {
					direct: true,
					trigger: { player: "phaseDiscardBefore" },
					filter: function (event, player) {
						return player.hasMark("shishimrfz");
					},
					async content(event, trigger, player) {
						var num = player.countMark("shishimrfz");
						player.chooseToDiscard(get.prompt("shishimrfz"), "弃置" + get.cnNumber(num) + "张牌", "he", true, num);
						player.removeMark("shishimrfz", num, false);
					},
				},
			},
		},
		jiemimrfz: {
			intro: {
				content: function (event, player) {
					var num = player.countMark("jiemimrfz") + 1;
					if (player != _status.currentPhase && player.countMark("jiemimrfz") % 2 == 1) return "弃置" + get.cnNumber(num) + "张牌";
					if (player != _status.currentPhase && player.countMark("jiemimrfz") % 2 != 1) return "摸" + get.cnNumber(num) + "张牌";
					if (player == _status.currentPhase && player.countMark("jiemimrfz") % 2 == 1) return "摸" + get.cnNumber(num) + "张牌";
					if (player == _status.currentPhase && player.countMark("jiemimrfz") % 2 != 1) return "弃置" + get.cnNumber(num) + "张牌";
				},
			},
			mark: true,
			charlotte: true,
			onremove: true,
			audio: 2,
			direct: true,
			trigger: { global: "phaseEnd" },
			filter: function (event, player) {
				return player.hasMark("jiemimrfz");
			},
			async content(event, trigger, player) {
				player.removeMark("jiemimrfz", player.countMark("jiemimrfz"));
			},
			group: ["jiemimrfz_cw", "jiemimrfz_zd"],
			subSkill: {
				cw: {
					forced: true,
					trigger: { target: "useCardToTargeted" },
					filter: function (event, player) {
						return player != _status.currentPhase;
					},
					async content(event, trigger, player) {
						await player.addMark("jiemimrfz");

						if (player.countMark("jiemimrfz") % 2 == 1) player.draw(player.countMark("jiemimrfz"));
						else
							player.chooseToDiscard(
								"弃置" + get.cnNumber(player.countMark("jiemimrfz")) + "张手牌",
								player.countMark("jiemimrfz"),
								true,
								"h"
							);
						//@ts-ignore
						player.logSkill("jiemimrfz");
					},
				},
				zd: {
					forced: true,
					trigger: { player: "useCardToTargeted" },
					filter: function (event, player) {
						if (player != _status.currentPhase) return false;
						return event.target != player && event.targets.length == 1;
					},
					async content(event, trigger, player) {
						await player.addMark("jiemimrfz");

						if (player.countMark("jiemimrfz") % 2 == 1)
							player.chooseToDiscard(
								"弃置" + get.cnNumber(player.countMark("jiemimrfz")) + "张手牌",
								player.countMark("jiemimrfz"),
								true,
								"h"
							);
						else player.draw(player.countMark("jiemimrfz"));
						//@ts-ignore
						player.logSkill("jiemimrfz");
					},
				},
			},
		},
		shihuangmrfz: {
			audio: 2,
			usable: 2,
			trigger: { player: "loseAfter" },
			filter: function (event, player) {
				if (event.type != "discard" || event.getlx === false) return false;
				if (event.name.indexOf("lose") != 0) return event.name != "phase" || game.phaseNumber == 0;
				var evt = event.getl(player);
				var num = 0;
				for (var i = 0; i < evt.cards2.length; i++) {
					num += evt.cards2[i].number;
				}
				return num > player.hp * 2 && !player.hasSkill("shihuangmrfz2");
			},
			async content(event, trigger, player) {
				var num = 0;
				for (var i = 0; i < trigger.cards.length; i++) {
					//@ts-ignore
					num += trigger.cards[i].number;
				}
				player.addSkill("shihuangmrfz2");
				player.gain(trigger.cards, "gain2", "log");
			},
		},
		shihuangmrfz2: {
			direct: true,
			silent: true,
			charlotte: true,
			trigger: { global: "phaseEnd" },
			async content(event, trigger, player) {
				player.removeSkill("shihuangmrfz2");
			},
		},
		baokemrfz: {
			audio: 2,
			usable: 1,
			trigger: { source: "damageEnd" },
			filter: function (event, player) {
				//@ts-ignore
				if (event.getParent("phaseUse") && event.getParent("phaseUse").player != player) return false;
				if (event.player == player) return false;
				if (!event.player.isAlive()) return false;
				if (event.nature) return true;
				return event.player.getEquip(2);
			},
			async content(event, trigger, player) {
				trigger.player.damage();
			},
		},
		//菲亚梅塔
		nanjiaomrfz: {
			init: function (player) {
				player.storage.nanjiaomrfz = 0;
			},
			onremove: true,
			mark: true,
			intro: {
				content: function (event, player) {
					let target;
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isOut() || game.players[i] == player) continue;
						if (game.players[i].storage.nanjiaomrfz && game.players[i].storage.nanjiaomrfz != 0) {
							target = game.players[i];
							break;
						}
					}
					if (!target) return "这是一个占位符";
					return (
						"你的手牌上限" +
						(player.storage.nanjiaomrfz > 0 ? "+" : "") +
						Math.floor(player.storage.nanjiaomrfz / 2) +
						"</br>" +
						get.translation(target) +
						"的手牌上限" +
						(target.storage.nanjiaomrfz > 0 ? "+" : " ") +
						Math.floor(target.storage.nanjiaomrfz / 2)
					);
				},
			},
			audio: 2,
			trigger: { global: "roundStart" },
			forced: true,
			async content(event, trigger, player) {
				//@ts-ignore
				game.countPlayer(function (current) {
					if (current.storage.nanjiaomrfz) {
						current.storage.nanjiaomrfz = 0;
						if (current != player) current.removeSkill("nanjiaomrfz_eff");
					}
				});
				//@ts-ignore
				if (!player.isMaxHandCardLimit(true)) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isOut() || game.players[i] == player) continue;
						//@ts-ignore
						if (game.players[i].isMaxHandCardLimit()) {
							player.storage.nanjiaomrfz = game.players[i].getHandcardLimit();
							game.players[i].storage.nanjiaomrfz = -(game.players[i].getHandcardLimit() - 1);
							game.players[i].addSkill("nanjiaomrfz_eff");
							break;
						}
					}
				} else {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isOut() || game.players[i] == player) continue;
						//@ts-ignore
						if (game.players[i].isMinHandCardLimit()) {
							game.players[i].storage.nanjiaomrfz = player.getHandcardLimit();
							player.storage.nanjiaomrfz = -(player.getHandcardLimit() - 1);
							game.players[i].addSkill("nanjiaomrfz_eff");
							break;
						}
					}
				}
			},
			group: ["nanjiaomrfz_eff"],
			subSkill: {
				eff: {
					charlotte: true,
					mod: {
						maxHandcard: function (player, num) {
							return num + Math.floor(player.storage.nanjiaomrfz / 2);
						},
					},
				},
			},
		},
		shunanmrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "phaseEnd" },
			filter: function (event, player) {
				return player.hp > 1 && !player.hasSkill("lvwaimrfz_ban");
			},
			async content(event, trigger, player) {
				player.loseHp();
			},
			group: ["shunanmrfz_damage"],
			subSkill: {
				damage: {
					trigger: {
						source: "damageBegin3",
						player: "phaseDrawBegin2",
					},
					direct: true,
					filter: function (event, player) {
						return player.countCards("h") >= player.hp;
					},
					async content(event, trigger, player) {
						if (player.getDamagedHp() <= player.maxHp / 2) trigger.num += 2;
						else trigger.num++;
						//@ts-ignore
						player.logSkill("shunanmrfza");
					},
				},
			},
			ai: {
				threaten: 1.2,
			},
		},
		shunanmrfza: {
			audio: 2,
		},
		lvwaimrfz: {
			audio: 2,
			enable: "phaseUse",
			unique: true,
			mark: true,
			limited: true,
			skillAnimation: true,
			animationStr: "律外",
			animationColor: "fire",
			init: function (player) {
				player.storage.lvwaimrfz = false;
			},
			filter: function (event, player) {
				return !player.storage.lvwaimrfz;
			},
			async content(event, trigger, player) {
				player.awakenSkill(event.name);
				player.addSkill(["lvwaimrfz_damage", "lvwaimrfz_ban", "lvwaimrfz_clear", "lvwaimrfz_sha"]);
				("step 1");
				player.chooseUseTarget({ name: "sha", isCard: true }, true, "nodistance");
				player.storage.lvwaimrfz = true;
			},
			subSkill: {
				damage: {
					direct: true,
					forced: true,
					trigger: { source: "damageEnd" },
					async content(event, trigger, player) {
						player.draw(trigger.num);
						player.recover(trigger.num);
						player.removeSkill("lvwaimrfz_damage");
					},
				},
				ban: {
					direct: true,
					forced: true,
					silent: true,
					trigger: { global: "phaseBegin" },
					async content(event, trigger, player) {
						player.removeSkill("lvwaimrfz_ban");
					},
				},
				clear: {
					direct: true,
					silent: true,
					trigger: { player: "shaAfter" },
					async content(event, trigger, player) {
						player.removeSkill("lvwaimrfz_clear");
						if (player.hasSkill("lvwaimrfz_damage")) player.removeSkill("lvwaimrfz_damage");
					},
				},
				sha: {
					direct: true,
					silent: true,
					charlotte: true,
					trigger: { player: "useCard" },
					filter: function (event, card) {
						return event.card.name == "sha";
					},
					async content(event, trigger, player) {
						//@ts-ignore
						trigger.directHit.addArray(game.players);
						player.removeSkill("lvwaimrfz_sha");
					},
				},
			},
		},
		//棘刺
		chaoshengmrfz: {
			intro: {
				content: function (event, player) {
					return player.countMark("chaoshengmrfz") + "/" + player.countMark("chaoshengmrfz2");
				},
			},
			mark: true,
			audio: 2,
			trigger: { player: "phaseEnd" },
			frequent: true,
			filter: function (event, player) {
				return player.countMark("chaoshengmrfz") >= player.countMark("chaoshengmrfz2");
			},
			async content(event, trigger, player) {
				player.removeMark("chaoshengmrfz", player.countMark("chaoshengmrfz"));
				if (player.countMark("jianshumrfz") < 15) {
					player.chooseDrawRecover(2, true, function (event, player) {
						if (player.hp == 1 && player.isDamaged()) return "recover_hp";
						return "draw_card";
					});
				} else {
					player.draw(2);
					player.recover();
				}
			},
			group: ["chaoshengmrfz_limite", "chaoshengmrfz_gain"],
			subSkill: {
				limite: {
					direct: true,
					charlotte: true,
					silent: true,
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					async content(event, trigger, player) {
						player.addMark("chaoshengmrfz2", 3, false);
						player.removeSkill("chaoshengmrfz_limite");
					},
				},
				gain: {
					direct: true,
					charlotte: true,
					silent: true,
					trigger: { player: "phaseEnd" },
					firstDo: true,
					async content(event, trigger, player) {
						if (!player.getStat("damage")) player.addMark("chaoshengmrfz");
						else player.removeMark("chaoshengmrfz", player.countMark("chaoshengmrfz"));
					},
				},
			},
		},
		jianshumrfz: {
			intro: {
				content: function (event, player) {
					var num = player.countMark("jianshumrfz");
					if (num == 15) return "【潮声】已修改</br>摸牌阶段摸牌数+1;攻击距离和【杀】的使用次数各+2";
					if (num < 15 && num > 9) return "已累计指定" + num + "次</br>摸牌阶段摸牌数+1;攻击距离和【杀】的使用次数各+2";
					if (num < 10 && num > 4) return "已累计指定" + num + "次</br>摸牌阶段摸牌数、攻击距离和【杀】的使用次数各+1";
					return "已累计指定" + num + "次";
				},
			},
			audio: 3,
			direct: true,
			trigger: { player: "useCardToTargeted" },
			filter: function (event, player) {
				return player.countMark("jianshumrfz") < 15;
			},
			async content(event, trigger, player) {
				await player.addMark("jianshumrfz");
				var num = player.countMark("jianshumrfz");
				if (num % 5 == 0) {
					//@ts-ignore
					player.logSkill("jianshumrfz");
					if (num == 5 || num == 15) player.removeMark("chaoshengmrfz2");
					if (num == 10) player.addSkill("jianshumrfz_usesha");
					if (num == 5 || num === 10) player.addMark("jianshumrfz_time");
					if (num == 5) player.addMark("jianshumrfz_draw");
					if (num == 5 || num === 10) player.addMark("jianshumrfz_range");
				}
			},
			group: ["jianshumrfz_time", "jianshumrfz_range", "jianshumrfz_draw"],
			subSkill: {
				time: {
					charlotte: true,
					onremove: true,
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + player.countMark("jianshumrfz_time");
						},
					},
				},
				range: {
					charlotte: true,
					onremove: true,
					mod: {
						attackRange: function (player, num) {
							return num + player.countMark("jianshumrfz_range");
						},
					},
				},
				draw: {
					silent: true,
					direct: true,
					charlotte: true,
					trigger: { player: "phaseDrawBegin2" },
					filter: function (event, player) {
						return player.hasMark("jianshumrfz_draw");
					},
					async content(event, trigger, player) {
						trigger.num++;
						//@ts-ignore
						player.logSkill("jianshumrfz");
					},
				},
				usesha: {
					direct: true,
					trigger: { player: "phaseUseBegin" },
					async content(event, trigger, player) {
						const result = await player
							.chooseTarget("选择一名其他角色视为对其使用一张【杀】", function (card, player, target) {
								return target != player && player.inRange(target);
							})
							.set("ai", target => -get.attitude(player, target))
							.forResult();

						if (result.targets) {
							var target = result.targets[0];
							player.useCard({ name: "sha" }, true, false, target);
							//@ts-ignore
							player.logSkill("jianshumrfz");
						}
					},
				},
			},
		},
		//夜莺
		qiulongmrfz: {
			intro: {
				name: "笼",
				content: "你获得了白恶魔的庇护",
			},
			audio: 2,
			direct: true,
			trigger: { global: "roundStart" },
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget("你可以选择一名角色，令其获得‘笼’标记", function (card, player, target) {
						return target != player;
					})
					.set("ai", target => get.attitude(player, target))
					.forResult();

				if (result.targets) {
					result.targets[0].addMark("qiulongmrfz");
					//@ts-ignore
					player.logSkill("qiulongmrfz");
				}
			},
			group: ["qiulongmrfz_damage", "qiulongmrfz_huan"],
			subSkill: {
				remove: {
					direct: true,
					charlotte: true,
					firstDo: true,
					silent: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.hasMark("qiulongmrfz");
					},
					async content(event, trigger, player) {
						player.removeMark("qiulongmrfz");
					},
				},
				damage: {
					direct: true,
					charlotte: true,
					silent: true,
					trigger: { global: "damageEnd" },
					filter: function (event, player) {
						return event.player.hasMark("qiulongmrfz");
					},
					async content(event, trigger, player) {
						var num = trigger.num;
						trigger.player.recover(num);
						player.damage(num, "nosource");
						player.addMark("qiulongmrfz_huan", num * 2);
						//@ts-ignore
						player.logSkill("qiulongmrfz");
					},
				},
				huan: {
					marktext: "幻影",
					intro: {
						name: "幻",
						content: "幻影",
					},
				},
			},
		},
		bihumrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "damageBegin3" },
			filter: function (event, player) {
				return event.nature;
			},
			async content(event, trigger, player) {
				trigger.cancel();
			},
			group: "bihumrfz_damage",
			subSkill: {
				damage: {
					forced: true,
					trigger: { player: "damageEnd" },
					filter: function (event, player) {
						return event.source != undefined;
					},
					async content(event, trigger, player) {
						player.addMark("qiulongmrfz_huan", trigger.num);
						//@ts-ignore
						player.logSkill("bihumrfz");
					},
				},
			},
			ai: {
				nofire: true,
				nothunder: true,
				effect: {
					target: function (card, player, target, current) {
						if (get.tag(card, "natureDamage")) return "zerotarget";
					},
				},
			},
		},
		shengyumrfz: {
			audio: 2,
			enable: "phaseUse",
			forced: true,
			mark: true,
			init: function (player) {
				player.storage.shengyumrfz = false;
			},
			derivation: ["polongmrfz"],
			filter: function (event, player) {
				return !player.storage.shengyumrfz;
			},
			intro: {
				content: function (event, player) {
					if (!player.storage.shengyumrfz) return "圣域已准备就绪";
					return "圣域充能中:" + player.countMark("shengyumrfz_cd") + "/4";
				},
			},
			filterTarget: true,
			selectTarget: [1, 3],
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				const { targets } = event;
				for (var i of targets) i.addSkill("polongmrfz");
				player.storage.shengyumrfz = true;
				player.recover(2);
			},
			group: "shengyumrfz_cd",
			ai: {
				order: 10,
				threaten: 2,
				expose: 0.8,
				result: {
					player: 10,
					target: 10,
				},
			},
			subSkill: {
				cd: {
					silent: true,
					charlotte: true,
					direct: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.storage.shengyumrfz == true;
					},
					async content(event, trigger, player) {
						await player.addMark("shengyumrfz_cd", false);

						if (player.countMark("shengyumrfz_cd") >= 4) {
							player.storage.shengyumrfz = false;
							player.removeMark("shengyumrfz_cd", player.countMark("shengyumrfz_cd"));
						}
					},
				},
			},
		},
		polongmrfz: {
			intro: {
				name: "破笼",
				content: function (event, player) {
					if (player.countMark("polongmrfz_round") >= 3)
						return "圣域持续时间:" + player.countMark("polongmrfz_round") + "/3</br><span class=firetext>最后一轮</span>";
					return "圣域持续时间:" + player.countMark("polongmrfz_round") + "/3";
				},
			},
			mark: true,
			audio: 2,
			enable: "phaseUse",
			usable: 5,
			filter: function (event, player) {
				if (player.getDamagedHp() == 0 && player.countMark("polongmrfz_mark1") >= 3) return false;
				return game.hasPlayer(function (current) {
					return current.countMark("qiulongmrfz_huan") > 0;
				});
			},
			async content(event, trigger, player) {
				var list = [];
				if (player.countMark("polongmrfz_mark1") < 3) list.add("摸牌");
				if (player.countMark("polongmrfz_mark2") < 2) list.add("回血");
				if (player.getDamagedHp() != 0) {
					const result = await player
						.chooseControl(list, "cancel2")
						.set("prompt", get.prompt("polongmrfz"))
						.set("prompt2", "回复一点体力或摸一张牌")
						.set("ai", () => {
							let player = get.player();
							if (player.hp == 1 && player.isDamaged()) return "回血";
							return "摸牌";
						})
						.forResult();
					if (result.control != "cancel2") {
						game.countPlayer(current => {
							current.removeMark("qiulongmrfz_huan");
							return true;
						});
						//@ts-ignore
						player.logSkill("polongmrfz");
						if (result.control == "摸牌") {
							player.draw();
							player.addMark("polongmrfz_mark1", 1);
						}
						if (result.control == "回血") {
							player.recover();
							player.addMark("polongmrfz_mark2", 1);
						}
					}
				} else {
					player.draw();
					//@ts-ignore
					player.logSkill("polongmrfz");
					player.addMark("polongmrfz_mark1", 1);
					//@ts-ignore
					game.countPlayer(function (current) {
						current.removeMark("qiulongmrfz_huan");
					});
				}
			},
			group: ["polongmrfz_damage", "polongmrfz_remove", "polongmrfz_round"],
			subSkill: {
				damage: {
					trigger: { player: "damageBegin3" },
					filter: function (event, player) {
						return game.hasPlayer(function (current) {
							return current.countMark("qiulongmrfz_huan") > 0;
						});
					},
					check: function (event, player) {
						return (
							game.hasPlayer(function (current) {
								return current.countMark("qiulongmrfz_huan") > 3;
							}) || player.hp <= 2
						);
					},
					async content(event, trigger, player) {
						trigger.num--;
						//@ts-ignore
						game.countPlayer(function (current) {
							current.removeMark("qiulongmrfz_huan");
						});
					},
				},
				remove: {
					direct: true,
					charlotte: true,
					silent: true,
					trigger: { player: "phaseUseEnd" },
					filter: function (event, player) {
						return player.hasMark("polongmrfz_mark1") || player.hasMark("polongmrfz_mark2");
					},
					async content(event, trigger, player) {
						player.removeMark("polongmrfz_mark1", player.countMark("polongmrfz_mark1"));
						player.removeMark("polongmrfz_mark2", player.countMark("polongmrfz_mark2"));
					},
				},
				round: {
					direct: true,
					charlotte: true,
					firstDo: true,
					silent: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						await player.addMark("polongmrfz_round", 1);
						if (player.countMark("polongmrfz_round") > 3) player.removeSkill("polongmrfz");
					},
				},
				mark1: {},
				mark2: {},
			},
			ai: {
				order: 12,
				threaten: 2,
				result: {
					player: 10,
				},
			},
		},
		//赫拉格
		yingkuimrfz: {
			mod: {
				cardname: function (card, player) {
					if (card.name == "tao") return "sha";
				},
				maxHandcard: function (player, num) {
					return (num += 2);
				},
			},
			audio: 2,
			forced: true,
			firstDo: true,
			trigger: { player: "useCard" },
			filter: function (event, player) {
				if (get.name(event.card) != "sha") return false;
				return event.card && event.card.cards && event.card.cards.length == 1 && event.card.cards[0].name == "tao";
			},
			async content(event, trigger, player) {
				//@ts-ignore
				trigger.directHit.addArray(
					game.filterPlayer(function (current) {
						return current != player;
					})
				);
			},
			ai: {
				directHit_ai: true,
				skillTagFilter(player, tag, arg) {
					var cards = arg.card.cards;
					if (get.name(arg.card) != "sha" || !cards || cards.length != 1) return false;
					if (cards[0].name != "tao") return false;
					return true;
				},
			},
		},
		yingkuimrfza: {
			audio: 2,
		},
		cangfengmrfz: {
			audio: 2,
			direct: true,
			trigger: { source: "damageEnd" },
			intro: {
				content: "#/2",
			},
			onremove: true,
			async content(event, trigger, player) {
				let result;

				var mark = player.countMark("cangfengmrfz");

				await player.addMark("cangfengmrfz", trigger.num, false);

				if (mark / 2 >= 1 && player.getDamagedHp() > 0) {
					result = await player.chooseControl("摸牌", "回血").set("prompt", "摸一张牌或回一点血").forResult();
				} else if (mark / 2 < 1) return;
				if (result && result.control == "回血") player.recover();
				else player.draw();
				//@ts-ignore
				player.logSkill("cangfengmrfz");
				await player.removeMark("cangfengmrfz", 2);
				//@ts-ignore
				if (mark / 2 >= 1) await lib.skill.cangfengmrfz.content(event, trigger, player);
			},
		},
		yuexiangmrfz: {
			intro: {
				content: function (event, player) {
					if (player.getDamagedHp() >= 3) {
						return "<span class=firetext>满月</span> <span class=thundertext>弦月 新月</span></br>·你使用【杀】的次数+X（X=本阶段你使用杀的次数/2+1，向下取整）；出牌阶段限一次，你第一次使用【杀】造成的伤害+1</br>·出牌阶段使用的第一张【杀】结算两次</br>·出牌阶段你使用的第一张【杀】目标+1；攻击距离+2";
					}
					if (player.getDamagedHp() == 2) {
						return "满月 <span class=firetext>弦月</span> <span class=thundertext>新月</span></br>·你使用【杀】的次数+X（X=本阶段你使用杀的次数/2+1，向下取整）；出牌阶段限一次，你第一次使用【杀】造成的伤害+1</br>·出牌阶段使用的第一张【杀】结算两次";
					}
					if (player.getDamagedHp() == 1) {
						return "满月 弦月 <span class=firetext>新月</span></br>·你使用【杀】的次数+X（X=本阶段你使用杀的次数/2+1，向下取整）；出牌阶段限一次，你第一次使用【杀】造成的伤害+1";
					}
					return "满月 弦月 新月";
				},
			},
			audio: 3,
			trigger: { player: ["phaseBefore", "changeHp"] },
			direct: true,
			popup: false,
			mark: true,
			init: function (player) {
				if (game.online) return;
				player.removeAdditionalSkill("yuexiangmrfz");
				var list = [];
				if (player.getDamagedHp() >= 3) {
					list.push("yuexiangmrfz_man");
				}
				if (player.getDamagedHp() >= 2) {
					list.push("yuexiangmrfz_xian");
				}
				if (player.getDamagedHp() >= 1) {
					list.push("yuexiangmrfz_xin");
				}
				if (list.length) {
					player.addAdditionalSkill("yuexiangmrfz", list);
				}
			},
			async content(event, trigger, player) {
				player.removeAdditionalSkill("yuexiangmrfz");
				var list = [];
				if (player.getDamagedHp() >= 3) {
					list.push("yuexiangmrfz_man");
				}
				if (player.getDamagedHp() >= 2) {
					list.push("yuexiangmrfz_xian");
				}
				if (player.getDamagedHp() >= 1) {
					//@ts-ignore
					if (trigger.num != undefined && trigger.num < 0 && player.getDamagedHp() - trigger.num > 1) player.logSkill("yingkuimrfza");
					list.push("yuexiangmrfz_xin");
				}
				if (list.length) {
					player.addAdditionalSkill("yuexiangmrfz", list);
				}
			},
			ai: {
				maixie: true,
				effect: {
					target: function (card, player, target) {
						if (get.tag(card, "damage")) {
							if (!target.hasFriend()) return;
							if (target.hp >= 4) return [0, 1];
						}
						if (get.tag(card, "recover") && player.hp >= player.maxHp - 2) return [0, 0];
					},
				},
			},
			group: "yuexiangmrfz_clear",
			subSkill: {
				clear: {
					silent: true,
					direct: true,
					charlotte: true,
					trigger: { player: "phaseUseEnd" },
					async content(event, trigger, player) {
						player.storage.yuexiangmrfz_man = false;
						if (player.hasMark("yuexiangmrfz_xin")) {
							player.removeMark("yuexiangmrfz_xin", player.countMark("yuexiangmrfz_xin"));
							player.unmarkSkill("yuexiangmrfz_xin");
						}
					},
				},
				man: {
					direct: true,
					charlotte: true,
					firstDo: true,
					trigger: { player: "shaAfter" },
					filter: function (event, player) {
						return !player.storage.yuexiangmrfz_man;
					},
					async content(event, trigger, player) {
						player.storage.yuexiangmrfz_man = true;
					},
					mod: {
						selectTarget: function (card, player, range) {
							if (card.name == "sha" && range[1] != -1 && !player.storage.yuexiangmrfz_man) range[1]++;
						},
						attackRange: function (player, num) {
							return (num += 2);
						},
					},
				},
				xian: {
					trigger: { player: "useCardToTargeted" },
					charlotte: true,
					forced: true,
					popup: false,
					lastDo: true,
					usable: 1,
					filter: function (event, player) {
						return event.card.name == "sha" && event.parent && event.targets.length == event.parent.triggeredTargets4.length;
					},
					async content(event, trigger, player) {
						if (!trigger.parent) return;
						trigger.parent.targets = trigger.parent.targets.concat(trigger.targets);
						trigger.parent.triggeredTargets4 = trigger.parent.triggeredTargets4.concat(trigger.targets);
						//@ts-ignore
						player.logSkill("yuexiangmrfz");
					},
				},
				xin: {
					group: "yuexiangmrfz_xin2",
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return (num += Math.floor(player.countMark("yuexiangmrfz_xin") / 2) + 1);
						},
					},
					intro: {
						content: function (event, player) {
							return "本回合使用【杀】的次数+" + (Math.floor(player.countMark("yuexiangmrfz_xin") / 2) + 1);
						},
					},
					direct: true,
					trigger: { player: "shaAfter" },
					async content(event, trigger, player) {
						player.addMark("yuexiangmrfz_xin");
						//@ts-ignore
						if (player.countMark("yuexiangmrfz_xin") % 2 == 0) player.logSkill("yuexiangmrfz");
					},
				},
				xin2: {
					direct: true,
					trigger: { source: "damageBegin3" },
					usable: 1,
					filter: function (event) {
						return event.card && event.card.name == "sha";
					},
					async content(event, trigger, player) {
						trigger.num++;
					},
				},
			},
		},
		//温蒂
		danpaomrfz: {
			intro: {
				content: "【氮炮】剩余次数：#",
			},
			onremove: true,
			init: function (player) {
				player.addMark("danpaomrfz", 2);
			},
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filterTarget: function (card, player, target) {
				return target != player;
			},
			selectTarget: 1,
			filter: function (event, player) {
				return player.countMark("danpaomrfz") > 0 && player.countCards("he") > 0;
			},
			async content(event, trigger, player) {
				const { target } = event;

				if (player.countCards("h") > 0) await player.chooseToDiscard("h", true, player.countCards("h"));
				else await player.chooseToDiscard("he", true, player.countCards("he"));
				target.damage();
				if (player.hasMark("shuipaomrfz")) {
					player.removeMark("shuipaomrfz");
					target.addSkill("danpaomrfz_plus");
				} else target.addSkill("danpaomrfz_nor");
				player.removeMark("danpaomrfz");
			},
			group: "danpaomrfz_damage",
			subSkill: {
				plus: {
					intro: {
						content: "计算与其他角色距离+4；每使用一张牌受到一点伤害",
					},
					mark: true,
					mod: {
						globalFrom: function (from, to, distance) {
							return distance + 4;
						},
					},
					silent: true,
					forced: true,
					firstDo: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.removeSkill("danpaomrfz_plus");
					},
				},
				nor: {
					intro: {
						content: "计算与其他角色距离+2；每使用两张牌受到一点伤害",
					},
					mark: true,
					mod: {
						globalFrom: function (from, to, distance) {
							return distance + 2;
						},
					},
					silent: true,
					forced: true,
					firstDo: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.removeSkill("danpaomrfz_nor");
					},
				},
				damage: {
					forced: true,
					trigger: { global: "useCard" },
					filter: function (event, player) {
						return event.player.hasSkill("danpaomrfz_nor") || event.player.hasSkill("danpaomrfz_plus");
					},
					async content(event, trigger, player) {
						var target = trigger.player;
						if (target.hasSkill("danpaomrfz_nor")) {
							await target.addMark("danpaomrfz_nor");
						} else {
							//@ts-ignore
							player.logSkill("danpaomrfz", target);
							await target.damage("player");
							return;
						}

						if (target.countMark("danpaomrfz_nor") >= 2) {
							//@ts-ignore
							player.logSkill("danpaomrfz", target);
							target.damage("player");
							target.removeMark("danpaomrfz_nor", 2);
						}
					},
				},
			},
			ai: {
				order: 1,
				result: {
					player: function (event, player) {
						var cardh = player.getCards("h"),
							carde = player.getCards("e");
						if (cardh.length == 0 && carde.length && carde.length < 2) return 1;
						if (cardh.length > 3) return -1;
						for (var i = 0; i < cardh.length; i++) {
							if (get.value(cardh[i]) > 8) return 0.5;
						}
					},
					target: function (player, target) {
						return get.damageEffect(target, player);
					},
				},
			},
		},
		shuipaomrfz: {
			marktext: "蓄水",
			intro: {
				name: "蓄水",
				content: "蓄水炮蓄水完毕</br>·【氮炮】中蓝色数字翻倍，红色数字-1</br>·【水炮①】中‘+1’改为‘+2’",
			},
			onremove: true,
			init: function (player) {
				player.storage.shuipaomrfz = true;
			},
			audio: 2,
			forced: true,
			trigger: { source: "damageBegin3" },
			filter: function (event, player) {
				return player.getEquip(1) && !player.hasMark("shuipaomrfz") && event.parent && event.parent.name != "danpaomrfz";
			},
			async content(event, trigger, player) {
				player.addMark("shuipaomrfz");
			},
			group: "shuipaomrfz_j",
			subSkill: {
				j: {
					intro: {
						content: function (event, player) {
							if (player.hasSkill("shuipaomrfz_j2")) return "计算与其他角色的距离+2";
							return "计算与其他角色的距离+1";
						},
					},
					forced: true,
					charlotte: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return !event.player.hasMark("shuipaomrfz_j") && event.player != player && event.parent && event.parent.name != "danpaomrfz";
					},
					async content(event, trigger, player) {
						if (player.hasMark("shuipaomrfz")) trigger.player.addSkill("shuipaomrfz_j2");
						else trigger.player.addSkill("shuipaomrfz_j3");
						trigger.player.addMark("shuipaomrfz_j");
					},
				},
				j2: {
					charlotte: true,
					forced: true,
					silent: true,
					firstDo: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.removeMark("shuipaomrfz_j");
						player.removeSkill("shuipaomrfz_j2");
					},
					mod: {
						globalFrom: function (from, to, distance) {
							return distance + 1;
						},
					},
				},
				j3: {
					charlotte: true,
					forced: true,
					silent: true,
					firstDo: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.removeMark("shuipaomrfz_j");
						player.removeSkill("shuipaomrfz_j3");
					},
					mod: {
						globalFrom: function (from, to, distance) {
							return distance + 2;
						},
					},
				},
			},
		},
		jiepimrfz: {
			mod: {
				canBeDiscarded: function (card) {
					if (get.position(card) == "e") return false;
				},
			},
			global: "jiepimrfz2",
		},
		jiepimrfz2: {
			mod: {
				canBeDiscarded: function (card) {
					if (
						get.position(card) == "e" &&
						_status.currentPhase &&
						_status.currentPhase.isAlive() &&
						_status.currentPhase.hasSkill("jiepimrfz")
					)
						return false;
				},
			},
		},
		//森蚺
		juezhanmrfz: {
			mod: {
				selectTarget: function (card, player, range) {
					if (lib.skill.juezhanmrfz.isJuezhan(card) && card.name != "jiedao") range[1] = 1;
				},
			},
			isJuezhan: function (card) {
				var info = lib.card[card.name];
				if (!info || (info.type != "trick" && info.type != "delay")) return false;
				if (info.notarget) return false;
				if (info.selectTarget != undefined) {
					if (Array.isArray(info.selectTarget)) {
						if (info.selectTarget[0] < 0) return !info.toself;
						return info.selectTarget[0] != 1 || info.selectTarget[1] != 1;
					} else {
						if (info.selectTarget < 0) return !info.toself;
						return info.selectTarget != 1;
					}
				}
				return false;
			},
			marktext: "单挑",
			intro: {
				name: "单挑",
				content: "和森蚺决一死战吧！",
			},
			audio: 2,
			forced: true,
			trigger: { target: "useCardToTargeted" },
			filter: function (event, player) {
				return event.card.name == "sha" && !event.player.hasMark("juezhanmrfz");
			},
			async content(event, trigger, player) {
				trigger.player.addMark("juezhanmrfz");
				trigger.player.addSkill("juezhanmrfz_ta");
			},
			group: "juezhanmrfz_pl",
			subSkill: {
				ta: {
					mod: {
						playerEnabled: function (card, player, target) {
							if (!target.hasSkill("juezhanmrfz") && target != player) {
								return false;
							}
						},
						inRangeOf: function (from, to) {
							if (from.hasSkill("juezhanmrfz")) return true;
						},
					},
					charlotte: true,
					forced: true,
					silent: true,
					trigger: {
						global: ["phaseEnd", "die"],
					},
					filter: function (event, player) {
						return event.player.hasSkill("juezhanmrfz");
					},
					async content(event, trigger, player) {
						player.removeMark("juezhanmrfz");
						player.removeSkill("juezhanmrfz_ta");
					},
				},
				pl: {
					mod: {
						playerEnabled: function (card, player, target) {
							if (
								!target.hasMark("juezhanmrfz") &&
								target != player &&
								game.hasPlayer(function (current) {
									return current.countMark("juezhanmrfz") > 0;
								})
							) {
								return false;
							}
						},
						inRangeOf: function (from, to) {
							if (from.hasMark("juezhanmrfz")) return true;
						},
					},
				},
			},
		},
		shanxiemrfz: {
			audio: 2,
			trigger: { global: "loseAfter" },
			filter: function (event, player) {
				if (player.countMark("shanxiemrfz") > player.countCards("h")) return false;
				if (event.type != "discard" || event.getlx === false) return false;
				var cards = event.cards.slice(0);
				var evt = event.getl(player);
				if (evt && evt.cards) cards.removeArray(evt.cards);
				for (var i = 0; i < cards.length; i++) {
					//@ts-ignore
					if (cards[i].original != "j" && get.type(cards[i], event.player) == "equip" && get.position(cards[i], true) == "d") {
						return true;
					}
				}
				return false;
			},
			direct: true,
			async content(event, trigger, player) {
				let result;

				while (true) {
					// step 0
					let skipStep1 = false;
					if (player.countCards("h") >= player.countMark("shanxiemrfz") && player.countMark("shanxiemrfz") > 0) {
						result = await player
							.chooseToDiscard(
								get.prompt("shanxiemrfz"),
								"你可以弃置" + get.cnNumber(player.countMark("shanxiemrfz")) + "张牌获得此装备牌",
								false,
								player.countMark("shanxiemrfz")
							)
							.set("ai", card => {
								return 6 - get.value(card);
							})
							.forResult();
					} else if (player.countMark("shanxiemrfz") === 0) {
						skipStep1 = true; // goto 2: 跳过 step 1 直接执行 step 2
					}

					// step 1 (可能被 goto(2) 跳过)
					if (!skipStep1) {
						if (trigger.delay === false) {
							await game.delay();
						}
						if (!result?.cards) {
							break; // event.finish()
						}
					}

					// step 2
					const equipCards = [];
					const cards2 = trigger.cards.slice(0);
					const evt = trigger.getl(player);
					if (evt?.cards) {
						cards2.removeArray(evt.cards);
					}

					for (const card of cards2) {
						//@ts-ignore
						if (card.original !== "j" && get.type(card, trigger.player) === "equip" && get.position(card, true) === "d") {
							equipCards.push(card);
						}
					}
					event.num = equipCards.length;

					if (equipCards.length > 0) {
						result = await player
							.chooseButton(["擅械：请选择获得一张牌", equipCards], 1)
							.set("ai", button => {
								return get.value(button.link, _status.event.player, "raw");
							})
							.forResult();
					}

					// step 3
					if (result?.bool) {
						event.num--;
						//@ts-ignore
						player.logSkill("shanxiemrfz");
						await player.gain(result.links, "gain2", "log");
						player.addMark("shanxiemrfz", 1);

						if (event.num > 0) {
							continue; // goto 0: 回到循环开头
						}
					}

					break; // 流程正常结束
				}
			},
			group: ["shanxiemrfz_sha", "shanxiemrfz_usesha", "shanxiemrfz_remove"],
			subSkill: {
				sha: {
					audio: "shanxiemrfz",
					enable: ["chooseToRespond", "chooseToUse"],
					filterCard: function (card, player) {
						return get.type(card) == "equip";
					},
					position: "hes",
					viewAs: { name: "sha" },
					prompt: "将一张装备牌当杀使用或打出",
					check: function (card) {
						var val = get.value(card);
						if (_status.event.name == "chooseToRespond") return 1 / Math.max(0.1, val);
						return 10 - val;
					},
					ai: {
						skillTagFilter: function (player, tag, arg) {
							if (!get.type(arg.card) == "equip") return false;
						},
						respondSha: true,
					},
				},
				usesha: {
					trigger: { source: "damageBegin3" },
					filter: function (event, player) {
						return (
							event.card &&
							event.card.name == "sha" &&
							event.player.hasMark("juezhanmrfz") &&
							get.type(event.cards[0], "equip") == "equip"
						);
					},
					forced: true,
					content: function () {
						trigger.num++;
						player.logSkill("shanxiemrfz");
					},
				},
				remove: {
					silent: true,
					charlotte: true,
					forced: true,
					trigger: { global: "roundStart" },
					content: function () {
						player.removeMark("shanxiemrfz", player.countMark("shanxiemrfz"));
					},
				},
			},
			ai: {
				threaten: 2,
			},
		},
		tieyimrfz: {
			audio: 2,
			enable: "phaseUse",
			mark: true,
			limited: true,
			selectCard: [0, 3],
			filterCard: true,
			position: "h",
			prompt: "弃置至多三张手牌，摸两倍于你弃置牌的牌",
			delay: 0,
			check: function (card) {
				return 6 - get.value(card) && get.name(card) != "sha" && get.type(card) != "equip";
			},
			init: function (player) {
				player.storage.tieyimrfz = false;
			},
			filter: function (event, player) {
				return !player.storage.tieyimrfz;
			},
			content: function () {
				"step 0";
				player.awakenSkill(event.name);
				player.node.avatar.setBackgroundImage("extension/WhichWay/image/skill/senrantieyumrfz.jpg");
				player.node.name.innerHTML = get.translation("senrantieyumrfz");
				player.draw(cards.length * 2);
				player.recover(2);
				player.turnOver();
				player.storage.tieyimrfz = true;
				("step 1");
				if (
					game.hasPlayer(current => {
						return current != player && !current.hasMark("juezhanmrfz");
					})
				)
					player.chooseTarget(true, function (card, player, target) {
						return target != player && !target.hasMark("juezhanmrfz");
					}).ai = function (target) {
						return -get.attitude(player, target);
					};
				else event.goto(3);
				("step 2");
				if (result.bool) {
					var target = result.targets[0];
					target.addSkill("juezhanmrfz_ta");
					target.addMark("juezhanmrfz");
				}
				("step 3");
				player.addTempSkill("tieyimrfz_use");
				player.addTempSkill("tieyimrfz_discard");
				player.addSkill("tieyimrfz_back");
			},
			intro: {
				content: "limited",
			},
			subSkill: {
				back: {
					charlotte: true,
					silent: true,
					trigger: { player: ["dying", "phaseEnd"] },
					content: function () {
						player.node.avatar.setBackgroundImage("extension/WhichWay/image/senranmrfz.jpg");
						player.node.name.innerHTML = get.translation("senranmrfz");
						player.removeSkill("tieyimrfz_back");
					},
				},
				discard: {
					forced: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return player.countCards("h") > 0;
					},
					content: function () {
						player.chooseToDiscard(true, player.countCards("h"));
					},
				},
				use: {
					charlotte: true,
					mod: {
						cardUsableTarget: function (card, player, target) {
							if (target.hasMark("juezhanmrfz")) return true;
						},
					},
				},
			},
			ai: {
				order: 13,
				threaten: 3,
				expose: 0.9,
				result: {
					target: function (player, target) {
						var hs1 = player.countCards("h", function (card) {
							return card.name == "sha";
						});
						var hs2 = player.countCards("he", function (card) {
							return get.type(card) == "equip";
						});
						if (hs1 + 2 * hs2 > 4) return -1;
						return 0;
					},
				},
			},
		},
		//ASH灰烬
		wusumrfz: {
			intro: {
				content: function (event, player) {
					if (player.countMark("wusumrfz") == 0) return "Ash已化身监控室大爷";
					return "FBI突击中</br>距离ASH白给还剩" + (5 - player.countMark("wusumrfz")) + "个阶段";
				},
			},
			mark: true,
			audio: 2,
			trigger: {
				player: ["phaseZhunbeiBefore", "phaseJudgeBefore", "phaseDrawBefore", "phaseDiscardBefore", "phaseJieshuBefore"],
			},
			forced: true,
			filter: function (event, player) {
				return event.getParent("phase");
			},
			content: function () {
				trigger.cancel();
				var next = trigger.player.phaseUse();
				event.next.remove(next);
				trigger.getParent("phase").next.push(next);
				player.addMark("wusumrfz");
			},
			group: "wusumrfz_draw",
			subSkill: {
				draw: {
					forced: true,
					trigger: { player: "phaseUseBegin" },
					content: function () {
						player.draw();
					},
				},
			},
			ai: {
				effect: {
					target: function (card, player, target, current) {
						if (get.type(card) == "delay") return "zeroplayertarget";
					},
				},
			},
		},
		wutoumrfz: {
			audio: 2,
			forced: true,
			usable: 1,
			trigger: { player: "damageBegin3" },
			filter: function (event, player) {
				return event.num === player.hp;
			},
			content: function () {
				trigger.cancel();
			},
		},
		baigeimrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "phaseUseEnd" },
			filter: function (event, player) {
				return player.countMark("wusumrfz") >= 5;
			},
			content: function () {
				if (player.countMark("wusumrfz") >= 5) {
					var num = player.countCards("h") - player.getHandcardLimit();
					var chattext = [
						"窗下怎么会有个夹子？",
						"为什么会有人放站位edd！",
						"（Ash听到的敌方干员的声音）call a pizza！",
						'（狼人手枪的枪声）女鬼:"talk"',
						"(剃刀花的声音)",
						"(两个蛊声，三条枪线)",
						"(发射祖母榴弹->rush->火山盾炸裂的声音)",
						"“友军已将你击杀”",
					].randomGet();
					if (num > 0) {
						player.logSkill("baigeimrfz");
						player.chooseToDiscard("h", num, true, "弃置" + get.cnNumber(num) + "张手牌");
					}
					player.removeMark("wusumrfz", 5);
					player.chat(chattext);
				}
			},
		},
		//异客
		shazumrfz: {
			marktext: "仇敌",
			intro: {
				name: "仇敌",
				content: "沙卒盯上你了",
			},
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			filterTarget: function (card, player, target) {
				return target.countCards("he") > 0 && target != player;
			},
			content: function () {
				"step 0";
				player.chooseCard("he", true);
				("step 1");
				event.cardp = result.cards[0];
				if (target.countCards("e") > 0) target.chooseCard("e", true);
				else target.chooseCard("h", true);
				("step 2");
				if (!result.bool) event.finish();
				else {
					event.cardt = result.cards[0];
				}
				("step 3");
				player.swapHandcards(target, [event.cardp], [event.cardt]);
				("step 4");
				var numt = target.countCards("h");
				var nump = player.countCards("h");
				if (numt == nump) event.finish();
				if (numt > nump) player.draw();
				else if (nump > numt) target.draw();
			},
			group: "shazumrfz_damage",
			subSkill: {
				damage: {
					audio: "shazumrfz",
					trigger: { player: "damageEnd" },
					filter: function (event, player) {
						return event.source != undefined && !event.source.hasMark("shazumrfz") && event.source != player;
					},
					logTarget: "source",
					content: function () {
						if (
							game.hasPlayer(function (current) {
								return current.hasMark("shazumrfz");
							})
						) {
							game.hasPlayer(function (current) {
								return current.removeMark("shazumrfz");
							});
							trigger.source.addMark("shazumrfz");
						} else trigger.source.addMark("shazumrfz");
					},
				},
			},
			ai: {
				threaten: 1.1,
				order: 8,
				result: {
					player: function (player, target) {
						if (get.attitude(player, target) > 0) return 1.5;
						return 0.5;
					},
					target: function (player, target) {
						if (get.attitude(player, target) < 2 && target.countCards("e") > 0 && target.countCards("h") > player.countCards("h"))
							return -1;
						return 0.5;
					},
				},
			},
		},
		dianlianmrfz: {
			audio: 2,
			trigger: { source: "damageSource" },
			filter: function (event, player) {
				if (event.num <= 1) return false;
				return (
					event.player != player &&
					event.player.isAlive() &&
					game.hasPlayer(function (current) {
						return current != event.player && get.distance(event.player, current) <= 1 && current != player;
					})
				);
			},
			check: function (event, player) {
				if (
					game.hasPlayer(function (current) {
						return current != player && get.attitude(player, current) < 0 && current != event.player;
					})
				)
					return true;
				return false;
			},
			content: function () {
				"step 0";
				player.chooseTarget(
					true,
					"选择一名与" + get.translation(trigger.player) + "距离为1的角色并对其造成" + (trigger.num - 1) + "点伤害",
					function (card, player, target) {
						var damaged = trigger.player;
						return get.distance(damaged, target) <= 1 && target != damaged && target != player;
					}
				).ai = function (target) {
					return -get.attitude(player, target);
				};
				("step 1");
				var num = trigger.num - 1;
				if (result.bool) {
					var target = result.targets[0];
					target.damage("player", trigger.num - 1);
				}
			},
			group: "dianlianmrfz_damage",
			subSkill: {
				damage: {
					audio: "dianlianmrfz",
					trigger: { source: "damageBegin3" },
					check: function (event, player) {
						return get.attitude(player, event.player) < 0;
					},
					filter: function (event, player) {
						return event.nature == "thunder" && !player.storage.dianlianmrfz;
					},
					prompt: "是否令此伤害+1",
					content: function () {
						trigger.num++;
						player.storage.dianlianmrfz = true;
						player.addSkill("dianlianmrfz_remove");
					},
				},
				remove: {
					charlotte: true,
					direct: true,
					silent: true,
					trigger: { global: "roundStart" },
					content: function () {
						player.storage.dianlianmrfz = false;
						player.removeSkill("dianlianmrfz_remove");
					},
				},
			},
		},
		leibaomrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			selectTarget: 1,
			filterTarget: function (card, player, target) {
				if (target == player) return false;
				return (
					!game.hasPlayer(function (current) {
						return current != player && current.hp > target.hp;
					}) || target.hasMark("shazumrfz")
				);
			},
			filter: function (event, player) {
				return (
					player.getCards("he", function (card) {
						return get.type(card) == "equip";
					}).length >= 2 || player.countCards("h", "shandian")
				);
			},
			content: function () {
				"step 0";
				player
					.chooseToDiscard("he", true, function (card, player) {
						if (
							player.getCards("he", function (card) {
								return get.type(card) == "equip";
							}).length >= 2
						)
							return get.type(card) == "equip" || card.name == "shandian";
						return card.name == "shandian";
					})
					.set("prompt", "请弃置一张【闪电】，或依次弃置两张装备牌。");
				("step 1");
				if (result.cards[0].name != "shandian") {
					player
						.chooseToDiscard("he", true, function (card, player) {
							return get.type(card) == "equip";
						})
						.set("prompt", "请弃置一张装备牌。");
					target.damage("player", 2);
				} else target.damage("player", 2, "thunder");
			},
			ai: {
				threaten: 1.2,
				order: 13,
				result: {
					target: -1,
				},
			},
		},
		//年
		zhujimrfz: {
			audio: 2,
			trigger: {
				player: ["phaseDrawAfter", "phaseJieshuAfter"],
			},
			direct: true,
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			content: function () {
				"step 0";
				player.chooseToDiscard("he", get.prompt("zhujimrfz"), "【铸极】:你可以重铸一张牌").set("ai", function (card) {
					return 6 - get.value(card);
				});
				("step 1");
				if (result.cards) player.draw();
				if (result.cards && get.type(result.cards[0]) == "equip") {
					player.draw();
					player.logSkill("zhujimrfz");
				} else if (result.cards) {
					player.logSkill("zhujimrfz");
				}
			},
		},
		tongyinmrfz: {
			audio: 2,
			trigger: { player: "damageEnd" },
			filter: function (event, player) {
				return event.source != undefined && event.source != player;
			},
			usable: 1,
			logTarget: "source",
			check: function (event, player) {
				return get.attitude(player, event.source) < 2;
			},
			content: function () {
				"step 0";
				if (!trigger.source.hasSkill("fengyin")) {
					trigger.source.addTempSkill("fengyin");
				}
				("step 1");
				trigger.source.chooseToDiscard(
					"he",
					true,
					"【铜印】:请选择弃置一张非基本或" + get.translation(Math.min(player.getDamagedHp() + 1, 1)) + "张基本牌"
				);
				if (player.getDamagedHp() < 2) event.finish();
				("step 2");
				if (result.cards && get.type(result.cards[0]) == "basic") {
					trigger.source
						.chooseToDiscard(
							true,
							"【铜印】:请选择弃置" + get.translation(player.getDamagedHp() - 1) + "张基本牌",
							[1, player.getDamagedHp() - 1],
							function (card) {
								return get.type(card) == "basic";
							}
						)
						.set("ai", function (card) {
							return 6 - get.value(card);
						});
				}
			},
			ai: {
				threaten: 0.5,
				expose: 0.4,
			},
		},
		tieyumrfz: {
			intro: {
				content: "使用【杀】的次数+#；可令大于一的伤害改为一#次",
			},
			audio: 2,
			trigger: { global: "useCard" },
			filter: function (event, player) {
				return player.countMark("tieyumrfz_clear2") < 2 && get.type(event.card) == "equip";
			},
			check: function (event, player) {
				return get.attitude(player, event.player) > 2;
			},
			content: function () {
				if (trigger.player.getDamagedHp() > 0) trigger.player.recover();
				else trigger.player.changeHujia();
				trigger.player.addSkill(["tieyumrfz_sha", "tieyumrfz_damage", "tieyumrfz_clear"]);
				trigger.player.addMark("tieyumrfz");
				player.addMark("tieyumrfz_clear2", false);
			},
			group: "tieyumrfz_clear2",
			subSkill: {
				sha: {
					charlotte: true,
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + player.countMark("tieyumrfz");
						},
					},
				},
				damage: {
					direct: true,
					trigger: { player: "damageBegin3" },
					filter: function (event, player) {
						return event.num > 1 && player.countMark("tieyumrfz_damage") < player.countMark("tieyumrfz");
					},
					content: function () {
						trigger.num = 1;
						player.logSkill("tieyumrfz");
						player.addMark("tieyumrfz_damage");
					},
				},
				clear: {
					silent: true,
					direct: true,
					charlotte: true,
					firstDo: true,
					trigger: { global: "roundStart" },
					content: function () {
						player.removeSkill("tieyumrfz_damage");
						player.removeSkill("tieyumrfz_sha");
						player.removeSkill("tieyumrfz_clear");
						player.removeMark("tieyumrfz", player.countMark("tieyumrfz"));
						player.removeMark("tieyumrfz_damage", player.countMark("tieyumrfz_damage"));
					},
				},
				clear2: {
					silent: true,
					direct: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.hasMark("tieyumrfz_clear2");
					},
					content: function () {
						player.removeMark("tieyumrfz_clear2", player.countMark("tieyumrfz_clear2"));
					},
				},
			},
			ai: {
				threaten: 1.2,
				expose: 0.8,
			},
		},
		//令
		shixingmrfz: {
			intro: {
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			mark: true,
			audio: 6,
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			check: function (event, player) {
				if (
					player.getExpansions("shixingmrfz").filter(function (magic) {
						return get.type2(magic) == "equip";
					}).length &&
					player.hasCard(function (card) {
						return get.type(card) == "equip";
					}).length
				)
					return true;
				if (player.countCards("h") < 3 && player.getExpansions("shixingmrfz").length) return false;
				return true;
			},
			content: function () {
				"step 0";
				//牌小于2且大于0则选择
				if (player.getExpansions("shixingmrfz").length <= 1 && player.getExpansions("shixingmrfz").length)
					player
						.chooseControl("弃置", "增加")
						.set("prompt", "选择弃置所有置于武将牌上的牌或往武将牌上放置牌")
						.set("ai", function (event, player) {
							var num = Math.random();
							if (
								player.getExpansions("shixingmrfz").filter(function (magic) {
									return get.type2(magic) == "equip";
								}).length &&
								player.countCards("h") < 4
							)
								return 1;
							if (num <= 0.6) return 0;
							return 1;
						});
				//牌为0则跳到第四步
				else if (player.getExpansions("shixingmrfz").length == 0) event.goto(4);
				("step 1");
				if (result.control == "弃置" || player.getExpansions("shixingmrfz").length > 1) {
					//弦惊判定
					event.num = 0;
					//清平弃置
					if (
						player.getExpansions("shixingmrfz").filter(function (magic) {
							return get.type2(magic) == "basic";
						}).length
					)
						player.gain(
							get.cardPile(function (card) {
								return get.type(card) == "basic";
							}),
							"gain2"
						);
					//弦惊选角色
					if (
						player.getExpansions("shixingmrfz").filter(function (magic) {
							return get.type2(magic) == "equip";
						}).length
					) {
						event.num++;
						player.chooseTarget("【诗型】:弃置一名其他角色的一张牌", false, function (card, target, player) {
							return target != player;
						}).ai = function (target) {
							return -get.attitude(_status.event.player, target);
						};
					}
					//逍遥弃置
					if (
						player.getExpansions("shixingmrfz").filter(function (magic) {
							return get.type2(magic) == "trick";
						}).length
					) {
						player.draw();
						player.recover();
					}
				}
				if (result.control == "增加") event.goto(4);
				("step 2");
				//弦惊弃置
				if (result.bool && event.num == 1) {
					player.discardPlayerCard(result.targets[0], "he", true);
				}
				("step 3");
				player.loseToDiscardpile(player.getExpansions("shixingmrfz"));
				("step 4");
				//放置牌到武将牌上
				if (
					!player.getExpansions("shixingmrfz").length ||
					player.hasCard(function (card) {
						return player.getExpansions("shixingmrfz").filter(function (magic) {
							return get.type2(magic) == get.type2(card);
						}).length;
					}, "he")
				)
					player.chooseCard("he", "依次将最多两张牌至于武将牌上", function (card, player) {
						if (player.getExpansions("shixingmrfz").length)
							return player.getExpansions("shixingmrfz").filter(function (magic) {
								return get.type2(magic) == get.type2(card);
							}).length;
						return true;
					});
				else event.finish();
				("step 5");
				if (result.cards && result.cards.length) {
					player.addToExpansion(result.cards, player, "giveAuto").gaintag.add("shixingmrfz");
				}
				if (result.cards && player.getExpansions("shixingmrfz").length < 1) event.goto(4);
			},
			group: ["shixingmrfz_basic", "shixingmrfz_trick", "shixingmrfz_equip"],
			subSkill: {
				//清平
				basic: {
					audio: "shixingmrfz",
					trigger: { player: "damageBegin" },
					filter: function (event, player) {
						return player.getExpansions("shixingmrfz").filter(function (magic) {
							return get.type2(magic) == "basic";
						}).length;
					},
					content: function () {
						var cards = player.getExpansions("shixingmrfz");
						("step 0");
						if (cards.length) player.chooseButton(["选择移去一张“清平”", cards], true);
						else event.finish();
						("step 1");
						if (result.bool) player.loseToDiscardpile(result.links);
						trigger.num--;
						player.popup("清平");
						game.log(player, "移去了一张‘清平’");
						("step 2");
						event.card = get.cardPile(function (card) {
							return get.type(card) == "basic";
						});
						if (
							player.getExpansions("shixingmrfz").filter(function (magic) {
								return get.type2(magic) == "basic";
							}).length < 1
						)
							player.gain(event.card, "gain2");
					},
				},
				//弦惊
				equip: {
					audio: "shixingmrfz",
					forced: true,
					trigger: { player: "phaseDrawBegin2" },
					filter: function (event, player) {
						return (
							player.getExpansions("shixingmrfz").filter(function (magic) {
								return get.type2(magic) == "equip";
							}).length > 1
						);
					},
					content: function () {
						trigger.num += 2;
						player.popup("弦惊");
					},
					mod: {
						maxHandcard: function (player, num) {
							if (
								player.getExpansions("shixingmrfz").filter(function (magic) {
									return get.type2(magic) == "equip";
								}).length
							)
								return num + 2;
						},
						cardUsable: function (card, player, num) {
							if (
								card.name == "sha" &&
								player.getExpansions("shixingmrfz").filter(function (magic) {
									return get.type2(magic) == "equip";
								}).length > 1
							)
								return num + 2;
						},
					},
				},
				//逍遥
				trick: {
					audio: "shixingmrfz",
					enable: "phaseUse",
					filter: function (event, player) {
						return (
							player.getExpansions("shixingmrfz").filter(function (magic) {
								return get.type2(magic) == "trick";
							}).length > 0 && event.filterCard({ name: "sha" }, player, event)
						);
					},
					chooseButton: {
						dialog: function (event, player) {
							return ui.create.dialog("逍遥", player.getExpansions("shixingmrfz"), "hidden");
						},
						backup: function (links, player) {
							return {
								filterCard: function () {
									return false;
								},
								selectCard: -1,
								filterTarget: function (card, player, target) {
									return target != player && player.inRange(target);
								},
								card: links[0],
								content: lib.skill.shixingmrfz_trick.contentx,
								ai: {
									order: 8,
									respondSha: true,
									result: {
										target: -1,
									},
								},
							};
						},
						prompt: function () {
							return "请选择【杀】的目标";
						},
					},
					contentx: function () {
						var card = lib.skill.shixingmrfz_trick_backup.card;
						("step 0");
						player.addTempSkill("shixingmrfz_damage", "shaEnd");
						player.addTempSkill("shixingmrfz_sha", "useCardAfter");
						("step 1");
						player.useCard({ name: "sha", isCard: true }, true, target);
						game.log(player, "视为对", target, "使用【杀】");
						player.logSkill("shixingmrfz");
						("step 2");
						if (!player.storage.shixingmrfz_damage) {
							player.loseToDiscardpile(card);
						} else {
							player.gain(card, "gain2");
							player.storage.shixingmrfz_damage = false;
						}
						("step 3");
						if (
							player.getExpansions("shixingmrfz").filter(function (magic) {
								return get.type2(magic) == "trick";
							}).length < 1
						) {
							player.recover();
							player.draw();
						}
					},
					ai: {
						respondSha: true,
						order: 4,
						skillTagFilter: function (player, tag, arg) {
							if (
								player.getExpansions("shixingmrfz").filter(function (magic) {
									return get.type2(magic) == "trick";
								}).length < 1
							)
								return false;
							if (arg != "use") return false;
						},
						result: {
							player: 1,
						},
					},
				},
				damage: {
					direct: true,
					trigger: { player: "shaMiss" },
					silent: true,
					charlotte: true,
					content: function () {
						player.storage.shixingmrfz_damage = true;
					},
				},
				sha: {
					direct: true,
					silent: true,
					trigger: { player: "useCard" },
					filter: function (event, player) {
						return event.card.name == "sha";
					},
					content: function () {
						if (trigger.addCount !== false) {
							trigger.addCount = false;
							player.getStat().card.sha--;
						}
					},
				},
			},
			ai: {
				threaten: function (player) {
					if (
						player.getExpansions("shixingmrfz").filter(function (magic) {
							return get.type2(magic) == "basic";
						}).length > 0
					)
						return 0.8;
					return 1.2;
				},
			},
		},
		zuimengmrfz: {
			audio: 2,
			enable: "phaseUse",
			unique: true,
			mark: true,
			limited: true,
			skillAnimation: true,
			animationStr: "醉梦",
			animationColor: "fire",
			init: function (player) {
				player.storage.zuimengmrfz = false;
			},
			filter: function (event, player) {
				return !player.storage.zuimengmrfz && player.countCards("h", "jiu") > 0;
			},
			content: function () {
				"step 0";
				player.awakenSkill(event.name);
				player.storage.zuimengmrfz = true;
				player.chooseToUse(
					true,
					function (card, player, event) {
						return get.name(card) == "jiu";
					},
					"使用一张【酒】"
				);
				event.num = 0;
				("step 1");
				if (event.num < game.countPlayer()) {
					event.num++;
					player
						.chooseTarget(
							true,
							"【醉梦" + event.num + "/" + game.countPlayer() + "】：选择一名角色，获得其区域内一张牌",
							function (card, player, target) {
								return target.countMark("zuimengmrfz_remove") < 2;
							}
						)
						.set("ai", function (target) {
							var player = _status.event.player;
							var att = get.attitude(player, target);
							if (att < 0) {
								att = -Math.sqrt(-att);
							} else {
								att = Math.sqrt(att);
							}
							return att * lib.card.shunshou.ai.result.target(player, target);
						});
				} else {
					if (player.countCards("h") < game.countPlayer()) player.drawTo(game.countPlayer());
					event.finish();
					event.getParent("phaseUse").skipped = true;
					player.addTempSkill("zuimengmrfz_skip");
				}
				("step 2");
				if (result.bool) {
					var target = result.targets[0];
					if (!target.hasSkill("zuimengmrfz_remove")) target.addTempSkill("zuimengmrfz_remove");
					player.gainPlayerCard("hej", target, true);
					target.addMark("zuimengmrfz_remove", false);
					event.goto(1);
				}
			},
			subSkill: {
				remove: {
					silent: true,
					direct: true,
					charlotte: true,
					trigger: { global: "phaseEnd" },
					content: function () {
						player.removeMark("zuimengmrfz_remove", player.countMark("zuimengmrfz_remove"));
					},
				},
				skip: {
					direct: true,
					charlotte: true,
					silent: true,
					trigger: { player: "phaseDiscardBefore" },
					content: function () {
						trigger.cancel();
					},
				},
			},
			ai: {
				order: 6,
				threaten: 0.6,
				expose: 0.6,
				result: {
					player: 1,
				},
			},
		},
		haojiumrfz: {
			audio: 2,
			trigger: { player: "useCard" },
			forced: true,
			filter: function (event, player) {
				return event.card.name == "jiu" && player.getDamagedHp() > 0;
			},
			content: function () {
				player.recover();
			},
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "jiu") return Infinity;
				},
			},
		},
		//风笛
		juntongmrfz: {
			audio: 4,
			forced: true,
			trigger: { global: "roundStart" },
			content: function () {
				player.draw(3);
			},
			mod: {
				maxHandcard: function (player, num) {
					return num - 1;
				},
			},
			group: ["juntongmrfz_ban", "juntongmrfz_sha"],
			subSkill: {
				ban: {
					charlotte: true,
					direct: true,
					trigger: {
						player: ["phaseJudgeBefore", "phaseDrawBefore"],
					},
					content: function () {
						trigger.cancel();
					},
				},
				sha: {
					audio: "juntongmrfz",
					trigger: { player: "useCard2" },
					filter: function (event, player) {
						return event.card.name == "sha";
					},
					content: function () {
						"step 0";
						player.judge(function (card) {
							var suit = get.suit(card);
							if (suit == "heart" || suit == "diamond" || suit == "spade") return -4;
							return 0;
						}).judge2 = function (result) {
							return result.bool == false ? true : false;
						};
						("step 1");
						if (result.suit == "diamond") {
							if (trigger.addCount !== false) {
								trigger.addCount = false;
								player.getStat().card.sha--;
							}
							event.finish();
						}
						if (result.suit == "heart") {
							if (
								game.hasPlayer(function (current) {
									return !trigger.targets.includes(current) && player.canUse(trigger.card, current);
								})
							)
								player
									.chooseTarget(
										get.prompt("juntongmrfz"),
										"为" + get.translation(trigger.card) + "增加一个目标",
										function (card, player, target) {
											return !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target);
										}
									)
									.set("sourcex", trigger.targets)
									.set("ai", function (target) {
										var player = _status.event.player;
										return get.effect(target, _status.event.card, player, player);
									})
									.set("card", trigger.card);
							else event.finish();
						}
						if (result.suit == "spade") {
							player.draw();
							event.finish();
						}
						if (result.suit == "club") event.finish();
						("step 2");
						if (result.targets) {
							trigger.targets.push(result.targets[0]);
							player.logSkill("juntongmrfz", result.targets[0]);
						}
					},
				},
			},
			ai: {
				effect: {
					target: function (card, player, target, current) {
						if (get.type(card) == "delay") return "zeroplayertarget";
					},
				},
			},
		},
		pochengmrfz: {
			audio: 2,
			trigger: { player: "useCardToTargeted" },
			onremove: true,
			check: function (event, player) {
				return get.attitude(player, event.target) < 0;
			},
			init: function (player) {
				player.storage.pochengmrfz = false;
			},
			filter: function (event, player) {
				return event.card.name == "sha" && game.roundNumber != 1 && !player.storage.pochengmrfz;
			},
			content: function () {
				"step 0";
				player.storage.pochengmrfz = true;
				event.num = 2;
				("step 1");
				event.num--;
				trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
				trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
				if (event.num > 0) event.goto(1);
				("step 2");
				event.getParent("phaseUse").skipped = true;
				player.addTempSkill("pochengmrfz_one");
			},
			group: "pochengmrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					direct: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.storage.pochengmrfz;
					},
					content: function () {
						player.addMark("pochengmrfz_clear", false);
						if (player.countMark("pochengmrfz_clear") >= 3) {
							player.storage.pochengmrfz = false;
							player.removeMark("pochengmrfz_clear", player.countMark("pochengmrfz_clear"));
						}
					},
				},
				one: {
					charlotte: true,
					mod: {
						maxHandcard: function (player, num) {
							return num + 1;
						},
					},
				},
			},
		},
		//琴柳
		junqimrfz: {
			audio: 4,
			group: ["junqimrfz_reget", "junqimrfz_get"],
			subSkill: {
				rem: {
					silent: true,
					charlotte: true,
					trigger: { global: "die" },
					filter: function (event, player) {
						return event.player.hasSkill("junqimrfz");
					},
					content: function () {
						var isSkillandRemove = function (str, who) {
							if (who.hasSkill(str)) who.removeSkill(str);
						};
						isSkillandRemove("junqimrfz_zhiyu", player);
						isSkillandRemove("junqimrfz_zhiyuan", player);
						isSkillandRemove("junqimrfz_jingong", player);
						isSkillandRemove("butuimrfz", player);
					},
				},
				zhiyu: {
					mark: true,
					marktext: "军旗",
					intro: {
						name: "军旗（治愈之旗）",
						content: "出牌阶段开始时，其可弃置至多三张牌，然后其选择等量角色，然后其回复一点体力并令其中手牌数最少的角色摸一张牌",
					},
					trigger: { player: "phaseUseBegin" },
					filter: function (event, player) {
						return player.countCards("h") > 0;
					},
					prompt: "是否发动【军旗(治愈之旗)】",
					content: function () {
						"step 0";
						player.chooseToDiscard("he", true, [1, 3], "请弃置至多三张牌").set("ai", function (card) {
							return 6 - get.value(card);
						});
						("step 1");
						if (result.cards)
							player
								.chooseTarget(true, [1, result.cards.length], "请选择至多" + result.cards.length + "名角色")
								.set("ai", function (target) {
									return get.attitude(_status.event.player, target);
								});
						("step 2");
						if (result.bool) {
							var min = player.countCards("h"),
								min_player = player;
							player.logSkill("junqimrfz");
							for (i = 0; i < result.targets.length; i++) result.targets[i].recover();
							for (var i of result.targets) {
								if (i == player) continue;
								var num = i.countCards("h");
								if (num < min) {
									min = num;
									min_player = i;
								} else if (num == min) min_player = false;
							}
							if (min_player) min_player.draw();
							else game.delayx();
						}
					},
					group: "junqimrfz_rem",
					ai: {
						expose: 0.6,
					},
				},
				jingong: {
					mark: true,
					marktext: "军旗",
					intro: {
						name: "军旗（进攻之旗）",
						content: "当与你距离不大于2的其他角色受到伤害时，你可以弃置一张牌，令此伤害+1；使用【杀】的次数+1",
					},
					trigger: { global: "damageBegin3" },
					filter: function (event, player) {
						return (
							get.distance(player, event.player) <= 2 && event.player.isIn() && event.player != player && player.countCards("he") > 0
						);
					},
					prompt: function (event, player) {
						return "【军旗(进攻之旗)】:是否弃置一张牌，令此伤害对" + get.translation(event.player) + "+1？";
					},
					check: function (event, player) {
						return get.attitude(player, event.player) < 0;
					},
					content: function () {
						player.chooseToDiscard("he", true, "弃置一张牌");
						trigger.num++;
						player.logSkill("junqimrfz", trigger.player);
					},
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + 1;
						},
					},
					group: "junqimrfz_rem",
					ai: {
						expose: 0.8,
					},
				},
				zhiyuan: {
					mark: true,
					marktext: "军旗",
					intro: {
						name: "军旗（支援之旗）",
						content: "与其距离不大于1的角色受到伤害后，其可摸一张牌，然后交给受伤角色一张牌；摸牌阶段摸牌数+1",
					},
					trigger: { global: "damageEnd" },
					filter: function (event, player) {
						return get.distance(player, event.player) <= 1 && event.player.isIn();
					},
					check: function (event, player) {
						return get.attitude(player, event.player) > 0;
					},
					prompt: function (event, player) {
						if (event.player == player) return "【军旗(支援之旗)】:你是否摸一张牌？";
						return "【军旗(支援之旗)】:是否摸一张牌并交给" + get.translation(event.player) + "一张牌？";
					},
					content: function () {
						"step 0";
						player.draw();
						player.logSkill("junqimrfz", trigger.player);
						if (trigger.player != player) {
							player.chooseCard(true, "he", "交给" + get.translation(trigger.player) + "一张牌").set("ai", function (card) {
								if (get.position(card) == "e") return -1;
								if (card.name == "shan" || card.name == "tao" || card.name == "jiu") return 1;
								return 0;
							});
						} else {
							event.finish();
						}
						("step 1");
						player.give(result.cards, trigger.player, "give");
					},
					group: ["junqimrfz_draw", "junqimrfz_rem"],
					ai: {
						expose: 0.4,
					},
				},
				draw: {
					audio: "junqimrfz",
					forced: true,
					trigger: { player: "phaseDrawBegin2" },
					content: function () {
						trigger.num++;
					},
				},
				get: {
					audio: "junqimrfz",
					forced: true,
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					content: function () {
						var str1 = "【支援之旗】:与其距离不大于1的角色受到伤害时，其可摸一张牌，然后交给受伤角色一张牌；摸牌阶段摸牌数+1";
						var str2 =
							"【治愈之旗】:出牌阶段开始时，其可弃置至多三张牌，然后其选择等量角色，然后其回复一点体力并令其中手牌数最少的角色摸至4张";
						var str3 = "【进攻之旗】:当与你距离不大于2的角色受到伤害后，你可以弃置一张牌，令此伤害+1；使用【杀】的次数+1";
						("step 0");
						player
							.chooseControl("支援之旗", "治愈之旗", "进攻之旗")
							.set("choiceList", [str1, str2, str3])
							.set("ai", function (event, player) {
								return [0, 2].randomGet();
							});
						("step 1");
						var list = ["junqimrfz_zhiyuan", "junqimrfz_zhiyu", "junqimrfz_jingong"];
						for (i = 0; i < 3; i++) {
							if (result.index == i) player.addSkill(list[i]);
						}
						player.removeSkill("junqimrfz_get");
					},
				},
				reget: {
					forced: true,
					trigger: { player: "phaseZhunbeiBegin" },
					content: function () {
						var list = ["junqimrfz_zhiyuan", "junqimrfz_zhiyu", "junqimrfz_jingong"];
						("step 0");
						player.logSkill("junqimrfz");
						if (
							game.hasPlayer(function (current) {
								return (
									current.hasSkill("junqimrfz_zhiyuan") ||
									current.hasSkill("junqimrfz_jingong") ||
									current.hasSkill("junqimrfz_zhiyu")
								);
							})
						) {
							game.countPlayer(function (current) {
								for (i = 0; i < 3; i++) {
									if (current.hasSkill(list[i]) && current != player) {
										current.removeSkill(list[i]);
										player.addSkill(list[i]);
									}
								}
							});
						}

						("step 1");
						player.chooseControl("确定", "cancel2").set("prompt", get.prompt("junqimrfz")).set("prompt2", "是否更换‘军旗’类型");
						("step 2");
						if (result.control == "cancel2") event.finish();
						else {
							for (i = 0; i < 3; i++) {
								if (player.hasSkill(list[i])) player.removeSkill(list[i]);
							}
						}
						("step 3");
						var str1 = "【支援之旗】:与其距离不大于1的角色受到伤害时，其可摸一张牌，然后交给受伤角色一张牌；摸牌阶段摸牌数+1";
						var str2 =
							"【治愈之旗】:出牌阶段开始时，其可弃置至多三张牌，然后其选择等量角色，然后其回复一点体力并令其中手牌数最少的角色摸至4张";
						var str3 = "【进攻之旗】:当与你距离不大于2的角色受到伤害后，你可以弃置一张牌，令此伤害+1；使用【杀】的次数+1";
						player
							.chooseControl("支援之旗", "治愈之旗", "进攻之旗")
							.set("choiceList", [str1, str2, str3])
							.set("ai", function (event, player) {
								var num = Math.random();
								if (player.hp <= 1) return 1;
								if (num > 0.6) return 2;
								if (num < 0.3) return 0;
								else return [0, 1, 2].randomGet();
							});
						("step 4");
						for (i = 0; i < 3; i++) {
							if (result.index == i) player.addSkill(list[i]);
						}
					},
				},
			},
		},
		zhiqimrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filterTarget: function (card, player, target) {
				return target != player;
			},
			selectTarget: 1,
			filter: function (event, player) {
				return player.hasSkill("junqimrfz_zhiyuan") || player.hasSkill("junqimrfz_jingong") || player.hasSkill("junqimrfz_zhiyu");
			},
			content: function () {
				var list = ["junqimrfz_zhiyuan", "junqimrfz_zhiyu", "junqimrfz_jingong"];
				for (i = 0; i < 3; i++) {
					if (player.hasSkill(list[i])) {
						target.addSkill(list[i]);
						player.removeSkill(list[i]);
					}
				}
			},
			group: "junqimrfz_rem",
			ai: {
				order: 1,
				expose: 0.8,
				threaten: 1.1,
				result: {
					target: function (player, target) {
						if (get.attitude(player, target) < 0) return 0;
						if (get.attitude(player, target) > 0) return 1;
					},
				},
			},
		},
		butuimrfz: {
			audio: 2,
			direct: true,
			trigger: { global: "phaseBegin" },
			filter: function (event, player) {
				return (
					event.player.hasSkill("junqimrfz_zhiyuan") ||
					event.player.hasSkill("junqimrfz_jingong") ||
					event.player.hasSkill("junqimrfz_zhiyu")
				);
			},
			content: function () {
				"step 0";
				var list = ["摸一张牌"];
				if (trigger.player.countCards("he") > 0) list.add("弃两张牌并跳过判定阶段");
				trigger.player
					.chooseControl(list, "cancel2")
					.set("prompt2", get.prompt("butuimrfz"))
					.set("prompt", "请选择一项")
					.set("ai", function () {
						var player = _status.event.playerx;
						if (player.countCards("j") > 0 && player.countCards("he") > 0) return 1;
						else return 0;
					})
					.set("playerx", trigger.player);
				("step 1");
				if (result.control != "cancel2") {
					if (result.control == "摸一张牌") {
						trigger.player.draw();
						trigger.player.logSkill("butuimrfz");
					} else if (trigger.player.countCards("he") > 0) {
						trigger.player.chooseToDiscard("he", true, "弃置两张牌", 2);
						trigger.player.addTempSkill("butuimrfz_skip", {
							global: "phaseEnd",
						});
						player.logSkill("butuimrfz", trigger.player);
					}
				}
			},
			subSkill: {
				skip: {
					charlotte: true,
					direct: true,
					trigger: { player: "phaseJudgeBefore" },
					content: function () {
						trigger.cancel();
					},
				},
			},
		},
		//老鲤
		linhuamrfz: {
			audio: 4,
			forced: true,
			trigger: { source: "damageBegin3" },
			filter: function (event, player) {
				return event.source != undefined;
			},
			content: function () {
				trigger.cancel();
				trigger.player.damage("nosource", trigger.num);
			},
			group: ["linhuamrfz_anti", "linhuamrfz_skip"],
			subSkill: {
				anti: {
					direct: true,
					trigger: { player: "damageBegin3" },
					filter: function (event, player) {
						if (!event.nature) return false;
						return player.countCards("he") >= 2 && event.source != undefined;
					},
					logTarget: "source",
					content: function () {
						"step 0";
						player.chooseToDiscard("he", false, 2, "你可以弃置两张牌将此伤害转移给" + get.translation(trigger.source));
						("step 1");
						if (result.cards) {
							trigger.cancel();
							trigger.source.damage(trigger.num, trigger.nature);
							player.logSkill("linhuamrfz", trigger.source);
						}
					},
				},
				skip: {
					direct: true,
					trigger: { player: "phaseJudgeBegin" },
					filter: function (event, player) {
						return player.countCards("h") >= 2 && player.countCards("j");
					},
					content: function () {
						"step 0";
						player.chooseToDiscard("h", false, 2, "你可以弃置两张牌并移动一张你判定区内的一张牌").set("ai", function (card) {
							return 6 - get.value(card);
						});
						("step 1");
						if (result.cards) {
							var card = player.getCards("j");
							player.chooseButton(["将你判定区的一张牌移动至一名角色的判定区", card]);
						} else event.finish();
						("step 2");
						if (result.cards) {
							event.card = result.links[0];
							player.chooseTarget(true, "选择" + get.translation(event.card) + "的移动目标", function (card, player, target) {
								return target != player && target.canAddJudge(event.card);
							});
						} else event.finish();
						("step 3");
						if (result.bool) {
							var target = result.targets[0];
							player.$give(event.card, target);
							game.delayx();
							player.logSkill("linhuamrfz");
							var name = card.viewAs || card.name;
							if (event.card.name != name) {
								target.addJudge(name, event.card);
							} else {
								target.addJudge(card);
							}
						}
					},
				},
			},
		},
		mingshimrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 2,
			filterTarget: function (card, player, target) {
				return target != player && !target.hasSkill("mingshimrfz2");
			},
			selectTarget: 1,
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			content: function () {
				"step 0";
				player.chooseCard("he", "请选择一张牌交给" + get.translation(target), true).set("ai", function (card) {
					return 6 - get.value(card);
				});
				player.addTempSkill("mingshimrfz2");
				("step 1");
				if (result.cards) {
					player.give(result.cards, target);
					target.addTempSkill("mingshimrfz2");
					player.line(target);
				}
				("step 2");
				player.viewHandcards(target);
				game.log(player, "观看了", target, "的手牌");
				if (target.countCards("h") > 3) {
					player.discardPlayerCard(target, "h", [1, 3]).set("forceAuto", true);
					target.addSkill("mingshimrfz_draw1");
					event.finish();
				} else {
					player
						.chooseControl("令其摸一张", "令其摸两张")
						.set("prompt", "【明事】:请选择一项")
						.set("prompt2", "你可以令其摸[2/1]张牌,然后于下一个准备阶段弃置[1/2]张牌")
						.set("ai", function () {
							var att = get.attitude(target, player);
							if (att > 0) return 1;
							return 0;
						}); //QQQ
				}
				("step 3");
				if (result.index == 0) {
					target.draw();
					target.addSkill("mingshimrfz_dis2");
				} else {
					target.draw(2);
					target.addSkill("mingshimrfz_dis1");
				}
			},
			group: "mingshimrfz_ed",
			subSkill: {
				ed: {
					charlotte: true,
					direct: true,
					trigger: { player: "phaseJieshuBegin" },
					filter: function (event, player) {
						return player.hasSkill("mingshimrfz2");
					},
					content: function () {
						player.draw();
					},
				},
				draw1: {
					direct: true,
					charlotte: true,
					trigger: { player: "phaseJieshuBegin" },
					content: function () {
						player.draw();
						player.removeSkill("mingshimrfz_draw1");
					},
				},
				dis1: {
					charlotte: true,
					direct: true,
					trigger: { player: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						return player.countCards("he") > 0;
					},
					content: function () {
						player.chooseToDiscard("he", true, "【明事】:弃置一张牌");
						player.removeSkill("mingshimrfz_dis1");
					},
				},
				dis2: {
					charlotte: true,
					direct: true,
					trigger: { player: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						return player.countCards("he") > 0;
					},
					content: function () {
						player.chooseToDiscard("he", true, 2, "【明事】:弃置两张牌");
						player.removeSkill("mingshimrfz_dis2");
					},
				},
			},
			ai: {
				order: 1,
				expose: 0.2,
				threaten: 1.2,
				result: {
					target: function (player, target) {
						var att = get.attitude(player, target);
						if (att > 0 && target.countCards("h") < 3) return 1;
						if (att < 0) return -1;
					},
				},
			},
		},
		mingshimrfz2: {},
		jixiongmrfz: {
			group: "jixiongmrfz2",
			audio: 2,
			forced: true,
			trigger: { global: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return event.player.hasMark("jixiongxmrfz");
			},
			content: function () {
				"step 0";
				trigger.player.judge(function (card) {
					var color = get.color(card);
					if (color == "black") return 4;
					return -4;
				});
				trigger.player.removeMark("jixiongxmrfz");
				("step 1");
				if (result.color == "black") {
					trigger.player.chooseToDiscard("he", true, "【吉凶】:请弃置一张牌");
					trigger.player.loseHp();
				}
				if (trigger.player.hasMark("jixiongxmrfz")) event.goto(0);
				else event.finish();
				("step 2");
				if (result.cards) player.gain(result.cards, "gain2");
				if (trigger.player.hasMark("jixiongxmrfz")) event.goto(0);
			},
			ai: {
				expose: 0.9,
			},
		},
		jixiongmrfz2: {
			trigger: { global: "gainEnd" },
			filter: function (event, player) {
				return event.source && event.source.hasSkill("jixiongmrfz");
			},
			logTarget: "source",
			direct: true,
			content: function () {
				"step 0";
				player
					.chooseControl("确定", "取消")
					.set("prompt", "是否发动【吉凶】？")
					.set("ai", function () {
						var att = get.attitude(trigger.source, player);
						if (att > 0) return 1;
						return 0;
					}); //QQQ
				("step 1");
				if (result.control == "确定") {
					trigger.player.addMark("jixiongxmrfz");
				}
			},
		},
		jixiongxmrfz: {
			charlotte: true,
			intro: {
				content: "准备阶段，你进行一次判定，若判定结果为黑色，则你须弃置一张牌并流失一点体力，然后弃置‘符纸’标记",
			},
		},
		//阿
		guaijiemrfz: {
			audio: 2,
			forced: true,
			firstDo: true,
			trigger: { global: "roundStart" },
			filter: function (event, player) {
				return !player.storage.guaijiemrfz;
			},
			content: function () {
				player.loseHp();
			},
			group: "guaijiemrfz_damage",
			subSkill: {
				damage: {
					audio: "guaijiemrfz",
					forced: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return !player.storage.guaijiemrfz;
					},
					content: function () {
						"step 0";
						player.storage.guaijiemrfz = true;
						player.addSkill("guaijiemrfz_remove");
						player
							.chooseTarget(true, "弃置一名角色区域内的一张牌", function (card, player, target) {
								return target.countCards("hej") > 0;
							})
							.set("ai", function (target) {
								var player = _status.event.player;
								var att = get.attitude(player, target);
								if (att < 0) {
									att = -Math.sqrt(-att);
								} else {
									att = Math.sqrt(att);
								}
								return att * lib.card.guohe.ai.result.target(player, target);
							});
						("step 1");
						if (result.bool) {
							var target = result.targets[0];
							player.discardPlayerCard(target, "hej", true);
						}
					},
				},
				remove: {
					silent: true,
					charlotte: true,
					direct: true,
					trigger: { global: "roundStart" },
					content: function () {
						player.storage.guaijiemrfz = false;
						player.removeSkill("guaijiemrfz_remove");
					},
				},
			},
		},
		qizhenmrfz: {
			audio: 2,
			enable: "phaseUse",
			filterTarget: function (card, player, target) {
				return target != player;
			},
			selectTarget: 1,
			usable: 1,
			content: function () {
				"step 0";
				if (target.countCards("he") == 0) {
					event.goto(2);
					target.damage();
				} else {
					var str1 = "令" + get.translation(target) + "弃置两张牌";
					var str2 = "对" + get.translation(target) + "造成一点伤害";
					player
						.chooseControl(str1, str2)
						.set("prompt", "【奇针】:请选择一项")
						.set("ai", function (target) {
							if (target.hp > 2 && target.countCards("he") < 4) return 1;
							return 0;
						});
				}
				("step 1");
				if (result.index == 0) target.chooseToDiscard("he", true, 2, "【奇针】:请弃置两张牌");
				else target.damage();
				("step 2");
				target.addTempSkill("qizhenmrfz_effect", {
					player: "phaseEnd",
				});
				target.changeHujia();
			},
			subSkill: {
				effect: {
					audio: "qizhenmrfz",
					trigger: { player: "useCard" },
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return event.card.name == "sha" || event.card.name == "juedou";
					},
					content: function () {
						trigger.baseDamage++;
					},
				},
			},
		},
		guaiyaomrfz: {
			audio: 4,
			forced: true,
			trigger: { source: "damageBegin3" },
			filter: function (event, player) {
				return event.player != player;
			},
			content: function () {
				var target = trigger.player;
				var num = Math.random();
				if (num < 0.1) {
					target.addTempSkill("guaiyaomrfz_skip", {
						player: "phaseEnd",
					});
					player.popup("怪药·跳过");
					game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·跳过】</span>");
				}
				if (num >= 0.1 && num < 0.325) {
					player.getDamagedHp() > 0 ? player.recover(2) : player.changeHujia();
					player.popup("怪药·回复");
					game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·回复】</span>");
				}
				if (num >= 0.325 && num < 0.55) {
					target.chooseToDiscard("he", true, "【怪药】:请弃置一张牌");
					player.popup("怪药·弃牌");
					game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·弃牌】</span>");
				}
				if (num >= 0.55 && num < 0.775) {
					target.addTempSkill("guaiyaomrfz_decrease", {
						player: "phaseDrawAfter",
					});
					player.popup("怪药·摸牌减少");
					game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·摸牌减少】</span>");
				}
				if (num >= 0.775) {
					player.draw();
					player.popup("怪药·摸牌");
					game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·摸牌】</span>");
				}
			},
			subSkill: {
				skip: {
					mark: true,
					intro: {
						content: "跳过下个出牌和弃牌阶段",
					},
					audio: "guaiyaomrfz",
					forced: true,
					charlotte: true,
					trigger: {
						player: ["phaseUseBegin", "phaseDiscardBefore"],
					},
					content: function () {
						trigger.cancel();
					},
				},
				decrease: {
					mark: true,
					intro: {
						content: "下个摸牌阶段摸牌数-1",
					},
					audio: "guaiyaomrfz",
					forced: true,
					charlotte: true,
					trigger: { player: "phaseDrawBegin2" },
					content: function () {
						trigger.num--;
					},
				},
			},
		},
		//黑
		heishimrfz: {
			audio: 2,
			forced: true,
			trigger: { source: "damageBegin3" },
			filter: function (event, player) {
				return (
					(get.distance(player, event.player) <= player.hasSkill("junumrfz_effect") ? 3 : 1 || event.player.getEquip(2)) &&
					event.card &&
					event.card.name == "sha"
				);
			}, //QQQ
			content: function () {
				if (get.distance(player, trigger.player) <= player.hasSkill("junumrfz_effect") ? 3 : 1) trigger.num++;
				if (trigger.player.getEquip(2)) trigger.num++;
			},
			group: "heishimrfz_wushi",
			mod: {
				playerEnabled: function (card, player, target) {
					if (!player.hasSkill("junumrfz_effect") && get.distance(player, target) > 2 && card.name == "sha") return false;
				},
			},
			subSkill: {
				wushi: {
					trigger: {
						player: "useCardToPlayered",
					},
					filter: function (event) {
						return event.card.name == "sha";
					},
					forced: true,
					logTarget: "target",
					content: function () {
						if (player.hasSkill("heishimrfz")) player.logSkill("heishimrfz");
						trigger.target.addTempSkill("heishimrfz_wushi2");
						trigger.target.storage.heishimrfz_wushi2.add(trigger.card);
						trigger.target.markSkill("heishimrfz_wushi2");
					},
					ai: {
						unequip_ai: true,
						skillTagFilter: function (player, tag, arg) {
							if (arg && arg.name == "sha") return true;
							return false;
						},
					},
				},
				wushi2: {
					firstDo: true,
					ai: { unequip2: true },
					init: function (player, skill) {
						if (!player.storage[skill]) player.storage[skill] = [];
					},
					onremove: true,
					trigger: {
						player: ["damage", "damageCancelled", "damageZero"],
						source: ["damage", "damageCancelled", "damageZero"],
						target: ["shaMiss", "useCardToExcluded", "useCardToEnd", "eventNeutralized"],
						global: ["useCardEnd"],
					},
					charlotte: true,
					filter: function (event, player) {
						return (
							player.storage.heishimrfz_wushi2 &&
							event.card &&
							player.storage.heishimrfz_wushi2.includes(event.card) &&
							(event.name != "damage" || event.notLink())
						);
					},
					silent: true,
					forced: true,
					popup: false,
					priority: 12,
					content: function () {
						player.storage.heishimrfz_wushi2.remove(trigger.card);
						if (!player.storage.heishimrfz_wushi2.length) player.removeSkill("heishimrfz_wushi2");
					},
					marktext: "※",
					intro: { content: "当前防具技能已失效" },
				},
			},
			ai: {
				threaten: 1.2,
			},
		},
		ruitongmrfz: {
			audio: 2,
			trigger: { global: "useCardAfter" },
			filter: function (event, player) {
				if (!player.hasSkill("junumrfz_effect") && get.distance(player, event.player) > 2 && player.hasSkill("heishimrfz")) return false;
				return (
					event.player &&
					event.player.isAlive() &&
					event.player != player &&
					get.subtype(event.card) == "equip2" &&
					player.inRange(event.player)
				);
			},
			prompt: function (event, player) {
				return "是否对" + get.translation(event.player) + "视为使用一张【杀】";
			},
			check: function (event, player) {
				return get.attitude(player, event.player) < 0;
			},
			content: function () {
				player.useCard({ name: "sha", isCard: true }, true, trigger.player);
			},
			ai: {
				expose: 0.9,
				threaten: 0.8,
			},
		},
		junumrfz: {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			unique: true,
			mark: true,
			limited: true,
			skillAnimation: true,
			animationStr: "巨弩",
			animationColor: "orange",
			check: function (event, player) {
				if (
					!game.hasPlayer(function (current) {
						return current != player && get.attitude(current, player) < 0;
					})
				)
					return false;
				return player.countCards("h", "sha") >= 2;
			},
			init: function (player) {
				player.storage.junumrfz = false;
			},
			filter: function (event, player) {
				return !player.storage.junumrfz;
			},
			content: function () {
				player.storage.junumrfz = true;
				player.addTempSkill("junumrfz_effect");
				player.awakenSkill(event.name);
			},
			subSkill: {
				effect: {
					mod: {
						targetInRange: function (card, player, target, now) {
							if (card.name == "sha") return true;
						},
						selectTarget: function (card, player, range) {
							if (card.name == "sha" && range[1] != -1) range[1]++;
						},
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + 1;
						},
					},
					charlotte: true,
				},
			},
			ai: {
				threaten: 1.1,
			},
		},
		//重岳
		wubenmrfz: {
			audio: 2,
			trigger: { player: "phaseUseBegin" },
			firstDo: true,
			direct: true,
			filter: function (event, player) {
				if (player.countCards("h") == 0) return false;
				return (
					!player.getEquip(1) &&
					game.hasPlayer(function (target) {
						return target != player && player.inRange(target);
					})
				);
			},
			content: function () {
				"step 0";
				player.chooseCard("h", "你可以使用一张【杀】").set("ai", function (card) {
					if (
						game.hasPlayer(function (current) {
							return current != player && player.inRange(current) && get.attitude(player, current) < 0;
						})
					)
						return 6 - get.value(card);
					return 0;
				});
				("step 1");
				if (result.cards) {
					player.chooseUseTarget({ name: "sha" }, result.cards, true, false);
					player.logSkill("wubenmrfz");
				}
			},
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha" && !player.getEquip(1)) return num + 1;
				},
				maxHandcard: function (player, num) {
					return (num += Math.floor((5 - player.countCards("e")) / 2));
				},
			},
		},
		wowumrfz: {
			intro: {
				content: function (event, player) {
					if (player.countMark("wowumrfz_time") >= 5)
						return "<span class=firetext>【气收秋毫平】</span></br>已使用" + player.countMark("wowumrfz") + "张牌";
					return (
						"<span class=firetext>【劲发江潮落】</span></br>已使用" +
						player.countMark("wowumrfz") +
						"张牌</br>已发动" +
						player.countMark("wowumrfz_time") +
						"次【我无】"
					);
				},
			},
			onremove: true,
			derivation: "wowumrfz_rewrite",
			audio: 4,
			trigger: { player: "useCardAfter" },
			direct: true,
			filter: function (event, player) {
				if ((player != _status.currentPhase || !player.isPhaseUsing()) && player.countMark("wowumrfz_time") < 5) return false;
				return true;
			},
			content: function () {
				"step 0";
				player.addMark("wowumrfz", false);
				("step 1");
				if (player.countMark("wowumrfz") >= 3 && !player.hasMark("shubianmrfz")) {
					player.chooseTarget(false, get.prompt("wowumrfz"), "你可以对一名其他角色使用一张【杀】", function (card, player, target) {
						return player.countMark("wowumrfz_time") >= 5 ? target != player : target != player && player.inRange(target);
					}).ai = function (target) {
						return -get.attitude(player, target);
					};
					player.removeMark("wowumrfz", 3, false);
					if (player.countMark("wowumrfz_time") < 5) player.addMark("wowumrfz_time", false);
				} else if (player.countMark("wowumrfz") >= 3) {
					if (player.countMark("wowumrfz_time") < 5) player.addMark("wowumrfz_time", false);
					player.removeMark("wowumrfz", 3, false);
				} else event.finish();
				("step 2");
				if (result.bool && result.targets) {
					player.useCard({ name: "sha", isCard: true }, true, false, result.targets);
					player.logSkill("wowumrfz", result.targets);
					if (player.countMark("wowumrfz_time") >= 5) player.draw();
				}
			},
			group: "wowumrfz_draw",
			subSkill: {
				draw: {
					direct: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						var evt = event.getParent(3);
						if (!event.card) return false;
						var sha = event.card.name == "sha";
						return player.countMark("wowumrfz_time") < 5 && evt && evt.name == "wowumrfz" && evt.player == player && sha;
					},
					content: function () {
						player.draw();
						player.logSkill("wowumrfz");
					},
				},
			},
			ai: {
				threaten: 1.3,
				expose: 0.2,
			},
		},
		shubianmrfz: {
			audio: 4,
			trigger: { player: "damageEnd" },
			filter: function (event, player) {
				return event.source != player && event.source.isAlive() && event.source != undefined;
			},
			check(event, player) {
				return get.attitude(player, event.source) < 0;
			},
			async content(event, trigger, player) {
				let source = trigger.source;
				source.addTempSkill("shubianmrfz_eff", { global: "phaseAfter" });
				source.markSkill("shubianmrfz_eff");
				if (source.countDiscardableCards(player, "e")) {
					player
						.discardPlayerCard("e", source)
						.set("target", source)
						.set("complexSelect", true)
						.set("ai", lib.card.guohe.ai.button)
						.set("prompt", `你可以弃置${get.translation(source)}装备区的一张牌`);
				}
			},
			subSkill: {
				eff: {
					charlotte: true,
					silent: true,
					mark: true,
					intro: {
						content: "·手牌上限+2<br>·无法使用手牌中的伤害类牌",
					},
					onremove(player) {
						player.unmarkSkill("shubianmrfz_eff");
					},
					mod: {
						maxHandcard: function (player, num) {
							return (num += 2);
						},
						cardEnabled2(card, player) {
							if (get.position(card) === "h" && get.tag(card, "damage")) {
								return false;
							}
						},
					},
				},
			},
			ai: {
				threaten: 0.8,
			},
		},
		//安洁莉娜
		fanzhongmrfz: {
			intro: {
				content: "重力紊乱",
			},
			audio: 4,
			global: ["fanzhongmrfz2", "fanzhongmrfz_gain", "fanzhongmrfz_gain2", "fanzhongmrfz_lose"],
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return game.hasPlayer(function (target) {
					return target != player && player.inRange(target) && target.countMark("fanzhongmrfz") < 3;
				});
			},
			direct: true,
			content: function () {
				"step 0";
				player.chooseTarget(
					get.prompt("fanzhongmrfz"),
					"你可以选择攻击范围内的一名其他角色，令其获得‘反重’标记",
					function (card, player, target) {
						return target != player && player.inRange(target) && target.countMark("fanzhongmrfz") < 3;
					}
				).ai = function (target) {
					return -get.attitude(player, target);
				};
				("step 1");
				if (result.bool && result.targets) {
					result.targets[0].addMark("fanzhongmrfz");
					player.logSkill("fanzhongmrfz", result.targets[0]);
				}
			},
			subSkill: {
				gain: {
					direct: true,
					trigger: { player: "useCardAfter" },
					filter: function (event, player) {
						return player.hasMark("fanzhongmrfz") && player.getExpansions("fanzhongmrfz2").length > 0;
					},
					content: function () {
						"step 0";
						var cards = player.getExpansions("fanzhongmrfz2");
						if (cards.length) player.chooseButton(["获得一张牌", cards], true);
						else event.finish();
						("step 1");
						if (result.bool) player.gain(result.links, "gain2");
					},
				},
				gain2: {
					direct: true,
					charlotte: true,
					firstDo: true,
					trigger: { player: "phaseDiscardBefore" },
					filter: function (event, player) {
						return player.hasMark("fanzhongmrfz");
					},
					content: function () {
						var cards = player.getExpansions("fanzhongmrfz2");
						if (cards) player.gain(cards, "gain2");
						player.removeAllmark("fanzhongmrfz");
					},
				},
				lose: {
					silent: true,
					direct: true,
					charlotte: true,
					trigger: { player: "die" },
					filter: function (event, player) {
						return player.hasMark("fanzhongmrfz");
					},
					content: function () {
						var cards = player.getExpansions("fanzhongmrfz2");
						player.removeAllmark("fanzhongmrfz");
						if (cards) player.loseToDiscardpile(cards);
					},
				},
			},
			ai: {
				expose: 0.6,
				threaten: 1.2,
			},
		},
		fanzhongmrfz2: {
			intro: {
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			charlotte: true,
			direct: true,
			trigger: { player: "gainEnd" },
			filter: function (event, player) {
				if (event.player.getExpansions("fanzhongmrfz2").length >= 6) return false;
				return (
					player.hasMark("fanzhongmrfz") && event.getParent().name != "fanzhongmrfz_gain" && event.getParent().name != "fanzhongmrfz_gain2"
				);
			},
			content: function () {
				player.addToExpansion(trigger.cards, player, "give").gaintag.add("fanzhongmrfz2");
				player.logSkill("fanzhongmrfz");
				//var str='';
				//str+=get.translation(trigger)+'</br>';
				//for(var i=1;i<=10;i++) str+=get.translation(trigger.getParent(i))+'</br>';
				//game.log(str);
				//player.popup(str);
			},
		},
		xinshimrfz: {
			mod: {
				ignoredHandcard: function (card, player) {
					if (card.hasGaintag("xinshimrfz")) {
						return true;
					}
				},
				cardDiscardable: function (card, player, name) {
					if (name == "phaseDiscard" && card.hasGaintag("xinshimrfz")) {
						return false;
					}
				},
			},
			audio: 4,
			enable: "phaseUse",
			discard: false,
			lose: false,
			filter: function (event, player) {
				return player.countCards("h") > 0;
			},
			filterTarget: function (card, player, target) {
				return target != player && !target.tempSkills.xinshimrfz2 && !target.hasMark("xinshimrfz");
			},
			filterCard: function (card, player) {
				return !player.storage.xinshimrfz || !player.storage.xinshimrfz.includes(get.type(card, "trick"));
			},
			check: function (card) {
				return 10 - get.value(card);
			},
			delay: 0,
			prompt: "你可以将一张本回合你未以此法交出过的类型的牌交给本回合你未以此法选择过的角色",
			content: function () {
				"step 0";
				if (!player.storage.xinshimrfz) player.storage.xinshimrfz = [];
				player.storage.xinshimrfz.push(get.type(cards[0], "trick"));
				("step 1");
				player.give(cards, target);
				target.addTempSkill("xinshimrfz2");
				("step 2");
				var mark = player.storage.xinshimrfz.length;
				if (mark == 1) {
					player.draw();
					event.finish();
				}
				if (mark == 2) event.goto(3);
				if (mark == 3) {
					event.goto(5);
				}
				("step 3");
				if (target.countCards("h") > 0) target.chooseCard("h", true);
				else event.finish();
				("step 4");
				if (result.cards) {
					target.give(result.cards, player);
					target.draw();
				}
				event.finish();
				("step 5");
				if (player.storage.xinshimrfz.length == 3) {
					player.chooseTarget(true, "【信使】:请选择一名其他角色，令其获得‘反重’标记", function (card, player, target) {
						return target != player && !target.hasMark("xinshimrfz");
					}).ai = function (target) {
						return -get.attitude(player, target);
					};
					player.logSkill("xinshimrfz");
				} else event.finish();
				("step 6");
				if (result.bool && result.targets) {
					result.targets[0].addMark("fanzhongmrfz");
				}
			},
			ai: {
				order: 9,
				expose: 0.2,
				threaten: 1.2,
				result: {
					target: function (player, target) {
						if (player.countCards("h") > 2) return 1;
					},
				},
			},
			group: ["xinshimrfz_clear", "xinshimrfz_give"],
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					direct: true,
					trigger: { player: "phaseEnd" },
					content: function () {
						player.storage.xinshimrfz = [];
						player.removeGaintag("xinshimrfz");
					},
				},
				give: {
					direct: true,
					trigger: { player: "gainEnd" },
					filter: function (event, player) {
						return event.source;
					},
					logTarget: "source",
					content: function () {
						"step 0";
						if (trigger.cards.length) player.addMark("xinshimrfz_give", trigger.cards.length, false);
						("step 1");
						if (player.countMark("xinshimrfz_give") >= 2) {
							player
								.chooseControl("basic", "trick", "equip", "cancel2")
								.set("prompt", "选择获得一种类型的牌")
								.set("ai", function () {
									var player = _status.event.player;
									if (
										player.hp <= 3 &&
										!player.countCards("h", {
											name: ["shan", "tao"],
										})
									)
										return "basic";
									if (
										player.countCards("he", {
											type: "equip",
										}) < 2
									)
										return "equip";
									return "trick";
								});
							player.removeMark("xinshimrfz_give", 2, false);
						} else event.finish();
						("step 2");
						if (result.control != "cancel2") {
							var card = get.cardPile2(function (card) {
								return get.type(card, "trick") == result.control;
							});
							if (card) player.gain(card, "gain2", "log").gaintag.add("xinshimrfz");
							player.logSkill("xinshimrfz");
						}
						if (player.countMark("xinshimrfz_give") >= 2) event.goto(1);
					},
				},
			},
		},
		xinshimrfz2: {},
		//号角
		dunpaomrfz: {
			derivation: "dunpaomrfz_rewrite",
			audio: 2,
			trigger: { player: "phaseBegin" },
			check: function (event, player) {
				return (
					(game.countPlayer() <= 4 &&
						game.hasPlayer(function (current) {
							return get.attitude(player, current) < 0 && get.distance(player, current) == 1;
						})) ||
					!game.hasPlayer(function (current) {
						return get.attitude(player, current) >= 0 && current != player;
					})
				);
			},
			filter: function (event, player) {
				return !player.storage.dunpaomrfz;
			},
			content: function () {
				player.storage.dunpaomrfz = true;
			},
			mod: {
				maxHandcard: function (player, num) {
					if (player.storage.dunpaomrfz) return num + 2;
				},
				playerEnabled: function (card, player, target) {
					if (!player.storage.dunpaomrfz && get.distance(player, target) <= 1 && target != player) return false;
				},
				attackRange: function (player, num) {
					if (!player.storage.dunpaomrfz) return num + 5;
				},
			},
			group: "dunpaomrfz_add",
			subSkill: {
				add: {
					audio: "biaohaomrfz",
					forced: true,
					trigger: { source: "damageBegin3" },
					filter: function (event, player) {
						if (player.storage.dunpaomrfz) return false;
						return event.card && event.card.name == "sha" && event.player != player && get.distance(player, event.player) > 1; //QQQ
					},
					content: function () {
						var target = trigger.player;
						("step 0");
						target.judge(function (card) {
							var color = get.color(card);
							if (color == "black") return -4;
							return 0;
						}).judge2 = function (result) {
							return result.bool == false ? true : false;
						};
						("step 1");
						if (result.color == "black") trigger.num++;
					},
				},
			},
		},
		biaohaomrfz: {
			audio: 6,
			chargeSkill: true,
			enable: "phaseUse",
			usable: 2,
			filter: function (event, player) {
				return (
					player.countMark("charge") < 4 &&
					player.hasCard(function (card) {
						return get.tag(card, "damage");
					})
				);
			},
			filterCard: function (card) {
				return get.tag(card, "damage");
			},
			position: "he",
			check: function (card) {
				if (card.name == "sha") return 1;
				if (card.name == "nanman" || card.name == "wanjian") return -1;
				return 10 - get.value(card);
			},
			content: function () {
				player.addMark("charge");
				player.draw();
			},
			group: ["biaohaomrfz_usesha", "biaohaomrfz_allin"],
			subSkill: {
				usesha: {
					audio: "biaohaomrfz",
					enable: "chooseToUse",
					viewAs: { name: "sha", isCard: true },
					filterCard: function () {
						return false;
					},
					viewAsFilter: function (player) {
						if (player.countMark("charge") <= 0) return false;
					},
					selectCard: -1,
					prompt: "视为使用一张杀",
					precontent: function () {
						player.removeMark("charge");
					},
					ai: {
						order: function () {
							var player = _status.event.player;
							if (
								!game.hasPlayer(function (current) {
									return (
										player.canUse("sha", current) && current.hp == 1 && get.effect(current, { name: "sha" }, player, player) > 0
									);
								})
							) {
								return 0;
							}
							return 2.95;
						},
						skillTagFilter: function (player, tag, arg) {
							if (arg != "use") return false;
						},
						respondSha: true,
					},
				},
				allin: {
					enable: "phaseUse",
					filter: function (event, player) {
						return player.countMark("charge") >= 4;
					},
					delay: 0,
					content: function () {
						"step 0";
						player
							.chooseControl("确定", "取消")
							.set("prompt", get.prompt("biaohaomrfz"))
							.set("prompt2", "你可以消耗4点蓄力值，视为使用三张【杀】和一张【万箭齐发】，然后失去3点体力。");
						("step 1");
						if (result.control == "取消") event.finish();
						else {
							player.logSkill("biaohaomrfz");
							player.removeMark("charge", 4);
							event.num = 0;
						}
						("step 2");
						event.num++;
						player.chooseUseTarget(
							{
								name: event.num < 4 ? "sha" : "wanjian",
								isCard: true,
							},
							"请选择【杀】的目标(【杀】:" + (event.num < 4 ? event.num : 3) + "/3;【万箭齐发】:0/1)",
							false
						);
						player.logSkill("biaohaomrfz");
						if (event.num < 4) event.redo();
						("step 3");
						player.loseHp(3);
					},
					ai: {
						order: 3,
						result: {
							player: 1,
						},
					},
				},
			},
			ai: {
				order: 10,
				result: {
					player: 1,
				},
			},
		},
		xuezhanmrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "dieBegin" },
			filter: function (event, player) {
				return !player.storage.xuezhanmrfz;
			},
			content: function () {
				player.storage.xuezhanmrfz = true;
				player.chooseToDiscard("hej", true, player.countCards("hej"));
				trigger.cancel();
				game.log(player, "复活");
				if (player.getDamagedHp()) player.recover(player.maxHp);
				if (player.maxHp >= 2) player.loseMaxHp(player.maxHp - 2);
				else player.gainMaxHp(2 - player.maxHp);
				player.draw(4);
				player.link(false);
				player.turnOver(false);
			},
		},
		//焰尾
		fengjianmrfz: {
			intro: {
				content: "当你使用下一张非的【闪】基本牌后，你可以视为使用一张相同的基本牌。",
			},
			audio: 2,
			trigger: { player: ["respond", "useCardAfter"] },
			forced: true,
			firstDo: true,
			filter: function (event, player) {
				if (!event.respondTo) return false;
				return !player.hasMark("fengjianmrfz");
			},
			content: function () {
				player.addMark("fengjianmrfz");
			},
			group: "fengjianmrfz_use",
			subSkill: {
				use: {
					trigger: { player: "useCardAfter" },
					forced: true,
					firstDo: true,
					filter: function (event, player) {
						if (event.card.name == "shan") return false;
						return player.hasMark("fengjianmrfz") && get.type(event.card) == "basic";
					},
					content: function () {
						var cards = trigger.card;
						player.removeMark("fengjianmrfz");
						if ((cards.name == "tao" && player.getDamagedHp() > 0) || cards.name != "shan") {
							player.chooseUseTarget(cards, false, get.prompt2("fengjianmrfz"), "你可以使用一张" + get.translation(cards));
							player.logSkill("fengjianmrfz");
						}
					},
				},
			},
		},
		hongsongmrfz: {
			intro: {
				content:
					"你有#个‘红松’标记</br>·有‘红松’标记的角色需要使用或打出闪时可以进行判定，若不为♥，视为使用一张【闪】并获得此判定牌，然后移除一个‘红松’标记。",
			},
			onremove: true,
			audio: 2,
			trigger: { player: ["respond", "useCardAfter"] },
			forced: true,
			filter: function (event, player) {
				var num = 0;
				for (var i = 0; i < game.players.length; i++) {
					if (game.players[i].hasMark("hongsongmrfz")) num += game.players[i].countMark("hongsongmrfz");
				}
				if (!event.respondTo) return false;
				return num < 3;
			},
			content: function () {
				player.addMark("hongsongmrfz");
			},
			group: ["hongsongmrfz_shan", "hongsongmrfz_give"],
			subSkill: {
				shan: {
					audio: "hongsongmrfz",
					trigger: {
						global: ["chooseToRespondBegin", "chooseToUseBegin"],
					},
					filter: function (event, player) {
						if (event.responded) return false;
						if (!event.filterCard || !event.filterCard({ name: "shan" }, player, event)) return false;
						if (event.name == "chooseToRespond" && !lib.filter.cardRespondable({ name: "shan" }, player, event)) return false;
						if (event.player != player && !event.player.hasMark("hongsongmrfz")) return false;
						return true;
					},
					forced: true,
					content: function () {
						"step 0";
						trigger.player
							.chooseControl("确定", "取消")
							.set("prompt", get.prompt("hongsongmrfz"))
							.set("prompt2", "你可以进行判定，若不为♥，其视为使用或打出一张【闪】并获得判定牌");
						("step 1");
						if (result.control == "确定") {
							trigger.player
								.judge(function (card) {
									return get.suit(card) == "heart" ? -0.5 : 1.5;
								})
								.set("callback", lib.skill.hongsongmrfz_shan.callback).judge2 = function (result) {
								return result.bool;
							};
						} else event.finish();
						("step 2");
						if (result.judge > 0) {
							trigger.untrigger();
							trigger.set("responded", true);
							trigger.result = {
								bool: true,
								card: { name: "shan", isCard: true },
							};
							if (trigger.player != player) trigger.player.removeMark("hongsongmrfz");
						}
					},
					callback: function () {
						if (get.suit(card) != "heart") player.gain(card, "gain2");
					},
					ai: {
						respondShan: true,
					},
				},
				give: {
					direct: true,
					trigger: { player: "phaseBegin" },
					filter: function (event, player) {
						return player.hasMark("hongsongmrfz");
					},
					content: function () {
						"step 0";
						player.chooseTarget(
							get.prompt("hongsongmrfz"),
							"你可以将任意个‘红松’标记交给任意名其他角色",
							function (card, player, target) {
								return target != player;
							}
						).ai = function (target) {
							return get.attitude(player, target) > 0;
						};
						("step 1");
						if (result.bool && result.targets) {
							var target = result.targets[0];
							target.addMark("hongsongmrfz");
							player.removeMark("hongsongmrfz");
							player.logSkill("hongsongmrfz", target);
							if (player.hasMark("hongsongmrfz")) event.goto(0);
						}
					},
				},
			},
			ai: {
				threaten: 0.5,
			},
		},
		//夕
		huijuanmrfz: {
			intro: { content: "记录的牌名:$" },
			onremove: true,
			audio: 2,
			forced: true,
			trigger: { global: "useCard" },
			filter: function (event, player) {
				if (get.type(event.card) == "equip") return false;
				if (get.type(event.card) == "trick" && player.hasSkill("huijuanmrfz_trick")) return false;
				if (get.type(event.card) == "basic" && player.hasSkill("huijuanmrfz_basic")) return false;
				if (get.type(event.card) == "delay" && player.hasSkill("huijuanmrfz_delay")) return false;
				return !player.getStorage("huijuanmrfz").includes(event.card.name);
			},
			content: function () {
				player.markAuto("huijuanmrfz", [trigger.card.name]);
				if (get.type(trigger.card) == "trick") player.addSkill("huijuanmrfz_trick");
				if (get.type(trigger.card) == "delay") player.addSkill("huijuanmrfz_delay");
				if (get.type(trigger.card) == "basic") player.addSkill("huijuanmrfz_basic");
			},
			group: ["huijuanmrfz_use", "huijuanmrfz_clear"],
			subSkill: {
				//检测技能
				basic: {
					silent: true,
					direct: true,
					firstDo: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					content: function () {
						player.removeSkill("huijuanmrfz_basic");
					},
				},
				trick: {
					silent: true,
					direct: true,
					firstDo: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					content: function () {
						player.removeSkill("huijuanmrfz_trick");
					},
				},
				delay: {
					silent: true,
					direct: true,
					firstDo: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					content: function () {
						player.removeSkill("huijuanmrfz_delay");
					},
				},
				//非检测技能
				clear: {
					silent: true,
					direct: true,
					charlotte: true,
					firstDo: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return player.getStorage("huijuanmrfz").length;
					},
					content: function () {
						for (var i = 0; i < 2; i++) player.unmarkAuto("huijuanmrfz", [player.getStorage("huijuanmrfz")[0]]);
					},
				},
				use: {
					hiddenCard: function (player, name) {
						if (name == "wuxie") return player.getStorage("huijianmrfz").includes(name);
					},
					enable: ["chooseToRespond", "chooseToUse"],
					filter: function (event, player) {
						if (player.getStorage("huijuanmrfz").length == 0 || player.countCards("h") == 0) return false;
						for (var i = 0; i < player.getStorage("huijuanmrfz").length; i++) {
							if (
								event.filterCard(
									{
										name: player.getStorage("huijuanmrfz")[i],
									},
									player,
									event
								)
							)
								return true;
						}
						return false;
					},
					chooseButton: {
						dialog: function (event, player) {
							var list = [];
							var storage = player.getStorage("huijuanmrfz");
							for (var i of lib.inpile) {
								if (event.filterCard({ name: i }, player, event) && storage.includes(i))
									list.push([get.type(i) == "basic" ? "基本" : "锦囊", "", i]);
							}
							return ui.create.dialog("绘卷", [list, "vcard"], "hidden");
						},
						filter: function (button, player) {
							return lib.filter.cardEnabled(
								{
									name: button.link[2],
								},
								player,
								_status.event.getParent()
							);
						},
						check: function (button) {
							var player = _status.event.player;
							var card = {
								name: button.link[2],
							};
							if (player.getUseValue(card) > 0) return get.order(card);
							return -1;
						},
						backup: function (links, player) {
							return {
								audio: "huijuanmrfz",
								popname: true,
								filterCard: true,
								position: "hs",
								viewAs: {
									name: links[0][2],
								},
								check: function (card) {
									return 6 - get.value(card);
								},
								precontent: function () {
									var cards = event.result.card;
									if (cards.name == "sha" || cards.name == "jiu") event.getParent().addCount = false;
									player.unmarkAuto("huijuanmrfz", [cards.name]);
								},
							};
						},
						prompt: function (links, player) {
							return "将一张手牌当做【" + get.translation(links[0][2]) + "】使用";
						},
					},
					ai: {
						order: 13,
						result: {
							player: 1,
						},
					},
				},
			},
			ai: {
				threaten: 1.3,
			},
		},
		dianjingmrfz: {
			mark: true,
			locked: false,
			zhuanhuanji: true,
			marktext: "☯",
			intro: {
				content: function (event, player) {
					return !player.storage.dianjingmrfz
						? "当你使用转化牌时，你可以从牌堆中获得与你使用的转化牌的牌名相同的牌。"
						: "当你使用转化牌时，你可以从牌堆中获得与你使用的转化牌的类型相同的牌。";
				},
			},
			audio: 2,
			trigger: { player: "useCardAfter" },
			filter: function (event, player) {
				return !event.card.isCard;
			},
			frequent: true,
			content: function () {
				var cardt = get.cardPile2(function (card) {
					return get.type(card, "trick") == get.type(trigger.card);
				});
				var cardf = get.cardPile2(trigger.card.name);
				if (player.storage.dianjingmrfz == true) {
					if (cardt) player.gain(cardt, "gain2", "log");
					else player.chat("牌堆中没有", cardt, "牌");
				} else {
					if (cardf) player.gain(cardf, "gain2", "log");
					else player.chat("牌堆中没有【" + get.translation(trigger.card.name) + "】");
				}
				player.changeZhuanhuanji("dianjingmrfz");
			},
		},
		cangjuanmrfz: {
			mod: {
				ignoredHandcard: function (card, player) {
					if (card.hasGaintag("cangjuanmrfz")) {
						return true;
					}
				},
				cardDiscardable: function (card, player, name) {
					if (name == "phaseDiscard" && card.hasGaintag("cangjuanmrfz")) return false;
				},
			},
			audio: 2,
			trigger: { player: "gainBegin" },
			filter: function (event, player) {
				return player.countMark("cangjuanmrfz") < 3;
			},
			forced: true,
			content: function () {
				player.addMark("cangjuanmrfz", false);
				trigger.gaintag.add("cangjuanmrfz");
			},
			group: "cangjuanmrfz_remove",
			subSkill: {
				remove: {
					silent: true,
					charlotte: true,
					direct: true,
					trigger: { global: "roundStart" },
					content: function () {
						player.removeMark("cangjuanmrfz", 3);
						player.removeGaintag("cangjuanmrfz");
					},
				},
			},
		},
		//能天使
		lianshemrfz: {
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return (num = player.maxHp);
				},
			},
			audio: 2,
			trigger: { player: "useCard" },
			forced: true,
			firstDo: true,
			filter: function (event, player) {
				return !event.audioed && event.card.name == "sha" && event.getParent().type == "phase";
			},
			content: function () {
				trigger.audioed = true;
			},
		},
		guozaimrfz: {
			audio: 4,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return player.getCardUsable("sha") > 0;
			},
			filterTarget: function (card, player, target) {
				return target != player;
			},
			content: function () {
				"step 0";
				var cards = game.cardsGotoOrdering(get.cards(player.maxHp + 1)).cards;
				event.cards = cards;
				event.cards2 = [];
				event.cards3 = [];
				event.num = 0;
				if (!player.canUse("sha", target, false)) event.finish();
				for (var i = 0; i < event.cards.length; i++) {
					if (event.cards[i].name == "sha") {
						event.cards2.push(event.cards[i]);
						event.num++;
					} else event.cards3.push(event.cards[i]);
				}
				game.cardsGotoOrdering(event.cards);
				player.showCards(event.cards, get.translation(player) + "发动了【过载】");
				if (event.cards2.length == 0 || !target.isAlive()) event.goto(2);
				("step 1");
				var cards = event.cards2[event.num - 1];
				player.showCards(cards, get.translation(player) + "发动了【过载】");
				event.num--;
				player.logSkill("guozaimrfz", target);
				if (target.isAlive())
					player
						.chooseUseTarget(cards, true, "nodistance")
						.set("filterTarget", function (card, player, target) {
							var evt = _status.event;
							if (_status.event.name == "chooseTarget") evt = evt.getParent();
							if (target != player && target != evt.guozaimrfz_target) return false;
							return lib.filter.targetEnabledx(card, player, target);
						})
						.set("guozaimrfz_target", target);
				if (event.num > 0 && target.isAlive() && player.getCardUsable("sha") > 0) event.redo();
				("step 2");
				if (event.cards3.length > 0)
					player.chooseButton(["过载:你可以获得一张牌", event.cards3]).set("ai", function (button) {
						return get.value(button.link, _status.event.player);
					});
				("step 3");
				if (result.links) player.gain(result.links, "gain2");
			},
			ai: {
				order: 10,
				threaten: 1.1,
				expose: 0.6,
				result: {
					target: -1,
				},
			},
		},
		//远牙
		yuanmengmrfz: {
			audio: 4,
			trigger: { global: "useCard" },
			filter: function (event, player) {
				if (player.inRange(event.player)) return false;
				if (!player.hasSha()) return false;
				return event.card.name == "sha" && event.player != player;
			},
			direct: true,
			content: function () {
				var target = trigger.targets[0],
					source = trigger.player;
				("step 0");
				if (target == player)
					player
						.chooseControl("确定", "cancel2")
						.set("prompt", get.prompt("yuanmengmrfz"))
						.set("prompt2", "你可以对" + get.translation(source) + "使用【杀】")
						.set("ai", function (player, target) {
							var player = _status.event.player,
								target = _status.event.getTrigger().player,
								source = _status.event.getTrigger().source;
							if (get.attitude(player, target) > 2) return 1;
							return 0;
						});
				else event.goto(2);
				("step 1");
				if (result.index == 0) {
					if (player.hasSha()) {
						player
							.chooseToUse(true, function (card, player, event) {
								if (get.name(card) != "sha") return false;
								return lib.filter.cardEnabled.apply(this, arguments);
							})
							.set("complexSelect", true)
							.set("filterTarget", function (card, player, target) {
								if (target != _status.event.targetx && !ui.selected.targets.includes(_status.event.targetx)) return false;
								return lib.filter.targetEnabled.apply(this, arguments);
							})
							.set("targetx", source);
						player.logSkill("yuanmengmrfz", source);
						player.draw();
					}
					event.finish();
				} else event.finish();
				("step 2");
				var next = player
					.chooseControl(get.translation(target), get.translation(source), "cancel2")
					.set("prompt", get.prompt("yuanmengmrfz"))
					.set("prompt2", "你可以对其中一名角色使用【杀】");
				next.set("ai", function () {
					var player = _status.event.player,
						target = _status.event.getTrigger().player,
						source = _status.event.getTrigger().source;
					if (get.attitude(player, target) < 2) return 1;
					if (get.attitude(player, source) < 2) return 0;
					return 2;
				});
				("step 3");
				if (result.index != 2) {
					var resulty = result.index == 1 ? target : source,
						resultx = result.index == 0 ? target : source;
					//player.addTempSkill('yuanmengmrfz_discard',{player:'shaAfter'});
					if (player.hasSha()) {
						player
							.chooseToUse(true, function (card, player, event) {
								if (get.name(card) != "sha") return false;
								return lib.filter.cardEnabled.apply(this, arguments);
							})
							.set("complexSelect", true)
							.set("filterTarget", function (card, player, target) {
								if (target != _status.event.targetx && !ui.selected.targets.includes(_status.event.targetx)) return false;
								return lib.filter.targetEnabled.apply(this, arguments);
							})
							.set("targetx", result.index == 0 ? target : source);
						player.draw();
						resulty.draw();
						player.logSkill("yuanmengmrfz", resultx);
					} else event.finish();
				} else event.finish();
			},
			//subSkill:{
			//discard:{
			//direct:true,
			//charlotte:true,
			//trigger:{player:'shaMiss'},
			//content:function(){
			//	'step 0'
			//	if(player.countCards('h')>0) trigger.targets[0].chooseCard('h',true,'【援盟】:请交给'+get.translation(player)+'一张手牌');
			//	else event.finish();
			//	'step 1'
			//	if(result.cards){
			//		player.logSkill('yuanmengmrfz',trigger.targets[0]);
			//		trigger.targets[0].give(result.cards,player);
			//	}
			//},
			//},
			//},
			ai: {
				expose: 0.5,
				threaten: 1.2,
			},
		},
		ningshenmrfz: {
			intro: {
				content: function (event, player) {
					return (
						(player.storage.ningshenmrfz_damage ? "·本轮已受到过伤害</br>" : "") +
						(player.countMark("ningshenmrfz") == 0
							? "·已连续0个回合没有成为其他角色使用牌的目标。"
							: "·已连续" + player.countMark("ningshenmrfz") + "个回合没有成为其他角色使用牌的目标。") +
						(player.storage.ningshenmrfz_mark != 0 ? "</br>·下一张带有伤害类标签的牌伤害基数+" + player.storage.ningshenmrfz_mark : "")
					);
				},
			},
			mark: true,
			audio: 2,
			direct: true,
			trigger: { global: "phaseEnd" },
			filter: function (event, player) {
				if (!event.player.isAlive()) return false;
				return true;
			},
			content: function () {
				"step 0";
				var history = trigger.player.getHistory("useCard");
				if (trigger.player != player)
					for (var i = 0; i < history.length; i++) {
						if (!history[i].targets) continue;
						for (var j = 0; j < history[i].targets.length; j++) {
							if (history[i].targets[j] == player) {
								player.removeMark("ningshenmrfz", player.countMark("ningshenmrfz"));
								event.finish();
							}
						}
					}
				("step 1");
				player.addMark("ningshenmrfz");
				("step 2");
				if (player.countMark("ningshenmrfz") >= 2) {
					player
						.chooseControl("摸牌", "获得杀")
						.set("prompt", get.prompt("ningshenmrfz"))
						.set("prompt2", "请选择一项")
						.set("ai", function (event, player) {
							if (
								player.hp <= 2 ||
								player.hasCard(function (card) {
									return card.name == "sha";
								})
							)
								return 0;
							return 1;
						});
					player.removeMark("ningshenmrfz", player.countMark("ningshenmrfz"));
					player.popup("ningshenmrfz");
					player.logSkill("ningshenmrfz");
				} else event.finish();
				("step 3");
				var cards = get.cardPile2("sha");
				if (result.index == 0) player.draw();
				else if (cards) player.gain(cards, "gain2", "log");
			},
			group: ["ningshenmrfz_mark", "ningshenmrfz_damage", "ningshenmrfz_remove"],
			subSkill: {
				mark: {
					trigger: { player: "useCard1" },
					forced: true,
					firstDo: true,
					charlotte: true,
					filter: function (event, player) {
						return get.tag(event.card, "damage") && player.storage.ningshenmrfz_mark > 0;
					},
					content: function () {
						trigger.baseDamage += player.storage.ningshenmrfz_mark;
						player.storage.ningshenmrfz_mark = 0;
						player.logSkill("ningshenmrfz");
					},
					init: function (player) {
						player.storage.ningshenmrfz_mark = 0;
					},
					onremove: function (player) {
						delete player.storage.ningshenmrfz_mark;
					},
					ai: {
						damageBonus: true,
					},
				},
				damage: {
					silent: true,
					charlotte: true,
					popup: false,
					trigger: { global: "roundStart" },
					content: function () {
						if (!player.storage.ningshenmrfz_damage) {
							player.logSkill("ningshenmrfz");
							player.storage.ningshenmrfz_mark++;
						} else player.storage.ningshenmrfz_damage = false;
					},
				},
				remove: {
					silent: true,
					charlotte: true,
					popup: false,
					trigger: { player: "damageEnd" },
					content: function () {
						if (!player.storage.ningshenmrfz_damage) player.storage.ningshenmrfz_damage = true;
					},
				},
			},
			ai: {
				threaten: 1.1,
			},
		},
		bingximrfz: {
			mod: {
				attackRangeBase: function (player, num) {
					if (player != _status.currentPhase && player.hp <= player.countCards("h")) return (num = 0);
					return num;
				},
			},
		},
		//迷迭香
		nianshoumrfz: {
			markimage: "extension/WhichWay/image/skill/mdxnianshoumrfz.png",
			intro: {
				name: "巨剑",
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			audio: 4,
			enable: "phaseUse",
			filter: function (event, player) {
				if (player.getExpansions("nianshoumrfz").length >= 2) return false;
				return player.hasCard(function (card) {
					return get.subtype(card) == "equip1";
				});
			},
			filterCard: function (card) {
				return get.subtype(card) == "equip1";
			},
			position: "he",
			discard: false,
			content: function () {
				player.addToExpansion(cards, player, "give").gaintag.add("nianshoumrfz");
			},
			group: [
				"nianshoumrfz_disable",
				"nianshoumrfz_usesha",
				"nianshoumrfz_eff1",
				"nianshoumrfz_eff2",
				"nianshoumrfz_eff3",
				"nianshoumrfz_eff4",
				"nianshoumrfz_eff5",
			],
			subSkill: {
				disable: {
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return event.name != "phase" || game.phaseNumber == 0;
					},
					content: function () {
						var card = get.cardPile2(function (card) {
							return get.subtype(card) == "equip1";
						});
						("step 0");
						player.logSkill("nianshoumrfz");
						event.num = 0;
						player.disableEquip("equip1");
						("step 1");
						event.num++;
						if (card) player.gain(card, "gain2", "log");
						else player.chat("牌堆中没有武器牌了");
						if (event.num < 2) event.redo();
					},
				},
				usesha: {
					direct: true,
					trigger: { player: "useCardToPlayered" },
					filter: function (event, player) {
						var targetx = event.targets,
							num = 0;
						if (event.card.name != "sha" || player.getExpansions("nianshoumrfz").length == 0) return false;
						if (event.getParent().triggeredTargets3.length > 1) return false;
						for (var i = 0; i < targetx.length; i++) {
							if (targetx[i].getExpansions("nianshoumrfz").length < 2) num++;
						}
						return num > 0;
					},
					content: function () {
						"step 0";
						player
							.chooseBool(
								"是否将一个‘巨剑’置于" +
									(trigger.targets.length == 1 ? get.translation(trigger.targets[0]) : "其中一个目标") +
									"的武将牌上"
							)
							.set("ai", function () {
								return trigger.targets.some(q => get.attitude(player, q) < 2);
							}); //QQQ
						("step 1");
						if (result.bool && trigger.targets.length == 1) {
							player.logSkill("nianshoumrfz");
							var cards = player.getExpansions("nianshoumrfz");
							if (cards.length) player.chooseButton(["选择一个‘巨剑’", cards], true);
							else event.finish();
						} else event.goto(4);
						("step 2");
						if (result.links && result.bool && trigger.targets.length == 1) {
							player.gain(result.links, "gain2").gaintag.add("nianshoumrfz2");
						}
						("step 3");
						if (result.cards && trigger.targets.length == 1) {
							var cards3 = player.getCards("h", function (card) {
								return card.hasGaintag("nianshoumrfz2");
							});
							trigger.targets[0].addToExpansion(cards3, trigger.targets[0], "give").gaintag.add("nianshoumrfz");
						}
						event.finish();
						("step 4");
						if (result.links && result.bool && trigger.targets.length > 1) {
							player
								.chooseTarget(true, function (card, player, target) {
									return _status.event.targets.includes(target);
								})
								.set("targets", trigger.targets)
								.set("ai", function (target) {
									return get.attitude(_status.event.player, target) < 2;
								});
						} else event.finish();
						("step 5");
						if (result.bool && result.targets) {
							event.target = result.targets[0];
							var cards = player.getExpansions("nianshoumrfz");
							if (cards.length) player.chooseButton(["选择一个‘巨剑’", cards], true);
							else event.finish();
						} else event.finish();
						("step 6");
						if (result.links && result.bool) {
							player.gain(result.links, "gain2").gaintag.add("nianshoumrfz2");
						}
						("step 7");
						if (result.cards) {
							var cards3 = player.getCards("h", function (card) {
								return card.hasGaintag("nianshoumrfz2");
							});
							event.target.addToExpansion(cards3, event.target, "give").gaintag.add("nianshoumrfz");
						}
					},
				},
				eff1: {
					trigger: {
						player: ["loseAfter", "addToExpansionAfter", "cardsGotoSpecialAfter", "loseAsyncAfter"],
					},
					filter: function (event, player, name) {
						if (event.name == "lose" || event.name == "loseAsync") return event.getlx !== false && event.toStorage == true;
						if (event.name == "cardGotoSpecial") return !event.notrigger;
						return true;
					},
					direct: true,
					charlotte: true,
					content: function () {
						for (var i = 0; i < player.getExpansions("nianshoumrfz").length; i++) {
							var names = player.getExpansions("nianshoumrfz")[i].name + "_skill";
							if (lib.skill[names]) {
								player.addSkill(names);
							} //QQQ
						}
					},
				},
				eff2: {
					trigger: {
						player: "gainAfter",
					},
					filter: function (event, player) {
						return (
							event.fromStorage == true ||
							game.hasPlayer2(function (current) {
								var evt = event.getl(current);
								return evt && evt.xs && evt.xs.length > 0;
							})
						);
					},
					direct: true,
					charlotte: true,
					content: function () {
						if (Array.isArray(trigger.cards))
							for (var i of trigger.cards) {
								var names = i.name + "_skill";
								if (lib.skill[names] && player.hasSkill(names)) {
									player.removeSkill(names);
								} //QQQ
							}
					},
				},
				eff3: {
					direct: true,
					charlotte: true,
					trigger: { global: "phaseDrawBegin2" },
					filter: function (event, player) {
						return event.player.getExpansions("nianshoumrfz").length > 0 && event.player != player;
					},
					content: function () {
						var target = trigger.player;
						trigger.num -= target.getExpansions("nianshoumrfz").length;
						player.logSkill("nianshoumrfz", target);
					},
				},
				eff4: {
					direct: true,
					charlotte: true,
					trigger: { player: "damageBegin3" },
					usable: 1,
					filter: function (event, player) {
						if (event.source == undefined) return false;
						return event.source.getExpansions("nianshoumrfz").length > 0;
					},
					content: function () {
						trigger.num -= trigger.source.getExpansions("nianshoumrfz").length;
						player.logSkill("nianshoumrfz", trigger.source);
					},
				},
				eff5: {
					direct: true,
					charlotte: true,
					trigger: { player: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						return game.hasPlayer(function (current) {
							return current.getExpansions("nianshoumrfz").length > 0 && current != player;
						});
					},
					content: function () {
						var list = ["e", "h"];
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].getExpansions("nianshoumrfz").length > 0 && game.players[i] != player) {
								for (var j = 0; j < 2; j++) {
									if (game.players[i].countCards(list[j]) > 0) {
										player.gain(game.players[i].getCards(list[j]).randomGet(), "give");
										game.log(
											player,
											"获得了",
											game.players[i],
											"的" + get.translation(game.players[i].getCards(list[j]).randomGet())
										);
									}
								}
								player.gain(game.players[i].getExpansions("nianshoumrfz"), "give", "log");

								player.logSkill("nianshoumrfz", game.players[i]);
							}
						}
					},
				},
			},
			ai: {
				order: 13,
				result: {
					player: 1,
				},
			},
		},
		zhangyimrfz: {
			charlotte: true,
			mod: {
				attackRange: function (player, num) {
					if (player.getExpansions("nianshoumrfz").length) return num + player.getExpansions("nianshoumrfz").length;
				},
			},
		},
		chongjimrfz: {
			audio: 2,
			trigger: { source: "damageEnd" },
			direct: true,
			filter: function (event, player) {
				if (event.parent.name == "_lianhuan" || event.parent.name == "_lianhuan2") return false;
				if (event.card && event.card.name != "sha") return false;
				if (game.countPlayer() <= 2) return false;
				return event.getParent().name != "chongjimrfz" && event.num > 0;
			},
			content: function () {
				"step 0";
				var targets = trigger.player;
				player.chooseTarget(
					get.prompt("chongjimrfz"),
					"你可以对" + get.translation(targets) + "的上家或下家造成一点伤害",
					function (card, player, target) {
						return (target == targets.getNext() || target == targets.getPrevious()) && target != player;
					}
				).ai = function (target) {
					return -get.attitude(player, target);
				};
				("step 1");
				if (result.bool && result.targets) {
					result.targets[0].damage();
					if (trigger.num > 0)
						result.targets[0].chooseToDiscard("h", true, get.prompt("chongjimrfz"), "请选择弃置" + trigger.num + "张手牌", trigger.num);
					player.logSkill("chongjimrfz", result.targets[0]);
				}
			},
		},
		//水陈 假日威龙陈
		yuyunmrfz: {
			audio: 2,
			trigger: { player: "phaseEnd" },
			direct: true,
			content: function () {
				var num = player.getCardUsable("sha");
				var history = player.getHistory("useCard");
				("step 0");
				for (var i = 0; i < history.length; i++) {
					if (history[i].card.name == "sha") {
						player.removeMark("yuyunmrfz", player.countMark("yuyunmrfz"));
						event.finish();
					}
				}
				("step 1");
				player.chooseBool("是否发动【余韵】？");
				("step 2");
				if (result.bool) {
					player.draw(Math.min(num, 3));
					player.logSkill("yuyunmrfz");
				} else event.finish();
				("step 3");
				player.removeMark("yuyunmrfz", player.countMark("yuyunmrfz"));
				player.addMark("yuyunmrfz", Math.min(num, 2));
			},
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return (num += player.countMark("yuyunmrfz"));
				},
			},
		},
		shuiqiangmrfz: {
			audio: 2,
			trigger: { player: "useCardToPlayered" },
			filter: function (event, player) {
				if (event.getParent().triggeredTargets3.length > 1) return false;
				if (event.card.name != "sha") return false;
				return game.hasPlayer(function (current) {
					return !event.targets.includes(current) && player.canUse(event.card, current) && player.inRange(current);
				});
			},
			direct: true,
			content: function () {
				var list = [];
				("step 0");
				player
					.chooseTarget(
						[1, Infinity],
						get.prompt("shuiqiangmrfz"),
						"为" + get.translation(trigger.card) + "增加任意个目标",
						function (card, player, target) {
							return !_status.event.sourcex.includes(target) && player.inRange(target) && player.canUse(_status.event.card, target);
						}
					)
					.set("sourcex", trigger.targets)
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, _status.event.card, player, player);
					})
					.set("card", trigger.card)
					.setHiddenSkill(event.name);
				("step 1");
				if (result.bool) {
					if (!event.isMine() && !event.isOnline()) game.delayx();
					for (var i = 0; i < result.targets.length; i++) {
						trigger.targets.push(result.targets[i]);
						player.line(result.targets[i]);
					}
					player.logSkill("shuiqiangmrfz");
				} else {
					event.finish();
				}
			},
		},
		jianfengmrfz: {
			audio: 2,
			trigger: { player: "useCardAfter" },
			filter: function (event, player) {
				return event.card.name == "sha";
			},
			frequent: true,
			content: function () {
				"step 0";
				player.judge(function (card) {
					var suit = get.suit(card);
					if (suit == "spade") return -4;
					return 0;
				}).judge2 = function (result) {
					return result.bool == false ? true : false;
				};
				("step 1");
				if (result.suit == "spade") {
					var list = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.position(trigger.cards[i], true) == "o") {
							list.push(trigger.cards[i]);
						}
					}
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						trigger.player.getStat().card.sha--;
					}
					player.gain(list, "gain2");
				}
			},
		},
		//水月
		liqunmrfz: {
			audio: 2,
			trigger: { target: "useCardToTargeted" },
			filter: function (event, player) {
				if (event.player == player) return false;
				return event.card.length < 2 || get.distance(player, event.target) < 2;
			},
			usable: 1,
			check: function (event, player) {
				if (event.card.name == "wugu" || event.card.name == "tao") return false;
				if (get.attitude(player, event.target) > 2 && event.card.name == "sha") return false;
				return true;
			},
			content: function () {
				trigger.getParent().excluded.add(player);
			},
		},
		chuangshangmrfz: {
			audio: 2,
			trigger: { source: "damageEnd" },
			filter: function (event, player) {
				if (event.getParent().name == "chuangshangmrfz") return false;
				if (event.player == player) return false;
				return (
					event.player.isMinHp() ||
					game.hasPlayer(function (current) {
						return current != player && player.inRange(current) && current.maxHp / 2 >= current.hp;
					})
				);
			},
			content: function () {
				var target = trigger.player;
				("step 0");
				var str1 = "摸两张牌",
					str2 = "对" + get.translation(target) + "造成一点伤害";
				if (
					target.isMinHp() &&
					game.hasPlayer(function (current) {
						return current != player && player.inRange(current) && current.maxHp / 2 >= current.hp;
					})
				) {
					player
						.chooseControl(str1, str2)
						.set("prompt", get.prompt("chuangshangmrfz"))
						.set("prompt2", "请选择一项")
						.set("ai", function (player) {
							if (player.hp < 2 && player.countCards("h") < 3) return 0;
							return 1;
						});
				} else {
					player.draw();
					event.finish();
				}
				("step 1");
				if (result.index == 0) {
					player.draw(2);
				} else target.damage();
			},
		},
		jinghuamrfz: {
			audio: 2,
			trigger: { player: "useCardToPlayered" },
			usable: 1,
			filter: function (event, player) {
				if (event.getParent().triggeredTargets3.length > 1) return false;
				if (event.card.name != "sha") return false;
				return game.hasPlayer(function (current) {
					return current != player && current != event.target;
				});
			},
			check: function (event, player) {
				if (player.hp < 3) return false;
				if (
					!game.hasPlayer(function (current) {
						return current != event.target && current != player && current != event.player && get.attitude(player, current) < 2;
					})
				)
					return false;
				return true;
			},
			content: function () {
				"step 0";
				player
					.chooseTarget(
						true,
						[1, 2],
						get.prompt("jinghuamrfz"),
						"为" + get.translation(trigger.card) + "增加至多两个目标",
						function (card, player, target) {
							return !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target, false);
						}
					)
					.set("sourcex", trigger.targets)
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, _status.event.card, player, player);
					})
					.set("card", trigger.card)
					.setHiddenSkill(event.name);
				("step 1");
				if (result.bool) {
					player.addTempSkill("jinghuamrfz2", {
						player: "useCardAfter",
					});
					for (var i = 0; i < result.targets.length; i++) {
						trigger.targets.push(result.targets[i]);
						player.line(result.targets[i]);
					}
				}
			},
		},
		jinghuamrfz2: {
			charlotte: true,
			direct: true,
			trigger: { player: "useCardEnd" },
			filter: function (event, player) {
				if (event.card.name != "sha") return false;
				return (
					player.getHistory("sourceDamage", function (evt) {
						return evt.card == event.card;
					}).length <= 2
				);
			},
			content: function () {
				player.loseHp();
			},
		},
		//仇白
		ruximrfz: {
			audio: 4,
			trigger: { player: "useCardToPlayered" },
			filter: function (event, player) {
				if (event.target == player) return false;
				if (event.getParent().triggeredTargets3.length > 1) return false;
				return event.card.name == "sha";
			},
			check: function (event, player) {
				return get.attitude(player, event.target) < 2;
			},
			subfrequent: ["link"],
			content: function () {
				"step 0";
				player.judge(function (card) {
					var suit = get.suit(card);
					if (suit == "spade") return -2;
					if (suit == "club") return -4;
					return 0;
				}).judge2 = function (result) {
					return result.bool == false ? true : false;
				};
				("step 1");
				for (var i = 0; i < trigger.targets.length; i++) {
					var target = trigger.targets[i];
					if (result.color == "black") {
						target.link(true);
					}
					if (result.suit == "club") {
						player.addTempSkill("ruximrfz2", "phaseEnd");
						player.addMark("ruximrfz2", false);
					}
				}
			},
			group: "ruximrfz_link",
			subSkill: {
				link: {
					trigger: { player: "useCardToPlayer" },
					filter: function (event, player) {
						if (event.target == player) return false;
						if (event.targets.length > 1) return false;
						return event.target.isLinked() || event.target.countCards("j") > 0;
					},
					frequent: true,
					content: function () {
						"step 0";
						if (trigger.targets[0].countCards("hej") == 0) {
							event.finish();
							player.draw();
						}
						("step 1");
						player
							.chooseBool(
								get.prompt("ruximrfz"),
								"【入隙】:是否摸一张牌</br>选择取消则为弃置" + get.translation(trigger.targets[0]) + "的区域内一张牌"
							)
							.set("ai", function () {
								var target = trigger.targets[0];
								let player = get.player();
								var att = get.attitude(player, target);
								var num = Math.random();
								if (att > 2 && target.countCards("j") > 0) return false;
								return num > 0.5 ? true : false;
							});
						("step 2");
						if (result.bool) {
							player.draw();
						} else {
							player.discardPlayerCard(trigger.targets[0], "hej", true);
							player.line(trigger.targets[0]);
						}
					},
				},
			},
		},
		ruximrfz2: {
			charlotte: true,
			onremove: true,
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return num + player.countMark("ruximrfz2");
				},
			},
		},
		wenxuemrfz: {
			audio: 4,
			trigger: { player: "useCard2" },
			filter: function (event, player) {
				if (event.card.name != "sha") return false;
				return game.hasPlayer(function (current) {
					return (
						!event.targets.includes(current) &&
						player.canUse(event.card, current) &&
						player.inRange(current) &&
						(current.isLinked() || current.countCards("j") > 0)
					);
				});
			},
			direct: true,
			content: function () {
				"step 0";
				player
					.chooseTarget(
						[1, 2],
						get.prompt("wenxuemrfz"),
						"为" + get.translation(trigger.card) + "增加至多两个目标",
						function (card, player, target) {
							return (
								!_status.event.sourcex.includes(target) &&
								player.inRange(target) &&
								player.canUse(_status.event.card, target) &&
								(target.isLinked() || target.countCards("j") > 0)
							);
						}
					)
					.set("sourcex", trigger.targets)
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, _status.event.card, player, player);
					})
					.set("card", trigger.card)
					.setHiddenSkill(event.name);
				("step 1");
				if (result.bool) {
					for (var i = 0; i < result.targets.length; i++) {
						player.logSkill("wenxuemrfz", result.targets[i]);
						trigger.targets.push(result.targets[i]);
					}
				}
			},
			group: ["wenxuemrfz_sha", "wenxuemrfz_count", "wenxuemrfz_clear"],
			subSkill: {
				sha: {
					direct: true,
					trigger: { player: "useCardAfter" },
					filter: function (event, player) {
						if (event.card.name != "sha") return false;
						if (
							!game.hasPlayer(function (current) {
								return current != player && player.inRange(current) && player.canUse("sha", current);
							})
						)
							return false;
						var history = player.getHistory("useCard", function (evt) {
							return evt.card.name == "sha" && evt.cards && evt.cards.length == 1;
						});
						return history.length % 2 == 0 && event.cards && event.cards.length == 1;
					},
					content: function () {
						"step 0";
						//event.num=Math.floor(player.countMark('wenxuemrfz_count')/2);
						var history = player.getHistory("useCard", function (evt) {
							return evt.card.name == "sha" && evt.cards && evt.cards.length == 1;
						});
						event.num = history.length / 2;
						player.chooseBool(get.prompt("wenxuemrfz"), "可以使用" + event.num + "张【杀】");
						("step 1");
						if (result.bool) {
							player.chooseUseTarget(
								{
									name: "sha",
									isCard: true,
								},
								"请选择【杀】的目标(还可使用" + event.num + "张【杀】)",
								false
							);
							event.num--;
							player.logSkill("wenxuemrfz");
							if (event.num > 0) event.redo();
						}
					},
				},
				count: {
					silent: true,
					charlotte: true,
					trigger: { player: "useCard" },
					filter: function (event, player) {
						if (player == _status.currentPhase) return false;
						return event.card.name == "sha";
					},
					content: function () {
						player.addMark("wenxuemrfz_count", false);
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					content: function () {
						player.removeMark("wenxuemrfz_count", player.countMark("wenxuemrfz_count"), false);
					},
				},
			},
		},
		//归溟幽灵鲨
		yongwomrfz: {
			audio: 2,
			trigger: { player: "dying" },
			forced: true,
			mark: true,
			intro: {
				content: function (event, player) {
					if (player.isTurnedOver()) return "复活不可用";
					if (!player.storage.yongwomrfz2 && !player.isTurnedOver()) return "复活未使用";
					return "复活已使用";
				},
			},
			filter: function (event, player) {
				if (player.storage.yongwomrfz2) return false;
				return !player.isTurnedOver();
			},
			content: function () {
				player.storage.yongwomrfz2 = true;
				player.turnOver();
				if (player.hp <= 0) player.recover(1 - player.hp);
			},
			mod: {
				globalTo: function (source, player, distance) {
					if (player.isTurnedOver()) return distance + 1;
				},
			},
			group: ["yongwomrfz_discard", "yongwomrfz_change1", "yongwomrfz_change2", "yongwomrfz2"],
			subSkill: {
				discard: {
					trigger: { global: "useCardAfter" },
					filter: function (event, player) {
						if (!player.isTurnedOver()) return false;
						if (event.player == player) return false;
						if (event.player.countCards("he") == 0) return false;
						return event.player == player.getNext() || event.player == player.getPrevious();
					},
					direct: true,
					content: function () {
						var target = trigger.player;
						("step 0");
						target.chooseToDiscard("he", true, "【拥我】:请弃置一张牌");
						target.addMark("yongwomrfz2", false);
						("step 1");
						if (target.countMark("yongwomrfz2") >= 2) {
							target.removeMark("yongwomrfz2", 2, false);
							target.damage();
							player.logSkill("yongwomrfz", target);
						} else event.finish();
						("step 2");
						player.chooseBool("【拥我】:是否翻面").set("ai", function () {
							var player = _status.event.player;
							if (player.hp < 2 && !player.storage.yongwomrfz2) return true;
							if (get.attitude(player, player.getNext()) > 2 || get.attitude(player, player.getPrevious()) > 2) return true;
							return false;
						});
						("step 3");
						if (result.bool) {
							player.turnOver();
							player.logSkill("yongwomrfz");
						}
					},
				},
				change1: {
					direct: true,
					trigger: { player: "turnOverAfter" },
					filter: function (event, player) {
						return !player.isTurnedOver();
					},
					content: function () {
						player.draw(2);
						player.logSkill("yongwomrfz");
					},
				},
				change2: {
					direct: true,
					trigger: { global: "phaseEnd" },
					filter: function (event, player) {
						if (player.isTurnedOver() || !event.player.isAlive()) return false;
						return player.getStat("damage") > 0 || player.getHistory("damage").length > 0;
					},
					content: function () {
						"step 0";
						player.chooseBool("【拥我】:是否翻面").set("ai", function () {
							var num = 0.2,
								player = _status.event.player;
							if (player.countCards("h") > 2) num + 0.3;
							if (player.hp > 1) num + 0.1;
							if (get.attitude(player, player.getNext()) < 2 || get.attitude(player, player.getPrevious()) < 2) num + 0.3;
							if (player.isTurnedOver()) num + 0.3;
							return Math.random() + num > 0.6;
						});
						("step 1");
						if (result.bool) {
							player.turnOver();
							player.logSkill("yongwomrfz");
						}
					},
				},
			},
		},
		yongwomrfz2: {
			silent: true,
			trigger: { global: "roundStart" },
			filter: function (event, player) {
				return player.storage.yongwomrfz2;
			},
			content: function () {
				player.storage.yongwomrfz2 = false;
			},
		},
		//白铁
		jigongmrfz: {
			derivation: ["jigongmrfz_card"],
			audio: 2,
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			forced: true,
			filter: function (event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			content: function () {
				"step 0";
				var next = player
					.chooseControl()
					.set("choiceList", [
						"白铁多功能平台-攻击型：当你造成至少两点伤害时，你可以令此伤害+1。",
						"白铁多功能平台-支援型：锁定技，弃牌阶段开始时，你摸一张牌并额外执行一个出牌阶段。",
						"铁钳号原型机：出牌阶段你可以弃置X张带有伤害类标签的牌，然后选择一名你攻击范围内的其他角色，对其造成一点伤害（X=此技能本回合使用数+1）。",
					])
					.set("ai", function () {
						return [0, 1, 2].randomGet();
					});
				next.set("prompt", get.prompt("jigongmrfz")).set("prompt2", "请选择一项");
				("step 1");
				var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
				for (var i = 0; i < 3; i++) {
					if (result.index == i) {
						event.card = game.createCard(list[i], ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
						player.gain(event.card, "gain2");
						event.card2 = list[i];
					}
				}
				("step 2");
				if (player.getCards("h").includes(card) && get.name(card, player) == event.card2) player.chooseUseTarget(card, "nopopup", true);
			},
			group: ["jigongmrfz_gcard", "jigongmrfz_zb", "jigongmrfz_discard"],
			subSkill: {
				gcard: {
					direct: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
						for (var i = 0; i < 3; i++) {
							if (player.countCards("e", list[i])) return true;
						}
					},
					firstDo: true,
					content: function () {
						"step 0";
						player.chooseTarget("你可以将【支援装备】移动至一名其他角色的装备区", function (card, player, target) {
							return target != player && !target.getEquip(5) && !target.isDisabled(5);
						}).ai = function (target) {
							return get.attitude(player, target);
						};
						("step 1");
						var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
						if (result.bool) {
							for (var i = 0; i < 3; i++) {
								if (player.countCards("e", list[i])) {
									event.card = player.getCards("e", function (card) {
										return card.name == list[i];
									});
									player.lose(event.card, ui.ordering, "visible");
									player.line(result.targets[0]);
									event.target = result.targets[0];
								}
							}
						} else event.finish();
						("step 2");
						event.target.equip(event.card[0]);
						player.logSkill("jigongmrfz", event.target);
					},
				},
				zb: {
					trigger: { player: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
						for (var i = 0; i < 3; i++) {
							if (player.countCards("e", list[i])) return false;
						}
						return true;
					},
					content: function () {
						"step 0";
						var next = player
							.chooseControl()
							.set("choiceList", [
								"白铁多功能平台-攻击型：当你造成至少两点伤害时，你可以令此伤害+1。",
								"白铁多功能平台-支援型：锁定技，弃牌阶段开始时，你额外执行一个出牌阶段和摸牌阶段。",
								"铁钳号原型机：出牌阶段你可以弃置X张带有伤害类标签的牌，然后选择一名你攻击范围内的其他角色，对其造成一点伤害（X=此技能本回合使用数+1）。",
							])
							.set("ai", function () {
								return [0, 1, 2].randomGet();
							});
						next.set("prompt", get.prompt("jigongmrfz")).set("prompt2", "请选择一项");
						("step 1");
						var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
						for (var i = 0; i < 3; i++) {
							if (result.index == i) {
								event.card = game.createCard(list[i], ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
								player.gain(event.card, "gain2");
								event.card2 = list[i];
							}
						}
						("step 2");
						if (player.getCards("h").includes(card) && get.name(card, player) == event.card2)
							player.chooseUseTarget(card, "nopopup", true);
						player.logSkill("jigongmrfz");
					},
				},
				discard: {
					direct: true,
					trigger: { global: "phaseEnd" },
					filter: function (event, player) {
						var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
						for (var i = 0; i < 3; i++) {
							if (event.player.countCards("e", list[i])) return true;
						}
					},
					content: function () {
						"step 0";
						var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
						for (var i = 0; i < 3; i++) {
							if (trigger.player.countCards("e", list[i])) {
								event.card = trigger.player.getCards("e", function (card) {
									return card.name == list[i];
								});
								trigger.player.discard(event.card);
							}
						}
					},
				},
			},
		},
		jiefeimrfz: {
			audio: 2,
			trigger: { global: ["loseEnd", "cardsDiscardEnd"] },
			direct: true,
			popup: false,
			filter: function (event, player) {
				var cs = event.cards;
				for (var i = 0; i < cs.length; i++) {
					if (cs[i].name.indexOf("baitiemrfzcard") == 0 && get.position(cs[i], true) == "d") return true;
				}
				return false;
			},
			forceDie: true,
			content: function () {
				"step 0";
				if (!_status.jigongmrfz) _status.jigongmrfz = {};
				var list = [];
				var list2 = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
				var cs = trigger.cards;
				for (var i = 0; i < cs.length; i++) {
					if (cs[i].name.indexOf("baitiemrfzcard") == 0 && get.position(cs[i], true) == "d") {
						_status.jigongmrfz[cs[i].name] = false;
						list.push(cs[i]);
					}
					for (var j = 0; j < 3; j++) {
						if (cs[i].name == list2[j]) event.card = list2[j];
					}
				}
				game.log(list, "已被移出游戏");
				game.cardsGotoSpecial(list);
				event.card = game.createCard(list[0].name, ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
				player.popup("jigongmrfz");
				("step 1");
				player.chooseBool(get.prompt("jigongmrfz"));
				("step 2");
				if (result.bool) {
					player.logSkill("jiefeimrfz");
					player.judge(function (card) {
						var color = get.color(card);
						if (color == "red") return -4;
						return 0;
					}).judge2 = function (result) {
						return result.bool == false ? true : false;
					};
				} else event.finish();
				("step 3");
				if (result.color == "red") {
					player.draw();
					player.chooseTarget("你可以令一名角色装备【支援装备】", function (card, player, target) {
						return !target.getEquip(5) && !target.isDisabled(5);
					}).ai = function (target) {
						return get.attitude(player, target);
					};
				} else event.finish();
				("step 4");
				if (result.bool) {
					var cards = game.createCard(event.card, ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
					var target = result.targets[0];
					target.gain(cards, "gain2");
					target.equip(cards);
					player.logSkill("jiefeimrfz");
				}
			},
		},
		//推进之王 维纳
		yuechuimrfz: {
			init(player, skill) {
				player.addMark(skill, 1, false);
			},
			audio: 2,
			trigger: {
				player: "useCardAfter",
			},
			filter(event, player) {
				return event.card && event.card.name == "sha";
			},
			frequent: true,
			prompt2(event, player) {
				let num = player.countMark("yuechuimrfz") > 0 ? player.countMark("yuechuimrfz") : 1;
				return `是否摸${num}张牌？`;
			},
			async content(event, trigger, player) {
				await player.draw(player.countMark("yuechuimrfz") > 0 ? player.countMark("yuechuimrfz") : 1);
				if (player.countMark("yuechuimrfz") < 3 && player.countCards("he", { type: "equip" }) > 0) {
					const { cards } = await player
						.chooseToDiscard("he", card => get.type(card) == "equip")
						.set(
							"prompt",
							`【跃锤】:你可以弃置一张装备牌令‘跃锤’中[]内的数字+1（当前：${player.countMark("yuechuimrfz") > 0 ? player.countMark("yuechuimrfz") : 1}）`
						)
						.set("ai", card => {
							return get.value(card) < 8;
						})
						.forResult();
					if (cards) player.addMark("yuechuimrfz", 1, false);
				}
				let targets = trigger.targets,
					targetx = game.players.slice().filter(i => {
						for (var j of targets) {
							if (get.distance(j, i) == 1 && !targets.includes(i)) return true;
						}
						return false;
					});
				if (targetx) {
					const { targets: targetscs } = await player
						.chooseTarget()
						.set("prompt", `【跃锤】:你可以对${get.translation(targetx)}其中一名角色造成一点伤害`)
						.set("filterTarget", (card, player, target) => {
							return _status.event.targets.includes(target);
						})
						.set("ai", target => {
							return get.damageEffect(target, get.event().player, get.event().player) > 0;
						})
						.set("targets", targetx)
						.forResult();
					if (targetscs) {
						targetscs[0].damage(player);
					}
				}
			},
		},
		fensuimrfz: {
			audio: 2,
			trigger: { global: "dying" },
			forced: true,
			filter: function (event, player) {
				return event.player != player && get.distance(player, event.player) <= 1;
			},
			content: function () {
				player.draw();
				player.line(trigger.player);
			},
		},
		//伺夜
		langqunmrfz: {
			mark: true,
			marktext: "狼群",
			intro: {
				name: "狼群",
				content: "有#个狼",
			},
			audio: 4,
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			forced: true,
			filter: function (event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			content: function () {
				player.addMark("langqunmrfz", 2);
			},
			mod: {
				maxHandcard: function (player, num) {
					if (player.hasMark("langqunmrfz")) return num + 1;
				},
			},
			group: ["langqunmrfz_gainb", "langqunmrfz_damage", "langqunmrfz_discard"],
			subSkill: {
				gainb: {
					audio: "langqunmrfz",
					trigger: {
						player: "loseAfter",
						global: "loseAsyncAfter",
					},
					frequent: true,
					filter: function (event, player) {
						if (event.getlx === false) return false;
						if (player.countMark("langqunmrfz") > 2) return false;
						return !player.hasSkill("langqunmrfz2");
					},
					content: function () {
						player.addMark("langqunmrfz");
						player.addTempSkill("langqunmrfz2");
					},
				},
				damage: {
					audio: "langqunmrfz",
					trigger: { target: "useCardToTargeted" },
					filter: function (event, player) {
						return player.countMark("langqunmrfz") > 0 && get.tag(event.card, "damage");
					},
					prompt: function (event, player) {
						return (
							"你可以移去一个‘狼群’标记并令此牌(" +
							get.translation(event.card) +
							")取消你为目标(剩余‘狼群’数:" +
							player.countMark("langqunmrfz") +
							")"
						);
					},
					content: function () {
						trigger.targets.remove(player);
						trigger.getParent().triggeredTargets2.remove(player);
						trigger.untrigger();
						player.removeMark("langqunmrfz");
					},
				},
				discard: {
					audio: "langqunmrfz",
					forced: true,
					trigger: { player: "phaseDiscardEnd" },
					content: function () {
						var cards = [];
						game.getGlobalHistory("cardMove", function (evt) {
							if (evt.name == "cardsDiscard") {
								if (evt.getParent("phaseDiscard") == trigger) {
									var moves = evt.cards.filterInD("d");
									cards.addArray(moves);
								}
							}
							if (evt.name == "lose") {
								if (evt.type != "discard" || evt.position != ui.discardPile || evt.getParent("phaseDiscard") != trigger) return;
								var moves = evt.cards.filterInD("d");
								cards.addArray(moves);
							}
						});
						player.draw(Math.floor(cards.length / 2) + 1);
					},
				},
			},
		},
		langqunmrfz2: {},
		qunxingmrfz: {
			marktext: "群仇",
			intro: {
				name: "群仇",
				content: "你被狼群盯上了",
			},
			audio: 4,
			trigger: { target: "useCardToTarget" },
			filter: function (event, player) {
				return event.player != player && event.player.countMark("qunxingmrfz") < 6;
			},
			prompt: function (event, player) {
				return "是否令" + get.translation(event.player) + "获得一个‘群仇’标记";
			},
			check: function (event, player) {
				return get.attitude(player, event.player) < 2;
			},
			content: function () {
				trigger.player.addMark("qunxingmrfz");
				player.line(trigger.player);
			},
			mod: {
				targetInRange: function (card, player, target) {
					if (target.hasMark("qunxingmrfz")) {
						return true;
					}
				},
			},
			group: ["qunxingmrfz_damage", "qunxingmrfz_dirhit"],
			subSkill: {
				damage: {
					audio: "qunxingmrfz",
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return event.player.hasMark("qunxingmrfz");
					},
					forced: true,
					content: function () {
						var target = trigger.player;
						player.draw(target.countMark("qunxingmrfz"));
						target.removeAllmark("qunxingmrfz");
					},
				},
				dirhit: {
					audio: "qunxingmrfz",
					forced: true,
					trigger: { player: "useCard" },
					filter: function (event, player) {
						return (
							event.card &&
							(get.type(event.card) == "trick" ||
								(get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name))) &&
							game.hasPlayer(function (current) {
								return current != player && current.hasMark("qunxingmrfz");
							})
						);
					},
					content: function () {
						trigger.directHit.addArray(
							game.filterPlayer(function (current) {
								return current != player && current.hasMark("qunxingmrfz");
							})
						);
						player.line(
							game.filterPlayer(function (current) {
								return current != player && current.hasMark("qunxingmrfz");
							})
						);
					},
					ai: {
						directHit_ai: true,
						skillTagFilter: function (player, tag, arg) {
							return arg.target.hasMark("qunxingmrfz");
						},
					},
				},
			},
			ai: {
				expose: 0.1,
			},
		},
		//百炼嘉维尔
		yixuemrfz: {
			audio: 2,
			trigger: { player: "recoverBegin" },
			forced: true,
			filter: function (event, player) {
				return !player.hasSkill("yixuemrfz2");
			},
			content: function () {
				trigger.num++;
				player.addSkill("yixuemrfz2");
			},
		},
		yixuemrfz2: {
			silent: true,
			firstDo: true,
			charlotte: true,
			trigger: { global: "roundStart" },
			filter: function (event, player) {
				return player.hasSkill("yixuemrfz2");
			},
			content: function () {
				player.removeSkill("yixuemrfz2");
			},
		},
		juximrfz: {
			audio: 2,
			trigger: { player: "useCardToPlayered" },
			filter: function (event, player) {
				if (event.targets.length > 1) return false;
				return event.card.name == "sha" && event.target.countCards("he") > 0;
			},
			direct: true,
			content: function () {
				"step 0";
				var cards = trigger.target.getCards("hej"),
					list = [],
					num = 0;
				for (var i of cards) {
					list.add(get.suit(i, player));
				}
				for (var i of lib.suit) {
					if (list.includes(i)) num++;
				}
				player
					.choosePlayerCard(
						trigger.target,
						"he",
						[1, Math.min(trigger.target.countCards("he"), num)],
						get.prompt("juximrfz", trigger.target) + "(可选" + num + "张牌)"
					)
					.set("forceAuto", true);
				("step 1");
				if (result.bool && result.links.length) {
					var target = trigger.target;
					player.logSkill("juximrfz", target);
					player.addToExpansion(result.cards, "giveAuto", player).gaintag.add("juximrfz2");
					player.addSkill("juximrfz2");
				}
			},
			ai: {
				unequip_ai: true,
				directHit_ai: true,
				skillTagFilter: function (player, tag, arg) {
					if (get.attitude(player, arg.target) > 0) return false;
					if (tag == "directHit_ai") return arg.target.countCards("h") < 2;
					if (arg && arg.name == "sha" && arg.target.getEquip(2)) return true;
					return false;
				},
			},
		},
		juximrfz2: {
			intro: {
				markcount: "expansion",
				mark: function (dialog, storage, player) {
					var cards = player.getExpansions("juximrfz2");
					if (player.isUnderControl(true)) dialog.addAuto(cards);
					else return "共有" + get.cnNumber(cards.length) + "张牌";
				},
			},
			trigger: { player: "useCardAfter" },
			forced: true,
			filter: function (event, player) {
				if (event.card.name != "sha") return false;
				return player.getExpansions("juximrfz2").length > 0;
			},
			content: function () {
				var history = player.getHistory("sourceDamage", function (evt) {
					return evt.card == trigger.card;
				}).length;
				var cards = player.getExpansions("juximrfz2");
				("step 0");
				if (history > 0)
					player.chooseButton(["你可以至多获得两张牌", cards], [0, Math.min(2, cards.length)], true).set("ai", function (button) {
						return get.value(button.link, _status.event.player);
					});
				else
					trigger.targets[0]
						.chooseButton(["你可以至多获得两张牌", cards], [0, Math.min(2, cards.length)], true)
						.set("ai", function (button) {
							return get.value(button.link, _status.event.player);
						});
				("step 1");
				if (result.bool) {
					if (history > 0) player.gain(result.links, "gain2");
					else trigger.targets[0].gain(result.links, "gain2");
				}
				("step 2");
				player.loseToDiscardpile(cards);
				player.removeSkill("juximrfz2");
			},
		},
		conghunmrfz: {
			marktext: "坚韧",
			intro: {
				name: "坚韧",
				content: function (event, player) {
					if (player.storage.conghunmrfz_lose) return "已有" + player.countMark("conghunmrfz") + "个坚韧标记</br>本轮已发动过【丛魂①】";
					return "已有" + player.countMark("conghunmrfz") + "个坚韧标记</br>本轮未发动过【丛魂①】";
				},
			},
			mark: true,
			init: function (player) {
				player.storage.conghunmrfza = -10;
			},
			firstDo: true,
			audio: 2,
			trigger: { global: "roundStart" },
			filter: function (event, player) {
				return !player.hasMark("conghunmrfz") && player.storage.conghunmrfza <= game.roundNumber - 2;
			},
			check: function (event, player) {
				return player.hp < 3 || player.countCards("he") < 4 || player.countCards("h") == 0;
			},
			content: function () {
				player.storage.conghunmrfz_lose = true;
				player.storage.conghunmrfza = game.roundNumber;
			},
			group: ["conghunmrfz_dam", "conghunmrfz_rem", "conghunmrfz_lose"],
			subSkill: {
				dam: {
					audio: "conghunmrfz",
					forced: true,
					charlotte: true,
					trigger: { player: "damageBegin3" },
					filter: function (event, player) {
						return player.storage.conghunmrfz_lose;
					},
					content: function () {
						trigger.num--;
						player.addMark("conghunmrfz");
					},
				},
				rem: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.storage.conghunmrfz_lose && player.storage.conghunmrfza <= game.roundNumber - 1;
					},
					content: function () {
						player.storage.conghunmrfz_lose = false;
					},
				},
				lose: {
					audio: "conghunmrfza",
					trigger: { global: "phaseBegin" },
					filter: function (event, player) {
						return player.hasMark("conghunmrfz") && player.storage.conghunmrfza <= game.roundNumber - 1;
					},
					forced: true,
					charlotte: true,
					content: function () {
						player.loseHp();
						player.removeMark("conghunmrfz");
					},
				},
			},
		},
		conghunmrfza: { audio: 2 },
		//史尔特尔
		yujinmrfz: {
			audio: 2,
			trigger: { player: "dying" },
			unique: true,
			mark: true,
			limited: true,
			skillAnimation: true,
			animationStr: "余烬",
			animationColor: "fire",
			init: function (player) {
				player.storage.yujinmrfz = false;
			},
			filter: function (event, player) {
				return !player.storage.yujinmrfz;
			},
			content: function () {
				player.storage.yujinmrfz = true;
				var next = [
					player.phaseZhunbei(),
					player.phaseJudge(),
					player.phaseDraw(),
					player.phaseUse(),
					player.phaseDiscard(),
					player.phaseJieshu(),
				];
				for (var i = 0; i < next.length; i++) {
					event.next.remove(next[i]);
					trigger.next.push(next[i]);
				}
				player.awakenSkill(event.name);
			},
			group: "yujinmrfz_rec",
			subSkill: {
				rec: {
					audio: "huanghunmrfza",
					trigger: { player: "turnOverAfter" },
					filter: function (event, player) {
						return player.storage.yujinmrfz == true && !player.isTurnedOver();
					},
					forced: true,
					content: function () {
						player.storage.yujinmrfz = false;
					},
				},
			},
		},
		huanghunmrfza: { audio: 2 },
		huanghunmrfz: {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			check: function (event, player) {
				if (player.countCards("he") < 3) return false;
				if (
					player.countCards("j") > 0 &&
					!player.hasCard(function (card) {
						return card.name == "wuxie";
					}, "h")
				)
					return false;
				return player.hasCard(function (card) {
					return card.name == "sha";
				}, "h"); //QQQ
			},
			content: function () {
				"step 0";
				player.chooseToDiscard("he", "【黄昏】:你可以至多弃置两张牌，然后增加等量的体力上限", [0, 2]).set("ai", function (card) {
					return 6 - get.value(card);
				});
				("step 1");
				if (result.bool) {
					player.gainMaxHp(result.cards.length);
				}
				("step 2");
				player.addTempSkill("huanghunmrfz_lose");
				player.addTempSkill("huanghunmrfz_dam");
				player.turnOver();
			},
			subSkill: {
				lose: {
					direct: true,
					charlotte: true,
					trigger: { player: "useCardAfter" },
					filter: function (event, player) {
						return get.tag(event.card, "damage");
					},
					content: function () {
						player.loseMaxHp();
					},
				},
				dam: {
					audio: "huanghunmrfz",
					trigger: { source: "damageBegin" },
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return event.card && event.card.name == "sha";
					},
					content: function () {
						trigger.num++;
					},
					mod: {
						selectTarget: function (card, player, range) {
							if (card.name == "sha" && range[1] != -1) range[1] += 2;
						},
						attackRange: function (player, num) {
							return (num += 2);
						},
					},
				},
			},
		},
		mojianmrfz: {
			audio: 2,
			trigger: { source: "damageEnd" },
			usable: 2,
			filter: function (event, player) {
				return event.nature == "fire" && player.isPhaseUsing();
			},
			content: function () {
				player.draw(2);
			},
			mod: {
				cardnature: function (card, player) {
					if (card.nature != "thunder" && card.name == "sha") return "fire";
					if (card.nature == "thunder" && card.name == "sha") return false;
				},
			},
		},
		//新流明
		fanyuanmrfz: {
			intro: {
				name: "凡人之愿",
				content: "“直到灯火明亮”",
			},
			audio: 2,
			trigger: { global: "useCardToTargeted" },
			filter: function (event, player) {
				if (get.type(event.card) != "delay") return false;
				return game.hasPlayer(function (current) {
					return current.hasMark("fanyuanmrfz");
				});
			},
			direct: true,
			content: function () {
				player.logSkill("fanyuanmrfz");
			},
			global: "fanyuanmrfz_eff",
			subSkill: {
				eff: {
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					firstDo: true,
					filter: function (event, player) {
						return player.hasMark("fanyuanmrfz");
					},
					content: function () {
						player.removeMark("fanyuanmrfz", false);
					},
					mod: {
						targetEnabled: function (card, player, target) {
							if (get.type(card) == "delay" && target.hasMark("fanyuanmrfz")) return false;
						},
					},
				},
			},
		},
		new_weiguangmrfz: {
			mark: true,
			intro: {
				name: "灯火不灭",
				content: function (event, player) {
					return "剩余次数:" + (5 - player.countMark("new_weiguangmrfz"));
				},
			},
			audio: 4,
			trigger: {
				global: ["turnOverAfter", "linkAfter", "addJudgeBefore"],
			},
			filter: function (event, player) {
				if (player.countMark("new_weiguangmrfz") > 4) return false;
				if (event.name == "link") return event.player.isLinked();
				if (event.name == "turnOver") return event.player.isTurnedOver();
				return event.name == "addJudge";
			},
			prompt: function (event, player) {
				return "是否对" + get.translation(event.player) + "发动【微光】(" + (5 - player.countMark("new_weiguangmrfz")) + "/5)？";
			},
			check: function (event, player) {
				var att = get.attitude(player, event.player);
				if (event.player.hasSkill("xinfu_limu") && att > 2 && event.name == "addJudge" && event.player.isPhaseUsing()) return false;
				if (event.player.hasSkill("xinfu_limu") && att < 0 && event.name == "addJudge" && event.player.isPhaseUsing()) return true;
				return att > 2;
			},
			content: function () {
				var target = trigger.player;
				("step 0");
				player.addMark("new_weiguangmrfz", false);
				if (!target.hasMark("fanyuanmrfz")) target.addMark("fanyuanmrfz", false);
				("step 1");
				var num = 3;
				if (target.isLinked()) {
					target.link(false);
					num--;
				}
				if (target.isTurnedOver()) {
					target.turnOver(false);
					num--;
				}
				if (trigger.name == "addJudge" || target.countCards("j") > 0) {
					if (trigger.name == "addJudge") {
						trigger.cancel();
						var owner = get.owner(trigger.card);
						if (owner && owner.getCards("hej").includes(trigger.card)) owner.lose(trigger.card, ui.discardPile);
						else game.cardsDiscard(trigger.card);
						game.log(trigger.card, "进入了弃牌堆");
					}
					target.chooseToDiscard(true, "j", target.countCards("j"));
					num--;
				}
				target.draw(num);
			},
			group: "new_weiguangmrfz_rem",
			subSkill: {
				rem: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.countMark("new_weiguangmrfz") > 0;
					},
					content: function () {
						player.removeMark("new_weiguangmrfz", player.countMark("new_weiguangmrfz"), false);
					},
				},
			},
		},
		yingjimrfz: {
			audio: 2,
			trigger: { global: "useCardToTarget" },
			filter: function (event, player) {
				if (event.target == player) return false;
				if (event.targets.length > 1) return false;
				return get.type(event.card) == "delay" && !player.hasMark("yingjimrfz");
			},
			prompt: function (event, player) {
				return "是否令" + get.translation(event.target) + "回复一点体力并摸一张牌";
			},
			check: function (event, player) {
				return get.attitude(player, event.target) > 2;
			},
			content: function () {
				trigger.targets[0].recover();
				trigger.targets[0].draw();
				player.addMark("yingjimrfz", false);
			},
			group: "yingjimrfz_rem",
			subSkill: {
				rem: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					firstDo: true,
					filter: function (event, player) {
						return player.hasMark("yingjimrfz");
					},
					content: function () {
						player.removeMark("yingjimrfz", false);
					},
				},
			},
		},
		//林
		yinbimrfz: {
			marktext: "壁",
			intro: {
				name: "壁",
				content: "·琉璃壁保护着你</br>·此琉璃壁来源【荫蔽】",
			},
			audio: 2,
			enable: "phaseUse",
			filter: function (event, player) {
				return !player.storage.liuliemrfz && !player.storage.yinbimrfz;
			},
			selectTarget: [1, 2],
			filterTarget: function (card, player, target) {
				return target != player && !target.hasMark("yinbimrfz") && !target.hasMark("zhenzamrfz");
			},
			content: function () {
				player.storage.yinbimrfz = true;
				if (!player.hasSkill("liuliemrfz_rem")) player.addSkill("liuliemrfz_rem");
				for (var i = 0; i < targets.length; i++) {
					if (!targets[i].hasMark("yinbimrfz")) targets[i].addMark("yinbimrfz");
					if (!targets[i].hasSkill("yinbimrfz_rem")) targets[i].addSkill("yinbimrfz_rem");
					if (targets[i].hujia < 1) targets[i].changeHujia();
				}
			},
			subSkill: {
				rem: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					content: function () {
						if (player.hasMark("yinbimrfz")) {
							player.removeMark("yinbimrfz");
							player.changeHujia(-1);
						}
						player.removeSkill("yinbimrfz_rem");
					},
				},
			},
			ai: {
				order: 10,
				expose: 0.3,
				result: {
					player: 1,
					target: 1,
				},
			},
		},
		liuliemrfz: {
			audio: 2,
			trigger: { player: "phaseUseBegin" },
			check: function (event, player) {
				if (
					game.hasPlayer(function (current) {
						return current != player && get.attitude(player, current) > 2;
					})
				)
					return Math.random() > 0.85;
				return true;
			},
			content: function () {
				player.storage.liuliemrfz = true;
				player.addSkill("liuliemrfz_rem");
			},
			subSkill: {
				rem: {
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					content: function () {
						player.storage.liuliemrfz = false;
						player.storage.yinbimrfz = false;
					},
				},
			},
		},
		zhenzamrfz: {
			marktext: "壁",
			intro: {
				name: "壁",
				content: function (event, player) {
					if (player.storage.liuliemrfz) return "·琉璃壁保护着你</br>·【缜匝②】已修改</br>·【荫蔽】已失效";
					return "·琉璃壁保护着你";
				},
			},
			audio: 6,
			derivation: ["zhenzamrfz_rewrite"],
			trigger: { global: "damageEnd" },
			direct: true,
			filter: function (event, player) {
				if (!event.player.hasMark("zhenzamrfz") && !event.player.hasMark("yinbimrfz")) return false;
				return (
					event.hujia &&
					!event.player.hujia &&
					event.player.isIn() &&
					game.hasPlayer(function (current) {
						return current != event.player && event.player.inRangeOf(current);
					})
				);
			},
			content: function () {
				var playerx = trigger.player;
				("step 0");
				if (playerx.hasMark("zhenzamrfz")) playerx.removeMark("zhenzamrfz");
				else playerx.removeMark("yinbimrfz");
				playerx.chooseTarget(
					get.prompt("zhenzamrfz"),
					"你可以随机获得攻击范围内一名其他角色的" + (player.storage.liuliemrfz ? "两张牌" : "一张牌") + "并对其造成一点伤害",
					function (card, target, player) {
						return target != player && player.inRangeOf(target);
					}
				).ai = function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return -get.attitude(trigger.player, target);
				};
				("step 1");
				if (result.bool) {
					var target = result.targets[0],
						cardg = [];
					for (var i = 0; i < (player.storage.liuliemrfz ? 2 : 1); i++) {
						var cardt = target.getCards("he").randomGet();
						if (!cardg.includes(cardt)) cardg.push(cardt);
						else if (target.countCards("he") > 1) i--;
					}
					playerx.gain(cardg, target, "giveAuto", "bySelf");
					target.damage(playerx || "nosource", "nocard");
					//playerx.gainPlayerCard(target,(player.storage.liuliemrfz?2:1),'he',true)
					playerx.logSkill("zhenzamrfz", target);
				}
			},
			group: ["zhenzamrfz_sta", "zhenzamrfz_gt", "zhenzamrfz_gt2", "zhenzamrfz_time1"],
			subSkill: {
				sta: {
					audio: "zhenzamrfz",
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					forced: true,
					locked: false,
					filter: function (event, player) {
						return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h") > 0;
					},
					content: function () {
						player.addMark("zhenzamrfz");
						if (player.hujia < 1) player.changeHujia();
					},
				},
				gt: {
					audio: "zhenzamrfz",
					forced: true,
					trigger: { global: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						if (player.countMark("zhenzamrfz_time1") > 1) return false;
						return !player.hasMark("zhenzamrfz") && !player.hasMark("yinbimrfz");
					},
					content: function () {
						player.addMark("zhenzamrfz");
						player.addMark("zhenzamrfz_time1", false);
						if (player.hujia < 1) player.changeHujia();
					},
				},
				gt2: {
					audio: "zhenzamrfz",
					trigger: { global: "dying" },
					filter: function (event, player) {
						if (player.countMark("zhenzamrfz_time2") > 1) return false;
						if (player.hasMark("zhenzamrfz") || player.hasMark("yinbimrfz")) return false;
						return event.player != player && event.parent.name == "damage" && event.parent.source && event.parent.source == player;
					},
					content: function () {
						player.addMark("zhenzamrfz");
						player.addMark("zhenzamrfz_time2", false);
						if (player.hujia < 1) player.changeHujia();
					},
				},
				time1: {
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					firstDo: true,
					content: function () {
						player.removeMark("zhenzamrfz_time1", player.countMark("zhenzamrfz_time1"), false);
						player.removeMark("zhenzamrfz_time2", player.countMark("zhenzamrfz_time2"), false);
					},
				},
				time2: {},
			},
			ai: {
				threaten: 0.8,
			},
		},
		//多萝西
		gongzhenmrfz: {
			audio: 4,
			forced: true,
			trigger: { player: ["useCardAfter", "respond"] },
			filter: function (event, player) {
				if (!player.isPhaseUsing()) return false;
				if (!event.card.isCard) return false;
				return event.cards && event.cards.length == 1;
			},
			content: function () {
				var cards = player.getCards("h"),
					list = [],
					num = 0;
				for (var i of cards) {
					list.add(get.suit(i, player));
				}
				if (!list.includes(get.suit(trigger.card, player))) player.draw();
				else if (player.countCards("h") > 0) player.chooseToDiscard("h", true, "【共振】:请弃置一张手牌");
			},
		},
		mengxiangmrfz: {
			audio: 2,
			trigger: { player: "drawAfter" },
			filter: function (event, player) {
				if (!player.isPhaseUsing()) return false;
				return event.getParent().name == "gongzhenmrfz";
			},
			direct: true,
			content: function () {
				"step 0";
				player.addMark("mengxiangmrfz", false);
				("step 1");
				if (player.countMark("mengxiangmrfz") % 2 == 0 && player.hasMark("mengxiangmrfz")) {
					player.addTempSkill("mengxiangmrfz_eff", {
						player: "phaseEnd",
					});
					player.removeMark("mengxiangmrfz", 2, false);
					if (player.countMark("mengxiangmrfz") > 0) event.redo();
				}
			},
			group: "mengxiangmrfz_rem",
			subSkill: {
				rem: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return player.hasMark("mengxiangmrfz");
					},
					content: function () {
						player.removeMark("mengxiangmrfz", player.countMark("mengxiangmrfz"), false);
					},
				},
				eff: {
					audio: "mengxiangmrfz",
					trigger: { player: ["useCard1", "respond"] },
					forced: true,
					charlotte: true,
					content: function () {
						player.removeSkill("mengxiangmrfz_eff");
					},
					mod: {
						cardUsable: function (card) {
							return Infinity;
						},
						targetInRange: function (card) {
							return true;
						},
					},
					mark: true,
					intro: {
						content: "下一张使用或打出的牌无次数和距离限制",
					},
				},
			},
		},
		paizhangmrfz: {
			global: "paizhangmrfz_tag4",
			audio: 4,
			trigger: { player: "loseAfter" },
			filter: function (event, player) {
				if (event.type != "discard" || event.getlx === false || event.getParent(3).name != "gongzhenmrfz") return false;
				for (var card of event.cards) {
					if (get.position(card, true) == "d") return true;
				}
				return false;
			},
			content: function () {
				"step 0";
				if (trigger.cards.length) {
					player.chooseTarget(get.prompt("paizhangmrfz"), "你可以将此牌交给一名其他角色", function (card, target, player) {
						return target != player && !target.hasSkill("paizhangmrfz2");
					}).ai = function (target) {
						return -get.attitude(player, target);
					};
				}
				("step 1");
				if (result.bool) {
					result.targets[0].gain(trigger.cards, "gain2").gaintag = ["paizhangmrfz"];
					result.targets[0].addTempSkill("paizhangmrfz2");
					player.logSkill("paizhangmrfz");
				}
				("step 2");
				for (i of trigger.cards) {
					i.storage.paizhangmrfz = true;
				}
			},
			group: ["paizhangmrfz_tag1", "paizhangmrfz_tag2", "paizhangmrfz_tag3"],
			subSkill: {
				tag1: {
					direct: true,
					firstDo: true,
					charlotte: true,
					trigger: {
						global: "useCard",
					},
					filter: function (event, player) {
						for (var i = 0; i < event.cards.length; i++) {
							if (event.cards[i].storage && event.cards[i].storage.paizhangmrfz) return true;
						}
						return false;
					},
					content: function () {
						var cards = trigger.cards[0];
						if (trigger.cards.length > 1 || cards.number == undefined) {
							trigger.player.damage();
							player.logSkill("paizhangmrfz", trigger.player);
						} else if (cards.number > 8) {
							trigger.player.damage();
							player.logSkill("paizhangmrfz", trigger.player);
						} else {
							trigger.player.chooseToDiscard(
								"he",
								Math.floor(cards.number / 3),
								"【排障】:请弃置" + Math.floor(cards.number / 3) + "张牌",
								true
							);
							player.logSkill("paizhangmrfz", trigger.player);
						}
					},
				},
				tag2: {
					direct: true,
					firstDo: true,
					charlotte: true,
					trigger: {
						target: "useCardToTarget",
						player: "addJudgeBefore",
					},
					filter: function (event, player) {
						for (var i = 0; i < event.cards.length; i++) {
							if (event.cards[i].storage && event.cards[i].storage.paizhangmrfz) return true;
						}
						return false;
					},
					content: function () {
						"step 0";
						if (trigger.name == "addJudge") {
							trigger.cancel();
							var owner = get.owner(trigger.card);
							if (owner && owner.getCards("hej").includes(trigger.card)) owner.lose(trigger.card, ui.discardPile);
							else game.cardsDiscard(trigger.card);
							game.log(trigger.card, "进入了弃牌堆");
						} else trigger.getParent().targets.remove(player);
						("step 1");
						var trgnext = trigger.player.getNext(),
							trgprvs = trigger.player.getPrevious();
						if (
							trgnext != player &&
							trgnext.hasCard(function (card) {
								return card.storage && card.storage.paizhangmrfz;
							}, "h")
						) {
							var cards = trgnext.getCards("h", function (card) {
								return card.storage && card.storage.paizhangmrfz;
							});
							player.logSkill("paizhangmrfz", trgnext);
							trgnext.damage();
							game.cardsDiscard(cards);
							game.log(cards, "进入了弃牌堆");
						}
						if (
							trgprvs != player &&
							trgprvs.hasCard(function (card) {
								return card.storage && card.storage.paizhangmrfz;
							}, "h")
						) {
							var cards = trgprvs.getCards("h", function (card) {
								return card.storage && card.storage.paizhangmrfz;
							});
							player.logSkill("paizhangmrfz", trgprvs);
							trgprvs.damage();
							game.cardsDiscard(cards);
							game.log(cards, "进入了弃牌堆");
						}
					},
				},
				tag3: {
					direct: true,
					charlotte: true,
					trigger: { global: "useCardToPlayered" },
					filter: function (event, player) {
						if (event.player == player) return false;
						if (
							!event.player.hasCard(function (card) {
								return card.storage && card.storage.paizhangmrfz;
							}, "h")
						)
							return false;
						for (var i = 0; i < event.cards.length; i++) {
							if (event.cards[i].storage && event.cards[i].storage.paizhangmrfz) return false;
						}
						for (var i = 0; i < event.targets.length; i++) {
							if (event.targets[i] == player) return true;
						}
					},
					content: function () {
						"step 0";
						var cards = trigger.player.getCards("h", function (card) {
							return card.storage && card.storage.paizhangmrfz;
						});
						event.cards = cards;
						game.cardsDiscard(cards);
						game.log(cards, "进入了弃牌堆");
						player.logSkill("paizhangmrfz", trigger.player);
						if (trigger.name == "addJudge") {
							trigger.cancel();
							var owner = get.owner(trigger.card);
							if (owner && owner.getCards("hej").includes(trigger.card)) owner.lose(trigger.card, ui.discardPile);
							else game.cardsDiscard(trigger.card);
							game.log(trigger.card, "进入了弃牌堆");
						} else trigger.getParent().targets.remove(player);
						("step 1");
						if (event.cards.length > 1 || event.cards.number == undefined) {
							trigger.player.damage();
							player.logSkill("paizhangmrfz", trigger.player);
						} else if (event.cards.number > 8) {
							trigger.player.damage();
							player.logSkill("paizhangmrfz", trigger.player);
						} else {
							trigger.player.chooseToDiscard(
								"he",
								Math.floor(cards.number / 3),
								"【排障】:请弃置" + Math.floor(cards.number / 3) + "张牌",
								true
							);
							player.logSkill("paizhangmrfz", trigger.player);
						}
						("step 2");
						var trgnext = trigger.player.getNext(),
							trgprvs = trigger.player.getPrevious();
						if (
							trgnext.hasCard(function (card) {
								return card.storage && card.storage.paizhangmrfz;
							}, "h")
						) {
							var cards = trgnext.getCards("h", function (card) {
								return card.storage && card.storage.paizhangmrfz;
							});
							player.logSkill("paizhangmrfz", trgnext);
							trgnext.damage();
							game.cardsDiscard(cards);
							game.log(cards, "进入了弃牌堆");
						}
						if (
							trgprvs.hasCard(function (card) {
								return card.storage && card.storage.paizhangmrfz;
							}, "h")
						) {
							var cards = trgprvs.getCards("h", function (card) {
								return card.storage && card.storage.paizhangmrfz;
							});
							player.logSkill("paizhangmrfz", trgprvs);
							trgprvs.damage();
							game.cardsDiscard(cards);
							game.log(cards, "进入了弃牌堆");
						}
					},
				},
				tag4: {
					charlotte: true,
					mod: {
						cardDiscardable: function (card, player) {
							if (card.storage && card.storage.paizhangmrfz) return false;
						},
					},
				},
			},
		},
		paizhangmrfz2: { charlotte: true },
		//空弦
		tiexianmrfz: {
			mod: {
				maxHandcard: function (player, num) {
					if (!player.hujia) return num + 1;
				},
			},
			audio: 2,
			forced: true,
			trigger: { player: "damageEnd" },
			filter: function (event, player) {
				return event.hujia;
			},
			content: function () {
				player.draw(3);
			},
			group: ["tiexianmrfz_draw", "tiexianmrfz_k"],
			subSkill: {
				ban: {
					charlotte: true,
				},
				k: {
					mod: {
						cardnumber(card) {
							if (card.hasGaintag("tiexianmrfz")) return 13;
						},
					},
					charlotte: true,
					direct: true,
					trigger: { player: "gainAfter" },
					filter(event, player) {
						return !player.hujia && !player.hasSkill("tiexianmrfz_ban");
					},
					content() {
						player.addTempSkill("tiexianmrfz_ban", {
							global: "roundStart",
						});
						for (var i of trigger.cards) {
							i.addGaintag("tiexianmrfz");
						}
					},
				},
				draw: {
					audio: "tiexianmrfz",
					forced: true,
					trigger: { player: "phaseDrawBegin2" },
					filter: function (event, player) {
						return !player.hujia;
					},
					content: function () {
						trigger.num++;
					},
				},
			},
		},
		lieshimrfz: {
			audio: 2,
			usable: 3,
			trigger: { player: "useCardToPlayered" },
			filter: function (event, player) {
				if (event.card.name != "sha" || !event.targets || event.targets.length > 1) return false;
				return (
					player.countCards("he") > 0 &&
					game.hasPlayer(function (current) {
						return current != player && get.distance(event.targets[0], current) <= 1 && !event.targets.includes(current);
					})
				);
			},
			direct: true,
			content: function () {
				"step 0";
				player
					.chooseToDiscard(
						"he",
						get.prompt("lieshimrfz"),
						"你可以弃置一张牌并选择一名与" + get.translation(trigger.targets[0]) + "距离为1的其他角色视为使用一张【杀】"
					)
					.set(
						"goon",
						game.hasPlayer(function (current) {
							var target = trigger.targets[0];
							return get.distance(target, current) == 1 && get.attitude(player, current) < 2;
						})
					)
					.set("ai", function (card) {
						if (_status.event.goon) return 6 - get.value(card);
						return 0;
					});
				("step 1");
				if (result.cards) {
					player.chooseTarget(
						true,
						"请选择一名与" + get.translation(trigger.targets[0]) + "距离为1的一名其他角色",
						function (card, player, target) {
							var evt = _status.event.getTrigger();
							return (
								target != player &&
								target != evt.targets[0] &&
								get.distance(evt.targets[0], target) <= 1 &&
								lib.filter.targetEnabled2(evt.card, player, target)
							);
						}
					).ai = function (target) {
						return -get.attitude(player, target);
					};
				} else event.finish();
				("step 2");
				if (result.bool) {
					player.useCard({ name: "sha", isCard: true }, result.targets[0]);
					player.logSkill("lieshimrfz");
				}
			},
		},
		//麒麟夜刀
		guirenmrfz: {
			audio: 2,
			trigger: { player: "useCardToTargeted" },
			filter: function (event, player) {
				if (!player.isPhaseUsing()) return false;
				if (player.getHandcardLimit() == 0) return false;
				return event.card.name == "sha";
			},
			prompt: function (event, player) {
				return "你可以令此【杀】额外结算一次，然后本回合的手牌上限-1。(当前手牌上限:" + player.getHandcardLimit() + ")";
			},
			content: function () {
				trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
				trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
				if (!player.hasSkill("guirenmrfz2")) player.addTempSkill("guirenmrfz2");
				if (!player.hasSkill("guirenmrfz_lose")) player.addTempSkill("guirenmrfz_lose");
				player.storage.guirenmrfz2++;
			},
			subSkill: {
				lose: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseUseEnd" },
					content: function () {
						player.removeSkill("guirenmrfz");
						player.addSkill("guiqiangmrfz");
					},
				},
			},
		},
		guirenmrfz2: {
			silent: true,
			charlotte: true,
			firstDo: true,
			trigger: { player: "phaseAfter" },
			init: function (player) {
				player.storage.guirenmrfz2 = 0;
			},
			content: function () {
				player.storage.guirenmrfz2 = 0;
			},
			mod: {
				maxHandcard: function (player, num) {
					return num - player.storage.guirenmrfz2;
				},
			},
		},
		guiqiangmrfz: {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			frequent: true,
			content: function () {
				"step 0";
				player.drawTo(Math.min(player.maxHp, 4));
				player.chooseToDiscard(get.prompt("guiqiangmrfz"), "你可以弃置一张牌并失去此技能，然后获得【鬼人】", "he").set("ai", function (card) {
					return 6 - get.value(card);
				});
				("step 1");
				if (result.cards) {
					player.removeSkill("guiqiangmrfz");
					player.addSkill("guirenmrfz");
				}
			},
		},
		luanwumrfz: {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			derivation: ["guiqiangmrfz", "guirenmrfz"],
			check: function (event, player) {
				if (
					player.countCards("h", function (card) {
						return get.type2(card) == "trick" || get.tag(card, "damage");
					}) > 2
				)
					return false;
				if (player.getHandcardLimit() > 2) return false;
				return game.hasPlayer(function (current) {
					return current != player && player.inRange(current) && get.attitude(player.current) < 0;
				});
			},
			filter: function (event, player) {
				if (
					!game.hasPlayer(function (current) {
						return current != player && player.inRange(current);
					})
				)
					return false;
				return player.hasSkill("guirenmrfz");
			},
			content: function () {
				"step 0";
				player.chooseTarget(true, "【乱舞】:请选择一名其他角色，视为对其使用一张结算三次的【杀】", function (card, player, target) {
					return target != player && player.inRange(target);
				}).ai = function (target) {
					return -get.attitude(player, target);
				};
				("step 1");
				if (result.bool) {
					var target = result.targets[0];
					player.addTempSkill("luanwumrfza", {
						player: "shaAfter",
					});
					player.useCard({ name: "sha", isCard: true }, result.targets[0]);
				}
				("step 2");
				player.skip("phaseUse");
				player.skip("phaseDraw");
				player.skip("phaseJudge");
				if (!player.hasSkill("luanwumrfz_dam")) player.addSkill("luanwumrfz_dam");
			},
			group: "luanwumrfz_add",
			subSkill: {
				dam: {
					mark: true,
					intro: {
						content: "受到的伤害+1",
					},
					direct: true,
					charlotte: true,
					trigger: { player: "damageBegin" },
					content: function () {
						trigger.num++;
						player.removeSkill("luanwumrfz_dam");
					},
				},
				add: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseUseBegin" },
					content: function () {
						player.addSkill("guirenmrfz");
						player.removeSkill("luanwumrfz_add");
					},
				},
			},
		},
		luanwumrfza: {
			audio: 2,
			direct: true,
			trigger: { player: "useCardToTargeted" },
			filter: function (event, player) {
				return event.card.name == "sha";
			},
			content: function () {
				"step 0";
				event.num = 2;
				("step 1");
				event.num--;
				player.logSkill("luanwumrfza");
				trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
				trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
				if (event.num > 0) event.redo();
				("step 2");
				player.removeSkill("luanwumrfza");
			},
		},
		//土豆雷（划掉） 伊内丝
		yingzhimrfz: {
			mark: true,
			intro: {
				content: function (event, player) {
					var str = "·摸牌阶段摸牌数+" + player.countMark("yingzhimrfz_draw") + "</br>·手牌上限+" + player.countMark("yingzhimrfz_mhand");
					str = str + "</br>·使用【杀】的次数+" + player.countMark("yingzhimrfz_sha");
					if (!player.hasMark("yingzhimrfz_dying")) return str;
					return str + "</br>·下次造成的伤害+1";
				},
			},
			audio: 6,
			silent: true,
			firstDo: true,
			trigger: { global: "roundStart" },
			content: function () {
				game.countPlayer(function (current) {
					if (current != player) current.storage.yingzhimrfz_draw = false;
					if (current != player) current.storage.yingzhimrfz_mhand = false;
					if (current != player) current.storage.yingzhimrfz_sha = false;
					if (current != player) current.storage.yingzhimrfz_dying = false;
				});
			},
			group: ["yingzhimrfz_draw", "yingzhimrfz_drbuff", "yingzhimrfz_mhand", "yingzhimrfz_sha", "yingzhimrfz_dying", "yingzhimrfz_dybuff"],
			subSkill: {
				//标记
				mark: {
					mark: true,
					charlotte: true,
					intro: {
						content: function (event, player) {
							var str =
								"·摸牌阶段摸牌数-" +
								player.countMark("yingzhimrfz_drdebuff") +
								"</br>·手牌上限-" +
								player.countMark("yingzhimrfz_mhddebuff");
							str = str + "</br>·使用【杀】的次数-" + player.countMark("yingzhimrfz_shadebuff");
							if (!player.hasSkill("yingzhimrfz_dydebuff")) return str;
							return str + "</br>·下次造成的伤害-1";
						},
					},
				},
				//非延时锦囊牌 摸牌阶段摸牌数
				draw: {
					audio: "yingzhimrfz",
					trigger: { player: "useCardToTargeted" },
					filter: function (event, player) {
						if (event.targets.length > 1) return false;
						if (event.target.storage.yingzhimrfz_draw) return false;
						return get.type(event.card) == "trick" && event.target != player;
					},
					check: function (event, player) {
						return get.attitude(player, event.target) < 2;
					},
					prompt: function (event, player) {
						return "是否令" + get.translation(event.target) + "下个摸牌阶段摸牌数-1且你摸牌阶段摸牌数+1？";
					},
					content: function () {
						if (player.countMark("yingzhimrfz_draw") < 2) player.addMark("yingzhimrfz_draw", false);
						trigger.targets[0].storage.yingzhimrfz_draw = true;
						trigger.targets[0].addSkill("yingzhimrfz_drdebuff");
						trigger.targets[0].addMark("yingzhimrfz_drdebuff", false);
						trigger.targets[0].addSkill("yingzhimrfz_mark");
					},
				},
				drbuff: {
					audio: "yingzhimrfz",
					forced: true,
					charlotte: true,
					trigger: { player: "phaseDrawBegin" },
					filter: function (event, player) {
						return player.hasMark("yingzhimrfz_draw");
					},
					content: function () {
						trigger.num += player.countMark("yingzhimrfz_draw");
					},
				},
				drdebuff: {
					audio: "yingzhimrfz",
					trigger: { player: "phaseDrawBegin" },
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return player.hasMark("yingzhimrfz_drdebuff");
					},
					content: function () {
						trigger.num -= player.countMark("yingzhimrfz_drdebuff");
						player.removeMark("yingzhimrfz_drdebuff", player.countMark("yingzhimrfz_drdebuff"), false);
						player.removeSkill("yingzhimrfz_drdebuff");
						if (
							!player.hasMark("yingzhimrfz_mhddebuff") &&
							!player.hasMark("yingzhimrfz_shadebuff") &&
							!player.hasSkill("yingzhimrfz_dydebuff")
						)
							player.removeSkill("yingzhimrfz_mark");
					},
				},
				//其他角色响应你的牌 手牌上限
				mhand: {
					audio: "yingzhimrfz",
					trigger: { global: ["respond", "useCard"] },
					filter: function (event, player) {
						if (!event.respondTo) return false;
						if (event.player == player) return false;
						if (player != event.respondTo[0]) return false;
						return !event.player.storage.yingzhimrfz_mhand;
					},
					check: function (event, player) {
						return get.attitude(player, event.player) < 2;
					},
					prompt: function (event, player) {
						return "是否令" + get.translation(event.player) + "的下个回合手牌上限-1且你的手牌上限+1？";
					},
					content: function () {
						if (player.countMark("yingzhimrfz_mhand") < 3) player.addMark("yingzhimrfz_mhand", false);
						trigger.player.addMark("yingzhimrfz_mhddebuff", false);
						trigger.player.storage.yingzhimrfz_mhand = true;
						trigger.player.addSkill("yingzhimrfz_mhddebuff");
						trigger.player.addSkill("yingzhimrfz_mark");
					},
					mod: {
						maxHandcard: function (player, num) {
							return num + player.countMark("yingzhimrfz_mhand");
						},
					},
				},
				mhddebuff: {
					charlotte: true,
					silent: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return player.hasMark("yingzhimrfz_mhddebuff");
					},
					content: function () {
						player.removeMark("yingzhimrfz_mhddebuff", player.countMark("yingzhimrfz_mhddebuff"), false);
						player.removeSkill("yingzhimrfz_mhddebuff");
						if (
							!player.hasMark("yingzhimrfz_drdebuff") &&
							!player.hasMark("yingzhimrfz_shadebuff") &&
							!player.hasSkill("yingzhimrfz_dydebuff")
						)
							player.removeSkill("yingzhimrfz_mark");
					},
					mod: {
						maxHandcard: function (player, num) {
							return num - player.countMark("yingzhimrfz_mhddebuff");
						},
					},
				},
				//进入濒死 伤害+1
				dying: {
					audio: "yingzhimrfz",
					trigger: { global: "dying" },
					filter: function (event, player) {
						if (event.player.storage.yingzhimrfz_dying) return false;
						if (event.player.hasSkill("yingzhimrfz_dydebuff") && player.hasMark("yingzhimrfz_dying")) return false;
						return event.player != player && event.parent.name == "damage" && event.parent.source && event.parent.source == player;
					},
					check: function (event, player) {
						return get.attitude(player, event.player) < 2;
					},
					prompt: function (event, player) {
						return "是否令" + get.translation(event.player) + "下次造成的伤害-1且你下次造成的伤害+1？";
					},
					content: function () {
						if (!player.hasMark("yingzhimrfz_dying")) player.addMark("yingzhimrfz_dying", false);
						if (!trigger.player.hasSkill("yingzhimrfz_dydebuff")) {
							trigger.player.addSkill("yingzhimrfz_dydebuff", false);
							trigger.player.addSkill("yingzhimrfz_mark");
							trigger.player.storage.yingzhimrfz_dying = true;
						}
					},
				},
				dybuff: {
					audio: "yingzhimrfz",
					forced: true,
					charlotte: true,
					trigger: { source: "damageBegin" },
					filter: function (event, player) {
						return player.hasMark("yingzhimrfz_dying");
					},
					content: function () {
						trigger.num++;
						player.removeMark("yingzhimrfz_dying", false);
					},
				},
				dydebuff: {
					audio: "yingzhimrfz",
					forced: true,
					charlotte: true,
					trigger: { source: "damageBegin" },
					content: function () {
						trigger.num--;
						player.removeSkill("yingzhimrfz_dydebuff");
						if (
							!player.hasMark("yingzhimrfz_drdebuff") &&
							!player.hasMark("yingzhimrfz_mhddebuff") &&
							!player.hasMark("yingzhimrfz_shadebuff")
						)
							player.removeSkill("yingzhimrfz_mark");
					},
				},
				//你响应其他角色牌 使用杀的次数
				sha: {
					audio: "yingzhimrfz",
					trigger: { player: ["useCard", "respond"] },
					filter: function (event, player) {
						if (!Array.isArray(event.respondTo)) return false;
						if (player == event.respondTo[0]) return false;
						return !event.player.storage.sha;
					},
					check: function (event, player) {
						return get.attitude(player, event.respondTo[0]) < 2;
					},
					prompt: function (event, player) {
						return "是否令" + get.translation(event.respondTo[0]) + "的下个回合使用【杀】的次数-1且你使用【杀】的次数+1？";
					},
					content: function () {
						var target = trigger.respondTo[0];
						target.addMark("yingzhimrfz_shadebuff", false);
						target.addSkill("yingzhimrfz_shadebuff");
						target.addSkill("yingzhimrfz_mark");
						target.storage.yingzhimrfz_sha = true;
						player.addMark("yingzhimrfz_sha", false);
						player.addSkill("yingzhimrfz_sharem");
					},
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + player.countMark("yingzhimrfz_sha");
						},
					},
				},
				sharem: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseUseEnd" },
					content: function () {
						player.removeMark("yingzhimrfz_sha", player.countMark("yingzhimrfz_sha"), false);
						player.removeSkill("yingzhimrfz_sharem");
					},
				},
				shadebuff: {
					charlotte: true,
					silent: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return player.hasMark("yingzhimrfz_shadebuff");
					},
					content: function () {
						player.removeMark("yingzhimrfz_shadebuff", player.countMark("yingzhimrfz_shadebuff"), false);
						player.removeSkill("yingzhimrfz_shadebuff");
						if (
							!player.hasMark("yingzhimrfz_drdebuff") &&
							!player.hasMark("yingzhimrfz_mhddebuff") &&
							!player.hasSkill("yingzhimrfz_dydebuff")
						)
							player.removeSkill("yingzhimrfz_mark");
					},
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num - player.countMark("yingzhimrfz_shadebuff");
						},
					},
				},
			},
			ai: {
				threaten: 1.1,
				expose: 0.1,
			},
		},
		yingshaomrfz: {
			audio: 2,
			trigger: { player: "dyingAfter" },
			filter: function (event, player) {
				return event.parent.name == "damage" && event.parent.source;
			},
			check: function (event, player) {
				return get.attitude(player, event.parent.source) < 2;
			},
			prompt: function (event, player) {
				return "是否令" + get.translation(event.parent.source) + "获得‘影哨’标记？";
			},
			content: function () {
				trigger.parent.source.addSkill("yingshaomrfz_ban");
			},
			group: "yingshaomrfz_dying",
			subSkill: {
				ban2: {
					charlotte: true,
					mod: {
						cardEnabled: function (card) {
							if (card.name == "sha") return false;
						},
					},
				},
				ban: {
					mark: true,
					intro: {
						content: function (event, player) {
							if (player.hasSkill("yingshaomrfz_ban2")) return "·手牌上限-1</br>·本出牌阶段不能使用【杀】";
							return "·手牌上限-1</br>·使用【杀】的次数至多为1";
						},
					},
					charlotte: true,
					forced: true,
					popup: false,
					trigger: { player: "useCardAfter" },
					filter: function (event, player) {
						if (!player.isPhaseUsing()) return false;
						return event.card.name == "sha";
					},
					content: function () {
						player.addTempSkill("yingshaomrfz_ban2", {
							player: "phaseUseEnd",
						});
					},
					mod: {
						maxHandcard: function (player, num) {
							return num - 1;
						},
					},
				},
				dying: {
					audio: "yingshaomrfz",
					forced: true,
					charlotte: true,
					trigger: { player: "dying" },
					filter: function (event, player) {
						return game.hasPlayer(function (current) {
							return current.hasSkill("yingshaomrfz_ban");
						});
					},
					content: function () {
						game.countPlayer(function (current) {
							if (current.hasSkill("yingshaomrfz_ban")) {
								current.removeSkill("yingshaomrfz_ban");
								if (current.hasSkill("yingshaomrfz_ban2")) current.removeSkill("yingshaomrfz_ban2");
								current.damage(player);
							}
						});
						player.recover(2 - player.hp);
						player.removeSkill("yingshaomrfz");
					},
				},
			},
			ai: {
				expose: 0.2,
			},
		},
		//缪尔赛思
		kaiyuanmrfz: {
			audio: 2,
			trigger: {
				global: "roundStart",
			},
			firstDo: true,
			filter: function (event, player) {
				return game.roundNumber == 1;
			},
			direct: true,
			content: function () {
				"step 0";
				player.chooseTarget("【开源】:请选择一名角色令其摸两张牌且本局游戏使用【杀】的次数+1，若该角色是你，你摸一张牌", true).ai = function (
					target
				) {
					return get.attitude(player, target) > 0;
				};
				("step 1");
				if (result.bool) {
					var target = result.targets[0];
					target.draw(2);
					target.addSkill("kaiyuanmrfz_buff");
					if (target == player) {
						player.draw();
						player.logSkill("kaiyuanmrfz");
					} else player.logSkill("kaiyuanmrfz", target);
				}
			},
			subSkill: {
				buff: {
					mark: true,
					intro: {
						content: "使用【杀】的次数+1",
					},
					charlotte: true,
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + 1;
						},
					},
				},
			},
		},
		jingshuimrfz: {
			mark: true,
			intro: {
				content: function (event, player) {
					return (
						"·你的攻击范围:" +
						player.getAttackRange() +
						"</br>·你使用【杀】的次数:" +
						player.getCardUsable("sha") +
						"</br>·你的手牌上限:" +
						player.getHandcardLimit()
					);
				},
			},
			audio: 3,
			trigger: { global: "roundStart" },
			direct: true,
			content: function () {
				"step 0";
				var str = "【净水】:你可选择一名其他角色，你将你的手牌数、手牌上限、攻击范围和使用【杀】的次数调整至与其一致";
				player.chooseTarget(get.prompt("jingshuimrfz"), str, function (card, player, target) {
					return target != player;
				}).ai = function (target) {
					return target.isMaxHandcard();
				};
				("step 1");
				if (result.bool) {
					var target = result.targets[0];
					var numsha = target.getCardUsable("sha");
					var numatt = target.getAttackRange();
					var numhand = target.getHandcardLimit();
					player.logSkill("jingshuimrfz", target);
					//摸牌
					if (player.countCards("h") <= target.countCards("h")) player.drawTo(target.countCards("h"));
					//杀
					player.removeMark("jingshuimrfz_sha", player.countMark("jingshuimrfz_sha"), false);
					player.addMark("jingshuimrfz_sha", numsha, false);
					//攻击距离
					player.removeMark("jingshuimrfz_att", player.countMark("jingshuimrfz_att"), false);
					player.addMark("jingshuimrfz_att", numatt, false);
					//手牌上限
					player.removeMark("jingshuimrfz_maxhand", player.countMark("jingshuimrfz_maxhand"), false);
					player.addMark("jingshuimrfz_maxhand", numhand, false);
				}
			},
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha" && player.hasMark("jingshuimrfz_sha")) return (num = player.countMark("jingshuimrfz_sha"));
				},
				attackRangeBase: function (player, num) {
					if (player.hasMark("jingshuimrfz_att")) return (num = player.countMark("jingshuimrfz_att"));
				},
				maxHandcard: function (player, num) {
					if (player.hasMark("jingshuimrfz_maxhand")) return (num = player.countMark("jingshuimrfz_maxhand"));
				},
			},
			subSkill: {
				sha: {
					charlotte: true,
				},
				att: {
					charlotte: true,
				},
				maxhand: {
					charlotte: true,
				},
			},
		},
		liuxingmrfz: {
			audio: 2,
			trigger: {
				player: "damageBegin",
			},
			usable: 1,
			forced: true,
			filter: function (event, player) {
				return player.countCards("h") >= player.hp && event.nature != "thunder";
			},
			content: function () {
				trigger.cancel();
			},
		},
		//黑键
		yiyinmrfz: {
			audio: 2,
			chargeSkill: true,
			enable: "phaseUse",
			filter: function (event, player) {
				if (player.countMark("charge") > 2) return false;
				return player.hasCard(function (card) {
					return get.tag(card, "damage");
				}, "h");
			},
			filterCard: function (card) {
				return get.tag(card, "damage");
			},
			selectCard: function () {
				var player = _status.event.player;
				return [1, 3 - player.countMark("charge")];
			},
			check: function (card) {
				var player = _status.event.player;
				if (
					player.countCards(function (card) {
						return card.name == "sha";
					}) >
					player.getCardUsable("sha") + 1
				)
					return true;
				return card.name != "sha";
			},
			content: function () {
				player.addMark("charge", cards.length);
			},
			ai: {
				threaten: function (event, player) {
					return 0.85 + player.countMark("charge") * 0.1;
				},
				order: 13,
				result: {
					player: 1,
				},
			},
			group: ["yiyinmrfz_sha", "yiyinmrfz_get"],
			subSkill: {
				sha: {
					audio: "yiyinmrfz",
					trigger: { player: "useCard" },
					filter: function (event, player) {
						if (player.countMark("charge") == 0) return false;
						return event.card && event.card.name == "sha" && !player.storage.jiyinmrfz;
					},
					prompt: "你可以消耗一点蓄力值令此【杀】的伤害基数+1",
					content: function () {
						if (!trigger.baseDamage) trigger.baseDamage = 1;
						trigger.baseDamage++;
						player.removeMark("charge");
					},
				},
				get: {
					silent: true,
					charlotte: true,
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					filter: function (event, player) {
						return event.name != "phase" || game.phaseNumber == 0;
					},
					content: function () {
						player.addMark("charge");
					},
				},
			},
		},
		huangxiangmrfz: {
			audio: 2,
			trigger: { player: "phaseDiscardEnd" },
			filter: function (event, player) {
				if (
					player.hasCard(function (card) {
						return card.hasGaintag("huangxiangmrfzx");
					}, "h")
				)
					return false;
				return player.countMark("charge") > 0 && player.countCards("h") > 0;
			},
			direct: true,
			content: function () {
				"step 0";
				player.chooseCard(get.prompt("huangxiangmrfz"), "你可以消耗一点蓄力值并标记一张手牌", "h").set("ai", function (card) {
					if (card.name == "shan" && card.name == "wuxie") return 6;
					if (card.name == "sha" && card.name == "tao" && card.name == "jiu") return 5;
					return 6 - get.value(card);
				});
				("step 1");
				if (result.bool) {
					player.logSkill("huangxiangmrfz");
					player.addGaintag(result.cards, "huangxiangmrfzx");
					player.removeMark("charge");
				}
			},
			group: "huangxiangmrfz_lose",
			subSkill: {
				lose: {
					trigger: {
						player: ["loseAfter", "damageEnd"],
					},
					filter: function (event, player) {
						if (event.name == "damage")
							return player.hasCard(function (card) {
								return card.hasGaintag("huangxiangmrfzx");
							}, "h");
						if (event.name == "lose") {
							for (var i in event.gaintag_map) {
								if (event.gaintag_map[i].includes("huangxiangmrfzx")) return true;
							}
							return false;
						}
						return false;
					},
					content: function () {
						"step 0";
						var history = game.getAllGlobalHistory("useCard");
						for (var i = history.length - 1; i > 0; i--) {
							if (!history[i].targets) continue;
							if (history[i].targets.includes(player) && history[i].player != player) {
								event.targets = history[i].player;
								break;
							}
						}
						player
							.chooseControl(
								event.targets ? ["摸牌", "对" + get.translation(event.targets) + "造成一点伤害", "cancel2"] : ["摸牌", "cancel2"]
							)
							.set("ai", function () {
								var player = _status.event.player;
								if (event.targets) {
									if (get.damageEffect(event.targets, player, player) > 0) return 1;
									return 0;
								} else return 0;
							})
							.set("prompt", "【荒响】:请选择一项");
						("step 1");
						if (result.control != "cancel2") {
							player.logSkill("huangxiangmrfz");
							if (result.control == "摸牌") {
								player.draw();
								if (player.countMark("charge") < 3) player.addMark("charge");
							} else event.targets.damage();
						} else event.finish();
						("step 2");
						if (
							!player.hasCard(function (card) {
								return card.hasGaintag("huangxiangmrfzx");
							}, "h") &&
							player.countMark("charge") > 0
						) {
							player.chooseCard(get.prompt("huangxiangmrfz"), "你可以消耗一点蓄力值并标记一张手牌", "h").set("ai", function (card) {
								if (card.name == "shan" && card.name == "wuxie") return 6;
								if (card.name == "sha" && card.name == "tao" && card.name == "jiu") return 5;
								return 6 - get.value(card);
							});
						}
						("step 3");
						if (result.bool) {
							player.logSkill("huangxiangmrfz");
							player.addGaintag(result.cards, "huangxiangmrfzx");
							player.removeMark("charge");
						}
					},
				},
			},
		},
		jiyinmrfz: {
			audio: 3,
			trigger: { player: "phaseUseBegin" },
			filter: function (event, player) {
				return player.countMark("charge") > 0;
			},
			check: function (event, player) {
				return (
					player.hasCard(function (card) {
						return card.name == "sha";
					}, "h") > 0
				);
			},
			content: function () {
				var list = ["jiyinmrfz_eff1", "jiyinmrfz_lose", "jiyinmrfz_eff4", "jiyinmrfz_eff2", "jiyinmrfz_eff3"];
				player.storage.jiyinmrfz = true;
				for (i of list) player.addTempSkill(i);
			},
			subSkill: {
				lose: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					content: function () {
						player.storage.jiyinmrfz = false;
					},
				},
				//伤害基数 目标
				eff1: {
					silent: true,
					charlotte: true,
					trigger: { player: "useCardToPlayered" },
					filter: function (event, player) {
						if (!event.card) return false;
						return event.card.name == "sha" && event.targets.length == 1;
					},
					content: function () {
						"step 0";
						var target = trigger.targets[0],
							buff = 0;
						if (
							!game.hasPlayer(function (current) {
								return current != target && current.countCards("h") > target.countCards("h");
							})
						)
							buff++;
						if (
							!game.hasPlayer(function (current) {
								return current != target && current.hp > target.hp;
							})
						)
							buff++;
						if (
							!game.hasPlayer(function (current) {
								return current != target && current.countCards("e") > target.countCards("e");
							})
						)
							buff++;
						if (buff == 3) {
							player.storage.jiyinmrfz_eff1 = true;
							player.addTempSkill("jiyinmrfz_eff1_buff2", "shaAfter");
						}
						("step 1");
						player.addTempSkill("jiyinmrfz_eff1_buff", "shaAfter");
					},
					mod: {
						playerEnabled: function (card, player, target) {
							if ((target.isMaxHp() || target.isMaxHandcard() || target.isMaxEquip()) && card.name == "sha") return true;
							else if (card.name == "sha") return false;
						},
					},
				},
				eff1_buff: {
					audio: "huangxiangmrfz",
					trigger: { source: "damageBegin3" },
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return event.card && event.card.name == "sha";
					},
					content: function () {
						var target = trigger.player;
						if (player.storage.jiyinmrfz_eff1) {
							trigger.num = target.hp;
						} else trigger.num = Math.max(Math.min(target.hp - 1, player.countMark("charge")), 1);
						player.removeSkill("jiyinmrfz_eff1_buff");
					},
				},
				eff1_buff2: {
					silent: true,
					charlotte: true,
					trigger: { player: "shaEnd" },
					content: function () {
						player.storage.jiyinmrfz_eff1 = false;
					},
				},
				//闪的次数
				eff2: {
					trigger: { player: "useCardToPlayered" },
					forced: true,
					charlotte: true,
					firstDo: true,
					filter: function (event, player) {
						return event.card.name == "sha" && !event.getParent().directHit.includes(event.target);
					},
					logTarget: "target",
					content: function () {
						var targets = trigger.target;
						var id = trigger.target.playerid;
						var map = trigger.getParent().customArgs;
						if (!map[id]) map[id] = {};
						if (typeof map[id].shanRequired == "number") {
							map[id].shanRequired += targets.hp - 1;
						} else {
							map[id].shanRequired = targets.hp;
						}
					},
					ai: {
						directHit_ai: true,
						skillTagFilter: function (player, tag, arg) {
							if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > player.countMark("charge")) return false;
						},
					},
				},
				//提示
				eff3: {
					charlotte: true,
					mark: true,
					intro: {
						content: function (event, player) {
							var list = [];
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].isMaxHp() && game.players[i].isMaxHandcard() && game.players[i].isMaxEquip())
									list.add(get.translation(game.players[i]));
							}
							return "手牌最多或之一且体力值最多或之一且装备数最多或之一的角色有:</br>" + (list.length ? list : "没有满足条件的角色！");
						},
					},
				},
				//消耗蓄力值
				eff4: {
					forced: true,
					charlotte: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return event.card && event.card.name == "sha";
					},
					content: function () {
						player.removeMark("charge", trigger.num);
					},
				},
			},
		},
		//伊芙利特 小火龙
		yanmomrfz: {
			audio: 4,
			mod: {
				attackRange: function (player, num) {
					return num + 2;
				},
				playerEnabled: function (card, player, target) {
					var gone = [];
					for (var i = 0; i < game.players.length; i++) {
						var players = game.players[i];
						if (players.isAction()) gone.add(players);
					}
					if (target != player && _status.currentPhase == player) {
						if (!gone.includes(target) && player.storage.yanmomrfz == true) return false;
						if (gone.includes(target) && player.storage.yanmomrfz == false) return false;
					}
				},
			},
			trigger: { player: "phaseBegin" },
			direct: true,
			content: function () {
				"step 0";
				var num = 0,
					gone = [],
					wlgo = [];
				for (var i = 0; i < game.players.length; i++) {
					var players = game.players[i];
					if (players.isAction()) gone.add(players);
					else wlgo.add(players);
				}
				//console.log(player.storage.yanmomrfz_gone);
				player
					.chooseControl()
					.set("choiceList", [
						"只能指定本轮<font color=#f61e46>已进行</font>回合的其他角色<br>(" + get.translation(gone) + ")",
						"只能指定本轮<font color=#f61e46>未进行</font>回合的其他角色<br>(" + get.translation(wlgo) + ")",
					])
					.set("ai", function () {
						if (num > game.players.length - num) return 0;
						return 1;
					});
				("step 1");
				if (result.index == 0) {
					player.storage.yanmomrfz = true;
				} else player.storage.yanmomrfz = false;
				player.logSkill("yanmomrfz");
			},
			group: ["yanmomrfz_add"],
			subSkill: {
				gone: {
					charlotte: true,
				},
				eff: {
					init: function (player) {
						player.storage.yanmomrfz_eff = false;
					},
					silent: true,
					charlotte: true,
					firstDo: true,
					trigger: { player: "phaseBegin" },
					content: function () {
						player.storage.yanmomrfz_eff = true;
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					content: function () {
						game.countPlayer(function (current) {
							current.storage.yanmomrfz_eff = false;
						});
					},
				},
				add: {
					trigger: { player: "useCard" },
					filter: function (event, player) {
						if (get.type(event.card) == "delay") return false;
						if (get.type(event.card) == "equip") return false;
						return game.hasPlayer(function (current) {
							return !event.targets.includes(current) && player.canUse(event.card, current) && current != player;
						});
					},
					check: function (event, player) {
						var num = 0;
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i] == player || event.targets.includes(game.players[i])) continue;
							if (!player.inRange(game.players[i])) continue;
							if (player.canUse(event.card, game.players[i])) {
								num = num + get.attitude(player, game.players[i]);
							}
						}
						return num > -1;
					},
					prompt: function (event, player) {
						var list = [];
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i] == player || event.targets.includes(game.players[i])) continue;
							if (!player.inRange(game.players[i])) continue;
							if (player.canUse(event.card, game.players[i])) list.add(get.translation(game.players[i]));
						}
						return "是否增加" + list + "为" + get.translation(event.card) + "的目标？";
					},
					content: function () {
						"step 0";
						var list = [],
							targets = [];
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i] == player || trigger.targets.includes(game.players[i])) continue;
							if (!player.inRange(game.players[i])) continue;
							if (player.canUse(trigger.card, game.players[i])) {
								targets.push(game.players[i]);
								player.line(game.players[i]);
							}
						}
						if (targets.length > 0) {
							if (!event.isMine() && !event.isOnline()) game.delayx();
							event.targets = targets;
						} else {
							event.finish();
						}
						("step 1");
						player.logSkill("yanmomrfz");
						game.log(event.targets, "成为了", trigger.card, "的目标");
						trigger.targets.addArray(event.targets);
					},
				},
			},
		},
		yanbaomrfz: {
			intro: {
				content: '<span style="text-decoration:line-through">防御力-100</span></br>本轮下次因【杀】受到的伤害+1',
			},
			audio: 2,
			trigger: { source: "damageEnd" },
			global: ["yanbaomrfz_eff", "yanbaomrfz_clear"],
			filter: function (event, player) {
				if (!event.player.isAlive()) return false;
				return !event.player.hasMark("yanbaomrfz") && event.player != player && !event.player.storage.yanbaomrfz2;
			},
			check: function (event, player) {
				return get.attitude(player, event.player) < 2;
			},
			content: function () {
				trigger.player.addMark("yanbaomrfz", false);
				trigger.player.storage.yanbaomrfz2 = true;
			},
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					firstDo: true,
					content: function () {
						player.removeMark("yanbaomrfz", false);
						player.storage.yanbaomrfz2 = false;
					},
				},
				eff: {
					silent: true,
					charlotte: true,
					trigger: { player: "damageBegin" },
					filter: function (event, player) {
						if (!player.hasMark("yanbaomrfz")) return false;
						return event.card && event.card.name == "sha";
					},
					content: function () {
						trigger.num++;
						player.removeMark("yanbaomrfz", false);
						player.logSkill("yanbaomrfz");
					},
				},
			},
			ai: {
				expose: 0.1,
			},
		},
		yanbaomrfz2: {
			charlotte: true,
		},
		huishenmrfz: {
			audio: 2,
			usable: 1,
			trigger: { player: "useCardToPlayer" },
			filter: function (event, player) {
				return event.target != player;
			},
			content: function () {
				player.addTempSkill("huishenmrfz_eff", "useCardAfter");
			},
			subSkill: {
				eff: {
					silent: true,
					trigger: { player: "useCardToPlayered" },
					filter: function (event, player) {
						return event.target != player;
					},
					content: function () {
						"step 0";
						trigger.target.chooseToDiscard("弃置一张手牌，或令" + get.translation(player) + "摸一张牌").set("ai", function (card) {
							var trigger = _status.event.getTrigger();
							return -get.attitude(trigger.target, trigger.player) - get.value(card);
						});
						("step 1");
						if (result.bool == false) player.draw();
					},
				},
			},
		},
		//淬羽赫默
		renbenmrfz: {
			mark: true,
			intro: {
				name: "《特里蒙科学伦理宣言》",
				content: "本轮游戏不能使用、打出或弃置【$】",
			},
			audio: 2,
			forced: true,
			trigger: { global: "roundStart" },
			//priority:-100,
			content: function () {
				"step 0";
				game.countPlayer(function (current) {
					if (current.hasSkill("renbenmrfz2")) current.removeSkill("renbenmrfz2");
					if (current.hasSkill("renbenmrfz3")) current.removeSkill("renbenmrfz3");
				});
				var list = lib.inpile;
				var list2 = [];
				for (var i = 0; i < list.length; i++) {
					var name = list[i];
					var type = get.type(name);
					if (name == "sha") {
						list2.push(["基本", "", "sha"]);
					} else if (type == "basic") {
						list2.push(["基本", "", list[i]]);
					} else if (type == "trick") {
						list2.push(["锦囊", "", list[i]]);
					}
				}
				if (!list.length) event.finish();
				else {
					event.cards = list2;
					event.cards2 = [];
					event.num = 0;
				}
				("step 1");
				if (event.num < game.players.length)
					game.players[event.num]
						.chooseButton(true, ["【人本】:请声明一张牌</br>科学理应注视每一个人", [event.cards, "vcard"]])
						.set("ai", function (button) {
							switch (button.link[2]) {
								case "wuxie":
									return 0.5 + Math.random();
								case "wuzhong":
								case "dongzhuxianji":
									return 0.3 + Math.random();
								case "guohe":
								case "zhujinqiyuan":
									return 0.3 + Math.random();
								case "sha":
									return 0.3 + Math.random();
								case "tao":
									return 0.4 + Math.random();
								case "shan":
									return 0.3 + Math.random();
								default:
									return Math.random();
							}
						});
				else event.goto(3);
				("step 2");
				if (result.bool) {
					event.cards2.add2(result.links[0][2]);
					game.log(game.players[event.num], "声明了", result.links[0][2]);
					if (event.num < game.players.length) {
						event.num++;
						event.goto(1);
					}
				}
				("step 3");
				var maxCard = game.mostStr(event.cards2);
				if (maxCard.length == 1) {
					game.log("本轮游戏不能使用、打出或弃置", maxCard);
					player.popup(maxCard);
					player.storage.renbenmrfz = maxCard;
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].storage.renbenmrfz != maxCard) game.players[i].storage.renbenmrfz = maxCard;
					}
					event.goto(6);
				} else event.cards3 = maxCard;
				("step 4");
				player.chooseButton([true, "【人本】:请选择一张牌</br>科学理应注视每一个人", [event.cards3, "vcard"]]);
				("step 5");
				if (result.bool) {
					game.log("本轮游戏不能使用、打出或弃置", result.links[0][2]);
					player.popup(result.links[0][2]);
					player.storage.renbenmrfz = result.links[0][2];
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].storage.renbenmrfz != result.links[0][2]) game.players[i].storage.renbenmrfz = result.links[0][2];
					}
				}
				("step 6");
				event.num2 = 0;
				("step 7");
				if (event.num2 < game.players.length) {
					if (game.players[event.num2] != player)
						game.players[event.num2]
							.chooseControl("是", "否")
							.set("prompt", "【人本】:是否遵守协议？(不能使用或打出" + get.translation(player.storage.renbenmrfz) + ")")
							.set("ai", function () {
								var player = _status.event.player;
								if (!player.getEquip(1)) return 0;
								if (
									game.hasPlayer(function (current) {
										return get.distance(player, current) <= 1 && player != current && get.attitude(player, current) < 0;
									}) ||
									(player.storage.renbenmrfz == "sha" && Math.random() > 0.4)
								)
									return 1;
								return 0;
							});
					else {
						event.num2++;
						event.redo();
					}
				} else event.finish();
				("step 8");
				if (result.index == 0) {
					game.players[event.num2].addSkill("renbenmrfz2");
				} else if (result.index == 1) {
					game.players[event.num2].addSkill("renbenmrfz3");
				}
				if (event.num2 < game.players.length) {
					event.num2++;
					event.goto(7);
				}
			},
			global: "renbenmrfz_use",
			subSkill: {
				use: {
					mod: {
						cardDiscardable: function (card, player) {
							if (get.name(card) == player.storage.renbenmrfz && (player.hasSkill("renbenmrfz2") || player.hasSkill("renbenmrfz")))
								return false;
						},
						cardEnabled2: function (card, player) {
							if (get.name(card) == player.storage.renbenmrfz && (player.hasSkill("renbenmrfz2") || player.hasSkill("renbenmrfz")))
								return false;
						},
						ignoredHandcard: function (card, player) {
							if (get.name(card) == player.storage.renbenmrfz && player.hasSkill("renbenmrfz")) {
								return true;
							}
						},
					},
				},
			},
		},
		renbenmrfz2: {
			mark: true,
			intro: {
				content: "接受《特里蒙科学伦理宣言》",
			},
			audio: "renbenmrfz",
			enable: "phaseUse",
			filterCard: function (card, player) {
				return card.name == player.storage.renbenmrfz;
			},
			discard: false,
			lose: false,
			filter: function (event, player) {
				return player.hasCard(function (card) {
					return card.name == player.storage.renbenmrfz;
				}, "h");
			},
			filterTarget: function (card, player, target) {
				return target != player && target.hasSkill("renbenmrfz");
			},
			content: function () {
				player.draw();
				player.give(cards, target);
			},
			group: "renbenmrfz2_lose",
			subSkill: {
				lose: {
					charlotte: true,
					silent: true,
					firstDo: true,
					priority: 50,
					trigger: { global: "die" },
					filter: function (event, player) {
						return event.player.hasSkill("renbenmrfz");
					},
					content: function () {
						player.removeSkill("renbenmrfz2");
					},
				},
			},
			ai: {
				order: 13,
				result: {
					player: function (player, target) {
						if (get.attitude(player, target) > 0) return 1;
						return -1;
					},
				},
			},
		},
		renbenmrfz3: {
			mark: true,
			markimage: "extension/WhichWay/image/skill/rejecthmmrfz.png",
			intro: {
				content: function (event, player) {
					return "不接受《特里蒙科学伦理宣言》</br>当前攻击距离为" + player.getAttackRange();
				},
			},
			mod: {
				attackRange: function (player, num) {
					var atk = 0;
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] == player) continue;
						if (game.players[i].hasSkill("renbenmrfz2")) atk++;
					}
					return num - Math.max(2, atk);
				},
			},
		},
		dizhumrfz: {
			audio: 2,
			trigger: { player: "phaseUseBegin" },
			direct: true,
			content: function () {
				"step 0";
				game.countPlayer(function (current) {
					current.removeSkill("dizhumrfzx");
				});
				player.chooseTarget("【砥柱】:你可以选择至多两名角色，令其获得‘夜灯’标记", [0, 2]).set("ai", function (target) {
					return get.attitude(_status.event.player, target) > 2;
				});
				("step 1");
				if (result.bool) {
					var targets = result.targets;
					player.logSkill("dizhumrfz");
					for (i of targets) {
						i.addSkill("dizhumrfzx");
						i.storage.dizhumrfz = true;
						player.line(i);
					}
				}
			},
		},
		dizhumrfzx: {
			mark: true,
			markimage: "extension/WhichWay/image/skill/yedengmrfz.png",
			intro: {
				content: function (event, player) {
					return "受到的伤害-1，若为致命伤害，则防止之";
				},
			},
			audio: 2,
			forced: true,
			trigger: { player: "damageBegin3" },
			content: function () {
				if (trigger.num < player.hp) trigger.num--;
				else trigger.num = 0;
				player.removeMark("dizhumrfz");
				player.removeSkill("dizhumrfzx");
				player.logSkill("dizhumrfz");
			},
		},
		//塞雷娅
		fuyuanmrfz: {
			audio: 2,
			trigger: { global: "recoverEnd" },
			forced: true,
			filter: function (event, player) {
				return event.source == player && event.player != player;
			},
			content: function () {
				trigger.player.draw();
			},
		},
		gaihuamrfz: {
			audio: 2,
			trigger: { global: "damageBegin" },
			filter: function (event, player) {
				if (event.player == player) return false;
				return event.nature && player.inRange(event.player);
			},
			direct: true,
			content: function () {
				"step 0";
				if (trigger.card) {
					var cards = trigger.card;
					player
						.chooseToDiscard(
							"he",
							get.prompt("gaihuamrfz"),
							"是否弃置一张非" + get.translation(get.type(cards)) + "牌令此伤害+1",
							function (card) {
								return get.type(card) != get.type(cards);
							}
						)
						.set("goon", get.attitude(player, trigger.player) < 0)
						.set("ai", function (card) {
							if (!_status.event.goon) return 0;
							return 7 - get.value(card);
						});
				} else {
					player
						.chooseToDiscard(get.prompt("gaihuamrfz"), "是否弃置一张牌令此伤害+1")
						.set("goon", get.attitude(player, trigger.player) < 0)
						.set("ai", function (card) {
							if (!_status.event.goon) return 0;
							return 7 - get.value(card);
						});
				}
				("step 1");
				if (result.bool) {
					trigger.num++;
					player.logSkill("gaihuamrfz", trigger.player);
				}
			},
		},
		yaopeimrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return player.getCardUsable("sha") > 0 && player.countCards("he") > 0;
			},
			filterCard: true,
			position: "he",
			prompt: "请弃置一张牌",
			content: function () {
				"step 0";
				var num = 0;
				var go = false;
				if (
					game.hasPlayer(function (current) {
						return get.distance(player, current) <= 1 && get.attitude(player, current) > 2 && current.getDamagedHp() > 2;
					})
				) {
					go = true;
				} else if (
					!game.hasPlayer(function (current) {
						return (
							get.distance(player, current) <= 1 && get.attitude(player, current) > 0 && current.getDamagedHp() > 0 && current != player
						);
					}) &&
					player.getDamagedHp() > 0
				) {
					go = true;
				}
				player.addTempSkill("yaopeimrfz2", "phaseUseAfter");
				player
					.chooseTarget(
						"【药配】:选择一名与你距离不大于1的角色令其回血，或选择‘取消’令攻击范围内的所有角色回复一点体力",
						function (card, target, player) {
							return get.distance(player, target) <= 1 && target.getDamagedHp() > 0;
						}
					)
					.set("go", go)
					.set("ai", function (target) {
						var player = _status.event.player;
						if (go) return get.attitude(player, target) > 2;
						return 0;
					});
				("step 1");
				if (result.bool) {
					var targets = result.targets[0];
					targets.recover();
					if (targets.getDamagedHp() >= 3) targets.recover();
				} else {
					for (var i = 0; i < game.players.length; i++) {
						var targets = game.players;
						if (player.inRange(targets[i]) || targets[i] == player) targets[i].recover();
					}
				}
			},
			ai: {
				expose: 0.1,
				threaten: 1.5,
				order: 13,
				result: {
					player: function (player) {
						var num = 0,
							player = _status.event.player;
						for (var i = 0; i < game.players.length; i++) {
							var targetx = game.players;
							if (!player.inRange(targetx[i])) continue;
							if (get.attitude(player, targetx[i]) > 0 && targetx[i].getDamagedHp() > 0) num++;
							if (get.attitude(player, targetx[i]) <= 0 && targetx[i].getDamagedHp() > 0) num--;
							if (player.getDamagedHp() > 0) {
								num = 1;
								break;
							}
						}
						if (num > 0) return 1;
						return -1;
					},
				},
			},
		},
		yaopeimrfz2: {
			charlotte: true,
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return num - 1;
				},
			},
		},
		//焰影苇草
		minghuomrfz: {
			audio: 4,
			trigger: { player: "phaseZhunbeiBegin" },
			direct: true,
			content: function () {
				"step 0";
				if (player.hasSkill("minghuomrfz_buff1")) player.removeSkill("minghuomrfz_buff1");
				if (player.hasSkill("minghuomrfz_buff2")) player.removeSkill("minghuomrfz_buff2");
				player
					.chooseControl()
					.set("choiceList", [
						"每回合你使用的第一张单一目标的普通锦囊或【杀】可以额外指定一个目标",
						"当有‘灼痕’标记的角色进入濒死状态时，你可以令其上家或下家获得一个‘灼痕’标记",
						'<span style="text-decoration:line-through">真的会有人选这个选项吗？</span>不发动此技能',
					])
					.set("ai", function () {
						if (
							game.countPlayer(function (current) {
								var curnext = current.getNext(),
									curpre = current.getPrevious();
								return (
									current != player &&
									current.hasMark("zhuohenmrfz") &&
									current.hp < 2 &&
									(get.attitude(player, curnext) || get.attitude(player, curpre))
								);
							}) > 0
						)
							return 1;
						return 0;
					});
				("step 1");
				if (result.index != 2) {
					if (result.index == 0) player.addSkill("minghuomrfz_buff1");
					else player.addSkill("minghuomrfz_buff2");
					player.logSkill("minghuomrfz");
				}
			},
			subSkill: {
				buff1: {
					trigger: { player: "useCard2" },
					filter: function (event, player) {
						if (player.hasSkill("minghuomrfz_mark")) return false;
						if (event.targets.length > 1) return false;
						if (get.type(event.card) != "trick" && event.card.name != "sha") return false;
						return game.hasPlayer(function (current) {
							return !event.targets.includes(current) && player.canUse(event.card, current);
						});
					},
					direct: true,
					content: function () {
						"step 0";
						player
							.chooseTarget(
								get.prompt("minghuomrfz"),
								"为" + get.translation(trigger.card) + "增加一个目标",
								function (card, player, target) {
									return !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target);
								}
							)
							.set("sourcex", trigger.targets)
							.set("ai", function (target) {
								var player = _status.event.player;
								return get.effect(target, _status.event.card, player, player);
							})
							.set("card", trigger.card);
						("step 1");
						if (result.bool) {
							if (!event.isMine() && !event.isOnline()) game.delayx();
							event.target = result.targets[0];
							player.addTempSkill("minghuomrfz_mark", "phaseEnd");
						} else {
							event.finish();
						}
						("step 2");
						player.logSkill("minghuomrfz", event.target);
						trigger.targets.push(event.target);
					},
				},
				buff2: {
					trigger: { global: "dying" },
					direct: true,
					filter: function (event, player) {
						if (event.player.getNext().hasMark("zhuohenmrfz") && event.player.getPrevious().hasMark("zhuohenmrfz")) return false;
						return game.players.length > 2 && event.player.hasMark("zhuohenmrfz");
					},
					content: function () {
						"step 0";
						var target = trigger.player;
						player
							.chooseTarget(
								get.prompt("minghuomrfz"),
								"你可以令" + get.translation(target) + "的上家或下家（不能是你）获得一个‘灼痕’标记",
								function (card, player, target) {
									return (
										!target.hasMark("zhuohenmrfz") &&
										target != player &&
										(target == _status.event.TriPlayer.getNext() || target == _status.event.TriPlayer.getPrevious())
									);
								}
							)
							.set("TriPlayer", trigger.player)
							.set("ai", function (player, target) {
								if (get.attitude(player, targetx.getNext()) > 2 && get.attitude(player, targetx.getNext()) > 2) return 0;
								return get.attitude(player, target) < 2;
							})
							.set("targetx", trigger.player);
						("step 1");
						if (result.bool) {
							var target = result.targets[0];
							target.addMark("zhuohenmrfz");
							player.logSkill("zhuohenmrfz", target);
							if (target.countCards("h") > 0) target.chooseToDiscard("h", true, "【灼痕】:请选择弃置一张手牌");
						}
					},
				},
				mark: {
					charlotte: true,
				},
			},
		},
		yingyaomrfz: {
			intro: {
				content: function (event, player) {
					return "剩余使用次数:" + (game.totalmark("zhuohenmrfz") - player.countMark("yingyaomrfz"));
				},
			},
			audio: 2,
			trigger: { source: "damageEnd" },
			filter: function (event, player) {
				if (game.totalmark("zhuohenmrfz") <= player.countMark("yingyaomrfz")) return false;
				return (
					event.player != player &&
					game.hasPlayer(function (current) {
						return current != player && player.inRange(current);
					})
				);
			},
			content: function () {
				"step 0";
				player
					.chooseTarget(
						true,
						get.prompt("yingyaomrfz"),
						"你可以选择一名在你攻击范围内的角色，令其回复一点体力，若其为你，你摸一张牌",
						function (card, player, target) {
							return (player.inRange(target) && target.getDamagedHp() > 0) || target == player;
						}
					)
					.set("ai", function (target) {
						return get.attitude(_status.event.player, target) > 2;
					});
				("step 1");
				if (result.bool) {
					var target = result.targets[0];
					target.recover();
					player.addMark("yingyaomrfz", false);
					if (target == player) player.draw();
				}
			},
			group: "yingyaomrfz_clear",
			subSkill: {
				clear: {
					silent: true,
					firstDo: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					content: function () {
						player.removeMark("yingyaomrfz", player.countMark("yingyaomrfz"), false);
					},
				},
			},
		},
		zhuohenmrfz: {
			intro: {
				content: "·被德拉克的火焰灼伤</br>·手牌上限-1</br>·受到伤害时需弃置一张手牌",
			},
			global: "zhuohenmrfz_debuff2",
			audio: 2,
			trigger: { player: "useCardToPlayered" },
			filter: function (event, player) {
				return event.target != player && !event.target.hasMark("zhuohenmrfz") && !event.target.hasSkill("zhuohenmrfz2");
			},
			check: function (event, player) {
				return get.attitude(player, event.target) < 0;
			},
			prompt: function (event, player) {
				return "是否令" + get.translation(event.target) + "获得一个‘灼痕’标记？";
			},
			content: function () {
				var target = trigger.target;
				target.addMark("zhuohenmrfz");
				target.addSkill("zhuohenmrfz_clear");
				target.addTempSkill("zhuohenmrfz2");
				if (target.countCards("h") > 0) target.chooseToDiscard("h", true, "【灼痕】:请选择弃置一张手牌");
			},
			mod: {
				maxHandcard: function (player, num) {
					return num + game.totalmark("zhuohenmrfz");
				},
			},
			group: ["zhuohenmrfz_debuff", "zhuohenmrfz_draw"],
			subSkill: {
				draw: {
					audio: "zhuohenmrfz",
					forced: true,
					trigger: { global: "phaseBegin" },
					filter: function (event, player) {
						return event.player.hasMark("zhuohenmrfz") && !player.isMaxHandcard(true);
					},
					content: function () {
						player.draw();
					},
				},
				clear: {
					silent: true,
					firstDo: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					content: function () {
						player.removeMark("zhuohenmrfz");
						player.removeSkill("zhuohenmrfz_clear");
					},
				},
				debuff: {
					charlotte: true,
					direct: true,
					trigger: { global: "damageBegin" },
					filter: function (event, player) {
						return event.player != player && event.player.hasMark("zhuohenmrfz") && event.player.countCards("h") > 0;
					},
					content: function () {
						trigger.player.chooseToDiscard("h", true, "【灼痕】:请选择弃置一张手牌");
					},
				},
				debuff2: {
					charlotte: true,
					mod: {
						maxHandcard: function (player, num) {
							if (player.hasMark("zhuohenmrfz")) return num - 1;
						},
					},
				},
			},
		},
		zhuohenmrfz2: {
			charlotte: true,
		},
		//霍尔海雅
		chuangzhongmrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "useCardToPlayered" },
			filter: function (event, player) {
				for (var i = 0; i < event.targets.length; i++) {
					if (event.targets[i].hasMark("kuangyumrfz")) {
						return true;
					}
				}
				return false;
			},
			content: function () {
				for (var i = 0; i < trigger.targets.length; i++) {
					if (trigger.targets[i].hasMark("kuangyumrfz")) {
						trigger.targets[i].addTempSkill("fengyin");
						trigger.targets[i].addSkill("chuangzhongmrfz_eff");
					}
				}
			},
			subSkill: {
				eff: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseDiscardEnd" },
					content: function () {
						player.removeSkill("chuangzhongmrfz_eff");
					},
					mod: {
						maxHandcard: function (player, num) {
							if (player.hasMark("kuangyumrfz")) return num - player.hp;
						},
					},
				},
			},
		},
		kuangyumrfz: {
			intro: {
				name: "风起",
				content: function (event, player) {
					if (player.hasSkill("chuangzhongmrfz_eff")) return "·回合开始时，随机跳过两个阶段</br>·手牌上限-" + player.hp;
					return "·回合开始时，随机跳过两个阶段";
				},
			},
			audio: 4,
			derivation: ["kuangyumrfz_rewirte"],
			trigger: { player: "useCardToPlayered" },
			firstDo: true,
			filter: function (event, player) {
				var nost = get.type(event.card) != "trick" && get.type(event.card) != "delay";
				var hast = get.type(event.card) != "trick" && event.card.name != "sha";
				if (!event.targets || event.targets.length > 1) return false;
				if (event.cards && (player.storage.kuangyumrfz ? nost : hast)) return false;
				return event.target != player && !event.target.hasMark("kuangyumrfz");
			},
			prompt: function (event, player) {
				return "是否令" + get.translation(event.target) + "获得一个‘风起’标记？";
			},
			content: function () {
				var target = trigger.target;
				target.addMark("kuangyumrfz");
				target.addSkill("kuangyumrfz_clear");
				target.addTempSkill("kuangyumrfz2");
				target.addSkill("kuangyumrfz_skip");
				if (player.inRange(target)) player.addTempSkill("kuangyumrfz_damage", "useCardAfter");
			},
			group: "kuangyumrfz_clear2",
			subSkill: {
				clear2: {
					silent: true,
					charlotte: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						return player.storage.kuangyumrfz;
					},
					content: function () {
						player.storage.kuangyumrfz = false;
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					content: function () {
						player.removeMark("kuangyumrfz");
						player.removeSkill("kuangyumrfz_clear");
					},
				},
				skip: {
					audio: "kuangyumrfz",
					forced: true,
					charlotte: true,
					trigger: { player: "phaseBegin" },
					content: function () {
						var phase = ["phaseBegin", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"].randomGet2(2);
						for (var i = 0; i < phase.length; i++) {
							player.skip(phase[i]);
						}
						game.log(player, "因【狂语】将会跳过", get.tranPhase(phase[0]), "和", get.tranPhase(phase[1]));
						player.removeSkill("kuangyumrfz_skip");
					},
				},
				damage: {
					audio: "kuangyumrfz",
					trigger: { source: "damageBegin" },
					forced: true,
					filter: function (event, player) {
						return event.player.hasMark("kuangyumrfz");
					},
					content: function () {
						trigger.num++;
						player.storage.kuangyumrfz = true;
					},
				},
			},
		},
		kuangyumrfz2: {
			charlotte: true,
		},
		//新棘刺
		jihumrfz: {
			audio: 2,
			intro: {
				content: "荆棘护身",
			},
			trigger: { player: "phaseZhunbeiBegin" },
			check: function (event, player) {
				if (
					player.countCards("h", function (card) {
						return get.tag(card, "damage") || (get.type(card) == "trick" && !get.tag(card, "damage")) || get.type(card) == "delay";
					}) > 1
				)
					return false;
				return true;
			},
			content: function () {
				if (!player.hasMark("jihumrfz")) player.addMark("jihumrfz", false);
				player.addTempSkill("zishou2");
			},
			group: ["jihumrfz_clear", "jihumrfz_buff"],
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseBegin" },
					filter: function (event, player) {
						return player.hasMark("jihumrfz");
					},
					content: function () {
						player.removeMark("jihumrfz", false);
					},
				},
				buff: {
					trigger: { target: "useCardToTargeted" },
					usable: 1,
					filter: function (event, player) {
						if (get.type(event.card) == "delay" || get.type(event.card) == "equip") return false;
						if (!player.hasMark("jihumrfz")) return false;
						return (
							event.player != player &&
							(player.canUse(event.card, event.player, false) ||
								game.hasPlayer(function (current) {
									return (
										current != player && get.distance(player, current) <= 1 && player.canUse(event.card, current, "nodistance")
									);
								}))
						);
					},
					direct: true,
					content: function () {
						"step 0";
						player
							.chooseTarget(function (card, player, target) {
								return (
									player.canUse(trigger.card, target, false) &&
									target != player &&
									(get.distance(player, target) <= 1 || target == _status.event.TriPlayer)
								);
							})
							.set("TriPlayer", trigger.player)
							.set("prompt", get.prompt("jihumrfz"))
							.set("prompt2", "【棘护】:你可以使用一张【" + get.translation(trigger.card.name) + "】").ai = function (target) {
							return -get.attitude(player, target);
						};
						("step 1");
						if (result.bool) {
							player.useCard({ name: trigger.card.name, isCard: true }, result.targets[0], false);
							player.logSkill("jihumrfz");
						}
					},
				},
			},
		},
		re_jianshumrfz: {
			audio: "jianshumrfz",
			derivation: ["re_chaoshengmrfz"],
			intro: {
				content: function (event, player) {
					var num = player.countMark("re_jianshumrfz");
					if (num == 20) return "出牌阶段开始时可以使用一张【杀】</br>摸牌阶段摸牌数+1;攻击距离和【杀】的使用次数各+2";
					else if (num >= 10)
						return "已累计指定" + num + "次</br>出牌阶段开始时可以使用一张【杀】</br>摸牌阶段摸牌数、攻击距离和【杀】的使用次数各+1";
					return "已累计指定" + num + "次";
				},
			},
			direct: true,
			trigger: { player: "useCardToTargeted" },
			filter: function (event, player) {
				return player.countMark("re_jianshumrfz") < 20;
			},
			content: function () {
				"step 0";
				player.addMark("re_jianshumrfz", false);
				("step 1");
				var num = player.countMark("re_jianshumrfz");
				if (num % 10 == 0) {
					player.logSkill("jianshumrfz");
					//--第一次使用至高之术--//
					if (num == 10) {
						player.addSkill("re_jianshumrfz_usesha");
						player.addMark("re_jianshumrfz_time", false);
						player.addMark("re_jianshumrfz_draw", false);
						player.addMark("re_jianshumrfz_range", false);
					}
					//--第二次使用至高之术--//
					if (num == 20) {
						player.addMark("re_jianshumrfz_time", false);
						player.addMark("re_jianshumrfz_range", false);
						player.removeSkill("jihumrfz");
						player.addSkill("re_chaoshengmrfz");
					}
				}
			},
			group: ["re_jianshumrfz_time", "re_jianshumrfz_range", "re_jianshumrfz_draw"],
			subSkill: {
				time: {
					charlotte: true,
					onremove: true,
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num + player.countMark("re_jianshumrfz_time");
						},
					},
				},
				range: {
					charlotte: true,
					onremove: true,
					mod: {
						attackRange: function (player, num) {
							return num + player.countMark("re_jianshumrfz_range");
						},
					},
				},
				draw: {
					silent: true,
					direct: true,
					charlotte: true,
					trigger: { player: "phaseDrawBegin2" },
					filter: function (event, player) {
						return player.hasMark("re_jianshumrfz_draw");
					},
					content: function () {
						trigger.num++;
						player.logSkill("jianshumrfz");
					},
				},
				usesha: {
					direct: true,
					trigger: { player: "phaseUseBegin" },
					content: function () {
						"step 0";
						player.chooseTarget("选择一名其他角色视为对其使用一张【杀】", function (card, player, target) {
							return target != player && player.inRange(target);
						}).ai = function (target) {
							return -get.attitude(player, target);
						};
						("step 1");
						if (result.bool) {
							var target = result.targets[0];
							player.useCard({ name: "sha" }, true, false, target);
							player.logSkill("jianshumrfz");
						}
					},
				},
			},
		},
		re_chaoshengmrfz: {
			audio: "chaoshengmrfz",
			trigger: { player: "phaseEnd" },
			filter: function (event, player) {
				return !player.getStat("damage");
			},
			frequent: true,
			content: function () {
				player.draw(2);
				player.recover();
			},
		},
		//煌
		yanxunmrfz: {
			audio: 4,
			trigger: { player: "damageBegin" },
			forced: true,
			filter: function (event, player) {
				return event.parent.name == "_lianhuan" || event.parent.name == "_lianhuan2";
			},
			content: function () {
				trigger.num--;
			},
			mod: {
				maxHandcard: function (player, num) {
					return num + 2;
				},
			},
			group: ["yanxunmrfz_kaishi", "yanxunmrfz_draw", "yanxunmrfz_use", "yanxunmrfz_judge"],
			subSkill: {
				judge: {
					audio: "yanxunmrfz",
					trigger: { player: "damageBegin" },
					forced: true,
					filter: function (event, player) {
						return event.getParent("phaseJudge") && event.getParent("phaseJudge").player == player;
					},
					content: function () {
						trigger.num -= 2;
					},
				},
				kaishi: {
					direct: true,
					trigger: { global: "roundStart" },
					popup: false,
					content: function () {
						"step 0";
						if (player.isLinked()) {
							player.link();
							player.logSkill("yanxunmrfz");
						}
						if (player.isTurnedOver()) {
							player
								.chooseBool()
								.set("prompt", get.prompt("yanxunmrfz"))
								.set("prompt2", "【严训】:是否翻面并跳过下个出牌阶段？")
								.set("ai", function () {
									var player = _status.event.player;
									return player.countCards("h") < player.getHandcardLimit() * 2;
								});
						}
						("step 1");
						if (result.bool) {
							player.turnOver();
							player.addSkill("yanxunmrfz_skipped");
							player.logSkill("yanxunmrfz");
						}
					},
				},
				skipped: {
					direct: true,
					mark: true,
					intro: {
						content: "跳过下个出牌阶段",
					},
					trigger: { player: "phaseBegin" },
					content: function () {
						player.skip("phaseUse");
						game.log(player, "的出牌阶段将被跳过");
						player.removeSkill("yanxunmrfz_skipped");
					},
				},
				draw: {
					audio: "yanxunmrfz",
					trigger: { player: "phaseUseBegin" },
					filter: function (event, player) {
						return player.getHistory("skipped").includes("phaseDraw");
					},
					frequent: true,
					prompt: "【严训】:是否摸一张牌?",
					content: function () {
						player.draw();
					},
				},
				use: {
					audio: "yanxunmrfz",
					trigger: { player: "phaseDiscardBefore" },
					filter: function (event, player) {
						var cardh = player.getCards("h"),
							canuse = false;
						for (var i = 0; i < cardh.length; i++) {
							if (player.canUseToAnyone(cardh[i])) {
								canuse = true;
								break;
							}
						}
						return player.getHistory("skipped").includes("phaseUse") && canuse == true;
					},
					prompt: "【严训】:是否使用至多两张手牌?",
					content: function () {
						"step 0";
						event.num = 0;
						("step 1");
						var cardh = player.getCards("h"),
							list = [],
							cards = [];
						event.num++;
						for (var i = 0; i < cardh.length; i++) {
							cards.push(cardh[i].name);
						}
						for (var name of lib.inpile) {
							if (!cards.includes(name)) continue;
							var card = { name: name, isCard: true };
							if (!player.canUseToAnyone(card)) continue;
							if (get.type(card) == "basic") {
								list.push(["基本", "", name]);
							} else if (get.type(card) == "trick" || get.type(card) == "delay") {
								list.push(["锦囊", "", name]);
							} else if (get.type(card) == "equip") {
								list.push(["装备", "", name]);
							}
						}
						if (list.length) player.chooseButton(["【严训】:请选择你要使用的手牌(" + event.num + "/2)", [list, "vcard"]], "hidden");
						else event.finish();
						("step 2");
						if (result.bool) {
							var name = result.links[0][2];
							player.chooseToUse(
								function (card, player, event) {
									return get.name(card) == name;
								},
								"【严训】:你可以使用一张" + get.translation(name)
							);
							if (event.num < 2) event.goto(1);
						}
					},
				},
			},
		},
		chuchanmrfz: {
			intro: {
				content: function (event, player) {
					if (!player.storage.chuchanmrfz) return "未发动";
					if (player.storage.chuchanmrfz && player.hasSkill("chuchanmrfz_buff1")) return "本轮受到伤害后回复一点体力";
					return "已发动";
				},
			},
			audio: 2,
			trigger: { player: "changeHp" },
			forced: true,
			unique: true,
			mark: true,
			limited: true,
			skillAnimation: true,
			animationStr: "除颤",
			animationColor: "fire",
			init: function (player) {
				player.storage.chuchanmrfz = false;
			},
			filter: function (event, player) {
				return !player.storage.chuchanmrfz && player.hp < 2;
			},
			content: function () {
				player.storage.chuchanmrfz = true;
				player.recoverTo(2);
				player.addSkill("chuchanmrfz_buff1");
				player.addSkill("chuchanmrfz_buff2");
				player.awakenSkill(event.name);
			},
			subSkill: {
				buff1: {
					audio: "chuchanmrfz",
					trigger: { player: "damageEnd" },
					firstDo: true,
					forced: true,
					charlotte: true,
					content: function () {
						player.recover();
					},
					ai: {
						effect: {
							target: function (card, player, target, current) {
								if (get.tag(card, "damage")) return "zerotarget";
								if (get.type(card) == "trick" && get.tag(card, "damage")) {
									return "zeroplayertarget";
								}
							},
						},
					},
				},
				buff2: {
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					content: function () {
						player.removeSkill(["chuchanmrfz_buff1", "chuchanmrfz_buff2"]);
					},
				},
			},
		},
		feixuemrfz: {
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return num + player.storage.feixuemrfz;
				},
			},
			init: function (player) {
				player.storage.feixuemrfz = 0;
			},
			onremove: true,
			audio: 4,
			trigger: { player: ["loseHpEnd", "damageEnd"] },
			content: function () {
				"step 0";
				event.num = trigger.num;
				("step 1");
				event.num--;
				var card = get.cardPile2(function (card) {
					return get.name(card) == "sha" && card.nature == "fire";
				});
				if (card) player.gain(card, "gain2", "log");
				else {
					player.draw();
				}
				("step 2");
				if (trigger.source && trigger.source.countCards("e") > 0) {
					player.storage.feixuemrfz += 1;
					player.discardPlayerCard(trigger.source, "e", false).set("forceAuto", true).boolline = true;
				}
				if (event.num > 0) event.goto(1);
			},
			group: "feixuemrfz_clear",
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					content: function () {
						player.storage.feixuemrfz = 0;
					},
				},
			},
			ai: {
				expose: 0.1,
				threaten: 0.8,
			},
		},
		//铃兰
		hualaomrfz: {
			marktext: "脆弱",
			intro: {
				name: "脆弱",
				content: "下次受到的伤害+#",
			},
			audio: 2,
			trigger: { source: "damageBegin" },
			filter: function (event, player) {
				return event.player != player;
			},
			check: function (event, player) {
				if (get.attitude(player, event.player) > 0) return false;
				if (event.num + event.player.countMark("hualaomrfz") - event.player.hp >= 0) return false;
				return true;
			},
			content: function () {
				var target = trigger.player;
				target.addMark("hualaomrfz", trigger.num + 1, false);
				target.addSkill("hualaomrfz_eff");
				trigger.num = 0;
			},
			subSkill: {
				eff: {
					trigger: { player: "damageBegin2" },
					filter: function (event, player) {
						return player.hasMark("hualaomrfz");
					},
					charlotte: true,
					direct: true,
					content: function () {
						trigger.num += player.countMark("hualaomrfz");
						player.removeMark("hualaomrfz", player.countMark("hualaomrfz"), false);
						player.logSkill("hualaomrfz");
					},
				},
			},
			ai: {
				expose: 0.1,
				threaten: 1.2,
			},
		},
		huhuomrfz: {
			intro: {
				content: "摸牌阶段摸牌数-#,出牌阶段结束时摸#张牌",
			},
			audio: 2,
			trigger: { source: "damageZero" },
			content: function () {
				trigger.player.addMark("huhuomrfz", false);
				trigger.player.addSkill("huhuomrfz2");
			},
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return player.hasMark("huhuomrfz");
					},
					content: function () {
						player.removeMark("huhuomrfz", player.countMark("huhuomrfz"), false);
						trigger.player.removeSkill("huhuomrfz2");
					},
				},
			},
		},
		huhuomrfz2: {
			direct: true,
			charlotte: true,
			trigger: { player: "phaseDrawBegin2" },
			content: function () {
				trigger.num -= player.countMark("huhuomrfz");
			},
			group: ["huhuomrfz2_draw", "huhuomrfz_clear"],
			subSkill: {
				draw: {
					charlotte: true,
					direct: true,
					trigger: { player: "phaseUseEnd" },
					content: function () {
						player.draw(player.countMark("huhuomrfz"));
					},
				},
			},
		},
		wuyuemrfz: {
			mod: {
				targetInRange: function (card, player, target, now) {
					if (card.name == "sha" && get.color(card) == "black") return true;
				},
				selectTarget: function (card, player, range) {
					if (card.name == "sha" && range[1] != -1 && get.color(card) == "red") range[1]++;
				},
			},
		},
		//闪灵
		lichangmrfz: {
			marktext: "屏障",
			markimage: "extension/WhichWay/image/skill/slmrfzimage.png",
			intro: {
				name: "屏障",
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			audio: 6,
			enable: "phaseUse",
			filter: function (event, player) {
				return (
					player.countCards("h") > 0 &&
					game.hasPlayer(function (current) {
						return !current.hasSkill("lichangmrfz2");
					})
				);
			},
			filterTarget: function (card, player, target) {
				return !target.hasSkill("lichangmrfz2");
			},
			filterCard: true,
			lose: false,
			discard: false,
			delay: 0,
			check: function (card) {
				var player = _status.event.player;
				if (
					player.countCards("h", function (card) {
						return get.type(card) == "equip";
					}) > 0
				)
					return get.type(card) == "equip";
				return 6 - get.value(card);
			},
			prompt: `请选择一张牌`,
			position: "he",
			content: function () {
				target.addTempSkill("lichangmrfz2");
				target.addToExpansion(cards, target, "giveAuto").gaintag.add("lichangmrfz");
				if (get.type(cards[0]) == "equip" && target.hujia < 5) target.changeHujia();
				if (target.hujia < 5) target.changeHujia();
			},
			group: ["lichangmrfz_rem", "lichangmrfz_dam", "lichangmrfz_da"],
			subSkill: {
				rem: {
					audio: "lichangmrfz",
					chargeSkill: true,
					forced: true,
					trigger: { global: "gainAfter" },
					filter: function (event, player) {
						if (event.getParent(1).name != "lichangmrfz_dam") return false;
						return (
							event.fromStorage == true ||
							game.hasPlayer2(function (current) {
								var evt = event.getl(current);
								return evt && evt.xs && evt.xs.length > 0;
							})
						);
					},
					content: function () {
						player.addMark("charge");
						//var str='';
						//str+=get.translation(event)+'</br>';
						//for(var i=1;i<=10;i++) str+=get.translation(event.getParent(i))+'</br>';
						//game.log(str);
						//player.popup(str);
					},
				},
				dam: {
					audio: "lichangmrfz",
					forced: true,
					trigger: { global: "damageEnd" },
					filter: function (event, player) {
						return event.hujia && event.player.getExpansions("lichangmrfz").length > 0;
					},
					content: function () {
						var cards = trigger.player.getExpansions("lichangmrfz");
						trigger.player.gain(cards, "gain2");
					},
				},
				da: {
					trigger: { global: "phaseBegin" },
					filter: function (event, player) {
						return player.countMark("charge") >= 3;
					},
					direct: true,
					content: function () {
						"step 0";
						player.chooseTarget(
							get.prompt("lichangmrfz"),
							"【力场】:你可以选择三名角色，令其各从牌堆或弃牌堆中获得一张装备牌",
							[1, 3]
						).ai = function (target) {
							return get.attitude(player, target) > 0;
						};
						("step 1");
						if (result.bool) {
							player.removeMark("charge", player.countMark("charge"));
							player.logSkill("lichangmrfz");
							event.targets = result.targets;
							event.num = 0;
							event.num2 = result.targets.length;
						} else event.finish();
						("step 2");
						var card = get.cardPile(function (card) {
							return get.type(card) == "equip";
						});
						event.card = card;
						var list = game.filterPlayer(function (target) {
							return target != player && target.hasSkill("lichangmrfz");
						});
						var str = "【力场】:你可以将此牌交给" + get.translation(list);
						if (list.length > 1) str += "其中一人";
						str += ",或取消自己装备此牌";
						event.targets[event.num].gain(card, "gain");
						event.targets[event.num].chooseTarget(str, function (card, player, target) {
							return target != event.targets[event.num] && target.hasSkill("lichangmrfz");
						}).ai = function (target) {
							var player = event.targets[event.num];
							if (get.attitude(player, target) <= 0) return 0;
							return get.attitude(player, target) >= 0;
						};
						("step 3");
						if (result.bool) {
							if (
								event.targets[event.num].hasCard(function (card) {
									return card == event.card;
								}, "h")
							)
								event.targets[event.num].give(event.card, player);
							event.targets[event.num].recover();
						} else if (
							event.targets[event.num].hasCard(function (card) {
								return card == event.card;
							}, "h")
						)
							event.targets[event.num].chooseUseTarget(event.card, true);
						if (event.num < event.num2 - 1) {
							event.num++;
							event.goto(2);
						}
					},
				},
			},
			ai: {
				threaten: 1.2,
				order: function () {
					var player = _status.event.player;
					if (player.hp <= 2) return 13;
					return 1;
				},
				result: {
					player: 1,
					target: 1,
				},
			},
		},
		lichangmrfz2: {
			charlotte: true,
		},
		jiushumrfz: {
			audio: 2,
			enable: "chooseToUse",
			filter: function (event, player) {
				if (
					player.countCards("he", function (card) {
						return get.color(card) == "black";
					}) == 0
				)
					return false;
				return player.isPhase("phaseJudge", false) || player.isPhase("phaseZhunbei", false);
			},
			filterCard: function (card) {
				return get.color(card) == "black";
			},
			viewAsFilter: function (player) {
				if (!player.isPhase("phaseJudge", false) && !player.isPhase("phaseZhunbei", false)) return false;
				return player.countCards("he", { color: "black" }) > 0;
			},
			viewAs: { name: "wuxie" },
			position: "he",
			prompt: "将一张黑色牌当无懈可击使用",
			check: function (card) {
				var tri = _status.event.getTrigger();
				if (tri && tri.card && tri.card.name == "chiling") return -1;
				return 8 - get.value(card);
			},
		},
		yubimrfz: {
			global: "yubimrfz_eff",
			subSkill: {
				eff: {
					charlotte: true,
					mod: {
						maxHandcard: function (player, num) {
							return num + Math.min(player.hujia, 5);
						},
					},
				},
			},
		},

		//玛露希尔
		kumomrfz: {
			audio: 2,
			trigger: {
				player: "useCardAfter",
			},
			filter(event, player) {
				if (!player.isPhaseUsing()) return false;
				return event.card && get.type(event.card) == "trick";
			},
			forced: true,
			async content(event, trigger, player) {
				if (!player.getStat("card").sha) player.getStat("card").sha = 0;
				player.getStat("card").sha++;
			},
			mod: {
				cardEnabled(card, player) {
					if (get.type(card) == "trick" && player.getCardUsable("sha") < 1) return false;
				},
				cardUsable: function (card, player, num) {
					if (card.name != "sha") return;
					if (!_status.kumomrfz_tmp) {
						_status.kumomrfz_tmp = true;
						const count = player.getCardUsable("sha");
						_status.kumomrfz_tmp = false;
						if (player.isPhaseUsing() && count >= player.maxHp) {
							return player.maxHp;
						}
					}
					return;
				},
			},
			ai: {
				combo: "cainvmrfz",
				threaten: 0.8,
			},
		},
		cainvmrfz: {
			audio: 2,
			trigger: {
				player: "useCardToPlayered",
			},
			filter(event, player) {
				if (event.getParent().triggeredTargets3.length > 1) return false;
				return event.card && get.type(event.card) == "trick" && player.getCardUsable("sha") > 0;
			},
			prompt(event, player) {
				return `【才女】:是否令${get.translation(event.card)}额外结算${Math.min(player.maxHp, player.getCardUsable("sha"))}次？`;
			},
			async content(event, trigger, player) {
				const num = Math.min(player.getCardUsable("sha"), player.maxHp);
				trigger.getParent().effectCount += num;
			},
			group: "cainvmrfz_trick",
			subSkill: {
				trick: {
					hiddenCard: function (player, name) {
						if (player.getStat("skill").cainvmrfz_trick && player.getStat("skill").cainvmrfz_trick >= player.maxHp) return false;
						return player.countCards("hes", "sha") < 1 && !lib.inpile.includes(name) && get.type(name) != "trick";
					},
					audio: "cainvmrfz",
					enable: "chooseToUse",
					filter: function (event, player) {
						if (player.getStat("skill").cainvmrfz_trick && player.getStat("skill").cainvmrfz_trick >= player.maxHp) return false;
						return (
							player.hasCard(card =>
								lib.inpile.some(name => {
									if (get.name(card) != "sha") return false;
									if (get.type(name) != "trick") return false;
									if (event.filterCard({ name: name, isCard: true, cards: [card] }, player, event)) return true;
									return false;
								}, "hes")
							) > 0
						);
					},
					chooseButton: {
						dialog: function (event, player) {
							var list = [];
							for (var name of lib.inpile) {
								if (get.type(name) == "trick") {
									list.push([get.translation(get.type(name)), "", name]);
								}
							}
							return ui.create.dialog("才女", [list, "vcard"]);
						},
						filter: function (button, player) {
							return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
						},
						check: function (button) {
							var player = _status.event.player;
							var card = { name: button.link[2], nature: button.link[3] };
							if (player.countCards("hes", cardx => cardx.name == card.name)) return 0;
							return _status.event.getParent().type == "phase" ? player.getUseValue(card) : 1;
						},
						backup: function (links, player) {
							return {
								audio: "cainvmrfz",
								filterCard(card) {
									return card.name == "sha";
								},
								popname: true,
								check: function (card) {
									return 7 - get.value(card);
								},
								position: "hes",
								viewAs: { name: links[0][2], nature: links[0][3] },
							};
						},
						prompt: function (links, player) {
							return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
						},
					},
					ai: {
						order: 13,
						threaten: 1.8,
						result: {
							player: 1,
						},
					},
				},
			},
		},
		cangshumrfz: {
			audio: 2,
			trigger: { player: ["phaseUseEnd", "phaseUseBegin"] },
			intro: {
				content(event, player) {
					const storage = player.storage.cangshumrfz;
					if (storage.index == 0) return `下个出牌阶段开始时摸${storage.num}张牌`;
					return `下个出牌阶段阶段使用【杀】的次数+1`;
				},
			},
			filter(event, player) {
				return get.is.object(player.storage.cangshumrfz) || player.getCardUsable("sha") > 0;
			},
			async cost(event, trigger, player) {
				if (event.triggername == "phaseUseBegin") {
					if (!event.result) event.result = {};
					event.result.bool = get.is.object(player.storage.cangshumrfz);
					return;
				} else if (player.getCardUsable("sha") < 1) {
					if (!event.result) event.result = {};
					event.result.bool = false;
					return;
				}
				event.result = await player
					.chooseControl("选项一", "选项二", "cancel2")
					.set("choiceList", [`摸${Math.min(player.getCardUsable("sha"), player.maxHp)}张牌`, `使用【杀】的次数+1`])
					.set("ai", () => {
						const player = get.player();
						const num = player.getCardUsable("sha");
						return num > 1 ? 0 : 1;
					})
					.forResult();
				event.result.cost_data = event.result.index;
			},
			async content(event, trigger, player) {
				if (event.triggername == "phaseUseBegin") {
					const result = player.storage.cangshumrfz;
					if (result["index"] == 0) {
						player.draw(result["num"]);
					} else player.addTempSkill("cangshumrfz_sha", { player: "phaseUseEnd" });
					delete player.storage.cangshumrfz;
					player.unmarkSkill("cangshumrfz");
					return;
				}
				const index = event.cost_data;
				player.storage.cangshumrfz = {
					index: index,
					num: index === 0 ? Math.min(player.getCardUsable("sha"), player.maxHp) : 1,
				};
				player.markSkill("cangshumrfz");
			},
			subSkill: {
				sha: {
					charlotte: true,
					mod: {
						cardUsable(card, player, num) {
							if (card.name == "sha") return num + 1;
						},
					},
				},
			},
		},

		// 新霍尔海雅
		xinkuangyumrfz: {
			audio: "kuangyumrfz",
			trigger: {
				player: "useCard2",
			},
			filter(event, player) {
				if (get.type(event.card) == "delay" || get.type(event.card) == "equip") return false;
				return game.hasPlayer(function (target) {
					if (event.targets.includes(target)) return false;
					if (!player.canUse(event.card, target)) return false;
					return true;
				});
			},
			async cost(event, trigger, player) {
				if (event.result) event.result = {};
				event.result = await player
					.chooseTarget(get.prompt2("xinkuangyumrfz"), [1, Infinity], function (card, player, target) {
						var cardx = _status.event.cardx;
						if (!player.canUse(cardx, target)) return false;
						var targets = _status.event.targets.slice(0).concat(ui.selected.targets);
						if (targets.includes(target)) return false;
						return true;
					})
					.set("promptbar", "none")
					.set("cardx", trigger.card)
					.set("targets", trigger.targets)
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, _status.event.cardx, player, player);
					})
					.forResult();
			},
			async content(event, trigger, player) {
				const targets = event.targets;
				if (!player.storage.xinkuangyumrfz_trigger) player.storage.xinkuangyumrfz_trigger = [];
				player.storage.xinkuangyumrfz_trigger.add(trigger.card);
				trigger.targets.addArray(targets);
				player.addTempSkill("xinkuangyumrfz_trigger");
			},
			subSkill: {
				trigger: {
					trigger: {
						player: ["shaMiss", "eventNeutralized"],
					},
					charlotte: true,
					silent: true,
					filter(event, player) {
						return player.storage.xinkuangyumrfz_trigger && player.storage.xinkuangyumrfz_trigger.includes(event.card);
					},
					content() {
						trigger.getParent().excluded.addArray(trigger.getParent().targets);
					},
					group: "xinkuangyumrfz_remove",
				},
				remove: {
					trigger: {
						player: ["useCardAfter", "useCardCancelled"],
					},
					silent: true,
					charlotte: true,
					filter: function (event, player) {
						return player.storage.xinkuangyumrfz_trigger && player.storage.xinkuangyumrfz_trigger.includes(event.card);
					},
					content: function () {
						player.storage.xinkuangyumrfz_trigger.remove(trigger.card);
					},
				},
			},
		},
		xinchuanzhongmrfz: {
			audio: "chuangzhongmrfz",
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			filter(event, player) {
				return player.storage.xinchuanzhongmrfz_mark && player.storage.xinchuanzhongmrfz_mark.length > 0;
			},
			forced: true,
			async content(event, trigger, player) {
				let nums = player.storage.xinchuanzhongmrfz_mark.length;
				const indexs = [];
				while (nums > 0) {
					let list = Array.from({ length: nums + 1 }, (_, index) => index);
					let prompt = `请为%%%选择一个自然数`;
					if (indexs.length == 0) prompt = prompt.replace("%%%", "X(摸牌数)");
					else if (indexs.length == 1) prompt = prompt.replace("%%%", "Y(额外使用杀)");
					else if (indexs.length == 2) prompt = prompt.replace("%%%", "Z(计算与其他角色的距离)");
					const { result } = await player
						.chooseControl(list)
						.set("prompt", prompt)
						.set("ai", () => {
							let player = get.player(),
								nums = get.event().nums,
								indexs = get.event().indexs;
							switch (indexs.length) {
								case 0:
									return player.countCards("hs", card => get.tag(card, "damage") > 0 || get.type(card) == "trick") > 1 ? 0 : nums;
								case 1:
									return player.countCards("e", "sha") > 1 ? 1 : 0;
								case 2:
									return game.hasPlayer(current => get.attitude2(current) < 0) ? 0 : nums;
								default:
									return nums;
							}
						})
						.set("nums", nums)
						.set("indexs", indexs);
					nums -= result.index;
					indexs.push(result.index);
				}
				if (indexs[0] && indexs[0] > 0) player.draw(indexs[0]);
				if (indexs[1] && indexs[1] > 0) player.addMark("xinchuanzhongmrfz_sha", indexs[1], false);
				if (indexs[2] && indexs[2] > 0) player.addMark("xinchuanzhongmrfz_distance", indexs[2], false);
				player.addTempSkill("xinchuanzhongmrfz_sha", { player: "phaseEnd" });
				player.addTempSkill("xinchuanzhongmrfz_distance", { player: "phaseEnd" });
			},
			group: "xinchuanzhongmrfz_mark",
			subSkill: {
				distance: {
					onremove: true,
					mod: {
						globalFrom(from, to, distance) {
							return distance - from.countMark("xinchuanzhongmrfz_distance");
						},
					},
				},
				sha: {
					onremove: true,
					mod: {
						cardUsable(card, player, num) {
							if (card.name == "sha") return num + player.countMark("xinchuanzhongmrfz_sha");
						},
					},
				},
				mark: {
					charlotte: true,
					silent: true,
					trigger: {
						player: "phaseEnd",
					},
					async content(event, trigger, player) {
						player.storage.xinchuanzhongmrfz_mark = [];
						player.getHistory("useCard", function (evt) {
							player.storage.xinchuanzhongmrfz_mark.add(get.type2(evt.card));
						});
					},
				},
			},
		},

		//异格推王 维娜维多利亚
		zhongyuanmrfz: {
			audio: 2,
			trigger: { global: "roundStart" },
			filter(event, player) {
				return Object.keys(window.whichWaySave.weinaData.HMS).filter(i => !player.hasSkill(i)).length > 0;
			},
			frequent: true,
			async content(event, trigger, player) {
				const data = window.whichWaySave.weinaData;
				let tmp = {
					triggers: Object.keys(data.trigger.get().translation).randomGets(3),
					filter: Object.keys(data.filter).randomGets(3),
					content: Object.keys(data.content.get()).randomGets(3),
				};
				let random = {
					num: data.x[Object.keys(data.x).randomGet()],
					phase: data.getPhase(),
					name: data.getName(),
				};
				let info = { ...data.getInfo(data, null, {}, random), ...data.trigger.get().translation };
				let result = {};
				for (let i of Object.keys(tmp)) {
					let values = tmp[i];
					const { index } = await player
						.chooseControl()
						.set("choiceList", [...values.map(i => info[i])])
						.forResult();
					let key = values[index];
					result[i] = {
						trans: info[key],
						effect: data.findKey(i, key),
						key: key,
					};
				}
				let skillname = Object.keys(data.HMS)
					.filter(i => !player.hasSkill(i))
					.randomGet();
				lib.translate[skillname] = data.HMS[skillname];
				lib.translate[skillname + "_info"] =
					"每回合限一次，" + result.triggers.trans + ",若" + result.filter.trans + ",你可以" + result.content.trans;

				if (!_status.weinaData) _status.weinaData = {};
				_status.weinaData[skillname] = {
					result: result,
					data: data,
					random: random,
					tmp: tmp,
				};

				lib.skill[skillname] = {
					onremove(player, skill) {
						delete _status.weinaData[skill];
					},
					usable: 1,
					trigger: { player: Object.keys(result.triggers.effect[0])[0] },
					weinaName: skillname,
					filter(event, player) {
						let name = this.weinaName;
						let filter = _status.weinaData[name].data.findKey(
							_status.weinaData[name].result.filter,
							Object.keys(_status.weinaData[name].tmp)[1]
						)[0].filter;
						return filter(event, player, name);
					},
					async content(event, trigger, player) {
						let name = event.name;
						let contents = _status.weinaData[name].data.findKey(
							_status.weinaData[name].result.content,
							_status.weinaData[name].result.content.key
						)[0][_status.weinaData[name].result.content.key].content;
						var next = game.createEvent("weinaNext");
						next.player = player;
						next.name = name;
						next.weinaData = {
							num: _status.weinaData[name].random.num.num(event, player),
							name: _status.weinaData[name].random.name,
							phase: _status.weinaData[name].random.phase,
						};
						next.setContent(contents);
					},
					ai: {
						threaten: 0.8,
					},
				};
				player.addSkill(skillname);
			},
		},
		futumrfz: {
			audio: 2,
			forced: true,
			trigger: {
				player: "useCard",
			},
			getSkillsTrigger(target) {
				let skills = target.getSkills(null, false, false).filter(skill => {
					var info = get.info(skill);
					if (get.skillInfoTranslation(skill, target).length == 0) return false;
					return true;
				});
				let triggers = [];
				let suffixes = ["Begin", "End", "After", "Start", "Before"];
				for (let skill of skills) {
					let trigger = get.info(skill).trigger;
					for (let key in trigger) {
						if (!Array.isArray(trigger[key])) {
							for (let suffix of suffixes) {
								if (trigger[key].includes(suffix)) triggers.add(trigger[key].replace(suffix, ""));
							}
						} else
							triggers.addArray(
								trigger[key].map(i => {
									for (let suffix of suffixes) {
										i = i.replace(suffix, "");
									}
								})
							);
					}
				}
				return triggers;
			},
			filter: function (event, player) {
				return (
					event.card &&
					(get.type(event.card) == "trick" ||
						(get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name))) &&
					game.hasPlayer(function (current) {
						return (
							current != player &&
							lib.skill.futumrfz.getSkillsTrigger(current).some(i => lib.skill.futumrfz.getSkillsTrigger(player).includes(i))
						);
					})
				);
			},
			async content(event, trigger, player) {
				trigger.directHit.addArray(
					game.filterPlayer(function (current) {
						return (
							current != player &&
							lib.skill.futumrfz.getSkillsTrigger(current).some(i => lib.skill.futumrfz.getSkillsTrigger(player).includes(i))
						);
					})
				);
			},
		},
		wangximrfz: {
			audio: 2,
			trigger: { global: "damageBegin3" },
			filter(event, player) {
				return event.player === player || get.distance(player, event.player) < 2;
			},
			async cost(event, trigger, player) {
				let skillList = player.getSkills(null, false, false).filter(skill => {
					let info = get.info(skill);
					if (get.skillInfoTranslation(skill, player).length === 0 || !info || info.charlotte) return false;
					return true;
				});
				event.result = await player
					.chooseControl(skillList, "cancel2")
					.set(
						"prompt",
						`你可以失去一个技能令此伤害对${trigger.player === player ? "你" : get.translation(trigger.player)}无效并令其摸两张牌`
					)
					.set("ai", () => {
						let event = get.event();
						let player = get.player();
						let target = get.event().target;
						let skillList = get.event().skillList;
						if (get.attitude2(target) < 0) return "cancel2";
						if (target.hp - event.num < 1)
							return skillList.sort((a, b) => {
								return get.skillthreaten(b) - get.skillthreaten(a);
							})[0];
						return (
							skillList
								.filter(skill => get.skillthreaten(skill) < 1)
								.sort((a, b) => {
									return get.skillthreaten(b) - get.skillthreaten(a);
								})[0] || "cancel2"
						);
					})
					.set("target", trigger.player)
					.set("skillList", skillList)
					.forResult();
				event.result.cost_data = event.result.control;
			},
			async content(event, trigger, player) {
				let skill = event.cost_data;
				game.log(player, "失去了", `#g【${get.translation(skill)}】`);
				player.removeSkill(skill);
				trigger.player.draw(2);
				trigger.cancel();
			},
			ai: {
				threaten: 1.1,
			},
		},

		// 荒芜拉普兰德
		shilangmrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "phaseEnd" },
			filter: function (event, player) {
				return player.storage.phaseHistory;
			},
			async content(event, trigger, player) {
				const phaseHistory = player.storage.phaseHistory;
				if (lib.phaseName.isSubset(Object.keys(phaseHistory))) player.draw();
				else player.loseHp();
			},
		},
		toulangmrfz: {
			audio: 2,
			trigger: {
				global: ["damageEnd", "useSkill", "logSkillBegin", "useCard", "respond"],
			},
			init(player, skill) {
				game.broadcastAll(() => {
					lib.translate["visible_toulangmrfz"] = "明置";
				});
				player.storage[skill] = {
					damage: false,
					useSkill: false,
				};
			},
			onremove: true,
			forced: true,
			filter(event, player) {
				if (event.name == "damage") {
					return (
						!player.storage.toulangmrfz[event.name] &&
						event.player &&
						event.player.isIn() &&
						event.player.countCards("h", card => !get.is.shownCard(card)) > 0
					);
				} else {
					if (["global", "equip"].includes(event.type)) return false;
					let skill = get.sourceSkillFor(event);
					if (!skill || skill === "toulangmrfz") return false;
					let info = get.info(skill);
					while (true) {
						if (!info || info.charlotte || info.equipSkill) return false;
						if (info && !info.sourceSkill) break;
						skill = info.sourceSkill;
						info = get.info(skill);
					}
					return (
						!player.storage.toulangmrfz["useSkill"] &&
						event.player &&
						event.player.isIn() &&
						event.player.countCards("h", card => !get.is.shownCard(card)) > 0
					);
				}
				return false;
			},
			async content(event, trigger, player) {
				let target = trigger.player;
				player.storage.toulangmrfz[trigger.name === "damage" ? trigger.name : "useSkill"] = true;
				const { cards } = await target
					.chooseCard(true, "h", card => !get.is.shownCard(card), [1, 2])
					.set("prompt", `【头狼】:请明置1-2张手牌`)
					.set("ai", card => {
						return -get.value(card);
					})
					.forResult();
				if (!cards) return;
				target.addShownCards(cards, "visible_toulangmrfz");
			},
			group: "toulangmrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					lastDo: true,
					trigger: { global: "roundStart" },
					content() {
						player.storage["toulangmrfz"] = {
							damage: false,
							useSkill: false,
						};
					},
				},
			},
		},
		/** @type { Skill } */
		kuanglangmrfz: {
			audio: 2,
			enable: "chooseToUse",
			hiddenCard(player, name) {
				return (
					get
						.inpileVCardList(info => {
							const name = info[2];
							return get.type(name) === "basic" || (get.type(name) === "trick" && get.isSingle(name));
						})
						.map(i => i[2])
						.includes(name) &&
					game.hasPlayer(current => {
						return current.countCards("ej") > 0 || current.countCards("h", card => get.is.shownCard(card)) > 0;
					})
				);
			},
			onChooseToUse(event) {
				let player = get.player();
				event.kuanglangmrfz_list = get
					.inpileVCardList(info => {
						const name = info[2];
						return get.type(name) === "basic" || (get.type(name) === "trick" && get.isSingle(name));
					})
					.filter(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
			},
			filter(event, player) {
				return (
					game.hasPlayer(current => {
						return current.countCards("ej") > 0 || current.countCards("h", card => get.is.shownCard(card)) > 0;
					}) && event.kuanglangmrfz_list.length > 0
				);
			},
			filterTarget(card, player, target) {
				return target.countCards("ej") > 0 || target.countCards("h", card => get.is.shownCard(card)) > 0;
			},
			prompt(event, player) {
				return `你可以将场上或明置的牌当作一张基本牌或单一目标的普通锦囊`;
			},
			async content(event, trigger, player) {
				const target = event.targets[0];
				if (
					!target.countGainableCards(
						player,
						"hej",
						card => get.is.shownCard(card) || get.position(card) === "e" || get.position(card) === "j"
					)
				)
					return;
				const { links: links2 } = await player
					.choosePlayerCard("hej", target, true)
					.set("filterButton", button => {
						return get.position(button.link) === "e" || get.position(button.link) === "j" || get.is.shownCard(button.link);
					})
					.set("target", target)
					.set("complexSelect", false)
					.set("ai", lib.card.shunshou.ai.button)
					.forResult();
				const list = event.getParent(2).kuanglangmrfz_list;
				const { links } = await player
					.chooseButton(["狂狼", [list, "vcard"]], true)
					.set("ai", button => {
						return get.event().player.getUseValue({
							name: button.link[2],
							nature: button.link[3],
						});
					})
					.forResult();

				const evt = event.getParent(2);
				let name = links[0][2],
					nature = links[0][3];
				game.broadcastAll(
					function (result, name, nature) {
						lib.skill.kuanglangmrfz_backup.viewAs = {
							name: name,
							nature: nature,
							cards: result,
						};
						lib.skill.kuanglangmrfz_backup.prompt = "选择" + get.translation(name) + "（" + get.translation(result) + "）的目标";
					},
					links2,
					name,
					nature
				);
				evt.set("_backupevent", "kuanglangmrfz_backup");
				evt.backup("kuanglangmrfz_backup");
				evt.set("openskilldialog", "选择" + get.translation(name) + "（" + get.translation(links2) + "）的目标");
				evt.set("norestore", true);
				evt.set("custom", {
					add: {},
					replace: { window() {} },
				});
				evt.goto(0);
			},
			ai: {
				threaten: 2,
				order: 6,
				result: {
					player(player, target) {
						let val = 1,
							att = get.attitude(player, target);
						if (player.countCards("j") > 0 && target === player) return 114514;
						if (att > 0 && target.countCards("j") > 0) val += 5;
						if (
							att <= 0 &&
							target.countCards("j") > 0 &&
							target.countCards("e") < 1 &&
							target.countCards("h", card => get.is.shownCard(card)) < 1
						)
							val -= 5;
						if (att > 0) val -= 0.5;
						if (att <= 0) val += 1;
						if (target === player) val -= 0.9;
						return val;
					},
				},
			},
		},
		kuanglangmrfz_backup: {
			sourceSkill: "kuanglangmrfz",
			precontent() {
				"step 0";
				delete event.result.skill;
				var cards = event.result.card.cards;
				event.result.cards = cards;
				var owner = get.owner(cards[0]);
				event.target = owner;
				owner.$give(cards[0], player, false);
				player.popup(event.result.card.name, "metal");
				game.delayx();
			},
			filterCard() {
				return false;
			},
			prompt: "114514",
			selectCard: -1,
		},

		// 忍冬
		yinhumrfz: {
			mod: {
				ignoredHandcard: function (card, player) {
					if (card.hasGaintag("yinhumrfz") && get.name(card) === "sha") {
						return true;
					}
				},
				cardDiscardable: function (card, player, name) {
					if (name == "phaseDiscard" && card.hasGaintag("yinhumrfz") && get.name(card) === "sha") return false;
				},
			},
			audio: 2,
			direct: true,
			forced: true,
			intro: {
				content: "连续#个回合没有造成伤害",
			},
			trigger: {
				player: ["phaseZhunbeiBegin", "phaseEnd"],
			},
			filter(event, player) {
				return event.name === "phase" ? true : player.countMark("yinhumrfz") + 1 > 0;
			},
			async content(event, trigger, player) {
				if (trigger.name === "phase") {
					if (player.getHistory("sourceDamage").length < 1) player.addMark("yinhumrfz", 1, false);
					else player.removeMark("yinhumrfz", player.countMark("yinhumrfz"), false);
				} else {
					//@ts-ignore
					player.logSkill("yinhumrfz");
					let num = player.countMark("yinhumrfz") + 1;
					switch (num) {
						case 3:
							player.addTempSkill("yinhumrfz_addcount", { player: "phaseZhunbeiBegin" });
						case 2:
							player.addTempSkill("reweimu", { player: "phaseZhunbeiBegin" });
						case 1:
							const { result } = await player.draw(num);
							for (let card of result) {
								if (get.name(card) === "sha") card.addGaintag("yinhumrfz");
							}
							break;
					}
				}
			},
			subSkill: {
				addcount: {
					charlotte: true,
				},
			},
		},
		zhuixiongmrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 2,
			filter(event, player) {
				let count = Object.keys(player.getStat("skill")).includes("zhuixiongmrfz") ? player.getStat("skill").zhuixiongmrfz : 0;
				if (count > 0 && !player.hasSkill("yinhumrfz_addcount")) return false;
				return game.hasPlayer(current => player.canUse("juedou", current) && player.inRange(current));
			},
			filterTarget(card, target, player) {
				return target != player && !!player.canUse("juedou", target) && player.inRange(target);
			},
			async content(event, trigger, player) {
				player.useCard({ name: "juedou", zhuixiongmrfz: true }, true, event.targets[0]);
			},
			group: ["zhuixiongmrfz_nowuxie", "zhuixiongmrfz_damage"],
			subSkill: {
				nowuxie: {
					audio: false,
					trigger: {
						player: "useCard",
					},
					silent: true,
					charlotte: true,
					filter: function (event) {
						return event.card && event.card.zhuixiongmrfz;
					},
					content: function () {
						trigger.nowuxie = true;
					},
				},
				damage: {
					audio: false,
					silent: true,
					charlotte: true,
					trigger: { global: "damageBegin3" },
					filter(event, player) {
						let evt = event.getParent();
						return event.card && event.card.zhuixiongmrfz && evt && [...evt.targetCards, ...evt.playerCards].length > 0;
					},
					async content(event, trigger, player) {
						let evt = trigger.getParent();
						let num = [...evt.targetCards, ...evt.playerCards].length;
						trigger.num += num;
					},
				},
			},
			ai: {
				order: 6,
				result: {
					target(player, target) {
						if (get.attitude2(target) > 0) return 0;
						return target.countCards("h", "sha") > player.countCards("h", "sha") ? 0 : -1;
					},
				},
			},
		},

		// 弑君者
		fengyanmrfz: {
			onremove(player) {
				for (let i of game.players) {
					i.removeSkill("xingxingmrfz");
				}
				game.broadcastAll(function () {
					// whitherHelm.setBgI();
				});
			},
			audio: 2,
			derivation: ["xingxingmrfz"],
			trigger: { player: "phaseUseBegin" },
			filter(event, player) {
				return player.countCards("he", card => get.type(card) != "basic") > 0;
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseCardTarget({
						prompt: "是否发动【烽烟】？",
						prompt2: "你可以弃置一张非基本牌并选择至多三名角色，令其获得【行刑】",
						filterCard(card) {
							return get.type(card) != "basic";
						},
						filterTarget: true,
						selectTarget: [1, 3],
						position: "he",
						ai1(card) {
							return 8 - get.value(card);
						},
						ai2(target) {
							let player = get.player();
							return get.attitude(player, target) > 0;
						},
					})
					.forResult();
				event.result.cost_data = {
					cards: event.result.cards,
					targets: event.result.targets,
				};
			},
			async content(event, trigger, player) {
				const { cards, targets } = event.cost_data;
				await player.discard(cards);
				for (let target of targets) {
					target.addSkill("xingxingmrfz");
				}
				player.addTempSkill("fengyanmrfz_expire", { player: "phaseUseBegin" });
				game.broadcastAll(function () {
					ui.background.setBackgroundImage("extension/WhichWay/image/skill/fengyanmrfz.jpg");
				});
			},
			subSkill: {
				expire: {
					charlotte: true,
					onremove(player) {
						for (let i of game.players) {
							i.removeSkill("xingxingmrfz");
						}
						game.broadcastAll(function () {
							// whitherHelm.setBgI();
						});
					},
				},
			},
		},
		xingxingmrfz: {
			global: "xingxingmrfz_effect",
			audio: 2,
			direct: true,
			trigger: { global: "phaseEnd" },
			filter(event, player) {
				return event.player && event.player.isIn() && !event.player.hasSkill("xingxingmrfz");
			},
			async content(event, trigger, player) {
				player
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") return false;
							return lib.filter.filterCard.apply(this, arguments);
						},
						"【行刑】:是否对" + get.translation(trigger.player) + "使用一张杀？"
					)
					.set("logSkill", "xingxingmrfz")
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", trigger.player);
			},
			subSkill: {
				effect: {
					audio: false,
					forced: true,
					trigger: { player: "damageBegin3" },
					filter(event, player) {
						return !event.source || !event.source.hasSkill("xingxingmrfz");
					},
					async content(event, trigger, player) {
						player.logSkill("xingxingmrfz");
						const { color } = await player
							.judge(function (card) {
								var color = get.color(card);
								if (color == "black") return -4;
								return 0;
							})
							.forResult();
						if (color !== "black") trigger.cancel();
					},
				},
			},
		},
		weimingmrfz: {
			mod: {
				targetEnabled(card, player, target) {
					if (!player.getEquip(1) && get.tag(card, "damage") && get.type(card) === "trick") return false;
				},
			},
			audio: 2,
			forced: true,
			trigger: { player: "useCard" },
			filter(event, player) {
				return (
					event.card &&
					(get.type(event.card) == "trick" ||
						(get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name))) &&
					game.hasPlayer(function (current) {
						return current != player && !current.getEquip(2);
					})
				);
			},
			content() {
				trigger.directHit.addArray(
					game.filterPlayer(function (current) {
						return current != player && !current.getEquip(2);
					})
				);
			},
			group: ["weimingmrfz_get"],
			subSkill: {
				get: {
					audio: "weimingmrfz",
					forced: true,
					trigger: { source: "damageEnd" },
					filter(event, player) {
						return (
							event.player &&
							event.player.isIn() &&
							event.player.countCards("he") > 0 &&
							!event.player.getEquip(3) &&
							!event.player.getEquip(4)
						);
					},
					async content(event, trigger, player) {
						const { cards } = await trigger.player
							.chooseCard("he", true)
							.set("prompt", `请交给${get.translation(player)}一张牌`)
							.set("ai", card => -get.value(card))
							.forResult();
						if (!cards) return;
						player.gain(cards);
					},
				},
			},
		},

		// 新风笛
		newjuntongmrfz: {
			audio: "juntongmrfz",
			init(player, skill) {
				player.storage[skill] = [];
			},
			trigger: {
				player: ["phaseDrawBegin", "useCard"],
				global: "roundStart",
			},
			filter(event, player) {
				if (event.name === "useCard") {
					const cards = player.storage.newjuntongmrfz;
					return (
						!cards.includes(get.name(event.card)) &&
						(get.type(event.card) === "basic" || (get.isSingle(event.card) && get.type(event.card) === "trick"))
					);
				} else return true;
				return false;
			},
			forced: true,
			async content(event, trigger, player) {
				if (trigger.name === "useCard") {
					player.storage.newjuntongmrfz.push(get.name(trigger.card));
				} else if (trigger.name === "phaseDraw") trigger.cancel();
				else player.draw(3);
			},
			mod: {
				targetInRange: function (card, player, target, now) {
					if (
						!player.storage.newjuntongmrfz.includes(get.name(card)) &&
						(get.type(card) === "basic" || (get.isSingle(card) && get.type(card) === "trick"))
					)
						return true;
				},
				selectTarget: function (card, player, range) {
					if (
						!player.storage.newjuntongmrfz.includes(get.name(card)) &&
						range[1] != -1 &&
						(get.type(card) === "basic" || (get.isSingle(card) && get.type(card) === "trick"))
					)
						range[1]++;
				},
			},
		},
		newpochengmrfz: {
			audio: "pochengmrfz",
			trigger: {
				player: "useCard2",
				source: "dieAfter",
			},
			filter(event, player) {
				if (event.name === "useCard") return get.name(event.card) === "sha";
				else return true;
			},
			async cost(event, trigger, player) {
				event.result = {};
				if (trigger.name === "useCard") {
					let list = ["额外目标", "额外结算", "cancel2"];
					if (
						!game.hasPlayer(current => {
							return player.canUse(trigger.card, current) && !trigger.targets.includes(current);
						})
					)
						list.remove("额外目标");
					let prompt = "【破城】:你可以令此杀额外结算一次或额外指定一个目标";
					if (!list.includes("额外目标")) prompt.replace("或额外指定一个目标", "");
					const { control } = await player
						.chooseControl(list)
						.set("prompt", prompt)
						.set("ai", () => {
							let list = get.event().list,
								card = get.event().card,
								targets = get.event().targets,
								player = get.player();
							if (
								!list.includes("额外目标") ||
								!game.hasPlayer(current => get.attitude2(current) < 0 && !targets.includes(current) && player.canUse(card, current))
							)
								return "额外结算";
							if (targets.some(i => i.hp < 2)) return "额外结算";
							return Math.random() > 0.5 ? "额外结算" : "额外目标";
						})
						.set("list", list)
						.set("targets", trigger.targets)
						.set("card", trigger.card)
						.forResult();
					if (control === "cancel2") return (event.result.bool = false);
					else if (control === "额外结算")
						event.result = {
							bool: true,
							cost_data: control,
						};
					else {
						const { targets } = await player
							.chooseTarget(true)
							.set("prompt", `请额外选择一个目标`)
							.set("filterTarget", (card, player, target) => {
								let targets = get.event().targets,
									cardx = get.event().cardx;
								return player != target && player.canUse(cardx, target) && !targets.includes(target);
							})
							.set("ai", target => get.attitude2(target) < 0)
							.set("targets", trigger.targets)
							.set("cardx", trigger.card)
							.forResult();
						event.result = {
							bool: true,
							cost_data: targets,
						};
					}
				} else {
					const { control } = await player
						.chooseControl("cancel2")
						.set("prompt", `请选择一个选项`)
						.set("choiceList", ["发动一次【军统①】", "重置【军统②】"])
						.set("ai", () => {
							let player = get.player();
							return player.storage.newjuntongmrfz.length > 4 ? "选项二" : "选项一";
						})
						.forResult();
					event.result = {
						bool: true,
						cost_data: control,
					};
				}
			},
			async content(event, trigger, player) {
				if (trigger.name === "useCard") {
					console.log(event.cost_data);
					if (event.cost_data === "额外结算") trigger.effectCount++;
					else trigger.targets.push(event.cost_data[0]);
				} else {
					let control = event.cost_data;
					if (control === "选项一") {
						let next = game.createEvent("roundStart", false, { next: [] });
						await game.createTrigger("roundStart", "newjuntongmrfz", player, next);
					} else player.storage.newjuntongmrfz = [];
				}
			},
		},

		// 引星棘刺
		xinxiangmrfz: {
			mod: {
				maxHandcard: function (player, num) {
					return (num = lib.skill.xinxiangmrfz.getLim(player));
				},
			},
			audio: 2,
			mark: true,
			init(player, skill) {
				player.addMark(skill, 5, null);
			},
			onremove(player, skill) {
				delete player.storage.xinxiangmrfz;
				delete player.storage.xinxiangmrfz_tmp;
			},
			getLim(player) {
				return player.countMark("xinxiangmrfz") + player.countMark("xinxiangmrfz_tmp");
			},
			intro: {
				content(event, player) {
					return `当前手牌区上限:${lib.skill.xinxiangmrfz.getLim(player)}<br>临时上限:${player.countMark("xinxiangmrfz_tmp")}`;
				},
			},
			trigger: {
				global: "phaseEnd",
			},
			forced: true,
			filter(event, player) {
				return player.countCards("h") < lib.skill.xinxiangmrfz.getLim(player);
			},
			async content(event, trigger, player) {
				player.drawTo(lib.skill.xinxiangmrfz.getLim(player));
			},
			group: ["xinxiangmrfz_lim", "xinxiangmrfz_start"],
			subSkill: {
				tmp: {
					onremove(player, skill) {
						delete player.storage.xinxiangmrfz_tmp;
						if (player.countCards("h") > player.countMark("xinxiangmrfz")) {
							player.chooseToDiscard(true, "【心相】：请弃置超出上限的手牌").set("selectCard", () => {
								let player = get.player();
								return player.countCards("h") - player.countMark("xinxiangmrfz");
							});
						}
					},
					charlotte: true,
				},
				start: {
					audio: false,
					charlotte: true,
					silent: true,
					trigger: {
						global: "gameDrawBegin",
					},
					filter(event, player) {
						return lib.skill.xinxiangmrfz.getLim(player) < event.num;
					},
					async content(event, trigger, player) {
						var me = player;
						var numx = trigger.num;
						trigger.num =
							typeof numx == "function"
								? function (player) {
										if (player == me) {
											return lib.skill.xinxiangmrfz.getLim(player);
										}
										return numx(player);
									}
								: function (player) {
										if (player == me) {
											return lib.skill.xinxiangmrfz.getLim(player);
										}
										return numx;
									};
					},
				},
				lim: {
					audio: false,
					charlotte: true,
					silent: true,
					trigger: {
						player: ["drawBegin", "gainBegin"],
					},
					filter(event, player) {
						const cards = event.name === "draw" ? event.result : event.cards;
						const nums = lib.skill.xinxiangmrfz.getLim(player);
						return player.countCards("h") + cards.length > nums;
					},
					async content(event, trigger, player) {
						const cards = trigger.name === "draw" ? trigger.result : trigger.cards;
						const nums = lib.skill.xinxiangmrfz.getLim(player);
						if (player.countCards("h") >= nums) {
							trigger.cancel();
						} else {
							const { links: gaincards } = await player
								.chooseButton(["心相:请选择你要获得的牌", cards], true)
								.set("ai", button => get.value(button.link))
								.set("selectButton", () => {
									let player = get.player();
									return lib.skill.xinxiangmrfz.getLim(player) - player.countCards("h");
								})
								.forResult();
							trigger.cancel();
							if (!gaincards) return;
							player.gain(gaincards, event.name === "draw" ? "draw2" : "gain2");
						}
					},
				},
			},
			ai: {
				nogain: true,
				skillTagFilter: function (player) {
					console.log(arguments);
					return player.countCards("h") >= lib.skill.xinxiangmrfz.getLim(player);
				},
			},
		},
		haijiangmrfz: {
			audio: 2,
			trigger: {
				player: "phaseJieshuBegin",
			},
			filter(event, player) {
				return (
					player.countCards("h") > 0 &&
					game.hasPlayer(current => player.canCompare(current) && current != player && player.inRange(current))
				);
			},
			check(event, player) {
				return game.hasPlayer(current => {
					return get.attitude2(current) < 0 && player.canCompare(current) && current != player && player.inRange(current);
				});
			},
			async content(event, trigger, player) {
				const { targets } = await player
					.chooseTarget(true, [1, Infinity])
					.set("filterTarget", (card, player, target) => {
						return player.canCompare(target) && player != target && player.inRange(target);
					})
					.set("ai", target => get.attitude2(target) < 0)
					.forResult();
				if (targets.length) {
					player.chooseToCompare(targets).callback = function () {
						if (event.winner != player) {
							player.chooseToDiscard(true);
						} else {
							event.target.damage();
							player.addMark("xinxiangmrfz_tmp", 1, false);
							player.addTempSkill("xinxiangmrfz_tmp", { player: "phaseJieshuBegin" });
						}
					};
				}
			},
		},
		fanyangmrfz: {
			audio: 2,
			intro: {
				content: "你计算与其他角色的距离-#<br>其他角色计算与你的距离+#",
			},
			trigger: { player: "damageEnd" },
			filter(event, player) {
				return player.countCards("he") > 0 && event.num > 0;
			},
			getIndex(event, player, triggername) {
				return event.num;
			},
			async cost(event, trigger, player) {
				const { bool } = await player
					.chooseToDiscard("he")
					.set("prompt", get.prompt("fanyangmrfz"))
					.set("prompt2", `你可以弃置一张手牌，然后直到你的回合结束时，[你/其他角色]计算与[其他角色/你]的距离[-1/+1]`)
					.set("ai", card => get.value(card) < 8)
					.forResult();
				event.result = {
					bool: bool,
				};
			},
			async content(event, trigger, player) {
				player.addMark("fanyangmrfz", 1, false);
				player.addTempSkill("fanyangmrfz_eff", { player: "phaseEnd" });
			},
			subSkill: {
				eff: {
					charlotte: true,
					onremove(player) {
						delete player.storage.fanyangmrfz;
						player.unmarkSkill("fanyangmrfz");
					},
					mod: {
						globalFrom(from, to, distance) {
							return distance - from.countMark("fanyangmrfz");
						},
						globalTo(from, to, distance) {
							return distance + to.countMark("fanyangmrfz");
						},
					},
				},
			},
		},

		// 余
		zhonglemrfz: {
			init(player) {
				game.broadcastAll(() => {
					lib.translate["zhonglemrfz_tag"] = "判定区";
					lib.card.wugu.content = function () {
						"step 0";
						for (var i = 0; i < ui.dialogs.length; i++) {
							if (ui.dialogs[i].videoId == event.preResult) {
								event.dialog = ui.dialogs[i];
								break;
							}
						}
						if (!event.dialog || event.dialog.buttons.length == 0) {
							event.finish();
							return;
						}
						if (event.dialog.buttons.length > 1) {
							let num = 1;
							if (card.storage && typeof card.storage.extraChooseNum === "number") {
								num += card.storage.extraChooseNum;
							}
							var next = target.chooseButton(true);
							next.set("ai", button => {
								let player = _status.event.player,
									card = button.link,
									val = get.value(card, player);
								if (get.tag(card, "recover")) {
									val += game.countPlayer(target => {
										return target.hp < 2 && get.attitude(player, target) > 0 && lib.filter.cardSavable(card, player, target);
									});
									if (player.hp <= 2 && game.checkMod(card, player, "unchanged", "cardEnabled2", player)) val *= 2;
								}
								return val;
							});
							next.set("selectButton", num);
							next.set("dialog", event.preResult);
							next.set("closeDialog", false);
							next.set("dialogdisplay", true);
						} else {
							event.directButton = event.dialog.buttons;
						}
						("step 1");
						var dialog = event.dialog;
						var cards = [];
						if (event.directButton) {
							cards = event.directButton.map(i => i.link);
						} else {
							for (var i of dialog.buttons) {
								if (result.links.includes(i.link)) {
									cards.push(i.link);
								}
							}
							if (!cards) cards = event.dialog.buttons.map(i => i.link);
						}
						var button,
							buttons = [];
						for (var i = 0; i < dialog.buttons.length; i++) {
							if (cards.includes(dialog.buttons[i].link)) {
								button = dialog.buttons[i];
								button.querySelector(".info").innerHTML = (function (target) {
									if (target._tempTranslate) return target._tempTranslate;
									var name = target.name;
									if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
									return get.translation(name);
								})(target);
								buttons.push(button);
							}
						}
						dialog.buttons.remove(...buttons);
						var capt = get.translation(target) + "选择了" + get.translation(buttons.map(i => i.link));
						if (cards) {
							target.gain(cards, "visible");
							target.$gain2(cards);
							game.broadcast(
								function (cards, id, name, capt) {
									var dialog = get.idDialog(id);
									if (dialog) {
										dialog.content.firstChild.innerHTML = capt;
										for (var i = 0; i < dialog.buttons.length; i++) {
											if (cards.includes(dialog.buttons[i].link)) {
												dialog.buttons[i].querySelector(".info").innerHTML = name;
												dialog.buttons.splice(i--, 1);
											}
										}
									}
								},
								cards,
								dialog.videoId,
								(function (target) {
									if (target._tempTranslate) return target._tempTranslate;
									var name = target.name;
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
						game.delay();
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
						cardx.init(get.cardInfo(card));
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
					cards = cards.map(card => {
						let j = player.getCards("j");
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
		qizaomrfz: {
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
				player.addJudge({ name: "xumou_jsrg" }, cards);
			},
		},

		// 烛煌 顾烛煌
		chongrangmrfz: {
			audio: 2,
			forced: true,
			trigger: {
				player: "phaseBegin",
				source: "damageEnd",
			},
			filter(event, player) {
				if (event.name == "damage") {
					if (event.parent.name == "_lianhuan" || event.parent.name == "_lianhuan2") return false;
					return event.hasNature("fire");
				}
				return player.hujia > 0;
			},
			async content(event, trigger, player) {
				if (trigger.name == "damage") {
					player.changeHujia(1);
				} else {
					await player.recover(Math.min(player.hujia, 2));
					player.changeHujia(-player.hujia);
				}
			},
		},
		zhuoyanmrfz: {
			init(player) {
				lib.skill["_lianhuan4"].content = function () {
					if (!trigger.getParent().noCharReset) player.link();
					if (trigger.getParent().notLink()) trigger.getParent().lianhuanable = true;
				};
			},
			audio: 2,
			trigger: {
				player: "useCardToPlayer",
			},
			forced: true,
			filter(event, player) {
				if (!event.isFirstTarget) return false;
				return event.card && get.tag(event.card, "fireDamage") && event.targets.some(target => target.isIn() && !target.isLinked());
			},
			async content(event, trigger, player) {
				trigger.targets.forEach(target => {
					if (target.isIn() && !target.isLinked()) target.link();
				});
			},
			group: ["zhuoyanmrfz_nolink"],
			subSkill: {
				nolink: {
					audio: false,
					forced: true,
					silent: true,
					trigger: {
						source: "damageBegin",
					},
					lastDo: true,
					filter: function (event, player) {
						return event.card && event.player.isIn();
					},
					async content(event, trigger, player) {
						trigger.noCharReset = true;
					},
				},
			},
		},
		liaoyuanmrfz: {
			mod: {
				selectTarget(card, player, range) {
					if (card.storage && card.storage.liaoyuanmrfz && range[1] != -1) range[1] += Math.max(1, player.getDamagedHp());
				},
			},
			init(player, skill) {
				player.storage[skill] = {};
			},
			onremove: true,
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			prompt(event) {
				let player = get.player();
				return `流失一点体力并视为使用目标数+${Math.max(1, player.getDamagedHp())}的【火攻】`;
			},
			viewAs: {
				name: "huogong",
				storage: {
					liaoyuanmrfz: true,
				},
			},
			selectCard: -1,
			filterCard: () => false,
			async precontent(event, trigger, player) {
				player.loseHp();
			},
			group: ["liaoyuanmrfz_after", "liaoyuanmrfz_recorder", "liaoyuanmrfz_fire"],
			subSkill: {
				recorder: {
					charlotte: true,
					silent: true,
					trigger: {
						global: "showCardsEnd",
						player: "useCardAfter",
					},
					filter(event, player) {
						if (event.name === "useCard") return event.card && event.card.storage.liaoyuanmrfz;
						let evt = event.getParent();
						return event.cards && evt.name === "huogong" && evt.card && evt.card.storage && evt.card.storage.liaoyuanmrfz;
					},
					async content(event, trigger, player) {
						if (trigger.name === "useCard") {
							delete player.storage.liaoyuanmrfz[trigger.card.storage.randomId];
						} else {
							let cards = trigger.cards;
							let evt = trigger.getParent();
							let id = evt.card.cardid;
							if (!Array.isArray(player.storage.liaoyuanmrfz[id])) player.storage.liaoyuanmrfz[id] = [];
							player.storage.liaoyuanmrfz[id].push(...cards);
						}
					},
				},
				fire: {
					audio: false,
					charlotte: true,
					silent: true,
					trigger: { global: "damageBegin" },
					firstDo: true,
					filter(event, player) {
						return event.card && event.card.name === "wanjian" && event.card.nature === "fire";
					},
					async content(event, trigger, player) {
						trigger.nature = "fire";
					},
				},
				after: {
					charlotte: true,
					audio: false,
					forced: true,
					trigger: { player: "useCardAfter" },
					firstDo: true,
					filter(event, player) {
						if (!event.card || !event.card.storage || !event.card.storage.liaoyuanmrfz) return false;
						let damaged = player.getHistory("sourceDamage", evt => evt.card.storage && evt.card.id === event.card.id);
						let showCards = (player.storage.liaoyuanmrfz[event.card.id] || []).filter(card => get.position(card) === "h");
						return damaged.length > 0 && showCards.length > 0;
					},
					async content(event, trigger, player) {
						let showCards = player.storage.liaoyuanmrfz[trigger.card.id].filter(card => get.position(card) === "h");
						await player.gain(showCards, "gain2");
						if (player.isUnderControl(true) && !_status.auto) {
							const {
								result: { targets, cards },
							} = await player.chooseCardTarget({
								showCards: showCards,
								prompt: "【燎原】:你可以将其中任意张牌当作指定等量目标的【火·万箭齐发】使用",
								prompt2: "请选择目标和牌",
								filterCard(card) {
									return get.event().showCards.includes(card);
								},
								selectCard: [1, Infinity],
								filterTarget(card, player, target) {
									return player.canUse("wanjian", target);
								},
								selectTarget: [1, Infinity],
								filterOk() {
									return ui.selected.targets.length === ui.selected.cards.length;
								},
							});
							if (!(targets && cards)) return;
							player.useCard(
								{
									name: "wanjian",
									nature: "fire",
								},
								targets,
								cards,
								true
							);
						} else {
							let cards = showCards,
								targets = game.filterPlayer(i => get.attitude(player, i) < 0);
							cards.forEach(card => {
								if (get.value(card) >= 8) cards.remove(card);
							});
							if (targets.length > cards.length) {
								targets = targets.slice(0, cards.length);
							}
							if (!(targets && cards)) return;
							player.useCard(
								{
									name: "wanjian",
									nature: "fire",
								},
								targets,
								cards.slice(0, targets.length),
								true
							);
						}
					},
				},
			},
			ai: {
				order: 9.5,
				result: {
					player(player, target) {
						if (player.hp < 3 || player.countCards("h") < 1) return -1;
						if (player.getUseValue({ name: "huogong" }) <= 0) return -1;
						return 1 + player.countCards("h") * 0.1;
					},
				},
			},
		},

		// 新温蒂
		newdanpaomrfz: {
			audio: "danpaomrfz",
			enable: "phaseUse",
			usable: 1,
			filter(event, player) {
				return player.countCards("he") > 0 && game.hasPlayer(current => current != player && current.countCards("hej") > 0);
			},
			filterCard: true,
			selectCard: [1, Infinity],
			filterTarget(card, player, target) {
				if (ui.selected.targets.length === 0) return target.countCards("hje") > 0 && target !== player;
				return get.distance(ui.selected.targets[0], target) <= ui.selected.cards.length;
			},
			targetprompt: ["被移牌", "收到牌"],
			selectTarget: 2,
			position: "he",
			multitarget: true,
			multiline: true,
			check(card) {
				let player = get.player();
				if (
					game.hasPlayer(current => current != player && get.attitude2(current) > 0 && current.countCards("j") > 0) &&
					ui.selected.cards.length > 0
				)
					return false;
				let getTarget = get.result("newdanpaomrfz").target;
				let targets = [];
				game.players.forEach(char => {
					if (char !== player && char.countCards("hej") > 0) {
						targets.push([char, getTarget(player, char)]);
					}
				});
				let target = [undefined, -114514];
				targets.forEach(char => {
					if (char[1] > target[1]) target = [char[0], char[1]];
				});
				target = target[0];
				if (ui.selected.cards.length >= Math.max(target.countCards("h"), target.countCards("e"))) return false;
				return get.value(card, player) < 6;
			},
			async content(event, trigger, player) {
				const { targets } = event;
				const { links } = await player
					.choosePlayerCard("hej", targets[0], true, [1, event.cards.length])
					.set("prompt", "请选择你要移动的牌<br>（必须选择同一区域的牌）")
					.set("filterOk", () => {
						return new Set(ui.selected.buttons.map(i => get.position(i.link))).size === 1;
					})
					.set("ai", button => {
						let target = get.event().targets[0];
						let cards = get.event().cards;
						if (get.attitude2(target) > 0 && target.countCards("j") > 0) return target.getCards("j").includes(button.link);

						let h = target.getCards("h");
						let e = target.getCards("e");

						let sort = [h, e, cards].sort((a, b) => {
							return b.length - a.length;
						});

						sort.forEach((arr, index) => {
							if (cards.some(i => arr.includes(i))) delete sort[index];
						});

						sort = sort.filter(arr => arr.length > 0);

						return sort[0].includes(button.link) ? get.value(button.link, get.player()) + 10 : 0;
					})
					.set("targets", targets)
					.set("cards", event.cards)
					.forResult();
				if (!links) return;
				switch (get.position(links[0])) {
					case "h":
						targets[1].gain(links);
						targets[0].$give(links.length, targets[1]);
						break;
					case "e":
						for (let card of links) {
							if (targets[1].canEquip(card)) {
								targets[1].equip(card);
								targets[0].$give(card, targets[1]);
							} else {
								targets[0].discard(card);
							}
						}
						break;
					case "j":
						for (let card of links) {
							if (!card.cards?.length) targets[0].removeVirtualJudge(card);
							targets[1].addJudge(card, card?.cards);
						}
						break;
				}
			},
			ai: {
				order: 8,
				threaten: 1.5,
				result: {
					target(player, target) {
						let att = get.attitude(player, target);
						if (ui.selected.targets.length === 0) {
							if (target.countCards("j") > 0 && att > 0) return 100;
							return att - target.countCards("hej");
						} else {
							let last = ui.selected.targets[0];
							if (last.countCards("j") > 0 && att > 0) return -1;
							return att > 0 ? 1 : 0;
						}
					},
				},
			},
		},
		jiangpaomrfz: {
			audio: "shuipaomrfz",
			frequent: true,
			trigger: { player: "phaseDrawBegin2" },
			filter(event, player) {
				return !event.numFixed;
			},
			async content(event, trigger, player) {
				trigger.num += ["h", "e", "j"].filter(pos => player.countCards(pos) > 0).length;
			},
			ai: {
				threaten: 1.5,
			},
		},
	},
};
