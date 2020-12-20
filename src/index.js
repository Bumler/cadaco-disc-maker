const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();  
app.use(bodyParser.json());
app.use(cors());

const discController = require('./controllers/discController.js');
app.use('/disc', discController);

app.listen(3001, async () => {
    console.log('listening on port 3001');
});