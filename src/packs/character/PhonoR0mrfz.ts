import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("PhonoR0mrfz", { pack: "mediocreSJZX",
			hp:3,
			group:"luomrfz",
			sex:"female",
			skills:["songgemrfz"],
		});

skill({
	"songgemrfz": {
			audio:["作战中1", "作战中2","作战中3"],
			trigger:{
				player:["damageEnd","phaseUseBegin"],
			},
			frequent:true,
			async content(event,trigger,player){
				/** @type { Array<Card> } */
				let cards = [];
				while(true){
					const  result  = await player.judge()
						.set("judge",card=>{
							//@ts-ignore
							let { judgeSuits , judgeNames} = get.event();
							return judgeSuits.includes(get.suit(card)) || judgeNames.includes(get.name(card)) ? -1 : 4;
						})
						.set("judge2",result=>result.bool)
						.set("judgeSuits",cards.map(i=>get.suit(i)))
						.set("judgeNames",cards.map(i=>get.name(i)))
						.set("callback",async event=>{
							event.parent?.orderingCards.remove(event.card)
						}).forResult();
					//@ts-ignore
					if(result.card) cards.push(result.card);
					if(
						cards.map(i=>get.suit(i)).length !== new Set(cards.map(i=>get.suit(i))).size ||
						cards.map(i=>get.name(i)).length !== new Set(cards.map(i=>get.name(i))).size
					) break;

					const {bool} = await player.chooseBool(get.prompt("songgemrfz"))
						.set("frequentSkill","songgemrfz").forResult();
					if(bool !== true) break; 
				}
				cards = cards.filterInD();
				if(cards.length) player.gain(cards,"gain2");
			},
			ai:{
				threaten:0.5,
				maixie:true,
				maixie_hp:true,
				maixie_defend:true,
			},
		},
});

translate({
	"PhonoR0mrfz": "PhonoR-0",
	"songgemrfz": "颂歌",
	"songgemrfz_info": "当你受到伤害后，或出牌阶段开始时，你可以进行判定并获得判定牌，然后你可以重复这个流程直到出现重复花色或牌名的判定牌。",
});

characterTitle("PhonoR0mrfz", "<font color = #b7229c66>悠远河谷的齐唱</font>");

characterIntro("PhonoR0mrfz", "R&V型巫术作业平台PhonoR-0，罗德岛首款且唯一一款搭载女妖咒言法器的智能作业平台。与其他客制化的雷神工业作业平台不同，她的诞生离不开罗德岛干员的顶尖技术与女妖们之间的默契。从其运行机构、传动系统及核心的巫术元件的设计来看，比起轮式作业平台，PhonoR-0更像一座移动的巫术祭坛。作为尖端工业技术与萨卡兹巫术结合的产物，PhonoR-0的基本性能并不出众，但她易于部署，能随时对行动干员进行支援，现作为辅助干员参与相关作战任务。");
