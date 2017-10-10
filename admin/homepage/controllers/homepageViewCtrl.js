'use strict';
mimicTrading.controller('homepageViewCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','appSvr','homepage','$uibModal','homepageSvr',
	($scope, $state, RestSvr, $rootScope, appSvr, homepage, $uibModal, homepageSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		}); 
		$scope.homepage = homepage.record;
		$scope.goToEdit = () => $state.go('homepage');

		$scope.open = (action) => {
			let modalInstance = $uibModal.open({
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: '/confirmationDialog/views/confirmation_dialog.html',
				size: 'sm',
				controller: 'confirmationDialogCtrl',
				controllerAs: '$ctrl',
				resolve: { data: () => action }
			});

		    modalInstance.result.then(selectedItem => {
		    	if( selectedItem ) {
		    		homepageSvr.removeBannerImage(btoa(selectedItem))
		    		.then(response => $state.reload())
		    		.catch(handleCatch);
		    	}
		      
		    }, () => {
		      console.log('Modal dismissed at: ' + new Date());
		    });
  		};

  		let handleCatch = (errors) => App.alert({type: ('danger'), icon: ( 'warning'), message: errors.message, container: $rootScope.settings.errorContainer, place: 'prepend'});
	}
]);
