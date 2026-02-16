import { Card, Player } from "@/library/element";
import { status } from "./../../../../noname/status/index.js";

declare module "./../../../../noname/status/index.js" {
    interface status {

        /**
         * 当前回合角色
         */
        currentPhase?:Player | undefined

        /**
         * 牌堆顶的牌
         */
        pileTop:Card
    }
}