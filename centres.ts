import { forEach, map } from "./src/util/thing-map";
import { Thing } from "./src/things/Thing";
import { ThingPathMap } from "./src/randomizer/randomizer";
import { ThingFile } from "./src/main";
import * as path from 'path';
import { CTCPhysicsStandard } from "./dist/src/things/CTC/CTCPhysicsStandard";

interface Coordinates {
    x: number,
    y: number,
    z: number
}

map('H:/SteamLibrary/steamapps/common/Fable The Lost Chapters/data/Levels_xbox/**/*.tng', function (thingfile, name, i, map): any {
    const things = thingfile.sections
        .reduce((acc, sec) => acc.concat(sec.things), <Thing[]>[]);
    if (things.length === 0) return { x: 0, y: 0, z: 0 };
    const totalCoordinates: Coordinates = things.reduce((acc, thing) => {
        const phys = <CTCPhysicsStandard>thing.CTCs['StartCTCPhysicsStandard;']
        if (!phys) return acc;
        acc.x += phys.PositionX;
        acc.y += phys.PositionY;
        acc.z += phys.PositionZ;
        return acc;
    }, { x: 0, y: 0, z: 0 });
    totalCoordinates.x /= things.length;
    totalCoordinates.y /= things.length;
    totalCoordinates.z /= things.length;
    const centre = totalCoordinates;
    const maxDistances: any = things.reduce((acc, thing) => {
        const phys = <CTCPhysicsStandard>thing.CTCs['StartCTCPhysicsStandard;']
        if (!phys) return acc;
        acc.xRadius = Math.max(
            acc.xRadius,
            Math.abs(phys.PositionX - centre.x)
        );
        acc.yRadius = Math.max(
            acc.yRadius,
            Math.abs(phys.PositionY - centre.y)
        );
        acc.zRadius = Math.max(
            acc.zRadius,
            Math.abs(phys.PositionZ - centre.z)
        );
        return acc;
    }, { xRadius: 0, yRadius: 0, zRadius: 0, ...totalCoordinates });
    return maxDistances;
})
    .then(function (coordMap: { [name: string]: Coordinates }) {
        console.log(JSON.stringify(coordMap, null, 3));
    });