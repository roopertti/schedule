var app = angular.module('app', ['ui.calendar'])

.service('dates', function() {
	var self = this;
	
	this.f = {
		full: "DD.MM.YYYY HH:mm Z",
		dateOnly: "DD.MM.YYYY",
		timeOnly: "HH:mm"
	}
	
	this.validateInput = function(str, format) {
		return moment(str, format, true).isValid();
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
		
		if(	
			dates.validateInput(date, dates.f.dateOnly) &&
			dates.validateInput(start, dates.f.timeOnly) &&
			dates.validateInput(end, dates.f.timeOnly)
		) 
		{
			var startStr = date + " " + start + " +0300";
			var endStr = date + " " + end + " +0300";

			if(	
				dates.validateInput(startStr, dates.f.full) &&
				dates.validateInput(endStr, dates.f.full)
			) 
			{
				var start = dates.parseFullStrToMoment(startStr);
				var end = dates.parseFullStrToMoment(endStr);
				
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
            eventDrop: function(event) {
                console.log(event);
            }
        }
	}
	
	$scope.getEvents = function() {
		var retrievedItems = null;
		
		if($scope.freeEvents.length > 0)
			$scope.freeEvents.splice(0, $scope.freeEvents.length);
		
		if($scope.reservedEvents.length > 0)
			$scope.reservedEvents.splice(0, $scope.reservedEvents.length);
		
		$http({
			method: 'GET',
			url: '/getCalendarItems',
		})
		.then(function(response) {
			console.log(response);
			
			response.data.items.forEach(function(item) {
				var event;
				
				if(item.reservedTo === null) {
					event = {
						title: "Free",
						color: 'green',
						textColor: 'white',
						reserved: false
					}
				} else if(typeof item.reservedTo === 'string' && item.length > 0) {
					event = {
						title: "Reserved",
						color: 'red',
						textColor: 'white',
						reserved: true
					}
				}
				event.id = item._id;
				event.start = moment(item.start);
				event.end = moment(item.end);
				event.stick = true;
				
				event.reserved === true ? $scope.reservedEvents.push(event) : $scope.freeEvents.push(event);
			});
			
		}, function(err) {
			console.log(err);
		});
	}
	
	$scope.getEvents();
	
	$scope.eventSources = [$scope.freeEvents, $scope.reservedEvents];
	
	
	
}]);