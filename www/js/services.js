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
                var defer = $q.defer();
                Parse.User.current().fetch({
                    success: function(result) {
                        var user = result.attributes;
                        $localStorage.setObject('currentUser', user);
                        defer.resolve();
                    },
                    error: function(obj, error) {
                        alert('error fetching current user');
                        defer.reject(error);
                    }
                });
                return defer.promise;
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

	.factory('$events', function($localStorage, $q, $user) {
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
                    case 'userEvents':
                        events = $localStorage.getObject('userEvents');
                        break;
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
                query.greaterThanOrEqualTo('date', new Date());
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
                var promises = [];
                var Event = Parse.Object.extend('Event');
				var query = new Parse.Query(Event);
                switch (key) {
                    case 'userEvents':
                        $localStorage.remove('userEvents');
                        var userEvents = [];
                        var user = $user.get();
                        if(user.events == '') {
                            defer.resolve();
                            break;
                        }
                        var userEventIDs = user.events.split(', ');
                        for (var i=0; i<userEventIDs.length; i++) {
                            console.log(userEventIDs[i]);
                            promises.push(
                                this.getEvent(userEventIDs[i])
                                    .then(function(result) {
                                        userEvents.push(result);
                                        console.log('inside');
                                    })
                            );
                        }
                        $q.all(promises).then(function(){
                            console.log(userEvents);
                            $localStorage.setObject('userEvents', userEvents);
                            defer.resolve();
                        });
                        break;
                    case 'eventsDateAscending':
                        $localStorage.remove('eventsDateAscending');
                        query.ascending('date');
                        query.greaterThanOrEqualTo('date', new Date());
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
                        $localStorage.remove('events');
                        query.greaterThanOrEqualTo('date', new Date());
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