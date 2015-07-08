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
			$scope.menuClicked = false;
			$scope.showBackdrop = false;
		});

		$scope.toggleMenu = function(event) {
			//$ionicBackdrop.retain();
			var items = angular.element('.circle a');
			event.preventDefault();
			$scope.isActive = !$scope.isActive;
			$scope.menuOutlinePressed = !$scope.menuOutlinePressed;
			$scope.menuBackgroundPressed = !$scope.menuBackgroundPressed;
			$scope.menuIconPressed = !$scope.menuIconPressed;
			$scope.menuText = !$scope.menuText;
			$scope.menuOpen = !$scope.menuOpen;
			$scope.showBackdrop = !$scope.showBackdrop;
		};

		$scope.menuGo = function(state) {
			$scope.menuClicked = state;
			$scope.menuOpen = false;
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			switch(state) {
				case 'profile':
					$timeout(function() {
						$state.go('app.profile');
					}, 500);
					break;
				case 'event':
					$timeout(function() {
						$state.go('app.create_event');
					}, 500);
					break;
				case 'newsfeed':
					$timeout(function() {
						$state.go('app.newsfeed');
					}, 500);
					break;
				case 'calendar':
					$timeout(function() {
						$state.go('app.calendar');
					}, 500);
					break;
				case 'search':
					$timeout(function() {
						$state.go('app.search');
					}, 500);
					break;
			}

		};

		$scope.menuClose = function() {
			console.log('clicked');
			if ($scope.isActive) {$scope.isActive = !$scope.isActive;}
			if ($scope.menuOutlinePressed) {$scope.menuOutlinePressed = !$scope.menuOutlinePressed;}
			if ($scope.menuBackgroundPressed) {$scope.menuBackgroundPressed = !$scope.menuBackgroundPressed;}
			if ($scope.menuIconPressed) {$scope.menuIconPressed = !$scope.menuIconPressed;}
			if ($scope.menuOpen) {$scope.menuOpen = !$scope.menuOpen;}
			if ($scope.showBackdrop) {$scope.showBackdrop = !$scope.showBackdrop;}
		};
	})

	.controller('ProfileCtrl', function($scope, $state) {
		var currentUser = Parse.User.current();

		$scope.id = currentUser.get('username');
		$scope.fullName = currentUser.get('firstName')+" "+Parse.User.current().get('lastName');
		$scope.recentString = currentUser.get('recent');
		$scope.recent = $scope.recentString.split(", ");
		$scope.hours = currentUser.get('hours');

		$scope.pass = {first: "", second: "", update: false};
		$scope.info = {error: false};

		$scope.saveProfileChanges = function() {
			if ($scope.pass.first != "" && $scope.pass.first == $scope.pass.second) {
				$scope.pass.update = true;
				currentUser.set("password", $scope.pass.first);
			}

			currentUser.save(null, { success: function(result) { $scope.info.error = false; }, error: function(result) {
				$scope.info.error = true;
				return;
			}});

			$scope.pass = {first: "", second: "", update: false};

			$state.go("app.settings", {}, {refresh: true});
		};
	})

	.controller('NewsCtrl', function($scope, $state) {

		$scope.news = [];
		$scope.newsCopy = {text: "", owner: "", id: "", type: ""};
		$scope.error = {show: false};

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
					$scope.error.show = false;
					$scope.$apply();
				}, error: function(results) {
					$scope.error.show = true;
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

	.controller('CreateEventCtrl', function($scope, $state) {
		$scope.info = {name: "", description: "", location: "", date: "", startTime: "", endTime: "", contact: "", contactInfo: "", url: "", error: false};
		$scope.creator = Parse.User.current().get('username');

		$scope.inject = function() {
			$scope.info = { name: 'Youth First Family Dinner Night', description: 'Friday Night Family Dinner at Youth First, a Resource Center Dallas program. LEAGUE at AT&T will be hosting the evening by preparing a simple meal for 20-30 youth, including serving and cleaning-up. Volunteers are needed to help LEAGUE prepare meals.', location: '3918 Harry Hines Blvd. Dallas, TX 75219', date: '42216', startTime: '6:00pm', endTime: '8:00pm', contact: 'Richard Wilson', contactInfo: 'rw2675@att.com', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'North Texas Food Bank with AT&T Pioneers', description: 'Sorting, boxing, and/or bagging food in a warehouse environment. Helping the North Texas Food Bank (NTFB) feed hungry people. Volunteers needed.', location: '4500 S. Cockrell Hill Road Dallas, TX 75236', date: '42263', startTime: '1:00pm', endTime: '3:30pm', contact: 'Elisabet Freer', contactInfo: 'ef7394@att.com', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Parsons Team Volunteering at Minnie\'s Food Pantry', description: 'Volunteers will assist with inspecting, sorting, and boxing donated food, stocking shelves, and providing red carpet concierge service to our clients.', location: '3033 W. Parker Road, Suite 117 Plano, TX 75023', date: '42207', startTime: '8:00am', endTime: '11:30am', contact: 'Sindoori Murugavel', contactInfo: 'sm786t@att.com', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Homeless Veterans Stand Down', description: 'Stand Down is a one day event providing supplies and services to homeless Veterans, such as food, shelter, clothing, health screenings and VA Social Security benefits counseling. Veterans can also receive referrals to other assistance such as health care, housing solutions, employment, substance use treatment and mental health counseling. they are collaborative events, coordinated between local VA Medical Centers, other government agencies and community-based homeless service providers. Volunteers are needed to help provide food, clothing and other services.', location: '4500 S. Lancaster Rd. Dallas, TX 75216', date: '42314', startTime: '7:00am', endTime: '3:00pm', contact: 'Cheryl Nelms', contactInfo: 'cn4113@att.com', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Sleeping Mats for the Homeless', description: 'Project Mission: Pioneers intent is to recycle plastic bags and make them useful by crocheting them into sleeping mats and donate them to local shelters, churches or other like organizations for distribution to the homeless community.', location: 'Contact Danielle for Location', date: 'Contact Danielle for Dates', startTime: '6:00am', endTime: '11:00pm', contact: 'Danielle Carnicom', contactInfo: 'dc1568@att.com', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Oasis-Texas Habitat for Humanity', description: 'Oasis-Texas partnered with Habitat for Humanity to provide our members volunteer opportunities. Habitat for Humanity is currently building a home in East Plano that will one day shelter a family and provide them the means to build a brighter future for themselves and their children.', location: '904 13th St. Plano, TX 75074', date: 'Contact Habitat for Humanity for Date', startTime: '8:00am', endTime: '3:00pm', contact: 'Not Provided', contactInfo: 'Not Provided', url: '' };
			$scope.createEvent(true);
			$scope.info = { name: 'Dallas Life: New Life for the Homeless', description: 'We are in need of volunteers to help with childcare during our weekly chapel services. Volunteers will care for potty trained children between ages of 2 and 5 years old.', location: 'Not Provided', date: 'Not Provided', startTime: '6:00pm', endTime: '7:00pm', contact: 'Not Provided', contactInfo: 'Not Provided', url: '' };
			$scope.createEvent(true);
		};

		$scope.createEvent = function(injected) {

			for (var key in $scope.info) {
				if (key != "url" && key != "error" && $scope.info[key] == "") {
					$scope.info.error = true;
					return;
				}
			}
			$scope.info.error = false;

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
					news.save();

					if(!injected) $state.go("app.profile", {}, {refresh: true});
				}
			});
		};
	})

	.controller('EventCtrl', function($scope, $stateParams) {

		$scope.signedUp = false;

		var query = new Parse.Query("Event");
		query.get($stateParams.param.id, {
			success: function(object) {
				$scope.name = object.attributes.name;
				$scope.date = object.attributes.date;
				$scope.startTime = object.attributes.startTime;
				$scope.endTime = object.attributes.endTime;
				$scope.location = object.attributes.location;
				$scope.description = object.attributes.description;
				$scope.$apply();
			}
		});

		$scope.signup = function() {

		};

	});
