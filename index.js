const fs = require('fs');

const schedule = require('node-schedule');
const _ = require('lodash');
const api = require('./request');
const sendMessage = require('./message');
const prices = require('./calc-fuel-price');
const config = require('./config/config.json');

// Store responses no JSON
const locationData = {};

/**
 * Function that generates the message to be sent
 * @param {*} fuelInfo
 * @returns
 */
function fuelMessage(fuelInfo) {
  const advise = prices.advise(
    fuelInfo.data.FairPrice.PriceFluctuation,
    fuelInfo.data.FairPrice.PriceIndicator
  );

  const trend = prices.trend(
    fuelInfo.data.FairPrice.PriceFluctuation,
    fuelInfo.data.FairPrice.PriceIndicator
  );

  return `The current advise is:
  ${advise}
  
  The current trend is:
  ${trend}
  
  Current average price is:
  ${fuelInfo.data.FairPrice.RoundedPrice}`;
}

function getFuelInfo(location) {
  // Get the data from the location
  const { lat, lng, numbers, fuelType } = location;

  api.fuelInfo(location).then((fuelInfoResponse) => {
    const currentFuelTrends = {
      priceFluctuation: fuelInfoResponse.data.FairPrice.PriceFluctuation,
      priceIndicator: fuelInfoResponse.data.FairPrice.PriceIndicator,
    };

    const fileName = `lat=${lat}&lng=${lng}&fueltype=${fuelType}`;

    let lastFuelPrice = null;

    if (locationData[fileName]) {
      lastFuelPrice = locationData[fileName];
    } else {
      locationData[fileName] = currentFuelTrends;
    }

    console.log(!_.isEqual(lastFuelPrice, currentFuelTrends));
    console.log(lastFuelPrice, currentFuelTrends);

    if (
      !_.isEqual(lastFuelPrice, currentFuelTrends) &&
      prices
        .advise(
          currentFuelTrends.priceFluctuation,
          currentFuelTrends.priceIndicator
        )
        .includes('good')
    ) {
      sendMessage.message(fuelMessage(fuelInfoResponse), numbers);

      locationData[fileName] = currentFuelTrends;
    }
  });
}

const j = schedule.scheduleJob('0 8 * * *', () => {
  config.LOCATIONS.forEach((location) => {
    getFuelInfo(location);

    console.log('fuel prices checked');
    console.log(locationData);
  });
});
