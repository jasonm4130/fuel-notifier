const advise = (PriceFluctuation, priceIndicator) => {
  switch (priceIndicator) {
    case 0:
      return 'No fuel advice for your area.';
    case 1:
    case 3:
      return 'Prices are high, so wait if you can.';
    case 2:
      return PriceFluctuation === 2 || PriceFluctuation === 1
        ? 'Average price is good.'
        : 'Average price is good. Buy Now.';
    default:
  }
};

const trend = (priceFluctuation, priceIndicator) => {
  switch (priceFluctuation) {
    case 1:
      return priceIndicator === 2
        ? 'Lately, prices have been going up. Buy now.'
        : 'Lately, prices have been going up.';
    case 2:
      return priceIndicator === 2
        ? 'Lately, prices have been going down. Buy now.'
        : 'Lately, prices have been going down.';
    default:
  }
};

exports.trend = trend;
exports.advise = advise;
