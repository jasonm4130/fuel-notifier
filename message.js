'use strict';

const config = require('./config');

const accountSid = config.ACCOUNT_SSID;
const authToken = config.AUTH_TOKEN;

const twilio = require('twilio')(accountSid, authToken);

let message = (message_body, message_numbers) => {
    Promise.all(
        message_numbers.map(number => {
            return twilio.messages.create({
                to: number,
                from: config.MY_NUMBER,
                body: message_body,
            });
        })
    )
    .then(messages => {
        console.log('Messages sent!');
    })
    .catch(err => console.error(err));
}

exports.message = message;