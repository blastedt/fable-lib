import * as os from 'os';
import { CTC } from "./CTC/CTC";
import { UID, UIDType } from "./UID";
import { grabSubsectionFromLines } from '../util/grab-subsections';
import { TNG_FILE_TOKENS } from '../models/thing.model';

export enum THING_TYPE {
    THING = "Thing",
    HOLY_SITE = "Holy Site",
    CREATURE = "AICreature",
    NONE = "NULL"
}

export enum DefinitionType {
    ENTRANCE = "REGION_ENTRANCE_POINT",
    EXIT = "REGION_EXIT_POINT",
    NONE = "NULL"
}


export class Thing {
    CTCs: CTC[];
    UID: UID;
    DefinitionType: DefinitionType | string;
    type: THING_TYPE | string;
    literalFields: { [key: string]: string } = {}

    public static deserialize(lines: string[]): Thing {
        let uid, ctcs: CTC[] = [], unknownLines: string[] = [], defType, literalFields = {};
        let type = lines[0].replace(/['";]/g, '').split(' ')[1];
        let remainingLines = lines.slice(1);
        let subsection;
        while (subsection =
            grabSubsectionFromLines(
                remainingLines,
                TNG_FILE_TOKENS.STARTCTC
            )
        ) {
            remainingLines = subsection.remainingLines;
            const { sectionLines } = subsection;
            try {
                ctcs.push(CTC.deserialize(sectionLines));
            } catch (e) {
                console.log(e);
            }
        }
        // cut off footer
        remainingLines = remainingLines.slice(0, remainingLines.length - 1);
        for (const line of remainingLines) {
            const tokens = line.replace(/['";]/g, '').split(' ');
            switch (tokens[0]) {
                case "UID":
                    uid = new UID(UIDType.OBJECT, tokens[1]);
                    break;
                case "DefinitionType":
                    defType = tokens[1];
                    break;
                default:
                    literalFields[tokens[0]] = tokens.slice(1).join(" ");
                    break;
            }
        }

        return new Thing(
            type,
            uid || new UID(UIDType.ERROR),
            ctcs,
            defType || DefinitionType.NONE,
            literalFields
        );
    }

    constructor(type: THING_TYPE | string,
        UID: UID,
        CTCs: CTC[],
        defType: DefinitionType | string,
        literalFields: { [key: string]: string }) {
        this.type = type;
        this.UID = UID;
        this.CTCs = CTCs;
        this.literalFields = literalFields;
        this.DefinitionType = defType;
    }

    serialize(): string {
        let serializedFields: string[] = [];
        for (let field in this.literalFields) {
            serializedFields.push(`${field} ${this.literalFields[field]};`);
        }
        let serializedCTCs: string[] = this.CTCs.map(ctc => ctc.serialize());
        return [
            `${TNG_FILE_TOKENS.NEWTHING} ${this.type};`,
            `UID ${this.UID.objectUID};`,
            `DefinitionType ${this.DefinitionType};`,
            ...serializedFields,
            ...serializedCTCs,
            `${TNG_FILE_TOKENS.ENDTHING};`
        ].join(os.EOL) + os.EOL;
    }
}

