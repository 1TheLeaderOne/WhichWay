import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

/**贵胄的账本：{ 授予的主公技id: 该主公技所属势力 } */
type GuizhouLedger = Record<string, string>;

/**伪裔一、二档的分档子技能（一档->手牌上限，二档->额定摸牌数） */
const weiyiSubSkills = ["weiyimrfz_handcard", "weiyimrfz_draw"];

/**
 * 三、四档借用的现成技能：跋扈与惑众（本体在武将包“江山如故”里）。
 * 卡面写的“八荒/火中”是这两个技能 id 的同音误写，实现按 id 取用；
 * 该武将包未导入时 lib.skill 查不到，静默不生效。
 */
const weiyiBorrowSkills = [
	{ tier: 3, skill: "jsrgbahu", name: "跋扈" },
	{ tier: 4, skill: "jsrghuozhong", name: "惑众" },
];

/**
 * 按势力整理全部主公技池，势力与技能的对应关系取自全部武将牌数据。
 * lib.character 的写入被 Proxy 统一 convertedCharacter 成了 Character 对象，
 * 数组下标只是对象上保留的兼容 getter，这里按字段名取用。
 */
function getZhuSkillPools(): Record<string, string[]> {
	const pools: Record<string, string[]> = {};
	for (const name in lib.character) {
		const data = lib.character[name];
		if (!data) continue;
		const group = data.group;
		const skills = data.skills;
		if (typeof group != "string" || !group || !Array.isArray(skills)) continue;
		for (const skillName of skills) {
			if (typeof skillName != "string" || skillName == "weiyimrfz") continue;
			if (!lib.skill[skillName] || lib.skill[skillName].zhuSkill !== true) continue;
			if (!pools[group]) pools[group] = [];
			pools[group].add(skillName);
		}
	}
	return pools;
}

/**
 * 托莱多当前持有的全部主公技。
 * 伪裔自身不计入：它既是档数的来源也是分档效果的开关，若参与计数/被危言失去，
 * 档数会连同开关一起归零，整套分档效果永久失效。
 */
function getHeldZhuSkills(player: Player): string[] {
	return player.getSkills().filter(skillName => skillName != "weiyimrfz" && lib.skill[skillName] && lib.skill[skillName].zhuSkill === true);
}

/**
 * 伪裔当前是否已达到某一档
 */
function isWeiyiTier(player: Player, tier: number): boolean {
	return player.hasSkill("weiyimrfz") && (player.storage.weiyimrfz || 0) >= tier;
}

/**
 * 按档数发放/收回三、四档借来的技能。
 * 只收回自己发出去的（记在 storage 里），避免把【神宠】之类别人给的跋扈一并撤走。
 */
function syncWeiyiBorrowSkills(player: Player): void {
	const num = player.storage.weiyimrfz || 0;
	const granted: string[] = player.storage.weiyimrfz_granted || (player.storage.weiyimrfz_granted = []);
	let changed = false;
	for (const item of weiyiBorrowSkills) {
		const should = num >= item.tier && !!lib.skill[item.skill];
		const owned = granted.includes(item.skill);
		if (should && !owned) {
			player.addSkill(item.skill);
			granted.push(item.skill);
			changed = true;
		} else if (!should && owned) {
			player.removeSkill(item.skill);
			granted.remove(item.skill);
			changed = true;
		}
	}
	if (changed) player.syncStorage("weiyimrfz_granted");
}

/**
 * 刷新伪裔的档数（数量即她持有的主公技个数）
 */
function updateWeiyiCount(player: Player): void {
	player.storage.weiyimrfz = getHeldZhuSkills(player).length;
	player.syncStorage("weiyimrfz");
	syncWeiyiBorrowSkills(player);
	if (player.hasSkill("weiyimrfz")) player.markSkill("weiyimrfz");
}

/**
 * 把某个技能的状态提示刷新为当前持有的主公技列表
 */
function refreshGuizhouMark(player: Player): void {
	if (player.hasSkill("guizhoumrfz")) player.markSkill("guizhoumrfz");
}

