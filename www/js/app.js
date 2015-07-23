// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('myApp', ['ionic',
	'myApp.controllers',
	'myApp.directives',
	'ngCordova',
	'tabSlideBox',
    'uiGmapgoogle-maps',
    'ionMdInput',
	'chart.js'])

	.run(function ($ionicPlatform, $state, $rootScope, $cordovaNetwork, $ionicLoading, $timeout) {

		$ionicPlatform.ready(function () {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			// display network stuff
			/*$rootScope.$on('$cordovaNetwork:online', function(event, networkState) {alert('online!');});
			$rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {alert('offline');});*/
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
			ionic.Platform.isFullScreen = true;
			if (navigator.splashscreen) {
				$timeout (function () {
					navigator.splashscreen.hide();
					console.log('hiding splash screen');
				}, 1000);
			}
			// if user is logged in, then go home. if not, then go to login page

			// $state.go('login');
		});

        $ionicPlatform.registerBackButtonAction(function () {
            if ($state=='app.home') {
                navigator.app.exitApp();
            } else {

            }
        }, 100);

		Parse.initialize("1HS2UnUaotlFPUBxgUCkaTzdIQOIhwxAvGMmBa4c", "mkOcJeWZU7Wo8LCTypT40pJRZuVrEKIYMIwW8NCl");

	})

	.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, uiGmapGoogleMapApiProvider) {
		$stateProvider

			.state('app', {
				url: "/app",
				abstract: true,
				templateUrl: "templates/menu.html",
				controller: 'AppCtrl'
			})

			.state('showtutorial', {
				url: "/showtutorial",
				templateUrl: "templates/showtutorial.html",
				controller: 'TutorialCtrl'

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

			.state('app.search', {
				url: "/search",
				views: {
					'menuContent': {
						templateUrl: "templates/search.html",
						controller: 'SearchCtrl'
					}
				}
			})

            .state('app.links', {
                url: "/links",
                views: {
                    'menuContent': {
                        templateUrl: "templates/links.html",
                        controller: 'LinksCtrl'
                    }
                }
            })

			.state('app.profile', {
				url: "/profile",
				cache: false,
				views: {
					'menuContent': {
						templateUrl: "templates/profile.html",
						controller: "ProfileCtrl"
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

			.state('app.calendarSingle', {
				controller: "EventListCtrl",
				params: {'theMonth': null, 'theYear': null, 'theDay': null, 'monthInd': null},
				views: {
					'menuContent': {
						templateUrl: "templates/eventList.html"

					}
				}
			})

			.state('app.newsfeed', {
				url: "/newsfeed",
				views: {
					'menuContent': {
						templateUrl: "templates/newsfeed.html",
					}
				}
			})

			.state('app.newsfeed_single', {
				url: "/newsfeed/newsfeed_single",
				views: {
					'menuContent': {
						templateUrl: "templates/newsfeed_single.html",
						controller: 'NewsSingleCtrl'
					}
				}
			})

			.state('app.settings', {
				url: "/settings",
				views: {
					'menuContent': {
						templateUrl: "templates/settings.html",
                        controller: 'SettingsCtrl'
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

			.state('app.create_event', {
				url: '/create_event',
				views: {
					'menuContent': {
						templateUrl: "templates/create_event.html"
					}
				}
			})

            .state('app.edit_event', {
                url: '/edit_event',
                views: {
                    'menuContent': {
                        templateUrl: "templates/edit_event.html",
                        controller: "EditEventCtrl"
                    }
                }
            })

			.state('app.create_fund', {
				url: '/create_fund',
				views: {
					'menuContent': {
						templateUrl: "templates/create_fund.html"
					}
				}
			})

            .state('app.edit_fund', {
                url: '/edit_fund',
                views: {
                    'menuContent': {
                        templateUrl: "templates/edit_fund.html",
                        controller: "EditFundCtrl"
                    }
                }
            })

			.state('app.event', {
				url: '//newsfeed/event',
				params: {param:null},
				views: {
					'menuContent': {
						templateUrl: "templates/event.html",
						controller: 'EventCtrl'
					}
				}
			})

			.state('app.fund', {
				url: '/fund',
				params: {param:null},
				views: {
					'menuContent': {
						templateUrl: "templates/fundraiser.html"
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

        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyCfGPsnvI5R4S6dQpWvKbK-8j-ErV-D65M',
            v: '3.19',
            libraries: 'weather,geometry,visualization'
        });
	});
