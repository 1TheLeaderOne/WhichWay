import { lib, get, ui, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("suocaomrfz", {
  sex: "female",
  group: "samrfz",
  hp: 3,
  skills: ["lanjuanmrfz", "xinglumrfz"]
});
skill({
  "lanjuanmrfz": {
    intro: {
      content(event, player) {
        let storage = player.storage.lanjuanmrfz;
        let nameList = storage["name"].length > 0 ? storage["name"] : "无";
        let numberList = storage["number"].length > 0 ? storage["number"] : "无";
        let suitTranslation = storage["suit"].length > 0 ? get.translation(storage["suit"]) : "无";
        if (Array.isArray(nameList)) {
          nameList.sort((a, b) => a.length - b.length);
        }
        if (Array.isArray(numberList)) {
          numberList.sort((a, b) => a - b);
        }
        return `
    					    ·牌名: ${get.translation(nameList)}<br>
    					    ·点数: ${get.translation(numberList)}<br>
    					    ·花色: ${suitTranslation}
    					`;
      }
    },
    mark: true,
    init(player, skill2) {
      player.storage[skill2] = {
        name: [],
        suit: [],
        number: []
      };
    },
    onremove: true,
    audio: 2,
    trigger: {
      player: ["useCardAfter", "respondAfter", "phaseDrawBegin2"]
    },
    filterType(card, player, modify) {
      let storage = player.storage.lanjuanmrfz;
      let result = {
        name: [],
        suit: [],
        number: []
      };
      const maps = {
        name: lib.inpile,
        suit: lib.suit,
        number: Array.from({ length: 13 }, (v, i) => i + 1)
      };
      function checkAndAdd(type) {
        const value = get[type](card);
        if (!storage[type].includes(value)) {
          result[type].push(value);
          result[type] = result[type].filter((item) => new Set(maps[type]).has(item));
        }
      }
      checkAndAdd("name");
      checkAndAdd("suit");
      checkAndAdd("number");
      if (modify) {
        player.storage.lanjuanmrfz = {
          name: [...result.name, ...storage.name],
          suit: [...result.suit, ...storage.suit],
          number: [...result.number, ...storage.number]
        };
        return result;
      }
      return result.name.length > 0 || result.suit.length > 0 || result.number.length > 0;
    },
    filter(event, player) {
      if (event.name == "phaseDraw") {
        let count = Object.values(player.storage.lanjuanmrfz).reduce((sum, arr) => sum + arr.length, 0);
        return !event.numFixed && Math.pow(count, 1 / 3) >= 1;
      } else return event.card && lib.skill.lanjuanmrfz.filterType(event.card, player, false);
    },
    direct: true,
    async content(event, trigger, player) {
      if (_status.poison_suocaoSJZX != true) {
        player.logSkill("lanjuanmrfz");
        _status.poison_suocaoSJZX = true;
        setTimeout(() => delete _status.poison_suocaoSJZX, 3e3);
      }
      if (trigger.name == "phaseDraw") {
        let count = Object.values(player.storage.lanjuanmrfz).reduce((sum, arr) => sum + arr.length, 0);
        trigger.num += Math.floor(Math.pow(count, 1 / 3));
      } else lib.skill.lanjuanmrfz.filterType(trigger.card, player, true);
    },
    mod: {
      maxHandcard: function(player, num) {
        let count = Object.values(player.storage.lanjuanmrfz).reduce((sum, arr) => sum + arr.length, 0);
        return num + Math.floor(Math.pow(count, 1 / 3));
      }
    }
  },
  "xinglumrfz": {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    findCards(info) {
      const { name, suit, number } = info;
      const filter = function(card) {
        return get.number(card) == number && get.suit(card) == suit && get.name(card) == name;
      };
      let list = [];
      for (let i = 0; i < ui.cardPile.childNodes.length; i++) {
        var j = i;
        if (j >= ui.cardPile.childNodes.length) j -= ui.cardPile.childNodes.length;
        if (filter(ui.cardPile.childNodes[j])) {
          list.push(ui.cardPile.childNodes[j]);
        }
      }
      return list;
    },
    getResult(info) {
      const { name, suit, number } = info;
      let cardsList = [];
      for (let keyName of name) {
        for (let keySuit of suit) {
          for (let keyNum of number) {
            let find = lib.skill.xinglumrfz.findCards({ name: keyName, suit: keySuit, number: keyNum });
            if (find.length > 0) cardsList.push(find);
          }
        }
      }
      return cardsList;
    },
    filter(event, player) {
      let storage = player.storage.lanjuanmrfz;
      if (!storage) return false;
      return storage["name"].length > 0 && storage["suit"].length > 0 && storage["number"].length > 0;
    },
    async content(event, trigger, player) {
      const storage = player.storage.lanjuanmrfz;
      const { control } = await player.chooseControl("自动选择", "手动选择").set("prompt", "【行路】:是否让系统自动为你提供方案？").set("ai", () => "自动选择").forResult();
      if (control === "自动选择") {
        let cards2 = lib.skill.xinglumrfz.getResult(storage);
        const maxIndex = cards2.map((i) => player.getUseValue(i)).indexOf(Math.max(...cards2.map((i) => player.getUseValue(i))));
        if (cards2.length < 1) {
          player.popup("没有符合条件的组合");
          return;
        }
        let control2 = [];
        for (let i = 0; i < cards2.length; i++) {
          control2.push([i, `第${get.cnNumber(i + 1, true)}组`]);
        }
        let dialogAuto = [
          `【行路】:请选择一个组合<br>推荐选择第${get.cnNumber(maxIndex + 1, true)}组(${get.translation(cards2[maxIndex])})`,
          [control2, "tdnodes"]
        ];
        for (let i = 0; i < cards2.length; i++) {
          dialogAuto.addArray([`第${get.cnNumber(i + 1, true)}组`, cards2[i]]);
        }
        const result = !event.isMine() ? { links: [maxIndex] } : await player.chooseButton().set("createDialog", dialogAuto).set("cards", cards2).forResult();
        if (!result || !result.links) return;
        player.gain(cards2[result.links[0]], "gain2", "log");
        return;
      }
      let dialog = ["【行路】:请选择牌名、花色和数字各一个"];
      dialog.addArray(["待选择的牌名", [storage.name.slice().map((i) => [get.type2(i), "", i]), "vcard"]]);
      dialog.addArray(["待选择的花色", [storage.suit.slice().map((i) => [i, get.translation(i)]), "tdnodes"]]);
      dialog.addArray([
        "待选择的数字",
        [
          storage.number.slice().sort((a, b) => a - b).map((i) => [i, i]),
          "tdnodes"
        ]
      ]);
      const { links } = await player.chooseButton().set("createDialog", dialog).set("filterButton", (button) => {
        let list = ui.selected.buttons;
        if (Array.isArray(button.link) && list.some((item) => Array.isArray(item.link))) return false;
        else if (typeof button.link === "number" && list.some((item) => typeof item.link === "number")) return false;
        else if (typeof button.link === "string" && list.some((item) => typeof item.link === "string")) return false;
        return true;
      }).set("selectButton", 3).forResult();
      if (!links) return;
      const info = {
        name: links.filter((i) => Array.isArray(i)).map((i) => i[2]),
        suit: links.filter((i) => typeof i === "string"),
        number: links.filter((i) => typeof i === "number")
      };
      let cards = lib.skill.xinglumrfz.findCards(info);
      if (cards.length > 0) player.gain(cards, "gain2", "log");
      else {
        player.popup("没有符合条件的组合");
      }
    },
    ai: {
      order: 1,
      result: {
        player: 1
      }
    }
  }
});
translate({
  "suocaomrfz": "莎草",
  "lanjuanmrfz": "览卷",
  "lanjuanmrfz_info": "锁定技，当你使用或打出一张牌后，你记录此牌的牌名、点数和花色（不可重复记录）；你的手牌上限和额定摸牌数+X。（X=【览卷】记录的数量的三次方根，X向下取整）",
  "xinglumrfz": "行路",
  "xinglumrfz_info": "出牌阶段限一次，你可以选择【览卷】中记录的牌名、点数和花色各一个，然后你获得牌堆中所有与你选择的牌名、点数和花色均一致的牌。"
});
characterTitle("suocaomrfz", "<font color=#DC143C>读万卷致千里</font>");
characterIntro("suocaomrfz", "莎草，本名阿娜特，曾任萨尔贡法尔贾万达巴德博物馆的代理馆长，怀揣着游历大地这一理想的她，在经历了博物馆的变故后踏上巡游大地的旅程。现以“莎草”为代号，作为外勤干员与罗德岛驻萨尔贡办事处展开合作，为罗德岛在当地的历史研究活动提供理论支持和指导。");
//# sourceMappingURL=index.js.map