/**
 * 令该主公技的发动条件对托莱多放开身份与势力限制。
 *
 * 引擎只在“获得技能”时拦截主公技（非主公直接丢弃），发动/结算阶段不再复查身份，
 * 因此这里改写共享的 filter：托莱多本人判定时临时视她为主公、并临时改为该主公技的原势力。
 * 改动需要同步给联机客户端，故用 broadcastAll；广播函数体内不能引用模块作用域的自由变量，
 * 需要的值一律通过参数传入，包装函数在广播体内就地创建。
 */
function installGuizhouIgnoreLimit(skillName: string, homeGroup: string): void {
	//@ts-ignore
	game.broadcastAll((name, originGroup) => {
		const info = lib.skill[name];
		if (!info) return;
		//同一个技能可能被多个势力的牌池收录，以最后一次授予的势力为准
		info.guizhouGroup = originGroup;
		if (info.guizhouWrapped) return;
		info.guizhouWrapped = true;
		const originFilter = info.filter;
		info.guizhouOriginFilter = originFilter;
		info.filter = function (event, player, triggerName, indexedData) {
			if (!player.hasSkill("guizhoumrfz")) {
				return originFilter ? originFilter(event, player, triggerName, indexedData) : true;
			}
			const zhuBefore = player.isZhu;
			const groupBefore = player.group;
			const group = lib.skill[name].guizhouGroup;
			player.isZhu = true;
			if (group) player.group = group;
			try {
				return originFilter ? originFilter(event, player, triggerName, indexedData) : true;
			} finally {
				player.isZhu = zhuBefore;
				player.group = groupBefore;
			}
		};
	}, skillName, homeGroup);
}

/**
 * 贵胄的补偿：令一名角色选择摸两张牌或回复1点体力，若不是托莱多本人则托莱多再执行一次
 */
async function guizhouCompensate(player: Player): Promise<void> {
	const list = game.filterPlayer();
	if (!list.length) return;

	let target: Player | undefined;
	if (list.length == 1) {
		target = list[0];
	} else {
		const result = await player
			.chooseTarget({
				prompt: "【贵胄】:令一名角色选择摸两张牌或回复1点体力",
				forced: true,
				filterTarget: () => true,
				ai: current => (current.isDamaged() ? 1 : 0) + get.attitude(player, current) / 2,
			})
			.forResult();
		target = result?.targets?.[0];
	}
	if (!target) return;

	//由该角色自己选择
	await target.chooseDrawRecover({ target, forced: true, num1: 2, num2: 1, logSkill: "guizhoumrfz" });
	if (target != player) {
		await player.chooseDrawRecover({ target: player, forced: true, num1: 2, num2: 1, logSkill: "guizhoumrfz" });
	}
}

