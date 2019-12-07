'use strict';

const fs = require('fs');

const api = require('./request');
const send_message = require('./message');
const prices = require('./calc-fuel-price');
const config = require('./config');

config.LOCATIONS.forEach(location => {

    getFuelInfo(location);

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
    
        let fileName = `lat=${lat}&lng=${lng}&fueltype=${fuelType}lastFuelPrice.json`;
    
        let lastFuelPrice = null;
    
        fs.open(fileName, 'r', function (err, fd) {
            if (err) {
                fs.writeFile(fileName, currentFuelTrends, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            } else {
                lastFuelPrice = JSON.parse(fs.readFileSync(fileName));
            }
        });
    
        if (lastFuelPrice !== currentFuelTrends) {
    
            send_message.message(fuel_message(fuel_info_response), message_numbers);
    
            fs.writeFileSync(fileName, JSON.stringify(currentFuelTrends));
    
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