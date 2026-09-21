import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("aiguozhemrfz", { pack: "plotSJZX",
			sex: "male",
			group: "zhmrfz",
			hp: 4,
			skills: ["xinjunxingmrfz","youjimrfz"],
		});

skill({
	"xinjunxingmrfz": {
			audio: 2,
			direct: true,
			locked: true,
			derivation: ["sptunjiang", "reqiaobian", "xinlvli", "rezhanjue"],
			trigger: {
				player: ["phaseChange", "drawAfter", "loseAfter"],
			},
			filter: function (event, player) {
				if (event.name === "draw") return event.num > 0;
				else if (event.name === "lose") return event.type == "discard";
				else if (event.name === "phase")
					return !player.storage.xinjunxingmrfz || !player.storage.xinjunxingmrfz.isSubset(player.getSkills(null, false, false));
				return false;
			},
			async content(event, trigger, player) {
				if (!Array.isArray(player.storage.xinjunxingmrfz)) player.storage.xinjunxingmrfz = [];
				if (trigger.name === "draw") {
					player.storage.xinjunxingmrfz = ["sptunjiang", "reqiaobian"];
				} else if (trigger.name === "lose") {
					player.storage.xinjunxingmrfz = ["xinlvli", "rezhanjue"];
				} else {
					await player.removeSkill(["sptunjiang", "reqiaobian", "xinlvli", "rezhanjue"]);
					player.addSkill(player.storage.xinjunxingmrfz);
					player.logSkill("xinjunxingmrfz");
				}
			},
		},
	"youjimrfz": {
			//audio:2,
			forced: true,
			trigger: {
				player: "phaseBegin",
			},
			async content(event, trigger, player) {
				//不在己方的控制下（托管等）：把决定权交回托管者，不弹本机的窗
				if (player.isUnderControl()) {
					game.swapPlayerAuto(player);
				}

				/**
				 * 打开「调换阶段顺序」对话框：点一个阶段选中（蓝底），再点另一个即交换两者；重复点同一个则取消选中。
				 * 联机时本函数会被 `send` 到客户端执行，所以事件必须用 `_status.event` 取，不能闭包引用外层的变量。
				 */
				const chooseButton = function (phases, resolve) {
					/**
					 * 阶段文字。要兼容三种写法（见 `content.phase` 对 phaseList 的解析）：
					 * - `phaseUse`：标准阶段，扩展的 `tranPhase` 能翻译；
					 * - `phaseUse|技能名`：被技能改造过的阶段，取 `|` 前的主阶段名；
					 * - `skipZhunbei` / `skipZhunbei-原因`：被跳过的阶段，标出来且取 `-` 前的主阶段名。
					 */
					const phaseText = phase => {
						const [head] = String(phase).split("|");
						const [name] = head.split("-");
						if (name.startsWith("skip")) {
							const phaseName = "phase" + name.slice(4);
							return "跳过·" + (get.tranPhase(phaseName) ?? get.translation(phaseName));
						}
						return get.tranPhase(name) ?? get.translation(name);
					};
					const event = _status.event;
					const dialog = ui.create.dialog("【游击】:你可以掉换执行阶段的顺序</br>执行顺序为由左到右依次执行", "hidden");
					event.dialog = dialog;
					const table = document.createElement("div");
					table.classList.add("add-setting");
					table.style.margin = "0";
					table.style.width = "100%";
					table.style.position = "relative";
					/** 阶段按钮，下标与 `phases` 一一对应 */
					const tdList = [];

					/** 交换两个按钮的位置与文字，并同步回 `phases`（本机选择时它就是 `trigger.phaseList`） */
					const swap = (node1, node2) => {
						const index1 = tdList.indexOf(node1);
						const index2 = tdList.indexOf(node2);
						const link = node1.link;
						node1.link = node2.link;
						node2.link = link;
						node1.innerHTML = "<span>" + phaseText(node1.link) + "</span>";
						node2.innerHTML = "<span>" + phaseText(node2.link) + "</span>";
						[phases[index1], phases[index2]] = [phases[index2], phases[index1]];
						node1.classList.remove("bluebg");
						node2.classList.remove("bluebg");
					};

					const clickHandler = function () {
						//刚拖拽过（或正在拖拽）不算点击
						if (_status.dragged || _status.justdragged) return;
						_status.tempNoButton = true;
						setTimeout(function () {
							_status.tempNoButton = false;
						}, 500);

						if (this.classList.contains("bluebg")) {
							//重复点已选中的：取消选中
							this.classList.remove("bluebg");
							return;
						}
						this.classList.add("bluebg");
						//选中状态就写在蓝底上，选满两个直接交换（不再用额外数组记账、也不再逐个清蓝底）
						const selected = tdList.filter(node => node.classList.contains("bluebg"));
						if (selected.length === 2) swap(selected[0], selected[1]);
					};

					phases.forEach(phase => {
						const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
						td.link = phase;
						td.innerHTML = "<span>" + phaseText(phase) + "</span>";
						td.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickHandler);
						tdList.push(td);
						table.appendChild(td);
					});
					dialog.content.appendChild(table);
					dialog.add("  ");
					dialog.open();

					/** 结束选择：记录当前顺序、关窗、恢复游戏；`resolve` 只在「本机选择」时存在 */
					let finished = false;
					const finish = () => {
						//OK 与自动接管都可能触发，这里只放行一次（否则 game.resume() 会重复计数）
						if (finished) return;
						finished = true;
						if (!event._result) event._result = {};
						event._result.phases2 = phases;
						dialog.close();
						if (event.control) event.control.close();
						game.resume();
						_status.imchoosing = false;
						if (resolve) resolve(true);
					};

					//托管 / 被自动接管时也走 finish：原先这里不 resolve，本机选择的 await 会一直挂着
					event.switchToAuto = finish;
					event.control = ui.create.control("ok", finish);
					game.pause();
				};

				if (event.isMine()) {
					await new Promise(resolve => {
						chooseButton(trigger.phaseList, resolve);
					});
				} else if (event.isOnline()) {
					event.player.send(chooseButton, trigger.phaseList);
					event.player.wait();
					game.pause();
				}
				//AI / 其余情况：不调换顺序，保持本回合原有的阶段表
				//（原先在这里给 AI 写死了一套 ["phaseUse","phaseDraw",...] 的乱序，会覆盖掉本回合真实的阶段表）

				//没有调换过（phases2 为空）就保持原顺序
				const result = event.result || event._result;
				if (result?.phases2?.length) trigger.phaseList = result.phases2;
				//阶段名可能被别的技能改成 `phaseUse|技能名` 这类组合项，日志里取 `|` 前的主阶段名
				const phaseNames = trigger.phaseList.map(phase => get.tranPhase(phase) ?? get.translation(String(phase).split("|")[0]));
				game.log(player, "阶段执行顺序为", `#y${phaseNames.join("、")}`);
			},
		},
});

