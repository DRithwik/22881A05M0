const axios = require("axios");
const LOGGING_SERVER_URL = process.env.LOGGING_SERVER_URL || "http://20.244.56.144/evaluation-service/logs";

async function Log(stack, level, pkg, message) {
  const logData = {
    stack,
    level,
    package: pkg,
    message
  };

  try {
    const response = await axios.post(LOGGING_SERVER_URL, logData);
    console.log("Log sent:", response.status);
  } catch (error) {
    console.error("Failed to send log:", error.message);
  }
}

module.exports = Log;
