'use strict';
mimicTrading.controller('subscriptionCtrl', ['$scope', '$state', '$rootScope', 'Upload','appSvr','RestSvr',
	function($scope, $state, $rootScope, Upload, appSvr,RestSvr){
		
		$scope.$on('$viewContentLoaded', function() {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();

		    /**
		     * only Intialize datatable if current state is subscriptions
		     * @param  {String} $state.current.name [current state name]
		     */
		    if($state.current.name === 'subscriptions'){
			    // Intialize datatable
			    TableAjax.init({
			    	url: 'subscription/list',
			    	columns: [
		                { "data": "id", "orderable": false },
		                { "data": "name" },
		                { "data": "description" },
		                { "data": "price" },
		                { "data": "features" },  
		         		{ "data": "type" },
		         		{ "data": "status" },
		                { "data": "created_date" },
		                { "data": "action", "orderable": false }
		            ]
			    });
			}    
		});

		/**
		 * Check if form is valid and send the data to server
		 * @param  {isValid} isValid [form.valid]
		 * @return {redirect to subscription listing on successful insertion}
		 */
		$scope.new_subscription = function (isValid,data) {
			if( !isValid ){
				App.scrollTop();
				return;
			}
			$scope.isLoading = true;
			Upload.upload({
				url: baseUrl('subscription/add'),
				data: data,
				method: 'post'
			})
			.then(function (response) {
				$state.go('subscriptions');
			})
			.catch(function (error) {
				if( error.data ) {
					angular.forEach(error.data, function (value, prop) {
						$scope.newSubscriptionForm[prop].$setValidity('unique', false);
					});
					App.scrollTop();
				}
			})
			.finally(function () {
				$scope.isLoading = false;
			});
		};

		/**
		 * this will clear the
		 * @param  input name attr
		 */
		$scope.clear = function (name, form) {
			form[name].$setValidity('unique', true);
		};

	}
]);
