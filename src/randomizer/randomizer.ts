import * as fs from 'fs';
import glob from 'glob';
import * as path from 'path';
import { CTCDRegionExit } from "../things/CTC/CTCDRegionExit";
import { ThingFile } from "../things/ThingFile";
import { UID, UIDType } from "../things/UID";

export interface ThingPathMap {
    [filename: string]: ThingFile
}

export function fetchAllCUIDs(files: ThingPathMap): UID[] {
    const CUIDs: UID[] = [];
    for (const file in files) {
        console.log(`Searching ${path.basename(file)} for exits`);
        for (const section of files[file].sections) {
            section.things.forEach(function (thing) {
                const exit: UID | null = thing.getExit();
                if (exit) {
                    CUIDs.push(exit);
                }
            });
        }
    }
    return CUIDs;
}

export async function fetchAllThings(directory: string): Promise<ThingPathMap> {
    directory = path.resolve(directory);
    const filenames: string[] = await new Promise<string[]>(function (resolve, reject) {
        glob(directory + '/**/*.tng', function (e, filenames: string[]) {
            if (e) return reject(e);
            resolve(filenames);
        });
    });
    const promiseMap = {};
    for (const file of filenames) {
        promiseMap[file] = ThingFile.deserialize(file);
    }
    const res: ThingPathMap = {};
    for (const file of filenames) {
        res[file] = await promiseMap[file];
    }
    return res;
}

function writePromise(file: string, contents: string) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(file, contents, function (e) {
            if (e) return reject(e);
            resolve();
        });
    });
}

export function serializeAllThings(files: ThingPathMap) {
    const promises: Promise<any>[] = [];
    for (const file in files) {
        promises.push(writePromise(file, files[file].serialize()));
    }
    return Promise.all(promises);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function randomizeConnectiveUIDs(files: ThingPathMap, cuids: UID[]) {
    shuffle(cuids);
    for (const file in files) {
        console.log(`Assigning ${path.basename(file)} new exits`);
        for (const section of files[file].sections) {
            section.things.forEach(function (thing) {
                if (thing.getExit()) {
                    const newExit = cuids.pop()!;
                    console.log("Setting to CUID " + newExit.connectiveUID);
                    thing.setExit(newExit);
                }
            });
        }
    }
}