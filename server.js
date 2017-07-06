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

app.get('/getCalendarItems', (req, res) => {
	var from = moment();
	console.log(from);
	var to = moment(from).add(1, 'months')
	CalendarItem.find({ start: { $gte: from, $lt: to}})
	.then((items) => {
		if(items.length === 0) {
			res.send({
				items: null,
				message: "No items found."
			});
		} else if(items.length >= 1) {
			res.send({
				items: items,
				message: "Items were retrieved succesfully!"
			});
		}
	}, (err) => {
		console.log('error: ' + err);
		res.send(err);
	});
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