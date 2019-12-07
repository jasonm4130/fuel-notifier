'use strict';

const axios = require('axios');

const fuel_info = (location) => {
    let lat = location.LAT;
    let lng = location.LNG;
    let fuelType = location.FUEL_TYPE;

    let requestUrl = `https://www.racq.com.au/ajaxPages/fuelprice/FairFuelPricesapi.ashx?lat=${lat}&lng=${lng}&fueltype=${fuelType}`;

    return axios({
        method: 'get',
        url: requestUrl,
    })
    .then((response) => {
        return (response);
    }, (error) => {
        return (error);
    });
}

exports.fuel_info = fuel_info;