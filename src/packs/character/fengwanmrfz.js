import { lib, get, game, ui } from "noname";
import { character, skill, translate, characterTitle } from "../hooks.js";
character("fengwanmrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "dongmrfz",
  hp: 3,
  skills: ["zhiyimrfz", "huayingmrfz"]
});
skill({
  "zhiyimrfz": {
    audio: ["作战中2", "作战中3", "作战中4"],
    trigger: {
      global: "roundStart"
    },
    forced: true,
    filter(event, player) {
      return player.countCards("h") > 0 && player.countEnabledSlot() > 0;
    },
    async content(event, trigger, player) {
      const { cards } = await player.chooseCard("h", true).set("prompt", `你展示一张手牌，然后令“纸偶”随机获得技能描述中包含此牌牌名的技能`).forResult();
      if (!cards) return;
      const card = cards[0];
      player.showCards(card);
      const manager = lib.skill.zhiyimrfz.cardManager;
      let skill2 = await manager.getSkill(card, player);
      if (skill2 === void 0) {
        player.chat(`没有技能描述中存在【${get.translation(get.name(card))}】！`);
        return;
      }
      let subtype = get.rand(1, 5);
      manager.addSlot(player, subtype);
      if (!lib.card[`zhiyimrfz_card_${skill2}`]) {
        game.broadcastAll(
          //@ts-ignore
          function(skill3, subtype2, manager2) {
            manager2.createCard(skill3, subtype2);
          },
          skill2,
          //@ts-ignore
          subtype,
          manager
        );
      }
      let equip = game.createCard(`zhiyimrfz_card_${skill2}`, "none", "none");
      player.$gain2(equip);
      game.delayx();
      player.equip(equip);
    },
    cardManager: {
      cache: {},
      addSlot(player, subtype) {
        if (typeof subtype === "number") subtype = `equip${subtype}`;
        game.broadcastAll(
          //@ts-ignore
          function(player2, subtype2) {
            if (typeof player2.expandedSlots[subtype2] !== "number") player2.expandedSlots[subtype2] = 0;
            player2.expandedSlots[subtype2]++;
          },
          player,
          subtype
        );
      },
      loseSlot(player, subtype) {
        if (typeof subtype === "number") subtype = `equip${subtype}`;
        game.broadcastAll(
          //@ts-ignore
          function(player2, subtype2) {
            if (typeof player2.expandedSlots[subtype2] !== "number" || player2.expandedSlots[subtype2] === 0) return;
            player2.expandedSlots[subtype2]--;
          },
          player,
          subtype
        );
      },
      updateCard(name, hp) {
        let info = lib.card[name];
        info.characterManager.maxHp = hp[1];
        info.characterManager.hp = hp[0];
      },
      createCard(skills, subtype, charName, hp) {
        skills = Array.isArray(skills) ? skills : [skills];
        let name = `zhiyimrfz_card_${skills.join("_")}`;
        if (!charName) charName = "fengwan_zhioumrfz";
        const character2 = get.character(charName);
        let characterName = charName !== "fengwan_zhioumrfz" ? charName : `${charName}_${skills.join("_")}`;
        if (!lib.character[characterName]) {
          lib.character[characterName] = {
            ...character2,
            maxHp: Array.isArray(hp) ? hp[1] : 2,
            hp: Array.isArray(hp) ? hp[0] : 1,
            skills: [...skills]
          };
          lib.translate[characterName] = `纸偶·${skills.map((i) => get.translation(i)).join("-")}`;
        }
        let card = {
          characterManager: {
            name: characterName,
            maxHp: Array.isArray(hp) ? hp[1] : 2,
            hp: Array.isArray(hp) ? hp[0] : 1,
            group: character2.group,
            skills: [...skills],
            isCharacter: !charName.startsWith("fengwan_zhioumrfz")
          },
          fullimage: true,
          image: "character:fengwan_zhioumrfz",
          type: "equip",
          subtype: `equip${subtype}`,
          enable: true,
          selectTarget: -1,
          filterTarget(card2, player, target) {
            if (player != target) {
              return false;
            }
            return target.canEquip(card2, true);
          },
          modTarget: true,
          allowMultiple: false,
          content: lib.element.content.equipCard,
          toself: true,
          ai: {
            // @ts-ignore
            equipValue(card2, player) {
              return player.hasSkill("zhiyimrfz") ? 1.2 : 1.6;
            }
          },
          skills: ["zhiyimrfz_destroy", ...skills]
        };
        if (card.subtype === "equip1") {
          card.distance = { attackFrom: -2 };
        } else if (card.subtype === "equip4") {
          card.distance = { globalFrom: -1 };
        } else if (card.subtype === "equip3") {
          card.distance = { globalTo: 1 };
        }
        let node = ui.create.buttonPresets.character(characterName, "character", null, false);
        node.style.width = "100%";
        let hpNode = node.querySelector(".hp .text");
        if (hpNode === null) return;
        hpNode.innerHTML = Array.isArray(hp) ? hp.join("/") : "1/2";
        lib.translate[`${name}_info`] = `锁定技，你视为拥有技能${skills.map((s) => "〖" + get.translation(s) + "〗").join("、")}，此牌不因【化影】而离开你的装备区后，销毁之。<br>` + node.outerHTML + "<br>";
        let append = "";
        for (var skill2 of skills) {
          if (lib.skill[skill2].nobracket) {
            append += '<div class="skilln">' + get.translation(skill2) + '</div><div><span style="font-family: yuanli">' + get.plainText(get.skillInfoTranslation(skill2)) + "</span></div><br><br>";
          } else {
            var translation = lib.translate[skill2 + "_ab"] || get.translation(skill2).slice(0, 2);
            append += '<div class="skill">【' + translation + '】</div><div><span style="font-family: yuanli">' + get.plainText(get.skillInfoTranslation(skill2)) + "</span></div><br><br>";
          }
        }
        lib.translate[`${name}_append`] = append;
        lib.card[name] = card;
        lib.translate[name] = card.characterManager.isCharacter ? get.translation(card.characterManager.name) : `纸偶·${skills.map((i) => get.translation(i)).join("-")}`;
      },
      async change(player, card) {
        let characterManager = { ...get.info(card).characterManager };
        const expandedSlots = { ...player.expandedSlots };
        await player.reinitCharacter(player.name, characterManager.name);
        player.expandedSlots = expandedSlots;
        player.hp = characterManager.hp;
        player.maxHp = characterManager.maxHp;
        player.update();
        player.zhiyimrfz_linkCard = get.name(card);
        this.loseSlot(player, get.subtype(card));
        if (player.hp <= 0) {
          player.dying();
        }
      },
      async getSkill(card, player) {
        const cache = this.cache;
        let name = get.name(card);
        if (!name) return;
        if (cache[name]) {
          return cache[name].filter((i) => !player.getSkills().includes(i) && !lib.skill[i].charlotte).randomGet();
        }
        let list = [];
        for (let skill2 in lib.skill) {
          let info = lib.skill[skill2];
          if (info.charlotte || info.equipSkill || info.zhuSkill) continue;
          let intro = get.skillInfoTranslation(skill2);
          if (intro && intro.includes(`【${get.translation(name)}】`)) list.add(skill2);
        }
        game.broadcastAll(
          //@ts-ignore
          function(list2, name2) {
            lib.skill.zhiyimrfz.cardManager.cache[name2] = list2;
          },
          list,
          //@ts-ignore
          name
        );
        return await this.getSkill(card, player);
      }
    },
    subSkill: {
      destroy: {
        trigger: {
          player: "loseBegin"
        },
        equipSkill: true,
        forceDie: true,
        charlotte: true,
        forced: true,
        popup: false,
        // @ts-ignore
        filter(event, player) {
          return event.cards.some((card) => card.name.indexOf("zhiyimrfz_card_") === 0);
        },
        // @ts-ignore
        async content(event, trigger, player) {
          const manager = lib.skill.zhiyimrfz.cardManager;
          for (let card of trigger.cards) {
            if (card.name.indexOf("zhiyimrfz_card_") === 0) {
              if (Object.keys(trigger.getParent("huayingmrfz") || {}).length > 0) {
                card._destroy = true;
                trigger.zhiyimrfz_trigger = true;
                player.addTempSkill("zhiyimrfz_destroy2");
              }
              let subtype = get.subtype(card);
              manager.loseSlot(player, subtype);
            }
          }
        }
      },
      destroy2: {
        trigger: {
          player: "loseAfter"
        },
        equipSkill: true,
        forceDie: true,
        charlotte: true,
        forced: true,
        popup: false,
        filter(event, player) {
          return event.cards.some((card) => card.name.indexOf("zhiyimrfz_card_") === 0) && event.zhiyimrfz_trigger === true;
        },
        async content(event, trigger, player) {
          const manager = lib.skill.zhiyimrfz.cardManager;
          for (let card of trigger.cards) {
            if (card.name.indexOf("zhiyimrfz_card_") !== 0) continue;
            let info = get.info(card);
            let name = player.zhiyimrfz_linkCard;
            if (info.characterManager?.isCharacter) {
              if (name) {
                if (!lib.card[name]) {
                  game.broadcastAll(
                    //@ts-ignore
                    function(skill2, subtype, manager2) {
                      manager2.createCard(skill2, subtype);
                    },
                    //@ts-ignore
                    player.getOriginalSkills(),
                    get.rand(1, 5),
                    manager
                  );
                }
                let cardx = game.createCard(name, "none", "none");
                manager.addSlot(player, get.subtype(cardx));
                player.equip(cardx);
              }
              await manager.change(player, card);
            }
          }
        }
      }
    }
  },
  "huayingmrfz": {
    audio: ["选中干员2", "部署2"],
    trigger: {
      player: "dying"
    },
    // @ts-ignore
    filter(event, player) {
      return player.countCards("e", (card) => card.name.indexOf("zhiyimrfz_card_") === 0) > 0;
    },
    // @ts-ignore
    async cost(event, trigger, player) {
      event.result = await player.chooseCard("e").set("prompt", get.prompt("huayingmrfz")).set("prompt2", `你可以切换一个“纸偶”和你当前的武将牌`).set("filterCard", (card) => card.name.indexOf("zhiyimrfz_card_") === 0).set("ai", (card) => get.value(card) < 4).forResult();
    },
    // @ts-ignore
    async content(event, trigger, player) {
      let manager = lib.skill.zhiyimrfz.cardManager;
      let equip = event.cards[0];
      let subtype = get.rand(1, 5);
      let skills = player.getOriginalSkills();
      if (!lib.card[`zhiyimrfz_card_${skills.join("_")}`]) {
        game.broadcastAll(
          //@ts-ignore
          function(skill2, subtype2, manager2, name, hp) {
            manager2.createCard(skill2, subtype2, name, hp);
          },
          //@ts-ignore
          skills,
          subtype,
          manager,
          get.name(player),
          [player.hp, player.maxHp]
        );
      }
      let card = game.createCard(`zhiyimrfz_card_${skills.join("_")}`, "none", "none");
      let info = get.info(card);
      game.broadcastAll(
        //@ts-ignore
        function(manager2, name, hp) {
          manager2.updateCard(name, hp);
        },
        manager,
        //@ts-ignore
        get.name(card),
        [player.hp, player.maxHp]
      );
      equip._destroy = true;
      player.loseToDiscardpile(equip).log = false;
      await manager.change(player, equip);
      manager.addSlot(player, subtype);
      if (info?.characterManager) {
        let characterManager = info.characterManager;
        if (!characterManager.isCharacter && (characterManager.hp === 0 || characterManager.maxHp === 0)) {
          game.log(`#y${get.translation(info.characterManager.name)}`, "被销毁了");
          return;
        }
      }
      player.equip(card);
    }
  }
});
translate({
  "fengwanmrfz": "风丸",
  "zhiyimrfz": "纸艺",
  "zhiyimrfz_info": "锁定技，每轮开始时，你按照如下规则创建一个“纸偶”并将其置入你的装备区：<br>1.你展示一张手牌，然后令“纸偶”随机获得技能描述中包含此牌牌名的技能;<br>2.“纸偶”不占用装备栏;<br>3.“纸偶”的攻击范围/攻击距离/防御距离（如果有）为3/1/1;<br>4.“纸偶”的初始体力值为1，体力上限为2。<br>5.当“纸偶”体力值或体力上限为0时，或不因【化影】而离开你的装备区时，销毁之。",
  "huayingmrfz": "化影",
  "huayingmrfz_info": "当你进入濒死状态时，你可以切换一个“纸偶”和你当前的武将牌。"
});
characterTitle("fengwanmrfz", "<font color = #8b008b>折纸生花</font>");
