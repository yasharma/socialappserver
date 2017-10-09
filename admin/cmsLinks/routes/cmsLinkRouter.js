'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){

	let cmsLinkResolver = ['cmsLinkSvr', '$stateParams', (cmsLinkSvr, $stateParams) => cmsLinkSvr.getCmsLinkById($stateParams.id)];

	$stateProvider
	.state('cmsLink',{
		url: '/cms-links',
		controller: 'cmsLinkCtrl',
		templateUrl: 'cmsLinks/views/cmsLinks.html',
		data: {pageTitle: 'Manage CMS Links'},
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
	.state('newCmsLink',{
		url: '/new-cms-link',
		controller: 'cmsLinkCreateCtrl',
		templateUrl: 'cmsLinks/views/new_cms_link.html',
		data: {pageTitle: 'New CMS Link'},
		authenticate: true
	})
	.state('editCmsLink',{
		url: '/edit-cms-link/:id',
		controller: 'cmsLinkEditCtrl',
		templateUrl: 'cmsLinks/views/edit_cms_link.html',
		data: {pageTitle: 'Update CMS Links'},
		authenticate: true,
		resolve: {
		    cmsLink: cmsLinkResolver
		}
	})
	.state('viewCmsLink',{
		url: '/view-cms-link/:id',
		controller: 'cmsLinkViewCtrl',
		templateUrl: 'cmsLinks/views/view_cms_link.html',
		data: {pageTitle: 'View CMS Link Detail'},
		authenticate: true,
		resolve: {
		    cmsLink: cmsLinkResolver
		}
	});
}]);
