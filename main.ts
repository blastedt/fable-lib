import { fetchAllThings, fetchAllCUIDs, randomizeConnectiveUIDs, serializeAllThings } from "./src/randomizer/randomizer";
import { ThingFile } from "./src/things/ThingFile";
import * as fs from 'fs';

// ThingFile.deserialize('./Levels/FinalAlbion/GuildWoods.tng')
//     .then(function (file: ThingFile) {
//         fs.writeFile('guildwoods.txt', file.serialize(), console.error);
//     });
// Promise.all([
//     ThingFile.deserialize('./Levels/FinalAlbion/GuildWoods.tng'),
//     ThingFile.deserialize('./guildwoods.txt')
// ])
//     .then(function ([fables, mine]) {
//         let fableCount = 0;
//         for (const sec of fables.sections) {
//             fableCount += sec.things.length;
//         }
//         let myCount = 0;
//         for (const sec of mine.sections) {
//             myCount += sec.things.length;
//         }
//         console.log(`My count ${myCount}, fable count ${fableCount}`);
//     });

async function main() {
    console.log(process.argv);
    const things = await fetchAllThings(process.argv[2] || './Levels');
    console.log(`${Object.keys(things).length} TNGs opened`);
    const CUIDs = fetchAllCUIDs(things);
    console.log(`${CUIDs.length} exits found`);
    randomizeConnectiveUIDs(things, CUIDs);
    await serializeAllThings(things);
    console.log("Randomized");
}

main();