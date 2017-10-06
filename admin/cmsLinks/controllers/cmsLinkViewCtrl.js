'use strict';
mimicTrading.controller('cmsLinkViewCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','cmsLink',
	($scope, $state, RestSvr, $rootScope, appSvr, cmsLink) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
		$scope.cmsLink = cmsLink.record;
		$scope.goToEdit = () => $state.go('editCmsLink',{id: $scope.cmsLink._id});
	}
]);
