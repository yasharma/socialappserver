'use strict';

/* Application routes */
mimicTrading.config(['$stateProvider',function($stateProvider){

	let homepageResolver = ['homepageSvr', '$stateParams', (homepageSvr, $stateParams) => homepageSvr.getHomepageData()];

	$stateProvider
	.state('newhomepage',{
		url: '/new-homepage',
		controller: 'homepageCreateCtrl',
		templateUrl: 'homepage/views/new_homepage.html',
		data: {pageTitle: 'New Homepage'},
		authenticate: true
	})

	.state('viewhomepage',{
		url: '/view-homepage',
		controller: 'homepageViewCtrl',
		templateUrl: 'homepage/views/view_homepage.html',
		data: {pageTitle: 'View Homepage Management Detail'},
		authenticate: true,
		resolve: {
		    homepage: homepageResolver
		}
	});

/*	.state('edithomepage',{
		url: '/edit-homepage/:slug',
		controller: 'homepageEditCtrl',
		templateUrl: 'homepage/views/edit_homepage.html',
		data: {pageTitle: 'Update Homepage Detail'},
		authenticate: true,
		resolve: {
		    homepage: homepageResolver
		}
	})
	*/
}]);
