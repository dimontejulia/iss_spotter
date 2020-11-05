/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require("request");

const fetchMyIP = function (callback) {
  const url = "https://api.ipify.org?format=json";

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(
        //creates a new Error object that we can pass around
        Error(`Status Code ${response.statusCode} when fetching IP: ${body}`),
        null
      );
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function (ip, callback) {
  const url = "http://ip-api.com/json/" + ip;
  //const url = "https://ipvigilante.com/json/invalidiphere";
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (!error && response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const parsedData = JSON.parse(body);
    const lat = parsedData.lat;
    const lon = parsedData.lon;
    callback(null, { lat, lon });
  });
};

const fetchISSFlyOverTimes = function ({ lat, lon }, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}1`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (!error && response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching flyover times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, JSON.parse(body).response);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
//module.exports = { fetchISSFlyOverTimes };
//module.exports = { fetchCoordsByIp };
//module.exports = { fetchMyIP };
