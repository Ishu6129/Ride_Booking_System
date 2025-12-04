const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const calculateFare = (distance, duration, baseFare, perKmCharge, perMinuteCharge, minFare) => {
  const distanceFare = distance * perKmCharge;
  const durationFare = (duration / 60) * perMinuteCharge; // duration in seconds, convert to minutes
  const totalFare = Math.max(baseFare + distanceFare + durationFare, minFare);
  
  return {
    baseFare,
    distanceFare: Math.round(distanceFare * 100) / 100,
    durationFare: Math.round(durationFare * 100) / 100,
    totalFare: Math.round(totalFare * 100) / 100
  };
};

const convertToGeoJSON = (latitude, longitude) => {
  return {
    type: 'Point',
    coordinates: [longitude, latitude]
  };
};

module.exports = {
  calculateDistance,
  calculateFare,
  convertToGeoJSON
};
