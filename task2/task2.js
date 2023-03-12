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
        Population: parseInt(element.Population)
    })
})

function bubbleSort(array, prop) {
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i][prop] > array[i + 1][prop]) {
                let temp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
    return array
}

let sortedArray = bubbleSort(multipliedArray, 'Population');

const csvWriter = createCsvWriter({
    path: './newMapa.csv',
    header: [
        {id: 'Local', title: 'Local'},
        {id: 'Population', title: 'População no último censo'}
    ],
    fieldDelimiter: ';'
});

csvWriter
    .writeRecords(sortedArray)
    .then(() => console.log('Arquivo CSV criado com sucesso'));
