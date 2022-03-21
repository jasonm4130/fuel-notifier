const axios = require('axios');

const fuelInfo = (location) => {
  const { lat, lng, fuelType } = location;

  const requestUrl = `https://www.racq.com.au/ajaxPages/fuelprice/FairFuelPricesapi.ashx?lat=${lat}&lng=${lng}&fueltype=${fuelType}`;

  return axios({
    method: 'get',
    url: requestUrl,
  }).then(
    (response) => response,
    (error) => error
  );
};

exports.fuelInfo = fuelInfo;
