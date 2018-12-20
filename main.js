const fs = require('fs');
const path = require('path');
const {
    parseAllTngs,
    mappedRegionEntrancesExits
} = require('./dist/tng/parse-tng');

parseAllTngs(path.resolve('./levels-dirty'))
    .then(function (things) {
        console.log('done parsing');
        const exits = mappedRegionEntrancesExits(things);
        console.log(`Found ${Object.keys(exits).length} exits`);
        fs.writeFile('./regionEntrancesInc.txt',
            JSON.stringify(exits, null, 3),
            function (e) {
                if (e) console.error(e);
            });
    });