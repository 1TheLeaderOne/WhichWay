import { lib, game, ui, get, ai, _status } from "noname";
import { card as cardHook, cardSkill, cardTranslate } from "../../hooks.js";

cardHook("cuoe_huanyoumrfzCard", {
				image: `ext:WhichWay/image/character/cuoemrfz.jpg`,
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
});

cardTranslate({
	cuoe_huanyoumrfzCard:"幻有",
	"cuoe_huanyoumrfzCard_info":"如真似幻，扑朔迷离。",
});
