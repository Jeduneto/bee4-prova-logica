const fs = require('fs');
const path = require('path');
const csvjson = require('csvjson');
const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

var data = fs.readFileSync(path.join(__dirname, '../CEPs.csv'), { encoding : 'utf8'});

var options = {
    delimiter : ';',
    quote     : '"',
};

const array = csvjson.toObject(data, options);

function validarCep(cep) {
    cep = cep.replace(/\D/g, '');

    if (cep.length !== 8) {
        return false;
    }

    const repetido = new RegExp('^' + cep[0] + '{8}$');
    if (repetido.test(cep)) {
        return false;
    }

    return true;
}

arrayWithValidatedCEPs = [];
array.forEach(element => {
    const validarCEP = validarCep(element.CEP)
    if (validarCEP === true) {
        arrayWithValidatedCEPs.push(
            element.CEP.replace(/\D/g, ''),
        )
    }
})

let cepsResponse = []
async function getData(urls) {
    const requests = urls.map(url => axios.get(`https://viacep.com.br/ws/${url}/json/`));
    const responses = await Promise.all(requests);
    const data = responses.map(response => response.data);
    return data;
}

(async () => {
    const cepsResponse = await getData(arrayWithValidatedCEPs);

    const csvWriter = createCsvWriter({
        path: './newCEPs.csv',
        header: [
            {id: 'cep', title: 'CEP'},
            {id: 'logradouro', title: 'Logradouro'},
            {id: 'complemento', title: 'Complemento'},
            {id: 'bairro', title: 'Bairro'},
            {id: 'localidade', title: 'Localidade'},
            {id: 'uf', title: 'UF'},
            {id: 'Unidade', title: 'Unidade'},
            {id: 'ibge', title: 'IBGE'},
            {id: 'gia', title: 'GIA'}
        ],
        fieldDelimiter: ';'
    });
    
    csvWriter
        .writeRecords(cepsResponse)
        .then(() => console.log('Arquivo CSV criado com sucesso'));
})();

