import { Entrance, THING_ENTRANCE_TYPE } from "./entrances.model";
import { ThingMap, Thing } from "../tng/tng.model";

export function getEntrances(map: ThingMap): Entrance[] {
    const exits: ThingMap = mappedRegionEntrancesExits(map);
    const entrances: Entrance[] = [];
    Object.keys(exits).map(
        function (file) {
            const fileThings = exits[file];
            fileThings.map(function (thing) {
                if (thing.DefinitionType === THING_ENTRANCE_TYPE.ENTRANCE) {
                    handleEntrance(thing, entrances, file);
                } else if (thing.DefinitionType === THING_ENTRANCE_TYPE.EXIT) {
                    handleExit(thing, entrances, file);
                }
            });
        }
    )
    return entrances;
}
//mutates
function handleExit(thing: Thing, entrances: Entrance[], file: string): void {
    const assocEntrance: Entrance | undefined = entrances.find(e => e.entranceUID == thing.EntranceConnectedToUID);
    if (assocEntrance) {
        assocEntrance.exitRegion = file;
        assocEntrance.exitUID = thing.UID;
    } else {
        entrances.push({
            exitRegion: file,
            exitUID: thing.UID,
            entranceUID: thing.EntranceConnectedToUID
        } as Entrance);
    }
}
//mutates 
function handleEntrance(thing: Thing, entrances: Entrance[], file: string): void {
        const assocEntrance: Entrance | undefined = entrances.find(e => e.entranceUID == thing.UID);
        if (assocEntrance) {
            assocEntrance.enteringRegion = file;
        } else {
            entrances.push({
                enteringRegion: file,
                entranceUID: thing.UID
            } as Entrance);
        }

}

export function mappedRegionEntrancesExits(map: ThingMap) {
    const exits = {};
    for (const key in map) {
        if (Object.hasOwnProperty.call(map, key) && map[key]) {
            exits[key] = map[key].filter(
                tng => tng.DefinitionType && tng.DefinitionType.includes("REGION")
            );
        }
    }
    return exits;
}