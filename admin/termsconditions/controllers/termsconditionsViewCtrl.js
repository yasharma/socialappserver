'use strict';
mimicTrading.controller('termsconditionsViewCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','termsconditions',
	($scope, $state, RestSvr, $rootScope, appSvr, termsconditions) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.termsconditions = termsconditions.record;
		$scope.goToEdit = () => $state.go('editTermsConditions',{id: $state.params.id});
	}
]);
