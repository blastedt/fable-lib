import * as fs from 'fs';
import * as path from 'path';
import { ThingPathMap } from '../randomizer/randomizer';
import glob from 'glob';
import { ThingFile } from '../main';

async function writeFilePromise(file: string, data: any) {
    return new Promise<void>(function (resolve, reject) {
        fs.writeFile(file, data, function (err) {
            if (err) return reject(err);
            resolve();
        });
    });
}

async function loadAll(pattern: string): Promise<ThingPathMap> {
    const files = await new Promise<string[]>(function (resolve, reject) {
        glob(pattern, function (err, files) {
            if (err) return reject(err);
            resolve(files);
        });
    });
    const promiseMap: any = {};
    for (let file of files) {
        promiseMap[file] = ThingFile.deserialize(file);
    }
    const res: ThingPathMap = {};
    for (let file of files) {
        res[file] = await promiseMap[file];
    }
    return res;
}

export function reRootPath(file: string, root: string): string {
    const cwdDir: string = path.parse(path.resolve(process.cwd())).dir;
    const cwdDepth: number = cwdDir.split(path.sep).length;
    const fileInfo = path.parse(path.resolve(file));
    const fileFolders: string[] = fileInfo.dir.split(path.sep);
    fileFolders[cwdDepth + 1] = root;
    fileInfo.dir = fileFolders.join(path.sep);
    return path.format(fileInfo);
}

async function serializeAll(files: ThingPathMap, root: string) {
    const promises: Promise<void>[] = [];
    for (let filename in files) {
        promises.push(writeFilePromise(
            reRootPath(filename, root),
            files[filename].serialize()
        ));
    }
    return Promise.all(promises);
}


export async function mapAndSave(pattern: string, root: string, predicate: (thing: ThingFile, name: string, index: number, map: ThingPathMap) => ThingFile): Promise<void> {
    const map: ThingPathMap = await loadAll(pattern);
    const transformedMap: ThingPathMap = {};
    const keys = Object.keys(map);
    const keyLen = keys.length;
    for (let i = 0; i < keyLen; i++) {
        const key = keys[i];
        transformedMap[key] = predicate(map[key], key, i, map);
    }
    serializeAll(transformedMap, root);
}

export async function map<T>(pattern: string, predicate: (thing: ThingFile, name: string, index: number, map: ThingPathMap) => T): Promise<{ [name: string]: T }> {
    const map: ThingPathMap = await loadAll(pattern);
    const transformedMap: { [name: string]: T } = {};
    const keys = Object.keys(map);
    const keyLen = keys.length;
    for (let i = 0; i < keyLen; i++) {
        const key = keys[i];
        transformedMap[key] = predicate(map[key], key, i, map);
    }
    return transformedMap;
}

export async function forEach(pattern: string, predicate: (thing: ThingFile, name: string, index: number, map: ThingPathMap) => void): Promise<void> {
    const map: ThingPathMap = await loadAll(pattern);
    const keys = Object.keys(map);
    const keyLen = keys.length;
    for (let i = 0; i < keyLen; i++) {
        const key = keys[i];
        predicate(map[key], key, i, map);
    }
}