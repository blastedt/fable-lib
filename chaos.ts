import * as fs from 'fs';
import * as path from 'path';
import { ThingPathMap } from "./src/randomizer/randomizer";
import { ThingFile } from "./src/main";
import { Section } from "./src/things/Section";
import { Thing } from "./src/things/Thing";
import glob = require("glob");
import * as mkdirp from 'mkdirp';


function chaosThing(file: ThingFile): ThingFile {
    let mergedThings: Thing[] = [];
    for (let section of file.sections) {
        console.log(`Chaosing a section, adding ${section.things.length} things`);
        mergedThings = mergedThings.concat(section.things);
    }
    const mergedSection: Section = new Section(mergedThings, null);
    console.log("Chaos'd a file, section length " + mergedSection.things.length);
    return new ThingFile([mergedSection], file.unparsedLines);
}

async function readFilePromise(file: string): Promise<Buffer> {
    return new Promise<Buffer>(function (resolve, reject) {
        fs.readFile(file, function (err, data) {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

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

export async function chaos(pattern: string, root: string) {
    const filemap = await loadAll(pattern);
    const chaosmap: ThingPathMap = {};
    for (const name in filemap) {
        chaosmap[name] = chaosThing(filemap[name]);
    }
    serializeAll(chaosmap, root);
}

chaos('Levels-CLEANNOTOUCH/**/*.tng', 'Levels-Chaos-2');