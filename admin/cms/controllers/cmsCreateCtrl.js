'use strict';
mimicTrading.controller('cmsCreateCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','cmsSvr','Upload',
	($scope, $state, RestSvr, $rootScope, appSvr, cmsSvr, Upload) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		
		$scope.cms_type = cmsSvr.getCMSTypes();

		$scope.new_cms = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			RestSvr.post('cms/add', $scope.cms)
			.then(response => {
				$state.go('cms');
			})
			.catch(errors => {
				App.alert({type: ('danger'), icon: ( 'warning'), message: errors.message, container: $rootScope.settings.errorContainer, place: 'prepend'});
			})
			.then(() => {
				$scope.isLoading = false;
			});
		};

		$scope._new_cms = (isValid,_data) => {
			if( !isValid ){
				App.scrollTop();
				return;
			}
			$scope.isLoading = true;
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
