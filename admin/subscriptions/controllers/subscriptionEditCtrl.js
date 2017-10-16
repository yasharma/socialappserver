'use strict';
mimicTrading.controller('subscriptionEditCtrl', ['$scope', '$state','subscription', 'Upload','appSvr','$rootScope',
	function($scope, $state, subscription, Upload, appSvr, $rootScope){
		$scope.$on('$viewContentLoaded', function() {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();
		});
         
		$scope.subscription = subscription.record;
		if( $scope.subscription.image ) {
			$scope.subscription.image = $scope.subscription.image.path;	
		}
		

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
			
			let id = ($scope.subscription._id);
			$scope.isLoading = true;
			Upload.upload({
				url: baseUrl(`subscription/edit/${id}`),
				data: $scope.subscription,
				method: 'PUT'
			})
			.then(function (response) {
				$state.go('subscriptions');
			})
			.catch(function (error) {

				if( error.data ) {
					let msg=error.data.message;
                	App.alert({type: ('danger'), icon: ( 'danger'), message: msg, container: $rootScope.settings.errorContainer, place: 'prepend'});
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
