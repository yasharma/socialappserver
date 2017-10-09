'use strict';

mimicTrading.factory('cmsLinkSvr', ['RestSvr', (RestSvr) => {
    return {
        getCmsLinkById: (id) => RestSvr.get(`cmsLink/view/${id}`)
    };
}]);