angular.module('myApp.controllers', ['myApp.services'])

	.controller('AppCtrl', function ($scope, $state, $ionicLoading, $timeout, $user) {

		$scope.logout = function() {
			console.log('logging out');
			$user.logout();
			console.log($user.firstName);
			Parse.User.logOut();
			$ionicLoading.show({
				template: '<p>Logging out...</p><ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>'
			});
			$timeout( function() {
				$state.go('login', {clear: true}, {reload: true});
			}, 1000);
		};

	})

	.controller('WelcomeCtrl', function($state) {
		$state.go('login', {}, {reload: true});
	})

	.controller('LoginCtrl', function ($scope, $state, $rootScope, $ionicPopup, $ionicLoading, $timeout, $user) {

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});
		$scope.$on('$ionicView.beforeEnter', function() {
			// Form data for the login modal
			$scope.loginData = {};

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
		});

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
					$user.updateLocalStorage();
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
					$scope.clear();
					/*$state.go('app.home', {clear: true}, {refresh: true});*/
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

	.controller('HomeCtrl', function($scope, $state, $ionicHistory, $ionicLoading, $timeout, $localStorage, $user, $events, $ionicBackdrop) {
		$scope.$on('$ionicView.beforeEnter', function () {
			$user.updateLocalStorage();
			var user = $user.get();
			console.log(user.firstName);
			console.log(Parse.User.current().get('firstName'));
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

			$scope.firstName = user.firstName;
			$timeout( function() {
				$ionicLoading.hide();
			}, 1000);

			$scope.isActive = false;
			$scope.menuOutlinePressed = false;
			$scope.menuBackgroundPressed = false;
			$scope.menuIconPressed = false;
			$scope.menuText = false;
			$scope.menuOpen = false;
			$scope.menuAnimate = false;
			$scope.menuClicked = false;
			$scope.showBackdrop = false;
		});

		$scope.toggleMenu = function(event) {
			//$ionicBackdrop.retain();
			event.preventDefault();
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
			/*$scope.menuOpen = false;*/
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$timeout(function() {
				switch(state) {
					case 'profile':
						$state.go('app.profile');
						break;
					case 'event':
						$state.go('app.create_event');
						break;
					case 'newsfeed':
						$state.go('app.newsfeed');
						break;
					case 'calendar':
						$state.go('app.calendar');
						break;
					case 'search':
						$state.go('app.search');
						break;
				}
			}, 300);

		};
		//close the menu if it's open
		$scope.menuClose = function() {
			console.log('clicked');
			if ($scope.isActive) {$scope.toggleMenu(event);}
			/*if ($scope.menuOutlinePressed) {$scope.menuOutlinePressed = !$scope.menuOutlinePressed;}
			if ($scope.menuBackgroundPressed) {$scope.menuBackgroundPressed = !$scope.menuBackgroundPressed;}
			if ($scope.menuIconPressed) {$scope.menuIconPressed = !$scope.menuIconPressed;}
			if ($scope.menuText) {$scope.menuText = !$scope.menuText;}
			if ($scope.menuOpen) {$scope.menuOpen = !$scope.menuOpen;}
			if ($scope.menuAnimate) {$scope.menuAnimate = !$scope.menuAnimate;}
			if ($scope.showBackdrop) {$scope.showBackdrop = !$scope.showBackdrop;}*/
		};
	})

	.controller('ProfileCtrl', function($scope, $state) {
		var currentUser = Parse.User.current();

		$scope.id = currentUser.get('username');
		$scope.fullName = currentUser.get('firstName')+" "+Parse.User.current().get('lastName');
		$scope.eventsString = currentUser.get('events');
		if($scope.eventsString !== undefined) $scope.events = $scope.eventsString.split(", ");
		else $scope.events = [];
		$scope.hours = currentUser.get('hours');

		$scope.upcoming = [];
		$scope.currentDate = new Date();
		if ($scope.events.length != 0) {
			for (var i=0; i<$scope.events.length; i++) {
				var query = new Parse.Query("Event");
				query.get($scope.events[i], {
					success: function(object) {
						var date = object.attributes.date;
						var testDate = new Date(parseInt(date.split("/")[2]), parseInt(date.split("/")[0])-1, parseInt(date.split("/")[1]), 0, 0, 0, 0);
						if (testDate >= $scope.currentDate) {
							var upcomingEvent = {id: object.id, name: object.attributes.name, date: date};
							$scope.upcoming.push(upcomingEvent);
						} else {
							// Calculate hours
						}
						$scope.$apply();
					}
				});
			}
		}

		$scope.info = {firstName: currentUser.get('firstName'), lastName: currentUser.get('lastName'), error: false};

		$scope.saveProfileChanges = function() {
			currentUser.set('firstName', $scope.info.firstName);
			currentUser.set('lastName', $scope.info.lastName);
			currentUser.save(null, { success: function(result) { $scope.info.error = false; }, error: function(result) {
				$scope.info.error = true;
				return;
			}});
			$state.go("app.settings", {}, {refresh: true});
		};
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
			// If the news type is event do the below
			$state.go("app.event", {param:{id:newsItem.id}});
			if(newsItem.type == "event") $state.go("app.event", {param:{id:newsItem.id}});
		};
	})

	.controller('NewsSingleCtrl', function ($scope, $stateParams) {
		//alert($stateParams.param.id);
	})

	.controller('CreateEventCtrl', function($scope, $state, $ionicPopup) {
		$scope.info = {name: "", description: "", location: "", date: "", startTime: "", endTime: "", contact: "", contactInfo: "", url: "", error: false};
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
				if (key != "url" && key != "error" && $scope.info[key] == "") {
					var alert = $ionicPopup.alert({
						title: "Please fill in all the required fields"
					});
					return;
				}
			}

			var EventClass = Parse.Object.extend("Event");
			var event = new EventClass();

			event.set("name", $scope.info.name);
			event.set("owner", $scope.creator);
			event.set("description", $scope.info.description);
			event.set("location", $scope.info.location);
			event.set("date", $scope.info.date);
			event.set("startTime", $scope.info.startTime);
			event.set("endTime", $scope.info.endTime);
			event.set("contact", $scope.info.contact);
			event.set("contactInfo", $scope.info.contactInfo);
			event.set("url", $scope.info.url);

			event.save(null,{
				success: function(result) {
					var NewsClass = Parse.Object.extend("News");
					var news = new NewsClass();

					news.set("text", "New Event: "+result.attributes.name);
					news.set("owner", $scope.creator);
					news.set("type", "event");
					news.set("eventId", result.id);
					news.save(null, {
						success: function(result) {
						}, error: function(result) {
							var alert = $ionicPopup.alert({
								title: "Error creating newsfeed post!"
							});
							return;
						}
					});

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

					if(!injected) $state.go("app.profile", {}, {refresh: true});
				}, error: function(result) {
					var alert = $ionicPopup.alert({
						title: "Error creating event!"
					});
					return;
				}
			});
		};
	})

	.controller('EventCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicPopup) {

		$ionicHistory.nextViewOptions({
			disableBack: true
		});

		$scope.info = { signedUp: false };

		$scope.eventsString = Parse.User.current().get('events');
		if($scope.eventsString !== undefined) $scope.events = $scope.eventsString.split(", ");
		else $scope.events = [];

		if($scope.events.indexOf($stateParams.param.id) >= 0) $scope.info.signedUp = true;

		var query = new Parse.Query("Event");
		query.get($stateParams.param.id, {
			success: function(object) {
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

		$scope.signUp = function() {
			var currentUser = Parse.User.current();
			var events = currentUser.get("events");
			var newEvents = events+", "+$stateParams.param.id;
			currentUser.set("events", newEvents);
			currentUser.save(null, {
			success: function(result) {
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
			for (var i=0; i<$scope.events.length; i++) {
				newEvents += $scope.events[i]+", ";
			}
			Parse.User.current().set("events", newEvents);
			Parse.User.current().save(null, {
			success: function(result) {
				$state.go("app.profile", {}, {refresh: true} );
			}, error: function(result) {
				var alert = $ionicPopup.alert({
					title: "Error removing event from calendar!"
				});
					return;
			}});
		};

	});
