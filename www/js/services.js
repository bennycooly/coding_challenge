angular.module('myApp.services', [])

	.factory('$localStorage', ['$window', function($window) {
		return {
			set: function(key, value) {
				$window.localStorage[key] = value;
			},
			get: function(key, defaultValue) {
				return $window.localStorage[key] || defaultValue;
			},
			setObject: function(key, value) {
				$window.localStorage[key] = JSON.stringify(value);
			},
			getObject: function(key) {
				return JSON.parse($window.localStorage[key] || '{}');
			},
			remove: function(key) {
				$window.localStorage.removeItem(key)
			}
		}
	}])

	.factory('$user', function($localStorage) {
		var currentUser = $localStorage.getObject('currentUser');
		return {
			get: function(key) {
				currentUser = $localStorage.getObject('currentUser');
				if (key) {
					return currentUser[key];
				}
				else {
					return currentUser;
				}
			},
			updateLocalStorage: function() {
				console.log('updating localstorage from parse');
				$localStorage.setObject('currentUser', {
					firstName: Parse.User.current().get('firstName'),
					lastName: Parse.User.current().get('lastName'),
					email: Parse.User.current().get('email'),
					phone: Parse.User.current().get('phone'),
					interests: Parse.User.current().get('interests'),
					hours: Parse.User.current().get('hours')
				});
				currentUser = $localStorage.getObject('currentUser');
				console.log(currentUser.firstName);
			},
			updateParse: function() {
				/*Parse.User.current().set('firstName', this.firstName);
				 Parse.User.current().set('lastName', this.lastName);*/
				Parse.User.current().set('email', $localStorage.get('email'));
				Parse.User.current().set('phone', $localStorage.get('phone'));
				Parse.User.current().set('interests', $localStorage.get('interests'));
			},
			logout: function() {
				console.log('removing user from local storage');
				$localStorage.remove('currentUser');
			}
		}
	})

	.factory('$events', function($localStorage) {
		return {
			get: function(key) {
                var events;
				switch (key) {
					case 'eventsDateAscending':
						events = $localStorage.getObject('eventsDateAscending');
						break;
					default:
						events = $localStorage.getObject('events');
						break;
				}
				return events;
			},
			updateLocalStorage: function() {
				var query = new Parse.Query('Event');
                query.find( {
                    success: function (events) {
                        $localStorage.setObject('events', events);
                    },
                    error: function (error) {
                        alert('Error: ' + error.code + ' ' + error.message);
                    }
                });
                // get dates ascending
                query = new Parse.Query('Event');
                query.ascending('date');
                query.find( {
                    success: function (eventsDateAscending) {
                        $localStorage.setObject('eventsDateAscending', eventsDateAscending);
                        console.log($localStorage.getObject('eventsDateAscending'));
                        console.log(eventsDateAscending);
                    },
                    error: function (error) {
                        alert('Error: ' + error.code + ' ' + error.message);
                    }
                });

			}
		}
	})

	.factory('$newsfeed', function($localStorage) {
		var newsfeed = $localStorage.getObject('newsfeed');
	});