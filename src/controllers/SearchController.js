const axios = require('axios');
const cheerio = require('cheerio');

// const isMidi = (i, link) => {
//     // Return false if there is no href attribute.
//     if (typeof link.attribs.href === 'undefined') { return false }

//     return link.attribs.href.includes('.mid');
// };

// const noParens = (i, link) => {
//     // Regular expression to determine if the text has parentheses.
//     const parensRegex = /^((?!\().)*$/;
//     return parensRegex.test(link.children[0].data);
// };

module.exports = {
    async searchResults(topic) {
        console.log(`Pesquisando ${topic}...\n\n`);

        topic.replace(' ', '+');

        return axios.default.get(`https://pt.wikipedia.org/w/index.php?sort=relevance&search=${topic}&title=Special:Search&profile=advanced&fulltext=1&advancedSearch-current=%7B%7D&ns0=1`).then(
            async data => {
                let $ = cheerio.load(data.data);
                const response = [];

                $('.mw-search-result').each((_, el) => {
                    response.push(
                        {
                            title: el.children[0].children[0].attribs.title,
                            link: `https://pt.wikipedia.org${el.children[0].children[0].attribs.href}`
                        }
                    );
                });

                return response;
            }
        ).catch(err => {
            console.log(err);
        });
    },

    async search(link) {
        if (!link || typeof link !== 'string') return;

        return axios.default.get(link).then(
            data => {
                let $ = cheerio.load(data.data);

                $('html').find('img').each((_, el) => {
                    el.attribs.src = `https:${el.attribs.src}`
                });
                $('html').find('a').each((_, el) => {
                    el.tagName = 'span';
                });
                $('html').find('meta').remove();
                $('html').find('sup').remove();
                $('html').find('footer').remove();
                $('html').find('script').remove();
                $('html').find('#toc').remove();
                $('html').find('#mw-navigation').remove();
                $('html').find('#siteNotice').remove();
                $('html').find('.plainlinks').remove();
                $('html').find('.mw-indicators.mw-body-content').remove();
                $('html').find('.mw-editsection').remove();
                $('html').find('.mw-jump-link').remove();
                $('html').find('.infobox_v2').remove();
                $('html').find('.hatnote').remove();
                $('html').find('.print').remove();
                $('html').find('.noprint').remove();
                $('html').find('.printfooter').remove();
                $('html').find('.catlinks').remove();
                $('html').find('.navbox').remove();

                return $.html().replace(/\r?\n|\r/gi, '');
            }
        ).catch(err => {
            console.log(err);
        });
    }
}