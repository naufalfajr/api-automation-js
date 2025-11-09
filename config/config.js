require('dotenv').config();

module.exports = {
  baseURL: process.env.API_BASE_URL,
  apiKey: process.env.API_KEY,
  timeout: parseInt(process.env.TIMEOUT) || 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};