angular.module('myApp.controllers', ['myApp.services'])

	.controller('AppCtrl', function ($scope, $state, $ionicLoading, $timeout, $user, $ionicHistory) {
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
			//cordova.plugins.Keyboard.close();
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
                    // aniamte out
                    $scope.fadeOut = true;

					$user.updateLocalStorage();
					console.log(user);
					/*$rootScope.user = user;
					$rootScope.isLoggedIn = true;*/
					$scope.clear();
                    $localStorage.set('fromLogin', 'true');
                    $ionicHistory.nextViewOptions({
                        disableBack: true,
                        disableAnimate: true
                    });
                    $timeout( function() {
                        if (user.attributes.firstTime) {
                            //$state.go('showtutorial');
                            $state.go('app.home');
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

	.controller('HomeCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicLoading, $ionicBackdrop, $timeout, $localStorage, $user, $events, $ionicSlideBoxDelegate) {
		$scope.$on('$ionicView.beforeEnter', function () {
			$ionicHistory.clearHistory();
            $scope.showHomeMenu = true;
            var fromSearch = $localStorage.get('leftSearchModal');
            if(fromSearch != 'true') {
                //data initializations, get from localstorage first if possible
                $scope.user = $user.get();
                $scope.eventsDateAscending = $events.getLS('eventsDateAscending');
                $scope.userEvents = [];
                $scope.userEventIDs = $scope.user.events.split(', ');

                //update localstorage user with Parse database
                $user.updateLocalStorage();
                //get all events in ascending order
                $events.updateLocalStorage('eventsDateAscending')
                    .then( function(result) {
                        $scope.eventsDateAscending = $events.getLS('eventsDateAscending');

                    }, function(error) {
                        $scope.eventsDateAscending = "Please check your internet connection and try again."
                    });
                //get all events user is signed up for
                for (var i=0; i<$scope.userEventIDs.length; i++) {
                    $events.getEvent($scope.userEventIDs[i])
                        .then(function(result) {
                            $scope.userEvents.push(result);
                            //sort date in ascending order
                            $scope.userEvents = $events.sortDateAscending($scope.userEvents);
                        });
                }
                //show customized message
                var date = new Date();
                var hour = date.toLocaleTimeString();
                var indexColon = hour.indexOf(':');
                var hourInt = parseInt(hour.substring(0,indexColon));
                if (hour.indexOf('AM') != -1) {
                    $scope.welcomeMessage = "Good Morning";
                }
                else if (hour.indexOf('PM') != -1 && (hourInt == 12 || hourInt < 5)) {
                    $scope.welcomeMessage = "Good Afternoon";
                }
                else if (hour.indexOf('PM') != -1 && (hourInt < 8)){
                    $scope.welcomeMessage = "Good Evening";
                }
                else{
                    $scope.welcomeMessage = "Hello";
                }

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

            }
            else {
                $localStorage.set('leftSearchModal', 'false');
                $scope.animateMenu = false;
                $scope.animateMenuFirst = false;
            }
		});

		$scope.$on('$ionicView.afterEnter', function() {
			$timeout( function() {
				$ionicLoading.hide();
			}, 1000);
		});

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
						$state.go('app.create_event', {clear: true}, {refresh: true});
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
            $events.updateLocalStorage('eventsDateAscending')
                .then( function() {
                    $scope.eventsDateAscending = $events.getLS('eventsDateAscending');
                }, function(error) {
                    $scope.eventsDateAscending = "Please check your internet connection and try again."
                });
            //update user events
            for (var i=0; i<$scope.userEventIDs.length; i++) {
                $events.getEvent($scope.userEventIDs[i])
                    .then(function(result) {
                        if ($scope.userEvents.indexOf(result) != -1){
                            $scope.userEvents.push(result);
                        }
                    });
            }
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.select = function(event) {
            $localStorage.set('leftSearchModal', 'true');
            if(event.type != "Fund") $state.go("app.event", {param:{id:event.eventId}}, {reload: true});
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
			$scope.events = $events.get();
			$scope.eventsDateAscending = $events.get('eventsDateAscending');
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
			//cordova.plugins.Keyboard.close();
			$localStorage.set('leftSearchModal', 'true');
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
			$ionicViewSwitcher.nextDirection('back');
			$state.go('app.home');
		}
	})

	.controller('ProfileCtrl', function($scope, $state, $ionicPopup) {
/*
		$scope.$on('$ionicView.beforeEnter', function () {
			$scope.setup();
			$scope.update();
			$scope.graph();
		});
*/

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
			$scope.currentDate = new Date();

			$scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			$scope.progress = [0, 0, 0];
			$scope.progressMonth = ["", "", ""];
			for (var i=2; i>=0; i--) { $scope.progressMonth[Math.abs(i-2)] = $scope.months[$scope.currentDate.getMonth()-(i+1)]; }

			for (var i = 0; i < $scope.events.length; i++) {
				var query = new Parse.Query("Event");
				query.get($scope.events[i], {
					success: function (object) {
						var date = object.attributes.date;
						alert(date+"\n"+$scope.currentDate);
						if (date >= $scope.currentDate) {
							var upcomingDate = date.getMonthFormatted() + "/" + date.getDate() + "/" + date.getFullYear();
							var upcomingEvent = {id: object.id, name: object.attributes.name, date: upcomingDate};
							$scope.upcoming.push(upcomingEvent);
							alert("pushjed");
						} else {
							var progressDate = $scope.currentDate;
							for (var j = 0; j < 3; j++) {
								progressDate.setMonth(progressDate.getMonth() - 1);
								if (date.getYear() == progressDate.getYear() && date.getMonth() == progressDate.getMonth()) {
									var start = object.attributes.startTime;
									var startHour = parseInt(start.split(":")[0]);
									var end = object.attributes.endTime;
									var endHour = parseInt(end.split(":")[0]);
									if (start.split(" ")[1] == "PM") startHour += 12;
									if (end.split(" ")[1] == "PM") endHour += 12;
									$scope.progress[j] += (endHour - startHour);
									$scope.hours += (endHour - startHour);
								}
							}
						}
						$scope.$apply();
						if ($scope.events.indexOf(object.id) == $scope.events.length - 1) {
							$scope.moneySaved = Math.round($scope.hours * 22.9 * 100) / 100;
							//$scope.graph();
						}
					}, error: function(object) {
						var alertMessage = "Error loading Event! Please contact support with this ID #: "+object.id;
						var alert = $ionicPopup.alert({
							title: alertMessage
						});
					}
				});
			}
			$scope.$broadcast('scroll.refreshComplete');
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
			document.getElementById("canvasWrapper").innerHTML = "";
			document.getElementById("canvasWrapper").innerHTML = "<canvas id=\"canvas\"></canvas>";
			//if(document.chart !== undefined) document.chart.destroy();
			var chart = document.getElementById("canvas").getContext("2d");
			document.chart = new Chart(chart).Bar(data, {responsive: true});
		};

		$scope.selectUpcoming = function(event) {
			$state.go("app.event", {param:{id:event.id}});
		};

		$scope.saveProfileChanges = function() {
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

	.controller('NewsCtrl', function($scope, $state, $ionicPopup) {

		$scope.news = [];
		$scope.newsCopy = {text: "", owner: "", id: "", type: ""};

		$scope.refresh = function() {
			var newsClass = Parse.Object.extend("News");
			var query = new Parse.Query(newsClass);

			query.find({
				success: function(results) {
					$scope.news = [];
					for (var i=0; i<results.length; i++) {
						var newNews = angular.copy($scope.newsCopy);
						newNews.text = results[i].get("text");
						newNews.owner = results[i].get("owner");
						newNews.id = results[i].get("eventId");
						newNews.type = results[i].get("type");
						$scope.news.push(newNews);
					}
					$scope.$apply();
				}, error: function(results) {
					var alert = $ionicPopup.alert({
						title: "Error refreshing the newsfeed!"
					});
					$scope.$broadcast('scroll.refreshComplete');
					return;
				}
			});
			$scope.$broadcast('scroll.refreshComplete');
		};

		$scope.select = function(newsItem) {
			if(newsItem.type == "event") $state.go("app.event", {param:{id:newsItem.id}});
			$state.go("app.event", {param:{id:newsItem.id}});
		};
	})

	.controller('NewsSingleCtrl', function ($scope, $stateParams) {
		//alert($stateParams.param.id);
	})

	.controller('CreateEventCtrl', function($scope, $state, $ionicPopup, $ionicHistory) {
		$scope.info = {name: "", description: "", location: "", date: "", startTime: "", endTime: "", contact: "", contactInfo: "", url: ""};
		$scope.creator = Parse.User.current().get('username');

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

			for (var key in $scope.info) {
				if (key != "url" && $scope.info[key] == "") {
					var alert = $ionicPopup.alert({
						title: "Please fill in all the required fields!"
					});
					return;
				}
			}

			var dateList = $scope.info.date.split("/");
			var date = new Date(parseInt(dateList[2]), parseInt(dateList[0]), parseInt(dateList[1]), 0, 0, 0, 0);

			var EventClass = Parse.Object.extend("Event");
			var event = new EventClass();

			event.set("name", $scope.info.name);
			event.set("owner", $scope.creator);
			event.set("description", $scope.info.description);
			event.set("location", $scope.info.location);
			event.set("date", date);
			event.set("startTime", $scope.info.startTime);
			event.set("endTime", $scope.info.endTime);
			event.set("contact", $scope.info.contact);
			event.set("contactInfo", $scope.info.contactInfo);
			event.set("url", $scope.info.url);

			event.save(null,{
				success: function(result) {
					event.set("eventId", result.id);
					event.save(null, {
						success: function(result) {
						}, error: function(result) {
							var alert = $ionicPopup.alert({
								title: "Error providing Calendar entry ID!"
							});
							return;
						}
					});
					$scope.info = {name: "", description: "", location: "", date: "", startTime: "", endTime: "", contact: "", contactInfo: "", url: ""};
					$ionicHistory.nextViewOptions({
						disableBack: true,
					});
					if(!injected) $state.go("app.home", {}, {refresh: true});
				}, error: function(result) {
					var alert = $ionicPopup.alert({
						title: "Error creating event!"
					});
					return;
				}
			});
		};
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

	.controller('EventCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicPopup) {

		$scope.$on('$ionicView.beforeEnter', function () {
			$scope.update();
		});

		$scope.update = function() {
			$scope.info = {signedUp: false};

			$scope.eventsString = Parse.User.current().get('events');
			if ($scope.eventsString !== undefined) $scope.events = $scope.eventsString.split(", ");
			else $scope.events = [];

			if ($scope.events.indexOf($stateParams.param.id) >= 0) $scope.info.signedUp = true;

			var query = new Parse.Query("Event");
			query.get($stateParams.param.id, {
				success: function (object) {
					$scope.name = object.attributes.name;
					$scope.date = object.attributes.date;
					$scope.startTime = object.attributes.startTime;
					$scope.endTime = object.attributes.endTime;
					$scope.location = object.attributes.location;
					$scope.contact = object.attributes.contact;
					$scope.contactInfo = object.attributes.contactInfo;
					$scope.description = object.attributes.description;
					$scope.url = object.attributes.url;
					$scope.$apply();
				}
			});
		};

		$scope.signUp = function() {
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
					return;
			}});
		};

		$scope.remove = function() {
			$scope.events.splice($scope.events.indexOf($stateParams.param.id), 1);
			var newEvents = "";
			alert($scope.events.length);
			for (var i=0; i<$scope.events.length; i++) {
				alert($scope.events[i]);
				if (i != 0) newEvents += ", "+$scope.events[i];
				else newEvents += $scope.events[i];
			}
			Parse.User.current().set("events", newEvents);
			Parse.User.current().save(null, {
			success: function(result) {
				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go("app.profile", {}, {refresh: true} );
			}, error: function(result) {
				var alert = $ionicPopup.alert({
					title: "Error removing event from calendar!"
				});
					return;
			}});
		};

	})

	.controller('CalCtrl', function($scope, $state) {
		//date info
		var date = new Date();
		var currMonth = date.getMonth();
		var currYear = date.getFullYear();
		var day = date.getDay();

		var months = ["January","February","March","April","May","June","July","August", "September","October","November","December"];

		$scope.month = months[currMonth];
		$scope.year = currYear;
		$scope.day = day;

		//decrements month
		$scope.prevM = function() {

			currMonth--;
			if(currMonth<0) {
				currMonth = 11;
				currYear--;
			}

			$scope.month = months[currMonth];
			$scope.year = currYear;
		};

		//increments month
		$scope.nextM = function() {

			currMonth++;
			if(currMonth>11) {
				currMonth = 0;
				currYear++;
			}

			$scope.month = months[currMonth];
			$scope.year = currYear;
		};

		$scope.goToDay = function(month, year, cellClicked){
			//calculate day in month based on cellClicked
			var day1 = new Date(year, months.indexOf(month), 1);
			var startDay = day1.getDay();
			var dayClicked = cellClicked - startDay;

			//set day variable
			$scope.day = dayClicked;

			$state.go("app.calendarSingle", {'theMonth':$scope.month, 'theYear':$scope.year, 'theDay':$scope.day, 'monthInd':months.indexOf($scope.month)});
		}
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
            $ionicModal.fromTemplateUrl('/templates/tutorial.html', {
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
            $ionicModal.fromTemplateUrl('/templates/tutorial.html', {
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
    });
