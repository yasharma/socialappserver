'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){

	let cmsResolver = ['cmsSvr', '$stateParams', (cmsSvr, $stateParams) => cmsSvr.getCMSById($stateParams.slug)];

	$stateProvider
	.state('newhomepage',{
		url: '/new-homepage',
		controller: 'homepageCreateCtrl',
		templateUrl: 'homepage/views/new_homepage.html',
		data: {pageTitle: 'New Homepage'},
		authenticate: true
	});
/*	.state('edithomepage',{
		url: '/edit-homepage/:slug',
		controller: 'homepageEditCtrl',
		templateUrl: 'homepage/views/edit_homepage.html',
		data: {pageTitle: 'Update Homepage Detail'},
		authenticate: true,
		resolve: {
		    cms: cmsResolver
		}
	})
	.state('viewcms',{
		url: '/view-cms/:slug',
		controller: 'cmsViewCtrl',
		templateUrl: 'cms/views/view_cms.html',
		data: {pageTitle: 'View CMS Detail'},
		authenticate: true,
		resolve: {
		    cms: cmsResolver
		}
	});*/
}]);
