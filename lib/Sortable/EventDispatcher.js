import { IE11OrLess, Edge } from "./BrowserInfo.js";
import { expando } from "./utils.js";
import PluginManager from "./PluginManager.js";
function dispatchEvent({
  sortable,
  rootEl,
  name,
  targetEl,
  cloneEl,
  toEl,
  fromEl,
  oldIndex,
  newIndex,
  oldDraggableIndex,
  newDraggableIndex,
  originalEvent,
  putSortable,
  extraEventProperties
}) {
  sortable = sortable || rootEl && rootEl[expando];
  if (!sortable) return;
  let evt, options = sortable.options, onName = "on" + name.charAt(0).toUpperCase() + name.substr(1);
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent(name, true, true);
  }
  evt.to = toEl || rootEl;
  evt.from = fromEl || rootEl;
  evt.item = targetEl || rootEl;
  evt.clone = cloneEl;
  evt.oldIndex = oldIndex;
  evt.newIndex = newIndex;
  evt.oldDraggableIndex = oldDraggableIndex;
  evt.newDraggableIndex = newDraggableIndex;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable ? putSortable.lastPutMode : void 0;
  let allEventProperties = { ...extraEventProperties, ...PluginManager.getEventProperties(name, sortable) };
  for (let option in allEventProperties) {
    evt[option] = allEventProperties[option];
  }
  if (rootEl) {
    rootEl.dispatchEvent(evt);
  }
  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}
export {
  dispatchEvent as default
};
//# sourceMappingURL=EventDispatcher.js.map
