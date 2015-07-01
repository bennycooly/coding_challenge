angular.module('myApp.directives', [])

	.directive('focusMe', function($timeout) {
		return {
			restrict: 'A',
			scope: {
				focusMe: '='
			},
			link: function(scope, element) {
				console.log(scope);
				scope.$watch('focusMe', function (input) {
					if (input == 'username') {
						$timeout(function() {
							console.log(" adding focus to element");
							console.log(element.children()[0]);
							element.children()[0].focus();
							/*if (ionic.Platform.isAndroid()) {
								cordova.plugins.Keyboard.show();
							}*/
						}, 1500);
					}
					else if (input == 'password') {
						$timeout(function() {
							console.log(" adding focus to element");
							console.log(element.children()[1]);
							element.children()[1].focus();
							/*if (ionic.Platform.isAndroid()) {
								cordova.plugins.Keyboard.show();
							}*/
						}, 1500);
					}
				});
			}
		};
	});