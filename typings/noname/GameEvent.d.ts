import { GameEvent } from "@/library/element";

declare module "@/library/element" {
	interface GameEvent {
        gaintag_map?: Record<string, Array<string>>;
        effectCount?:number;
    }
}