'use strict';
mimicTrading.controller('homepageCreateCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','Upload',
	($scope, $state, RestSvr, $rootScope, appSvr, Upload) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		
	   $scope.new_homepage = (isValid,data) => {
			if( !isValid ){
				App.scrollTop();
				return;
			}
			$scope.isLoading = true;
			Upload.upload({
				url: baseUrl('homepage/add'),
				data: data
			})
			.then(function (response) {
				$state.go('newhomepage');
			})
			.catch(function (errors) {
				App.alert({type: ('danger'), icon: ( 'warning'), message: errors.message, container: $rootScope.settings.errorContainer, place: 'prepend'});
			})
			.finally(function () {
				$scope.isLoading = false;
			});
		};
	}
]);