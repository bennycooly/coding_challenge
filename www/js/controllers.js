angular.module('myApp.controllers', ['myApp.services'])

	.controller('AppCtrl', function ($scope, $state, $ionicLoading, $timeout, $user, $ionicHistory, $localStorage) {
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.fadeOut = false;
        });
		$scope.logout = function() {
			console.log('logging out');
			$user.logout();
			console.log($user.firstName);
			Parse.User.logOut();
			$ionicLoading.show({
				template: '<p>Logging out...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>',
				animation: 'fade-in'
			});
            $scope.fadeOut = true;
			$timeout( function() {
				$state.go('login', {clear: true}, {reload: true});
			}, 1000);
		};

		$scope.goHome = function() {
			console.log($state.current.name);
			if ($state.current.name != 'app.home') {
				$timeout( function() {
                    $ionicLoading.show({
                        template: '<p>Loading...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>',
                        animation: 'fade-in'
                    });
                    $localStorage.set('leftSearchModal', 'false');
					$ionicHistory.nextViewOptions({
						disableBack: true,
						disableAnimate: true
					});
					$state.go('app.home');
				}, 0);

			}
		};

		$scope.goProfile = function() {
			console.log($state.current.name);
			if ($state.current.name != 'app.profile') {
				$timeout( function() {
					$ionicHistory.nextViewOptions({
						disableBack: true,
						disableAnimate: true
					});
					$state.go('app.profile');
				}, 0);

			}
		};

		$scope.goCalendar = function() {
			console.log($state.current.name);
			if ($state.current.name != 'app.calendar') {
				$timeout( function() {
					$ionicHistory.nextViewOptions({
						disableBack: true,
						disableAnimate: true
					});
					$state.go('app.calendar');
				}, 0);

			}
		};

		$scope.goFund = function() {
			console.log($state.current.name);
			if ($state.current.name != 'app.create_fund') {
				$timeout( function() {
					$ionicHistory.nextViewOptions({
						disableBack: true,
						disableAnimate: true
					});
					$state.go('app.create_fund');
				}, 0);

			}
		};

		$scope.goSettings = function() {
			console.log($state.current.name);
			if ($state.current.name != 'app.settings') {
				$timeout( function() {
					$ionicHistory.nextViewOptions({
						disableBack: true,
						disableAnimate: true
					});
					$state.go('app.settings');
				}, 0);

			}
		};

	})

	.controller('WelcomeCtrl', function($state) {
		$state.go('login', {}, {reload: true});
	})

	.controller('LoginCtrl', function ($scope, $state, $rootScope, $ionicPopup, $ionicLoading, $timeout, $user, $ionicHistory, $localStorage) {

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});
		$scope.$on('$ionicView.beforeEnter', function() {
			// Form data for the login modal
			$scope.loginData = {};
            $scope.fadeOut = false;
			// log in the user automatically if he's already logged on
			var currentUser = Parse.User.current();
			if (currentUser) {
				$timeout( function() {
					$scope.loginData.username = currentUser.get('username');
					$scope.loginData.password = 'password';
					$timeout( function() {
						$ionicLoading.show({
							template: '<p>Logging in...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>',
							animation: 'fade-in'
						});
					}, 500);
					Parse.User.current().fetch({});
                    $timeout( function() {
                        $scope.fadeOut = true;
                    }, 1500);
					$timeout( function() {
                        $localStorage.set('fromLogin', 'true');
						$state.go('app.home');
					}, 2000);
				}, 3500);
				// get the most updated information (if changed on Parse.com, will not need in actual app deployment)

			}
			// continue to login page
			else {
				// close logout load if applicable
				$timeout( function() {
					$ionicLoading.hide();
				}, 2000);
				// focus if needed...don't really need this though
				/*$timeout( function() {
				 $scope.input = 'username';
				 }, 2900);*/
				// now proceed to the login page
			}
		});

		$scope.login = function() {
			// UNCOMMENT this line when deploying to device. Hides the keyboard on submit
			if (ionic.Platform.isWebView()) cordova.plugins.Keyboard.close();
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
			if (password != 'password') {$scope.loginData.username="";}
			$scope.loginData.password="";
		};

		//checks the credentials and logs you in/out
		$scope.checkCredentials = function(username, password, networkErrorMessage) {
			Parse.User.logIn(username, password, {
				success: function(user) {
					$timeout.cancel(networkErrorMessage);
                    // need these 2 lines of code for animation to work
                    $scope.hideLogin();
                    $scope.showLogin();
                    // animate out
                    $scope.fadeOut = true;

                    $localStorage.set('fromLogin', 'true');
                    $ionicHistory.nextViewOptions({
                        disableBack: true,
                        disableAnimate: true
                    });
                    $scope.clear();
                    $timeout( function() {
                        if(Parse.User.current().get('firstTime')) {
                            Parse.User.current().set('firstTime', false);
                            Parse.User.current().save(null, {
                                success: function() {
                                    $state.go('showtutorial');
                                }
                            });

                            //$state.go('app.home');
                        }
                        else {
                            $state.go('app.home');
                        }
                    },500);

					//$scope.hideLogin();
				},
				error: function(user, error) {
					$timeout.cancel(networkErrorMessage);
					$scope.clear('password');
					$scope.hideLogin();
					$scope.showInvalid('Incorrect AT&T UID and/or password. Please check your credentials and try again.', 'password');
					/*$scope.clear();
					$state.go('app.home', {clear: true}, {refresh: true});*/
				}
			});
		};

		$scope.showLogin = function() {
			$ionicLoading.show({
				template: '<p>Logging in...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>',
				animation: 'fade-in'
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

	.controller('HomeCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicPopup, $ionicLoading, $ionicBackdrop, $timeout, $localStorage, $user, $events, $ionicSlideBoxDelegate, $q) {
		$scope.$on('$ionicView.beforeEnter', function () {
			$ionicHistory.clearHistory();
            $ionicHistory.clearCache();
            $scope.showHomeMenu = true;
            $scope.welcomeMessage = $scope.createWelcome();
            var fromSearch = $localStorage.get('leftSearchModal');
            if(fromSearch != 'true') {
                $ionicLoading.show({
                    template: '<p>Loading...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>',
                    animation: 'fade-in'
                });
                $ionicSlideBoxDelegate.slide(0);
                //data initializations, get from localstorage first if possible
                $scope.eventsDateAscending = $events.getLS('eventsDateAscending');
                $scope.fundsDateAscending = $events.getFund('eventsDateAscending');
                $scope.userEvents = $events.getLS('userEvents');
                $scope.noEvents = !$scope.userEvents.length;
                //update localstorage user with Parse database
                console.log('updating user');
                $user.updateLocalStorage()
                    .then( function() {
                        $scope.user = $user.get();
                        console.log('updating userEvents');
                        return $events.updateLocalStorage('userEvents');
                    })
                    .then( function() {
                        $scope.userEvents = $events.getLS('userEvents');
                        $scope.userEvents = $events.sortDateAscending($scope.userEvents);
                        console.log('updating eventsDateAscending');
                        return $events.updateLocalStorage('eventsDateAscending');
                    })
                    .then( function() {
                        $scope.eventsDateAscending = $events.getLS('eventsDateAscending');
                        $scope.fundsDateAscending = $events.getFund('eventsDateAscending');
                        $scope.noEvents = !$scope.userEvents.length;
                        $ionicLoading.hide();
                    });
                //get all events user is signed up for
                /*for (var i=0; i<$scope.userEventIDs.length; i++) {
                    $events.getEvent($scope.userEventIDs[i])
                        .then(function(result) {
                            $scope.userEvents.push(result);
                            console.log($scope.userEvents);
                            //sort date in ascending order
                            $scope.userEvents = $events.sortDateAscending($scope.userEvents);
                            console.log('displaying events');
                            //set display on first slide based on events
                            $scope.noEvents = $scope.userEvents.length == 0;
                            $ionicLoading.hide();
                        });
                }*/

                //animation initialization
                $scope.isActive = false;
                $scope.menuOutlinePressed = false;
                $scope.menuBackgroundPressed = false;
                $scope.menuIconPressed = false;
                $scope.menuText = false;
                $scope.menuOpen = false;
                $scope.menuAnimate = false;
                $scope.menuClicked = false;
                $scope.showBackdrop = false;

                if($localStorage.get('fromLogin') == 'true') {
                    $scope.animateMenuFirst = true;
                    $scope.animateMenu = false;
                    $localStorage.set('fromLogin', 'false');
                }
                else {
                    $scope.animateMenu = true;
                    $scope.animateMenuFirst = false;
                }
               // $scope.$apply();

            }
            else {
                $localStorage.set('leftSearchModal', 'false');
                $scope.animateMenu = false;
                $scope.animateMenuFirst = false;
                //$scope.$apply();
            }
		});

		$scope.$on('$ionicView.afterEnter', function() {
			$timeout( function() {
				$ionicLoading.hide();
			}, 1000);
		});

        $scope.createWelcome = function() {
            //show customized message
            var date = new Date();
            var hour = date.toLocaleTimeString();
            var indexColon = hour.indexOf(':');
            var hourInt = parseInt(hour.substring(0,indexColon));
            if (hour.indexOf('AM') != -1) {
                return "Good Morning";
            }
            else if (hour.indexOf('PM') != -1 && (hourInt == 12 || hourInt < 5)) {
                return "Good Afternoon";
            }
            else if (hour.indexOf('PM') != -1 && (hourInt < 8)){
                return "Good Evening";
            }
            else{
                return "Hello";
            }
        };

		$scope.toggleMenu = function() {
			//$ionicBackdrop.retain();
			$scope.isActive = !$scope.isActive;
			$scope.menuOutlinePressed = !$scope.menuOutlinePressed;
			$scope.menuBackgroundPressed = !$scope.menuBackgroundPressed;
			$scope.menuIconPressed = !$scope.menuIconPressed;
			$scope.menuText = !$scope.menuText;
			$scope.menuOpen = !$scope.menuOpen;
			$scope.menuAnimate = !$scope.menuAnimate;
			$scope.showBackdrop = !$scope.showBackdrop;
		};

		$scope.menuGo = function(state) {
			$scope.menuClicked = state;
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$timeout(function() {
				//$scope.menuClose();
				switch(state) {
					case 'profile':
						$state.go('app.profile', {clear: true}, {refresh: true});
						break;
					case 'event':
						var eventTypePopup = $ionicPopup.show({
							title: 'Pick Event Type',
							subTitle: 'Is it a regular event or fundraiser?',
							scope: $scope,
							buttons: [{
								text: 'Event',
								type: 'button-positive',
								onTap: function(e) {
									$state.go('app.create_event', {clear: true}, {refresh: true});
								}
							},{
								text: 'Fundraiser',
								type: 'button-positive',
								onTap: function(e) {
									$state.go('app.create_fund', {clear: true}, {refresh: true});
								}
							}]
						});
						break;
					case 'links':
						$state.go('app.links', {clear: true}, {refresh: true});
						break;
					case 'calendar':
						$state.go('app.calendar', {clear: true}, {refresh: true});
						break;
					case 'search':
						$state.go('app.search');
						//$scope.openSearchModal();
						break;
				}
				$scope.menuClicked = false;
			}, 200);
		};
		//close the menu if it's open
		$scope.menuClose = function() {
			if ($scope.isActive) {$scope.toggleMenu(event);}
		};

		$scope.changeSlide = function(index) {
			console.log('clicked');
			//change slide to clicked index
			$ionicSlideBoxDelegate.slide(index);
		};

        $scope.refresh = function() {
            $scope.welcomeMessage = $scope.createWelcome();
            $scope.eventsDateAscending = $events.getLS('eventsDateAscending');
            $scope.fundsDateAscending = $events.getFund('eventsDateAscending');
            $scope.userEvents = $events.getLS('userEvents');
            $scope.noEvents = !$scope.userEvents.length;
            //update localstorage user with Parse database
            console.log('updating user');
            $user.updateLocalStorage()
                .then( function() {
                    $scope.user = $user.get();
                    console.log('updating userEvents');
                    return $events.updateLocalStorage('userEvents');
                })
                .then( function() {
                    $scope.userEvents = $events.getLS('userEvents');
                    $scope.userEvents = $events.sortDateAscending($scope.userEvents);
                    console.log('updating eventsDateAscending');
                    return $events.updateLocalStorage('eventsDateAscending');
                })
                .then( function() {
                    $scope.eventsDateAscending = $events.getLS('eventsDateAscending');
                    $scope.fundsDateAscending = $events.getFund('eventsDateAscending');
                    console.log($scope.userEvents);
                    $scope.noEvents = !$scope.userEvents.length;
                    $scope.$broadcast('scroll.refreshComplete');
                });
            // refresh complete
            //$scope.$broadcast('scroll.refreshComplete');
        };

        $scope.select = function(event) {
            $localStorage.set('leftSearchModal', 'true');
            if(event.type != "Fund") $state.go("app.event", {param:{id:event.eventId}});
            else $state.go("app.fund", {param:{id:event.eventId}});
        };

		$scope.$on('$ionicView.beforeLeave', function() {
			console.log('closing menu');
			console.log($ionicHistory.currentStateName());
			if($ionicHistory.currentStateName() != 'app.search') {
				$scope.menuClose();
			}

		});
		$scope.$on('$ionicView.afterLeave', function () {
			/*$scope.menuClose();
			console.log('closing menu');*/
		});
	})

	.controller('SearchCtrl', function($scope, $state, $events, $localStorage, $ionicHistory, $ionicViewSwitcher) {
		$scope.$on('$ionicView.beforeEnter', function () {
			$scope.events = $events.getLS();
			$scope.eventsDateAscending = $events.getLS('eventsDateAscending');
		});

		$scope.$on('$ionicView.afterEnter', function() {
			$scope.input = 'search';
		});

		$scope.selectEvent = function(event) {
			// If the news type is event do the below
			$scope.input = '';
            console.log(event);
			if(event.type != "Fund") $state.go("app.event", {param:{id:event.eventId}}, {reload: true});
			else $state.go("app.fund", {param:{id:event.eventId}});
		};

		$scope.closeSearch = function() {
			$scope.input = '';
			/*$ionicHistory.nextViewOptions({
				disableBack: true,
				disableAnimate: true
			});
			$state.go('app.home');*/
			if(ionic.Platform.isWebView()){cordova.plugins.Keyboard.close()};
			$localStorage.set('leftSearchModal', 'true');
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
			$ionicViewSwitcher.nextDirection('back');
			$state.go('app.home');
		}
	})

	.controller('ProfileCtrl', function($scope, $state, $ionicPopup, $events, $ionicScrollDelegate, $ionicSlideBoxDelegate) {
		$scope.$on('$ionicView.beforeEnter', function () {
			$scope.currentUser = Parse.User.current();
            $scope.info = {};
            $scope.doRefresh();
		});

		$scope.doRefresh = function() {
			var currentUser = Parse.User.current();

			$scope.info = {firstName: currentUser.get('firstName'), lastName: currentUser.get('lastName'), phone: currentUser.get('phone'),
				email: currentUser.get('email'), interests: currentUser.get('interests')};

			$scope.id = currentUser.get('username');
			$scope.fullName = currentUser.get('firstName')+" "+Parse.User.current().get('lastName');
			$scope.hours = 0;
			$scope.phone = currentUser.get('phone');
			$scope.email = currentUser.get('email');
			$scope.moneySaved = 0;

			var interests = currentUser.get('interests');
			if(interests !== undefined && interests != "") $scope.interestsList = interests.split(',');
			else $scope.interestsList = [];

			var eventsString = currentUser.get('events');
			if(eventsString !== undefined && eventsString != "") $scope.events = eventsString.split(", ");
			else $scope.events = [];

			$scope.upcoming = [];
            $scope.userCreated = [];
			$scope.currentDate = new Date();

			$scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			$scope.progress = currentUser.get('progress');
			$scope.progressMonth = ["", "", ""];
			for (var i=2; i>=0; i--) { $scope.progressMonth[Math.abs(i-2)] = $scope.months[$scope.currentDate.getMonth()-(i+1)]; }

			for (var i=0; i<$scope.progress.length; i++) $scope.hours += $scope.progress[i];
			$scope.moneySaved = Math.round($scope.hours * 22.9 * 100) / 100;

			$scope.graph();

			$scope.topPeople = [{name: "Alec", hours: $scope.hours}, {name: "Catherine", hours: $scope.hours-1}, {name: "Ben", hours: 7},
				{name: "Natalie", hours: 5}, {name: "Emily", hours: 1}];

			for (var i = 0; i < $scope.events.length; i++) {
				var query = new Parse.Query("Event");
				query.get($scope.events[i], {
					success: function (object) {
						var date = object.attributes.date;
						if (date >= $scope.currentDate) {
							var upcomingDate = date.getMonthFormatted() + "/" + date.getDate() + "/" + date.getFullYear();
							var upcomingEvent = {id: object.id, name: object.attributes.name, date: upcomingDate};
							$scope.upcoming.push(upcomingEvent);
                            $scope.upcoming = $events.sortDateAscending($scope.upcoming);
						}
						$scope.$apply();
                        $ionicScrollDelegate.$getByHandle('profile-slide-list').resize();
                        $ionicSlideBoxDelegate.update();
						if ($scope.events.indexOf(object.id) == $scope.events.length - 1) {
							$scope.moneySaved = Math.round($scope.hours * 22.9 * 100) / 100;
							$scope.graph();
						}
					}, error: function(object) {
						console.log("Error loading Event! Please contact support with this ID #: ");
					}
				});
			}
            query = new Parse.Query('Event');
            query.equalTo('owner', $scope.id);
            query.find( {
                success: function(results) {
                    console.log(results);
                    for(var i=0; i<results.length; i++) {
                        $scope.userCreated.push(results[i].attributes);
                        $scope.userCreated = $events.sortDateAscending($scope.userCreated);
                    }
                    console.log($scope.userCreated);
                    $scope.$apply();
                    console.log('refresh complete');
                    $ionicScrollDelegate.$getByHandle('profile-slide-list').resize();
                    $scope.$broadcast('scroll.refreshComplete');
                },
                error: function(error) {
                    console.log(error);
                }
            });
		};

		$scope.graph = function() {
			var data = {
				labels: $scope.progressMonth,
				datasets: [{
					fillColor: "rgba(3,152,220,0.5)",
					strokeColor: "rgba(0,0,0,0.8)",
					highlightFill: "rgba(3,152,220,0.75)",
					highlightStroke: "rgba(0,0,0,1)",
					data: $scope.progress
				}]
			};
			//document.getElementById("canvasWrapper").innerHTML = "";
			//document.getElementById("canvasWrapper").innerHTML = "<canvas id=\"canvas\"></canvas>";
			//if(document.chart !== undefined) document.chart.destroy();
			var chart = document.getElementById("canvas").getContext("2d");
			document.chart = new Chart(chart).Bar(data, {responsive: true});
		};

		$scope.selectUpcoming = function(event) {
			$state.go("app.event", {param:{id:event.id}});
		};
        $scope.selectUserCreated = function(event) {
            $state.go("app.event", {param:{id:event.eventId}});
        };

		$scope.saveProfileChanges = function() {
            var currentUser = $scope.currentUser;
			currentUser.set('firstName', $scope.info.firstName);
			currentUser.set('lastName', $scope.info.lastName);
			currentUser.set('phone', $scope.info.phone);
			currentUser.set('email', $scope.info.email);
			currentUser.set('interests', $scope.info.interests);
			currentUser.save(null, { success: function(result) {}, error: function(result) {
				var alert = $ionicPopup.alert({
					title: "Error saving info!"
				});
				return;
			}});
			$state.go("app.settings", {}, {refresh: true});
		};

        $scope.slideHasChanged = function($index) {
            $ionicSlideBoxDelegate.update();
        }
	})

	.controller('CreateEventCtrl', function($scope, $state, $ionicPopup, $ionicHistory, $timeout, $ionicLoading) {
        $scope.$on('$ionicView.beforeEnter', function() {
            $scope.isBrowser = ionic.Platform.isWebView() ? false : true;
            $scope.info = {name: "", description: "", location: "", date: "", endDate: "", contact: "", contactInfo: "", url: "", external: false};
            $scope.creator = Parse.User.current().get('username');
            if(ionic.Platform.isWebView()) {
                $scope.startDate = 'Pick a start date';
                $scope.endDate = 'Pick an end date';
            }
            else {
                $scope.startDate = $scope.info.date;
                $scope.endDate = $scope.info.date;
            }

        });

        $scope.showDatePicker = function(type) {
            console.log(new Date().toString());
            $scope.minDateStart = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();
            if (type == 'end') {
                if ($scope.startDate != 'Pick a start date') {
                    $scope.minDateEnd = $scope.startDate.valueOf();
                }
                else {
                    alert('Please pick a valid start date first!');
                    return;
                }
            }

            var options = {
                date: new Date(),
                mode: 'datetime',
                minDate: (type=='start') ? $scope.minDateStart : $scope.minDateEnd,
                todayText: 'Today',
                nowText: 'Now',
                androidTheme: 5
            };

            function onSuccess(date){
                if (type == 'start') {
                    $scope.startDate = date;
                    $scope.info.date = date;
                }
                else if (type == 'end') {
                    $scope.endDate = date;
                    $scope.info.endDate = date;
                }
                $scope.$apply();
                console.log($scope.startDate, $scope.endDate);
            }

            function onError(error) { // Android only
                console.log(error);
            }

            datePicker.show(options, onSuccess, onError);
        };


		$scope.inject = function() {
			$scope.info = { name: 'Youth First Family Dinner Night', description: 'Friday Night Family Dinner at Youth First, a Resource Center Dallas program. LEAGUE at AT&T will be hosting the evening by preparing a simple meal for 20-30 youth, including serving and cleaning-up. Volunteers are needed to help LEAGUE prepare meals.', location: '3918 Harry Hines Blvd. Dallas, TX 75219', date: '07/31/2015', startTime: '6:00 PM', endTime: '8:00 PM', contact: 'Richard Wilson', contactInfo: 'rw2675@att.com', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'North Texas Food Bank with AT&T Pioneers', description: 'Sorting, boxing, and/or bagging food in a warehouse environment. Helping the North Texas Food Bank (NTFB) feed hungry people. Volunteers needed.', location: '4500 S. Cockrell Hill Road Dallas, TX 75236', date: '09/16/2015', startTime: '1:00 PM', endTime: '3:30 PM', contact: 'Elisabet Freer', contactInfo: 'ef7394@att.com', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Parsons Team Volunteering at Minnie\'s Food Pantry', description: 'Volunteers will assist with inspecting, sorting, and boxing donated food, stocking shelves, and providing red carpet concierge service to our clients.', location: '3033 W. Parker Road, Suite 117 Plano, TX 75023', date: '07/22/2015', startTime: '8:00 AM', endTime: '11:30 PM', contact: 'Sindoori Murugavel', contactInfo: 'sm786t@att.com', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Homeless Veterans Stand Down', description: 'Stand Down is a one day event providing supplies and services to homeless Veterans, such as food, shelter, clothing, health screenings and VA Social Security benefits counseling. Veterans can also receive referrals to other assistance such as health care, housing solutions, employment, substance use treatment and mental health counseling. they are collaborative events, coordinated between local VA Medical Centers, other government agencies and community-based homeless service providers. Volunteers are needed to help provide food, clothing and other services.', location: '4500 S. Lancaster Rd. Dallas, TX 75216', date: '11/06/2015', startTime: '7:00 AM', endTime: '3:00 PM', contact: 'Cheryl Nelms', contactInfo: 'cn4113@att.com', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Sleeping Mats for the Homeless', description: 'Project Mission: Pioneers intent is to recycle plastic bags and make them useful by crocheting them into sleeping mats and donate them to local shelters, churches or other like organizations for distribution to the homeless community.', location: 'Contact Danielle for Location', date: '01/01/2016', startTime: '6:00 AM', endTime: '11:00 PM', contact: 'Danielle Carnicom', contactInfo: 'dc1568@att.com', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Oasis-Texas Habitat for Humanity', description: 'Oasis-Texas partnered with Habitat for Humanity to provide our members volunteer opportunities. Habitat for Humanity is currently building a home in East Plano that will one day shelter a family and provide them the means to build a brighter future for themselves and their children.', location: '904 13th St. Plano, TX 75074', date: '01/01/2016', startTime: '8:00 AM', endTime: '3:00 PM', contact: 'Not Provided', contactInfo: 'Not Provided', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Dallas Life: New Life for the Homeless', description: 'We are in need of volunteers to help with childcare during our weekly chapel services. Volunteers will care for potty trained children between ages of 2 and 5 years old.', location: '', date: '01/01/2016', startTime: '6:00 PM', endTime: '7:00 PM', contact: 'Not Provided', contactInfo: 'Not Provided', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Test Past Event', description: 'This is to test an event that has already passed.', location: '211 S. Akard St. Dallas, TX', date: '05/20/2015', startTime: '11:00 AM', endTime: '2:00 PM', contact: 'None', contactInfo: 'None', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'DFW Family of ERGs – Day at the North Texas Food Bank', description: 'This is a food collection ending with a food sorting event at the North Texas Food Bank to promote the collaboration of all corporate ERG chapters and their members located in Dallas and Fort Worth.', location: '4500 S Cockrell Hill Dallas, TX 75236', date: '08/28/2015', startTime: '9:00 AM', endTime: '3:00 PM', contact: 'Robert Cardarelli', contactInfo: 'rc2654@att.com', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Rugged and Raw Trail Run', description: 'Sign up today to volunteer at the Rugged & Raw Trail Race event benefitting Back on My Feet. Back on my Feet is a national for purpose organization that uses running to help those experiencing homelessness to change the way they see themselves so they can make real changes in their lives that results in employment and independent living. This 10k/20k race is one of the toughest in the Dallas- Fort Worth area. Various volunteer jobs and shifts are available for this fun trail race event. Volunteers under the age of 18 must have a parent volunteer with them. Min. Age is 12 years. If you would like to run the race, the entrance fee is $40-$60 and the race goes from 8:30am-12:30pm. ', location: '7171 Mountain Creek Pkwy Dallas, TX 75249', date: '10/17/2015', startTime: '6:45 AM', endTime: '1:00 PM', contact: 'Back on my feet Dallas', contactInfo: '215-772-1080', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Victory Plaza Dallas Heart Walk', description: 'The Heart Walk is a three mile non-competitive event. The Heart Walk starts at Victory Plaza and goes through downtown Dallas, ending at Victory Park. The cause areas for this event are community, education and literacy, and health and medicine. ', location: '2440 Victory Park Lane Dallas,, TX 75219', date: '09/12/2015', startTime: '8:30 AM', endTime: '11:30 AM', contact: 'Cheryl Nelms', contactInfo: 'cn4113@att.com', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Move For Hunger', description: 'Move For Hunger is looking for runners and walkers to help us turn miles into meals at the Michelob Ultra 13.1 Dallas Half Marathon & 5K! Team members receive a free guaranteed race entry, training help and some stylish running gear. By joining Team Move For Hunger, you can help us race away hunger in the Lone Star State! Team Captain Emily will send over some fundraising and training tips, along with a link to your personal fundraising page on Crowdrise . Upload your personal picture and information and you’re ready to go! Gather donations from friends, family, coworkers and anyone who wants to help us fight hunger in America. You’ll receive bi-monthly newsletters filled with great information to help you cross the finish line, all while your fundraising donations enable us to continue our lifesaving services. Once you’ve raised $500, we will register you with the race, getting your free registration along with a stylish Team Move For Hunger technical tee. If you raise more, the incentives just get better! Our network of relocation industry specialists help to reduce food waste and deliver much needed food to our local food banks. With over 18% of residents in the Dallas area that are food insecure, your help is needed more than ever! With 96% of every dollar donated going back to our hunger relief and food rescue programs, you can be assured that your miles are turned into meals for those in need. In the last five years, we have delivered over 5 million pounds of food - let\'s keep it moving!', location: '2403 Flora St #500, Dallas, TX 75201', date: '10/24/2015', startTime: '8:00 AM', endTime: '12:30 PM', contact: 'Emily', contactInfo: 'emily@moveforhunger.org 732-832-5025 ', url: '' };
			$scope.createEvent(true);
		};

		$scope.createEvent = function(injected) {
            if (ionic.Platform.isWebView()) cordova.plugins.Keyboard.close();
			var urlEmpty = true;
			for (var key in $scope.info) {
				if (key == "url" && $scope.info[key] != "") urlEmpty = false;
				if (key == "external" && $scope.info[key] && urlEmpty) {
					var alert = $ionicPopup.alert({
						title: "Please provide a URL! You have marked this event as external."
					});
					return;
				}
				if (key == "external") continue;
				if (key != "url" && $scope.info[key] == "") {
					var alert = $ionicPopup.alert({
						title: "Please fill in all the required fields!"
					});
					return;
				}
			}
            if ($scope.startDate == 'Pick a start date' || $scope.endDate == 'Pick an end date') {
                var alert = $ionicPopup.alert({
                    title: "Please fill in all the required fields!"
                });
                return;
            }

			var EventClass = Parse.Object.extend("Event");
			var event = new EventClass();

			event.set("name", $scope.info.name);
			event.set("owner", $scope.creator);
			event.set("description", $scope.info.description);
			event.set("location", $scope.info.location);
			event.set("contact", $scope.info.contact);
			event.set("contactInfo", $scope.info.contactInfo);
			event.set("url", $scope.info.url);
            event.set('date', new Date($scope.info.date));
            event.set('endDate', new Date($scope.info.endDate));
			event.set('isExternal', $scope.info.external);

			event.save(null,{
				success: function(result) {
					event.set("eventId", result.id);
					event.save(null, {
						success: function(result) {
                            $ionicPopup.alert(
                                {
                                    title: 'Event created!!',
                                    okText: 'Ok',
                                    okType: 'button-positive'
                                }
                            ).then( function(res) {
                                $scope.info = {name: "", description: "", location: "", date: "", endDate: "", contact: "", contactInfo: "", url: ""};

                                if(!injected) {
                                    $ionicHistory.nextViewOptions({
                                        disableBack: true
                                    });
                                    $ionicLoading.show({
                                        template: '<p>Loading...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>',
                                        animation: 'fade-in'
                                    });
                                    $state.go("app.home", {}, {refresh: true});
                                }
                            });
						}, error: function(result) {
							var alert = $ionicPopup.alert({
								title: "Error providing Calendar entry ID!"
							});
							return;
						}
					});
				}, error: function(result) {
					var alert = $ionicPopup.alert({
						title: "Error creating event!"
					});
					return;
				}
			});
		};

        $scope.pickDate = function() {
            alert('clicked');
        }
	})

	.controller('CreateFundCtrl', function($scope, $state, $ionicPopup, $ionicHistory) {

		$scope.info = {
			name: "", description: "", url: ""
		};

		$scope.inject = function() {
		};

		$scope.createFund = function(injected) {

			for (var key in $scope.info) {
				if (key != "url2" && $scope.info[key] == "") {
					var alert = $ionicPopup.alert({
						title: "Please fill in all the required fields!"
					});
					return;
				}
			}

			var date = new Date();

			var FundClass = Parse.Object.extend("Event");
			var fund = new FundClass();

			fund.set("name", $scope.info.name);
			fund.set("description", $scope.info.description);
			fund.set("url", $scope.info.url);
			fund.set("date", date);
			fund.set("type", "Fund");

			fund.save(null, {
				success: function(result) {
					fund.set("eventId", result.id);
					fund.save(null, {
						success: function(result) {
							$scope.info.name = "";
							$scope.info.description = "";
							$scope.info.url = "";
							$ionicHistory.nextViewOptions({
								disableBack: true,
							});
							if(!injected) $state.go("app.profile", {}, {refresh: true});
						}, error: function(result) {
							var alert = $ionicPopup.alert({
								title: "Error providing Calendar entry ID!"
							});
							return;
						}
					});
				}, error: function(result) {
					var alert = $ionicPopup.alert({
						title: "Error creating fundraiser!"
					});
				}
			});

		};

	})

	.controller('FundCtrl', function($scope, $stateParams, $state, $ionicPopup, $ionicHistory) {

		$scope.$on('$ionicView.beforeEnter', function () {
			$scope.update();
		});

		$scope.name = ""; $scope.date = null; $scope.description = ""; $scope.url = "";
		$scope.update = function() {
			var query = new Parse.Query("Event");
			query.get($stateParams.param.id, {
				success: function (object) {
					$scope.name = object.attributes.name;
					$scope.date = object.attributes.date;
					$scope.description = object.attributes.description;
					$scope.url = object.attributes.url;
					$scope.$apply();
				}
			});
		};
	})

	.controller('EventCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicPopup, $localStorage, $ionicActionSheet, uiGmapGoogleMapApi, $q, $ionicModal, $ionicLoading) {
        $scope.$on('$ionicView.loaded', function() {
            $ionicModal.fromTemplateUrl('templates/edit_event.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
            });
        });

		$scope.$on('$ionicView.beforeEnter', function () {
            $scope.isBrowser = ionic.Platform.isWebView() ? false : true;
            $scope.userCreated = false;
            $scope.modalVars = {};
            $scope.inCalendar = false;
            $scope.locationFound = false;
            $scope.location = '';
            $scope.mapOptions = {};
            $scope.marker = {};
            $scope.windowOptions = {visible: false};
            $scope.windowTitle = "No Location Found";

            $scope.update()
                .then(function (location) {
                    if(ionic.Platform.isWebView()) {
                        $scope.funcCalendar('find');
                    }
                    console.log('got event info');
                    $scope.location = location;
                    return uiGmapGoogleMapApi;
                }, function() {
                    alert ('unable to load event');
                })
                .then(function (maps) {
                    console.log('maps loaded');
                    return $scope.codeAddress(maps, $scope.location);
                })
                .then(function() {
                    console.log('got location successfully, now displaying map');
                    console.log('in calendar: ' + $scope.inCalendar);
                }, function() {
                    console.log('could not geolocate address');
                });
        });

        $scope.onClick = function() {
            $scope.windowOptions.visible = !$scope.windowOptions.visible;
        };

        $scope.closeClick = function() {
            $scope.windowOptions.visible = false;
        };

        $scope.codeAddress = function(maps, location) {
            var defer = $q.defer();
            var geocoder = new maps.Geocoder();
            geocoder.geocode({'address': location}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK){
                    var coord = results[0].geometry.location;
                    console.log(results[0].geometry);
                    $scope.mapOptions = {
                        center: {latitude: coord.lat(), longitude: coord.lng()},
                        zoom: 15
                    };
                    $scope.marker = {
                        idKey: 1,
                        coords: {latitude: coord.lat(), longitude: coord.lng()}
                        /*options: {
                            animation: 1
                        }*/
                    };
                    $scope.windowTitle = $scope.location;
                    $scope.windowOptions.visible = true;
                    $scope.locationFound = true;
                    console.log('got location successfully: ' + coord);
                    defer.resolve();
                }
                else{
                    console.log(status);
                    defer.reject();
                }
            });
            return defer.promise;
        };

		$scope.update = function() {
            var defer = $q.defer();
			$scope.info = {signedUp: false};

			$scope.eventsString = Parse.User.current().get('events');
			if ($scope.eventsString !== undefined) $scope.events = $scope.eventsString.split(", ");
			else $scope.events = [];

			if ($scope.events.indexOf($stateParams.param.id) >= 0) $scope.info.signedUp = true;

			var query = new Parse.Query("Event");
			query.get($stateParams.param.id, {
				success: function (object) {
                    console.log(object.attributes);
					$scope.name = object.attributes.name;
					$scope.date = object.attributes.date;
                    $scope.endDate = object.attributes.endDate;
					$scope.startTime = object.attributes.date;
					$scope.endTime = object.attributes.endDate;
					$scope.location = object.attributes.location;
					$scope.contact = object.attributes.contact;
					$scope.contactInfo = object.attributes.contactInfo;
					$scope.description = object.attributes.description;
					$scope.url = object.attributes.url;
                    $scope.external = object.attributes.isExternal;
                    $scope.eventId = object.attributes.eventId;
                    //create modal edit parameters
                    $scope.modalVars = {
                        title: $scope.name,
                        location: $scope.location,
                        startDate: $scope.date,
                        endDate: $scope.endDate,
                        contact: $scope.contact,
                        contactInfo: $scope.contactInfo,
                        description: $scope.description,
                        url: $scope.url,
                        external: $scope.external,
                        eventId: $scope.eventId
                    };

                    if (object.attributes.owner == Parse.User.current().get('username')) {$scope.userCreated = true;}

                    if(($scope.date.getDate() != $scope.endDate.getDate()) || ($scope.date.getMonth() != $scope.endDate.getMonth())) {
                        $scope.singleDay = false;
                    }
                    else {
                        $scope.singleDay = true;
                    }
					//$scope.$apply();
                    defer.resolve($scope.location);
				}
			});
            return defer.promise;
		};

		$scope.signUp = function() {
            /*cordova.plugins.notification.local.schedule({
                text: "Delayed Notification",
                every: "minute",
                icon: "file://img/logo.png"
            });*/

			var currentUser = Parse.User.current();
			var events = currentUser.get("events");
			if (events == undefined || events.length == 0) var newEvents = $stateParams.param.id;
			else var newEvents = events+", "+$stateParams.param.id;
			currentUser.set("events", newEvents);
			currentUser.save(null, {
			success: function(result) {
				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go("app.profile", {}, {refresh: true} );
			}, error: function(result) {
				var alert = $ionicPopup.alert({
					title: "Error signing up for event!"
				});
			}});
		};

        $scope.funcCalendar = function(key) {
            var cal = window.plugins.calendar;
            var title = $scope.name;
            var loc = $scope.location;
            var notes = $scope.description;
            var start = $scope.date;
            var end = $scope.endDate;
            var calendarName = "MyCal";
            var createSuccess = function(message) {
                cal.findEvent(title, loc, notes, start, end, findSuccess, findError);
                $scope.$apply();
            };
            var createError   = function(message) {
                console.log("Create Error: " + message);
                return false;
            };
            var deleteSuccess = function(message) {
                console.log('Deleted Maybe?' + message);
                $scope.inCalendar = false;
                $ionicPopup.alert(
                    {
                        title: 'Removed from calendar!',
                        okText: 'Ok',
                        okType: 'button-positive'
                    }
                );
                $scope.$apply();
            };
            var deleteError = function(message) {
                console.log("Delete Error: " + message);
                return false;
            };
            var findSuccess = function(message) {
                console.log(JSON.stringify(message));
                console.log('find result: ' + JSON.stringify(message));
                if(message == 'OK' || JSON.stringify(message) != '[]') {
                    console.log('event found');
                    $scope.inCalendar = true;
                }
                else {
                    $scope.inCalendar = false;
                }
                $scope.$apply();
                console.log($scope.inCalendar);
            };
            var findError   = function(message) {console.log("Find Error: " + message); $scope.inCalendar = false;};
            //cal.createEvent(title, loc, notes, start, end, success, error);
            switch(key){
                case 'add':
                    cal.createEventInteractively(title, loc, notes, start, end, createSuccess, createError);
                    break;
                case 'remove':
                    cal.deleteEvent(title, loc, notes, start, end, deleteSuccess, deleteError);
                    break;
                case 'find':
                    cal.findEvent(title, loc, notes, start, end, findSuccess, findError);
                    break;
            }

        };

		$scope.remove = function() {
			$scope.events.splice($scope.events.indexOf($stateParams.param.id), 1);
			var newEvents = "";
			for (var i=0; i<$scope.events.length; i++) {
				if (i != 0) newEvents += ", "+$scope.events[i];
				else newEvents += $scope.events[i];
			}
			Parse.User.current().set("events", newEvents);
			Parse.User.current().save(null, {
			success: function(result) {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go("app.profile");

			}, error: function(result) {
				console.log('error removing event');
			}});
		};

        // Triggered on a button click, or some other target
        $scope.removeWarn = function() {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                destructiveText: '<i class="icon ion-close assertive"></i>Remove',
                titleText: 'Are you sure?',
                cancelText: 'Cancel',
                cancel: function() {
                    hideSheet();
                    // add cancel code..
                },
                destructiveButtonClicked: function(index) {
                    hideSheet();
                    $scope.remove();
                }
            });
        };

        $scope.editEvent = function() {
            $scope.openModal();
        };

        $scope.saveEvent = function() {
            if (ionic.Platform.isWebView()) cordova.plugins.Keyboard.close();
            console.log($scope.modalVars.eventId);
            for (var field in $scope.modalVars) {
                if ($scope.modalVars[field] == '' || !$scope.modalVars[field]) {
                    console.log($scope.modalVars[field]);
                    if(field != 'url' && field != 'external') {
                        $ionicPopup.alert(
                            {
                                title: 'Error',
                                template: "<p style='text-align: center;'>Please fill out all required fields</p>",
                                okText: 'Ok',
                                okType: 'button-positive'
                            }
                        );
                        return;
                    }
                }
            }
            if ($scope.modalVars['external'] && $scope.modalVars['url'] == '') {
                $ionicPopup.alert(
                    {
                        title: 'Error',
                        template: "<p style='text-align: center;'>You selected an external event. Please provide the url</p>",
                        okText: 'Ok',
                        okType: 'button-positive'
                    }
                );
                return;
            }
            var Event = Parse.Object.extend('Event');
            var query = new Parse.Query(Event);
            query.get($scope.modalVars.eventId, {
                success: function(event) {
                    event.save({
                        name: $scope.modalVars.title,
                        description: $scope.modalVars.description,
                        date: new Date($scope.modalVars.startDate),
                        endDate: new Date($scope.modalVars.endDate),
                        location: $scope.modalVars.location,
                        url: $scope.modalVars.url,
                        contact: $scope.modalVars.contact,
                        contactInfo: $scope.modalVars.contactInfo,
                        isExternal: $scope.modalVars.external
                    }, {
                        success: function(event) {
                            console.log('successfully saved');
                            $ionicPopup.alert(
                                {
                                    title: 'Event Saved!',
                                    okText: 'Ok',
                                    okType: 'button-positive'
                                }
                            )
                                .then( function(res) {
                                    $ionicHistory.nextViewOptions({
                                        disableBack: true,
                                        disableAnimate: true
                                    });
                                    $scope.closeModal();
                                    $scope.windowOptions.visible = false;
                                    $state.go($state.current, $stateParams, {reload: true});
                                })
                        },
                        error: function(event, error) {
                            console.log('failed to save');
                            $ionicPopup.alert(
                                {
                                    title: 'Could not Save Event',
                                    okText: 'Ok',
                                    okType: 'button-positive'
                                }
                            )
                        }
                    })
                },
                error: function(object, error) {
                    console.log('error retrieving event for saving')
                }
            });
        };

        $scope.removeEvent = function() {
            var Event = Parse.Object.extend('Event');
            var query = new Parse.Query(Event);
            query.get($scope.modalVars.eventId, {
                success: function(event) {
                    event.destroy({
                       success: function(event) {
                           console.log('successfully removed event from database');
                           var User = Parse.Object.extend('User');
                           query = new Parse.Query(User);
                           query.find({
                               success: function(results) {
                                   console.log(results);
                                   for (var i=0; i<results.length; i++) {
                                       var userEvents = results[i].attributes.events;
                                       console.log(userEvents);
                                       console.log($scope.modalVars.eventId);
                                       if(userEvents != '' || userEvents){
                                           if(userEvents.indexOf($scope.modalVars.eventId) == 0) {
                                               userEvents = userEvents.replace($scope.modalVars.eventId + ', ','');
                                               userEvents = userEvents.replace($scope.modalVars.eventId,'');
                                               console.log(userEvents);
                                               results[i].set('events', userEvents);
                                               results[i].save(null, {
                                                   success: function(res) {
                                                       console.log('replaced');
                                                   },
                                                   error: function(obj, error) {
                                                       console.log('failed to replace');
                                                   }
                                               });
                                           }
                                           else if (userEvents.indexOf($scope.modalVars.eventId) > 0){
                                               userEvents = userEvents.replace(', ' + $scope.modalVars.eventId,'');
                                               console.log(userEvents);
                                               results[i].set('events', userEvents);
                                               results[i].save(null, {
                                                   success: function(res) {
                                                       console.log('replaced');
                                                   },
                                                   error: function(obj, error) {
                                                       console.log('failed to replace');
                                                   }
                                               });
                                           }
                                       }

                                   }
                                   $ionicPopup.alert(
                                       {
                                           title: 'Event Deleted!',
                                           okText: 'Ok',
                                           okType: 'button-positive'
                                       }
                                   ).then( function(res) {
                                           $ionicHistory.nextViewOptions({
                                               disableBack: true
                                           });
                                           $scope.closeModal();
                                           $state.go('app.profile');
                                       })
                               },
                               error: function(obj, error) {
                                   console.log('user not found');
                               }
                           });
                       },
                        error: function(obj, error) {
                            console.log('failed to remove');
                        }
                    });
                },
                error: function(object, error) {
                    console.log('error retrieving event for removing')
                }
            });
        };

        $scope.showDatePicker = function(type) {
            console.log(new Date().toString());
            $scope.minDateStart = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();
            if (type == 'end') {
                if ($scope.modalVars.startDate != 'Pick a start date') {
                    $scope.minDateEnd = $scope.modalVars.startDate.valueOf();
                }
                else {
                    alert('Please pick a valid start date first!');
                    return;
                }
            }

            var options = {
                date: new Date($scope.modalVars.startDate),
                mode: 'datetime',
                minDate: (type=='start') ? $scope.minDateStart : $scope.minDateEnd,
                todayText: 'Today',
                nowText: 'Now',
                androidTheme: 5
            };

            function onSuccess(date){
                if (type == 'start') {
                    $scope.modalVars.startDate = date;
                }
                else if (type == 'end') {
                    $scope.modalVars.endDate = date;
                }
                $scope.$apply();
            }

            function onError(error) { // Android only
                console.log(error);
            }

            datePicker.show(options, onSuccess, onError);
        };

        $scope.removeWarnEvent = function() {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                destructiveText: '<i class="icon ion-close assertive"></i>Remove',
                titleText: 'Are you sure?',
                cancelText: 'Cancel',
                cancel: function() {
                    hideSheet();
                    // add cancel code..
                },
                destructiveButtonClicked: function(index) {
                    hideSheet();
                    $scope.removeEvent();
                }
            });
        };

        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            $scope.windowOptions.visible = false;
            if($ionicHistory.currentStateName() != 'home') {
                $localStorage.set('leftSearchModal', false);
            }
        });

	})

	.controller('CalCtrl', function($scope, $state, $ionicPopup) {
        $scope.$on('$ionicView.beforeEnter', function() {
            //date info
            var date = new Date();
            $scope.currMonth = date.getMonth();
            $scope.currYear = date.getFullYear();
            $scope.day = date.getDay();

            $scope.months = ["January","February","March","April","May","June","July","August", "September","October","November","December"];

            $scope.month = $scope.months[$scope.currMonth];
            $scope.year = currYear;
        });

        /*$scope.$on('ionicView.beforeEnter', function() {
            var date = new Date();
            var currMonth = date.getMonth();
            var currYear = date.getFullYear();
            var day = date.getDay();

            var months = ["January","February","March","April","May","June","July","August", "September","October","November","December"];

            $scope.month = date;
            $scope.year = currYear;
            $scope.day = day;
        });*/

		//decrements month
		$scope.prevM = function() {
			$scope.currMonth--;
			if($scope.currMonth<0) {
				$scope.currMonth = 11;
				$scope.currYear--;
			}

			$scope.month = $scope.months[$scope.currMonth];
			$scope.year = $scope.currYear;
		};

		//increments month
		$scope.nextM = function() {

			$scope.currMonth++;
			if($scope.currMonth>11) {
				$scope.currMonth = 0;
				$scope.currYear++;
			}

			$scope.month = $scope.months[$scope.currMonth];
			$scope.year = $scope.currYear;
		};

		$scope.goToDay = function(month, year, cellClicked){
			//calculate day in month based on cellClicked
			var day1 = new Date(year, $scope.months.indexOf(month), 1);
			var startDay = day1.getDay();
			var dayClicked = cellClicked - startDay;

			//set day variable
			$scope.day = dayClicked;

			$state.go("app.calendarSingle", {'theMonth':$scope.month, 'theYear':$scope.year, 'theDay':$scope.day, 'monthInd':$scope.months.indexOf($scope.month)});
		};

        $scope.createEvent = function() {
            var eventTypePopup = $ionicPopup.show({
                title: 'Pick Event Type',
                subTitle: 'Is it a regular event or fundraiser?',
                scope: $scope,
                buttons: [{
                    text: 'Event',
                    type: 'button-positive',
                    onTap: function(e) {
                        $state.go('app.create_event', {clear: true}, {refresh: true});
                    }
                },{
                    text: 'Fundraiser',
                    type: 'button-positive',
                    onTap: function(e) {
                        $state.go('app.create_fund', {clear: true}, {refresh: true});
                    }
                }]
            });
        };
	})

	.controller('EventListCtrl', function($scope, $stateParams, $state) {

		//date info
		$scope.months = $stateParams.theMonth;
		$scope.year = $stateParams.theYear;
		$scope.day = $stateParams.theDay;
		$scope.mnthInd = $stateParams.monthInd;
		$scope.date = new Date($scope.year, $scope.mnthInd, $scope.day);

        //flag to indicate if there are any events on the given day
        var noEvents = false;

		//query info
		$scope.events = [];
		$scope.eventCopy = {id: "", name: "", description: "", startTime: "", endTime: "", location: "", date: "", type: ""};
		$scope.error = {show: false};

        //query- all events on the given day and all fundraising events within a month of the fundraising start date
		var eventClass = Parse.Object.extend("Event");
		var query = new Parse.Query(eventClass);
		query.find({
			success: function (results) {
				$scope.events = [];
				for (var i = 0; i < results.length; i++) {
					var eventInfo = angular.copy($scope.eventCopy);
					eventInfo.id = results[i].get("eventId");
					eventInfo.name = results[i].get("name");
					eventInfo.description = results[i].get("description");
					eventInfo.startTime = results[i].get("startTime");
					eventInfo.endTime = results[i].get("endTime");
					eventInfo.location = results[i].get("location");
					eventInfo.date = results[i].get("date");
					eventInfo.type = results[i].get("type");

                    //only pushes events for given day
                    if((eventInfo.date.toString().substring(0,15) == $scope.date.toString().substring(0,15)) ||
                        ((((eventInfo.date.getDate() <= $scope.date.getDate()) && (eventInfo.date.getMonth() == $scope.date.getMonth())) ||
                        ((eventInfo.date.getDate() >= $scope.date.getDate()) && ((eventInfo.date.getMonth() + 1) == $scope.date.getMonth())))
                        && eventInfo.type == "Fund"))
					    $scope.events.push(eventInfo);
				}

                //if no events on the day
                if($scope.events.length == 0) {
                    noEvents = true;
                    var eventInfo = angular.copy($scope.eventCopy);
                    eventInfo.description = "No events occurring on this date.";
                    eventInfo.date = $scope.date;
                    $scope.events.push(eventInfo);
                }

                $scope.error.show = false;
                $scope.$apply();
			}, error: function (results) {
				$scope.error.show = true;
				return;
			}
		});

		//filter events by selected day
		$scope.filterEvents = function($event) {
            if((!($event.type == "Fund")) && !noEvents)
            return (true)
        };

        //filter fundraising events; shows for 30 days
        $scope.filterFund = function($event) {
            if($event.type == "Fund") {
                return (true)
            }
        };

        //filter for when there are no events occurring on a day
        $scope.filterEmpty = function($event) {
            if(noEvents)
                return(true)
        };

        //selects the event item to take to event page
		$scope.select = function(eventItem) {
			if(eventItem.type != "Fund") $state.go("app.event", {param:{id:eventItem.id}});
            else $state.go("app.fund", {param:{id:eventItem.id}});
		};
	})

    .controller('SettingsCtrl', function($ionicModal, $ionicSlideBoxDelegate, $ionicLoading, $scope, $state, $ionicHistory, $localStorage) {
        $scope.$on('$ionicView.loaded', function() {
            $ionicModal.fromTemplateUrl('templates/tutorial.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
            });
        });

        $scope.$on('$ionicView.beforeEnter', function() {
            $scope.leftButton = '';
            $scope.rightButton = 'Next';
            $scope.allowClose = true;
            $ionicSlideBoxDelegate.slide(0);
        });

        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
            $ionicSlideBoxDelegate.slide(0);
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        $scope.showTutorial = function() {
            $scope.openModal();
        };

        $scope.updateSlide = function($index) {
            if ($index == 0) {
                $scope.leftButton = '';
                $scope.rightButton = 'Next';
            }
            else if ($index < ($ionicSlideBoxDelegate.slidesCount() - 1)) {
                $scope.leftButton = 'Previous';
                $scope.rightButton = 'Next';
            }
            else {
                $scope.leftButton = 'Previous';
                $scope.rightButton = 'Start Over';
            }
        };

        $scope.leftButtonClick = function() {
            if ($scope.leftButton == 'Previous') {
                $ionicSlideBoxDelegate.previous();
            }
        };

        $scope.rightButtonClick = function() {
            if ($scope.rightButton == 'Next') {
                $ionicSlideBoxDelegate.next();
            }

            else if ($scope.rightButton == 'Start Over') {
                $ionicSlideBoxDelegate.slide(0);
            }
        };

        $scope.goHome = function() {
            $ionicLoading.show({
                template: '<p>Loading...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>',
                animation: 'fade-in'
            });
            $localStorage.set('fromLogin', 'true');
            $scope.closeModal();
            $ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true
            });
            $state.go('app.home');
        }
    })

    .controller('TutorialCtrl', function($ionicModal, $ionicSlideBoxDelegate, $ionicLoading, $scope, $state, $ionicHistory, $localStorage, $timeout) {
        $scope.$on('$ionicView.loaded', function() {
            $ionicModal.fromTemplateUrl('templates/tutorial.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
            });

        });

        $scope.$on('$ionicView.beforeEnter', function() {
            $scope.leftButton = '';
            $scope.rightButton = 'Next';
            $scope.allowClose = false;
            $ionicSlideBoxDelegate.slide(0);

            $ionicLoading.hide();
        });

        $scope.$on('$ionicView.afterEnter', function() {
            $timeout( function() {
                $scope.openModal();
            }, 100);
        });

        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
            $ionicSlideBoxDelegate.slide(0);
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        $scope.showTutorial = function() {
            $scope.openModal();
        };

        $scope.updateSlide = function($index) {
            if ($index == 0) {
                $scope.leftButton = '';
                $scope.rightButton = 'Next';
            }
            else if ($index < ($ionicSlideBoxDelegate.slidesCount() - 1)) {
                $scope.leftButton = 'Previous';
                $scope.rightButton = 'Next';
            }
            else {
                $scope.leftButton = 'Previous';
                $scope.rightButton = 'Start Over';
            }
        };

        $scope.leftButtonClick = function() {
            if ($scope.leftButton == 'Previous') {
                $ionicSlideBoxDelegate.previous();
            }
        };

        $scope.rightButtonClick = function() {
            if ($scope.rightButton == 'Next') {
                $ionicSlideBoxDelegate.next();
            }

            else if ($scope.rightButton == 'Start Over') {
                $ionicSlideBoxDelegate.slide(0);
            }
        };

        $scope.goHome = function() {
            $ionicLoading.show({
                template: '<p>Loading...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>',
                animation: 'fade-in'
            });
            $localStorage.set('fromLogin', 'true');
            $scope.closeModal();
            $ionicHistory.nextViewOptions({
                disableBack: true,
                disableAnimate: true
            });
            $state.go('app.home');
        }
    })

    .controller('LinksCtrl', function() {
        console.log('hi');
    });

