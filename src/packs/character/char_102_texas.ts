import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

character("char_102_texas", { pack: "epicSJZX", sex: "female", group: "qimrfz", hp: 4, skills: ["sudimrfz", "jianyumrfz"] });

skill({
	jianyumrfz: {
		audio: ["部署1","作战中3"],
	},
	sudimrfz: {
		audio: ["完成高难行动","作战中2"],
		frequent: true,
	},
});

translate({
	char_102_texas: "德克萨斯",
	jianyumrfz: "剑雨",
	jianyumrfz_info: "出牌阶段限一次，你可以展示牌堆顶四张牌，并选择其中任意张不同花色牌当指定等量目标的【万箭齐发】使用，因此牌而受到伤害的角色选择弃置两张手牌或下一个出牌阶段使用【杀】的次数-1（不可叠加）。",
	sudimrfz: "速递",
	sudimrfz_info: `每轮开始时，你可以观看牌堆顶四张牌并将其中任意张不同花色牌给任意角色。`,
});

characterIntro("char_102_texas", "德克萨斯，企鹅物流员工，单兵作战能力出类拔萃。</br>于合约期内任企鹅物流驻罗德岛联络人员，同时为罗德岛的多项行动提供协助。");

characterTitle("",whichWayUtil.colorize("#b叙拉古的逃难者#"));