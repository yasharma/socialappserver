'use strict';
mimicTrading.controller('termsconditionsViewCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','termsconditionsSvr','cms',
	($scope, $state, RestSvr, $rootScope, termsconditionsSvr, cms) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			termsconditionsSvr.init();
		});
		$scope.cms = cms.record;
		$scope.goToEdit = () => $state.go('editTermsConditions',{id: $scope.cms.type});
	}
]);
