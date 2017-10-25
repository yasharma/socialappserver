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
	let paymentResolver = {
		payment: ['paymentSvr', '$stateParams', (paymentSvr, $stateParams) => paymentSvr.getPaymentById($stateParams.id)]
	};
	$stateProvider
	.state('payments',{
		url: '/payments',
		controller: 'paymentCtrl',
		templateUrl: '/payments/views/paymentListing.html',
		data: {pageTitle: 'Payment Management'},
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
	.state('viewPayment',{
		url: '/view-payment/:id',
		controller: 'paymentViewCtrl',
		templateUrl: '/payments/views/view_payment.html',
		data: {pageTitle: 'Payment Detail'},
		authenticate: true,
		resolve: paymentResolver
	});
	// .state('newUser',{
	// 	url: '/new-payment',
	// 	controller: 'paymentCtrl',
	// 	templateUrl: '/payments/views/new_payment.html',
	// 	data: {pageTitle: 'Add New Customer'},
	// 	authenticate: true
	// })
	// .state('editUser',{
	// 	url: '/edit-payment/:id',
	// 	controller: 'paymentEditCtrl',
	// 	templateUrl: '/payments/views/edit_payment.html',
	// 	data: {pageTitle: 'Update Customer Detail'},
	// 	authenticate: true,
	// 	resolve: paymentResolver
	// });
}]);