'use strict';
mimicTrading.controller('cmsEditCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','cms','cmsSvr','Upload',
	($scope, $state, RestSvr, $rootScope, appSvr, cms, cmsSvr, Upload) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.cms = cms.record;
		if( $scope.cms.banner_image ) {
			$scope.cms.banner_image = $scope.cms.banner_image.path;
		}
		
		$scope.edit_cms = (isValid, _data) => {
			if( !isValid ){
				return;
			}
			
			Upload.upload({
				url: baseUrl('cms/add'),
				data: _data
			})
			.then(function (response) {
				$state.go('cms');
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
