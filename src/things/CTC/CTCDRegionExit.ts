import * as os from 'os';
import { UID, UIDType } from "../UID";
import { CTC } from "./CTC";

export class CTCDRegionExit implements CTC {
    EntranceConnectedToUID: UID;
    Active: boolean;
    serializedKeys: string;
    constructor(lines: string[]) {
        lines = lines.slice(1, lines.length - 1);
        const unknownLines: string[] = [];
        let EntranceConnectedToUID: string | undefined;
        let Active;
        for (const line of lines) {
            const tokens = line.replace(/[;"']/g, '').split(' ');
            if (line.includes("EntranceConnectedToUID")) {
                EntranceConnectedToUID = tokens[1];
            } else if (line.includes("Active")) {
                Active = tokens[1] === "TRUE";
            } else if (line !== '') {
                unknownLines.push(line);
            }
        }
        this.serializedKeys = unknownLines.join(os.EOL);
        this.EntranceConnectedToUID = new UID(UIDType.CONNECTIVE, EntranceConnectedToUID || "0");
        this.Active = !!Active;
    }

    serialize(): string {
        return [
            "StartCTCDRegionExit;",
            `EntranceConnectedToUID ${this.EntranceConnectedToUID.connectiveUID};`,
            this.serializedKeys,
            "EndCTCDRegionExit;"
        ].join(";" + os.EOL);
    }
}