import { forEach } from "./src/util/thing-map";
import { Thing } from "./src/things/Thing";
import { ThingPathMap } from "./src/randomizer/randomizer";
import { ThingFile } from "./src/main";
import * as path from 'path';

const questMap: any = {};
forEach('H:/SteamLibrary/steamapps/common/Fable The Lost Chapters/data/Levels_xbox - Copy/**/*Dome.tng', function (thing: ThingFile, name: string, i: number, map: ThingPathMap) {
    name = path.parse(path.resolve(name)).name;
    questMap[name] = thing.sections.map(section => section.quest);
})
    .then(function () {
        console.log(JSON.stringify(questMap, null, 3));
    });