const resigter = (name = "char_393_toledo") => {
	character(name, {
		hp: 3,
		sex: "female",
		skills: ["guizhoumrfz", "weiyanmrfz", "weiyimrfz"],
		group: "yimrfz",
		pack: "epicSJZX",
		designer: ["Flandre"],
		llm: "Qwen-3.8-Flash",
	});

	characterTitle(name, whichWayUtil.colorize("#blue#“贵胄血脉”#"));
	characterIntro(name, "自称伊比利亚王室海军将领后裔、失落的贵族——德·托莱多家族成员，在伊比利亚各地招揽了一大批拥护者。但由于该干员口述的经历与审判庭档案记录严重不符，她的职业在人事部重新登记时，被划定为自由职业。德·托莱多由干员艾丽妮推荐加入罗德岛。她的口才和对伊比利亚的了解，足以辅助伊比利亚办事处的干员完成基础工作。");

	translate({
		[name]: "托莱多",

		guizhoumrfz: "贵胄",
		"guizhoumrfz_info": "锁定技，游戏开始时，你从每个势力中随机获得两个主公技；你发动主公技时，无视其发动条件中的身份和势力限制;当你失去主公技后，你令一名角色选择摸两张牌或回复一点体力，若该角色不是你，你执行一次相同的效果。",
		weiyanmrfz: "危言",
		"weiyanmrfz_info": `锁定技，出牌阶段开始时，你选择失去一个主公技或失去一点体力上限，然后你对一名其他角色造成一点伤害。`,
		weiyimrfz: "伪裔",
		"weiyimrfz_info": `主公技，每轮开始时，根据你拥有势力的主公技数获得下列效果：<br>1.手牌上限+1;<br>2.额定摸牌数+1;<br>3.视为拥有${get.poptip("jsrgbahu")};<br>4.视为拥有${get.poptip("jsrghuozhong")}。`,
	});

	skill({
		guizhoumrfz: {
			audio: ["作战中2", "作战中3"],
			forced: true,
			mark: true,
			intro: {
				content: function (storage, player: Player) {
					const ledger = player.storage.guizhoumrfz;
					if (!ledger || typeof ledger != "object") return "尚未获得主公技";
					const names = getHeldZhuSkills(player);
					if (!names.length) return "已失去全部主公技";
					return `现有${get.cnNumber(names.length)}个主公技：<br>${names.map(skillName => get.translation(skillName)).join("、")}`;
				},
			},
			//“游戏开始时”按七星（qixing）的写法：全局阶段开始前且是第一轮，外加中途入场的兜底
			trigger: { global: "phaseBefore", player: "enterGame" },
			filter: function (event, player) {
				return (event.name != "phase" || game.phaseNumber == 0) && player.storage.guizhoumrfz === undefined;
			},
			async content(event, trigger, player) {
				const ledger: GuizhouLedger = {};
				const pools = getZhuSkillPools();
				//“每个势力”指游戏内的全部势力，不是场上角色实际出现的势力
				const groups = lib.group.filter(group => typeof group == "string" && !!group);
				for (const group of groups) {
					const pool = (pools[group] || []).filter(skillName => !player.hasSkill(skillName));
					for (const skillName of pool.randomGets(2)) ledger[skillName] = group;
				}
				player.storage.guizhoumrfz = ledger;

				//伪裔也是主公技，她不是主公时开局会被引擎丢弃，这里补发
				if (!player.hasSkill("weiyimrfz")) player.addSkill("weiyimrfz");

				const names = Object.keys(ledger);
				for (const skillName of names) installGuizhouIgnoreLimit(skillName, ledger[skillName]);
				for (const skillName of names) player.addSkill(skillName);

				//分档子技能常驻，是否生效只看档数。
				//触发型子技能必须真正 addSkill 一次（触发收集只认 lib.hook，不做 group 展开），
				//所以这里不能用 hasSkill 判重——group 展开会让它恒为真。
				for (const skillName of weiyiSubSkills.concat("guizhoumrfz_check")) {
					if (!player.skills.includes(skillName)) player.addSkill(skillName);
				}

				updateWeiyiCount(player);
				player.syncStorage("guizhoumrfz");
				refreshGuizhouMark(player);
				if (names.length) game.log(player, "获得了主公技", ...names.map(skillName => get.translation(skillName)));
			},
			onremove: function (player: Player) {
				//贵胄本体失去时批量清场，不计补偿
				const ledger = player.storage.guizhoumrfz;
				if (ledger && typeof ledger == "object") {
					for (const skillName of Object.keys(ledger)) player.removeSkill(skillName, true);
				}
				delete player.storage.guizhoumrfz;
				delete player.storage.weiyimrfz;
				//三、四档借来的跋扈/惑众也要收回
				const granted = player.storage.weiyimrfz_granted;
				if (Array.isArray(granted)) {
					for (const skillName of granted) player.removeSkill(skillName);
				}
				delete player.storage.weiyimrfz_granted;
				for (const skillName of weiyiSubSkills.concat("guizhoumrfz_check")) player.removeSkill(skillName);
				player.unmarkSkill("guizhoumrfz");
			},
			group: ["guizhoumrfz_check"],
			subSkill: {
				check: {
					charlotte: true,
					silent: true,
					direct: true,
					forced: true,
					trigger: { global: "roundStart" },
					filter: function (event, player) {
						const ledger = player.storage.guizhoumrfz;
						if (!ledger || typeof ledger != "object") return false;
						return Object.keys(ledger).some(skillName => !player.hasSkill(skillName));
					},
					async content(event, trigger, player) {
						const ledger: GuizhouLedger = player.storage.guizhoumrfz;
						let lost = 0;
						for (const skillName of Object.keys(ledger)) {
							if (!player.hasSkill(skillName)) {
								delete ledger[skillName];
								lost++;
							}
						}
						player.syncStorage("guizhoumrfz");
						refreshGuizhouMark(player);
						//引擎没有“失去技能”的时机，由其他角色拿走的主公技在这里补上补偿
						for (let i = 0; i < lost; i++) await guizhouCompensate(player);
						updateWeiyiCount(player);
					},
				},
			},
		},
		weiyanmrfz: {
			audio: ["选中干员1", "作战中4"],
			forced: true,
			trigger: { player: "phaseUseBegin" },
			filter: function (event, player) {
				return getHeldZhuSkills(player).length > 0 || player.maxHp > 1;
			},
			async content(event, trigger, player) {
				const zhuList = getHeldZhuSkills(player);
				const list = zhuList.map(skillName => `失去主公技【${get.translation(skillName)}】`);
				if (player.maxHp > 1) list.push("失去1点体力上限");

				let index = 0;
				if (list.length > 1) {
					const result = await player
						.chooseControlList({
							list,
							prompt: get.prompt2("weiyanmrfz"),
							forced: true,
							ai: () => {
								//还有余量时优先消耗主公技，否则优先扣体力上限
								if (zhuList.length >= 3) return 0;
								if (player.maxHp > 1) return zhuList.length;
								return 0;
							},
						})
						.forResult();
					index = result && typeof result.index == "number" ? result.index : 0;
				}

				if (index < zhuList.length) {
					const removed = zhuList[index];
					const ledger = player.storage.guizhoumrfz;
					if (ledger && typeof ledger == "object") delete ledger[removed];
					player.removeSkill(removed, true);
					player.syncStorage("guizhoumrfz");
					refreshGuizhouMark(player);
					updateWeiyiCount(player);
					await guizhouCompensate(player);
				} else {
					await player.loseMaxHp();
					updateWeiyiCount(player);
				}

				const others = game.filterPlayer(current => current != player);
				if (!others.length) return;

				let target: Player | undefined;
				if (others.length == 1) {
					target = others[0];
				} else {
					const chosen = await player
						.chooseTarget({
							prompt: "【危言】:对一名其他角色造成1点伤害",
							forced: true,
							filterTarget: (card, player, target) => target != player,
							ai: target => -get.attitude(player, target),
						})
						.forResult();
					target = chosen?.targets?.[0];
				}
				if (target) await target.damage({ num: 1, source: player });
			},
		},
		weiyimrfz: {
			audio: ["行动出发", "部署1"],
			zhuSkill: true,
			forced: true,
			mark: true,
			onremove: true,
			derivation:weiyiBorrowSkills.map(i=>i.skill),
			intro: {
				content: function (storage, player: Player) {
					const num = player.storage.weiyimrfz || 0;
					const list = ["手牌上限+1", "额定摸牌数+1"].concat(weiyiBorrowSkills.map(item => lib.translate[item.skill] || item.name));
					return `当前有${get.cnNumber(num)}个主公技：<br>${list.slice(0, num).join("、") || "无效果"}`;
				},
			},
			trigger: { global: "roundStart" },
			group: weiyiSubSkills,
			subSkill: {
				handcard: {
					charlotte: true,
					mod: {
						maxHandcard(player, num) {
							if (isWeiyiTier(player, 1)) return num + 1;
						},
					},
				},
				draw: {
					charlotte: true,
					silent: true,
					direct: true,
					forced: true,
					trigger: { player: "phaseDrawBegin2" },
					filter: function (event, player) {
						return !event.numFixed && isWeiyiTier(player, 2);
					},
					async content(event, trigger, player) {
						trigger.num++;
					},
				},
			},
			async content(event, trigger, player) {
				updateWeiyiCount(player);
			},
		},
	});
};

resigter();
