import { translate, dynamicTranslate } from "../hooks.ts";

translate({
	"dazijimrfzskill": "打字机",
	"dazijimrfzskill_info": "当你使用【杀】指定目标时，你可以令此【杀】结算两次。（此装备离开你的装备区时，销毁之）",
	"dazijimrfzskill2": "打字机",
	"dazijimrfzskill2_info": "",
	"suwangmrfz": "溯往",
	"suwangmrfz_info": "锁定技，摸牌阶段，若你上回合没有造成伤害，你的摸牌数-2；准备阶段，你摸6张牌，然后弃置6-X张牌。（X=当前轮次数且X至多为6）",
	"suwangmrfz2": "溯往",
	"suwangmrfz2_info": "",
	"suwangmrfz3": "溯往",
	"suwangmrfz3_info": "",
	"caiganmrfz": "才干",
	"caiganmrfz_info": "当你不因【才干】获得牌时，你可以弃置获得的任意数量的牌，然后摸等量的牌,若你本回合没有发动过【才干】，则你额外摸一张牌。",
	"huangxiangmrfzx": "残影",
	"fuxiemrfzx": "浮标",
	"shizhunmrfz": "失准",
	"shizhunmrfz_info": "锁定技，其他角色准备阶段，若其有“浮标”，则其进行判定，若判定结果为黑，则你对其造成一点雷电伤害，然后其失去一个“浮标”，反之，你获得判定牌。",
	"beifeng_lvmengmrfz": "北风(<font color = rgb(255,255,255)>摸牌</font>)",
	"zhongzi_lvmengmrfz": "种子(<font color = #3c61ec>给牌</font>)",
	"pimao_lvmengmrfz": "皮毛(<font color = #e83121>强中</font>)",
	"yuximrfzx": "死魂灵",
	"newhuangxiangmrfzx": "残影",
	"visible_xunxinmrfz": "明置",
	"visible_eyanmrfz": "明置",
	"xuexingmrfz": "雪行",
	"xuexingmrfz_info": "①锁定技，你不能成为冰【杀】的目标；当你于出牌阶段外因弃置而失去手牌后，你摸一张牌。②你可以将黑色牌当作冰【杀】使用或打出。",
	"chegumrfz": "彻骨",
	"chegumrfz_info": "当你使用牌指定一名其他角色为目标后，你可以令其[装备区/武将牌上的技能]中所有[牌名/技能名]且描述中没有“冰”的[牌/技能]失效（宝物栏的牌除外）直到其下个回合结束。",
	"newchegumrfz": "彻骨",
	"newchegumrfz_info": "当你使用牌指定一名其他角色为目标后，你可以令其[装备区/武将牌上的技能]中所有[牌名/技能名]且描述中没有“冰”的[牌/技能]失效（宝物栏的牌除外）直到其下个回合结束。",
	"donghenmrfz": "冬痕",
	"donghenmrfz_info": "当你进入濒死状态时，你可以增加一点体力上限并将体力调整至体力上限，然后你失去【冬痕】和【雪行】，获得【燃命】且使用【杀】的次数+1。",
	"ranmingmrfz": "燃命",
	"ranmingmrfz_info": "①锁定技，当你造成伤害后，你失去一点体力值；当你失去手牌时，你摸一张牌；当你回复体力值时，取消之。②你可以将一张牌当作冰【杀】使用或打出。",
	"junxingmrfz": "军行",
	"junxingmrfz_info": "①你每回合的第X个阶段结束时，你可以与你一名攻击范围内的其他角色进行拼点，若你赢，你视为对其使用一张【杀】，反之，其视为对你使用一张【杀】。（X=你本回合造成的伤害数）</br>②锁定技，体力值不大于你的其他角色不能响应你使用的牌。</br>③锁定技，当你已损失体力值小于2时，你获得【同协】，反之你每回合的第一张【杀】额外结算一次。",
	"budaomrfz": "布道",
	"budaomrfz_info": "①出牌阶段，你可以将一张黑色牌置于你攻击范围内的一名其他角色的判定区。②锁定技，摸牌阶段你额外摸X张牌（X=场上判定区内牌的数量）。",
	"zhuranmrfz": "逐燃",
	"zhuranmrfz_info": "锁定技，其他角色的回合开始阶段，",
	"jujumrfz": "踽踽",
	"jujumrfz_info": "锁定技，准备阶段，若你有被废弃的装备栏且你杀死过一名其他角色，你选择流失一点体力或失去一点体力上限，然后你恢复一个装备栏。<br><span style=\"font-family: yuanli\">\"有杕之杜，其叶湑湑，独行踽踽。\"</span>",
	"shuitamrfzx": "咪啵",
	"jingtoumrfz_show": "镜头",
	"jingtoumrfz_show_info": "·武器牌 ♥7 攻击距离0<br>·防具牌 ♣7<br>·进攻马/防御马 ♠7 攻击距离+1/防御距离-1<br>·宝具栏 ♦7<br>锁定技，你的手牌始终明置；你始终视为在其他角色的攻击范围内；此牌离开你的装备区时，销毁之。",
	"tongqingmrfzx": "情绪",
	"shuangxingmrfz": "霜星",
	"donghenshuangxingmrfz": "<font color=#8dc2f6><b>冬痕</b></font>霜星",
	"spweinamrfz_ab": "维多利亚",
	"shuangwangmrfz_ab": "萨卡兹双王",
	"spheijiaomrfz_ab": "太刀侠黑角",
	"visible_shenshemrfz": "明置",
	"shixingmrfz_trick_backup": "逍遥",
	"beicaimrfzx": "<font color='#8b008b'>能吃？</font>",
	"pengcaimrfzx": "<font color='red'>吃饱了！</font>",
	"xingzhumrfz_tag": "帙",
});

//森蚺觉醒后的随机称号（动态翻译）
dynamicTranslate({
	senrantieyumrfz: function (player) {
		return (
			"<font color=`#FF1111`>" +
			["浪人", "帝王", "强力", "离子", "军团", "烈焰", "先锋"].randomGet() +
			"</font>森蚺"
		);
	},
});
