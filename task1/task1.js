const fs = require('fs');
const path = require('path');
const csvjson = require('csvjson');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

var data = fs.readFileSync(path.join(__dirname, '../mapa.csv'), { encoding : 'utf8'});

var options = {
    delimiter : ';',
    quote     : '"',
    headers: 'Local;Population'
};

const array = csvjson.toObject(data, options);
array.shift();

let multipliedArray = [];
array.forEach(element => {
    multipliedArray.push({
        Local: element.Local,
        Population: parseInt(element.Population * 2)
    })
})

const csvWriter = createCsvWriter({
    path: './newMapa.csv',
    header: [
        {id: 'Local', title: 'Local'},
        {id: 'Population', title: 'População no último censo'}
    ],
    fieldDelimiter: ';'
});

csvWriter
    .writeRecords(multipliedArray)
    .then(() => console.log('Arquivo CSV criado com sucesso'));
