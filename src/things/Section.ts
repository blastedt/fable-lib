import { TNG_FILE_TOKENS } from "../models/thing.model";
import { grabSubsectionFromLines } from "../util/grab-subsections";
import { Thing } from "./Thing";
import * as os from 'os';

export class Section {
    public things: Thing[];
    public quest: string | null;
    public static deserialize(lines: string[]): Section {
        let quest: string | null = lines[0].split(' ')[1].replace(';', '');
        if (quest === "NULL") quest = null;
        let subsection, remainingLines = lines, res: Thing[] = [];
        while (subsection =
            grabSubsectionFromLines(
                remainingLines,
                TNG_FILE_TOKENS.NEWTHING,
                TNG_FILE_TOKENS.ENDTHING
            )
        ) {
            remainingLines = subsection.remainingLines;
            const { sectionLines } = subsection;
            res.push(Thing.deserialize(sectionLines));
        }
        return new Section(res, quest || null);
    }

    public serialize(): string {
        const serializedThings = this.things.map(thing => thing.serialize());
        return [
            `${TNG_FILE_TOKENS.NEWSECTION} ${this.quest || "NULL"};`,
            ...serializedThings,
            `${TNG_FILE_TOKENS.ENDSECTION};`
        ].join(os.EOL) + os.EOL;
    }

    constructor(things: Thing[], quest: string | null) {
        this.things = things;
        this.quest = quest;
    }
}