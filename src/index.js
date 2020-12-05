const readline = require('readline');

const htmldocx = require('html-docx-js-typescript');

const fs = require('fs');

const path = require('path');

const SearchController = require('./controllers/SearchController');
    
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(write('O que deseja pesquisar?'), topic => {
    console.log(
        (topic.length === 0) ?
            rl.close() :
            (topic.split(', ').length > 1) ?
                `Tópicos: ${topic}\n` :
                `Tópico: ${topic}\n`
    );

    SearchController.searchResults(topic).then(results => {
        console.log('Resultados: \n');

        for (let i in results) {
            console.log(
                `${write(`${i * 1 + 1} - `)}${results[i].title}\n`
            );
        }

        rl.question(write('Selecione o número do resultado:'), index => {
            if (!results[index - 1]) rl.close();

            console.log(write('\nPesquisando e convertendo em documento word...\n'));

            SearchController.search(results[index - 1].link).then(result => {    

                htmldocx.asBlob(result).then(buffer => {
                    fs.writeFileSync(path.join(
                        __dirname,
                        '..',
                        'output',
                        `${new Date().toLocaleDateString().replace(/\//g, '-')} - ${new Date().toLocaleTimeString().replace(/:/g, '-')}.docx`
                    ), buffer);

                    rl.close();
                }).catch(err => console.log(`Erro ao gravar arquivo Word: ${err}`));
            }).catch(err => console.log(`Erro ao pesquisar: ${err}`));
        });
    });
    // rl.question(write(''))
});

rl.on("close", function() {
    console.log('\x1b[31m'+'... and here you go'+'\x1b[0m\n');
    process.exit(0);
});

function write(text) {
    return '\x1b[36m'+text+'\x1b[0m ';
}