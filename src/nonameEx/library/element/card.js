import { lib, ui, game, _status, get } from "noname";
class CardExt extends lib.element.Card {
  removePromptSJZX(id) {
    let targets = this.querySelectorAll(".promptSJZX");
    if (!targets) return this;
    else if (typeof id !== "string") targets.forEach((i) => i.remove());
    else {
      for (let target of targets) {
        if (target.dataset.promptID === id) target.remove();
      }
    }
    return this;
  }
  addPromptSJZX(str, id) {
    let wrapper = this.querySelector(".promptSJZX-Wrapper") || ui.create.div(".promptSJZX-Wrapper", this);
    let prompts = Array.from(wrapper.querySelectorAll(".promptSJZX"));
    for (let prompt of prompts) {
      if (prompt.dataset.promptID === id) {
        prompt.innerHTML = str;
        return this;
      }
    }
    let info = ui.create.div(".promptSJZX", wrapper);
    info.classList.add("promptCardSJZX");
    info.innerHTML = str;
    info.dataset.promptID = id || str;
    return this;
  }
  isConnect() {
    game.broadcastAll(() => {
      _status.sxrmConnectCards ??= [];
    });
    return _status.sxrmConnectCards.includes(this);
  }
  addConnect() {
    if (this.isConnect()) return this;
    game.broadcastAll((connect) => {
      connect.addGaintag("visible_sxrm_connect_tag");
      _status.sxrmConnectCards.add(connect);
    }, this);
    const owner = get.owner(this);
    if (owner?.isIn()) {
      owner.markSkill("_sxrm_connect");
    }
    this.refreshMark();
    return this;
  }
  removeConnect() {
    _status.sxrmConnectCards ??= [];
    _status.sxrmConnectCards.remove(this);
    game.broadcast((connectCards) => {
      _status.sxrmConnectCards = connectCards;
    }, _status.sxrmConnectCards);
    game.broadcastAll((card) => {
      card.removeGaintag("visible_sxrm_connect_tag");
    }, this);
    this.refreshMark();
    return this;
  }
  refreshMark() {
    game.filterPlayer((current) => {
      if (current.getCards("h", (card) => card.isConnect()).length) {
        current.markSkill("_sxrm_connect");
      } else {
        current.unmarkSkill("_sxrm_connect");
      }
    });
  }
}
export {
  CardExt
};
//# sourceMappingURL=card.js.map