translate({
	"aiguozhemrfz": "爱国者",
	"xinjunxingmrfz": "军行",
	"xinjunxingmrfz_info": "锁定技，你的任意阶段结束时，若你本阶段最后一次手牌数变化是因[弃置而置入弃牌堆/摸牌]而导致，你失去以此法获得的所有技能，然后获得[“膂力”和“战绝”/“屯江”和“巧变”]。",
	"youjimrfz": "游击",
	"youjimrfz_info": "锁定技，回合开始时，你选择以任意顺序执行本回合的所有阶段。",
});

characterTitle("aiguozhemrfz","永恒行军");

characterIntro("aiguozhemrfz", "摘自PRTS的梗概</br>爱国者，本名博卓卡斯替，整合运动干部，霜星的养父。属于萨卡兹中的古老分支——温迪戈，且是最后一位纯血温迪戈。与凯尔希和特蕾西娅是旧识。曾与赫拉格同为乌萨斯军官，后不幸感染矿石病并隐瞒了病情。因在镇压感染者暴动中误杀自己的儿子格罗瓦兹尔而决定放弃军官身份组成游击队，在乌萨斯的雪原上游走，保护感染者。在雪原上的矿场救下即将被处死的霜星。后在塔露拉的邀请下加入整合运动。对下属整合运动军纪要求十分严格。非常尊敬赫拉格，并与其达成了互不开战的承诺。在守卫切尔诺伯格核心城时固执地与罗德岛发生战斗，最终以自己的阵亡反抗命运。");
