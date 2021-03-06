'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$scope.credentials.profile = $scope.stringFile;
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.profilePhoto = function ($files) {

				$scope.file = $files;
				$scope.stringFile = [];
				for ( var i in $scope.file ) {
					var reader = new FileReader();
					reader.onload = function(e) {
					   $scope.stringFile.push({path: e.target.result});
					};
					reader.readAsDataURL($scope.file[i]);	
				}
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/'); //After siogn in i should go to this route
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);