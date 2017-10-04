'use strict';
mimicTrading.controller('termsconditionsCtrl', ['$scope', '$state', 'RestSvr', '$rootScope','termsconditionsSvr',
	($scope, $state, RestSvr, $rootScope, termsconditionsSvr) => {
		
		$scope.$on('$viewContentLoaded', () => {
			/**
			 * Initialize the jquery components when view contents loaded properly
			 */
			termsconditionsSvr.init();			

		    TableAjax.init({
		    	url: 'cms/list/',
		    	columns: [
	                { "data": "id", "orderable": false },
                    { "data": "title" },
                    { "data": "type" },
                    { "data": "status" },
                    { "data": "created_date" },
                    { "data": "action", "orderable": false }
	            ]
		    });
		});
	}
]);
