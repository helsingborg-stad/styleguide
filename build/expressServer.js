const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

/**
 * Express App
 * @type {*|app}
 */
const app = express();

/**
 * Post variable
 * @type {number}
 */
const port = 1337;

/**
 * Consola packet for nicer term log
 * @type object consLog
 */
const consLog = require('consola');


app.use(bodyParser.json());
app.use(cors());

/**
 * Fetching data - and send it to sass compilation
 */

app.post('/compilesasscomponent', function (req, res) {
    
    const data = req.body.payload;
    const result = Object.keys(data).map(function(k) { return data[k] });
    const sassComponents = require('./sassComponents/sassComponents');
    const output = sassComponents.initSassComponents(result);
    
    res.setHeader('Content-type', 'text/css');
    res.json({ cssFile: output });
    
});

app.listen(port, () => consLog.success(`Express server app listening on port:  ${port}!`));


