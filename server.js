'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const moment = require('moment');
const assert = require('assert');

const CalendarItem = require('./schemas/calendar-item.js');

const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/scheduledb');
mongoose.Promise = global.Promise;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

app.post('/addCalendarItem', (req, res) => {
	const start = req.body.start;
	const end = req.body.end;
	
	let item = new CalendarItem({
		creatorId: "asdf123",
		start: start,
		end: end,
		reservedTo: null,
		customerInfo: {
			firstName:  null,
			lastName: null,
			phoneNumber: null,
			studyProgramme: null
		}
	});
	
	item.save()
	.then((item) => {
		return CalendarItem.findById(item._id);
	})
	.then((item) => {
		res.send({
			savedItem: item,
			message: 'Item saved succesfully!'
		});
	}, (err) => {
		console.log(`error: ${err}`);
		res.send(err);
	});
	
});

app.listen(port, () => {
	console.log('listening to ' + port);
});