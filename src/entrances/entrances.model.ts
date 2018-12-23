export interface Entrance {
    exitRegion: string,
    exitUID: string,
    exitTargetsMaskedUID: string,
    exitTargetsConnectiveUID: string,
    exitTargetsProbableUID: string,
    exitTargetsMapID: string,
    enteringRegion: string,
    entranceUID: string,
    entranceMaskedUID: string
}

export enum THING_ENTRANCE_TYPE {
    ENTRANCE = "REGION_ENTRANCE_POINT",
    EXIT = "REGION_EXIT_POINT"
}

export const EXIT_TARGET = "EntranceConnectedToUID";