const app = require('express').Router();
const getDiscStats = require('../service/cadacoDiscRunner').getDiscStats;

app.get('/', async (req, res) => {
    const {teamAbbreviation, season } = req.query;
    console.log(teamAbbreviation);
    res.send(await getDiscStats(teamAbbreviation, season));
});

module.exports = app;
