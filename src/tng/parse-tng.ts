import * as glob from 'glob';
import * as fs from 'fs';
import { 
    Thing, 
    TNG_FILE_TOKENS 
} from './tng.model';
import { resolve } from 'dns';



export function parseTngContents(contents: Buffer): Thing[] {
    const lines = contents.toString().split(/\r?\n/g);
    let things: Thing[] = []; 
    for (const line of lines) {
        if (line.indexOf(TNG_FILE_TOKENS.NEWTHING) > -1) {
            things.unshift({});
        } else if (things.length > 0 && line.indexOf(TNG_FILE_TOKENS.ENDTHING) === -1) {
            const [key, value] = line.replace(/[;"]/g,'').split(' ');
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