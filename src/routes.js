const { Router, response } = require('express');
const path = require('path');
const routes = Router();

const SearchController = require('./controllers/SearchController');
const TextController = require('./controllers/TextController');

routes.get('/', (req, res) => {
    res.send('index.html', { root: 'public' })
});

routes.get('/search', (req, res) => {
    const { topic } = req.query;

    SearchController.search(topic).then(data => {
        res.render(path.resolve('./', 'public', 'search.html'), { text: data, topic });
    }).catch(err => {        

    });
});

routes.post('/concepts', (req, res) => {
    TextController.getConcepts(req, res);
});

routes.post('/structure', TextController.structure);

module.exports = routes;