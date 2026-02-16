import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayUtil } from "../../utill.js";

/**
 * @type {SMap<((player:Player)=>string)>}
*/
const dynamicTranslate = {
	tongmaimrfz: function (player) {
		let str = `你可以令一名深海猎人的角色回复一点体力或复原武将牌`,
			storage = player.storage.tongmaimrfz;
		if(!storage) storage = [];
		if (storage.includes(0))
			str = str.replace(
				"回复一点体力",
				"<font color=#696969>回复一点体力</font>"
			);
		if (storage.includes(1))
			str = str.replace(
				"复原武将牌",
				"<font color=#696969>复原武将牌</font>"
			);
		return `宗族技，每轮每项限一次，当你于回合外造成伤害后，${str}。`;
	},
	chonggoumrfz: function (player) {
		if (player.storage.chonggoumrfz) return '摸牌阶段开始时，若你的手牌数不小于你的体力值，你可以弃置所有手牌，回复一点体力，然后摸X张牌。（X=弃置牌的数量）';
		return '摸牌阶段开始时，若你的手牌数不小于你的体力值<span class=thundertext>且已受伤</span>，你可以弃置所有手牌，回复一点体力，然后摸X张牌。（X=弃置牌的数量<span class=thundertext>-已损失体力值</span>）';
	},
	kuanmrfz: function (player) {
		if (!player.storage.kuanmrfz) return '锁定技，游戏开始时，你废除所有装备栏和判定区并摸3张牌<span class=thundertext>；判定阶段，你依次进行【乐不思蜀】和【兵粮寸断】的判定</span>；你可以将装备牌当【杀】、【闪】或【酒】使用或打出，你的装备牌不计入手牌上限。';
		return '锁定技，游戏开始时，你废除所有装备栏和判定区并摸3张牌）；你可以将装备牌当【杀】、【闪】或【酒】使用或打出，你的装备牌不计入手牌上限。';
	},
	zhuguangmrfz: function (player) {
		if (!player.storage.zhuguangmrfz_change) return '准备阶段，你可以选择一名角色，视为对其使用【决斗】，当你因此牌对其他角色造成伤害时，你可以防止此伤害，然后选择一项：①删除【苦暗】描述中蓝色的文字；②修改【逐光】的描述；③摸一张牌。';
		return '准备阶段，你可以选择一名角色，视为对其使用【决斗】且此牌不可被其他角色响应，当你因此牌对其他角色造成伤害时，你可以选择一项：①删除【苦暗】描述中蓝色的文字；②摸两张牌。';
	},
	shuoguangmrfz: function (player) {
		if (player.storage.shuoguangmrfz) return '<font color=#696969>锁定技，你跳过你的第一个弃牌阶段。</font>';
		return '锁定技，你跳过你的第一个弃牌阶段。';
	},
	xunlumrfz: function (player) {
		return '锁定技，摸牌阶段，你改为随机摸<span class=thundertext>' + player.storage.xunlumrfz_draw + '</span>至6张牌；准备阶段，你将本回合出牌阶段使用【杀】的基数随机改为<span class=firetext>' + player.storage.xunlumrfz_sha + '</span>至5次；你的手牌上限随机改为<span class=greentext>' + player.storage.xunlumrfz_h + '</span>至8张。当你造成伤害时，你可以令一个有颜色的数字+1。（有颜色的数字的最大值至多为4，且本技能中的随机生成的随机数均符合正态分布）'
	},
	chaoshengmrfz: function (player) {
		if (player.countMark('jianshumrfz') == 15) return '结束阶段，若你连续<span class=thundertext>1</span>个回合没有造成过伤害，你可以摸两张牌并回复一点体力。'
		//@ts-ignore
		return '结束阶段，若你连续<span class=thundertext>' + player.countMark('jianshumrfz') >= 10 && player.countMark('jianshumrfz') < 15 ? "2" : (3 - Math.floor(player.countMark('jianshumrfz') / 5)) + '</span>个回合没有造成过伤害，你可以选择摸两张牌或回复一点体力。'
	},
	heishimrfz: function (player) {
		if (player.hasSkill('junumrfz_effect')) return '锁定技，你的【杀】无视防具；你对有防具的角色造成的伤害+1，对与你距离小于等于3的角色造成的伤害+1。';
		return '锁定技，你的使用的【杀】仅能指定与你距离不大于2的角色为目标，你的【杀】无视防具；你对有防具的角色造成的伤害+1，对与你距离为1的角色造成的伤害+1。';
	},
	wowumrfz: function (player) {
		if (player.countMark('wowumrfz_time') < 5) return '<span class=firetext>【劲发江潮落】</span></br>你的回合内，你每使用三张牌可视为使用一张不计入次数的【杀】，若此【杀】造成了伤害，你摸一张牌；锁定技，当你本局游戏累计发动5次【我无】时，修改此技能。';
		return '<span class=firetext>【气收秋毫平】</span></br>每当你累计使用或打出三张牌时，你可以视为使用一张无距离限制且不计入次数的【杀】，然后你摸一张牌。';
	},
	xuezhanmrfz: function (player) {
		if (!player.storage.xuezhanmrfz) return '锁定技，当你首次即将死亡时，取消之，然后你将体力值和体力上限调整至2，并摸4张牌。';
		return '<font color=#696969>锁定技，当你首次即将死亡时，取消之，然后你将体力值和体力上限调整至2，并摸4张牌。</font>';
	},
	dunpaomrfz: function (player) {
		if (!player.storage.dunpaomrfz) return '锁定技，你的攻击范围+5，你不能指定与你距离为1的角色为目标；当你使用【杀】对距离你大于1的角色造成伤害时，该角色进行判断，若不为红色，此伤害+1；回合开始时，你可以修改此技能。';
		return '锁定技，你的手牌上限+2。';
	},
	biaohaomrfz: function (player) {
		return '蓄力技（<font color=#e00500>' + player.countMark('charge') + '</font>/4），出牌阶段限两次，你可以弃置一张带有伤害类标签的牌，然后你增加一点蓄力值；你可以按照下列规则消耗蓄力值：①：消耗1点蓄力值，视为使用一张【杀】；②：出牌阶段，消耗4点蓄力值，视为使用三张【杀】和一张【万箭齐发】，然后失去3点体力。';
	},
	dianjingmrfz: function (player) {
		return !player.storage.dianjingmrfz ? '转换技，当你使用转化牌时，你可以从牌堆中获得与你使用的转化牌的<span class=thundertext>阳:牌名相同</span><font color=#696969>；阴:类型相同</font>的牌。' : '转换技，当你使用转化牌时，你可以从牌堆中获得与你使用的转化牌的<font color=#696969>阳:牌名相同；</font><span class=thundertext>阴:类型相同</span>的牌。';
	},
	yongwomrfz: function (player) {
		if (player.isTurnedOver()) return '①锁定技，<span class=thundertext>当你武将牌背面朝上时，你获得如下效果:1.当你的上家或下家使用牌后，其须弃置一张牌，其每累计因此弃置两张牌，你对其造成一点伤害，然后你可以选择将你的武将牌翻面；2.其他角色计算与你的距离+1；</span><font color=#696969>当你的武将牌正面朝上时，你获得如下效果：1.当你于一轮内首次进入濒死状态时，你将体力值回复至1，然后将你的武将牌翻面；2.任意角色的回合结束阶段，若你本回合受到或造成了伤害，你可以将你的武将牌翻面。</font>②锁定技，当你翻面至正面朝上时，你摸两张牌。';
		return '①锁定技，<font color=#696969>当你武将牌背面朝上时，你获得如下效果:1.当你的上家或下家使用牌后，其须弃置一张牌，其每累计因此弃置两张牌，你对其造成一点伤害，然后你可以选择将你的武将牌翻面；2.其他角色计算与你的距离+1；</font><span class=thundertext>当你的武将牌正面朝上时，你获得如下效果：1.当你于一轮内首次进入濒死状态时，你将体力值回复至1，然后将你的武将牌翻面；2.任意角色的回合结束阶段，若你本回合受到或造成了伤害，你可以将你的武将牌翻面。</span>②锁定技，当你翻面至正面朝上时，你摸两张牌。';
	},
	yuechuimrfz: function (player) {
		var mark = player.countMark('yuechuimrfz')>0?player.countMark('yuechuimrfz'):1;
		return `当你使用【杀】后，你可以摸[ ${mark} ]张牌，然后你可以选择依次执行下列任意个效果:<br>1.弃置一张装备牌，令[]中的数字+1（至多为3）;<br>2.对与其距离为1的一名其他角色造成一点伤害。`
	},
	zhenzamrfz: function (player) {
		return '①锁定技，游戏开始时你获得一个‘壁’标记；当有角色获得‘壁’标记时，若其没有护甲，其获得一点护甲；每轮各限两次，每名角色的准备阶段(<span class=thundertext>已发动:' + (player.hasMark('zhenzamrfz_time1') ? player.countMark('zhenzamrfz_time1') : 0) + '次</span>)或有其他角色因你造成的伤害而进入濒死状态时(<span class=thundertext>已发动:' + (player.hasMark('zhenzamrfz_time2') ? player.countMark('zhenzamrfz_time2') : 0) + '次</span>)，若你没有‘壁’标记，你获得一个‘壁’标记。②有‘壁’标记的角色受到伤害后，若其因此伤害触发过护甲且没有护甲，其可以随机获得攻击范围内一名其他角色的' + (player.storage.liuliemrfz ? '两' : '一') + '张牌并对其造成一点伤害。';
	},
	yiyinmrfz: function (player) {
		return '①蓄力技（' + player.countMark('charge') + '/3），出牌阶段，你可以弃置一张带有伤害类标签的牌，然后增加一点蓄力值。②当你使用【杀】的时，你可以消耗一点蓄力值并令此【杀】的伤害基数+1。';
	},
	kuangyumrfz: function (player) {
		if (player.storage.kuangyumrfz) return '每回合每名角色限一次，当你使用单一目标的锦囊牌指定其他角色为目标后，若该角色没有‘风起’标志，你可以使其获得一个“风起”标记（持续到其回合结束），且令其下回合随机跳过两个阶段，若该角色在你的攻击范围内，其于此牌结算完成之前，你对有‘风起’标记的角色造成的伤害+1。';
		return '每回合每名角色限一次，当你使用单一目标的普通锦囊牌或【杀】指定其他角色为目标后，若该角色没有‘风起’标志，你可以使其获得一个“风起”标记（持续到其回合结束），且令其下回合随机跳过两个阶段，若该角色在你的攻击范围内，其于此牌结算完成之前，你对有‘风起’标记的角色造成的伤害+1，然后若对其造成了伤害，你修改【狂语】直到下一轮开始。';
	},
	amy_qingyanmrfz: function (player) {
		var str1 = '①锁定技，';
		var str2 = '。②出牌阶段结束时，你可以删除【青焱①】中[]、{}或（）的内容直到本轮结束，然后令一名其他角色获得你删除的内容的效果直到其回合结束。';
		var str = '';
		var list = [player.storage.amy_qingyanmrfz_damage, player.storage.amy_qingyanmrfz_time, player.storage.amy_qingyanmrfz_direct];
		var del = ['<span style="text-decoration:line-through">{你每回合使用的第一张【杀】的伤害基数+1},</span>',
			'<span style="text-decoration:line-through">[你使用【杀】的次数+1],</span>',
			'<span style="text-decoration:line-through">(你使用的【杀】需要两张【闪】才可抵消),</span>'];
		var text = ['{你每回合使用的第一张【杀】的伤害基数+1},', '[你使用【杀】的次数+1],', '(你使用的【杀】需要两张【闪】才可抵消),'];
		for (var i = 0; i < list.length; i++) {
			if (list[i]) str = str + del[i];
			else str = str + text[i];
		}
		return str1 + str + str2;
	},
	xinyongwomrfz: function (player) {
		if (player.storage.xinyongwomrfz) return '转换技，<span class=thundertext>阳：当你进入濒死状态时，你可以回复至一点体力；</span><font color=#696969>阴：当你武将牌从正面朝上至背面朝上时，你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害。</font>';
		return '转换技，<font color=#696969>阳：当你进入濒死状态时，你可以回复至一点体力；</font><span class=thundertext>阴：当你武将牌从正面朝上至背面朝上时，你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害。</span>';
	},
	chongdanmrfz: function (player) {
		var str2 = '';
		if (player.storage.chongdanmrfz && player.storage.chongdanmrfz_player) str2 = '<font color=#696969>造成</font>/<font color=#696969>受到</font>';
		else if (player.storage.chongdanmrfz && !player.storage.chongdanmrfz_player) str2 = '<font color=#696969>造成</font>/受到';
		else if (player.storage.chongdanmrfz_player && !player.storage.chongdanmrfz) str2 = '造成/<font color=#696969>受到</font>';
		else str2 = '造成/受到';
		return '锁定技，每轮你至多能使用2X张牌；每轮每项限一次你第一次[' + str2 + ']伤害后，你摸等同于你体力值张牌或回复等同你手牌数点体力。（X=你的体力上限）';
	},
	tianyimrfz: function (player) {
		if (player.storage.tianyimrfz) return '转换技，一名角色的判定阶段，你可以，<span class=thundertext>阳：观看牌堆顶两张牌，并将其置于牌堆顶或牌堆底；</span><font color=#696969>阴：进行一次判定，并获得判定牌，本回合此牌视为【闪】，若判定结果为♣，你本局游戏使用【杀】的次数+1（至多+3）。</font>';
		return '转换技，一名角色的判定阶段，你可以，<font color=#696969>阳：观看牌堆顶两张牌，并将其置于牌堆顶或牌堆底；</span><span class=thundertext>阴：进行一次判定，并获得判定牌，本回合此牌视为【闪】，若判定结果为♣，你本局游戏使用【杀】的次数+1（至多+3）。</font>'
	},
	yirenmrfz: function (player) {
		return '蓄力技（<span class=thundertext>' + (player.countMark('charge') != undefined ? player.countMark('charge') : 0) + '</span>/∞）。①锁定技，回合结束时，你增加X点蓄力值。（X=本回合出牌阶段剩余使用【杀】的次数）②出牌阶段，你可以消耗[<span class=thundertext> ' + (player.storage.yirenmrfz_use != undefined ? Math.min(player.storage.yirenmrfz_use, 5) : 1) + ' </span>]点蓄力值，弃置两张手牌并选择至多两名其他角色，视为你对其各使用一张【杀】（目标必须合法且不计入次数限制）且其下个回合使用【杀】的次数-1，然后令[ ]中的数字+1（至多为5）。';
	},
	xujimrfz: function (player) {
		var storage = player.storage.shiyumrfz_buff;
		if (!storage) storage = 0;
		return '弃牌阶段开始时，若你本回合出牌阶段没有使用牌指定其他角色为目标，你可以令你下一张【杀】的伤害基数+1，然后你的手牌上限+5且选择一项:1.摸[ ' + (2 + storage) + ' ]张牌；2.使用一张【杀】且此杀需要[ ' + (2 + storage) + ' ]张【闪】才可抵消。';
	},
	suijiamrfz: function (player) {
		var del = player.storage?.suijiamrfz?.['del'];
		var damage = player.storage?.suijiamrfz?.['damage'];
		return '锁定技，当你造成伤害时' + (del == true ? '' : '，[ 若其有护甲 ]，则') + '，此伤害+{ ' + ((1 + damage) || 1) + ' }。'
	},
	yxliumingmrfz: function (player) {
		var hasSkill = player.hasSkill('yxliumingmrfz_ban');
		if (!hasSkill) return '①锁定技，游戏开始时或一名角色的回合开始时，若你武将牌上没有‘铭’，你将牌堆顶的一张牌置于你的武将牌上，称之为‘铭’。②锁定技，当你成为其他角色使用的牌的目标后，若此牌[花色/点数]与‘铭’[相同/不同]，则[你获得武将牌上的‘铭’/此牌对你无效，然后你失去此技能直到当前回合结束]。③你可以使用‘铭’。';
		return '①锁定技，游戏开始时或一名角色的回合开始时，若你武将牌上没有‘铭’，你将牌堆顶的一张牌置于你的武将牌上，称之为‘铭’。<font color=#696969>②锁定技，当你成为其他角色使用的牌的目标后，若此牌[花色/点数]与‘铭’[相同/不同]，则[你获得武将牌上的‘铭’/此牌对你无效，然后你失去此技能直到当前回合结束]。</font>③你可以使用‘铭’。'
	},
	lianmangmrfz: function (player) {
		var str = '锁定技。<br>①当你成为其他角色使用牌的目标后，你重铸至多X张牌（X=此牌牌名的字数），若你：1.因此重铸了带有伤害类标签的牌，你摸一张牌；2.因此重铸了所有手牌，对使用者造成一点伤害，然后你不能使用或打出手牌直到此牌结算完毕或你进入濒死状态。<br>②当你造成伤害时，你改为令你回复等量体力或摸等量的牌。';
		return player.hasSkill('zhanmangmrfz_ban') ? ('<font color=#696969>' + str + '</font>') : str;
	},
	zhuixiongmrfz:function (player){
		let hasSkill = player.hasSkill('yinhumrfz_addcount');
		return `出牌阶段限${hasSkill?'两':'一'}次，你可以视为对一名在你攻击范围内的其他角色使用一张不可被【无懈可击】响应的【决斗】，此决斗的造成的伤害+Y（Y=因此决斗而打出的【杀】）。`;
	},
	dichenmrfz(player){
		let storage = player.storage.dichenmrfz || [1,2,3,4];
		let num = storage.length;
		let content = [
			`<br>1.弃置判定区所有牌`,
			`<br>2.摸两张牌`,
			`<br>3.回复一点体力并在其回合结束时获得Y张【影】（Y=5-其手牌数）`,
			`<br>4.复原武将牌`
		]
		let contentAddition = content.map(str=>str.slice(6));
		let prompt = `出牌阶段限一次，你可以令一名攻击范围内的角色或你依次执行至第X项:`;
		prompt += content.slice(0, num).join('；');
		if(num!==4) prompt += "、";
		prompt += contentAddition.slice(num).join("、");
		prompt += `，然后将此项并入上一项。<br>(X=你的攻击距离-你与其的距离+1)`;
		return prompt;
	},
	sanyanmrfz:function (player){
		let str = [
			"任意角色的回合结束时，其每满足下列一项你便摸两张牌并删除此项直到本轮结束：",
			"1.回复过体力值；",
			"2.使用过装备牌；",
			"3.获得过牌。",
			"然后你可以令至多X名其他角色摸一张牌。（X=满足的项数）"
		]
		if(!player?.storage?.sanyanmrfz) return str.join('<br>');
		let stroage = player.storage.sanyanmrfz;
		if(!stroage.includes("recover")) str[1] = `<s>${str[1]}</s>`;
		if(!stroage.includes("useCard")) str[2] = `<s>${str[2]}</s>`;
		if(!stroage.includes("gain")) str[3] = `<s>${str[3]}</s>`;
		return str.join('<br>')
	},
	qiancimrfz(player){
		let cnNum = get.cnNumber((player.storage.qiancimrfz || 0) + 1);
		return `出牌阶段限${cnNum}次，你可以将一张手牌交给一名其他角色，并展示其三张手牌，对其造成X点伤害，然后若你因此:<br>1.造成了伤害，你回复一点体力；<br>2.杀死了一名角色，你令本技能出牌阶段可发动的次数+1。<br>（X=展示的牌中伤害类牌的数量）`;
	},
	youlinmrfz(player){
		let cnNum = player.hasSkill("youlinmrfz_addCount") ? "两" : "一";
		return `出牌阶段限${cnNum}次，你可以展示M张手牌并展示N张牌堆顶的牌（M+N=3），选择至多三名角色，然后根据你展示的牌这些角色执行对应的选项并获得X-M个“沫”标记：<br>1.点数均不同：获得一点护甲;<br>2.花色均不同：摸X张牌;<br>3.类型均不同：本技能本阶段改成“出牌阶段限两次”。（X=执行的选项数）`;
	},
	tiandingmrfz(player){
		let used = player.getHistory("useSkill",evt=>evt.skill==="tiandingmrfz").length;
		let num = player.storage.tiandingmrfz || 2;
		return `每回合限${get.cnNumber(num)}次(已使用<font color="red">${get.cnNumber(used)}</font>次)，每个阶段开始时，你可以进行一次判定并获得判定牌，若判定牌为红，你本回合使用【杀】的次数和攻击距离+1且本技能本回合发动次数+1，反之你跳过此阶段。`
	},
	wozhimrfz(player){
		return get.skillInfoTranslation(player.storage.zhanyemrfz?"wozhimrfz_rewrite":"wozhimrfz");
	},
	guishimrfz(player){
		return get.skillInfoTranslation(player.storage.zhanyemrfz?"guishimrfz_rewrite":"guishimrfz");
	},
	tanxianmrfz(player){
		let { draw, sha, attack } = player.storage.tanxianmrfz;
		let str = `锁定技。<br>①你的额定摸牌数为#r${draw}#;出牌阶段【杀】的使用次数+#r${sha}#;你的基础攻击范围为#r${attack}#;<br>②你的回合结束时，你令其中最大的数字-1，然后须重新分配此技能所有红色的数字。`
		return whichWayUtil.colorize(str);
	},
	yulimrfz(player){
		return player.storage.yulimrfz ? get.skillInfoTranslation("yulimrfz_rewirte") : get.skillInfoTranslation("yulimrfz")
	},
	sulimrfz(player){
		return player.storage.yulimrfz ? "出牌阶段，你可以弃置至多两张本阶段未以此法弃置过的类型的牌,若这两张牌的类型均不为你手牌中唯一最多的类型,你摸X张牌。（X=你手牌中没有的类型的数量）" : get.skillInfoTranslation("sulimrfz");
	},
	juetumrfz(player){
		let num = player?.storage?.juetumrfz?.draw || 3;
		let str = `出牌阶段限一次，你可以摸#r${num}#张牌，并与一名其他角色进行拼点，没有赢的角色受到一点伤害，若你首次以该点数拼点获胜，本技能红色数字+1，反之若你没赢，本技能红色数字-1（红色数字至少为1）。`
		return whichWayUtil.colorize(str);
	},
	lvmaimrfz(player){
		let str = `转换技，当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为①♠︎②♣︎③♥︎④♦︎，你摸一张牌。`
		switch(player.storage.lvmaimrfz){
			case 0:
				str =  `转换技，当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为①♠︎#s②♣︎③♥︎④♦︎#，你摸一张牌。`
				break;
			case 1:
				str = `转换技，当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为#s①♠︎#②♣︎③#s♥︎④♦︎#，你摸一张牌。`
				break;
			case 2:
				str = `转换技，当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为#s①♠︎②♣︎#③♥︎#s④♦︎#，你摸一张牌。`
				break;
			case 3:
				str = `转换技，当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为#s①♠︎②♣︎③♥︎#④♦︎，你摸一张牌。`
				break;
		}
		return whichWayUtil.colorize(str);
	},
	wenchoumrfz(player){
		return whichWayUtil.colorize(`你的任意阶段开始时，你可以重铸一张牌，若你重铸的牌是：<br>①【杀】或武器牌：令包含你在内的至多两名角色将手牌调整至#r${player?.storage?.wenchoumrfz || 4}#并跳过此阶段；<br>②非伤害类基本牌：你视为使用一张无距离和次数限制的【杀】，然后此技能本回合失效，并令此技能中的红色数字-1。`)
	},
	titimrfz_mingshimrfz(player){
		return whichWayUtil.colorize(`转换技，${player.storage.titimrfz_mingshimrfz ? "#s阳：出牌阶段限一次#;#y阴：当你受到伤害后#" : "#r阳：出牌阶段限一次#;#s阴：当你受到伤害后#"}。你可以展示手牌，并使用其中一张普通锦囊牌，你因此使用的普通锦囊牌额外结算Y次。（Y=你手牌中普通锦囊牌的数量）`)
	},
}

export default dynamicTranslate;
