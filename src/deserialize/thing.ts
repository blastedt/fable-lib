import glob from 'glob';
import * as fs from 'fs';
import {
    Thing,
    TNG_FILE_TOKENS,
    CTCDRegionExit,
    ThingDirectory,
    ThingFile,
    CTC_TOKENS
} from '../models/thing.model';
import * as path from 'path';
import * as os from 'os';


function grabSubsectionFromLines(lines: string[], header: string, footer: string): null | { headerTokens: string[], footerTokens: string[], sectionLines: string[], remainingLines: string[], discardedLines: string[] } {
    const headerIndex = lines.findIndex(line => line.includes(header));
    if (headerIndex === -1) {
        return null;
    }
    const headerTokens = lines[headerIndex].split(' ');
    const footerIndex = lines.findIndex(line => line.includes(footer));
    if (footerIndex === -1) {
        return null;
    }
    const footerTokens = lines[footerIndex].split(' ');
    const sectionLines = lines.slice(headerIndex + 1, footerIndex);
    const remainingLines = lines.slice(footerIndex + 1);
    const discardedLines = lines.slice(0, headerIndex);
    return {
        headerTokens,
        footerTokens,
        sectionLines: sectionLines,
        remainingLines: remainingLines,
        discardedLines
    }
}


/**
 * Parses the contents of a thing file, returns an array of Thing (todo: fix that to include section markers)
 * @param contents Buffer of a Thing file
 */
export function parseTngContents(lines: string[]): ThingFile {
    let subsection;
    let remainingLines = lines;
    let thingFile = {};
    while (subsection =
        grabSubsectionFromLines(
            remainingLines,
            TNG_FILE_TOKENS.NEWSECTION,
            TNG_FILE_TOKENS.ENDSECTION
        )
    ) {
        remainingLines = subsection.remainingLines;
        const { sectionLines, headerTokens } = subsection;
        thingFile[headerTokens[1] || 'NOQUESTSECTIONHEADER'] = parseTngSection(sectionLines);
    }
    return thingFile;
}

export function parseTngSection(lines: string[]): Thing[] {
    let subsection, remainingLines = lines, res: Thing[] = [];
    while (subsection =
        grabSubsectionFromLines(
            remainingLines,
            TNG_FILE_TOKENS.NEWTHING,
            TNG_FILE_TOKENS.ENDTHING
        )
    ) {
        remainingLines = subsection.remainingLines;
        const { sectionLines, headerTokens } = subsection;
        res.push(parseThing(sectionLines, headerTokens));
    }
    return res;
}

export function parseThing(lines: string[], [unused, type]: string[]): Thing {
    const res: Thing = {} as Thing;
    res.TYPE = type;
    let remainingLines = lines;
    let subsection;
    while (subsection =
        grabSubsectionFromLines(
            remainingLines,
            TNG_FILE_TOKENS.STARTCTC,
            TNG_FILE_TOKENS.ENDCTC
        )
    ) {
        remainingLines = subsection.remainingLines;
        const { sectionLines, headerTokens } = subsection;
        addCTCSection(res, sectionLines, headerTokens[0]);
    }
    addAllThingLines(res, remainingLines);
    return res;
}

//MUTATES!!
export function addCTCSection(res: Thing, lines: string[], ctc: string) {
    switch (ctc) {
        case CTC_TOKENS.EXIT:
            res[CTC_TOKENS.EXIT] = addAllThingLines<CTCDRegionExit>({} as CTCDRegionExit, lines);
            break;
        default:
            if (!res.unparsedEntries) {
                res.unparsedEntries = [lines.join(os.EOL)]
            } else {
                res.unparsedEntries.push(lines.join(os.EOL));
            }
            break;
    }
}

export function addAllThingLines<T>(obj: T, lines: string[]): T {
    for (const line of lines) {
        const [key, ...vals] = line.split(' ');
        obj[key] = vals.join(' ');
    }
    return obj;
}

export async function deserializeThingFile(filename: string): Promise<ThingFile> {
    const data: Buffer = await new Promise(function (res: Function, rej: Function) {
        fs.readFile(filename, function (err: any, data: Buffer) {
            if (err) {
                return rej(err);
            }
            return res(data);
        });
    });
    const lines: string[] = data
        .toString()
        .split(/\r?\n/g)
        .map(s => s.replace(/[;"]/g, ''));
    return parseTngContents(lines);
}

export async function deserializeThingDirectory(directory: string): Promise<ThingDirectory> {
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
        promiseMap[path.relative(directory, file)] = deserializeThingFile(file);
    }
    const thingMap: ThingDirectory = {};
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