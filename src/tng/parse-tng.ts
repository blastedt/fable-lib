import glob from 'glob';
import * as fs from 'fs';
import {
    Thing,
    TNG_FILE_TOKENS,
    ThingMap
} from './tng.model';
import * as path from 'path';



export function parseTngContents(contents: Buffer): Thing[] {
    const lines = contents.toString().split(/\r?\n/g);
    let things: Thing[] = [];
    for (const line of lines) {
        if (line.indexOf(TNG_FILE_TOKENS.NEWTHING) > -1) {
            things.unshift({});
        } else if (things.length > 0 && line.indexOf(TNG_FILE_TOKENS.ENDTHING) === -1) {
            const [key, value] = line.replace(/[;"]/g, '').split(' ');
            things[0][key] = value;
        }
    }
    return things;
}

export async function parseTngFile(filename: string): Promise<Thing[]> {
    const data: Buffer = await new Promise(function (res: Function, rej: Function) {
        fs.readFile(filename, function (err: any, data: Buffer) {
            if (err) {
                return rej(err);
            }
            return res(data);
        });
    });
    return parseTngContents(data);
}

export async function parseAllTngs(directory: string): Promise<ThingMap> {
    let filenames: string[];
    try {
        filenames = await new Promise(function (resolve, reject) {
            glob(directory + '/**/*.tng', function (e, filenames: string[]) {
                if (e) return reject(e);
                resolve(filenames);
            })
        });
    } catch (e) {
        console.error(e);
        return {};
    }
    const promiseMap = {};
    for (const file of filenames) {
        // initialize all async tasks before waiting on any
        promiseMap[path.basename(file)] = parseTngFile(file);
    }
    const thingMap: ThingMap = {};
    const max = filenames.length;
    let current = 0;
    for (const file of filenames) {
        const base = path.basename(file);
        thingMap[base] = await promiseMap[base];
        console.log(`${++current}/${max}`);
    }
    console.log(`Parsed ${Object.keys(thingMap).length} files`);
    return thingMap;
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