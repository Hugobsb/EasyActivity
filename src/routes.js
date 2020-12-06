const { Router, response } = require('express');
const path = require('path');
const routes = Router();

const SearchController = require('./controllers/SearchController');

routes.get('/', (req, res) => {
    
});

module.exports = routes;