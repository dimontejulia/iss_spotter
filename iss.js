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

const fetchCoordsByIp = function (ip, callback) {
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

module.exports = { fetchCoordsByIp };
//module.exports = { fetchMyIP };
