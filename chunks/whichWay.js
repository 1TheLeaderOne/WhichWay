class s {
  /**
   * 注册组件
   * @param {string} name - 组件名称
   * @param {any} component - 组件对象
   */
  register(i, h) {
    this[i] && console.warn(`组件${i}已存在，将覆盖原有组件`), this[i] = h;
  }
}
window.whichWay = new s();
