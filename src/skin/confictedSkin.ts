import { whichWayUtil } from "../utill.js"

interface ConfictedSkin {
    has(name:string,skin:string,from:string):boolean
    /**
     * 添加冲突皮肤,不会重复添加
     */
    add(name:string,skin:string,from:string):void

    get(name:string):Array<{skin:string,from:string}> | undefined
    
    size:number

    /**
     * 冲突皮肤的数据
     */
    data:Record<string,Array<{skin:string,from:string}>>

    /**
     * 冲突皮肤的选择历史
     */
    selected:Record<string,string>
}

const ConfictedSkinPrototype = {
    has(this:ConfictedSkin,name:string,skin:string,from:string){
         //@ts-ignore
        if([name,skin,from].includes(undefined)) throw new Error("参数不能为undefined");
        if(!Array.isArray(this.data[name])) return false;
        return this.data[name].some(item=>item.from===from&&item.skin===skin)
    },

    add(this:ConfictedSkin,name:string,skin:string,from:string){
        //@ts-ignore
        if([name,skin,from].includes(undefined)) throw new Error("参数不能为undefined");
        if(!this.has(name,skin,from)){
            if(!Array.isArray(this.data[name])) this.data[name] = [];
            this.data[name].push({skin,from})
        }
    },

    get(this:ConfictedSkin,name:string){
        //@ts-ignore
        if(name===undefined) throw new Error("参数不能为undefined");
        return this.data[name]
    },

    get size(){
        return Object.keys(this.data).length
    },

    data : {},

    get selected(){
        return whichWayUtil.config("whichWay_ConfictedSkin_selectedSkins") || {}
    },

    set selected(value:Record<string,string>){
        whichWayUtil.saveConfig("whichWay_ConfictedSkin_selectedSkins",value);
    }
}

export const confictedSkin = Object.create(ConfictedSkinPrototype) as ConfictedSkin