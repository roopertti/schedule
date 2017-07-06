var app = angular.module('app', ['ui.calendar'])

.service('dates', function() {
	var self = this;
	
	this.f = {
		full: "DD.MM.YYYY HH:mm Z",
		dateOnly: "DD.MM.YYYY",
		timeOnly: "HH:mm"
	}
	
	this.validateInput = function(date, start, end) {
		//return moment(str, format, true).isValid();
		if(moment(date, self.f.dateOnly, true).isValid() && 
		  moment(start, self.f.timeOnly, true).isValid() &&
		  moment(end, self.f.timeOnly, true).isValid()) {
			return true;
		} else {
			return false;
		}
	}
	
	this.parseFullStrToMoment = function(str) {
		return moment(str, self.f.full);
	}
})

.controller('adminCtrl', ['$scope', '$http', 'dates', function($scope, $http, dates) {
	
	$scope.day = "";
	$scope.month = "";
	$scope.year = moment().year();
	$scope.startH = "";
	$scope.startM = "";
	$scope.endH = "";
	$scope.endM = "";
	
	$scope.addEvent = function() {
		var date = $scope.day + "." + $scope.month + "." + $scope.year;
		var start = $scope.startH + ":" + $scope.startM;
		var end = $scope.endH + ":" + $scope.endM;
		
		if(dates.validateInput(date, start, end)) 
		{
			var startStr = date + " " + start + " +0300";
			var endStr = date + " " + end + " +0300";

			var start = moment(startStr, dates.f.full);
			var end = moment(endStr, dates.f.full);

			$http({
				method: 'POST',
				url: '/addCalendarItem',
				data: {
					start: start,
					end: end
				}
			})
			.then(function(response) {
				console.log(response);
			}, function(err) { 
				console.log('error: ' + err);
			});
		}	
	}
	
}])

.controller('calendarCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {
	
	var calendarLang = {
        en: {
			monthsLong: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
						 'August', 'September', 'October', 'November', 'December'],
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
							  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            daysLong: ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
					   'Thursday', 'Friday', 'Saturday'],
            daysShort: ['Sun' ,'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']	
		}
    };
	
	$scope.freeEvents = [];
	$scope.reservedEvents = [];
	$scope.newEvents = [];
	$scope.idOfCurrentlyDraggedEvent = null;
	var newEventId = 0;
	
	$scope.uiConfig = {
		calendar: {
            locale: 'fi',
            timeFormat: 'h(:mm)',
            timezone: 'local',
            weekends: false,
            weekNumbers: true,
            height: 500,
            allDaySlot: false,
            snapDuration: moment.duration(15, 'minutes'),
			slotDuration: '00:15:00',
            header:{
                left: 'month agendaWeek',
                center: 'title',
                right: 'today prev,next'
            },
            slotEventOverlap: false,
            defaultView: 'agendaWeek',
            visibleRange: {
                start: moment(),
                end: moment().add(30, 'days')
            },
            views: {
                month: {
                    start: moment(),
                    end: moment().add(30, 'days')
                }
            },
            businessHours: {
                dow: [ 1, 2, 3, 4, 5],
                start: '9:00',
                end: '23:00'
            },
            minTime: '09:00:00',
            maxTime: '17:00:00',
            monthNames: calendarLang.en.monthsLong,
            monthNamesShort: calendarLang.en.monthsShort,
            dayNames: calendarLang.en.daysLong,
            dayNamesShort: calendarLang.en.daysShort,
            displayEventTime: true,
            navLinks: true,
            editable: false,
			selectable: true,
            eventDragStop: function(event) {
                var eventId = event.id;
				for(var i = 0; i < $scope.newEvents.length; i++) {
					if($scope.newEvents[i].id === eventId) {
						console.log($scope.newEvents[i]);
						$scope.newEvents.splice(i, 1);
					}
				}
				$scope.newEvents.push(event);
            },
			select: function(start) {
				var newEvent = {
					title: "New event",
					color: "#00cccc",
					textColor: "white",
					start: start,
					end: moment(start).add(30, 'minutes'),
					startEditable: true,
					overlap: false,
					id: newEventId
				}
				newEventId++;
				$scope.newEvents.push(newEvent);
			}
        }
	}
	
	$scope.clearNewEvents = function() {
		$scope.newEvents.splice(0, $scope.newEvents.length);
	}
	
	$scope.addEventsFromCalendar = function() {
		for(var i = 0; i < $scope.newEvents.length; i++) {
			var start = $scope.newEvents[i].start;
			var end = $scope.newEvents[i].end;

			$http({
				method: 'POST',
				url: '/addCalendarItem',
				data: {
					start: start,
					end: end
				}
			})
			.then(function(response) {
				
			}, function(err) { 
				console.log('error: ' + err);
			});
		}
		$scope.clearNewEvents();
		$scope.getEvents();
		
		
	}
	
	function Event(id, start, end, stick) {
		this.id = id;
		this.start = start;
		this.end = end;
		this.stick = stick;
	}
	
	Event.prototype.makeFree = function() {
		this.title = "Not reserved";
		this.color = "#006600";
		this.textColor = 'white';
		this.reserved = false;
	}
	
	Event.prototype.makeReserved = function() {
		this.title = "Reserved";
		this.color = "red";
		this.textColor = 'white';
		this.reserved = true;
	}
	
	$scope.getEvents = function() {
		//var retrievedItems = null;
		
		if($scope.freeEvents.length > 0)
			$scope.freeEvents.splice(0, $scope.freeEvents.length);
		
		if($scope.reservedEvents.length > 0)
			$scope.reservedEvents.splice(0, $scope.reservedEvents.length);
		
		$http({
			method: 'GET',
			url: '/getCalendarItems',
		})
		.then(function(response) {
			if(response.data.items) {
				for(var i = 0; i < response.data.items.length; i++) {
				
					var event = new Event(response.data.items[i]._id, moment(response.data.items[i].start), moment(response.data.items[i].end), true);

					if(response.data.items[i].reservedTo === null) {
						event.makeFree();
					} else if(typeof response.data.items[i].reservedTo === 'string' && response.data.items[i].length > 0) {
						event.makeReserved();
					}
					event.reserved === true ? $scope.reservedEvents.push(event) : $scope.freeEvents.push(event);
				}
			}
		}, function(err) {
			console.log(err);
		});
	}
	
	$scope.getEvents();
	
	$scope.eventSources = [$scope.freeEvents, $scope.reservedEvents, $scope.newEvents];
	
	
	
}])