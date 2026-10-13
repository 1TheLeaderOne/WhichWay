import { lib, game, ui, get, ai, _status, Game } from "noname";

export class GameExt extends Game {
	/**
	 * 获得所有连接牌
	 * @returns { Card[] | Array }
	 */
	getConnectCards(){
		return _status.sxrmConnectCards || [];
	}

	/**
	 * 刷新连接标记
	 */
	refreshMark() {
		//@ts-ignore
		game.filterPlayer(current => {
            //@ts-ignore
			if (current.getCards("h",card=>card.isConnect()).length) {
				current.markSkill("_sxrm_connect");
			} else {
				current.unmarkSkill("_sxrm_connect");
			}
		});
	}


	/**
	 * 统计所有玩家身上指定标记的数量总和
	 *
	 * 该函数会遍历所有玩家（或包括死亡玩家），根据过滤条件统计指定标记名称的总数量。
	 *k0
	 * @param {string} name - 要统计的标记名称
	 * @param {Function} [filter=()=>true] - 过滤函数，用于筛选需要统计的玩家，默认为全部玩家
	 * @param {boolean} [includeDeath=false] - 是否包含死亡玩家，默认不包含
	 * @returns {number} 返回所有符合条件的玩家身上的标记总数
	 *
	 * @example
	 * // 统计所有玩家身上的"sha"标记总数
	 * const totalShaMarks = game.countMark("sha");
	 *
	 * @example
	 * // 统计存活玩家中，与当前玩家同阵营的"tao"标记总数
	 * const sameGroupTaoMarks = game.countMark("tao", (player) => player.group === _status.event.player.group);
	 *
	 * @example
	 * // 统计所有玩家（包括死亡玩家）身上的"fire"标记总数
	 * const totalFireMarks = game.countMark("fire", ()=>true, true);
	 */
	countMark(name,filter,includeDeath = false){
		let num = 0;
		let players = includeDeath ? game.players.concat(game.dead) : game.players;
		if(typeof filter !== "function") filter = ()=>true;
		for(let char of players){
			if(filter(char)){
				num += char.countMark(name);
			}
		}
		return num;
	}

	/**
	 * @param { string } name
	 * @param {*} info
	 * @param { { translate: string, config: { [key: string]: object } } } info2
	 */
	addModeSJZX(name, info, info2) {
		lib.config.all.mode.push(name);
		lib.translate[name] = info2.translate;
		let imgsrc;
		//@ts-ignore
		let extname = _status.extension || info2.extension;
		if (info.splash) {
			imgsrc = info.splash;
		} else {
			//@ts-ignore
			if (_status.evaluatingExtension) {
				imgsrc =
					"extension-" +
					extname +
					":image/mode/backgroud/" +
					name +
					".jpg";
			} else {
				imgsrc =
					"ext:" + extname + "/image/mode/backgroud/" + name + ".jpg";
			}
		}
		lib.mode[name] = {
			name: info2.translate,
			config: info2.config,
			splash: imgsrc,
			fromextension: true,
		};
		lib.init["setMode_" + name] = async () => {
			await game.import("mode", (lib, game, ui, get, ai, _status) => {
				info.name = name;
				return info;
			});
		};
		if (!lib.config.extensionInfo[extname]) {
			lib.config.extensionInfo[extname] = {};
		}
		if (!lib.config.extensionInfo[extname].mode) {
			lib.config.extensionInfo[extname].mode = [];
		}
		if (lib.config.extensionInfo[extname].mode.indexOf(name) == -1) {
			lib.config.extensionInfo[extname].mode.push(name);
		}
		game.saveConfig("extensionMode", lib.config.extensionInfo);
	}

	totalmark(str) {
		let num = 0;
		for (let i = 0; i < game.players.length; i++) {
			if (game.players[i].hasMark(str))
				num += game.players[i].countMark(str);
		}
		return num;
	}

	shushuRDbet(min, max) {
		let mid = (min + max) / 2;
		let prob = Math.random();
		if (prob < 0.8) {
			return Math.floor(Math.random() * (max - mid + 1)) + mid;
		} else {
			return Math.floor(Math.random() * (mid - min + 1)) + min;
		}
	}

	RDNbet(min, max) {
		let rand = 0;
		for (let i = 0; i < 6; i += 1) {
			rand += Math.random();
		}
		rand = rand / 6;
		return Math.floor(rand * (max - min + 1) + min);
	}

	RDbet(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	mostStr(arr) {
		let sortedArr = arr.slice().sort();
		let maxCount = 0;
		let maxStrings = [];
		let currentCount = 1;
		let currentString = sortedArr[0];
		for (let i = 1; i <= sortedArr.length; i++) {
			if (i < sortedArr.length && sortedArr[i] === currentString) {
				currentCount++;
			} else {
				if (currentCount >= maxCount) {
					if (currentCount > maxCount) {
						maxStrings = [];
					}
					maxCount = currentCount;
					maxStrings.push(currentString);
				}
				if (i < sortedArr.length) {
					currentString = sortedArr[i];
					currentCount = 1;
				}
			}
		}
		return maxStrings;
	}

	getGlobalmark(str) {
		var num = 0;
		for (var i = 0; i < game.players.length; i++) {
			var players = game.players[i];
			if (players.hasMark(str)) num += players.countMark(str);
		}
		return num;
	}
}