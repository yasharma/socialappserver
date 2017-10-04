'use strict';
mimicTrading.controller('termsconditionsCreateCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','termsconditionsSvr',
	($scope, $state, RestSvr, $rootScope, appSvr, termsconditionsSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		
		$scope.cms_type = termsconditionsvr.getCmsTypes();

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
	}
]);
