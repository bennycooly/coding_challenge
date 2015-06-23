angular.module('myApp.controllers', [])

	.controller('LoginCtrl', function ($scope, $timeout, $location, $ionicModal, User, $cookieStore) {

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});

		// Form data for the login modal
		$scope.loginData = {};
		$scope.user = User;

		// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/login.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});

		// Triggered in the login modal to close it
		$scope.closeLogin = function() {
			$scope.modal.hide();
		};

		// Open the login modal
		$scope.login = function() {
			$scope.modal.show();
		};

		// Reopen the login modal and remove credentials
		$scope.logout = function() {
			$cookieStore.put('loggedin',false)
			$scope.modal.show();
		};

		// Perform the login action when the user submits the login form
		$scope.doLogin = function() {
			console.log('Doing login', $scope.loginData);
			// Simulate a login delay. Remove this and replace with your login
			// code if using a login system


			$timeout(function () {
				$scope.closeLogin();
			}, 1000);
			$cookieStore.put('loggedin',true)
		};

		$scope.$on('modal.hidden', function() {
			$location.path('app/home');
		});
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
