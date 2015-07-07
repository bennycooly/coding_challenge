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
							element.children()[0].focus();
							/*if (ionic.Platform.isAndroid()) {
								cordova.plugins.Keyboard.show();
							}*/
						}, 500);
					}
					else if (input == 'password') {
						$timeout(function() {
							element.children()[1].focus();
							/*if (ionic.Platform.isAndroid()) {
								cordova.plugins.Keyboard.show();
							}*/
						}, 500);
					}
				});
			}
		};
	});