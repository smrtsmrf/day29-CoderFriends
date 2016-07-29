(function() {
	'use strict';

	angular
	  .module('coderFriends', [
	      'ui.router'
	  ]);
})();

(function() {
	'use strict';

	angular
	  .module('coderFriends')
	  .config(coderFriendsConfig);

	coderFriendsConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

	function coderFriendsConfig($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('login', {
			url: '/',
			template: '<button class="button btn"><a href="/auth/github"><i class="fa fa-github"></i> Login with Github</a></button>'
		})	

		.state('home', {
			url: '/home',
			templateUrl: './templates/home.html', 
			resolve: {
				friends: function(ghService) {
					return ghService.getFollowing();
				}
			}, 
			controller: function($scope, friends) {
				$scope.friends = friends;
			}
		})

		.state('friend', {
			url: '/friend/:github_username', 
			templateUrl: './templates/friend.html',
			resolve: {
				eventData: function(ghService, $stateParams) {
					return ghService.getFriendActivity($stateParams.github_username)
				}
			},
			controller: function($scope, eventData) {
				$scope.events = eventData;
			}
		})

		$urlRouterProvider.otherwise('/')
	}
})();

angular.module('coderFriends').config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.interceptors.push('myHttpInterceptor');
});

// register the interceptor as a service
angular.module('coderFriends').factory('myHttpInterceptor', function($q) {
    return {
        // optional method
        'responseError': function(rejection) {
            if (rejection.status == 403) {
                document.location = '/';
                return;
            }
            return $q.reject(rejection);
        }
    };
});