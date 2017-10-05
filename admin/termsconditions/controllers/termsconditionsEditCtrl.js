'use strict';
mimicTrading.controller('termsconditionsEditCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','termsconditions','termsconditionsSvr',
	($scope, $state, RestSvr, $rootScope, appSvr, termsconditions, termsconditionsSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.termsconditions = termsconditions.record;
		
		$scope.edit_termsconditions = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			RestSvr.put('termsconditions/edit', $scope.termsconditions)
			.then(response => {
				$state.go('termsconditions');
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
