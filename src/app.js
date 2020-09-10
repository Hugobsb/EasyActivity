const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const ejs = require('ejs');

const app = express();

app.use(express.json());
app.use(express.static(path.join('public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(routes);

module.exports = app;