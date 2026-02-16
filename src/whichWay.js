class WhichWayManager {
    /**
     * 注册组件
     * @param {string} name - 组件名称
     * @param {any} component - 组件对象
     */
    register(name, component) {
        if(this[name]){
            console.warn(`组件${name}已存在，将覆盖原有组件`);
        }

        this[name] = component;
    }
}

//暴露到全局
window.whichWay = new WhichWayManager();

export {}