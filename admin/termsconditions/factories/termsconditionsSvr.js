'use strict';

mimicTrading.factory('termsconditionsSvr', ['RestSvr', (RestSvr) => {
    return {
        getTermsConditionsById: (id) => RestSvr.get(`termsconditions/view/${id}`),
        getTermsConditionsTypes: () => ['about_us','privacy_policy','terms_conditions']
    };
}]);