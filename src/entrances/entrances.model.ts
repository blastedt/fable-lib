export interface Entrance {
    exitRegion: string,
    exitUID: string,
    enteringRegion: string,
    entranceUID: string
}

export enum THING_ENTRANCE_TYPE {
    ENTRANCE = "REGION_ENTRANCE_POINT",
    EXIT = "REGION_EXIT_POINT"
}