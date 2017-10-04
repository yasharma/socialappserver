'use strict';

mimicTrading.factory('termsconditionsSvr', ['RestSvr', (RestSvr) => {
    return {
        getCmsById: (id) => RestSvr.get(`termsconditions/view/${id}`),
        getCmsTypes: () => ['about_us','privacy_policy','terms_conditions']
    };
}]);