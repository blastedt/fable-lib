import { UID } from "../UID.model";

export interface Thing {
    Player?: number;
    UID?: UID;
    DefinitionType?: InterestingDefinitionTypes | string; //todo enum?
    TeleportToRegionEntrance?: boolean;
    EntranceConnectedToUID?: UID;
    [key: string]: any; //wow the type system hates me
}

export enum InterestingDefinitionTypes {
    REGION_ENTRANCE = "REGION_ENTRANCE_POINT",
}

export enum TNG_FILE_TOKENS {
    NEWTHING = "NewThing",
    ENDTHING = "EndThing"
}

export interface ThingMap {
    [filename: string]: Thing[]
}