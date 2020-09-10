const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    authenticator: new IamAuthenticator({
        apikey: 'JiNcT1TFNrPr80aW6cBGt5nLdPaV10oUG6_dHjoRaKr1',
    }),
    serviceUrl: 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/75159f2a-d5d9-477f-a34f-f38abca1f5d4',
});

module.exports = {
    async translate(arrayOfText) {
        const promisesArray = [];

        for (let i in arrayOfText) {
            promisesArray.push(
                languageTranslator.translate({ text: arrayOfText[i], modelId: 'en-pt' })
            );
        }

        return Promise.all(promisesArray).then(data => {
            const arrResponse = [];

            for (let i in data) {
                for (let j in data[i].result.translations) {
                    arrResponse.push(data[i].result.translations[j].translation);
                }
            }

            console.log('Tradução concluída');

            return arrResponse;
        }).catch(err => {
            console.warn(err);
        });
    }
};