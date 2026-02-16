import { lib } from "noname";
class GameEventExt extends lib.element.GameEvent {
  getChildren(filter, step = 20) {
    let event = this;
    if (step <= 0) return {};
    let actualFilter = filter;
    if (filter === void 0) {
      console.warn("getChildren: filter is not a function or string !");
      return {};
    } else if (typeof filter === "string") {
      const targetName = filter;
      actualFilter = (e) => e.name === targetName;
    }
    if (actualFilter(event)) {
      return event;
    }
    for (const child of this.childEvents || []) {
      const result = child.getChildren(filter, step - 1);
      if (result && Object.keys(result).length > 0) {
        return result;
      }
    }
    return {};
  }
}
export {
  GameEventExt
};
//# sourceMappingURL=gameEvent.js.map
