angular.module('myApp.services', [])

	.factory('Todo',['$http','PARSE_CREDENTIALS',function($http,PARSE_CREDENTIALS) {
		return {
			getAll: function () {
				return $http.get('https://api.parse.com/1/classes/Todo', {
					headers: {
						'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
						'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
					}
				});
			},
			get: function (id) {
				return $http.get('https://api.parse.com/1/classes/Todo/' + id, {
					headers: {
						'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
						'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
					}
				});
			}
		}
	}]);