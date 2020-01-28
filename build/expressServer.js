const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 1337;

app.use(bodyParser.json());
app.use(cors());

/**
 * Fetching data - and send it to sass compilation
 */
app.post('/compileSassComponent', function (req, res) {
    
    const data = req.body.payload;
    const result = Object.keys(data).map(function(k) { return data[k] });
    res.send(result);
    
    const sassComponents = require('./sassComponents/sassComponents');
    sassComponents.initSassComponents(result);
});

app.listen(port, () => console.log(`Express server app listening on port:  ${port}!`));


