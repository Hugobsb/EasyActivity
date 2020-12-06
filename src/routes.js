const { Router, response } = require('express');
const path = require('path');
const routes = Router();

const SearchController = require('./controllers/SearchController');

routes.get('/discord', (req, res) => {
    console.log(req.body);
    return res.sendStatus(200);
});

routes.post('/discord', (req, res) => {
    console.log(req.body);
    return res.sendStatus(200);
});

module.exports = routes;