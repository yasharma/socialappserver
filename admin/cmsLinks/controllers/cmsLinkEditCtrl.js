'use strict';
mimicTrading.controller('cmsLinkEditCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','cmsLink',
	($scope, $state, RestSvr, $rootScope, appSvr, cmsLink ) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		
		$scope.cmsLink = cmsLink.record;
		
		$scope.edit_cmsLink = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			RestSvr.put('cmsLink/edit', $scope.cmsLink)
			.then(response => {
				$state.go('cmsLink');
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
