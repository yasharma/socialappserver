'use strict';
mimicTrading.controller('subscriptionViewCtrl', ['$scope', '$state','subscription','appSvr',
	($scope, $state, subscription, appSvr) => {
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});

		/**
		 * Request would only sent if state params has id
		 * @param  {integer} $state.params.id [subscription id]
		 * @return {Object}                  [subscription data]
		 */
		 
        $scope.subscriptioninfo = subscription.record;

		/**
		 * it would take you to the edit page
		 * 
		 */
		$scope.goToEdit = () => {
			$state.go('editSubscription', {id: $state.params.id});
		};

		$scope.goBack = () => {
			$state.go('subscriptions');
			// var queryString = $location.search();
			// $state.go((queryString) ? ((queryString.back === 'strategies') ? 'strategies':'subscriptions'):'subscriptions');
		};
	}
]);
