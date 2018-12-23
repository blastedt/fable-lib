import { UID } from "./UID.model";

export interface PartiallyParsedThing {
    unparsedEntries?: string[];
}

export interface Thing extends PartiallyParsedThing {
    TYPE: string; // don't serialize me plz
    Player: number;
    UID: UID;
    DefinitionType: DefinitionType | string; //todo enum?
    CTCDRegionExit?: CTCDRegionExit
}

export interface CTCDRegionExit extends PartiallyParsedThing {
    EntranceConnectedToUID: UID;
}

export enum DefinitionType {
    ENTRANCE = "REGION_ENTRANCE_POINT",
    EXIT = "REGION_EXIT_POINT"
}

export enum CTC_TOKENS {
    EXIT = "CTCDRegionExit"
}

export enum TNG_FILE_TOKENS {
    NEWTHING = "NewThing",
    ENDTHING = "EndThing",
    NEWSECTION = "XXXSectionStart",
    ENDSECTION = "XXXSectionEnd",
    STARTCTC = "Start",
    ENDCTC = "End",
}

export interface ThingDirectory {
    [filename: string]: ThingFile
}

export interface ThingFile {
    [section: string]: Thing[]
}