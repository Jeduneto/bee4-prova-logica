const fs = require('fs');
const path = require('path');
const csvjson = require('csvjson');
const request = require('request');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

var data = fs.readFileSync(path.join(__dirname, '../CEPs.csv'), { encoding : 'utf8'});

var options = {
    delimiter : ';',
    quote     : '"',
};

const array = csvjson.toObject(data, options);

function validarCep(cep) {
    // Remove qualquer caractere que não seja um número
    cep = cep.replace(/\D/g, '');

    // Verifica se o CEP tem 8 dígitos
    if (cep.length !== 8) {
        return false;
    }

    // Verifica se o CEP é composto apenas por números repetidos
    const repetido = new RegExp('^' + cep[0] + '{8}$');
    if (repetido.test(cep)) {
        return false;
    }

    return true;
}

// let multipliedArray = [];
// array.forEach(element => {
//     multipliedArray.push({
//         Local: element.Local,
//         Population: parseInt(element.Population)
//     })
// })

// request('https://viacep.com.br/', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log(body) // Print the google web page.
//     }
// })

// const csvWriter = createCsvWriter({
//     path: './newMapa.csv',
//     header: [
//         {id: 'Local', title: 'Local'},
//         {id: 'Population', title: 'População no último censo'}
//     ],
//     fieldDelimiter: ';'
// });

// csvWriter
//     .writeRecords(sortedArray)
//     .then(() => console.log('Arquivo CSV criado com sucesso'));
