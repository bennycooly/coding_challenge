angular.module('myApp.controllers', ['myApp.services'])

	.controller('AppCtrl', function ($scope, $state, $ionicLoading, $timeout) {

		$scope.logout = function() {
			console.log('logging out');
			Parse.User.logOut();
			$ionicLoading.show({
				template: '<p>Logging out...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>'
			});
			$timeout( function() {
				$state.go('login', {}, {reload: true});
			}, 1000);
		};

	})

	.controller('WelcomeCtrl', function($state) {
		$state.go('login', {}, {reload: true});
	})

	.controller('LoginCtrl', function ($scope, $state, $rootScope, $ionicPopup, User, $ionicLoading, $timeout) {

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});

		$scope.init = function() {
			// Form data for the login modal
			$scope.loginData = {};
			$scope.user = User;

			// log in the user automatically if he's already logged on
			var currentUser = Parse.User.current();
			if (currentUser) {
				$timeout( function() {
					$scope.loginData.username = currentUser.get('username');
					$scope.loginData.password = 'password';
					$timeout( function() {
						$ionicLoading.show({
							template: '<p>Logging in...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>'
						});
					}, 500);
					Parse.User.current().fetch({});
					$timeout( function() {
						$state.go('app.home', {}, {reload: true});
					}, 3000);
				}, 2500);
				// get the most updated information (if changed on Parse.com, will not need in actual app deployment)

			}
			// continue to login page
			else {
				// close logout load if applicable
				$timeout( function() {
					$ionicLoading.hide();
				}, 1000);
				// focus if needed...don't really need this though
				/*$timeout( function() {
					$scope.input = 'username';
				}, 2900);*/
				// now proceed to the login page
			}

		};
		$scope.init();

		//focus on username input when login page loads


		$scope.login = function() {
			// UNCOMMENT this line when deploying to device. Hides the keyboard on submit
			// cordova.plugins.Keyboard.close();
			var username = $scope.loginData.username;
			var password = $scope.loginData.password;
			//check for valid characters
			var empty = $scope.checkEmpty(username, password);
			if (empty == 'username'){
				$scope.showInvalid('Please enter a valid AT&T UID and/or password.', 'username');
			}
			else if (empty == 'password'){
				$scope.showInvalid('Please enter a valid AT&T UID and/or password.', 'password');
			}
			//log in to home page
			else {
				console.log('logging in', $scope.loginData);
				$scope.showLogin();
				//timeout after 10 seconds if server is not responding
				var networkErrorMessage = $timeout( function () {
					$scope.hideLogin();
					$scope.showInvalid('Please check your network connection and try again.');
					$state.go($state.current);
				}, 10000);
				//check credentials of login
				$scope.checkCredentials(username.toLowerCase(), password, networkErrorMessage);
			}
		};

		$scope.checkEmpty = function(username, password) {
			if (username==undefined || username=="") {
				return 'username';
			}
			else if (password==undefined || password=="") {
				return 'password';
			}
			else {return false;}
		};

		//clear forms after login
		$scope.clear = function(password) {
			if (password!='password') {$scope.loginData.username="";}
			$scope.loginData.password="";
		};

		//checks the credentials and logs you in/out
		$scope.checkCredentials = function(username, password, networkErrorMessage) {
			Parse.User.logIn(username, password, {
				success: function(user) {
					$timeout.cancel(networkErrorMessage);
					console.log('success!');
					/*$rootScope.user = user;
					$rootScope.isLoggedIn = true;*/
					$scope.clear();
					$state.go('app.home', {clear: true}, {refresh: true});
					//$scope.hideLogin();
				},
				error: function(user, error) {
					$timeout.cancel(networkErrorMessage);
					$scope.clear('password');
					$scope.hideLogin();
					$scope.showInvalid('Incorrect AT&T UID and/or password. Please check your credentials and try again.', 'password');
				}
			});
		};

		$scope.showLogin = function() {
			$ionicLoading.show({
				template: '<p>Logging in...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>'
			});
		};

		$scope.hideLogin = function() {
			$ionicLoading.hide();
		};

		$scope.showInvalid = function(message, focusKey) {
			var alert = $ionicPopup.alert({
				title: message
			});
			$scope.input = '';
			alert.then(function(res) {
				console.log(focusKey + ' is empty');
				if (focusKey == 'username') {
					$scope.input = 'username';
				}
				else if (focusKey == 'password') {
					$scope.input = 'password';
				}
			})
		}

	})

	.controller('HomeCtrl', function($scope, $ionicLoading, $timeout, $localStorage, $user, $events) {
		$scope.init = function() {
			$user.updateLocalStorage();
			console.log($user.firstName);
			var currentEvents = Parse.Object.extend('Event');
			var query = new Parse.Query('Event');
			query.find( {
				success: function (events) {
					$localStorage.setObject('currentEvents', events);
				},
				error: function (error) {
					alert('Error: ' + error.code + ' ' + error.message);
				}
			});
			var currentEvents = $localStorage.getObject('currentEvents');
			console.log($events.event1);

			$scope.firstName = $user.firstName;
			$timeout( function() {
				$ionicLoading.hide();
			}, 1000);
		};
		$scope.init();

		$scope.toggleMenu = function() {
			document.querySelector('.menu-button').onclick = function(e) {
				e.preventDefault();
				document.querySelector('.circle').classList.toggle('open');
			};
			var items = document.querySelectorAll('.circle a');
			for(var i = 0, l = items.length; i < l; i++) {
				items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
				items[i].style.top = (50 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
			}
		};


	})

	// This controller handles editting the user's profile
	.controller('ProfileCtrl', function($scope) {
		$scope.id = Parse.User.current().get('username');
		$scope.fullName = Parse.User.current().get('firstName')+" "+Parse.User.current().get('lastName');
		$scope.email = Parse.User.current().get('email');
		$scope.phone = Parse.User.current().get('phone');
		$scope.interestsString = Parse.User.current().get('interests');
		$scope.interests = $scope.interestsString.split(", ");
		$scope.recentString = Parse.User.current().get('recent');
		$scope.recent = $scope.recentString.split(", ");
		$scope.hours = Parse.User.current().get('hours');

		$scope.pass = {first: "", second: "", update: false};
		$scope.info = {interests: angular.copy($scope.interestsString), email: angular.copy($scope.email), phone: angular.copy($scope.phone)};

		// Once you click the save button
		$scope.saveProfileChanges = function() {
			if ($scope.pass.first != "" && $scope.pass.first == $scope.pass.second) {
				$scope.pass.update = true;
				Parse.User.current().set("password", $scope.pass.first);
			}

			Parse.User.current().set("interests", $scope.info.interests);
			Parse.User.current().set("email", $scope.info.email);
			Parse.User.current().set("phone", $scope.info.phone);
			Parse.User.current().save();
			alert("Saved");

			$scope.pass = {first: "", second: "", update: false};
		};
	})

	.controller('NewsCtrl', function($scope, $state) {

		$scope.news = [];

		var newsClass = Parse.Object.extend("News");
		var query = new Parse.Query(newsClass);

		query.find({
			success: function(results) {
				for (var i=0; i<results.length; i++) {
					var newNews = {text: results[i].get("text"), owner: results[i].get("owner"), id: "1"};
					$scope.news.push(newNews);
				}
			}
		});

		$scope.clicked = function() {
			$state.go("app.newsfeed_single", {param:{id: "1"}});
		};
	})

	.controller('NewsSingleCtrl', function ($scope, $stateParams) {
		alert($stateParams.param.id);
	})

	.controller('CreateEventCtrl', function($scope) {
		$scope.info = {owner: "", name: "", description: "", location: "", date: "", startTime: "", endTime: "", url: "", error: false};
		$scope.creator = Parse.User.current().get('username');

		$scope.createEvent = function() {

			if ($scope.info.name == "" || $scope.info.description == "" || $scope.info.location == "" || $scope.info.date == "" || $scope.info.startTime == "" || $scope.info.endTime == "") {
				$scope.info.error = true;
				return;
			}
			$scope.info.error = false;

			var EventClass = Parse.Object.extend("Event");
			var event = new EventClass();
			event.set("owner", $scope.creator);
			event.set("description", $scope.info.description);
			event.set("location", $scope.info.location);
			event.set("date", $scope.info.date);
			event.set("startTime", $scope.info.startTime);
			event.set("endTime", $scope.info.endTime);
			event.set("url", $scope.info.url);
			event.save(null,{
				success:function(result) {
					alert("Created!");
					var NewsClass = Parse.Object.extend("News");
					var news = new NewsClass();
					news.set("text", "New Event: "+$scope.info.name);
					news.set("owner", $scope.creator);
					news.save(null, { success:function(result) { alert("Added to NewsFeed"); }});
				}
			});
		};
	});


