import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("fengwan_zhioumrfz", { pack: "specialSJZX",
			sex:"female",
			group:"dongmrfz",
			hp:1,
			maxHp:2,
			skills:[],
			isAiForbidden:true
		});

translate({
	"fengwan_zhioumrfz": "纸偶",
});

characterTitle("fengwan_zhioumrfz", "<font color='yellow'>栩栩如生</font>");
