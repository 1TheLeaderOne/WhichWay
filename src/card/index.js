import { lib, game, ui, get, ai, _status } from "noname";

const path = {
	char: "ext:WhichWay/image/character/",
	card : "ext:WhichWay/image/card/",
}

game.import('card', function (lib, game, ui, get, ai, _status) {
	var mrfzcard = {
		name: 'mrfzcard',
		connect: true,
		card: {
			//嵯峨 幻有
			cuoe_huanyoumrfzCard:{
				image: `${path.char}cuoemrfz.jpg`,
				audio:false,
				type:"basic",
				enable:true,
				notarget: true,
				destroy: true,
				usable:5,
				async content(event,trigger,player) {
					const trueCard = event.cards[0];
					if(get.itemtype(trueCard) === "card"&&player.hasUseTarget(trueCard)){
						await player.chooseUseTarget(trueCard).set("noTriggerHuanyoumrfz",true);
					} else{
						event.card.failToUse = true;
					}
				},
				ai:{
					result:{
						target:1,
						player:1,
					},
					basic: {
						order: 7.4,
						useful: 1.2,
						value: 4,
					},
				},
			},

			// 凯瑟琳 勠力同心
			ksl_lulitongxinmrfz:{
				image: `${path.card}ksl_lulitongxinmrfz.jpg`,
				audio: "lulitongxin",
				type: "trick",
				enable: true,
				notarget: true,
				async content(event,trigger,player) {
					let list = [`横置角色`]
					if(game.hasPlayer(c=>c.isLinked())) list.push(`解除横置`);
					const control = list.length===1? list[0] :
						await player.chooseControl(list)
						.set('prompt', '请选择一项')
						.set('ai',()=>{
								let player = get.event().player;
								let Links = game.filterPlayer(p=>p.isLinked());
								let canDraws = 0;
								let canDiscard = 0;
								for(let char of game.players.filter(i=>Links.includes(i))){
									if(char.countCards('h')>4) continue;
									canDraws += get.attitude2(char)>0?1:-1 * (4 - char.countCards('h'));
								}
								for(let char of Links){
									if(get.attitude2(char)>0){
										canDiscard-=0.5;
										continue;
									}
									canDiscard += char.countCards('h')>0?1:-1;
								}
								return canDraws>canDiscard?'横置角色':'解除横置';
							})
							.forResultControl();
					if(!control) return;
					if(control==='横置角色'){
						const targets = await player.chooseTarget([1,game.countGroup()],true,`请横置至多${game.countGroup()}名角色`)
							.set('filterTarget',(card,target,player)=>{
								return !target.isLinked();
							})
							.set('ai',target=>get.attitude2(target)>0&&target.countCards('h')<4)
						    .forResult('targets');
						if(!targets) return;
						for(let target of game.players){
							if(targets.includes(target)) {
								target.link();
								await target.drawTo(4);
							}
							if(!target.isLinked()) continue;
							let hs = target.getCards('h', card => !get.is.shownCard(card));
							if(hs.length) target.addShownCards(hs, 'visible_ksl_luli');
						}
					} else {
						for(let target of game.filterPlayer(c=>c.isLinked())){
							await target.link(false);
							let hs = target.getCards('h', card => get.is.shownCard(card));
							if(hs.length) target.hideShownCards(hs);
							if(target.hasCard()) target.chooseToDiscard(true,`请弃置一张手牌`);
						}
					}
				},
				ai: {
					wuxie: (target, card, player, viewer, status) => {
						if (
							status * get.attitude(viewer, player._trueMe || player) > 0 ||
							get.attitude(viewer, player) > 0
						)
							return 0;
					},
					basic: {
						order: 7.4,
						useful: 1.2,
						value: 4,
					},
					result: {
						target: (player, target) => {
							if (player.hasUnknown()) return 0;
							return 1;
						},
					},
					tag: {
						multitarget: 1,
						multineg: 1,
						norepeat: 1,
					},
				},
			},

			//莱欧斯的剑助
			jianzhumrfz:{
				image: `${path.card}jianzhumrfz.jpg`,
				type: 'equip',
				subtype: 'equip1',
				destroy: true,
				derivation: 'laiousimrfz',
				distance: {
					attackFrom: -3,
				},
				skills: ["jianzhumrfz_skill"],
				ai: {
					basic: {
						equipValue: 8,
						value: (card, player, index, method) => {
							if (!player.getCards("e").includes(card) && !player.canEquip(card, true)) return 0.01;
							const info = get.info(card),
								current = player.getEquip(info.subtype),
								value = current && card != current && get.value(current, player);
							let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
							if (typeof equipValue == "function") {
								if (method == "raw") return equipValue(card, player);
								if (method == "raw2") return equipValue(card, player) - value;
								return Math.max(0.1, equipValue(card, player) - value);
							}
							if (typeof equipValue != "number") equipValue = 0;
							if (method == "raw") return equipValue;
							if (method == "raw2") return equipValue - value;
							return Math.max(0.1, equipValue - value);
						},
					},
				},
				enable: true,
				selectTarget: -1,
				filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
				modTarget: true,
				allowMultiple: false,
				onLose: function () {
					if ((!event.getParent(2) || event.getParent(2).name != 'swapEquip') && (event.getParent().type != 'equip' || event.getParent().swapEquip)) {
						card.destroyed = true;
						game.log(card, '被销毁了');
					}
				},
				content: function () {
					if (
						!card?.cards.some(card => {
							return get.position(card, true) !== "o";
						})
					) {
						target.equip(card);
					}
				},
				toself: true,
			},
			//稀音的镜头
			jingtouE1mrfz: {
				image: `${path.card}jingtouE1mrfz.jpg`,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: 1,
				},
				onLose: function () {
					if ((!event.getParent(2) || event.getParent(2).name != 'swapEquip') && (event.getParent().type != 'equip' || event.getParent().swapEquip)) {
						cards.forEach(card => {
							card.fix();
							card.remove();
							card.destroyed = true;
							game.log(card, "被销毁了");
						});
					}
					var player = _status.event.player,
						hs = player.getCards('h', card => get.is.shownCard(card));
					if (hs.length > 0) player.hideShownCards(hs);
				},
				equipDelay: false,
				loseDelay: false,
				skills: ["jingtoumrfz_skill"],
				ai: {
					basic: {
						equipValue: -1,
					},
					result: {
						target: (player, target, card) => get.equipResult(player, target, card.name),
					},
				},
				enable: true,
				selectTarget: -1,
				filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
				modTarget: true,
				allowMultiple: false,
				content: function () {
					if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
				},
				toself: true,
			},

			jingtouE2mrfz: {
				image: `${path.card}jingtouE2mrfz.jpg`,
				type: "equip",
				subtype: "equip2",
				onLose: function () {
					if ((!event.getParent(2) || event.getParent(2).name != 'swapEquip') && (event.getParent().type != 'equip' || event.getParent().swapEquip)) {
						cards.forEach(card => {
							card.fix();
							card.remove();
							card.destroyed = true;
							game.log(card, "被销毁了");
						});
					}
					var player = _status.event.player,
						hs = player.getCards('h', card => get.is.shownCard(card));
					if (hs.length > 0) player.hideShownCards(hs);
				},
				equipDelay: false,
				loseDelay: false,
				skills: ["jingtoumrfz_skill"],
				ai: {
					basic: {
						equipValue: -1,
					},
					result: {
						target: (player, target, card) => get.equipResult(player, target, card.name),
					},
				},
				enable: true,
				selectTarget: -1,
				filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
				modTarget: true,
				allowMultiple: false,
				content: function () {
					if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
				},
				toself: true,
			},

			jingtouE3mrfz: {
				image: `${path.card}jingtouE3mrfz.jpg`,
				type: "equip",
				subtype: "equip3",
				distance: {
					globalTo: 1,
				},
				onLose: function () {
					if ((!event.getParent(2) || event.getParent(2).name != 'swapEquip') && (event.getParent().type != 'equip' || event.getParent().swapEquip)) {
						cards.forEach(card => {
							card.fix();
							card.remove();
							card.destroyed = true;
							game.log(card, "被销毁了");
						});
					}
					var player = _status.event.player,
						hs = player.getCards('h', card => get.is.shownCard(card));
					if (hs.length > 0) player.hideShownCards(hs);
				},
				equipDelay: false,
				loseDelay: false,
				skills: ["jingtoumrfz_skill"],
				ai: {
					basic: {
						equipValue: -1,
					},
					result: {
						target: (player, target, card) => get.equipResult(player, target, card.name),
					},
				},
				enable: true,
				selectTarget: -1,
				filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
				modTarget: true,
				allowMultiple: false,
				content: function () {
					if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
				},
				toself: true,
			},

			jingtouE4mrfz: {
				image: `${path.card}jingtouE4mrfz.jpg`,
				type: "equip",
				subtype: "equip4",
				distance: {
					globalFrom: -1,
				},
				onLose: function () {
					if ((!event.getParent(2) || event.getParent(2).name != 'swapEquip') && (event.getParent().type != 'equip' || event.getParent().swapEquip)) {
						cards.forEach(card => {
							card.fix();
							card.remove();
							card.destroyed = true;
							game.log(card, "被销毁了");
						});
					}
					var player = _status.event.player,
						hs = player.getCards('h', card => get.is.shownCard(card));
					if (hs.length > 0) player.hideShownCards(hs);
				},
				equipDelay: false,
				loseDelay: false,
				skills: ["jingtoumrfz_skill"],
				ai: {
					basic: {
						equipValue: -1,
					},
					result: {
						target: (player, target, card) => get.equipResult(player, target, card.name),
					},
				},
				enable: true,
				selectTarget: -1,
				filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
				modTarget: true,
				allowMultiple: false,
				content: function () {
					if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
				},
				toself: true,
			},

			jingtouE5mrfz: {
				image: `${path.card}jingtouE5mrfz.jpg`,
				type: "equip",
				subtype: "equip5",
				onLose: function () {
					if ((!event.getParent(2) || event.getParent(2).name != 'swapEquip') && (event.getParent().type != 'equip' || event.getParent().swapEquip)) {
						cards.forEach(card => {
							card.fix();
							card.remove();
							card.destroyed = true;
							game.log(card, "被销毁了");
						});
					}
					var player = _status.event.player,
						hs = player.getCards('h', card => get.is.shownCard(card));
					if (hs.length > 0) player.hideShownCards(hs);
				},
				equipDelay: false,
				loseDelay: false,
				skills: ["jingtoumrfz_skill"],
				ai: {
					basic: {
						equipValue: -1,
					},
					result: {
						target: (player, target, card) => get.equipResult(player, target, card.name),
					},
				},
				enable: true,
				selectTarget: -1,
				filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
				modTarget: true,
				allowMultiple: false,
				content: function () {
					if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
				},
				toself: true,
			},

			//天火的坠火
			sjzx_zhuihuomrfz: {
				image: `${path.card}sjzx_zhuihuomrfz.jpg`,
				type: 'special_delay',
				allowDuplicate: true,
				blankCard: true,
				fullimage: true,
				wuxieable: false,
				effect: function () {
					'step 0'
					var card = get.autoViewAs(event.cards[0]);
					card.storage.sjzx_zhuihuomrfz = true;
					if (player.countCards('he') > 1) player.chooseToDiscard(2, 'he', '【坠火】:请选择弃置两张牌，选择取消则受到一点火焰伤害')
						.set('ai', function (card) {
							var player = _status.event.player;
							if (player.hp < 2 && player.countCards('hs', card => { return card.name == 'tao' || card.name == 'jiu' }) < 1) return -1;
							return 8 - get.value(card);
						});
					else {
						player.damage('fire', 'nosource');
						player.loseToDiscardpile(event.cards[0]);
						event.finish();
					}
					'step 1'
					if (result.bool) {
						//game.log(player,'弃置了',result.cards);
						player.loseToDiscardpile(event.cards[0]);
					}
					else {
						player.damage('fire', 'nosource');
						player.loseToDiscardpile(event.cards[0]);
					}
				},
			},
			//莱伊的沙地兽
			shadishoumrfz: {
				image: `${path.card}shadishoumrfz.jpg`,
				type: "equip",
				subtype: "equip2",
				onLose: function () {
					if ((!event.getParent(2) || event.getParent(2).name != "swapEquip") && (event.getParent().type != "equip" || event.getParent().swapEquip)) {
						cards.forEach(card => {
							card.fix();
							card.remove();
							card.destroyed = true;
							game.log(card, "被销毁了");
						});
					}
				},
				equipDelay: false,
				loseDelay: false,
				skills: ["shadishoumrfz_skill"],
				ai: {
					basic: {
						equipValue: -1,
					},
					result: {
						target: (player, target, card) => get.equipResult(player, target, card.name),
					},
				},
				enable: true,
				selectTarget: -1,
				filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
				modTarget: true,
				allowMultiple: false,
				content: function () {
					if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
				},
				toself: true,
			},
			//战车的DP-27
			DP27mrfz: {
				image: `${path.card}DP27mrfz.jpg`,
				type: 'equip',
				subtype: 'equip1',
				destroy: true,
				derivation: 'zhanchemrfz',
				distance: {
					attackFrom: -3,
				},
				skills: ["DP27mrfz_skill"],
				ai: {
					basic: {
						equipValue: 8,
					},
				},
			},
			//鸿雪的打字机
			dazijimrfz: {
				image: `${path.card}dazijimrfz.jpg`,
				type: "equip",
				subtype: "equip1",
				destroy: true,
				derivation: 'hongxuemrfz',
				distance: {
					attackFrom: -2,
				},
				ai: {
					basic: {
						equipValue: 5,
						order: function (card, player) {
							if (player && player.hasSkillTag('reverseEquip')) {
								return 8.5 - get.equipValue(card, player) / 20;
							}
							else {
								return 8 + get.equipValue(card, player) / 20;
							}
						},
						useful: 2,
						value: function (card, player, index, method) {
							if (player.isDisabled(get.subtype(card))) return 0.01;
							var value = 0;
							var info = get.info(card);
							var current = player.getEquip(info.subtype);
							if (current && card != current) {
								value = get.value(current, player);
							}
							var equipValue = info.ai.equipValue;
							if (equipValue == undefined) {
								equipValue = info.ai.basic.equipValue;
							}
							if (typeof equipValue == 'function') {
								if (method == 'raw') return equipValue(card, player);
								if (method == 'raw2') return equipValue(card, player) - value;
								return Math.max(0.1, equipValue(card, player) - value);
							}
							if (typeof equipValue != 'number') equipValue = 0;
							if (method == 'raw') return equipValue;
							if (method == 'raw2') return equipValue - value;
							return Math.max(0.1, equipValue - value);
						},
					},
					result: {
						target: function (player, target, card) {
							return get.equipResult(player, target, card.name);
						},
					},
				},
				skills: ["dazijimrfzskill"],
				enable: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				allowMultiple: false,
				content: function () {
					if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
				},
				toself: true,
				fullimage: true,
			},
			//大铁老师的支援装备
			baitiemrfzcard1: {
				image: `${path.card}baitiemrfzcard1.jpg`,
				type: "equip",
				subtype: "equip5",
				skills: ['baitiemrfzcard1_skill'],
				ai: {
					basic: {
						equipValue: 7,
					}
				},
			},
			baitiemrfzcard2: {
				image: `${path.card}baitiemrfzcard2.jpg`,
				type: "equip",
				subtype: "equip5",
				skills: ['baitiemrfzcard2_skill'],
				ai: {
					basic: {
						equipValue: 7.5,
					}
				},
			},
			baitiemrfzcard3: {
				image: `${path.card}baitiemrfzcard3.jpg`,
				type: "equip",
				subtype: "equip5",
				skills: ['baitiemrfzcard3_skill'],
				ai: {
					basic: {
						equipValue: 7.8,
					}
				},
			},
		},

		skill: {
			jingtoumrfz_skill: {
				mod: {
					inRangeOf: function (from, to) {
						return true;
					},
					attackRange:function (player, num) {
                    	if(player.hasCard('jingtouE1mrfz','e')) return num -= 1;
                	},
				},
				trigger: { player: ['gainAfter', 'equipAfter'] },
				forced: true,
				filter: (event, player) => {
					return player.countCards('h', card => !get.is.shownCard(card)) > 0;
				},
				content() {
					let hs = player.getCards('h', card => !get.is.shownCard(card));
					if (hs.length == 0) return;
					player.addShownCards(hs, 'visible_jingtoumrfz');
				},
			},
			dazijimrfzskill: {
				trigger: {
					player: "useCard",
				},
				direct: true,
				filter: function (event, player) {
					if (!player.hasSkill('ruibimrfz')) return false;
					if (event.dazijimrfzskill_buff || !event.targets.length || player.hasSkill('dazijimrfz_buff')) return false;
					return event.card.name == 'sha';
				},
				content: function () {
					'step 0'
					player.addTempSkill('dazijimrfzskill_buff', 'phaseUseAfter');
					trigger.dazijimrfzskill_buff = player;
				},
				subSkill: {
					buff: {
						trigger: {
							global: "useCardToTargeted",
						},
						charlotte: true,
						popup: false,
						lastDo: true,
						filter: function (event, player) {
							return (event.parent.dazijimrfzskill_buff == player && event.targets.length == event.parent.triggeredTargets4.length);
						},
						content: function () {
							trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
							trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
						},
						sub: true,
					},
				},
			},
			baitiemrfzcardad: { audio: 'ext:whitherHelm/audio:4', },
			baitiemrfzcard1_skill: {
				trigger: { source: 'damageBegin3' },
				filter: function (event, player) {
					return event.num > 1 && event.player != player;
				},
				prompt: '是否令此伤害+1？',
				content: function () {
					trigger.num++;
					player.logSkill('baitiemrfzcardad', trigger.player);
				},
			},
			baitiemrfzcard2_skill: {
				trigger: { player: 'phaseDiscardBefore' },
				forced: true,
				content: function () {
					var next = player.phaseUse();
					event.next.remove(next);
					trigger.next.push(next);
					game.log(player, '额外执行了一个出牌阶段');
					player.logSkill('baitiemrfzcardad');
					player.draw();
				},
			},
			baitiemrfzcard3_skill: {
				enable: 'phaseUse',
				filter: function (event, player) {
					return player.getCards('h', function (card) {
						return get.tag(card, 'damage');
					}).length > player.countSkill('baitiemrfzcard3_skill');
				},
				filterCard: function (card) {
					return get.tag(card, 'damage');
				},
				selectCard: function () {
					var player = _status.event.player;
					return player.countSkill('baitiemrfzcard3_skill') + 1;
				},
				filterTarget: function (card, player, target) {
					return target != player && player.inRange(target);
				},
				position: 'h',
				prompt: function () {
					var player = _status.event.player;
					return '你可以弃置' + (player.countSkill('baitiemrfzcard3_skill') + 1) + '张带有伤害类标签的牌并对攻击范围内的一名角色造成一点伤害';
				},
				content: function () {
					target.damage();
					player.logSkill('baitiemrfzcardad', target);
				},
				ai: {
					order: 6,
					result: {
						target: -1,
					},
				},
			},
			//DP27
			DP27mrfz_skill: {
				mod: {
					cardnature: function (card, player) {
						var history = player.getHistory('useCard'), tmp_bool = false;
						for (var i = 0; i < history.length; i++) {
							if (history[i].card.name == 'sha') {
								tmp_bool = true;
								break;
							}
						}
						if (!card.nature && card.name == 'sha' && tmp_bool) return 'fire';
					},
				},
				trigger: { player: 'useCard' },
				forced: true,
				firstDo: true,
				filter: function (event, player) {
					if (!event.card) return false;
					return event.card.name == 'sha';
				},
				content: function () {
					'step 0'
					var history = player.getHistory('useCard'), tmp_bool = false;
					for (var i = 0; i < history.length; i++) {
						if (!history[i - 1]) continue;
						if (history[i - 1].card.name == 'sha') {
							tmp_bool = true;
							break;
						}
					}
					if (tmp_bool == false) event.goto(1);
					else if (!trigger.card.nature) {
						trigger.card.nature = 'fire';
					}
					'step 1'
					if (game.hasNature(trigger.card)) {
						if (!trigger.baseDamage) trigger.baseDamage = 1;
						trigger.baseDamage += 1;
					}
				},
				group: "DP27mrfz_skill_wushi",
				subSkill: {
					wushi: {
						trigger: {
							player: "useCardToPlayered",
						},
						filter: function (event) {
							return event.card && event.card.name == 'sha' && event.card.nature;
						},
						forced: true,
						logTarget: "target",
						content: function () {
							trigger.target.addTempSkill('qinggang2');
							trigger.target.storage.qinggang2.add(trigger.card);
							trigger.target.markSkill('qinggang2');
						},
						ai: {
							"unequip_ai": true,
							skillTagFilter: function (player, tag, arg) {
								if (arg && arg.name == 'sha' && game.hasNature(arg)) return true;
								return false;
							},
						},
					},
				},
			},
			//沙地兽
			shadishoumrfz_skill: {
				enable: 'phaseUse',
				usable: 1,
				filter: function (event, player) {
					return player.countCards('h') > 0;
				},
				filterCard: true,
				selectCard: 1,
				prompt:'是否发动【沙地兽】？',
				prompt2:'出牌阶段限一次，你可以弃置一张手牌，然后弃置【沙地兽】',
				check(card){
					return 8 - get.value(card);
				},
				async content(event, trigger, player) {
					var equip = player.getCards('e', function (card) {
						return card.name == 'shadishoumrfz';
					});
					player.discard(equip);
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},

			//剑助
			jianzhumrfz_skill:{
				trigger: {
					player: ["yingbian","damageEnd"],
				},
				equipSkill: true,
				forced: true,
				firstDo: true,
				filter(event, player){
					if(event.name=='damage') return true;
					return player.hasHistory("lose", evt => {
						return evt.getParent() == event && Object.values(evt.gaintag_map).some(value => value.join(" ").includes("shimomrfz_"));
					})||get.is.yingbianConditional(event.card);
				},
				content: () => {
					if(trigger.name=='damage'){
						const equip = player.getCards('e', function (card) {
							return card.name == 'jianzhumrfz';
						});
						player.discard(equip);
						return;
					}
					trigger.forceYingbian = true;
				},
			},
		},

		translate: {
			dazijimrfz: "打字机",
			"dazijimrfz_info": "当你使用【杀】指定目标时，你可以令此【杀】结算两次。（此装备离开你的装备区时，销毁之）",
			baitiemrfzcardad: '支援装备',
			baitiemrfzcard1: "攻击型平台",
			baitiemrfzcard1_skill: '援备',
			'baitiemrfzcard1_info': '当你造成至少两点伤害时，你可以令此伤害+1。',
			baitiemrfzcard2: "支援型平台",
			baitiemrfzcard2_skill: '援备',
			'baitiemrfzcard2_info': '锁定技，弃牌阶段开始时，你摸一张牌并额外执行一个出牌阶段。',
			baitiemrfzcard3: "铁钳号",
			baitiemrfzcard3_skill: "援备",
			'baitiemrfzcard3_info': '出牌阶段你可以弃置X张带有伤害类标签的牌，然后选择一名你攻击范围内的其他角色，对其造成一点伤害（X=此技能本回合使用数+1）。',
			DP27mrfz: 'DP27',
			DP27mrfz_skill: 'DP27',
			"DP27mrfz_info": '①锁定技，若你于本回合使用过【杀】，则你的非属性【杀】均视为火【杀】。②锁定技，你的属性杀无视防具且伤害基数+1。',
			shadishoumrfz: '沙地兽',
			shadishoumrfz_skill: '沙地兽',
			'shadishoumrfz_info': '①锁定技，当此牌不因交换装备或移动离开你的装备区时，销毁之。②出牌阶段限一次，你可以弃置一张手牌并弃置此牌。',
			sjzx_zhuihuomrfz: '天坠之火',
			'sjzx_zhuihuomrfz_info': '因【坠火】而置入判定区的牌可重复存在。判定阶段开始时，你须选择弃置两张牌或受到一点火焰伤害，然后将此牌置入弃牌堆。',
			jingtouE1mrfz: '镜头',
			jingtouE2mrfz: '镜头',
			jingtouE3mrfz: '镜头',
			jingtouE4mrfz: '镜头',
			jingtouE5mrfz: '镜头',
			jingtoumrfz_skill: '镜头',
			'jingtouE1mrfz_info': '锁定技，你的手牌始终明置；你始终视为在其他角色的攻击范围内；此牌离开你的装备区时，销毁之。',
			'jingtouE2mrfz_info': '锁定技，你的手牌始终明置；你始终视为在其他角色的攻击范围内；此牌离开你的装备区时，销毁之。',
			'jingtouE3mrfz_info': '锁定技，你的手牌始终明置；你始终视为在其他角色的攻击范围内；此牌离开你的装备区时，销毁之。',
			'jingtouE4mrfz_info': '锁定技，你的手牌始终明置；你始终视为在其他角色的攻击范围内；此牌离开你的装备区时，销毁之。',
			'jingtouE5mrfz_info': '锁定技，你的手牌始终明置；你始终视为在其他角色的攻击范围内；此牌离开你的装备区时，销毁之。',
			visible_jingtoumrfz: '明置',
			jianzhumrfz:"剑助",
			jianzhumrfz_skill:"剑助",
			"jianzhumrfz_info":"锁定技，使用带有应变效果的牌可无视条件直接生效；当你受到伤害后或此牌离开了你的装备区时，你将【剑助】销毁之。",
			ksl_lulitongxinmrfz:"勠力同心",
			"ksl_lulitongxinmrfz_info":"出牌阶段：<br>①你可以令X名没有被横置的角色横置，然后所有被横置的角色将手牌补至4张并明置所有手牌。（X=场上势力数）<br>②你可以令所有被横置的角色解除横置状态、弃置一张手牌，并暗置所有手牌。",
			cuoe_huanyoumrfzCard:"幻有",
			"cuoe_huanyoumrfzCard_info":"如真似幻，扑朔迷离。",
		}, list: [],
	};
	lib.translate['mrfzcard_card_config'] = '驶舰之向';
	// lib.config.all.cards.push('mrfzcard');
	if (!lib.config.cards.includes('mrfzcard')) lib.config.cards.push('mrfzcard');
	return mrfzcard;
});
