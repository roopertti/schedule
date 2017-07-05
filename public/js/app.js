var app = angular.module('app', ['ui.calendar'])

.controller('ctrl', ['$scope', '$http', function($scope, $http) {
	
	$scope.freeEvents = [];
	$scope.reservedEvents = [];
	
	var calendarLang = {
        fi: {
            monthsLong: ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu',
            'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'],
            monthsShort: ['Tam', 'Hel', 'Maa', 'Huh', 'Tou', 'Kes',
            'Hei', 'Elo', 'Syy', 'Lok', 'Mar', 'Jou'],
            daysLong: ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko',
            'Torstai', 'Perjantai', 'Lauantai'],
            daysShort: ['Su' ,'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La']
        }
    };
	
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
                left: 'month agendaWeek basicWeek',
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
            monthNames: calendarLang.fi.monthsLong,
            monthNamesShort: calendarLang.fi.monthsShort,
            dayNames: calendarLang.fi.daysLong,
            dayNamesShort: calendarLang.fi.daysShort,
            displayEventTime: true,
            navLinks: true,
            editable: false,
            eventDrop: function(event) {
                console.log(event);
            }
        }
	}
	
	$scope.eventSources = [$scope.freeEvents, $scope.reservedEvents];
	
}]);