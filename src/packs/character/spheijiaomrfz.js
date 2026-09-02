import { get, lib, _status, game } from "noname";
import { whichWayToast } from "../../toast/index.js";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("spheijiaomrfz", {
  pack: "epicSJZX",
  sex: "male",
  group: "luomrfz",
  hp: 3,
  skills: ["lianqimrfz", "juhemrfz", "denglongmrfz"]
});
skill({
  "lianqimrfz": {
    audio: 2,
    trigger: { player: "useCard2" },
    filter(event, player) {
      return event.card && get.tag(event.card, "damage") && player.countMark("lianqimrfz") < 3;
    },
    forced: true,
    marktext: "刃",
    mark: true,
    intro: {
      name: "气刃",
      content(storage) {
        switch (storage) {
          case 1:
            return "黑龙歼灭刀已解放不屈白刃！";
          case 2:
            return "黑龙歼灭刀已解放华贵黄刃！";
          case 3:
            return "黑龙歼灭刀已解放至尊红刃！";
          default:
            return "孩子别怕，我带着黑龙歼灭刀来救你了！";
        }
      }
    },
    // @ts-ignore
    async content(event, trigger, player) {
      player.addMark("lianqimrfz", 1);
    },
    group: "lianqimrfz_damage",
    subSkill: {
      damage: {
        audio: "lianqimrfz",
        trigger: { source: "damageBegin" },
        forced: true,
        filter(event, player) {
          return event.card !== void 0;
        },
        // @ts-ignore
        async content(event, trigger, player) {
          let evt = trigger.getParent(2);
          let num = player.countMark("lianqimrfz");
          if (typeof evt.baseDamage === "number") num += evt.baseDamage - 1;
          trigger.num = num;
        }
      }
    },
    ai: {
      combo: "denglongmrfz",
      threaten: 1.8
    }
  },
  "denglongmrfz": {
    audio: 2,
    trigger: {
      player: "useCardToPlayered"
    },
    // @ts-ignore
    filter(event, player) {
      return event.card.name === "sha" && event.targets && event.targets.length === 1;
    },
    usable: 1,
    check(event, player) {
      return get.effect(event.targets[0], event.card, player, player) > 0;
    },
    // @ts-ignore
    async content(event, trigger, player) {
      player.when("useCardAfter").filter((event2, player2) => {
        return event2.card === trigger.card;
      }).then(() => {
        player.removeMark("lianqimrfz", 1);
      });
      let data = lib.config.sjzxDenglongData || {
        total: 0,
        success: 0
      };
      let probability = data.success / data.total || 0;
      if (_status.auto || !player.isUnderControl(true)) {
        probability = Math.max(0.6, probability);
        if (Math.random() < probability) {
          trigger.getParent().effectCount++;
          player.say("黑龙歼灭刀大人登龙成功！其他武器原地纳刀敬礼！");
        } else {
          player.say("力竭倒下");
        }
        return;
      }
      let target = trigger.targets[0];
      let targetCopy = target.cloneNode(true);
      let playerCopy = player.cloneNode(true);
      targetCopy.trueElement = target;
      playerCopy.trueElement = player;
      playerCopy.style.position = "absolute";
      playerCopy.style.left = "50%";
      playerCopy.style.zIndex = 114514;
      playerCopy.style.transform = "scale(0.2)";
      targetCopy.style.zIndex = 114514;
      targetCopy.style.position = "absolute";
      targetCopy.style.transform = "scale(0.5)";
      document.body.appendChild(targetCopy);
      document.body.appendChild(playerCopy);
      target.hide();
      player.hide();
      game.pause();
      const enemy = {
        element: targetCopy,
        x: target.getBoundingClientRect().x,
        y: target.getBoundingClientRect().y,
        dx: 0,
        dy: 0,
        width: 0,
        height: 0,
        bodyRect: null,
        init() {
          const rect = this.element.getBoundingClientRect();
          const bodyRect = document.body.getBoundingClientRect();
          this.x = rect.left;
          this.y = rect.top;
          this.width = rect.width;
          this.height = rect.height;
          this.bodyRect = bodyRect;
          this.dx = (Math.random() * 3 + 0.5) * (Math.random() > 0.5 ? 1 : -1);
          this.dy = (Math.random() * 3 + 0.5) * (Math.random() > 0.5 ? 1 : -1);
        },
        update() {
          this.x += this.dx;
          this.y += this.dy;
          if (this.x <= 0 || this.x + this.width >= this.bodyRect.width) {
            this.dx *= -1;
            this.x = Math.max(0, Math.min(this.x, this.bodyRect.width - this.width));
          }
          if (this.y <= 0) {
            this.dy *= -1;
            this.y = 0;
          }
          const bottomMargin = 1.2 * (this.bodyRect.height - playerCopy.getBoundingClientRect().y);
          if (this.y + this.height >= this.bodyRect.height - bottomMargin) {
            this.dy *= -1;
            this.y = this.bodyRect.height - this.height - bottomMargin;
          }
          this.element.style.left = `${this.x}px`;
          this.element.style.top = `${this.y}px`;
        }
      };
      const taidaoxia = {
        element: playerCopy,
        x: 0,
        y: 0,
        targetX: null,
        targetY: null,
        moving: false,
        duration: 500,
        startTimestamp: null,
        listen: [],
        clickCount: 0,
        hasMoved: false,
        //@ts-ignore
        init(playerElement = this.element) {
          this.element = playerElement;
          this.x = this.element.offsetLeft;
          this.y = this.element.offsetTop;
          function listen(e) {
            const targetX = e.clientX - taidaoxia.element.offsetWidth / 2;
            const targetY = e.clientY - taidaoxia.element.offsetHeight / 2;
            taidaoxia.setTarget(targetX, targetY);
          }
          this.listen.push(listen);
          setTimeout(function() {
            document.addEventListener("click", listen);
          }, 1e3);
        },
        setTarget(x, y) {
          this.targetX = x;
          this.targetY = y;
          this.moving = true;
          this.startTimestamp = null;
        },
        update() {
          if (!this.moving || this.targetX === null || this.targetY === null) {
            return;
          }
          const now = performance.now();
          if (!this.startTimestamp) {
            this.startTimestamp = now;
          }
          const elapsed = now - this.startTimestamp;
          const progress = Math.min(elapsed / this.duration, 1);
          const prevX = this.x;
          const prevY = this.y;
          this.x += (this.targetX - this.x) * progress;
          this.y += (this.targetY - this.y) * progress;
          this.element.style.left = `${Math.round(this.x)}px`;
          this.element.style.top = `${Math.round(this.y)}px`;
          if (Math.abs(this.x - prevX) > 1 || Math.abs(this.y - prevY) > 1) {
            this.hasMoved = true;
          }
          if (progress >= 1) {
            this.moving = false;
            this.startTimestamp = null;
            if (this.hasMoved) {
              this.clickCount++;
              this.hasMoved = false;
            }
          }
        }
      };
      taidaoxia.init();
      enemy.init();
      mainLoop();
      function recover() {
        data.total++;
        target.show();
        player.show();
        targetCopy.delete();
        playerCopy.delete();
        taidaoxia.listen.forEach((listen) => {
          document.removeEventListener("click", listen);
        });
        game.resume();
      }
      function success() {
        recover();
        data.success++;
        trigger.getParent().effectCount++;
        player.say("黑龙歼灭刀大人登龙成功！其他武器原地纳刀敬礼！");
      }
      function detectCollisions() {
        const playerEl = taidaoxia.element;
        const enemyEl = enemy.element;
        return isColliding(playerEl, enemyEl);
      }
      function mainLoop() {
        taidaoxia.update();
        enemy.update();
        const collided = detectCollisions();
        if (collided) {
          success();
          game.saveConfig("sjzxDenglongData", data);
          return;
        }
        if (taidaoxia.clickCount >= 1) {
          recover();
          game.saveConfig("sjzxDenglongData", data);
          player.say("力竭倒下");
          whichWayToast.showToast("🦐太刀侠", 2e3);
          if (probability !== 0 && probability <= 0.5) {
            target.chat("玩太刀玩的");
          }
          return;
        }
        requestAnimationFrame(mainLoop);
      }
      function isColliding(elementA, elementB) {
        const rectA = elementA.getBoundingClientRect();
        const rectB = elementB.getBoundingClientRect();
        return !(rectA.top > rectB.bottom || rectA.bottom < rectB.top || rectA.right < rectB.left || rectA.left > rectB.right);
      }
    }
  },
  "juhemrfz": {
    audio: 2,
    trigger: {
      target: "shaMiss",
      global: "eventNeutralized"
    },
    filter(event, player, name) {
      if (event.type !== "card" || event.player === player) return false;
      if (name !== "shaMiss" && event._neutralize_event.player !== player) return false;
      return event.player;
    },
    // @ts-ignore
    prompt(event, player) {
      return `是否视为对${get.translation(event.player)}使用一张【杀】？`;
    },
    check(event, player) {
      return get.effect(event.player, { name: "sha", isCard: true }, player, player) > 0;
    },
    // @ts-ignore
    async content(event, trigger, player) {
      player.useCard({ name: "sha", isCard: true }, trigger.player).set("addCount", false);
    },
    ai: {
      threaten: 0.8
    }
  }
});
translate({
  "spheijiaomrfz": "太刀侠火龙S黑角",
  "spheijiaomrfz_prefix": "太刀侠",
  "lianqimrfz": "练气",
  "lianqimrfz_info": "锁定技，你使用的牌的伤害基数为“气刃”标记数;当你使用伤害类牌选择目标后，你获得一个“气刃”标记（至多为3）。",
  "denglongmrfz": "登龙",
  "denglongmrfz_info": "每回合限一次，当你使用【杀】指定唯一目标后，你可以将武将牌朝随机移动的目标角色发射，若你命中了其武将牌，你令此杀额外结算一次，然后无论你是否命中，你失去一层“气刃”标记。",
  "juhemrfz": "居合",
  "juhemrfz_info": "当其他角色使用的牌被你抵消后，你获得一个“气刃”标记，然后你可以视为对被抵消牌的角色使用一张【杀】。"
});
characterTitle("spheijiaomrfz", "<font color = #a52a2a>太刀天尊</font>");
characterIntro("spheijiaomrfz", "从东国完成任务归来的黑角，换上了由艾露猫打造的全新装备。尽管放下盾牌，挥舞起威风凛凛的太刀，黑角仍是那个最值得大家信赖的依靠，冲在最前线为队友扫清障碍。");
