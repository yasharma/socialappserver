'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){
	/**
	 * Common Resolver for two states, 
	 * it will fetch all the trader by id ,
	 * this will populate during edit and view trader,
	 * JUST Following D.R.Y (don't repeat yourself)
	 * @type {Object}
	 */
	let subscriptionResolver = {
		subscription: ['subscriptionSvr', '$stateParams', (subscriptionSvr, $stateParams) => subscriptionSvr.getSubscriptionById($stateParams.id)]
	};
	$stateProvider
	.state('subscriptions',{
		url: '/subscriptions',
		controller: 'subscriptionCtrl',
		templateUrl: '/subscriptions/views/subscriptionListing.html',
		data: {pageTitle: 'Subscription Management'},
		resolve: {
		    deps: ['$ocLazyLoad', function($ocLazyLoad) {
		        return $ocLazyLoad.load({
		            name: 'mimicTrading',
		            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
		            files: [
		                
		                '/assets/global/plugins/datatables/datatables.min.css', 
                        '/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                        '/assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '/assets/global/plugins/datatables/datatables.all.min.js',
                        '/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '/assets/global/scripts/datatable.min.js',
		            ] 
		        });
		    }]
		},
		authenticate: true
	})
	.state('newSubscription',{
		url: '/new-subscription',
		controller: 'subscriptionCtrl',
		templateUrl: '/subscriptions/views/new_subscription.html',
		data: {pageTitle: 'Add New Subscription'},
	    resolve: {
		    deps: ['$ocLazyLoad', function($ocLazyLoad) {
		        return $ocLazyLoad.load({
		            name: 'mimicTrading',
		            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
		            files: [
		                
		                '/assets/global/plugins/datatables/datatables.min.css', 
                        '/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                        '/assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '/assets/global/plugins/datatables/datatables.all.min.js',
                        '/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '/assets/global/scripts/datatable.min.js',
		            ] 
		        });
		    }]
		},
		authenticate: true
	})
	.state('viewSubscription',{
		url: '/view-subscription/:id',
		controller: 'subscriptionViewCtrl',
		templateUrl: '/subscriptions/views/view_subscription.html',
		data: {pageTitle: 'Subscription Detail'},
		authenticate: true,
		resolve: subscriptionResolver
	})
	.state('editSubscription',{
		url: '/edit-subscription/:id',
		controller: 'subscriptionEditCtrl',
		templateUrl: '/subscriptions/views/edit_subscription.html',
		data: {pageTitle: 'Update Subscription Detail'},
		authenticate: true,
		resolve: subscriptionResolver
	});
}]);