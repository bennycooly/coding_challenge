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

	.factory('$user', function($localStorage, $q) {
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
					hours: Parse.User.current().get('hours'),
                    events: Parse.User.current().get('events')
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

	.factory('$events', function($localStorage, $q) {
		return {
            sortDateAscending: function(events) {
                events.sort( function(a, b){
                    return new Date(a.date) - new Date(b.date);
                });
                return events;
            },
			getLS: function(key) {
                var events = [];
				switch (key) {
					case 'eventsDateAscending':
						var originalEvents = $localStorage.getObject('eventsDateAscending');
						for (var i=0; i<originalEvents.length; i++) {
							if (originalEvents[i].type != "Fund") events.push(originalEvents[i]);
						}
						break;
					default:
						var originalEvents = $localStorage.getObject('events');
						for (var i=0; i<originalEvents.length; i++) {
							if (originalEvents[i].type != "Fund") events.push(originalEvents[i]);
						}
						break;
				}
				return events;
			},
			getFund: function(key) {
				var events = [];
				switch (key) {
					case 'eventsDateAscending':
						var originalEvents = $localStorage.getObject('eventsDateAscending');
						for (var i=0; i<originalEvents.length; i++) {
							if (originalEvents[i].type == "Fund") events.push(originalEvents[i]);
						}
						break;
					default:
						var originalEvents = $localStorage.getObject('events');
						for (var i=0; i<originalEvents.length; i++) {
							if (originalEvents[i].type == "Fund") events.push(originalEvents[i]);
						}
						break;
				}
				return events;
			},
            getEvent: function(eventID) {
                var defer = $q.defer();
                var Event = Parse.Object.extend('Event');
                var query = new Parse.Query(Event);
                query.ascending('date');
                query.equalTo('objectId', eventID);
                query.get( eventID, {
                    success: function(result) {
                        defer.resolve(result.attributes);
                    },
                    error: function(object, error) {
                        defer.reject(error);
                    }
                });
                return defer.promise;
            },
			updateLocalStorage: function(key) {
                var defer = $q.defer();
                var Event = Parse.Object.extend('Event');
				var query = new Parse.Query('Event');
                switch (key) {
                    case 'eventsDateAscending':
                        query.ascending('date');
                        query.find( {
                            success: function (result) {
                                $localStorage.setObject('eventsDateAscending', result);
                                defer.resolve(result);
                            },
                            error: function (error) {
                                defer.reject(error);
                            }
                        });
                        break;
                    default:
                        query.find( {
                            success: function (result) {
                                $localStorage.setObject('events', result);
                                defer.resolve(result);
                            },
                            error: function (error) {
                                alert('Error: ' + error.code + ' ' + error.message);
                                defer.reject(error);
                            }
                        });
                        break;
                }
                return defer.promise;

			}
		}
	})

	.factory('$newsfeed', function($localStorage) {
		var newsfeed = $localStorage.getObject('newsfeed');
	});