"use strict";

const nodemailer    = require('nodemailer'),
    path            = require('path'),
    config          = require(require(path.resolve('./core/env')).getEnv);

const {countryCode, number, accountSid, authToken} = config.twilio, // Your Account SID & Token from www.twilio.com/console
    client = require('twilio')(accountSid, authToken);

module.exports = {
    sms: (body,to) => {
        return new Promise((resolve, reject) => {
            client.messages.create({
                body: body,
                to: `${countryCode}${to}`,  // Text this number
                from: number // From a valid Twilio number
            })
            .then(message => resolve(message.sid))
            .catch(error => reject(error));
        });    
    },
    isValidNumber : (number) => {
        return new Promise((resolve, reject) => {
            client.lookups.v1.phoneNumbers(number)
            .fetch()
            .then(response => resolve(true))
            .catch(error => reject(false));    
        });
    }
}; 