const { nextISSTimesForMyLocation } = require("./iss_promised");

const printPassTimes = function (passoverTimes) {
  for (const pass of passoverTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((returnedTimes) => {
    printPassTimes(returnedTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
