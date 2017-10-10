'use strict';
mimicTrading.controller('homepageEditCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','Upload','homepage',
	($scope, $state, RestSvr, $rootScope, appSvr, Upload, homepage) => {
		console.log('Hello');
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});

		$scope.homepage = homepage.record;
		$scope.homepage.banner_img.forEach(function (val, index) {
			$scope.homepage.banner_img[index]=val.path;
		});
		
	   	$scope.update_homepage = (isValid,data) => {
			if( !isValid ){
				App.scrollTop();
				return;
			}
			$scope.isLoading = true;
			Upload.upload({
				url: baseUrl('homepage/edit'),
				data: data
			})
			.then(function (response) {
				$state.go('viewhomepage');
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
