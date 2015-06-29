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

	.controller('LoginCtrl', function ($scope, $state, $rootScope, $ionicPopup, User, $ionicLoading, $timeout) {

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});


		// Form data for the login modal
		$scope.loginData = {};
		$scope.user = User;


		//focus on username input when login page loads
		$scope.input = 'username';

		$scope.login = function() {
			// UNCOMMENT this line when deploying to device. Hides the keyboard on submit
			// cordova.plugins.Keyboard.close();
			var username = $scope.loginData.username;
			var password = $scope.loginData.password;
			//check for valid characters
			if ($scope.checkEmpty(username, password)){
				$scope.showInvalid('Please enter a valid AT&T UID and/or password.');
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
				$scope.checkCredentials(username.toLowerCase(), password, networkErrorMessage);
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
		$scope.checkCredentials = function(username, password, networkErrorMessage) {
			Parse.User.logIn(username, password, {
				success: function(user) {
					$timeout.cancel(networkErrorMessage);
					console.log('success!');
					$rootScope.user = user;
					$rootScope.isLoggedIn = true;
					$scope.clear();
					$state.go('app.home', {clear: true}, {refresh: true});
					$scope.hideLogin();
				},
				error: function(user, error) {
					$timeout.cancel(networkErrorMessage);
					$scope.clear('password');
					$scope.hideLogin();
					$scope.showInvalid('Incorrect AT&T UID and/or password. Please check your credentials and try again.');
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

		$scope.showInvalid = function(message) {
			var alert = $ionicPopup.alert({
				title: message
			});
			$scope.input = '';
			alert.then(function(res) {
				$scope.input = 'password';
				console.log('yes!');
			})
		}

	})

	.controller('WelcomeCtrl', function($state, $timeout, $ionicLoading) {
		$timeout( function() {
			$state.go('login', {}, {reload: true});
			$ionicLoading.hide();
		}, 1000);
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

	// This controller handles editting the user's profile
	.controller('ProfileCtrl', function($scope, $http, User) {
		$scope.pass = {first: "", second: "", update: false};
		$scope.user = User;
		$scope.info = {name: angular.copy(User.name), interests: angular.copy(User.interests), email: angular.copy(User.email), phone: angular.copy(User.phone)};

		// Once you click the save button
		$scope.saveProfileChanges = function() {
			if ($scope.pass.first != "" && $scope.pass.first == $scope.pass.second) {
				$scope.pass.update = true;
				alert("New Password: "+$scope.pass.first+"\n");
			}
			alert("Interests: "+$scope.info.interests+"\nEmail: "+$scope.info.email+"\nPhone: "+$scope.info.phone);

			// Upon successful http call, update $scope.user

			$scope.pass = {first: "", second: "", update: false};
		};
	})

	.controller('HomeCtrl', function($scope) {
		$scope.firstName = Parse.User.current().get('firstName');
	});
