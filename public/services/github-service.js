(function() {
	'use strict';

	angular
	  .module('coderFriends')
	  .service('ghService', ghService);

	ghService.$inject = ['$http'];

	function ghService($http) {
		this.getFollowing = function() {
			return $http.get('/api/github/following').then(function(res) {
				return res.data
			})
		}

		this.getFriendActivity = function(user) {
			return $http.get('/api/github/'+user+'/events').then(function(res) {
				return res.data;
			})
		}
	}
})();