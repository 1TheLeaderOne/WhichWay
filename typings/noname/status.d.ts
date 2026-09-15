import { Card, Player } from "@/library/element";
import { status } from "noname";

declare module "noname" {
    interface status {
        /**
         * 牌堆顶的牌
         */
        pileTop:Card
    }
}