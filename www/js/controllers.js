angular.module('myApp.controllers', [])

	.controller('AppCtrl', function ($scope, $state, $ionicLoading, $timeout) {

		$scope.logout = function() {
			console.log('logging out');
			Parse.User.logOut();
			$ionicLoading.show({
				template: '<p>Logging out...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>'
			});
			$timeout( function() {
				$state.go('login', {}, {reload: true});
				$ionicLoading.hide();
			}, 1000);
		};

	})

	.controller('LoginCtrl', function ($scope, $state, $rootScope, $ionicPopup, $ionicLoading, $timeout) {

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});

		// Form data for the login modal
		$scope.loginData = {};


		$scope.login = function() {
			// UNCOMMENT this line when deploying to device. Hides the keyboard on submit
			// cordova.plugins.Keyboard.close();
			var username = $scope.loginData.username;
			var password = $scope.loginData.password;
			//check for valid characters
			if ($scope.checkEmpty(username, password)){
				$ionicPopup.alert({
					title: 'Please enter a valid AT&T UID and/or password'
				});
			}
			//log in to home page
			else {
				console.log('logging in', $scope.loginData);
				$ionicLoading.show({
					template: '<p>Logging in...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>'
				});
				$scope.checkCredentials(username,password);
			}
		};

		$scope.checkEmpty = function(username, password) {
			if (username==undefined || password==undefined ||
				username=="" || password=="") {
				console.log(username, password);
				return true;
			}
			else {return false;}
		};

		//clear forms after login
		$scope.clear = function(password) {
			if (password!='password') {$scope.loginData.username="";}
			$scope.loginData.password="";
		};

		//checks the credentials and logs you in/out
		$scope.checkCredentials = function(username, password) {
			Parse.User.logIn(username, password, {
				success: function(user) {
					console.log('success!');
					$rootScope.user = user;
					$rootScope.isLoggedIn = true;
					$scope.clear();
					$state.go('app.home', {clear: true}, {refresh: true});
					$scope.hideLogin();
				},
				error: function(user, error) {
					$scope.clear('password');
					$scope.hideLogin();
					$ionicPopup.alert({
						title: 'Incorrect ATT UID and/or password. Please try again.'
					});
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

		$scope.zoom = function() {

		};

		$scope.closeKeyboard = function() {
			var keyboard = cordova.plugins.Keyboard;
			keyboard.close();
		};
	})

	.controller('NewsfeedCtrl', function ($scope) {
		$scope.newsfeed = [
			{title: 'Newsfeed 1', id: 1},
			{title: 'Newsfeed 2', id: 2},
			{title: 'Newsfeed 3', id: 3},
			{title: 'Newsfeed 4', id: 4},
			{title: 'Newsfeed 5', id: 5},
			{title: 'Newsfeed 6', id: 6}
		];
	})

	.controller('NewsfeedSingleCtrl', function ($scope, $stateParams) {
	})

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
		$scope.info = {interests: angular.copy($scope.interestsString), email: angular.copy($scope.email), phone: angular.copy($scope.phone)}

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

	.controller('EventCtrl', function($scope) {
		$scope.info = {name: "", description: "", location: "", date: "", startTime: "", endTime: ""};
		$scope.owner = Parse.User.current().get('username');

		$scope.createEvent = function() {
			var EventClass = Parse.Object.extend("Event");
			var event = new EventClass();
			event.set("owner", $scope.owner);
			event.set("description", $scope.info.description);
			event.set("location", $scope.info.location);
			event.set("date", $scope.info.date);
			event.set("startTime", $scope.info.startTime);
			event.set("endTime", $scope.info.endTime);
			event.save(null,{
				success:function(person) { alert("Created!") }
			});
		};
	})

	.controller('HomeCtrl', function($scope) {
		$scope.firstName = Parse.User.current().get('firstName');
	});