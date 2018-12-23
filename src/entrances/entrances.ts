import { Entrance, THING_ENTRANCE_TYPE } from "./entrances.model";
import { ThingMap, Thing } from "../models/thing.model";
import bigInt from 'big-integer';

export function getEntrances(map: ThingMap): Entrance[] {
    const exits: ThingMap = mappedRegionEntrancesExits(map);
    const entrances: Entrance[] = [];
    Object.keys(exits).map(
        function (file) {
            const fileThings = exits[file];
            fileThings.map(function (thing) {
                if (thing.DefinitionType === THING_ENTRANCE_TYPE.ENTRANCE) {
                    handleEntrance(thing, entrances, file);
                } else if (thing.EntranceConnectedToUID) {
                    handleExit(thing, entrances, file);
                }
            });
        }
    )
    return entrances;
}
//mutates
function handleExit(thing: Thing, entrances: Entrance[], file: string): void {
    const assocEntrance: Entrance | undefined = entrances.find(e => e.entranceUID == getObjectIdFromConnectiveUID(thing.EntranceConnectedToUID));
    const newInfo: Entrance = {
        exitRegion: file,
        exitUID: thing.UID,
        exitTargetsConnectiveUID: thing.EntranceConnectedToUID,
        exitTargetsMaskedUID: maskUID(thing.EntranceConnectedToUID),
        exitTargetsMapID: getMapIdFromConnectiveUID(thing.EntranceConnectedToUID),
        exitTargetsProbableUID: getObjectIdFromConnectiveUID(thing.EntranceConnectedToUID)
    } as Entrance;
    if (assocEntrance) {
        Object.assign(assocEntrance, newInfo);
    } else {
        entrances.push(newInfo);
    }
}
//mutates 
function handleEntrance(thing: Thing, entrances: Entrance[], file: string): void {
        const assocEntrance: Entrance | undefined = entrances.find(e => e.exitTargetsProbableUID == thing.UID);
        const newInfo: Entrance = {
            enteringRegion: file,
            entranceUID: thing.UID,
            entranceMaskedUID: maskUID(thing.UID)
        } as Entrance;
        if (assocEntrance) {
            Object.assign(assocEntrance, newInfo);
        } else {
            entrances.push(newInfo);
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

function getMapIdFromConnectiveUID(uid: string | undefined) {
    if (!uid) return uid;
    return bigInt(uid).and(bigInt("FFFFFF0000000000", bigInt(16))).toString();
}

function getObjectIdFromConnectiveUID(uid: string | undefined) {
    if (!uid) return undefined;
    return bigInt(uid).and(bigInt("000000FFFFFFFFFF", 16)).or(bigInt("FFFFFE0000000000", 16)).toString();
}

function maskUID(uid: string | undefined) {
    if (!uid) return uid;
    return bigInt(uid).and(bigInt("000000FFFFFFFFFF", 16)).toString();
}