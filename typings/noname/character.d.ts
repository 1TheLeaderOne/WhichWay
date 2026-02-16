import { Character } from "@/library/element";

declare module "@/library/element" {
	interface Character {
		whichWay?: WhichWayCharConfig;
	}
}
