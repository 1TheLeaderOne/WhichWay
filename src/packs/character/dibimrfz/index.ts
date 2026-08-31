import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("dibimrfz", { pack: "epicSJZX",
			sex: "female",
			group: "gemrfz",
			hp: 4,
			skills: ["penhuimrfz"],
		});

skill({
	"penhuimrfz": {
			audio: 3,
			trigger: {
				player: "useCardAfter",
			},
			transferRGB(card) {
				let [r, g, b] = [0, 0, 0];
				let number = get.number(card),
					color = get.color(card),
					type = get.type2(card);
				// @ts-ignore
				let num = (number || 0) * 10;
				if (color === "red") {
					if (type === "basic") r += num;
					if (type === "equip") b += num;
					if (type === "trick") g += num;
				} else {
					if (type === "basic") r -= num;
					if (type === "equip") b -= num;
					if (type === "trick") g -= num;
				}
				return {
					r: r,
					g: g,
					b: b,
				};
			},
			async addColors(color1, color2) {
				function parseColor(color) {
					if (typeof color === "string") {
						const [r, g, b] = color.split(/[,|]/).map(Number);
						return { r, g, b };
					}
					return color;
				}

				const c1 = parseColor(color1);
				const c2 = parseColor(color2);

				function convert(num) {
					return ((num % 256) + 256) % 256;
				}

				return {
					r: convert(c1.r + c2.r),
					g: convert(c1.g + c2.g),
					b: convert(c1.b + c2.b),
				};
			},
			classifyColor(rgb) {
				const colorCenters = {
					red: { r: 255, g: 0, b: 0 },
					green: { r: 0, g: 255, b: 0 },
					blue: { r: 0, g: 0, b: 255 },
				};

				let minDist = Infinity;
				let closestType = null;

				for (let key in colorCenters) {
					const dist = getDistance(rgb, colorCenters[key]);
					if (dist < minDist) {
						minDist = dist;
						closestType = key;
					}
				}

				return closestType;

				function getDistance(c1, c2) {
					return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2));
				}
			},
			// @ts-ignore
			filter(event, player) {
				return event.card && typeof get.number(event.card) === "number";
			},
			mark: true,
			intro: {
				mark(dialog, storage) {
					if (storage === undefined)
						storage = {
							r: 64,
							g: 128,
							b: 128,
						};

					const content = dialog.querySelector(".content-container .content");

					const hsvFromRGB = rgbToHsv(storage.r, storage.g, storage.b);
					const v = hsvFromRGB.v;

					const panelSize = {
						width: 150,
						height: 75,
					};

					const panelContainer = ui.create.div(
						"penhuimrfz_color_panel_container",
						{
							width: `${panelSize.width}px`,
							height: `${panelSize.height}px`,
							margin: "10px auto",
							position: "relative",
							border: "1px solid #ccc",
						},
						content
					);

					const canvas = document.createElement("canvas");
					canvas.width = panelSize.width;
					canvas.height = panelSize.height;
					const ctx = canvas.getContext("2d");

					for (let x = 0; x < panelSize.width; x++) {
						for (let y = 0; y < panelSize.height; y++) {
							const hue = (x / panelSize.width) * 360;
							const sat = y / panelSize.height;

							const rgb = hsvToRgb(hue, sat, v);
							//@ts-ignore
							const pixelData = ctx.createImageData(1, 1);
							const data = pixelData.data;
							data[0] = rgb.r;
							data[1] = rgb.g;
							data[2] = rgb.b;
							data[3] = 255;
							//@ts-ignore
							ctx.putImageData(pixelData, x, y);
						}
					}

					panelContainer.appendChild(canvas);

					function getMarkerPosition(r, g, b) {
						const hsv = rgbToHsv(r, g, b);
						const x = (hsv.h / 360) * panelSize.width;
						const y = hsv.s * panelSize.height;
						return { x, y };
					}

					const markerPos = getMarkerPosition(storage.r, storage.g, storage.b);

					// @ts-ignore
					const marker = ui.create.div(
						"penhuimrfz_2d_marker",
						{
							width: "8px",
							height: "8px",
							position: "absolute",
							top: `${markerPos.y - 4}px`,
							left: `${markerPos.x - 4}px`,
							border: "2px solid white",
							borderRadius: "50%",
							boxShadow: "0 0 2px black",
							pointerEvents: "none",
							zIndex: "2",
						},
						panelContainer
					);

					const valueSliderContainer = ui.create.div(
						"penhuimrfz_value_slider_container",
						{
							width: "150px",
							height: "10px",
							margin: "10px auto",
							background: "linear-gradient(to right, black, white)",
							position: "relative",
							borderRadius: "5px",
						},
						content
					);

					// @ts-ignore
					const valueSliderMarker = ui.create.div(
						"penhuimrfz_value_slider_marker",
						{
							width: "4px",
							height: "100%",
							background: "red",
							position: "absolute",
							left: `${v * 100}%`,
							transform: "translateX(-2px)",
							pointerEvents: "none",
						},
						valueSliderContainer
					);

					const colorPreview = ui.create.div("penhuimrfz_preview", {
						width: "40px",
						height: "20px",
						display: "inline-block",
						backgroundColor: `rgb(${storage.r},${storage.g},${storage.b})`,
						border: "1px solid #999",
						marginRight: "10px",
						position: "relative",
					});

					const rgbDisplay = ui.create.div(
						"penhuimrfz_rgb_display",
						{
							display: "flex",
							fontSize: "14px",
							justifyContent: "center",
							alignItems: "center",
							marginTop: "5px",
						},
						content
					);
					rgbDisplay.appendChild(colorPreview);
					rgbDisplay.innerHTML += `RGB(${storage.r}, ${storage.g}, ${storage.b})`;

					// HSV/RGB conversion utils
					function hsvToRgb(h, s, v) {
						let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
						return {
							r: Math.round(f(5) * 255),
							g: Math.round(f(3) * 255),
							b: Math.round(f(1) * 255),
						};
					}

					function rgbToHsv(r, g, b) {
						((r /= 255), (g /= 255), (b /= 255));
						let max = Math.max(r, g, b),
							min = Math.min(r, g, b);
						let h,
							s,
							v = max;
						let d = max - min;
						s = max === 0 ? 0 : d / max;

						if (max === min) {
							h = 0;
						} else {
							switch (max) {
								case r:
									h = (g - b) / d + (g < b ? 6 : 0);
									break;
								case g:
									h = (b - r) / d + 2;
									break;
								case b:
									h = (r - g) / d + 4;
									break;
							}
							//@ts-ignore
							h /= 6;
						}
						//@ts-ignore
						return { h: h * 360, s: s, v: v };
					}
				},
			},
			forced: true,
			async content(event, trigger, player) {
				let rgb = lib.skill.penhuimrfz.transferRGB(trigger.card);
				game.broadcastAll(
					//@ts-ignore
					async function (rgb, player) {
						player.storage.penhuimrfz = await lib.skill.penhuimrfz.addColors(player.storage.penhuimrfz, rgb);
					},
					rgb,
					//@ts-ignore
					player
				);

				let color = lib.skill.penhuimrfz.classifyColor(player.storage.penhuimrfz);
				const translate = {
					blue: "蓝色",
					green: "绿色",
					red: "红色",
				};
				player.popup(translate[color]);
				switch (color) {
					case "blue":
						player.draw();
						break;
					case "green":
						player.markSkill("penhuimrfz_mark");
						player
							.when({ player: "useCardEnd" })
							.then(() => {
								player.unmarkSkill("penhuimrfz_mark");
							})
							.assign({
								mod: {
									// @ts-ignore
									targetInRange(card, player, target, now) {
										return true;
									},
								},
							});
						break;
					case "red": {
						const { targets } = await player
							.chooseTarget(true)
							.set("prompt", `对一名其他角色造成一点伤害`)
							.set("ai", target => get.attitude(player, target) < 0)
							.set("filterTarget", lib.filter.notMe)
							.forResult();
						if (!targets) return;
						if (targets[0]) targets[0].damage();
						break;
					}
				}
			},
			group: ["penhuimrfz_init", "penhuimrfz_tip"],
			subSkill: {
				mark: {
					charlotte: true,
					intro: {
						content: "下次使用牌无距离限制",
					},
				},
				init: {
					audio: "penhuimrfz",
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					forced: true,
					// @ts-ignore
					filter: function (event, player) {
						return event.name != "phase" || game.phaseNumber == 0;
					},
					// @ts-ignore
					async content(event, trigger, player) {
						player.storage.penhuimrfz = {
							r: 64,
							g: 128,
							b: 128,
						};
					},
				},
				tip: {
					charlotte: true,
					silent: true,
					init() {
						// @ts-ignore
						game.broadcastAll(function () {
							lib.translate["penhuimrfz_tip_blue"] = "<font color = blue>摸牌</font>";
							lib.translate["penhuimrfz_tip_red"] = "<font color = red>伤害</font>";
							lib.translate["penhuimrfz_tip_green"] = "<font color = green>距离</font>";
						});
					},
					trigger: {
						player: ["useCardAfter", "loseBegin", "gainBegin"],
					},
					lastDo: true,
					// @ts-ignore
					async content(event, trigger, player) {
						let tag = ["penhuimrfz_tip_blue", "penhuimrfz_tip_red", "penhuimrfz_tip_green"];
						tag.forEach(t => {
							player.removeGaintag(t);
						});
						let cards = trigger.name === "useCard" ? player.getCards("h") : player.getCards("h").concat(trigger.cards);
						for (let card of cards) {
							let rgb = lib.skill.penhuimrfz.transferRGB(card);
							let color = lib.skill.penhuimrfz.classifyColor(await lib.skill.penhuimrfz.addColors(player.storage.penhuimrfz, rgb));
							card.addGaintag(`penhuimrfz_tip_${color}`);
						}
					},
				},
			},
		},
});

translate({
	"dibimrfz": "蒂比",
	"penhuimrfz": "喷绘",
	"penhuimrfz_info": "锁定技，①游戏开始时，你创建一个2D颜色选择器，默认为青绿色（RGB（64，128，128））。②当你使用一张牌后，根据牌的类型、点数和颜色执行一次RGB计算：<br>颜色：红色~加法;黑色~减法<br>类型：基本~R;锦囊~G;装备~B<br>点数：值~此牌的点数的10倍。<br>然后根据当前颜色距离下列最近的颜色执行对应的效果:<br>绿色~下一张使用的牌无距离限制;<br>红色~对一名其他角色造成一点伤害;<br>蓝色~摸一张牌。",
});

characterTitle("dibimrfz", "<font color='#6495ed'>场景喷绘师</font>");

characterIntro("dibimrfz", "蒂比，蓝卡坞场景喷绘师。由本人主动联系，希望推动罗德岛与蓝卡坞双方，就为蓝卡坞感染者员工和演员提供医疗服务的问题，建立相关合作关系，同时根据本人意愿，作为特种干员为罗德岛提供服务。");
