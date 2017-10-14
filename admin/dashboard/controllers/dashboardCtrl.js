'use strict';
angular.module('mimicTrading').controller('dashboardCtrl', ['$scope', '$location', '$rootScope','RestSvr',
	function($scope, $location, $rootScope, RestSvr){
		$scope.$on('$viewContentLoaded', function() {   
		        // initialize core components
	        App.initAjax();
	    });

	    // set sidebar closed and body solid layout mode
	    $rootScope.settings.layout.pageContentWhite = true;
	    $rootScope.settings.layout.pageBodySolid = false;
	    $rootScope.settings.layout.pageSidebarClosed = false;
	    $rootScope.settings.hideLoginForm = true;
	    console.log('I am loaded properly!!!');

	    RestSvr.get('totalCount')
	    .then(({record}) => $scope.count = record.count)
	    .catch(errors => App.alert({type: ('danger'), icon: ( 'warning'), message: errors.message, container: $rootScope.settings.errorContainer, place: 'prepend'}));
	}
]);