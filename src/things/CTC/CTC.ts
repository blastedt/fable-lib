import { CTCDRegionExit } from "./CTCDRegionExit";
import { UnimplementedCTC } from "./UnimplementedCTC";
import { CTCActionUseScriptedHook } from "./CTCActionUseScriptedHook";

export interface CTC {
    serialize(): string
}
export namespace CTC {
    export function deserialize(lines: string[]): CTC {
        const type = lines[0].replace(/(Start|['";])/g, '');
        switch (type) {
            case "CTCDRegionExit":
                return new CTCDRegionExit(lines);
            case "CTCActionUseScriptedHook":
                return new CTCActionUseScriptedHook(lines);
            default:
                return new UnimplementedCTC(lines);
        }
    }
}