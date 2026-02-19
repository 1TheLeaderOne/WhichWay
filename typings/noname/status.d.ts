import { Card, Player } from "@/library/element";
import { status } from "noname";

declare module "noname" {
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