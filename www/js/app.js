// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('myApp', ['ionic',
	'myApp.controllers',
	'myApp.directives',
	'ngCordova'])

	.factory('User', function() {
		return {name: "Alec Masterson", id: "am790d", pass: "1234", hours: "4", events: "Empty", interests: ["Empty"], email: "am790d@att.com", phone: "512-992-9117"};
	})

	.run(function ($ionicPlatform, $state, $rootScope, $cordovaNetwork, $ionicLoading, $timeout) {

		$ionicPlatform.ready(function () {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			// display network stuff
			$rootScope.$on('$cordovaNetwork:online', function(event, networkState) {alert('online!');});
			$rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {alert('offline');});
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
			ionic.Platform.isFullScreen = true;
			Parse.initialize("1HS2UnUaotlFPUBxgUCkaTzdIQOIhwxAvGMmBa4c", "mkOcJeWZU7Wo8LCTypT40pJRZuVrEKIYMIwW8NCl");
			$rootScope.sessionUser = Parse.User.current();

		});
		// if user is logged in, then go home. if not, then go to login page
		if ($rootScope.sessionUser) {
			$ionicLoading.show({
				template: '<p>Logging in...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>'
			});
			// get the most updated information (if changed on Parse.com, will not need in actual app deployment)
			Parse.User.current().fetch({});
			$timeout( function() {
				$state.go('app.home', {}, {reload: true});
				$ionicLoading.hide();
			}, 1000);
		}
		else {
			$state.go('login', {}, {reload:true});
		}
	})

	.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
		$stateProvider

			.state('app', {
				url: "/app",
				abstract: true,
				templateUrl: "templates/menu.html",
				controller: 'AppCtrl'
			})

			.state('welcome', {
				url: "/welcome",
				templateUrl: "templates/welcome.html",
				controller: 'WelcomeCtrl'

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
						templateUrl: "templates/home.html",
						controller: 'HomeCtrl'
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

			.state('app.notifications', {
				url: "/settings/notifications",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/notifications_accessibility.html"
					}
				}
			})

			.state('app.edit_profile', {
				url: "/edit_profile",
				views: {
					'menuContent': {
						templateUrl: "templates/edit_profile.html"
					}
				}
			})

			.state('app.help_support', {
				url: "/settings/help_support",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/help_support.html"
					}
				}
			})

			.state('app.about', {
				url: "/settings/about",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/About.html"
					}
				}
			})

			.state('app.faq1', {
				url: "/settings/faqs/faq1",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/faqs/faq1.html"
					}
				}
			})
			.state('app.faq2', {
				url: "/settings/faqs/faq2",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/faqs/faq2.html"
					}
				}
			})
			.state('app.faq3', {
				url: "/settings/faqs/faq3",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/faqs/faq3.html"
					}
				}
			})

			.state('app.faq4', {
				url: "/settings/faqs/faq4",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/faqs/faq4.html"
					}
				}
			})

			.state('app.faq5', {
				url: "/settings/faqs/faq5",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/faqs/faq5.html"
					}
				}
			})

			.state('app.faq6', {
				url: "/settings/faqs/faq6",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/faqs/faq6.html"
					}
				}
			})

			.state('app.faq7', {
				url: "/settings/faqs/faq7",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/faqs/faq7.html"
					}
				}
			})

			.state('app.faq8', {
				url: "/settings/faqs/faq8",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/faqs/faq8.html"
					}
				}
			})

			.state('app.faq9', {
				url: "/settings/faqs/faq9",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/faqs/faq9.html"
					}
				}
			})


			.state('app.other', {
				url: "/settings/faqs/other",
				views: {
					'menuContent': {
						templateUrl: "templates/settings/faqs/other.html"
					}
				}
			});






		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/login');

		$ionicConfigProvider.views.maxCache(0);
	});

