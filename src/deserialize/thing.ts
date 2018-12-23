import glob from 'glob';
import * as fs from 'fs';
import {
    Thing,
    TNG_FILE_TOKENS,
    ThingMap
} from '../models/thing.model';
import * as path from 'path';


/**
 * Parses the contents of a thing file, returns an array of Thing (todo: fix that to include section markers)
 * @param contents Buffer of a Thing file
 */
export function parseTngContents(contents: Buffer): Thing[] {
    const lines = contents.toString().split(/\r?\n/g);
    let things: Thing[] = [];
    for (const line of lines) {
        if (line.indexOf(TNG_FILE_TOKENS.NEWTHING) > -1) {
            things.unshift({} as Thing);
        } else if (things.length > 0 && line.indexOf(TNG_FILE_TOKENS.ENDTHING) === -1) {
            const [key, value] = line.replace(/[;"]/g, '').split(' ');
            things[0][key] = value;
        }
    }
    return things;
}

export async function deserializeThing(filename: string): Promise<Thing[]> {
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

export async function deserializeThingDirectory(directory: string): Promise<ThingMap> {
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
        promiseMap[path.relative(directory, file)] = deserializeThing(file);
    }
    const thingMap: ThingMap = {};
    const max = filenames.length;
    let current = 0;
    for (const file of filenames) {
        const base = path.relative(directory, file);
        thingMap[base] = await promiseMap[base];
        console.log(`${++current}/${max}`);
    }
    console.log(`Parsed ${Object.keys(thingMap).length} files`);
    return thingMap;
}
