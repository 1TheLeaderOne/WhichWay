import { lib, game, ui, get, ai, _status } from "noname";
import { card as cardHook, cardSkill, cardTranslate } from "../hooks.js";

cardHook("ksl_lulitongxinmrfz", {
				image: `ext:WhichWay/image/card/ksl_lulitongxinmrfz.jpg`,
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
});

cardTranslate({
	ksl_lulitongxinmrfz:"勠力同心",
	"ksl_lulitongxinmrfz_info":"出牌阶段：<br>①你可以令X名没有被横置的角色横置，然后所有被横置的角色将手牌补至4张并明置所有手牌。（X=场上势力数）<br>②你可以令所有被横置的角色解除横置状态、弃置一张手牌，并暗置所有手牌。",
});
