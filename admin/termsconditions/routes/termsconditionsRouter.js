'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){

	let termsconditionsResolver = ['termsconditionsSvr', '$stateParams', (termsconditionsSvr, $stateParams) => termsconditionsSvr.getTermsConditionsById($stateParams.id)];

	$stateProvider
	.state('termsconditions',{
		url: '/termsconditions',
		controller: 'termsconditionsCtrl',
		templateUrl: 'termsconditions/views/termsconditions.html',
		data: {pageTitle: 'Manage CMS'},
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
                        '/assets/global/scripts/datatable.min.js'
		            ] 
		        });
		    }]
		},
		authenticate: true
	})
	.state('newTermsConditions',{
		url: '/new-termsconditions',
		controller: 'termsconditionsCreateCtrl',
		templateUrl: 'termsconditions/views/new_termsconditions.html',
		data: {pageTitle: 'New Terms & Conditions'},
		authenticate: true
	})
	.state('editTermsConditions',{
		url: '/edit-termsconditions/:id',
		controller: 'termsconditionsEditCtrl',
		templateUrl: 'termsconditions/views/edit_termsconditions.html',
		data: {pageTitle: 'Update Terms & Conditions Detail'},
		authenticate: true,
		resolve: {
		    termsconditions: termsconditionsResolver
		}
	})
	.state('viewTermsConditions',{
		url: '/view-termsconditions/:id',
		controller: 'termsconditionsViewCtrl',
		templateUrl: 'termsconditions/views/view_termsconditions.html',
		data: {pageTitle: 'View Terms & Conditions Detail'},
		authenticate: true,
		resolve: {
		    termsconditions: termsconditionsResolver
		}
	});
}]);
