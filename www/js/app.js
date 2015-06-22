// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('myApp', ['ionic', 'myApp.controllers'])

	.run(function ($ionicPlatform) {
		$ionicPlatform.ready(function () {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
		});
	})

	.config(function ($stateProvider, $urlRouterProvider) {
		$stateProvider

			.state('app', {
				url: "/app",
				abstract: true,
				templateUrl: "templates/menu.html",
				controller: 'LoginCtrl'
			})

			.state('login', {
				url: "/login",
				templateUrl: "templates/login.html",
				controller: 'LoginCtrl'
			})

			.state('app.home', {
				url: "/home",
				views: {
					'menuContent': {
						templateUrl: "templates/home.html"
					}
				}
			})

			.state('app.profile', {
				url: "/profile",
				views: {
					'menuContent': {
						templateUrl: "templates/profile.html"
					}
				}
			})

			.state('app.calendar', {
				url: "/calendar",
				views: {
					'menuContent': {
						templateUrl: "templates/calendar.html"
					}
				}
			})

			.state('app.newsfeed', {
				url: "/newsfeed",
				views: {
					'menuContent': {
						templateUrl: "templates/newsfeed.html",
						controller: 'NewsfeedCtrl'
					}
				}
			})

			.state('app.newsfeed_single', {
				url: "/newsfeed/:newsfeedId",
				views: {
					'menuContent': {
						templateUrl: "templates/newsfeed_single.html",
						controller: 'NewsfeedSingleCtrl'
					}
				}
			})

			.state('app.progress', {
				url: "/progress",
				views: {
					'menuContent': {
						templateUrl: "templates/progress.html"
					}
				}
			})

			.state('app.settings', {
				url: "/settings",
				views: {
					'menuContent': {
						templateUrl: "templates/settings.html"
					}
				}
			})

<<<<<<< HEAD
			.state('app.notifications', {
				url: "/settings/notifications",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/notifications_accessibility.html"
=======
			.state('app.edit_profile', {
				url: "/edit_profile",
				views: {
					'menuContent': {
						templateUrl: "templates/edit_profile.html"
>>>>>>> c64b68a86db7624ded0f22a9d6d302f7c996425a
					}
				}
			});

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/login');
	});
