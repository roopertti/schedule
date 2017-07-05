const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalendarItemSchema = new Schema({
	creatorId: String,
	start: Date,
	end: Date,
	reservedTo: String,
	customerInfo: {
		firstName: String,
		lastName: String,
		phoneNumber: String,
		studyProgramme: String
	}
});

var CalendarItem = mongoose.model('CalendarItem', CalendarItemSchema, 'calendar_items');

module.exports = CalendarItem;