import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "../file.js";
import { onContent, onSetDev } from "../hooks/index.js";
import { pendingRun } from "./hooks.js";

declare type characterSort = [
    "epicSJZX",
    "legendSJZX",
    "especialSJZX",
    "plotSJZX",
    "specialSJZX",
    "rareSJZX",
    "mediocreSJZX",
    "normalSJZX"
];

class WhichWayPackManager {
    /**
     * 初始化
     */
    async init(){
        this.pendingRun = pendingRun;
        //读取character和card的内容
        await this.initCharacterPack();

        // const cardPack = await whichWayFile.getFileTree("src:packs/card");

        onContent({
            name:"whichWayPackManager_init",
            fn:async () => {
                for(const fn of this.pendingRun){
                    await fn();
                }
            }
        })
    }

    async initCharacterPack(){
        const { files , folders } = await whichWayFile.getFileTree("src:packs/character");
        for(const file of files){
            const name = whichWayFile.removeExt(file.name);
            if(!name.endsWith("mrfz")) continue;
            await import(`./character/${name}.js`);
        }

        for(const folder of folders){
            if(!folder.name.endsWith("mrfz")) continue;
            for(const file of folder.files){
                if(file.name === "index.js"){
                    await import(`./character/${folder.name}/index.js`);
                } else if(file.name === "index.ts"){
                    await import(`./character/${folder.name}/index.ts`);
                }
            }
        }
    }

    pendingRun:Function[] = [];
}

export const whichWayPackManager = new WhichWayPackManager();

whichWayPackManager.init();

window.whichWay.register("packManager", whichWayPackManager);

onSetDev({
    name: "whichWayPackManager_Dev",
    fn: () => {
        //@ts-ignore
        window.whichWayPackManager = whichWayPackManager;
    }
})