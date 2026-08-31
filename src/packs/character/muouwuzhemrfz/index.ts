import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("muouwuzhemrfz", { pack: "specialSJZX",
			sex: "female",
			group: "bomrfz",
			hp: 2,
			skills: [],
			isAiForbidden: true,
		});

translate({
	"muouwuzhemrfz": "木偶舞者",
});

characterIntro("muouwuzhemrfz", "一个脸颊烧焦的小木偶，圆溜溜的眼睛让你想起特克诺撒娇时的样子。");
