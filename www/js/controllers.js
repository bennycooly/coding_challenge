angular.module('myApp.controllers', [])

	.controller('AppCtrl', function ($scope, $state, $ionicLoading) {

		$scope.logout = function() {
			console.log('logging out');
			$ionicLoading.show({
				template: '<p>Logging out...</p><ion-spinner></ion-spinner>',
				duration: 2000
			});
			$state.go('login');
		};

	})

	.controller('LoginCtrl', function ($scope, $state, $ionicModal, User, $ionicLoading) {

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});

		// Form data for the login modal
		$scope.loginData = {};
		$scope.user = User;

		$scope.login = function() {
			//check for valid characters
			if ($scope.loginData.username==undefined || $scope.loginData.password==undefined
			|| $scope.loginData.username=="" || $scope.loginData.password==""){
				alert ("Please enter a valid AT&T UID and/or password");
			}
			//log in to home page
			else {
				console.log('logging in', $scope.loginData);
				$ionicLoading.show({
					template: '<p>Logging in...</p><ion-spinner></ion-spinner>',
					duration: 2000
				});
				$scope.clear($scope);
				$state.go('app.home');
			}
		};

		//clear forms after login
		$scope.clear = function($scope) {
			$scope.loginData.username="";
			$scope.loginData.password="";
		}

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
	});
