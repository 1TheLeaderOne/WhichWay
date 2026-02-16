class HTMLDivElementExt extends HTMLDivElement {
  /**
   * 当HTMLDivElement被移除时触发的回调方法
   * @param {Function} callback - 元素被移除时执行的回调函数
   * @returns {Function} 返回一个可以手动取消监听的方法
   */
  //@ts-ignore
  onRemoved(callback) {
    if (typeof callback !== "function") {
      throw new TypeError("Callback must be a function");
    }
    const element = this;
    let observer;
    const checkAndTrigger = () => {
      if (!document.body.contains(element)) {
        observer.disconnect();
        setTimeout(() => {
          callback();
        }, 10);
      }
    };
    observer = new MutationObserver((mutations) => {
      checkAndTrigger();
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    if (!document.body.contains(element)) {
      observer.disconnect();
      setTimeout(() => {
        callback();
      }, 10);
      return () => {
      };
    }
    return () => {
      observer?.disconnect();
    };
  }
}
export {
  HTMLDivElementExt
};
//# sourceMappingURL=HTMLDivElementExt.js.map
