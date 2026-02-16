let plugins = [];
const defaults = {
  initializeByDefault: true
};
const PluginManager = {
  mount(plugin) {
    for (let option in defaults) {
      if (defaults.hasOwnProperty(option) && !(option in plugin)) {
        plugin[option] = defaults[option];
      }
    }
    plugins.forEach((p) => {
      if (p.pluginName === plugin.pluginName) {
        throw `Sortable: Cannot mount plugin ${plugin.pluginName} more than once`;
      }
    });
    plugins.push(plugin);
  },
  pluginEvent(eventName, sortable, evt) {
    this.eventCanceled = false;
    evt.cancel = () => {
      this.eventCanceled = true;
    };
    const eventNameGlobal = eventName + "Global";
    plugins.forEach((plugin) => {
      if (!sortable[plugin.pluginName]) return;
      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal]({ sortable, ...evt });
      }
      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName]({ sortable, ...evt });
      }
    });
  },
  initializePlugins(sortable, el, defaults2, options) {
    plugins.forEach((plugin) => {
      const pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      let initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized;
      Object.assign(defaults2, initialized.defaults);
    });
    for (let option in sortable.options) {
      if (!sortable.options.hasOwnProperty(option)) continue;
      let modified = this.modifyOption(sortable, option, sortable.options[option]);
      if (typeof modified !== "undefined") {
        sortable.options[option] = modified;
      }
    }
  },
  getEventProperties(name, sortable) {
    let eventProperties = {};
    plugins.forEach((plugin) => {
      if (typeof plugin.eventProperties !== "function") return;
      Object.assign(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption(sortable, name, value) {
    let modifiedValue;
    plugins.forEach((plugin) => {
      if (!sortable[plugin.pluginName]) return;
      if (plugin.optionListeners && typeof plugin.optionListeners[name] === "function") {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};
export {
  PluginManager as default
};
//# sourceMappingURL=PluginManager.js.map
