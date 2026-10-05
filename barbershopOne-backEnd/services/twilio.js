/*
const twilio = require("twilio");
require("dotenv").config();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function validatePhoneNumber(phoneNumber, countryCode) {
    try {
        const result = await client.lookups.v2.phoneNumbers(phoneNumber).fetch({countryCode}); //no fields option = free lookup
        return {
            valid: result.valid,
            phoneNumber: result.phoneNumber,
            countryCode: result.countryCode,
            nationalFormat: result.nationalFormat
        };
    } catch (err) {
        console.error("Phone validation failed", err);
        return {valid: false};
    }
}
//validatePhoneNumber('+15551234567').then(console.log);

module.exports = { validatePhoneNumber };
*/