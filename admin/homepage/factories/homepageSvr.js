'use strict';

mimicTrading.factory('homepageSvr', ['RestSvr', (RestSvr) => {
    return {
        getHomepageData: () => RestSvr.get(`homepage/view`),
        removeBannerImage: (_id) => RestSvr.delete(`homepage/remove_banner/${_id}`)
    };
}]);