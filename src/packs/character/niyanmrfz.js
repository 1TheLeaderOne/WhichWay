import { lib, get, _status, game } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("niyanmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "luomrfz",
  hp: 4,
  skills: ["sutumrfz", "wotumrfz"]
});
skill({
  "wotumrfz": {
    audio: 2,
    trigger: { player: "useCard2" },
    filter: function(event, player) {
      if (!event.cards) return false;
      return event.cards.length == 0 && !player.hasSkill("wotumrfz_ban");
    },
    frequent: true,
    async content(event, trigger, player) {
      player.changeHujia();
      player.addTempSkill("wotumrfz_ban", {
        global: "roundStart"
      });
    },
    subSkill: {
      ban: {
        charlotte: true
      }
    }
  },
  "sutumrfz": {
    audio: 2,
    trigger: {
      player: "useCardAfter"
    },
    filter: function(event, player) {
      if (!event.card.isCard) return false;
      if (player.countCards("h") !== player.hp) return false;
      return event.cards && event.cards.length == 1;
    },
    async content(event, trigger, player) {
      var list = [];
      for (var i = 0; i < lib.inpile.length; i++) {
        var name = lib.inpile[i];
        if (name == "sha") {
          list.push(["基本", "", "sha"]);
          for (var j of lib.inpile_nature) list.push(["基本", "", "sha", j]);
        } else if (get.type(name) == "basic") list.push(["基本", "", name]);
        else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
      }
      const result = await player.chooseButton(["塑土", [list, "vcard"]], true).set("ai", function(button) {
        var player2 = _status.event.getParent().player, card = {
          name: button.link[2],
          nature: button.link[3]
        };
        if (game.hasPlayer(function(current) {
          return current != player2 && get.attitude(player2, current) < 0 && current.countCards("he") > 0 && get.distance(player2, current) < 2;
        }))
          return "shunshou";
        if (game.hasPlayer(function(current) {
          return current != player2 && get.attitude(player2, current) < 0 && current.countCards("he") == 0 && player2.inRange(current);
        }))
          return "sha";
        return player2.getUseValue(card, null, true) * _status.event.att;
      }).set("att", get.attitude(event.target, player) > 0 ? 1 : -1).forResult();
      if (result.links) {
        var name = result.links[0][2];
        player.chooseUseTarget({ name, isCard: true }, true);
      }
    }
  }
});
translate({
  "niyanmrfz": "泥岩",
  "wotumrfz": "沃土",
  "wotumrfz_info": "每轮限一次，当你使用虚拟牌后，你可以获得一点护甲。",
  "sutumrfz": "塑土",
  "sutumrfz_info": "当你使用非转化且非虚拟的牌后，若你的手牌数等于你的当前体力值，你可以视为使用一张基本牌或非延时锦囊牌。"
});
characterIntro("niyanmrfz", "萨卡兹雇佣兵泥岩，随军加入整合运动后，由于意见不合而带领小队成员远离了乌萨斯。完全没有参与整合运动在切尔诺伯格及龙门的行动。为了寻找落脚点，泥岩带队前往莱塔尼亚，在当地吸纳了大量莱塔尼亚的感染者后，泥岩被众人推崇为领袖，开始以“泥岩小队”的名号被人所知。尽管泥岩多次试图避免与其他势力发生冲突，但她们依旧一次又一次地被卷入纷争，为了避免更多无意义的牺牲，泥岩选择逃往卡兹戴尔。在卡兹戴尔境内与精英干员Logos接触，随后者前往罗德岛。");
//# sourceMappingURL=niyanmrfz.js.map
