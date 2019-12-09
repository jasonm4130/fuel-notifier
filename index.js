'use strict';

const fs = require('fs');

const api = require('./request');
const send_message = require('./message');
const prices = require('./calc-fuel-price');
const config = require('./config');
const schedule = require('node-schedule');

// Store responses no JSON
let location_data = {};

let j = schedule.scheduleJob('*/5 * * * *', function(){
   
    config.LOCATIONS.forEach(location => {

        getFuelInfo(location);

        console.log('fuel prices checked');
        console.log(location_data);
    
    });

});

function getFuelInfo(location) {

    let message_numbers = location.NUMBERS;
    let lat = location.LAT;
    let lng = location.LNG;
    let fuelType = location.FUEL_TYPE;

    api.fuel_info(location).then((fuel_info_response) => {

        let currentFuelTrends = {
            'priceFluctuation': fuel_info_response.data.FairPrice.PriceFluctuation,
            'priceIndicator': fuel_info_response.data.FairPrice.PriceIndicator,
        }
    
        let fileName = `lat=${lat}&lng=${lng}&fueltype=${fuelType}`;
    
        let lastFuelPrice = null;
    
        if (location_data[fileName]) {
            lastFuelPrice = location_data[fileName];
        } else {
            location_data[fileName] = currentFuelTrends;
        }
    
        if (lastFuelPrice !== currentFuelTrends) {
    
            send_message.message(fuel_message(fuel_info_response), message_numbers);
    
            location_data[fileName] = currentFuelTrends;
    
        }
    
    });

}

function fuel_message(fuel_info) {
    let advise = prices.advise(fuel_info.data.FairPrice.PriceFluctuation, fuel_info.data.FairPrice.PriceIndicator);

    let trend = prices.trend(fuel_info.data.FairPrice.PriceFluctuation, fuel_info.data.FairPrice.PriceIndicator);

    return `The current advise is:
${advise}

The current trend is:
${trend}

Current average price is:
${fuel_info.data.FairPrice.RoundedPrice}`;
}