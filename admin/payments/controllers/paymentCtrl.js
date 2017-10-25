'use strict';
mimicTrading.controller('paymentCtrl', ['$scope','$state','appSvr',
	function($scope, $state, appSvr){
		
		$scope.$on('$viewContentLoaded', function() {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			appSvr.init();

			
		    /**
		     * only Intialize datatable if current state is payments
		     * @param  {String} $state.current.name [current state name]
		     */
		    if($state.current.name === 'payments'){
			    // Intialize datatable
			    TableAjax.init({
			    	url: 'payment/list',
			    	columns: [
		                { "data": "id", "orderable": false },
		                { "data": "customer_name" },
		                { "data": "email" },
		                { "data": "amount" },
		                { "data": "balance_transaction" },
		                { "data": "description" },
		                { "data": "plan_name" },  
		           		{ "data": "plan_price" },  
		           		{ "data": "plan_description" },  
   		                { "data": "status" },
		                { "data": "created_date" },
		                { "data": "action", "orderable": false }
		            ]
			    });
			}    
		});

	}
]);
