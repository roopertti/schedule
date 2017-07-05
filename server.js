const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const moment = require('moment');

const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/scheduledb');
mongoose.Promise = global.Promise;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

app.listen(port, () => {
	console.log('listening to ' + port);
});