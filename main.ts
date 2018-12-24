import { ThingFile } from "./src/things/ThingFile";
import * as fs from 'fs';
import glob from 'glob';
import { Section } from "./src/things/Section";
import * as os from 'os';

// ThingFile.deserialize('./Levels/FinalAlbion/GuildWoods.tng')
//     .then(function (file: ThingFile) {
//         fs.writeFile('guildwoods.txt', file.serialize(), console.error);
//     });
Promise.all([
    ThingFile.deserialize('./Levels/FinalAlbion/GuildWoods.tng'),
    ThingFile.deserialize('./guildwoods.txt')
])
    .then(function ([fables, mine]) {
        let fableCount = 0;
        for (const sec of fables.sections) {
            fableCount += sec.things.length;
        }
        let myCount = 0;
        for (const sec of mine.sections) {
            myCount += sec.things.length;
        }
        console.log(`My count ${myCount}, fable count ${fableCount}`);
    });