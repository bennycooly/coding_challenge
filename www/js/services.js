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
			}
		}
	}])

	.factory('$user', function($localStorage) {
		var currentUser = $localStorage.getObject('currentUser');
		return {
			firstName: currentUser.firstName,
			lastName: currentUser.lastName,
			email: currentUser.email,
			phone: currentUser.phone,
			interests: currentUser.interests,
			hours: currentUser.hours,
			updateLocalStorage: function() {
				$localStorage.setObject('currentUser', {
					firstName: Parse.User.current().get('firstName'),
					lastName: Parse.User.current().get('lastName'),
					email: Parse.User.current().get('email'),
					phone: Parse.User.current().get('phone'),
					interests: Parse.User.current().get('interests'),
					hours: Parse.User.current().get('hours')
				});
			},
			updateParse: function() {
				/*Parse.User.current().set('firstName', this.firstName);
				Parse.User.current().set('lastName', this.lastName);*/
				Parse.User.current().set('email', this.email);
				Parse.User.current().set('phone', this.phone);
				Parse.User.current().set('interests', this.interests);
			}
		}
	})

	.factory('$events', function($localStorage) {
		var currentEvents = $localStorage.getObject('currentEvents');
		return {
			event1: currentEvents[0]
		}
	});