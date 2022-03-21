const Twilio = require('twilio');
const config = require('./config');

const accountSid = config.ACCOUNT_SID;
const authToken = config.AUTH_TOKEN;

const client = new Twilio(accountSid, authToken);

const message = (messageBody, messageNumbers) => {
  Promise.all(
    messageNumbers.map((number) =>
      client.messages.create({
        to: number,
        from: config.MY_NUMBER,
        body: messageBody,
      })
    )
  )
    .then(() => {
      console.log('Messages sent!');
    })
    .catch((err) => console.error(err));
};

exports.message = message;
