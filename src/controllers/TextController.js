const path = require('path');

const SearchController = require('./SearchController');
const LanguageController = require('./LanguageController');

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({
        apikey: 'xIN3Jtw9hYB_AmvcJ9d1l7uiPmc_ii0vEaaP9lOLk3Vj',
    }),
    serviceUrl: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/b2d8aab8-ea77-480a-9c0b-07214953eb5f',
});

const analyzeParams = {
    'url': 'www.ibm.com',
    'features': {
        'categories': {
            'explanation': true,
            'limit': 10
        }
    }
};

module.exports = {
    getConcepts(req, res) {
        const { text, base } = req.body;

        analyzeParams.features.categories.text = text;

        console.log('Buscando conceitos no texto...\n');

        naturalLanguageUnderstanding.analyze(analyzeParams).then(results => {
            const categories = [];

            console.log('\x1b[31m' + 'Lista de conceitos' + '\x1b[0m\n');
            
            for (let i in results.result.categories) {
                for (j in results.result.categories[i].explanation.relevant_text) {
                    categories.push(results.result.categories[i].explanation.relevant_text[j].text);
                    console.log(results.result.categories[i].explanation.relevant_text[j].text+'\n');
                }
            }

            categories.join('; ');
            res.render(path.resolve('./', './', 'public', 'concepts.html'), { concepts: categories, base });
        }).catch(err => {
            console.warn(err);
        });
    },

    structure(req, res) {
        console.log('Pesquisando conceitos...');

        const concepts = req.body.concepts?.split(',');

        const promisesArray = (() => {
            let result = [];

            for (let i in concepts) {
                result.push(SearchController.search(concepts[i]));
            }
            
            return result;
        })();

        Promise.all(promisesArray).then(data => {
            console.log('Pesquisa de conceitos concluída');

            console.log('Traduzindo textos...');

            LanguageController.translate(data).then(translatedData => {
                res.json(translatedData);
            });
        }).catch(err => {
            console.warn(err);
        });
    }
};