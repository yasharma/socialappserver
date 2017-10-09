'use strict';
mimicTrading.controller('homepageViewCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','homepage',
	($scope, $state, RestSvr, $rootScope, appSvr, homepage) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		}); 
		$scope.homepage = homepage.record[0];
		$scope.goToEdit = () => $state.go('edithomepage',{slug: $state.params.slug});
	}
]);
