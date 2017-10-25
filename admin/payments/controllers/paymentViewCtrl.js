'use strict';

mimicTrading.controller('paymentViewCtrl', ['$scope', '$state','payment','appSvr',
	($scope, $state, payment, appSvr) => {
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});

		/**
		 * Request would only sent if state params has id
		 * @param  {integer} $state.params.id [payment id]
		 * @return {Object}                  [payment data]
		 */
        $scope.paymentinfo = payment.record[0];

		$scope.goBack = () => {
			$state.go('payments');
		};
	}
]);
