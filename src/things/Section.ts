import { TNG_FILE_TOKENS } from "../models/thing.model";
import { grabSubsectionFromLines } from "../util/grab-subsections";
import { parseThing } from "../deserialize/thing";
import { Thing } from "./Thing";

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

    constructor(things: Thing[], quest: string | null) {
        this.things = things;
        this.quest = quest;
    }
}