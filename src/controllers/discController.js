const app = require('express').Router();
const getDiscStats = require('../service/cadacoDiscRunner').getDiscStats;

app.get('/', async (req, res) => {
    res.send(await getDiscStats("mets", 2019));
});

module.exports = app;
