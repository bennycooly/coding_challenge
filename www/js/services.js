angular.module('myApp.services',[])
	.factory('User',['$http','PARSE_CREDENTIALS',function($http, PARSE_CREDENTIALS){
		return {
			getUser:function(id){
				return $http.get('https://api.parse.com/1/users/'+id,{
					headers:{
						'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
						'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY
					}
				});
			},
			/* returns JSON: {
				"username": "cooldude6",
				"phone": "415-392-0202",
				"createdAt": "2011-11-07T20:58:34.448Z",
				"updatedAt": "2011-11-07T20:58:34.448Z",
				"objectId": "g7y9tkhB7O"
				"email":
				etc... WILL GIVE YOU ALL USER FIELDS
			}*/

			getCurrentUser:function(sessionToken){
				return $http.get('https://api.parse.com/1/users/me',{
					headers:{
						'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
						'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
						'X-Parse-Session-Token': sessionToken
					}
				});
			},
			/* returns JSON if failed, otherwise returns same JSON as above getUser: {
				"code": 209,
				"error": "invalid session token"
			}*/

			updateUser:function(sessionToken, id, data){
				return $http.put('https://api.parse.com/1/users/'+id, data, {
					headers:{
						'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
						'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
						'X-Parse-Session-Token': sessionToken,
						'Content-Type': 'application/json'
					}
				});
			},
			/* returns JSON: {
			 "updatedAt": "2011-11-07T21:25:10.623Z"
			 }*/

			create:function(data){
				return $http.post('https://api.parse.com/1/classes/User', data,{
					headers:{
						'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
						'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
						'Content-Type': 'application/json'
					}
				});
			},


			edit:function(id, data){
				return $http.put('https://api.parse.com/1/classes/User/'+id, data,{
					headers:{
						'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
						'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
						'Content-Type': 'application/json'
					}
				});
			},
			delete:function(id){
				return $http.delete('https://api.parse.com/1/classes/User/'+id,{
					headers:{
						'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
						'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
						'Content-Type': 'application/json'
					}
				});
			},
			login:function(){
				return $http.get('https://api.parse.com/1/login',{
					headers:{
						'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
						'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
						'X-Parse-Revocable-Session': 1
					}
				});
			},
			/* returns JSON: {
				"username": "cooldude6",
				"phone": "415-392-0202",
				"createdAt": "2011-11-07T20:58:34.448Z",
				"updatedAt": "2011-11-07T20:58:34.448Z",
				"objectId": "g7y9tkhB7O",
				"sessionToken": "r:pnktnjyb996sj4p156gjtp4im"
			}*/

			logout:function(){
				return $http.post('https://api.parse.com/1/logout',{
					headers:{
						'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
						'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
						'Content-Type':'application/json'
					}
				});
			}
		}
	}])

	.constant('PARSE_CREDENTIALS',{
		APP_ID: '1HS2UnUaotlFPUBxgUCkaTzdIQOIhwxAvGMmBa4c',
		REST_API_KEY:'X0GB7TuaryiCz7IbvGIfaHzqFauPUs3mVIFjugkK'
	});