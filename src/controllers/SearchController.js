const axios = require('axios');
const cheerio = require('cheerio');

const isMidi = (i, link) => {
    // Return false if there is no href attribute.
    if (typeof link.attribs.href === 'undefined') { return false }

    return link.attribs.href.includes('.mid');
};

const noParens = (i, link) => {
    // Regular expression to determine if the text has parentheses.
    const parensRegex = /^((?!\().)*$/;
    return parensRegex.test(link.children[0].data);
};

module.exports = {
    async search(topic) {
        console.log('Pesquisando '+topic+'...');

        topic.replace(' ', '+');

        return axios.default.get(`https://en.wikipedia.org/w/index.php?sort=relevance&search=${topic}&title=Special:Search&profile=advanced&fulltext=1&advancedSearch-current=%7B%7D&ns0=1`).then(
            data => {
                let $ = cheerio.load(data.data);
                const hrefList = [];

                $('a').each((i, link) => {
                    const href = link.attribs.href;
                    if (String(href).includes('wiki') && String(href) !== '/wiki/Help:Searching') {
                        hrefList.push(href);
                    }
                });

                return axios.default.get(`https://en.wikipedia.org${hrefList[0]}`).then(
                    data => {
                        $ = cheerio.load(data.data);
                        
                        $('html').find('sup').remove();
                        return $('p').text();
                    }
                ).catch(err => {

                });
            }
        ).catch(err => {

        });
    }
}