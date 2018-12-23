const fs = require('fs');
const path = require('path');
const {
    parseAllTngs
} = require('./dist/tng/parse-tng');
const { getEntrances } = require('./dist/entrances/entrances');

parseAllTngs(path.resolve('./levels-dirty'))
    .then(function (things) {
        console.log('done parsing');
        const entrances = getEntrances(things);
        fs.writeFile('./entrances.txt',
            JSON.stringify(entrances, null, 3),
            function (e) {
                if (e) console.error(e);
            });
    });