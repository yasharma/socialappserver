'use strict';

mimicTrading.factory('paymentSvr', ['RestSvr', (RestSvr) => {
    return {
        getPaymentById: (id) => RestSvr.get(`payment/view/${id}`)
    };
}]);