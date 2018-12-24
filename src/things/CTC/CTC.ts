import { CTCDRegionExit } from "./CTCDRegionExit";
import { UnimplementedCTC } from "./UnimplementedCTC";

export interface CTC {
    serialize(): string
}
export namespace CTC {
    export function deserialize(lines: string[]): CTC {
        const type = lines[0].replace(/(Start|['";])/g, '');
        switch (type) {
            case "CTCDRegionExit":
                return new CTCDRegionExit(lines);
            default:
                return new UnimplementedCTC(lines);
        }
    }
}