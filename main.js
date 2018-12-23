const fs = require('fs');
const path = require('path');
const {
    deserializeThingDirectory
} = require('./dist/deserialize/thing');
const { getEntrances } = require('./dist/entrances/entrances');

deserializeThingDirectory(path.resolve('./levels-dirty'))
    .then(function (things) {
        console.log('done parsing');
        const entrances = getEntrances(things);
        fs.writeFile('./entrances.txt',
            JSON.stringify(entrances, null, 3),
            function (e) {
                if (e) console.error(e);
            });
    });