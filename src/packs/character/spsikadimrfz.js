import { get, game, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("spsikadimrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "haimrfz",
  hp: 4,
  skills: ["newqianximrfz", "haixuanmrfz"]
});
skill({
  "newqianximrfz": {
    audio: "qianximrfz",
    trigger: {
      global: "phaseOver"
    },
    forced: true,
    getNextByAll(player) {
      let chars = game.players.slice().concat(game.dead).sort(lib.sort.position);
      let index = chars.indexOf(player);
      return chars[index + 1 > chars.length ? 0 : index + 1];
    },
    filter(event, player) {
      let evt = event.getChildren("phase");
      if (!evt.player) return false;
      let target = this.getNextByAll(evt.player);
      return target && !target.isAlive();
    },
    async content(event, trigger, player) {
      let evt = trigger.getChildren("phase");
      let target = lib.skill.newqianximrfz.getNextByAll(evt.player);
      game.broadcastAll(
        //@ts-ignore
        function(char1, char2) {
          game.swapSeat(char1, char2);
        },
        //@ts-ignore
        player,
        target
      );
      trigger.player = target;
    }
  },
  "haixuanmrfz": {
    audio: ["作战中2", "作战中4"],
    trigger: {
      global: "phaseZhunbeiBegin"
    },
    derivation: ["duwu"],
    filter(event, player) {
      return event.player !== player && event.player.countCards("he") > 0;
    },
    prompt(event, player) {
      return `【海漩】:是否令${get.translation(event.player)}对你发动一次【黩武】？`;
    },
    check(event, player) {
      return get.attitude2(event.player) < 0 && player.hp > 2 && event.player.countCards("he") > 1;
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      const { cards } = await target.chooseToDiscard("he", true).set("prompt", `弃置${player.hp}张牌`).set("prompt2", get.skillInfoTranslation("duwu")).set("selectCard", Math.min(player.hp, target.countCards("he"))).set("ai", (card) => -get.value(card)).forResult();
      if (!cards) return;
      const next = game.createEvent("haixuanmrfz_duwu");
      next.target = player;
      next.player = target;
      next.setContent(lib.skill.duwu.content);
      await next;
      let cardsx = cards.filter((card) => !get.tag(card, "damage") && get.position(card) === "d");
      if (cardsx.length) {
        player.gain(cardsx, "gain2");
        if (new Set(cardsx.map((card) => get.suit(card))).size === cardsx.length) player.recover();
      }
    }
  }
});
translate({
  "spsikadimrfz": "浊心斯卡蒂",
  "spsikadimrfz_prefix": "浊心",
  "newqianximrfz": "迁徙",
  "newqianximrfz_info": "锁定技，任意角色回合结束后，若其下个座位号的角色已死亡，你与其下个座位号的角色交换座次。",
  "haixuanmrfz": "海漩",
  "haixuanmrfz_info": "其他角色的准备阶段，你可以令其对你发动一次【黩武】(若其手牌不足则全弃)，然后你获得其因此弃置的非伤害类牌，若你没有因此获得相同花色的牌，你回复一点体力值。"
});
characterTitle("spsikadimrfz", "<font color='#6495ed'>大群</font>");
characterIntro("spsikadimrfz", "照这个方向发展下去，就不会有人关心她究竟是什么了。不是斯卡蒂的问题，一个人也不能改变什么。我说的是，这种生理状态，以及该类生物性物质表现出的最终状态，可能会摧毁我们社会、历史与科学的所有度量衡。希望我们简陋的医疗科研条件现在还够使上点劲......");
//# sourceMappingURL=spsikadimrfz.js.map
