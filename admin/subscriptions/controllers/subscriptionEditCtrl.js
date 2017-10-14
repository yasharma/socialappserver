'use strict';
mimicTrading.controller('subscriptionEditCtrl', ['$scope', '$state','subscription', 'Upload','appSvr',
	function($scope, $state, subscription, Upload, appSvr){
		$scope.$on('$viewContentLoaded', function() {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
         
		$scope.subscription = subscription.record;

	    $scope.addNewInput = function () {
	        $scope.subscription.features.push("");
	    };
	    $scope.removeInput = function (input) {
	        var index = $scope.subscription.features.indexOf(input);
	        $scope.subscription.features.splice(index, 1);
	    };

		/**
		 * Check if form is valid and send the data to server
		 * @param  {isValid} isValid [form.valid]
		 * @return {redirect to subscription listing on successful insertion}
		 */
		$scope.edit_subscription = function (isValid) {

			if( !isValid ){
				App.scrollTop();
				return;
			}
		
			$scope.isLoading = true;
			Upload.upload({
				url: baseUrl(`subscription/edit/${subscription._id}`),
				data: $scope.subscription,
				method: 'PUT'
			})
			.then(function (response) {
				$state.go('subscriptions');
			})
			.catch(function (error) {
				if( error.data ) {
					angular.forEach(error.data, function (value, prop) {
						$scope.editSubscriptionForm[prop].$setValidity('unique', false);
					});
					App.scrollTop();
				}
			})
			.finally(function () {
				$scope.isLoading = false;
			});
		};

		/**
		 * this will clear the form error
		 * @param  input name attr
		 */
		$scope.clear = function (name, form) {
			form[name].$setValidity('unique', true);
		};
	}
]);
