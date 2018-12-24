import { CTC } from "./CTC";
import * as os from 'os';

export class UnimplementedCTC implements CTC {
    private content: string;
    constructor(lines: string[]) {
        this.content = lines.join(os.EOL);
    }
    serialize(): string {
        return this.content;
    }
}