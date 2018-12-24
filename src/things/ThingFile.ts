import * as fs from 'fs';
import * as os from 'os';
import { TNG_FILE_TOKENS } from "../models/thing.model";
import { grabSubsectionFromLines } from "../util/grab-subsections";
import { Section } from "./Section";

export class ThingFile {
    public sections: Section[];
    public unparsedLines: string[];

    public static async deserialize(filename: string): Promise<ThingFile> {
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
            .split(/\r?\n/g);
        // move this to final deserialization locations 
        // to avoid harming unprocessed lines
        //     .map(s => s.replace(/[;"]/g, ''));
        let subsection;
        let remainingLines = lines;
        let sections: Section[] = [];
        while (subsection =
            grabSubsectionFromLines(
                remainingLines,
                TNG_FILE_TOKENS.NEWSECTION,
                TNG_FILE_TOKENS.ENDSECTION
            )
        ) {
            remainingLines = subsection.remainingLines;
            const { sectionLines } = subsection;
            sections.push(Section.deserialize(sectionLines));
        }
        return new ThingFile(sections, remainingLines);

    }

    serialize(): string {
        const serializedSections = this.sections.map(sec => sec.serialize());
        return [
            `Version 2;`,
            ``,
            ...serializedSections
        ].join(os.EOL) + os.EOL;
    }

    constructor(sections: Section[], unparsedLines: string[]) {
        this.sections = sections;
        this.unparsedLines = unparsedLines.filter(line => line.length > 0);
    }
}