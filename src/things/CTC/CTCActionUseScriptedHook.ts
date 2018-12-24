import { UID, UIDType } from "../UID";
import * as os from 'os';

export class CTCActionUseScriptedHook {
    EntranceConnectedToUID: UID | undefined;
    serializedKeys: string[];
    constructor(lines: string[]) {
        lines = lines.slice(1, lines.length - 1);
        const unknownLines: string[] = [];
        let EntranceConnectedToUID: string | undefined;
        for (const line of lines) {
            const tokens = line.replace(/[;"']/g, '').split(' ');
            if (line.includes("EntranceConnectedToUID")) {
                EntranceConnectedToUID = tokens[1];
            } else if (line !== '') {
                unknownLines.push(tokens.join(' '));
            }
        }
        this.serializedKeys = unknownLines;
        this.EntranceConnectedToUID = EntranceConnectedToUID
            ? new UID(UIDType.CONNECTIVE, EntranceConnectedToUID)
            : undefined;
    }

    serialize(): string {
        const entrance = this.EntranceConnectedToUID
            ? [`EntranceConnectedToUID ${this.EntranceConnectedToUID.connectiveUID}`]
            : [];
        return [
            "StartCTCActionUseScriptedHook;",
            ...entrance,
            ...this.serializedKeys,
            "EndCTCActionUseScriptedHook;"
        ].join(";" + os.EOL);
    }
}