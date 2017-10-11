'use strict';

mimicTrading.factory('subscriptionSvr', ['RestSvr', (RestSvr) => {
    return {
        getSubscriptionById: (id) => RestSvr.get(`subscription/view/${id}`)
    };
}]);