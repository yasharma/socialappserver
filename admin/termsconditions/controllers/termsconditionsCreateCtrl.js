'use strict';
mimicTrading.controller('termsconditionsCreateCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','termsconditionsSvr',
	($scope, $state, RestSvr, $rootScope, appSvr, termsconditionsSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		
		$scope.termsconditions_type = termsconditionsSvr.getTermsConditionsTypes();

		$scope.new_termscondition = (isValid) => {
			if( !isValid ){
				return;
			}
			
			$scope.isLoading = true;
			RestSvr.post('termsconditions/add', $scope.termsconditions)
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
