const request = require("request-promise-native");

const fetchMyIP = function () {
  return request("https://api.ipify.org?format=json");
};

const fetchCoordsByIP = function (body) {
  const ip = JSON.parse(body).ip;
  return request("http://ip-api.com/json/" + ip);
};

const fetchISSFlyOverTimes = function (body) {
  const parsedData = JSON.parse(body);
  const lat = parsedData.lat;
  const lon = parsedData.lon;
  const url = `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}1`;
  return request(url);
};

const nextISSTimesForMyLocation = function (body) {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((body) => {
      const { response } = JSON.parse(body);
      return response;
    });
};
module.exports = { nextISSTimesForMyLocation };
